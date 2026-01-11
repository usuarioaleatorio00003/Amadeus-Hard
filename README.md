# Amadeus Genesis Hackathon - Solução Integrada

Este repositório contém a solução completa para o Hackathon Amadeus Genesis, cobrindo as trilhas **Hard (Otimização MatMul)** e **Soft (Ideathon)**, além dos bônus integrados para **Arweave** e **zkVerify**.

## 🚀 Começo Rápido (Quickstart)

Para rodar todo o pipeline (benchmark -> provenance -> upload opcional -> prova opcional):

1.  **Instalar dependências**:
    ```bash
    npm install
    # (Opcional) Copie e configure o .env se quiser testar os bônus reais
    cp .env.example .env
    ```

2.  **Compilar o Hard Track** (Simulação Local):
    ```bash
    cd hard-matmul
    # Se tiver g++ ou clang instalado (Windows com MinGW ou WSL/Linux)
    make
    # OU apenas rode o script de bench que utilizará o mock se o binário não existir
    cd ..
    ```

3.  **Executar o Pipeline**:
    ```bash
    npm run pipeline
    ```
    Isso irá:
    *   Rodar o benchmark de MatMul (simulado ou real).
    *   Gerar o arquivo de `provenance.json` em `out/`.
    *   (Se configurado) Fazer upload para Arweave via Irys.
    *   (Se configurado) Enviar prova para zkVerify.

## 🚀 Como Rodar

### Modo Padrão (HARD TRACK REAL)
O comando padrão assume que o binário compilado existe (execução real).
```bash
npm run pipeline
# ou explicitamente
npm run pipeline:real
```

### Modo Simulação (Desenvolvimento Local)
Para testar o fluxo em máquinas sem compilador/hardware, use o modo mock:
```bash
npm run pipeline:mock
```

> **Atenção**: Resultados oficiais devem ser gerados via `pipeline:real`. O arquivo `out/provenance.json` indicará `implementation: "native-cpp"` para execuções válidas.

## 📂 Estrutura do Projeto
- **`/hard-matmul`**: Código C++ otimizado para o Hard Track.
- **`/bench`**: Runner TypeScript para execução e auditoria.
- **`/bonus-arweave`**: Upload de resultados para o Arweave.
- **`/bonus-zkverify`**: Submissão de provas para zkVerify.
- **`/soft-ideathon`**: Pitch deck e materiais visuais.

## ✅ Funcionalidades

### Hard Track (MatMul)
*   Baseline em C++ compatível com TT-Metal.
*   Suporte a Tiling 32x32 e Double Buffering.
*   Saída JSON padronizada para fácil parsing.

### Soft Track (Ideathon)
*   Conceito: **VeriMatrix** - Atestado de Matrizes uPoW para Agentes e DeFi.
*   Arquitetura documentada com Mermaid.js.

### Bônus
*   **Arweave**: Armazenamento imutável dos resultados de benchmark.
*   **zkVerify**: Verificação de computação off-chain via provas ZK (Groth16/Freivalds).

## 🔒 Segurança

*   Nenhuma chave privada é armazenada no código.
*   Configuração via variáveis de ambiente (`.env`).
*   Verificação de integridade (SHA256) em todos os passos.
