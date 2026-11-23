window.addEventListener("DOMContentLoaded", () => {
  for (const kind of ["circular", "linear"]) {
    const progress = document.getElementById(`${kind}-progress-demo`);
    const run = document.getElementById(`run-${kind}-progress`);
    const display = kind === "circular" ? progress : document.getElementById("linear-progress-value");

    if (!progress || !run || !display) {
      throw new Error(`The ${kind} progress demo requires its indicator, value display and run button.`);
    }

    const updateValue = (value) => {
      progress.value = value;
      display.textContent = kind === "linear" ? `${value}%` : `${value}`;
    };

    run.addEventListener("click", () => {
      run.disabled = true;
      updateValue(0);

      const timer = setInterval(() => {
        updateValue(progress.value + 1);

        if (progress.value === 100) {
          clearInterval(timer);
          run.disabled = false;
          run.textContent = "Replay";
        }
      }, 100);
    });
  }

  const thicknessDemo = document.getElementById("progress-thickness-demo");
  const thicknessThumb = document.getElementById("progress-thickness-thumb");
  const thicknessDisplay = document.getElementById("progress-thickness-value");

  if (!thicknessDemo || !thicknessThumb || !thicknessDisplay) {
    throw new Error("The thickness demo requires its indicators, slider thumb and value display.");
  }

  const updateThickness = () => {
    const thickness = `${thicknessThumb.value}px`;
    thicknessDemo.style.setProperty("--m3e-linear-progress-indicator-thickness", thickness);
    thicknessDemo.style.setProperty("--m3e-circular-progress-indicator-thickness", thickness);
    thicknessDisplay.textContent = thickness;
    thicknessThumb.ariaValueText = `${thicknessThumb.value} pixels`;
  };

  thicknessThumb.addEventListener("input", updateThickness);
  updateThickness();
});
