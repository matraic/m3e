import { css, CSSResultGroup, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { HtmlFor, spaceSeparatedStringConverter } from "@m3e/web/core";

import { GestureRecognizer } from "./GestureRecognizer";
import { GestureInputButton } from "./GestureInputButton";
import { PointerType } from "./PointerInput";
import { GestureRecognizerOptions } from "./GestureRecognizerOptions";
import { createGestureRecognizer } from "./GestureRecognizerRegistry";
import { GestureRegistry } from "./GestureRegistry";
import { GestureInput } from "./GestureInput";

/**
 * A base implementation for an element used to detect gestures. This class must be inherited.
 * @template TOptions The type of options used to recognize gestures.
 */
export abstract class GestureElementBase<TOptions extends GestureRecognizerOptions> extends HtmlFor(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: none;
    }
  `;

  /** @private */ #recognizer: GestureRecognizer<TOptions> | null = null;

  /**
   * Initializes a new instance of this class.
   * @param {string} gestureType The type of gesture to recognize.
   */
  constructor(gestureType: string) {
    super();
    this.gestureType = gestureType;
  }

  /** The type of gesture to recognize. */
  readonly gestureType: string;

  /** The recognizer used to detect gestures. */
  get recognizer(): GestureRecognizer<TOptions> | null {
    if (this.#recognizer) return this.#recognizer;
    this.#recognizer = createGestureRecognizer(this.gestureType);
    if (this.#recognizer) {
      this.#recognizer.onGesture = (detail) => this.dispatchEvent(new CustomEvent("gesture", { detail }));
    }
    return this.#recognizer;
  }

  /**
   * The priority in which to recognize gestures.
   * @default 1
   */
  @property({ type: Number }) priority = 1;

  /**
   * Whether gesture recognition is disabled.
   * @default false
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * Which buttons can be pressed.
   * @default ["primary"]
   */
  @property({ converter: spaceSeparatedStringConverter })
  buttons: readonly GestureInputButton[] = ["primary"];

  /**
   * Which types of pointers can be used to recognize gestures.
   * @default ["mouse", "pen", "touch"]
   */
  @property({ attribute: "pointer-types", converter: spaceSeparatedStringConverter })
  pointerTypes: readonly PointerType[] = ["mouse", "pen", "touch"];

  /**
   * Optional predicate used to determine whether a recognizer should receive a given input.
   * @param {GestureInput} input The input to evaluate.
   * @returns {boolean} `true` if the recognizer should process the input; otherwise, `false`.
   */
  @property({ attribute: false }) inputFilter?: (input: GestureInput) => boolean;

  /** @private */
  override attach(control: HTMLElement): void {
    super.attach(control);

    if (this.recognizer) {
      GestureRegistry.addRecognizer(control, this.recognizer);
    }
  }

  /** @private */
  override detach(): void {
    if (this.control && this.recognizer) {
      GestureRegistry.removeRecognizer(this.control, this.recognizer);
    }

    super.detach();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("priority")) {
      this.recognizer?.updateOptions(<TOptions>{ priority: this.priority });
    }
    if (_changedProperties.has("disabled")) {
      this.recognizer?.updateOptions(<TOptions>{ disabled: this.disabled });
    }
    if (_changedProperties.has("buttons")) {
      this.recognizer?.updateOptions(<TOptions>{ buttons: this.buttons });
    }
    if (_changedProperties.has("pointerTypes")) {
      this.recognizer?.updateOptions(<TOptions>{ pointerTypes: this.pointerTypes });
    }
    if (_changedProperties.has("inputFilter")) {
      this.recognizer?.updateOptions(<TOptions>{ inputFilter: this.inputFilter });
    }
  }
}
