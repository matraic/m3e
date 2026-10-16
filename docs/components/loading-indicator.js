window.addEventListener("DOMContentLoaded", () => {
  const gesture = document.getElementById("pull-progress-gesture");
  const indicator = document.getElementById("pull-progress-indicator");
  const pullDistancePerTurn = 120;

  if (!gesture || !indicator) {
    throw new Error("The pull-progress demo requires its pan gesture and loading indicator.");
  }

  gesture.addEventListener("gesture", ({ detail }) => {
    switch (detail.phase) {
      case "start":
        indicator.pullProgress = 0;
        break;
      case "update":
        indicator.pullProgress = Math.max(0, detail.totalDeltaY / pullDistancePerTurn);
        break;
      case "cancel":
      case "end":
        indicator.pullProgress = null;
        break;
    }
  });
});
