import { M3eDirectionality } from "@m3e/core/bidi";

window.addEventListener("DOMContentLoaded", () => {
  M3eDirectionality.observe(() => {
    const frame = document.querySelector("#content-frame");
    frame.contentWindow.postMessage({ type: "direction-change", dir: M3eDirectionality.current }, "*");
  });

  const frame = document.querySelector("#content-frame");
  frame.addEventListener("load", () => {
    const scheme = document.querySelector("m3e-theme").scheme;
    switch (document.querySelector("m3e-theme").scheme) {
      case "light":
      case "dark":
        frame.contentDocument.documentElement.style.colorScheme = scheme;
        break;
    }

    const currentUrl = frame.contentWindow?.location.href.substring(document.baseURI.length);
    history.replaceState({}, "", "#/" + currentUrl);

    const menuItem = document.querySelector(`a[href='${currentUrl}']`)?.closest("m3e-nav-menu-item");
    if (menuItem) {
      menuItem.selected = true;
    }
  });

  // Only allow "[segment/]*file.html" paths, no suspicious characters
  const allowedPathRegex = /^([a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.html$/;
  const requestedPath = location.hash ? location.hash.substring(2) : "";
  frame.src = allowedPathRegex.test(requestedPath) ? requestedPath : "getting-started/overview.html";

  const color = document.querySelector("#color");
  if (color) {
    color.value = document.querySelector("m3e-theme").color;
    color.addEventListener("change", () => {
      document.querySelector("m3e-theme").color = color.value;
      frame.contentWindow.postMessage({ type: "color-change", color: color.value }, "*");
    });
  }

  const colorSchemeButton = document.querySelector("#color-scheme-button");
  if (colorSchemeButton) {
    colorSchemeButton?.addEventListener("change", () => {
      const theme = document.querySelector("m3e-theme");

      const frame = document.querySelector("#content-frame");
      switch (colorSchemeButton.value) {
        case "light":
        case "dark":
          document.documentElement.style.colorScheme = frame.contentDocument.documentElement.style.colorScheme =
            colorSchemeButton.value;
          break;
        default:
          document.documentElement.style.colorScheme = frame.contentDocument.documentElement.style.colorScheme = "";
          break;
      }
      theme.scheme = colorSchemeButton.value;
      frame.contentWindow.postMessage({ type: "color-scheme-change", scheme: theme.scheme }, "*");
    });
  }

  const directionalityButton = document.querySelector("#directionality-button");
  if (directionalityButton) {
    directionalityButton?.addEventListener("change", () => {
      document.documentElement.dir = directionalityButton.value;
    });
  }
});
