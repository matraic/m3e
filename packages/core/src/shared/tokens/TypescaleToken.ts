import { unsafeCSS } from "lit";

/** Design tokens that control typescale. */
export const TypescaleToken = {
  /** Standard typescale variant. */
  standard: {
    /** Short, important text or numerals. */
    display: {
      large: {
        fontSize: unsafeCSS("var(--md-sys-typescale-display-large-font-size, 3.5625rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-display-large-font-weight, 400)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-display-large-line-height, 4rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-display-large-tracking, 0.015625rem)"),
      },
      medium: {
        fontSize: unsafeCSS("var(--md-sys-typescale-display-medium-font-size, 2.8125rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-display-medium-font-weight, 400)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-display-medium-line-height, 3.25rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-display-medium-tracking, 0)"),
      },
      small: {
        fontSize: unsafeCSS("var(--md-sys-typescale-display-small-font-size, 2.25rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-display-small-font-weight, 400)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-display-small-line-height, 2.75rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-display-small-tracking, 0)"),
      },
    },

    /** Short, high-emphasis text on smaller screens. */
    headline: {
      large: {
        fontSize: unsafeCSS("var(--md-sys-typescale-headline-large-font-size, 2rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-headline-large-font-weight, 400)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-headline-large-line-height, 2.5rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-headline-large-tracking, 0)"),
      },
      medium: {
        fontSize: unsafeCSS("var(--md-sys-typescale-headline-medium-font-size, 1.75rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-headline-medium-font-weight, 400)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-headline-medium-line-height, 2.25rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-headline-medium-tracking, 0)"),
      },
      small: {
        fontSize: unsafeCSS("var(--md-sys-typescale-headline-small-font-size, 1.5rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-headline-small-font-weight, 400)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-headline-small-line-height, 2rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-headline-small-tracking, 0)"),
      },
    },

    /** Medium-emphasis text that remains relatively short. */
    title: {
      large: {
        fontSize: unsafeCSS("var(--md-sys-typescale-title-large-font-size, 1.375rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-title-large-font-weight, 400)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-title-large-line-height, 1.75rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-title-large-tracking, 0)"),
      },
      medium: {
        fontSize: unsafeCSS("var(--md-sys-typescale-title-medium-font-size, 1rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-title-medium-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-title-medium-line-height, 1.5rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-title-medium-tracking, 0.009375rem)"),
      },
      small: {
        fontSize: unsafeCSS("var(--md-sys-typescale-title-small-font-size, 0.875rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-title-small-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-title-small-line-height, 1.25rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-title-small-tracking, 0.00625rem)"),
      },
    },

    /** Longer passages of text. */
    body: {
      large: {
        fontSize: unsafeCSS("var(--md-sys-typescale-body-large-font-size, 1rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-body-large-font-weight, 400)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-body-large-line-height, 1.5rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-body-large-tracking, 0.03125rem)"),
      },
      medium: {
        fontSize: unsafeCSS("var(--md-sys-typescale-body-medium-font-size, 0.875rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-body-medium-font-weight, 400)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-body-medium-line-height, 1.25rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-body-medium-tracking, 0.015625rem)"),
      },
      small: {
        fontSize: unsafeCSS("var(--md-sys-typescale-body-small-font-size, 0.75rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-body-small-font-weight, 400)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-body-small-line-height, 1rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-body-small-tracking, 0.025rem)"),
      },
    },

    /** Smaller, utilitarian text. */
    label: {
      large: {
        fontSize: unsafeCSS("var(--md-sys-typescale-label-large-font-size, 0.875rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-label-large-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-label-large-line-height, 1.25rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-label-large-tracking, 0.00625rem)"),
      },
      medium: {
        fontSize: unsafeCSS("var(--md-sys-typescale-label-medium-font-size, 0.75rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-label-medium-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-label-medium-line-height, 1rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-label-medium-tracking, 0.03125rem)"),
      },
      small: {
        fontSize: unsafeCSS("var(--md-sys-typescale-label-small-font-size, 0.6875rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-label-small-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-label-small-line-height, 1rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-label-small-tracking, 0.03125rem)"),
      },
    },
  },

  /** Emphasized typescale variant. */
  emphasized: {
    /** Short, important text or numerals. */
    display: {
      large: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-display-large-font-size, 3.5625rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-display-large-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-display-large-line-height, 4rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-display-large-tracking, 0.015625rem)"),
      },
      medium: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-display-medium-font-size, 2.8125rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-display-medium-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-display-medium-line-height, 3.25rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-display-medium-tracking, 0)"),
      },
      small: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-display-small-font-size, 2.25rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-display-small-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-display-small-line-height, 2.75rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-display-small-tracking, 0)"),
      },
    },

    /** Short, high-emphasis text on smaller screens. */
    headline: {
      large: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-headline-large-font-size, 2rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-headline-large-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-headline-large-line-height, 2.5rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-headline-large-tracking, 0)"),
      },
      medium: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-headline-medium-font-size, 1.75rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-headline-medium-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-headline-medium-line-height, 2.25rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-headline-medium-tracking, 0)"),
      },
      small: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-headline-small-font-size, 1.5rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-headline-small-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-headline-small-line-height, 2rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-headline-small-tracking, 0)"),
      },
    },

    /** Medium-emphasis text that remains relatively short. */
    title: {
      large: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-title-large-font-size, 1.375rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-title-large-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-title-large-line-height, 1.75rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-title-large-tracking, 0)"),
      },
      medium: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-title-medium-font-size, 1rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-title-medium-font-weight, 700)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-title-medium-line-height, 3.5rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-title-medium-tracking, 0.009375rem)"),
      },
      small: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-title-small-font-size, 0.875rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-title-small-font-weight, 700)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-title-small-line-height, 1.25rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-title-small-tracking, 0.00625rem)"),
      },
    },

    /** Longer passages of text. */
    body: {
      large: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-body-large-font-size, 1rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-body-large-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-body-large-line-height, 1.5rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-body-large-tracking, 0.03125rem)"),
      },
      medium: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-body-medium-font-size, 0.875rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-body-medium-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-body-medium-line-height, 1.25rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-body-medium-tracking, 0.015625rem)"),
      },
      small: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-body-small-font-size, 0.75rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-body-small-font-weight, 500)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-body-small-line-height, 1rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-body-small-tracking, 0.025rem)"),
      },
    },

    /** Smaller, utilitarian text. */
    label: {
      large: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-label-large-font-size, 0.875rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-label-large-font-weight, 700)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-label-large-line-height, 1.25rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-label-large-tracking, 0.00625rem)"),
      },
      medium: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-label-medium-font-size, 0.75rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-label-medium-font-weight, 700)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-label-medium-line-height, 1rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-label-medium-tracking, 0.03125rem)"),
      },
      small: {
        fontSize: unsafeCSS("var(--md-sys-typescale-emphasized-label-small-font-size, 0.6875rem)"),
        fontWeight: unsafeCSS("var(--md-sys-typescale-emphasized-label-small-font-weight, 700)"),
        lineHeight: unsafeCSS("var(--md-sys-typescale-emphasized-label-small-line-height, 1rem)"),
        tracking: unsafeCSS("var(--md-sys-typescale-emphasized-label-small-tracking, 0.03125rem)"),
      },
    },
  },
} as const;
