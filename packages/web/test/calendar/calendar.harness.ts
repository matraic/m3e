import type { M3eCalendarElement } from "@m3e/web/calendar";
import type { Page } from "@playwright/test";

type Options = {
  startAt?: string;
  date?: string;
  minDate?: string;
  maxDate?: string;
  rangeStart?: string;
  rangeEnd?: string;
  startView?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
};

export class CalendarHarness {
  options: Options = {};
  reducedMotion = true;

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get calendar() {
    return this.page.locator("m3e-calendar");
  }

  get disabledDates() {
    return this.page.getByRole("grid").locator('[role="button"][aria-disabled="true"]');
  }

  gridItem(label: string) {
    return this.page.getByRole("grid").getByRole("button", { name: label, exact: true });
  }

  async show() {
    const attributes = Object.entries(this.options)
      .map(([name, value]) => `${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${value}"`)
      .join(" ");
    await this.page.emulateMedia({ reducedMotion: this.reducedMotion ? "reduce" : "no-preference" });
    await this.renderFixture(`<m3e-calendar ${attributes}></m3e-calendar>`);
  }

  async observeChanges() {
    await this.calendar.evaluate((element) => {
      element.dataset.changeCount = "0";
      element.addEventListener("change", () => {
        element.dataset.changeCount = String(Number(element.dataset.changeCount) + 1);
      });
    });
  }

  async selectFiveDaysLater() {
    await this.selectFiveDays("ArrowRight");
  }

  async selectFiveDays(direction: "ArrowLeft" | "ArrowRight") {
    await this.focusActiveDate();
    for (let i = 0; i < 5; i++) await this.page.keyboard.press(direction);
    await this.page.keyboard.press("Enter");
  }

  focusActiveDate() {
    return this.calendar.evaluate((element: M3eCalendarElement) => element.focusActiveCell());
  }

  readDates() {
    return this.calendar.evaluate((element: M3eCalendarElement) => {
      const format = (date: Date | null) =>
        date &&
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return {
        date: format(element.date),
        rangeStart: format(element.rangeStart),
        rangeEnd: format(element.rangeEnd),
      };
    });
  }

  blackoutDay(day: number) {
    return this.calendar.evaluate((element: M3eCalendarElement, value) => {
      element.blackoutDates = (date) => date.getDate() === value;
    }, day);
  }

  blackoutWeekends() {
    return this.calendar.evaluate((element: M3eCalendarElement) => {
      element.blackoutDates = (date) => date.getDay() === 0 || date.getDay() === 6;
    });
  }

  clearBlackoutDates() {
    return this.calendar.evaluate((element: M3eCalendarElement) => {
      element.blackoutDates = null;
    });
  }

  setAttribute(name: string, value: string) {
    return this.calendar.evaluate(
      (element, attribute) => {
        element.setAttribute(attribute.name, attribute.value);
      },
      { name, value },
    );
  }

  refreshToday() {
    return this.calendar.evaluate((element: M3eCalendarElement) => element.updateTodayDate());
  }

  readSlideState() {
    return this.calendar.evaluate((element) => {
      const body = element.shadowRoot?.querySelector<HTMLElement>(".body");
      if (!body) throw new Error("Calendar body is missing.");
      return {
        overflow: body.style.overflow,
        animations: body.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running")
          .length,
      };
    });
  }

  readActiveYear() {
    return this.calendar.evaluate(
      (element) => (element as HTMLElement & { _activeDate?: Date })._activeDate?.getFullYear() ?? null,
    );
  }
}
