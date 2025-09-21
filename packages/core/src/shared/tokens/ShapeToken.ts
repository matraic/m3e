import { unsafeCSS } from "lit";

const CornerValue = {
  /** No rounding. */
  none: unsafeCSS("var(--md-sys-shape-corner-value-none, 0)"),

  /** Extra small rounded corner. */
  extraSmall: unsafeCSS("var(--md-sys-shape-corner-value-extra-small, 0.25rem)"),

  /** Small rounded corner. */
  small: unsafeCSS("var(--md-sys-shape-corner-value-small, 0.5rem)"),

  /** Medium rounded corner. */
  medium: unsafeCSS("var(--md-sys-shape-corner-value-medium, 0.75rem)"),

  /** Large rounded corner. */
  large: unsafeCSS("var(--md-sys-shape-corner-value-large, 1rem)"),

  /** Increased large rounded corner. */
  largeIncreased: unsafeCSS("var(--md-sys-shape-corner-value-large-increased, 1.25rem)"),

  /** Extra large rounded corner. */
  extraLarge: unsafeCSS("var(--md-sys-shape-corner-value-extra-large, 1.75rem)"),

  /** Increased extra large rounded corner. */
  extraLargeIncreased: unsafeCSS("var(--md-sys-shape-corner-value-extra-large-increased, 2rem)"),

  /** Extra extra large rounded corner. */
  extraExtraLarge: unsafeCSS("var(--md-sys-shape-corner-value-extra-extra-large, 3rem)"),
} as const;

/** Design tokens that control shape. */
export const ShapeToken = {
  corner: {
    /** Fully rounded symmetric shape. */
    full: unsafeCSS("var(--md-sys-shape-corner-full, 624.9375rem)"),

    /** Extra large rounded asymmetric shape directed towards the top. */
    extraLargeTop: unsafeCSS(
      `var(--md-sys-shape-corner-extra-large-top, ${CornerValue.extraLarge} ${CornerValue.extraLarge} ${CornerValue.none} ${CornerValue.none})`
    ),

    /** Extra large rounded symmetric shape. */
    extraLarge: unsafeCSS(`var(--md-sys-shape-corner-extra-large, ${CornerValue.extraLarge})`),

    /** Large rounded asymmetric shape directed towards the top. */
    largeTop: unsafeCSS(
      `var(--md-sys-shape-corner-large-top, ${CornerValue.large} ${CornerValue.large} ${CornerValue.none} ${CornerValue.none})`
    ),

    /** Large rounded asymmetric shape directed towards the end. */
    largeEnd: unsafeCSS(
      `var(--md-sys-shape-corner-large-end, ${CornerValue.none} ${CornerValue.large} ${CornerValue.large} ${CornerValue.none})`
    ),

    /** Large rounded asymmetric shape directed towards the start. */
    largeStart: unsafeCSS(
      `var(--md-sys-shape-corner-large-end, ${CornerValue.large} ${CornerValue.none} ${CornerValue.none} ${CornerValue.large})`
    ),

    /** Large rounded symmetric shape. */
    large: unsafeCSS(`var(--md-sys-shape-corner-large, ${CornerValue.large})`),

    /** Medium rounded symmetric shape. */
    medium: unsafeCSS(`var(--md-sys-shape-corner-medium, ${CornerValue.medium})`),

    /** Small rounded symmetric shape. */
    small: unsafeCSS(`var(--md-sys-shape-corner-small, ${CornerValue.small})`),

    /** Extra small rounded asymmetric shape directed towards the top. */
    extraSmallTop: unsafeCSS(
      `var(--md-sys-shape-corner-extra-small-top, ${CornerValue.extraSmall} ${CornerValue.extraSmall} ${CornerValue.none} ${CornerValue.none})`
    ),

    /** Extra small rounded symmetric shape. */
    extraSmall: unsafeCSS(`var(--md-sys-shape-corner-extra-small, ${CornerValue.extraSmall})`),

    /** No rounding. */
    none: unsafeCSS(`var(--md-sys-shape-corner-none, ${CornerValue.none})`),

    /** Increased large rounded symmetric shape. */
    largeIncreased: unsafeCSS(`var(--md-sys-shape-corner-large-increased, ${CornerValue.largeIncreased})`),

    /** Increased extra large rounded symmetric shape. */
    extraLargeIncreased: unsafeCSS(
      `var(--md-sys-shape-corner-extra-large-increased, ${CornerValue.extraLargeIncreased})`
    ),

    /** Extra extra large rounded symmetric shape. */
    extraExtraLarge: unsafeCSS(`var(--md-sys-shape-corner-extra-extra-large, ${CornerValue.extraExtraLarge})`),

    /** Design tokens that control specific corners. */
    value: CornerValue,
  },
} as const;
