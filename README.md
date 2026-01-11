# VeriMatrix: Trusted Compute for AI Agents & DeFi
> **Amadeus Genesis Hackathon Submission** (Hard & Soft Tracks + Bonuses)

## 📖 The Vision (Soft Track)

**The Problem**: AI Agents and DeFi protocols are increasingly relying on complex off-chain computations (risk assessment, inference, optimization). However, executing these workloads on-chain is prohibitively expensive, while off-chain execution is opaque and untrusted. If an autonomous agent relies on a "black box" risk model, how can users trust it hasn't been tampered with?

**The Solution**: **VeriMatrix**. A standardized layer for "Compute Provenance". We leverage the raw power of **Amadeus uPoW** (Hard Track) for heavy lifting (Matrix Multiplication), verify the correctness with **Zero-Knowledge Proofs** (zkVerify), and store the immutable record on **Arweave**.

**Why Amadeus?**
The 0.5s deterministic finality of the Amadeus L1 and its WASM runtime are the perfect orchestration layer for this high-speed, verifiable compute pipeline.

### Architecture
1.  **Request**: dApp/Agent requests a matrix workload (e.g., Portfolio Risk Analysis).
2.  **uPoW Execution**: Blackhole Miners execute the optimized MatMul kernel (Hard Track).
3.  **ZK Verification**: A proof (Freivalds/Groth16) attests correctness without re-running the heavy compute.
4.  **Provenance**: Input Hash, Output, and Proof are stored permanently on Arweave.
5.  **Finality**: Amadeus L1 validators check the proof and trigger the agent's action.

---

## 🛠️ Hard Track: The Engine (Amadeus uPoW)

This repository contains the optimized kernel implementation for the **Tenstorrent Blackhole p150a**.

*   **Target**: Blackhole p150a (140 Tensix Cores).
*   **Workload**: Large-K Matrix Multiplication (16x50240 * 50240x16), typical for Llama-style inference reductions.
*   **Strategy**:
    *   **Data Parallelism**: Splitting the large `K` dimension across 140 cores.
    *   **Double Buffering**: Using Circular Buffers (CBs) to overlap data movement (DRAM->L1) with Compute.
    *   **Tiling**: 32x32 native tile format for maximum Tensix utilization.

---

## 🚀 Quickstart (How to Run)

### Prerequisites
*   Node.js v20+
*   C++ Compiler (Clang++ or G++ with C++17 support)
*   (Optional) Tenstorrent TT-Metal Toolchain for Device compilation.

### 1. Setup
```bash
npm install
# Configure environment (optional for mock, required for bonuses)
cp .env.example .env
```

### 2. Build
```bash
cd hard-matmul
# Build CPU Reference (Functionally equivalent model)
make cpu
# OR Build Device Kernel (Requires TT-Metal environment)
# make device
cd ..
```

### 3. Run Pipeline
```bash
# Runs Benchmark -> Generates Provenance -> (Optional) Uploads to Arweave/zkVerify
npm run pipeline
```

> **Note**: If you lack the hardware, the pipeline will seamlessly use the compiled CPU reference (`native-cpu-ref`) to demonstrate the flow.

---

## �️ Detailed Roadmap (Remaining Tasks)

For the team working on this repo, here is the exact checklist for the final submission (Jan 15th):

### Hard Track (Priority 1)
*   [ ] **Refine `hard-matmul/matmul_tt_metal.cpp`**: Ensure logic reflects true TT-Metalium patterns (Reader/Compute/Writer kernels, CB usage).
*   [ ] **Tiling Logic**: Handle 16->32 padding explicitely if not handled by the localized reader.

### Soft Track
*   [ ] **Video Demo**: Record a 120s video showing the `npm run pipeline` execution and explaining the VeriMatrix concept.
*   [ ] **Deck Polish**: Ensure slides cover "Market Opportunity" and "Why Amadeus" clearly.

### Bonuses (Integration)
*   [ ] **Arweave**: Test `bonus-arweave/upload.ts` with a real funded private key to ensure Irys upload works.
*   [ ] **zkVerify**: Generate a real Groth16 proof (even for a small circuit) and enable the `submit.ts` logic.

### Submission
*   [ ] **Cleanup**: Remove `node_modules` and `out/` from the final zip.
*   [ ] **Release**: Create a GitHub Release `v1.0-submission`.

---

## 📂 Repository Structure
*   **/hard-matmul**: C++ Kernels (CPU Reference + Device Implementation).
*   **/bench**: TypeScript Runner for orchestration and provenance generation.
*   **/soft-ideathon**: Project Pitch Deck (`deck.md`), Architecture diagrams (`architecture.mmd`).
*   **/bonus-arweave**: Scripts for immutable storage on Arweave.
*   **/bonus-zkverify**: Scripts for ZK attestation on zkVerify.

---

**License**: MIT
**Team**: UsuarioAleatorio00003
