window.addEventListener("DOMContentLoaded", () => {
  for (const toggle of document.querySelectorAll("m3e-datepicker-toggle")) {
    if (toggle.getAttribute("for") !== "date-range") {
      const picker = document.querySelector("#" + toggle.getAttribute("for"));
      const input = toggle.closest("m3e-form-field").querySelector("input");
      input.value = toLocaleDateString(picker.date);
      picker.addEventListener("change", () => {
        input.value = toLocaleDateString(picker.date);
      });
    } else {
      const picker = document.querySelector("#" + toggle.getAttribute("for"));
      const input = toggle.closest("m3e-form-field").querySelector("input");
      input.value = toLocaleDateString(picker.rangeStart) + " - " + toLocaleDateString(picker.rangeEnd);
      picker.addEventListener("change", () => {
        input.value = toLocaleDateString(picker.rangeStart) + " - " + toLocaleDateString(picker.rangeEnd);
      });
    }
  }

  document.querySelector("#blackout-dates").blackoutDates = (date) => isWeekend(date);
  document.querySelector("#special-dates").specialDates = (date) => isHoliday(date);
});

function toLocaleDateString(date) {
  return !date ? "" : date.toLocaleDateString("en-us", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function isWeekend(date) {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6;
}

function isHoliday(date) {
  const iso = date.toISOString().slice(0, 10);

  // --- Fixed-date holidays ---
  const fixed = new Set([
    "2026-01-01", // New Year's Day
    "2026-07-04", // Independence Day
    "2026-11-11", // Veterans Day
    "2026-12-25", // Christmas Day
  ]);

  if (fixed.has(iso)) return true;

  // --- Computed holidays for 2026 ---

  // Easter Sunday 2026
  if (iso === "2026-04-05") return true;

  // Thanksgiving (4th Thursday of November)
  if (iso === "2026-11-26") return true;

  // Memorial Day (last Monday of May)
  if (iso === "2026-05-25") return true;

  // Labor Day (first Monday of September)
  if (iso === "2026-09-07") return true;

  return false;
}
