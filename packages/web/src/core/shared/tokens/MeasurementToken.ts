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

  /** 18dp spacing. */
  space225: space(225),

  /** 20dp spacing. */
  space250: space(250),

  /** 24dp spacing. */
  space300: space(300),

  /** 26dp spacing. */
  space325: space(325),

  /** 28dp spacing. */
  space350: space(350),

  /** 30dp spacing. */
  space375: space(375),

  /** 32dp spacing. */
  space400: space(400),

  /** 34dp spacing. */
  space425: space(425),

  /** 36dp spacing. */
  space450: space(450),

  /** 38dp spacing. */
  space475: space(475),

  /** 40dp spacing. */
  space500: space(500),

  /** 42dp spacing. */
  space525: space(525),

  /** 44dp spacing. */
  space550: space(550),

  /** 46dp spacing. */
  space575: space(575),

  /** 48dp spacing. */
  space600: space(600),

  /** 50dp spacing. */
  space625: space(625),

  /** 52dp spacing. */
  space650: space(650),

  /** 54dp spacing. */
  space675: space(675),

  /** 56dp spacing. */
  space700: space(700),

  /** 58dp spacing. */
  space725: space(725),

  /** 60dp spacing. */
  space750: space(750),

  /** 62dp spacing. */
  space775: space(775),

  /** 64dp spacing. */
  space800: space(800),

  /** 66dp spacing. */
  space825: space(825),

  /** 68dp spacing. */
  space850: space(850),

  /** 70dp spacing. */
  space875: space(875),

  /** 72dp spacing. */
  space900: space(900),
} as const;
