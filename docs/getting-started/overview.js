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

  const searchInput = document.querySelector("#gallery-search-input");
  const searchStatus = document.querySelector("#gallery-search-status");
  const galleryCategories = Array.from(document.querySelectorAll(".gallery-category")).map((category) => ({
    element: category,
    items: Array.from(category.querySelectorAll(".gallery-item")).map((item) => {
      const link = item.querySelector("a");
      if (!link) {
        throw new Error("Every gallery item must link to its component showcase.");
      }
      const label = link.cloneNode(true);
      label.querySelectorAll("m3e-icon").forEach((icon) => icon.remove());
      return {
        element: item,
        name: label.textContent.trim().toLowerCase(),
      };
    }),
  }));
  let expandedCategoriesBeforeSearch = null;
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      galleryCategories.forEach(({ element, items }, index) => {
        element.hidden = false;
        items.forEach(({ element: item }) => {
          item.hidden = false;
        });
        if (expandedCategoriesBeforeSearch) {
          element.open = expandedCategoriesBeforeSearch[index];
        }
      });
      expandedCategoriesBeforeSearch = null;
      searchStatus.hidden = true;
      searchStatus.textContent = "";
      return;
    }

    if (!expandedCategoriesBeforeSearch) {
      expandedCategoriesBeforeSearch = galleryCategories.map(({ element }) => element.open);
    }

    let matchCount = 0;
    galleryCategories.forEach(({ element, items }) => {
      let categoryMatchCount = 0;
      items.forEach(({ element: item, name }) => {
        item.hidden = !name.includes(query);
        if (!item.hidden) {
          categoryMatchCount += 1;
          matchCount += 1;
        }
      });
      element.hidden = categoryMatchCount === 0;
      if (categoryMatchCount > 0) {
        element.open = true;
      }
    });

    searchStatus.hidden = false;
    searchStatus.textContent =
      matchCount === 0
        ? "No components found. Try a different search."
        : `${matchCount} component${matchCount === 1 ? "" : "s"} found.`;
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
        ".coverage-highlight, .capabilities > .section-heading, .capability-group, .capabilities-try, " +
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
