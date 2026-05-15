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
});

window.addEventListener("message", (e) => {
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
