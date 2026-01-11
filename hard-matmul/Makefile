CXX = clang++
CXXFLAGS = -O3 -Wall -std=c++17

TARGET = matmul_bench
SRCS = matmul_bench.cpp

all: $(TARGET)

$(TARGET): $(SRCS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRCS)

clean:
	rm -f $(TARGET) $(TARGET).exe *.o
