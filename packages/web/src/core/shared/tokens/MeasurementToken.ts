import { unsafeCSS } from "lit";

function space(unit: number) {
  return unsafeCSS(`var(--md-sys-measurement-space${unit}, ${0.5 * (unit / 100)}rem)`);
}

/** Design tokens that control measurements. */
export const MeasurementToken = {
  /** Zero spacing. */
  space0: space(0),

  /** 2dp spacing. */
  space25: space(25),

  /** 4dp spacing. */
  space50: space(50),

  /** 6dp spacing. */
  space75: space(75),

  /** 8dp spacing. */
  space100: space(100),

  /** 10dp spacing. */
  space125: space(125),

  /** 12dp spacing. */
  space150: space(150),

  /** 14dp spacing. */
  space175: space(175),

  /** 16dp spacing. */
  space200: space(200),

  /** 20dp spacing. */
  space250: space(250),

  /** 24dp spacing. */
  space300: space(300),

  /** 32dp spacing. */
  space400: space(400),

  /** 36dp spacing. */
  space450: space(450),

  /** 40dp spacing. */
  space500: space(500),

  /** 48dp spacing. */
  space600: space(600),

  /** 56dp spacing. */
  space700: space(700),

  /** 64dp spacing. */
  space800: space(800),

  /** 72dp spacing. */
  space900: space(900),
} as const;
