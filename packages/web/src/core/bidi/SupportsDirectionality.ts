import { LitElement } from "lit";

import { AttachInternalsMixin, deleteCustomState, setCustomState } from "@m3e/web/core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = abstract new (...args: any[]) => T;

/**
 * Mixin to augment an element with behavior that supports styling based on directionality, avoiding the need to use :dir.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {T} A class that extends `base` with directionality styling support.
 */
export function SupportsDirectionality<T extends Constructor<LitElement & AttachInternalsMixin>>(base: T): T {
  abstract class _SupportsDirectionalityMixin extends base {
    /** @private */ #directionalitySubscription?: () => void;

    /** @inheritdoc */
    override connectedCallback(): void {
      super.connectedCallback();
      this.#directionalitySubscription?.();
      this.#directionalitySubscription = M3eDirectionality.observe(() =>
        setCustomState(this, "--rtl", M3eDirectionality.current === "rtl"),
      );
      setCustomState(this, "--rtl", M3eDirectionality.current === "rtl");
    }

    /** @inheritdoc */
    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.#directionalitySubscription?.();
      deleteCustomState(this, "--rtl");
    }
  }

  return _SupportsDirectionalityMixin;
}
