document.addEventListener("DOMContentLoaded", () => {
  const toggle1 = document.querySelector("#toggle1");
  toggle1.addEventListener("change", (e) => {
    document.querySelector("#skeleton1").loaded = e.target.checked;
  });
});
