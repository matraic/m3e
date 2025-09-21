/**
 * Adapted from Angular Material CDK Directionality
 * Source: https://github.com/angular/components/blob/main/src/cdk/bidi/directionality.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

import { isServer } from "lit";

/** Taken from `goog.i18n.bidi.isRtlLanguage`. */
const RTL_LOCALES =
  /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;

/** Specifies the directionalities for a document. */
export type Direction = "ltr" | "rtl";

/** Utility used to determine the directionality of the current document. */
export class M3eDirectionality {
  /** @private */ static #current: Direction = "ltr";
  /** @private */ static readonly #observers = Array<() => void>();

  static {
    if (!isServer) {
      this.#updateDirection();

      if (MutationObserver) {
        const init: MutationObserverInit = { attributeFilter: ["dir"] };
        const observer = new MutationObserver(() => this.#handleChange());
        if (document.body) {
          observer.observe(document.body, init);
        }
        if (document.documentElement) {
          observer.observe(document.documentElement, init);
        }
      }

      window.addEventListener("languagechange", () => this.#handleChange());
    }
  }

  /** The directionality of the current document. */
  static get current(): Direction {
    return this.#current;
  }

  /**
   * Observes changes to directionality.
   * @param {()=>void} callback Function invoked when directionality changes.
   * @returns {()=>void} A function used to unobserve changes.
   */
  static observe(callback: () => void): () => void {
    this.#observers.push(callback);
    return () => {
      this.#observers.splice(this.#observers.indexOf(callback), 1);
    };
  }

  /** @private */
  static #updateDirection() {
    const _dir = (document?.body?.dir || document?.documentElement?.dir)?.toLowerCase() || "auto";
    this.#current =
      _dir === "auto" && !isServer && navigator?.language
        ? RTL_LOCALES.test(navigator.language)
          ? "rtl"
          : "ltr"
        : _dir === "rtl"
        ? "rtl"
        : "ltr";
  }

  /** @private */
  static #handleChange(): void {
    this.#updateDirection();
    this.#observers.forEach((x) => x());
  }
}

declare global {
  /** Utility used to determine the directionality of the current document. */
  var M3eDirectionality: M3eDirectionality;
}

globalThis.M3eDirectionality = M3eDirectionality;
