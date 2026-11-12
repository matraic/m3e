document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector("#gallery-snackbar").addEventListener("click", () => {
    M3eSnackbar.open("Hello from M3E!", true);
  });

  const swipeDismiss = document.querySelector("#gallery-swipe-dismiss");
  document.querySelector("#gallery-swipe-delete").addEventListener("click", () => swipeDismiss.dismiss("trailing"));
  document.querySelector("#gallery-swipe-reset").addEventListener("click", () => swipeDismiss.restore());

  document.querySelector("#open-showcase-settings").addEventListener("click", async () => {
    const drawer = window.parent.document.querySelector(".docs-drawer-container");
    if (!drawer.end) {
      window.parent.document.querySelector("#settings-button").click();
      await drawer.updateComplete;
    }
    window.parent.document.querySelector("#color").focus();
  });

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
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (motion.matches && !entry.target.matches(":focus-within")) {
              const finishReveal = (event) => {
                if (event.target === entry.target && event.animationName === "scroll-reveal-enter") {
                  entry.target.classList.remove("scroll-reveal-enter");
                  entry.target.removeEventListener("animationend", finishReveal);
                  entry.target.removeEventListener("animationcancel", finishReveal);
                }
              };
              entry.target.addEventListener("animationend", finishReveal);
              entry.target.addEventListener("animationcancel", finishReveal);
              entry.target.classList.add("scroll-reveal-enter");
            }
            revealObserver.unobserve(entry.target);
          }
        }
      },
      { root: scrollContainer },
    );
    const bottom = scrollContainer.getBoundingClientRect().bottom;
    document
      .querySelectorAll(
        ".capabilities > .section-heading, .capability-group, .capabilities-try, " +
          ".quick-start, .mcp-callout, .component-gallery > .section-heading",
      )
      .forEach((element) => {
        if (element.getBoundingClientRect().top >= bottom) {
          revealObserver.observe(element);
        }
      });
  }

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
