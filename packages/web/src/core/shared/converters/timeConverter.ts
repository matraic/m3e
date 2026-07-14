import { ComplexAttributeConverter } from "lit";

/** Represents a clock time with no date, timezone, or offset, in 24‑hour format. */
export interface TimeParts {
  /** The hour, in 24-hour time, from 0..23. */
  hour: number;

  /** The minute, from 0..59. */
  minute: number;
}

/** Converts a time string (24h "HH:mm" or 12h "h:mm am/pm") to and from a { hours, minutes } object. */
export const timeConverter: ComplexAttributeConverter<TimeParts | null, string | null> = {
  fromAttribute(value: string | null) {
    if (!value) return null;

    value = value.trim().toLowerCase();

    // 24‑hour: "HH:mm"
    let m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
    if (m) {
      return {
        hour: Number(m[1]),
        minute: Number(m[2]),
      };
    }

    // 12‑hour: "h:mm am" / "h:mm pm"
    m = /^(\d{1,2}):([0-5]\d)\s*(am|pm)$/.exec(value);
    if (m) {
      const h = Number(m[1]);
      const min = Number(m[2]);
      const period = m[3];

      if (h < 1 || h > 12) return null;

      // convert to 24‑hour
      const base = h % 12; // 12 → 0
      const hour = period === "pm" ? base + 12 : base;

      return { hour, minute: min };
    }

    return null;
  },

  toAttribute(value) {
    if (!value) return null;

    const hh = String(value.hour).padStart(2, "0");
    const mm = String(value.minute).padStart(2, "0");
    return `${hh}:${mm}`; // always serialize as 24‑hour
  },
};
