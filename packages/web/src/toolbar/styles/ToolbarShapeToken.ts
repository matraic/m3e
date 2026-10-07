import { CSSResult, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { ToolbarShape } from "../ToolbarShape";

/** @private */
type _ToolbarShapeToken = {
  shape: CSSResult;
  leadingSpace: CSSResult;
  trailingSpace: CSSResult;
  topSpace: CSSResult;
  bottomSpace: CSSResult;
};

/**
 * Component design tokens that control the shape variants of `M3eToolbarElement`.
 * @internal
 */
export const ToolbarShapeToken: Record<ToolbarShape, _ToolbarShapeToken> = {
  square: {
    shape: unsafeCSS(`var(--m3e-toolbar-square-shape, ${DesignToken.shape.corner.none})`),
    leadingSpace: unsafeCSS(`var(--m3e-toolbar-square-leading-space, ${DesignToken.measurement.space200})`),
    trailingSpace: unsafeCSS(`var(--m3e-toolbar-square-trailing-space, ${DesignToken.measurement.space200})`),
    topSpace: unsafeCSS(`var(--m3e-toolbar-square-top-space, ${DesignToken.measurement.space100})`),
    bottomSpace: unsafeCSS(`var(--m3e-toolbar-square-bottom-space, ${DesignToken.measurement.space100})`),
  },
  rounded: {
    shape: unsafeCSS(`var(--m3e-toolbar-rounded-shape, ${DesignToken.shape.corner.full})`),
    leadingSpace: unsafeCSS(`var(--m3e-toolbar-rounded-leading-space, ${DesignToken.measurement.space100})`),
    trailingSpace: unsafeCSS(`var(--m3e-toolbar-rounded-trailing-space, ${DesignToken.measurement.space100})`),
    topSpace: unsafeCSS(`var(--m3e-toolbar-rounded-top-space, ${DesignToken.measurement.space100})`),
    bottomSpace: unsafeCSS(`var(--m3e-toolbar-rounded-bottom-space, ${DesignToken.measurement.space100})`),
  },
} as const;
