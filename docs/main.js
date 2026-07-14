window.addEventListener("beforeunload", () =>
  window.parent.document.querySelector(".docs-frame")?.setAttribute("hidden", "true"),
);

window.addEventListener("DOMContentLoaded", async () => {
  if (window.parent && window.parent.document && window.parent.document.documentElement) {
    document.documentElement.dir = window.parent.document.documentElement.dir;

    const theme = document.querySelector("m3e-theme");
    const parentTheme = window.parent.document.querySelector("m3e-theme");
    theme.scheme = parentTheme.scheme;
    theme.color = parentTheme.color;
    theme.contrast = parentTheme.contrast;

    switch (parentTheme.scheme) {
      case "light":
      case "dark":
        document.documentElement.style.colorScheme = parentTheme.scheme;
        break;
      default:
        document.documentElement.style.colorScheme = parentTheme.isDark ? "dark" : "light";
        break;
    }
  }

  const drawerContainer = window.parent.document.querySelector(".docs-drawer-container");
  drawerContainer?.addEventListener("change", () => updateBodyMargin());
  updateBodyMargin();

  const cem = await (await fetch("https://cdn.jsdelivr.net/npm/@m3e/web@2.6.1/dist/custom-elements.json")).json();
  mergeParsedTypes(cem);

  const promises = [];
  for (const apiViewer of document.querySelectorAll("api-viewer")) {
    apiViewer.manifest = cem;
    promises.push(updateApiViewer(apiViewer));
  }

  await Promise.all(promises);

  document.body.classList.add("loaded");
});

function updateBodyMargin() {
  const drawerContainer = window.parent.document.querySelector(".docs-drawer-container");
  if (drawerContainer?.hasAttribute("start")) {
    document.querySelector("#body").style.setProperty("--_margin-inline-start-multiplier", "0");
  } else {
    document.querySelector("#body").style.setProperty("--_margin-inline-start-multiplier", "1");
  }
}

function mergeParsedTypes(obj) {
  if (obj.type && obj.parsedType && obj.parsedType.text && obj.parsedType.text.includes("|")) {
    const parsedType = obj.parsedType.text.replace(/'/g, '"');
    obj.type.text = `${obj.type.text} (${parsedType})`;
    return;
  }

  for (const key in obj) {
    const val = obj[key];

    if (Array.isArray(val)) {
      for (const item of val) mergeParsedTypes(item);
    } else if (val && typeof val === "object") {
      mergeParsedTypes(val);
    }
  }
}

function updateApiViewer(apiViewer) {
  return new Promise((resolve) => {
    const id = setInterval(() => {
      try {
        if (apiViewer.shadowRoot.querySelector("*")) {
          clearInterval(id);

          const tabs = [];
          const stack = [apiViewer];

          while (stack.length) {
            const node = stack.pop();

            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList?.contains("column-name-css")) {
                node.style.flexBasis = "100%";
                node.nextElementSibling.style.display = "none";
              } else if (node.tagName === "API-VIEWER-TAB" && !node.hidden) {
                tabs.push(node);
              } else if (node.tagName === "API-VIEWER-TABS") {
                const tablist = node.shadowRoot?.querySelector(".tabs");
                if (tablist) {
                  tablist.style.scrollbarWidth = "thin";
                  tablist.style.scrollbarColor =
                    "var(--m3e-scrollbar-thumb-color, #938f94) var(--m3e-scrollbar-track-color, transparent)";
                }
              }
            }

            if (node.shadowRoot) {
              stack.push(node.shadowRoot);
            }

            if (node.childNodes) {
              for (const child of node.childNodes) {
                stack.push(child);
              }
            }
          }

          ensureTabSelected(tabs[tabs.length - 1]);
          resolve();
        }
      } catch (e) {}
    }, 100);
  });
}

function ensureTabSelected(tab) {
  if (tab && tab.getAttribute("aria-selected") !== "true") {
    tab.click();
    queueMicrotask(() =>
      document.querySelector("#body")?.shadowRoot?.querySelector(".scroll-container")?.scrollTo(0, 0),
    );
  }
}

window.addEventListener("message", (e) => {
  const allowedOrigin = window.location.origin;
  if (e.origin !== allowedOrigin) {
    return;
  }
  if (!e.data || typeof e.data !== "object") {
    return;
  }
  switch (e.data?.type) {
    case "color-change":
      document.querySelector("m3e-theme").color = e.data.color;
      break;

    case "contrast-change":
      document.querySelector("m3e-theme").contrast = e.data.contrast;
      break;

    case "color-scheme-change":
      switch (e.data.scheme) {
        case "light":
        case "dark":
          document.documentElement.style.colorScheme = e.data.scheme;
          break;
        default:
          const parentTheme = window.parent.document.querySelector("m3e-theme");
          document.documentElement.style.colorScheme = parentTheme.isDark ? "dark" : "light";
          break;
      }
      document.querySelector("m3e-theme").scheme = e.data.scheme;
      break;

    case "direction-change":
      document.documentElement.dir = e.data.dir;
      break;
  }
});
