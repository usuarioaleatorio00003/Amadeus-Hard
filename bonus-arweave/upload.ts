import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { Uploader } from "@irys/upload";
import { Ethereum } from "@irys/upload-ethereum";

const outDir = process.argv[2] ?? "out";
const file = path.join(outDir, "provenance.json");

async function main() {
    // Verifica flag de habilitação
    if (process.env.UPLOAD_ARWEAVE !== "1") {
        console.log("[Arweave] Upload desabilitado (UPLOAD_ARWEAVE != 1). Pulando.");
        return;
    }

    if (!process.env.PRIVATE_KEY) {
        console.error("[Arweave] ERRO: PRIVATE_KEY não definida no .env, mas upload está habilitado.");
        process.exit(1);
    }

    if (!fs.existsSync(file)) {
        console.error(`[Arweave] Arquivo não encontrado: ${file}`);
        process.exit(1);
    }

    console.log("[Arweave] Iniciando upload para Irys...");

    try {
        const irys = await Uploader(Ethereum).withWallet(process.env.PRIVATE_KEY);

        // Opcional: configurar rede se necessário, default costuma ser mainnet ou devnet conforme URL
        // Para hackathon, verificar se devnet é aceito ou se precisa mainnet barato (Polygon/Arbitrum suportados pelo Irys?)
        // O código usa Ethereum mainnet por padrão no construtor Ethereum, mas o Irys permite devnet.
        // Ajuste fino depende da doc do Irys para a rede específica.

        const data = fs.readFileSync(file, "utf-8");
        const tags = [
            { name: "Content-Type", value: "application/json" },
            { name: "App-Name", value: "Amadeus-Genesis-Hack" },
            { name: "Type", value: "Provenance-Record" },
            { name: "Version", value: "1.0.0" }
        ];

        const receipt = await irys.upload(data, { tags });

        console.log("✅ [Arweave] Upload concluído!");
        console.log(`   Tx ID: ${receipt.id}`);
        console.log(`   Gateway: https://gateway.irys.xyz/${receipt.id}`);

        // Salva recibo
        fs.writeFileSync(path.join(outDir, "arweave_receipt.json"), JSON.stringify(receipt, null, 2));

    } catch (e) {
        console.error("[Arweave] Erro durante o upload:", e);
        process.exit(1);
    }
}

main();
