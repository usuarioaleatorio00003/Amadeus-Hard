# VeriMatrix: Atestados de Matrizes uPoW para Agentes e DeFi

## 1. O Problema
Agentes de IA e protocolos DeFi dependem cada vez mais de computação complexa (inferência, avaliação de risco), mas executá-la on-chain é caro e lento, e off-chain é opaco. Como confiar que um agente autônomo rodou o modelo correto de risco antes de mover liquidez?

## 2. A Solução
**VeriMatrix**: Uma camada de "Compute Provenance" que usa o poder de mineração uPoW da Amadeus para computação útil (MatMul), verificada por provas Zero-Knowledge e registrada permanentemente na Arweave.

## 3. Arquitetura do Sistema
1.  **Request**: dApp/Agente solicita computação matricial (ex: Risco de Portfólio).
2.  **uPoW Execution**: Mineradores Blackhole (Hard Track) executam a MatMul otimizada.
3.  **Verificação ZK**: Uma prova (Freivalds/Groth16) atesta a correção do cálculo (zkVerify).
4.  **Provenance**: O registro completo (Input Hash + Output + Prova) é salvo na Arweave.
5.  **Finalidade**: O Amadeus L1 (WASM) valida o registro e dispara a ação do agente.

## 4. Por que Amadeus?
A finalidade determinística de 0.5s da Amadeus e o runtime WASM são ideais para orquestrar esse fluxo de alta velocidade que seria impossível em chains convencionais.

## 5. Demonstração (Hackathon MVP)
Nosso MVP automatiza o ciclo completo:
*   Benchmark de MatMul em hardware simulado/real.
*   Geração instantânea de um "Provenance Record" em JSON.
*   Upload para Arweave (via Irys) garantindo imutabilidade.
*   Integração com zkVerify para atestado público.

## 6. Roadmap
*   **Q1 2026**: Suporte a inferência completa de LLMs (Llama 3 quantizado) via uPoW.
*   **Q2 2026**: Marketplace de Agentes Verificados na mainnet Amadeus.

---

# Roteiro do Vídeo (90-120s)

*   **[0:00-0:20] Intro**: O problema da "Caixa Preta" na IA autônoma. Se o agente mente, você perde dinheiro.
*   **[0:20-0:50] Solução**: Apresentando VeriMatrix. Unindo a força bruta do Blackhole (Amadeus uPoW) com a certeza matemática do ZK e a memória eterna da Arweave.
*   **[0:50-1:10] Demo Técnica**:
    *   Mostrar terminal rodando `npm run pipeline`.
    *   Mostrar MatMul finalizando.
    *   Mostrar link do Irys (Arweave) abrindo no navegador.
    *   Mostrar Explorer do zkVerify.
*   **[1:10-1:30] Conclusão**: Isso habilita uma nova classe de Agentes DeFi auditáveis. Construído para o Amadeus Genesis Hackathon.
