window.addEventListener("DOMContentLoaded", () => {
  for (const gesture of document.querySelectorAll("m3e-tap-gesture")) {
    gesture.addEventListener("gesture", (e) => {
      const log = e.target.closest("m3e-card").querySelector(".gesture-log");
      const line = document.createElement("div");
      line.textContent =
        `gestureName="${e.detail.gestureName}", ` +
        `phase="${e.detail.phase}", ` +
        `clientX=${Math.round(e.detail.clientX)}, ` +
        `clientY=${Math.round(e.detail.clientY)}, ` +
        `localX=${Math.round(e.detail.localX)}, ` +
        `localY=${Math.round(e.detail.localX)}, ` +
        `duration=${Math.round(e.detail.duration)}`;

      if (log.childNodes.length > 10) {
        log.removeChild(log.firstChild);
      }
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    });
  }

  for (const gesture of document.querySelectorAll("m3e-long-press-gesture")) {
    gesture.addEventListener("gesture", (e) => {
      const log = e.target.closest("m3e-card").querySelector(".gesture-log");
      const line = document.createElement("div");

      line.textContent =
        `gestureName="${e.detail.gestureName}", ` +
        `phase="${e.detail.phase}", ` +
        `clientX=${Math.round(e.detail.clientX)}, ` +
        `clientY=${Math.round(e.detail.clientY)}, ` +
        `localX=${Math.round(e.detail.localX)}, ` +
        `localY=${Math.round(e.detail.localY)}, ` +
        `duration=${Math.round(e.detail.duration)}`;

      if (log.childNodes.length > 10) {
        log.removeChild(log.firstChild);
      }
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    });
  }

  for (const gesture of document.querySelectorAll("m3e-swipe-gesture")) {
    gesture.addEventListener("gesture", (e) => {
      const log = e.target.closest("m3e-card").querySelector(".gesture-log");
      const line = document.createElement("div");

      line.textContent =
        `gestureName="${e.detail.gestureName}", ` +
        `phase="${e.detail.phase}", ` +
        `direction=${e.detail.direction}, ` +
        `axis=${e.detail.axis}, ` +
        `speed=${e.detail.speed.toFixed(2)}, ` +
        `velocityX=${e.detail.velocityX.toFixed(2)}, ` +
        `velocityY=${e.detail.velocityY.toFixed(2)}, ` +
        `duration=${Math.round(e.detail.duration)}`;

      if (log.childNodes.length > 10) {
        log.removeChild(log.firstChild);
      }
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    });
  }

  for (const gesture of document.querySelectorAll("m3e-pan-gesture")) {
    gesture.addEventListener("gesture", (e) => {
      const log = e.target.closest("m3e-card").querySelector(".gesture-log");
      const line = document.createElement("div");

      line.textContent =
        `gestureName="${e.detail.gestureName}", ` +
        `phase="${e.detail.phase}", ` +
        `axis=${e.detail.axis}, ` +
        `startClientX=${Math.round(e.detail.startClientX)}, ` +
        `startClientY=${Math.round(e.detail.startClientY)}, ` +
        `totalDeltaX=${Math.round(e.detail.totalDeltaX)}, ` +
        `totalDeltaY=${Math.round(e.detail.totalDeltaY)}`;

      if (log.childNodes.length > 10) {
        log.removeChild(log.firstChild);
      }
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    });
  }

  for (const gesture of document.querySelectorAll("m3e-rotate-gesture")) {
    gesture.addEventListener("gesture", (e) => {
      const log = e.target.closest("m3e-card").querySelector(".gesture-log");
      const line = document.createElement("div");

      line.textContent =
        `gestureName="${e.detail.gestureName}", ` +
        `phase="${e.detail.phase}", ` +
        `initialAngle=${e.detail.initialAngle.toFixed(2)}, ` +
        `rotation=${e.detail.rotation.toFixed(2)}, ` +
        `rotationDelta=${e.detail.rotationDelta.toFixed(2)}, ` +
        `rotationVelocity=${e.detail.rotationVelocity.toFixed(2)}, ` +
        `currentAngle=${e.detail.currentAngle.toFixed(2)}`;

      if (log.childNodes.length > 10) {
        log.removeChild(log.firstChild);
      }
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    });
  }

  for (const gesture of document.querySelectorAll("m3e-scale-gesture")) {
    gesture.addEventListener("gesture", (e) => {
      const log = e.target.closest("m3e-card").querySelector(".gesture-log");
      const line = document.createElement("div");

      line.textContent =
        `gestureName="${e.detail.gestureName}", ` +
        `phase="${e.detail.phase}", ` +
        `initialDistance=${e.detail.initialDistance.toFixed(2)}, ` +
        `currentDistance=${e.detail.currentDistance.toFixed(2)}, ` +
        `scale=${e.detail.scale.toFixed(2)}, ` +
        `scaleDelta=${e.detail.scaleDelta.toFixed(2)}, ` +
        `scaleVelocity=${e.detail.scaleVelocity.toFixed(2)}`;

      if (log.childNodes.length > 10) {
        log.removeChild(log.firstChild);
      }
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    });
  }

  for (const gesture of document.querySelectorAll("m3e-repeat-gesture")) {
    gesture.addEventListener("gesture", (e) => {
      const log = e.target.closest("m3e-card").querySelector(".gesture-log");
      const line = document.createElement("div");

      line.textContent =
        `gestureName="${e.detail.gestureName}", ` +
        `phase="${e.detail.phase}", ` +
        `details: ${e.detail.details.length}`;

      if (log.childNodes.length > 10) {
        log.removeChild(log.firstChild);
      }
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    });
  }

  for (const gesture of document.querySelectorAll("m3e-sequence-gesture")) {
    gesture.addEventListener("gesture", (e) => {
      const log = e.target.closest("m3e-card").querySelector(".gesture-log");
      const line = document.createElement("div");

      line.textContent =
        `gestureName="${e.detail.gestureName}", ` +
        `phase="${e.detail.phase}", ` +
        `details: ${e.detail.details.length}`;

      if (log.childNodes.length > 10) {
        log.removeChild(log.firstChild);
      }
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;
    });
  }
});
