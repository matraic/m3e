import { CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@pulse/web/core";

import { CalloutVariant } from "../CalloutVariant";

/** @private */
type _CalloutVariantToken = {
  labelTextColor: CSSResult;
  iconColor: CSSResult;
  containerColor: CSSResult;
  contentColor: CSSResult;
  leadingAccentColor: CSSResult;
};

/**
 * Component design tokens that control the appearance variants of `M3eCalloutElement`.
 * @internal
 */
export const CalloutVariantToken: Record<CalloutVariant, _CalloutVariantToken> = {
  primary: {
    containerColor: unsafeCSS(
      `var(--m3e-primary-container-callout-container-color, var(--m3e-callout-container-color, ${DesignToken.color.primaryContainer}))`,
    ),
    labelTextColor: unsafeCSS(
      `var(--m3e-primary-container-callout-label-text-color, var(--m3e-callout-label-text-color, ${DesignToken.color.onPrimaryContainer}))`,
    ),
    iconColor: unsafeCSS(
      `var(--m3e-primary-container-callout-icon-color, var(--m3e-callout-icon-color, ${DesignToken.color.onPrimaryContainer}))`,
    ),
    contentColor: unsafeCSS(
      `var(--m3e-primary-container-callout-content-color, var(--m3e-callout-content-color, ${DesignToken.color.onPrimaryContainer}))`,
    ),
    leadingAccentColor: unsafeCSS(
      `var(--m3e-primary-container-callout-leading-accent-color, var(--m3e-callout-leading-accent-color, ${DesignToken.color.primary}))`,
    ),
  },
  secondary: {
    containerColor: unsafeCSS(
      `var(--m3e-secondary-container-callout-container-color, var(--m3e-callout-container-color, ${DesignToken.color.secondaryContainer}))`,
    ),
    labelTextColor: unsafeCSS(
      `var(--m3e-secondary-container-callout-label-text-color, var(--m3e-callout-label-text-color, ${DesignToken.color.onSecondaryContainer}))`,
    ),
    iconColor: unsafeCSS(
      `var(--m3e-secondary-container-callout-icon-color, var(--m3e-callout-icon-color, ${DesignToken.color.onSecondaryContainer}))`,
    ),
    contentColor: unsafeCSS(
      `var(--m3e-secondary-container-callout-content-color, var(--m3e-callout-content-color, ${DesignToken.color.onSecondaryContainer}))`,
    ),
    leadingAccentColor: unsafeCSS(
      `var(--m3e-secondary-container-callout-leading-accent-color, var(--m3e-callout-leading-accent-color, ${DesignToken.color.secondary}))`,
    ),
  },
  tertiary: {
    containerColor: unsafeCSS(
      `var(--m3e-tertiary-container-callout-container-color, var(--m3e-callout-container-color, ${DesignToken.color.tertiaryContainer}))`,
    ),
    labelTextColor: unsafeCSS(
      `var(--m3e-tertiary-container-callout-label-text-color, var(--m3e-callout-label-text-color, ${DesignToken.color.onTertiaryContainer}))`,
    ),
    iconColor: unsafeCSS(
      `var(--m3e-tertiary-container-callout-icon-color, var(--m3e-callout-icon-color, ${DesignToken.color.onTertiaryContainer}))`,
    ),
    contentColor: unsafeCSS(
      `var(--m3e-tertiary-container-callout-content-color, var(--m3e-callout-content-color, ${DesignToken.color.onTertiaryContainer}))`,
    ),
    leadingAccentColor: unsafeCSS(
      `var(--m3e-tertiary-container-callout-leading-accent-color, var(--m3e-callout-leading-accent-color, ${DesignToken.color.tertiary}))`,
    ),
  },
  error: {
    containerColor: unsafeCSS(
      `var(--m3e-error-container-callout-container-color, var(--m3e-callout-container-color, ${DesignToken.color.errorContainer}))`,
    ),
    labelTextColor: unsafeCSS(
      `var(--m3e-error-container-callout-label-text-color, var(--m3e-callout-label-text-color, ${DesignToken.color.onErrorContainer}))`,
    ),
    iconColor: unsafeCSS(
      `var(--m3e-error-container-callout-icon-color, var(--m3e-callout-icon-color, ${DesignToken.color.onErrorContainer}))`,
    ),
    contentColor: unsafeCSS(
      `var(--m3e-error-container-callout-content-color, var(--m3e-callout-content-color, ${DesignToken.color.onErrorContainer}))`,
    ),
    leadingAccentColor: unsafeCSS(
      `var(--m3e-error-container-callout-leading-accent-color, var(--m3e-callout-leading-accent-color, ${DesignToken.color.error}))`,
    ),
  },
  surface: {
    containerColor: unsafeCSS(
      `var(--m3e-surface-callout-container-color, var(--m3e-callout-container-color, ${DesignToken.color.surfaceContainer}))`,
    ),
    labelTextColor: unsafeCSS(
      `var(--m3e-surface-callout-label-text-color, var(--m3e-callout-label-text-color, ${DesignToken.color.onSurface}))`,
    ),
    iconColor: unsafeCSS(
      `var(--m3e-surface-callout-icon-color, var(--m3e-callout-icon-color, ${DesignToken.color.onSurface}))`,
    ),
    contentColor: unsafeCSS(
      `var(--m3e-surface-callout-content-color, var(--m3e-callout-content-color, ${DesignToken.color.onSurface}))`,
    ),
    leadingAccentColor: unsafeCSS(
      `var(--m3e-surface-callout-leading-accent-color, var(--m3e-callout-leading-accent-color, ${DesignToken.color.outlineVariant}))`,
    ),
  },
} as const;
