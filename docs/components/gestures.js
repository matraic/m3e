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
        `axis=${e.detail.axis}, ` +
        `initialAngle=${Math.round(e.detail.initialAngle)}, ` +
        `rotation=${Math.round(e.detail.rotation)}, ` +
        `rotationDelta=${Math.round(e.detail.rotationDelta)}, ` +
        `rotationVelocity=${e.detail.rotationVelocity.toFixed(2)}, ` +
        `currentAngle=${Math.round(e.detail.currentAngle)}`;

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
        `axis=${e.detail.axis}, ` +
        `initialDistance=${Math.round(e.detail.initialDistance)}, ` +
        `currentDistance=${Math.round(e.detail.currentDistance)}, ` +
        `scale=${Math.round(e.detail.scale)}, ` +
        `scaleDelta=${Math.round(e.detail.scaleDelta)}, ` +
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
