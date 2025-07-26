// src/components/InputForm.js
import React, { useState } from "react";

const predefinedTestcases = {
  "Low Page Fault (Repeated Access)": {
    algorithm: "LRU",
    reference_string: "1 2 3 1 2 3 1 2 3",
    num_frames: 3,
  },
  "High Page Fault (Thrashing)": {
    algorithm: "FIFO",
    reference_string: "1 2 3 4 1 2 5 1 2 3 4 5",
    num_frames: 3,
  },
  "Looping Pattern": {
    algorithm: "LRU",
    reference_string: "1 2 3 4 1 2 3 4 1 2 3 4",
    num_frames: 4,
  },
  "Back-and-Forth Pattern": {
    algorithm: "LRU",
    reference_string: "1 2 1 2 1 2 3 4 3 4 3 4",
    num_frames: 3,
  },
  "Worst Case for FIFO": {
    algorithm: "FIFO",
    reference_string: "1 2 3 4 1 2 5 1 2 3 4 5",
    num_frames: 3,
  },
  "Random Access": {
    algorithm: "FIFO",
    reference_string: "4 2 1 7 0 3 6 2 9 5 4 8 1",
    num_frames: 4,
  },
  "LRU vs FIFO Difference Case": {
    algorithm: "LRU",
    reference_string: "1 2 3 1 4 5",
    num_frames: 3,
  },
  "All Pages Fit (No Replacement)": {
    algorithm: "FIFO",
    reference_string: "1 2 3 4 5 6",
    num_frames: 6,
  },
};

function InputForm({ onSimulate }) {
  const [algorithm, setAlgorithm] = useState("FIFO");
  const [referenceString, setReferenceString] = useState("");
  const [numFrames, setNumFrames] = useState(3);
  const [genLength, setGenLength] = useState(0);
  const [selectedTestcase, setSelectedTestcase] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!referenceString.trim()) return alert("Enter reference string");

    const input = {
      algorithm,
      reference_string: referenceString.trim(),
      num_frames: parseInt(numFrames),
    };

    onSimulate(input);
  };

  const handleGenerate = () => {
    const length = Math.max(1, parseInt(genLength));
    const maxPage = Math.max(1, 2 * parseInt(numFrames));
    const generated = Array.from({ length }, () =>
      Math.floor(Math.random() * maxPage)
    ).join(" ");
    setReferenceString(generated);
  };

  const handleTestcaseSelect = (e) => {
    const selected = e.target.value;
    setSelectedTestcase(selected);
    if (predefinedTestcases[selected]) {
      const { reference_string, num_frames } = predefinedTestcases[selected];
      setReferenceString(reference_string);
      setNumFrames(num_frames);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <label>
        Algorithm:
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          <option value="FIFO">FIFO</option>
          <option value="LRU">LRU</option>
        </select>
      </label>

      <label style={{ marginLeft: "20px" }}>
        Frames:
        <input
          type="number"
          value={numFrames}
          onChange={(e) => setNumFrames(e.target.value)}
          min="1"
        />
      </label>

      <label style={{ marginLeft: "20px" }}>
        Reference String:
        <input
          type="text"
          placeholder="e.g. 7 0 1 2 0 3 0 4"
          value={referenceString}
          onChange={(e) => setReferenceString(e.target.value)}
          style={{ width: "300px" }}
        />
      </label>

      <button type="submit" style={{ marginLeft: "20px" }}>Simulate</button>

      <div style={{ marginTop: "10px" }}>
        <label>
          Generate Random (length):
          <input
            type="number"
            value={genLength}
            onChange={(e) => setGenLength(e.target.value)}
            style={{ width: "60px", marginLeft: "10px" }}
            min="0"
          />
        </label>
        <button type="button" onClick={handleGenerate} style={{ marginLeft: "10px" }}>
          Generate
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        <label>
          Try a Predefined Scenario:
          <select
            value={selectedTestcase}
            onChange={handleTestcaseSelect}
            style={{ marginLeft: "10px" }}
          >
            <option value="">-- Select Testcase --</option>
            {Object.keys(predefinedTestcases).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>
    </form>
  );
}

export default InputForm;
