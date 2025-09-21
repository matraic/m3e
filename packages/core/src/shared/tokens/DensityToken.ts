import { CSSResult, unsafeCSS } from "lit";

const _DensityToken = {
  /** Base density multiplier. */
  scale: unsafeCSS("var(--md-sys-density-scale, 0)"),

  /** Spatial unit used to scale component dimensions based on density. */
  size: unsafeCSS("var(--md-sys-density-size, 0.25rem)"),
} as const;

/** Design tokens that control density. */
export const DensityToken = {
  ..._DensityToken,

  /**
   * Creates a CSS `calc` that calculates a dimension based on density.
   * @param {number} minScale The minimum supported scale.
   * @returns {CSSResult} A CSS `calc` used to calculate a dimension based on density.
   */
  calc(minScale: number): CSSResult {
    return unsafeCSS(`calc(max(${minScale}, ${_DensityToken.scale}) * ${_DensityToken.size})`);
  },
} as const;
