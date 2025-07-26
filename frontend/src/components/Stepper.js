import React, { useEffect, useState, useRef } from "react";

function Stepper({ current, total, onNext, onPrev }) {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isAutoPlaying && current < total - 1) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        onNext();
      }, speed);
    } else {
      clearInterval(intervalRef.current);
    }

    if (current === total - 1) {
      setIsAutoPlaying(false);
    }

    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, current, total, onNext, speed]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  const handleSpeedChange = (e) => {
    setSpeed(Number(e.target.value));
  };

  return (
    <div style={{ margin: "20px 0", textAlign: "center" }}>
      <button onClick={onPrev} disabled={current === 0 || isAutoPlaying}>
        ⏮ Prev
      </button>
      <span style={{ margin: "0 20px" }}>
        Step {current + 1} of {total}
      </span>
      <button onClick={onNext} disabled={current === total - 1 || isAutoPlaying}>
        Next ⏭
      </button>

      <div style={{ marginTop: "10px" }}>
        <button onClick={toggleAutoPlay} disabled={total <= 1}>
          {isAutoPlaying ? "⏸ Pause" : "▶ Auto"}
        </button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>
          Speed 🐇
          <input
            type="range"
            min="10"
            max="2000"
            step="100"
            value={speed}
            onChange={handleSpeedChange}
            style={{ marginLeft: "10px" }}
             
          />
          🐢 
          <span style={{ marginLeft: "10px" }}>{speed}ms per frame</span>
        </label>
      </div>
    </div>
  );
}

export default Stepper;
