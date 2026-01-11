# VeriMatrix: Computação Confiável para Agentes de IA & DeFi
> **Submissão Amadeus Genesis Hackathon** (Hard & Soft Tracks + Bônus)

## 📖 A Visão (Soft Track)

**O Problema**: Agentes Autônomos e protocolos DeFi dependem cada vez mais de computação complexa off-chain (análise de risco, inferência de ML, otimização de rotas). No entanto, executar isso on-chain é inviável, e off-chain é opaco. Se um agente autônomo toma uma decisão baseada em um modelo de "caixa preta", como confiar que o resultado não foi manipulado?

**A Solução**: **VeriMatrix**. Uma camada padronizada de "Compute Provenance" (Proveniência de Computação). Nós unimos a força bruta do **Amadeus uPoW** (Hard Track) para o processamento pesado (MatMul), verificamos a correção matemática com **Provas de Conhecimento Zero** (zkVerify) e gravamos o histórico imutável na **Arweave**.

**Por que Amadeus?**
A finalidade determinística de 0.5s da Layer 1 da Amadeus e seu runtime WASM formam a camada de orquestração perfeita para esse pipeline de alta velocidade, permitindo que agentes reajam em tempo real com segurança criptográfica.

### Arquitetura do Sistema
1.  **Requisição**: dApp/Agente solicita um workload matricial (ex: Análise de Risco de Portfólio).
2.  **Execução uPoW**: Mineradores Blackhole executam o kernel otimizado de MatMul (Hard Track).
3.  **Verificação ZK**: Uma prova (Freivalds/Groth16) atesta a correção do cálculo sem refazer a conta pesada via zkVerify.
4.  **Proveniência**: O registro completo (Hash de Entrada + Saída + Prova) é salvo permanentemente na Arweave.
5.  **Finalidade**: Validadores da Amadeus L1 checam a prova e autorizam a ação do agente.

---

## 🛠️ Hard Track: O Motor (Amadeus uPoW)

Este repositório contém a implementação otimizada do kernel para o chip **Tenstorrent Blackhole p150a**.

*   **Alvo**: Blackhole p150a (140 Cores Tensix).
*   **Workload**: Multiplicação de Matrizes com K Grande (16x50240 * 50240x16), típica de reduções em inferência de LLMs (como Llama 3).
*   **Estratégia**:
    *   **Paralelismo de Dados**: Distribuição da dimensão massiva `K` entre os 140 cores.
    *   **Double Buffering**: Uso de Buffers Circulares (CBs) para sobrepor a movimentação de dados (DRAM->L1) com o cálculo.
    *   **Tiling**: Formato nativo de tiles 32x32 para utilização máxima das unidades Tensix.

---

## 🚀 Quickstart (Como Rodar)

### Pré-requisitos
*   Node.js v20+
*   Compilador C++ (Clang++ ou G++)
*   (Opcional) Toolchain Tenstorrent TT-Metal para compilação Device.

### 1. Instalação
```bash
npm install
# Configure o ambiente (opcional para mock, obrigatório para bônus reais)
cp .env.example .env
```

### 2. Compilação
```bash
cd hard-matmul
# Compilar Referência CPU (Modelo Funcional)
make cpu
# OU Compilar Kernel de Dispositivo (Requer ambiente TT-Metal)
# make device
cd ..
```

### 3. Rodar Pipeline
```bash
# Roda Benchmark -> Gera Proveniência -> (Opcional) Upload para Arweave/zkVerify
npm run pipeline
```

> **Nota**: Se você não possui o hardware Blackhole, o pipeline utilizará automaticamente a referência compilada da CPU (`native-cpu-ref`) para demonstrar o fluxo completo.

---

## 🗺️ Roadmap Detalhado (Tarefas Restantes)

Checklist oficial da equipe para a entrega final (15 de Janeiro):

### Hard Track (Prioridade 1)
*   [ ] **Refinar `hard-matmul/matmul_tt_metal.cpp`**: Garantir que a lógica reflita os padrões reais do TT-Metalium (Kernels de Reader/Compute/Writer, uso de CBs).
*   [ ] **Lógica de Tiling**: Tratar explicitamente o padding de 16->32 se não for gerido pelo reader local.

### Soft Track
*   [ ] **Vídeo Demo**: Gravar um vídeo de 120s mostrando a execução do `npm run pipeline` e explicando o conceito VeriMatrix.
*   [ ] **Polimento do Deck**: Garantir que os slides cobrem "Oportunidade de Mercado" e "Por que Amadeus" com clareza.

### Bônus (Integração)
*   [ ] **Arweave**: Testar `bonus-arweave/upload.ts` com uma chave privada real (com fundos) para validar o upload no Irys.
*   [ ] **zkVerify**: Gerar uma prova Groth16 real (mesmo que para um circuito pequeno) e habilitar a lógica no `submit.ts`.

### Submissão
*   [ ] **Limpeza**: Remover `node_modules` e `out/` do zip final.
*   [ ] **Release**: Criar uma Release no GitHub `v1.0-submission`.

---

## 📂 Estrutura do Repositório
*   **/hard-matmul**: Kernels C++ (Referência CPU + Implementação Device).
*   **/bench**: Runner TypeScript para orquestração e geração de proveniência.
*   **/soft-ideathon**: Pitch Deck (`deck.md`), Diagramas de Arquitetura (`architecture.mmd`).
*   **/bonus-arweave**: Scripts para armazenamento imutável na Arweave.
*   **/bonus-zkverify**: Scripts para atestado ZK na zkVerify.

---

**Licença**: MIT
**Time**: UsuarioAleatorio00003
