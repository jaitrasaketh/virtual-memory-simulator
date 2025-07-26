// src/components/FrameGrid.js
import React from "react";
import "./FrameGrid.css";

function FrameGrid({ step }) {
  const { access, frames, hit } = step;

  return (
    <div className="frame-grid-container">
      <div className="access-info">
        Accessing: <strong>{access}</strong> — {hit ? "✅ Hit" : "❌ Miss"}
      </div>
      <div className="frame-grid">
        {frames.map((frame, index) => (
          <div
            key={index}
            className={`frame-box ${hit ? "hit" : "miss"}`}
          >
            {frame === -1 ? "" : frame}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FrameGrid;
