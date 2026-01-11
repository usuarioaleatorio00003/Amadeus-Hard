# 🗺️ Roadmap Detalhado: Reta Final Amadeus Hackathon

Este documento detalha **EXATAMENTE** o que ainda precisa ser feito para uma entrega vencedora até o dia 15/01.

---

## 📅 Visão Geral e Prazos

*   **Hoje (11/01)**: Infraestrutura pronta, Hard Track (CPU) rodando.
*   **Meta 12/01**: Hard Track (Device) implementado teoricamente e Soft Track (Core) definido.
*   **Meta 13/01**: Bônus (zkVerify/Arweave) integrados com chaves reais (ou mocks perfeitos) e Gravação do Vídeo.
*   **Meta 14/01**: Testes finais, geração de "Artifacts" bonitos e Upload.
*   **Meta 15/01**: Submissão final e descanso.

---

## 1. 🏎️ Hard Track: O Coração (Tenstorrent Blackhole)

Atualmente temos um `stub` (esqueleto) em `hard-matmul/matmul_tt_metal.cpp`. Precisamos preenchê-lo com lógica **real** do SDK `tt-metal`, mesmo que não possamos rodar localmente sem o hardware. O código precisa parecer e compilar como código Tenstorrent válido.

### 📋 Tarefas Técnicas:
1.  **Definir Layout de Memória**:
    *   [ ] Especificar como as matrizes 16x50240 (A) e 50240x16 (B) serão divididas nos 140 cores Tensix.
    *   *Sugestão*: Usar **Data Parallelism** na dimensão K (50240). Cada core pega um pedaço de K e computa um resultado parcial 16x16.
2.  **Implementar Kernels (Reader/Compute/Writer)**:
    *   [ ] Escrever lógica de `Reader` que move dados da DRAM para L1 (Circular Buffer).
    *   [ ] Escrever lógica de `Compute` que usa as instruções `matmul_tiles` do Tensix.
    *   [ ] Escrever lógica de `Writer` que move o resultado de volta para DRAM.
3.  **Tiling & Data Formats**:
    *   [ ] Garantir que o código lide explicitamente com tiles de 32x32 (padrão TT-Metal), usando padding se necessário (16 -> 32).
4.  **Double Buffering**:
    *   [ ] Implementar lógica de semáforos/CBs para que o `Reader` carregue o próximo tile enquanto o `Compute` processa o atual.

> **Objetivo**: Ter um arquivo `matmul_tt_metal.cpp` que um engenheiro da Tenstorrent olhe e diga "Sim, essa lógica faz sentido para o Blackhole".

---

## 2. 🧠 Soft Track: A Venda ("VeriMatrix")

Temos o conceito (`deck.md`), mas falta "materializar" a venda.

### 📋 Tarefas de Conteúdo:
1.  **Refinar o Deck**:
    *   [ ] Adicionar slide de "Market Opportunity": Quem paga por essa verificação? (Ex: Fundos DeFi, Agentes Autônomos).
    *   [ ] Adicionar slide de "Why Amadeus?": Falar especificamente de uPoW e Finalidade Rápida.
2.  **Roteiro do Vídeo (Script)**:
    *   [ ] Escrever roteiro de 120 segundos.
    *   *Estrutura*: 
        *   0-20s: Problema (IA não verificável é perigosa).
        *   20-60s: Solução (VeriMatrix usando Amadeus Hard Track).
        *   60-90s: Demo Técnica (Mostrar o terminal rodando `npm run pipeline` e gerando o JSON).
        *   90-120s: Futuro/Roadmap e Pedido.
3.  **Gravação**:
    *   [ ] Gravar a tela rodando o benchmark.
    *   [ ] Gravar voz sobre os slides.

---

## 3. 🎁 Bônus: Os Pontos Extras

### 🔗 Arweave (Irys)
O script está pronto (`bonus-arweave/upload.ts`), mas falta testar "de verdade".
*   [ ] **Carteira**: Obter uma Private Key (EVM/Ethereum) com uns trocados de ETH/Matic/etc para pagar o upload no Irys (custa centavos).
*   [ ] **Teste Real**: Setar `UPLOAD_ARWEAVE=1` e `PRIVATE_KEY=...` no `.env` e rodar. Verificar se o link gerado abre no navegador.

### 🔐 zkVerify
Temos o script de submissão (`submit.ts`), mas falta a **prova**.
*   [ ] **Gerar Circuito (Circom)**: Criar um circuito simples (`freivalds.circom` ou até mais simples, como `a*b=c` escalar) só para ter *alguma* prova ZK válida.
*   [ ] **Gerar `proof.json` e `public.json`**: Usar `snarkjs` para gerar esses arquivos com base no circuito acima.
*   [ ] **Integrar**: Colocar esses arquivos na pasta `data/` e descomentar a lógica no `submit.ts` para enviar para a Testnet Volta.

---

## 4. 📦 Submissão Final

1.  **Limpeza**: Garantir que não tem lixo (`node_modules`, `out`) no zip final.
2.  **README Final**: Atualizar com link do Vídeo (YouTube/Loom) e do Pitch Deck (PDF/Link).
3.  **EnvVars**: Garantir que o repo público tem um `.env.example` perfeito.
4.  **Tag**: Criar uma Release no GitHub `v1.0-submission`.

---

## 🚀 Próximo Passo Imediato (Sugestão do Agente)

Focar no **Item 1 (Hard Track Code)**. Eu (Agente) posso escrever um rascunho avançado do código `tt-metal` baseado na documentação pública, para você ter algo concreto no arquivo `.cpp`.

Quer que eu comece a preencher o `hard-matmul/matmul_tt_metal.cpp` com lógica real de kernels?
