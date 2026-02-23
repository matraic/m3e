import { LitElement } from "lit";

import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";

/** Defines functionality for an element that can be marked as dirty. */
export interface DirtyMixin {
  /** Whether the user has not modified the value of the element. */
  readonly pristine: boolean;

  /** Whether the user has modified the value of the element. */
  readonly dirty: boolean;

  /** Marks the element as pristine. */
  markAsPristine(): void;

  /** Marks the element as dirty. */
  markAsDirty(): void;
}

/**
 * Determines whether a value is a `DirtyMixin`.
 * @param {unknown} value The value to test.
 * @returns A value indicating whether `value` is a `DirtyMixin`.
 */
export function isDirtyMixin(value: unknown): value is DirtyMixin {
  return hasKeys<DirtyMixin>(value, "dirty", "pristine", "markAsDirty", "markAsPristine");
}

const _eventHandler = Symbol("_eventHandler");

/**
 * Mixin to augment an element with functionality used to mark it as dirty.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<DirtyMixin> & T} A constructor that implements `DirtyMixin`.
 */
export function Dirty<T extends Constructor<LitElement>>(base: T): Constructor<DirtyMixin> & T {
  abstract class _Dirty extends base implements DirtyMixin {
    /** @private */
    private [_eventHandler] = () => this.markAsDirty();

    /** Whether the user has modified the value of the element. */
    get dirty(): boolean {
      return this.classList.contains("-dirty");
    }

    /** Whether the user has not modified the value of the element. */
    get pristine(): boolean {
      return !this.dirty;
    }

    /** @inheritdoc */
    override connectedCallback(): void {
      this.markAsPristine();
      super.connectedCallback();
      this.addEventListener("change", this[_eventHandler]);
    }

    /** @inheritdoc */
    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener("change", this[_eventHandler]);
    }

    /** Marks the element as pristine. */
    markAsPristine(): void {
      this.classList.toggle("-dirty", false);
    }

    /** Marks the element as dirty. */
    markAsDirty(): void {
      this.classList.toggle("-dirty", true);
    }
  }

  return _Dirty;
}
