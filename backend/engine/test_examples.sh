#!/bin/bash

echo "=== Virtual Memory Simulator Test Examples (JSON) ==="
echo

run_test() {
    echo "Algorithm: $1 | Frames: $2 | Ref string: $3"
    echo -e "$1\n$2\n$3" | ./vm_sim | jq .
    echo -e "\n----------------------\n"
}

run_test "FIFO" 3 "1 2 3 4 1 2 5 1 2 3 4 5"
run_test "LRU" 3 "1 2 3 4 1 2 5 1 2 3 4 5"
run_test "FIFO" 4 "7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1"
run_test "LRU" 4 "7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1"
