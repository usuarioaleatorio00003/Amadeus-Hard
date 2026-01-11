import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { zkVerifySession, Library, CurveType, ZkVerifyEvents } from "zkverifyjs";

const outDir = process.argv[2] ?? "out";

async function main() {
    if (process.env.SUBMIT_ZKVERIFY !== "1") {
        console.log("[zkVerify] Submissão desabilitada (SUBMIT_ZKVERIFY != 1). Pulando.");
        return;
    }

    if (!process.env.SEED_PHRASE) {
        console.error("[zkVerify] SEED_PHRASE ausente no .env.");
        process.exit(1);
    }

    // Verifica se os artefatos de prova existem (simulados ou reais)
    // Para o MVP, vamos checar se existem arquivos placeholder ou se falhamos com elegância
    const proofPath = path.join("bonus-zkverify", "data", "proof.json");
    if (!fs.existsSync(proofPath)) {
        console.warn("[zkVerify] AVISO: data/proof.json não encontrado. Gerando prova dummy ou abortando?");
        console.log("[zkVerify] (Mock) Pulando envio real por falta de prova gerada.");
        return;
    }

    console.log("[zkVerify] Iniciando sessão na rede Volta...");
    // Lógica real de submissão (comentada até ter prova real)
    /*
    const session = await zkVerifySession.start().Volta().withAccount(process.env.SEED_PHRASE);
    const { events } = await session.verify()
        .groth16({ library: Library.snarkjs, curve: CurveType.bn128 })
        .execute({ 
            proofData: {
                vk: JSON.parse(fs.readFileSync('bonus-zkverify/data/vkey.json', 'utf-8')),
                proof: JSON.parse(fs.readFileSync('bonus-zkverify/data/proof.json', 'utf-8')),
                publicSignals: JSON.parse(fs.readFileSync('bonus-zkverify/data/public.json', 'utf-8'))
            },
            domainId: Number(process.env.ZKVERIFY_DOMAIN_ID || 0)
        });
    */

    console.log("✅ [zkVerify] Prova enviada (Mock -> Implementação real pendente de arquivos Groth16).");
}

main().catch(err => {
    console.error("[zkVerify] Erro fatal:", err);
    process.exit(1);
});
