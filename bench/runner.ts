import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// Tipos para estruturar o JSON
type BenchResult = Record<string, unknown>;

// Função auxiliar para rodar comandos shell e capturar saída
function sh(cmd: string, args: string[]) {
    const r = spawnSync(cmd, args, { encoding: "utf-8" });
    if (r.status !== 0) {
        return "";
    }
    return (r.stdout ?? "").trim();
}

// Tenta fazer o parse da última linha JSON válida do output
function safeJsonLineParse(s: string): any | null {
    const lines = s.split("\n").map(l => l.trim()).filter(Boolean);
    // Procura de trás pra frente por algo que pareça JSON
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        if (line.startsWith("{") && line.endsWith("}")) {
            try { return JSON.parse(line); } catch { }
        }
    }
    return null;
}

const matmulBin = process.argv[2] ?? path.join("hard-matmul", "matmul_bench.exe");
const outDir = process.argv[3] ?? "out";

// Garante diretório de saída
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// Coleta informações do ambiente (Provenance)
const gitCommit = sh("git", ["rev-parse", "HEAD"]) || "git-not-found";
const startedAt = new Date().toISOString();

console.log(`[Bench] Iniciando execução do binário: ${matmulBin}`);

// Executa o benchmark
let stdout = "";
let stderr = "";

// Verifica se existe binário
const binExists = fs.existsSync(matmulBin) || fs.existsSync(matmulBin + ".exe");
const allowMock = process.env.ALLOW_MOCK === "1";

if (!binExists) {
    if (!allowMock) {
        console.error("⛔ [Bench] ERRO CRÍTICO: Binário C++ não encontrado.");
        console.error("   O Hard Track exige execução real.");
        console.error("   Para testar com simulação (apenas dev), use: ALLOW_MOCK=1 npm run bench");
        console.error(`   Caminho esperado: ${matmulBin}`);
        process.exit(1);
    }

    console.warn("⚠️ [Bench] AVISO: Binário não encontrado. Usando MOCK (ALLOW_MOCK=1).");
    console.warn("   ISTO NÃO É VÁLIDO PARA SUBMISSÃO FINAL DO HARD TRACK.");

    // Simulação do output JSON que o C++ geraria
    const mockOutput = {
        M: 16,
        N: 16,
        K: 50240,
        dtype: "bf16-mock",
        iters: 10,
        latency_ms_avg: 12.5,
        throughput_tflops: 0,
        output_hash: "mock-js-hash-12345",
        config_name: "js_fallback_simulation",
        correctness_ok: true
    };
    stdout = JSON.stringify(mockOutput);
} else {
    // Execução real do binário
    console.log(`🚀 [Bench] Executando binário real: ${matmulBin}`);

    const execPath = fs.existsSync(matmulBin) ? matmulBin : matmulBin + ".exe";
    const r = spawnSync(execPath, [], { encoding: "utf-8" });
    stdout = r.stdout ?? "";
    stderr = r.stderr ?? "";

    if (r.status !== 0) {
        console.error(`[Bench] Falha na execução: ${stderr || stdout}`);
        process.exit(1);
    }
}

// Parse do resultado
const benchJson = safeJsonLineParse(stdout);
if (!benchJson) {
    console.error("[Bench] ERRO: Não foi possível encontrar JSON válido na saída do binário.");
    console.log("Raw Output:", stdout);
    process.exit(1);
}

console.log("[Bench] Sucesso! Métricas capturadas.");

// Hashes de integridade
const stdoutSha256 = createHash("sha256").update(stdout).digest("hex");

// Identifica contexto
const execPath = binExists ? (fs.existsSync(matmulBin) ? matmulBin : matmulBin + ".exe") : "mock";
const binHash = binExists ? createHash("sha256").update(fs.readFileSync(execPath)).digest("hex") : null;

// Monta o Provenance Record
const provenance = {
    meta: {
        project: "Amadeus Genesis Hackathon",
        track: "Hard + Soft",
        team: "UsuarioAleatorio00003"
    },
    timestamp: startedAt,
    git_commit: gitCommit,
    execution: {
        implementation: binExists ? "native-cpp" : "mock-js",
        binary_path: binExists ? execPath : null,
        binary_sha256: binHash,
        mock_mode: !binExists
    },
    environment: {
        platform: process.platform,
        arch: process.arch,
        node_version: process.version,
    },
    benchmark_result: benchJson,
    artifacts: {
        stdout_sha256: stdoutSha256,
        stdout_filename: "stdout.log"
    }
};

const stdoutPath = path.join(outDir, "stdout.log");
const provPath = path.join(outDir, "provenance.json");

fs.writeFileSync(stdoutPath, stdout, "utf-8");
fs.writeFileSync(provPath, JSON.stringify(provenance, null, 2), "utf-8");

console.log(`[Bench] Artefatos gerados:`);
console.log(`  -> ${provPath}`);
console.log(`  -> ${stdoutPath}`);
