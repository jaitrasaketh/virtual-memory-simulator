import React, { useState } from "react";
import "./App.css";
import InputForm from "./components/InputForm";
import FrameGrid from "./components/FrameGrid";
import Stepper from "./components/Stepper";
import StatsPanel from "./components/StatsPanel";
import { simulateMemory } from "./api";

function App() {
  const [simulationData, setSimulationData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSimulate = async (input) => {
    try {
      const res = await simulateMemory(input);
      const steps = res.data.output.steps;
      setSimulationData(res.data.output);
      setCurrentStep(0);
    } catch (err) {
      console.error("Simulation error:", err);
      alert("Simulation failed. Check backend.");
    }
  };

  const nextStep = () => {
    if (currentStep < simulationData.steps.length - 1)
      setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="App">
      <h1>🧠 Virtual Memory Simulator</h1>
      <InputForm onSimulate={handleSimulate} />
      {simulationData && (
        <>
          <FrameGrid step={simulationData.steps[currentStep]} />
          <Stepper
            current={currentStep}
            total={simulationData.steps.length}
            onNext={nextStep}
            onPrev={prevStep}
          />
          <StatsPanel
            hits={simulationData.hits}
            misses={simulationData.misses}
            hitRate={simulationData.hit_rate}
          />
        </>
      )}
    </div>
  );
}

export default App;
