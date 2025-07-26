#!/usr/bin/env python3
import requests
import json

def test_api():
    base_url = "http://localhost:5001"

    print("=== Health Check ===")
    try:
        r = requests.get(f"{base_url}/health")
        print("Health:", r.status_code, r.json())
    except Exception as e:
        print("Health check failed:", e)
        return

    print("\n=== Testing /simulate ===")

    test_cases = [
        {
            "name": "Valid LRU Test",
            "input": {"algorithm": "LRU", "reference_string": "7 0 1 2 0 3 0 4", "num_frames": 3}
        },
        {
            "name": "Valid FIFO Test",
            "input": {"algorithm": "FIFO", "reference_string": "1 2 3 4 1 2", "num_frames": 3}
        },
        {
            "name": "Invalid Algorithm",
            "input": {"algorithm": "RANDOM", "reference_string": "1 2 3", "num_frames": 3}
        },
        {
            "name": "Missing Field",
            "input": {"algorithm": "LRU", "num_frames": 3}
        },
    ]

    for test in test_cases:
        print(f"\n--- {test['name']} ---")
        try:
            response = requests.post(
                f"{base_url}/simulate",
                json=test["input"],
                headers={"Content-Type": "application/json"}
            )
            print("Status:", response.status_code)
            try:
                print("Response:", json.dumps(response.json(), indent=2))
            except Exception:
                print("Non-JSON response:", response.text)
        except Exception as e:
            print("Request failed:", e)

if __name__ == "__main__":
    test_api()
