document.addEventListener("DOMContentLoaded", () => {
  const example = document.querySelector("#dismissible-example");
  document.querySelector("#reset-dismissed").addEventListener("click", () => {
    example.querySelectorAll("m3e-swipe-reveal").forEach((item) => item.restore());
  });
});
