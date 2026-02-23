import { unsafeCSS } from "lit";

/** Design tokens that control color. */
export const ColorToken = {
  /** High-emphasis fills, texts, and icons against surface. */
  primary: unsafeCSS("var(--md-sys-color-primary, #6750A4)"),

  /** Text and icons against primary. */
  onPrimary: unsafeCSS("var(--md-sys-color-on-primary, #FFFFFF)"),

  /** Standout fill color against surface, for key components. */
  primaryContainer: unsafeCSS("var(--md-sys-color-primary-container, #EADDFF)"),

  /** Text and icons against primary container. */
  onPrimaryContainer: unsafeCSS("var(--md-sys-color-on-primary-container, #4F378B)"),

  /** High-emphasis fills, texts, and icons that maintain the same tone in light and dark themes. */
  primaryFixed: unsafeCSS("var(--md-sys-color-primary-fixed, #EADDFF)"),

  /** High-emphasis fills, texts, and icons that maintain the same stronger tone in light and dark themes. */
  primaryFixedDim: unsafeCSS("var(--md-sys-color-primary-fixed-dim, #D0BCFF)"),

  /** Text and icons against fixed primary. */
  onPrimaryFixed: unsafeCSS("var(--md-sys-color-on-primary-fixed, #21005D)"),

  /** Lower-emphasis text and icons against fixed primary. */
  onPrimaryFixedVariant: unsafeCSS("var(--md-sys-color-on-primary-fixed-variant, #4F378B)"),

  /** Less prominent fills, text, and icons against surface. */
  secondary: unsafeCSS("var(--md-sys-color-secondary, #625B71)"),

  /** Text and icons against secondary. */
  onSecondary: unsafeCSS("var(--md-sys-color-on-secondary, #FFFFFF)"),

  /** Less prominent fill color against surface, for recessive components. */
  secondaryContainer: unsafeCSS("var(--md-sys-color-secondary-container, #E8DEF8)"),

  /** Text and icons against secondary container. */
  onSecondaryContainer: unsafeCSS("var(--md-sys-color-on-secondary-container, #4A4458)"),

  /** Less prominent fills, texts, and icons that maintain the same tone in light and dark themes. */
  secondaryFixed: unsafeCSS("var(--md-sys-color-secondary-fixed, #E8DEF8)"),

  /** Less prominent fills, texts, and icons that maintain the same stronger tone in light and dark themes. */
  secondaryFixedDim: unsafeCSS("var(--md-sys-color-secondary-fixed-dim, #CCC2DC)"),

  /** Text and icons against fixed secondary. */
  onSecondaryFixed: unsafeCSS("var(--md-sys-color-on-secondary-fixed, #1D192B)"),

  /** Lower-emphasis text and icons against fixed secondary. */
  onSecondaryFixedVariant: unsafeCSS("var(--md-sys-color-on-secondary-fixed-variant, #4A4458)"),

  /** Complementary fills, text, and icons against surface. */
  tertiary: unsafeCSS("var(--md-sys-color-tertiary, #7D5260)"),

  /** Text and icons against tertiary. */
  onTertiary: unsafeCSS("var(--md-sys-color-on-tertiary, #FFFFFF)"),

  /** Complementary container color against surface. */
  tertiaryContainer: unsafeCSS("var(--md-sys-color-tertiary-container, #FFD8E4)"),

  /** Text and icons against tertiary container. */
  onTertiaryContainer: unsafeCSS("var(--md-sys-color-on-tertiary-container, #633B48)"),

  /** Complementary fills, texts, and icons that maintain the same tone in light and dark themes. */
  tertiaryFixed: unsafeCSS("var(--md-sys-color-tertiary-fixed, #FFD8E4)"),

  /** Complementary fills, texts, and icons that maintain the same stronger tone in light and dark themes. */
  tertiaryFixedDim: unsafeCSS("var(--md-sys-color-tertiary-fixed-dim, #EFB8C8)"),

  /** Text and icons against fixed tertiary. */
  onTertiaryFixed: unsafeCSS("var(--md-sys-color-on-tertiary-fixed, #31111D)"),

  /** Lower-emphasis text and icons against fixed tertiary. */
  onTertiaryFixedVariant: unsafeCSS("var(--md-sys-color-on-tertiary-fixed-variant, #633B48)"),

  /** Attention-grabbing color against surface for fills, icons, and text, indicating urgency. */
  error: unsafeCSS("var(--md-sys-color-error, #B3261E)"),

  /** Text and icons against error. */
  onError: unsafeCSS("var(--md-sys-color-on-error, #FFFFFF)"),

  /** Attention-grabbing fill color against surface. */
  errorContainer: unsafeCSS("var(--md-sys-color-error-container, #F9DEDC)"),

  /** Text and icons against error container. */
  onErrorContainer: unsafeCSS("var(--md-sys-color-on-error-container, #8C1D18)"),

  /** Default color for backgrounds. */
  surface: unsafeCSS("var(--md-sys-color-surface, #FEF7FF)"),

  /** Text and icons against any surface color. */
  onSurface: unsafeCSS("var(--md-sys-color-on-surface, #1D1B20)"),

  /** Lower-emphasis color for text and icons against any surface color. */
  onSurfaceVariant: unsafeCSS("var(--md-sys-color-on-surface-variant, #49454F)"),

  /** Lowest-emphasis container color. */
  surfaceContainerLowest: unsafeCSS("var(--md-sys-color-surface-container-lowest, #FFFFFF)"),

  /** Low-emphasis container color. */
  surfaceContainerLow: unsafeCSS("var(--md-sys-color-surface-container-low, #F7F2FA)"),

  /** Default container color. */
  surfaceContainer: unsafeCSS("var(--md-sys-color-surface-container, #F3EDF7)"),

  /** High-emphasis container color. */
  surfaceContainerHigh: unsafeCSS("var(--md-sys-color-surface-container-high, #ECE6F0)"),

  /** Highest-emphasis container color. */
  surfaceContainerHighest: unsafeCSS("var(--md-sys-color-surface-container-highest, #E6E0E9)"),

  /** Dimmest surface color in light and dark themes. */
  surfaceDim: unsafeCSS("var(--md-sys-color-surface-dim, #DED8E1)"),

  /** Brightest surface color in light and dark themes. */
  surfaceBright: unsafeCSS("var(--md-sys-color-surface-bright, #FEF7FF)"),

  /** Alternate surface color, can be used for active states. */
  surfaceVariant: unsafeCSS("var(--md-sys-color-surface-variant, #E7E0EC)"),

  /** Background fills for elements which contrast against surface. */
  inverseSurface: unsafeCSS("var(--md-sys-color-inverse-surface, #322F35)"),

  /** Text and icons against inverse surface. */
  inverseOnSurface: unsafeCSS("var(--md-sys-color-inverse-on-surface, #F5EFF7)"),

  /** Primary text and icons against inverse surface. */
  inversePrimary: unsafeCSS("var(--md-sys-color-inverse-primary, #D0BCFF)"),

  /** Important boundaries, such as a text field outline. */
  outline: unsafeCSS("var(--md-sys-color-outline, #79747E)"),

  /** Decorative elements, such as dividers. */
  outlineVariant: unsafeCSS("var(--md-sys-color-outline-variant, #CAC4D0)"),

  /** Elevation shadow color. */
  shadow: unsafeCSS("var(--md-sys-color-shadow, #000000)"),

  /** Backdrop which obscures underlying content. */
  scrim: unsafeCSS("var(--md-sys-color-scrim, #000000)"),
} as const;
