window.addEventListener("beforeunload", () =>
  window.parent.document.querySelector(".docs-frame")?.setAttribute("hidden", "true"),
);

window.addEventListener("DOMContentLoaded", () => {
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
  document.body.classList.add("loaded");

  document.querySelectorAll("api-viewer").forEach((apiViewer) => hideCssCustomPropertyTypeColumns(apiViewer));
});

function hideCssCustomPropertyTypeColumns(apiViewer) {
  const id = setInterval(() => {
    try {
      if (apiViewer.shadowRoot.querySelector("*")) {
        clearInterval(id);

        const stack = [apiViewer];
        while (stack.length) {
          const node = stack.pop();

          if (node.nodeType === Node.ELEMENT_NODE && node.classList?.contains("column-name-css")) {
            node.style.flexBasis = "100%";
            node.nextElementSibling.style.display = "none";
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
      }
    } catch (e) {}
  }, 100);
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
