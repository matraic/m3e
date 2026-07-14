document.addEventListener("DOMContentLoaded", () => {
  for (const toggle of document.querySelectorAll("m3e-timepicker-toggle")) {
    const picker = document.querySelector("#" + toggle.getAttribute("for"));
    const input = toggle.closest("m3e-form-field").querySelector("input");
    input.value = toLocaleTimeString(picker.date);
    picker.addEventListener("change", () => {
      input.value = toLocaleTimeString(picker.date);
    });
  }

  document.querySelector("#blackout-times").blackoutTimes = (t) => t.hour < 8 || t.hour > 18;
  document.querySelector("#input").addEventListener("change", (e) => {
    const picker = e.target;
    document.querySelector("#inputValue").innerText = `hour = ${picker.hour ?? ""}, minute = ${picker.minute ?? ""}`;
  });
});

function toLocaleTimeString(date) {
  return !date ? "" : date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}
