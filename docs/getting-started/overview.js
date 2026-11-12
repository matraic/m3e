document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector("#gallery-snackbar").addEventListener("click", () => {
    M3eSnackbar.open("Hello from M3E!", true);
  });

  const swipeDismiss = document.querySelector("#gallery-swipe-dismiss");
  document.querySelector("#gallery-swipe-delete").addEventListener("click", () => swipeDismiss.dismiss("trailing"));
  document.querySelector("#gallery-swipe-reset").addEventListener("click", () => swipeDismiss.restore());

  let taps = 0;
  document.querySelector('m3e-tap-gesture[for="gallery-tap"]').addEventListener("gesture", (event) => {
    if (event.detail.phase === "end") {
      taps += 1;
      document.querySelector("#gallery-tap-result").textContent = `Taps: ${taps}`;
    }
  });

  const pane = document.querySelector("#body");
  await customElements.whenDefined("m3e-content-pane");
  await pane.updateComplete;
  const scrollContainer = pane.shadowRoot.querySelector(".scroll-container");
  if (!scrollContainer) {
    throw new Error("Unable to find the content pane's scroll container.");
  }

  const hero = document.querySelector(".hero");
  const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
  let frame = 0;
  const updateParallax = () => {
    frame = 0;
    if (motion.matches) {
      hero.style.setProperty("--hero-parallax", `${Math.min(scrollContainer.scrollTop, 400)}px`);
    } else {
      hero.style.removeProperty("--hero-parallax");
    }
  };

  scrollContainer.addEventListener(
    "scroll",
    () => {
      if (motion.matches && !frame) {
        frame = requestAnimationFrame(updateParallax);
      }
    },
    { passive: true },
  );
  motion.addEventListener("change", updateParallax);
  updateParallax();
});
