import { LitElement } from "lit";

import { Constructor } from "./Constructor";

/** Defines functionality for an element which supports reconnection logic. */
export interface ReconnectedCallbackMixin {
  /** Callback invoked when the element is connected after being disconnected. */
  reconnectedCallback(): void;
}

const _wasConnected = Symbol("_wasConnected");

/**
 * Mixin to augment an element with behavior that supports reconnection logic.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<ReconnectedCallbackMixin> & T} A constructor that implements `ReconnectedCallbackMixin`.
 */
export function ReconnectedCallback<T extends Constructor<LitElement>>(
  base: T,
): Constructor<ReconnectedCallbackMixin> & T {
  abstract class _ReconnectedCallbackMixin extends base implements ReconnectedCallbackMixin {
    /** @private */ private [_wasConnected] = false;

    /** @inheritdoc */
    reconnectedCallback(): void {}

    /** @inheritdoc */
    override connectedCallback(): void {
      super.connectedCallback();
      if (this[_wasConnected]) {
        this.reconnectedCallback();
      }
    }

    /** @inheritdoc */
    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this[_wasConnected] = true;
    }
  }
  return _ReconnectedCallbackMixin;
}
