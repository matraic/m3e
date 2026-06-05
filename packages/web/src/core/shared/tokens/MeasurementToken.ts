import { unsafeCSS } from "lit";

/** Design tokens that control measurements. */
export const MeasurementToken = {
  /** Zero spacing. */
  space0: unsafeCSS("var(--md-sys-measurement-space0, 0rem)"),

  /** 2dp spacing. */
  space25: unsafeCSS("var(--md-sys-measurement-space25, 0.125rem)"),

  /** 4dp spacing. */
  space50: unsafeCSS("var(--md-sys-measurement-space50, 0.25rem)"),

  /** 6dp spacing. */
  space75: unsafeCSS("var(--md-sys-measurement-space75, 0.375rem)"),

  /** 8dp spacing. */
  space100: unsafeCSS("var(--md-sys-measurement-space100, 0.5rem)"),

  /** 12dp spacing. */
  space150: unsafeCSS("var(--md-sys-measurement-space150, 0.75rem)"),

  /** 16dp spacing. */
  space200: unsafeCSS("var(--md-sys-measurement-space200, 1rem)"),

  /** 20dp spacing. */
  space250: unsafeCSS("var(--md-sys-measurement-space250, 1.25rem)"),

  /** 32dp spacing. */
  space300: unsafeCSS("var(--md-sys-measurement-space300, 2rem)"),

  /** 40dp spacing. */
  space400: unsafeCSS("var(--md-sys-measurement-space400, 2.5rem)"),

  /** 48dp spacing. */
  space500: unsafeCSS("var(--md-sys-measurement-space500, 3rem)"),

  /** 56dp spacing. */
  space600: unsafeCSS("var(--md-sys-measurement-space600, 3.5rem)"),

  /** 64dp spacing. */
  space700: unsafeCSS("var(--md-sys-measurement-space700, 4rem)"),

  /** 72dp spacing. */
  space800: unsafeCSS("var(--md-sys-measurement-space800, 4.5rem)"),

  /** 96dp spacing. */
  space900: unsafeCSS("var(--md-sys-measurement-space900, 6rem)"),
} as const;
