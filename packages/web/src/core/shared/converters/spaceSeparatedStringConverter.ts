import { ComplexAttributeConverter } from "lit";

/** Converts a space-separated attribute in to an array of strings. */
export const spaceSeparatedStringConverter: ComplexAttributeConverter<string[], string | null> = {
  fromAttribute(value: string | null): string[] {
    if (!value) return [];
    return value
      .split(/\s+/)
      .map((d) => d.trim())
      .filter(Boolean);
  },
  toAttribute(value: string[]): string {
    return value.join(" ");
  },
};
