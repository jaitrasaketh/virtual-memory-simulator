// src/components/StatsPanel.js
import React from "react";

function StatsPanel({ hits, misses, hitRate }) {
  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h3>📊 Simulation Stats</h3>
      <p>✅ Hits: <strong>{hits}</strong></p>
      <p>❌ Misses: <strong>{misses}</strong></p>
      <p>🎯 Hit Rate: <strong>{hitRate}%</strong></p>
    </div>
  );
}

export default StatsPanel;
