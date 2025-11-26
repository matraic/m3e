window.addEventListener("DOMContentLoaded", () => {
  if (window.parent && window.parent.document && window.parent.document.documentElement) {
    document.documentElement.dir = window.parent.document.documentElement.dir;
  }
});

window.addEventListener("message", (e) => {
  if (e.data?.type === "direction-change") {
    document.documentElement.dir = e.data.dir;
  }
});
