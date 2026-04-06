import { ComplexAttributeConverter } from "lit";

/** Converts an ISO‑8601 date to and from a `Date` object. */
export const dateConverter: ComplexAttributeConverter<Date | null, string | null> = {
  fromAttribute(value: string | null): Date | null {
    if (!value) return null;

    // Matches all four formats:
    // yyyy-MM-dd
    // yyyy-MM-ddTHH:mm:ss
    // yyyy-MM-ddTHH:mm:ssZ
    // yyyy-MM-ddTHH:mm:ss±HH:mm
    const isoRegex = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?)?(Z|[+-]\d{2}:\d{2})?$/;

    const m = value.match(isoRegex);
    if (!m) return null;

    const year = Number(m[1]);
    const month = Number(m[2]) - 1; // JS months are 0-based
    const day = Number(m[3]);

    const hasTime = m[4] !== undefined;

    const hours = hasTime ? Number(m[4]) : 0;
    const minutes = hasTime ? Number(m[5]) : 0;
    const seconds = hasTime ? Number(m[6]) : 0;
    const ms = hasTime && m[7] ? Number(m[7]) : 0;

    const tz = m[8];

    // CASE 1: yyyy-MM-dd → local date (no timezone math)
    if (!hasTime && !tz) {
      return new Date(year, month, day);
    }

    // CASE 2: yyyy-MM-ddTHH:mm:ss (no timezone) → local datetime
    if (hasTime && !tz) {
      return new Date(year, month, day, hours, minutes, seconds, ms);
    }

    // CASE 3: yyyy-MM-ddTHH:mm:ssZ → UTC
    if (tz === "Z") {
      return new Date(Date.UTC(year, month, day, hours, minutes, seconds, ms));
    }

    // CASE 4: yyyy-MM-ddTHH:mm:ss±HH:mm → offset
    if (tz && /^[+-]\d{2}:\d{2}$/.test(tz)) {
      const sign = tz.startsWith("-") ? -1 : 1;
      const [tzH, tzM] = tz.slice(1).split(":").map(Number);
      const offsetMinutes = sign * (tzH * 60 + tzM);

      // Convert offset datetime → UTC → local
      const utc = Date.UTC(year, month, day, hours, minutes, seconds, ms);
      return new Date(utc - offsetMinutes * 60_000);
    }

    return null;
  },
  toAttribute(value: Date | null): string | null {
    return value?.toISOString() ?? null;
  },
};
