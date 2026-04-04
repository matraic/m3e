import { ComplexAttributeConverter } from "lit";

/** Converts an ISO‑8601 date to and from a `Date` object. */
export const dateConverter: ComplexAttributeConverter<Date | null, string | null> = {
  fromAttribute(value: string | null): Date | null {
    return !value ? null : new Date(Date.parse(value));
  },
  toAttribute(value: Date | null): string | null {
    return value?.toISOString() ?? null;
  },
};
