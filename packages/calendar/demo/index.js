window.addEventListener("DOMContentLoaded", () => {
  const specialCalendar = document.querySelector("#special");
  if (specialCalendar) {
    specialCalendar.specialDates = (date) =>
      date.getFullYear() == 2025 && date.getMonth() == 10 && date.getDate() == 27;
  }

  const blackoutCalendar = document.querySelector("#blackout");
  if (blackoutCalendar) {
    blackoutCalendar.blackoutDates = (date) => [0, 6].includes(date.getDay());
  }

  const range = document.querySelector("[range-start]");
  if (range) {
    range.blackoutDates = (date) => [0, 6].includes(date.getDay());
  }
});
