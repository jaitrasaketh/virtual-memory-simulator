from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import os
import json

app = Flask(__name__)
CORS(app)

@app.route('/simulate', methods=['POST'])
def simulate():
    try:
        # Parse JSON input
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "error": "No JSON data provided"}), 400

        algorithm = data.get("algorithm")
        reference_string = data.get("reference_string")
        num_frames = data.get("num_frames")

        # Validate input
        if algorithm not in ["FIFO", "LRU"]:
            return jsonify({"status": "error", "error": "Invalid algorithm"}), 400
        if not isinstance(num_frames, int) or num_frames <= 0:
            return jsonify({"status": "error", "error": "num_frames must be a positive integer"}), 400
        if not reference_string or not isinstance(reference_string, str):
            return jsonify({"status": "error", "error": "reference_string must be a non-empty string"}), 400

        # Run the C++ simulator
        result = subprocess.run(
            ["./engine/vm_sim.out"],
            input=f"{algorithm}\n{num_frames}\n{reference_string}\n",
            capture_output=True,
            text=True,
            timeout=5,  # Optional timeout
            check=True,
            cwd=os.path.dirname(os.path.abspath(__file__))  # Ensures correct path
        )

        # Parse simulator output
        try:
            output_json = json.loads(result.stdout.strip())
        except json.JSONDecodeError:
            return jsonify({
                "status": "error",
                "error": "Simulator did not return valid JSON",
                "raw_output": result.stdout
            }), 500

        # Return success response
        return jsonify({
            "status": "success",
            "input": {
                "algorithm": algorithm,
                "num_frames": num_frames,
                "reference_string": reference_string
            },
            "output": output_json
        })

    except subprocess.CalledProcessError as e:
        return jsonify({
            "status": "error",
            "error": "Simulator crashed or returned error",
            "details": e.stderr,
            "return_code": e.returncode
        }), 500

    except subprocess.TimeoutExpired:
        return jsonify({"status": "error", "error": "Simulator timed out"}), 500

    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "success", "message": "Virtual Memory Simulator API is running"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
