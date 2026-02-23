import { LitElement } from "lit";

import { Constructor } from "./Constructor";

/**
 * Mixin that adds support for custom event attributes.
 * @template T The type of base class from which to inherit.
 * @param {T} base The base class from which to inherit.
 * @param {string[]} types The types of event attributes.
 * @returns {T} A class extending `base` that supports custom event attributes.
 */
export function EventAttribute<T extends Constructor<LitElement>>(base: T, ...types: string[]): T {
  abstract class _EventAttribute extends base {
    /** @internal */
    override dispatchEvent(event: Event): boolean {
      if (types.includes(event.type)) {
        const eventAttribute = this.getAttribute(`on${event.type}`);
        if (eventAttribute) {
          new Function("e", `${eventAttribute};`).call(this, event);
        }
      }
      return super.dispatchEvent(event);
    }
  }
  return _EventAttribute;
}
