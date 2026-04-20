import { svg, SVGTemplateResult } from "lit";

import { IconVariant } from "./IconVariant";

/** @private */ const PATH_DATA_PATTERN = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/;
/** @private */ const VIEW_BOX_PATTERN = /^-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s+-?\d+(\.\d+)?$/;

/** Encapsulates information used to construct an SVG. */
export type SvgIconInfo = {
  /** The viewbox of the SVG. */
  viewBox: string;

  /** The path of the SVG. */
  path: string;
};

/** Represents the fill-axis SVG data for a single icon. */
export type SvgIconFillSet = {
  /** The unfilled (FILL=0) SVG representation (or path assuming viewBox="0 -960 960 960") of the icon. */
  outlined: SvgIconInfo | string;

  /** The filled (FILL=1) SVG representation (or path assuming viewBox="0 -960 960 960") of the icon. */
  filled: SvgIconInfo | string;
};

/**
 * Service to register and display icons used by the `m3e-icon` component.
 * @internal
 */
export class IconRegistry {
  /** @private */
  static readonly #icons = new Map<string, { outlined: SVGTemplateResult; filled: SVGTemplateResult }>();

  /** @private */ static readonly #observers = new Map<string, Array<() => void>>();

  /**
   * Adds an icon to the registry for the given variant and weight.
   * @param {string} name The name of the icon.
   * @param {IconVariant} variant The variant of the icon.
   * @param {SvgIconFillSet} fillSet The SVG data for both fill states (outlined and filled) of the icon.
   */
  static addIcon(name: string, variant: IconVariant, fillSet: SvgIconFillSet): void {
    const trustOutlinedViewBox = typeof fillSet.outlined === "string";
    const trustFilledViewBox = typeof fillSet.filled === "string";

    if (typeof fillSet.outlined === "string") {
      fillSet.outlined = {
        viewBox: "0 -960 960 960",
        path: fillSet.outlined,
      };
    }
    if (typeof fillSet.filled === "string") {
      fillSet.filled = {
        viewBox: "0 -960 960 960",
        path: fillSet.filled,
      };
    }

    this.#validateSvgIconInfo(name, variant, fillSet.outlined, trustOutlinedViewBox);
    this.#validateSvgIconInfo(name, variant, fillSet.filled, trustFilledViewBox);

    if (window !== undefined) {
      const key = this.#createKey(name, variant);
      this.#icons.set(key, {
        outlined: svg`<svg viewBox="${fillSet.outlined.viewBox}"><path d="${fillSet.outlined.path}"/></svg>`,
        filled: svg`<svg viewBox="${fillSet.filled.viewBox}"><path d="${fillSet.filled.path}"/></svg>`,
      });

      this.#observers.get(key)?.forEach((x) => x());
    }
  }

  /**
   * Determines whether an icon is registered for the given variant.
   * @param {string} name The name of the icon.
   * @param {IconVariant} variant The variant of the icon.
   * @returns {boolean} Whether `icon` is registered for the given `variant`.
   */
  static isIconRegistered(name: string, variant: IconVariant): boolean {
    return window !== undefined && this.#icons.has(this.#createKey(name, variant));
  }

  /**
   * Renders an icon from the registry.
   * @param {string} name The name of the icon.
   * @param {IconVariant} variant The variant of the icon.
   * @param {boolean} filled Whether to render a filled variant of the icon.
   * @returns {SVGTemplateResult | undefined} A `SVGTemplateResult` used to render the icon.
   */
  static renderIcon(name: string, variant: IconVariant, filled: boolean): SVGTemplateResult | undefined {
    const data = this.#icons.get(this.#createKey(name, variant));
    return filled ? data?.filled : data?.outlined;
  }

  /**
   * Begins observing registration for the specified icon.
   * @param {string} name The name of the icon to observe.
   * @param {IconVariant} variant The variant of the icon to observe.
   * @param {() => void} callback Callback invoked when the specified icon is registered for the given variant.
   * @returns {() => void} Function used to stop observing.
   */
  static observe(name: string, variant: IconVariant, callback: () => void): () => void {
    if (window === undefined) return () => {};

    const key = this.#createKey(name, variant);
    if (!this.#observers.has(key)) {
      this.#observers.set(key, [callback]);
    } else {
      this.#observers.get(key)?.push(callback);
    }

    return () => {
      const callbacks = this.#observers.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index >= 0) {
          callbacks.splice(index, 1);
        }
        if (callbacks.length == 0) {
          this.#observers.delete(key);
        }
      }
    };
  }

  /** @private */
  static #createKey(name: string, variant: IconVariant): string {
    return `${variant}-${name}`;
  }

  /** @private */
  static #validateSvgIconInfo(name: string, variant: IconVariant, info: SvgIconInfo, trustViewBox = false): void {
    if (!trustViewBox && !VIEW_BOX_PATTERN.test(info.viewBox)) {
      throw new Error(`Unable to register icon '${name}' for variant '${variant}'. Invalid viewbox data.`);
    }
    if (!PATH_DATA_PATTERN.test(info.path)) {
      throw new Error(`Unable to register icon '${name}' for variant '${variant}'. Invalid path data.`);
    }
  }
}
