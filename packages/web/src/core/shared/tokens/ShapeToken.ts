import { unsafeCSS } from "lit";

const CornerValue = {
  /** No rounding. */
  none: unsafeCSS("var(--md-sys-shape-corner-value-none, 0)"),

  /** Extra small rounded corner. */
  extraSmall: unsafeCSS("var(--md-sys-shape-corner-value-extra-small, 4px)"),

  /** Small rounded corner. */
  small: unsafeCSS("var(--md-sys-shape-corner-value-small, 8px)"),

  /** Medium rounded corner. */
  medium: unsafeCSS("var(--md-sys-shape-corner-value-medium, 12px)"),

  /** Large rounded corner. */
  large: unsafeCSS("var(--md-sys-shape-corner-value-large, 16px)"),

  /** Increased large rounded corner. */
  largeIncreased: unsafeCSS("var(--md-sys-shape-corner-value-large-increased, 20px)"),

  /** Extra large rounded corner. */
  extraLarge: unsafeCSS("var(--md-sys-shape-corner-value-extra-large, 28px)"),

  /** Increased extra large rounded corner. */
  extraLargeIncreased: unsafeCSS("var(--md-sys-shape-corner-value-extra-large-increased, 32px)"),

  /** Extra extra large rounded corner. */
  extraExtraLarge: unsafeCSS("var(--md-sys-shape-corner-value-extra-extra-large, 48px)"),
} as const;

/** Design tokens that control shape. */
export const ShapeToken = {
  corner: {
    /** Fully rounded symmetric shape. */
    full: unsafeCSS("var(--md-sys-shape-corner-full, 9999px)"),

    /** Extra large rounded asymmetric shape directed towards the top. */
    extraLargeTop: unsafeCSS(
      `var(--md-sys-shape-corner-extra-large-top, ${CornerValue.extraLarge} ${CornerValue.extraLarge} ${CornerValue.none} ${CornerValue.none})`,
    ),

    /** Extra large rounded symmetric shape. */
    extraLarge: unsafeCSS(`var(--md-sys-shape-corner-extra-large, ${CornerValue.extraLarge})`),

    /** Extra large rounded asymmetric shape directed towards the end. */
    extraLargeEnd: unsafeCSS(
      `${CornerValue.none} ${CornerValue.extraLarge} ${CornerValue.extraLarge} ${CornerValue.none}`,
    ),

    /** Extra large rounded asymmetric shape directed towards the start. */
    extraLargeStart: unsafeCSS(
      `${CornerValue.extraLarge} ${CornerValue.none} ${CornerValue.none} ${CornerValue.extraLarge}`,
    ),

    /** Large rounded asymmetric shape directed towards the top. */
    largeTop: unsafeCSS(
      `var(--md-sys-shape-corner-large-top, ${CornerValue.large} ${CornerValue.large} ${CornerValue.none} ${CornerValue.none})`,
    ),

    /** Large rounded asymmetric shape directed towards the end. */
    largeEnd: unsafeCSS(
      `var(--md-sys-shape-corner-large-end, ${CornerValue.none} ${CornerValue.large} ${CornerValue.large} ${CornerValue.none})`,
    ),

    /** Large rounded asymmetric shape directed towards the start. */
    largeStart: unsafeCSS(
      `var(--md-sys-shape-corner-large-start, ${CornerValue.large} ${CornerValue.none} ${CornerValue.none} ${CornerValue.large})`,
    ),

    /** Large rounded symmetric shape. */
    large: unsafeCSS(`var(--md-sys-shape-corner-large, ${CornerValue.large})`),

    /** Medium rounded symmetric shape. */
    medium: unsafeCSS(`var(--md-sys-shape-corner-medium, ${CornerValue.medium})`),

    /** Medium rounded asymmetric shape directed towards the top. */
    mediumTop: unsafeCSS(`${CornerValue.medium} ${CornerValue.medium} ${CornerValue.none} ${CornerValue.none}`),

    /** Medium rounded asymmetric shape directed towards the end. */
    mediumEnd: unsafeCSS(`${CornerValue.none} ${CornerValue.medium} ${CornerValue.medium} ${CornerValue.none}`),

    /** Medium rounded asymmetric shape directed towards the start. */
    mediumStart: unsafeCSS(`${CornerValue.medium} ${CornerValue.none} ${CornerValue.none} ${CornerValue.medium}`),

    /** Small rounded symmetric shape. */
    small: unsafeCSS(`var(--md-sys-shape-corner-small, ${CornerValue.small})`),

    /** Small rounded asymmetric shape directed towards the top. */
    smallTop: unsafeCSS(`${CornerValue.small} ${CornerValue.small} ${CornerValue.none} ${CornerValue.none}`),

    /** Small rounded asymmetric shape directed towards the end. */
    smallEnd: unsafeCSS(`${CornerValue.none} ${CornerValue.small} ${CornerValue.small} ${CornerValue.none}`),

    /** Small rounded asymmetric shape directed towards the start. */
    smallStart: unsafeCSS(`${CornerValue.small} ${CornerValue.none} ${CornerValue.none} ${CornerValue.small}`),

    /** Extra small rounded asymmetric shape directed towards the top. */
    extraSmallTop: unsafeCSS(
      `var(--md-sys-shape-corner-extra-small-top, ${CornerValue.extraSmall} ${CornerValue.extraSmall} ${CornerValue.none} ${CornerValue.none})`,
    ),

    /** Extra small rounded symmetric shape. */
    extraSmall: unsafeCSS(`var(--md-sys-shape-corner-extra-small, ${CornerValue.extraSmall})`),

    /** Extra small rounded asymmetric shape directed towards the end. */
    extraSmallEnd: unsafeCSS(
      `${CornerValue.none} ${CornerValue.extraSmall} ${CornerValue.extraSmall} ${CornerValue.none}`,
    ),

    /** Extra small rounded asymmetric shape directed towards the start. */
    extraSmallStart: unsafeCSS(
      `${CornerValue.extraSmall} ${CornerValue.none} ${CornerValue.none} ${CornerValue.extraSmall}`,
    ),

    /** Extra small rounded asymmetric shape directed towards the bottom. */
    extraSmallBottom: unsafeCSS(
      `${CornerValue.none} ${CornerValue.none} ${CornerValue.extraSmall} ${CornerValue.extraSmall}`,
    ),

    /** No rounding. */
    none: unsafeCSS(`var(--md-sys-shape-corner-none, ${CornerValue.none})`),

    /** Increased large rounded symmetric shape. */
    largeIncreased: unsafeCSS(`var(--md-sys-shape-corner-large-increased, ${CornerValue.largeIncreased})`),

    /** Increased extra large rounded symmetric shape. */
    extraLargeIncreased: unsafeCSS(
      `var(--md-sys-shape-corner-extra-large-increased, ${CornerValue.extraLargeIncreased})`,
    ),

    /** Extra extra large rounded symmetric shape. */
    extraExtraLarge: unsafeCSS(`var(--md-sys-shape-corner-extra-extra-large, ${CornerValue.extraExtraLarge})`),

    /** Design tokens that control specific corners. */
    value: CornerValue,
  },
} as const;
