import { unsafeCSS } from "lit";

/** Design tokens that control scrollbars. */
export const ScrollbarToken = {
  /** Width of a standard scrollbar. */
  width: unsafeCSS(`var(--m3e-scrollbar-width, auto)`),

  /** Width of a thin scrollbar. */
  thinWidth: unsafeCSS(`var(--m3e-scrollbar-thin-width, thin)`),

  /** Color of a scrollbar. */
  color: unsafeCSS(`var(--m3e-scrollbar-thumb-color, #938f94) var(--m3e-scrollbar-track-color, transparent)`),
} as const;
