#include <iostream>
#include <vector>
#include <chrono>
#include <iomanip>
#include <random>
#include <string>
#include <cstring>

// Definições padrão para o Hackathon
// Target: M=16, N=16, K=50240
// Estamos simulando a execução ou preparando para TT-Metal

struct BenchResult {
    int M, N, K;
    std::string dtype;
    int iters;
    double latency_ms_avg;
    double throughput_tflops;
    std::string output_hash;
    std::string config_name;
    bool correctness_ok;
};

// Função simples para hash (apenas para exemplo de determinismo)
std::string compute_hash(const std::vector<float>& data) {
    size_t hash = 0;
    for (float v : data) {
        // Hash simples para combinar bits
        size_t h = std::hash<float>{}(v);
        hash ^= (h << 1); 
    }
    return std::to_string(hash);
}

void print_json(const BenchResult& r) {
    std::cout << "{"
              << "\"M\":" << r.M << ","
              << "\"N\":" << r.N << ","
              << "\"K\":" << r.K << ","
              << "\"dtype\":\"" << r.dtype << "\","
              << "\"iters\":" << r.iters << ","
              << "\"latency_ms_avg\":" << r.latency_ms_avg << ","
              << "\"output_hash\":\"" << r.output_hash << "\","
              << "\"correctness_ok\":" << (r.correctness_ok ? "true" : "false") << ","
              << "\"config_name\":\"" << r.config_name << "\""
              << "}" << std::endl;
}

int main(int argc, char** argv) {
    // Valores padrão do desafio
    int M = 16;
    int N = 16;
    int K = 50240;
    int iters = 10;
    bool simulation_mode = true; // Por padrão simulação local se não estiver no device

    // Parsing simplificado de argumentos (em C++ real usar biblioteca de args)
    for (int i = 1; i < argc; ++i) {
        if (std::strcmp(argv[i], "--iters") == 0 && i + 1 < argc) iters = std::atoi(argv[++i]);
        if (std::strcmp(argv[i], "--K") == 0 && i + 1 < argc) K = std::atoi(argv[++i]);
        // Adicionar outros parsers conforme necessário
    }

    // Setup do Benchmark
    // Em produção TT-Metal, aqui inicializariamos o device, criaríamos buffers DRAM/SRAM, etc.
    
    // Simulação do Workload (CPU Naive implementation)
    // Inicializa dados aleatórios deterministicamente
    std::mt19937 gen(42); 
    std::uniform_real_distribution<> dis(-1.0, 1.0);
    
    std::vector<float> A(M * K);
    std::vector<float> B(K * N);
    std::vector<float> C(M * N, 0.0f);

    for(auto& v : A) v = dis(gen);
    for(auto& v : B) v = dis(gen);

    auto start = std::chrono::high_resolution_clock::now();

    for (int iter = 0; iter < iters; ++iter) {
        // Reset output a cada iteração para medir custo real do compute
        std::fill(C.begin(), C.end(), 0.0f);
        
        // Naive MatMul: C = A * B
        for (int m = 0; m < M; ++m) {
            for (int n = 0; n < N; ++n) {
                float sum = 0.0f;
                for (int k = 0; k < K; ++k) {
                    sum += A[m * K + k] * B[k * N + n];
                }
                C[m * N + n] = sum;
            }
        }
    }

    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> duration = end - start;
    double avg_latency = duration.count() / iters;
    
    // Calcula Throughput (TFLOPS)
    // 2 * M * N * K ops por iteração
    double ops = 2.0 * M * N * K;
    double tflops = (ops * iters) / (duration.count() / 1000.0) / 1e12;

    std::string hash = compute_hash(C);

    BenchResult result;
    result.M = M;
    result.N = N;
    result.K = K;
    result.dtype = "bf16-cpu-ref"; 
    result.iters = iters;
    result.latency_ms_avg = avg_latency;
    result.throughput_tflops = tflops;
    result.output_hash = hash;
    result.config_name = "cpu_naive_baseline";
    result.correctness_ok = true; // CPU é a referência de correção

    print_json(result);

    return 0;
}
