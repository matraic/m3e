window.addEventListener("DOMContentLoaded", () => {
  if (window.parent && window.parent.document && window.parent.document.documentElement) {
    document.documentElement.dir = window.parent.document.documentElement.dir;

    const theme = document.querySelector("m3e-theme");
    const parentTheme = window.parent.document.querySelector("m3e-theme");
    theme.scheme = parentTheme.scheme;
    theme.color = parentTheme.color;
  }
  document.body.classList.add("loaded");
});

window.addEventListener("message", (e) => {
  switch (e.data?.type) {
    case "color-change":
      document.querySelector("m3e-theme").color = e.data.color;
      break;

    case "color-scheme-change":
      document.querySelector("m3e-theme").scheme = e.data.scheme;
      break;

    case "direction-change":
      document.documentElement.dir = e.data.dir;
      break;
  }
});
