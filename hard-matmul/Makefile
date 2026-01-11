CXX ?= clang++
CXXFLAGS = -O3 -Wall -std=c++17

TARGET_CPU = matmul_bench
TARGET_DEVICE = matmul_device
SRCS_CPU = matmul_bench.cpp
SRCS_DEVICE = matmul_tt_metal.cpp

all: cpu

cpu: $(TARGET_CPU)

device: $(TARGET_DEVICE)

$(TARGET_CPU): $(SRCS_CPU)
	$(CXX) $(CXXFLAGS) -o $(TARGET_CPU) $(SRCS_CPU)

$(TARGET_DEVICE): $(SRCS_DEVICE)
	$(CXX) $(CXXFLAGS) -DTT_METAL_ENV -o $(TARGET_DEVICE) $(SRCS_DEVICE)

clean:
	rm -f $(TARGET_CPU) $(TARGET_DEVICE) *.exe *.o
