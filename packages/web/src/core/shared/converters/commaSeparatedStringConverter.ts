import { ComplexAttributeConverter } from "lit";

/** Converts a comma-separated attribute into an array of strings. */
export const commaSeparatedStringConverter: ComplexAttributeConverter<string[], string | null> = {
  fromAttribute(value: string | null): string[] {
    if (!value) return [];
    return value
      .split(/,+/)
      .map((d) => d.trim())
      .filter(Boolean);
  },
  toAttribute(value: string[]): string {
    return value.join(",");
  },
};
