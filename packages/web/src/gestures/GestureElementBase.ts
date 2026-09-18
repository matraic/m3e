import { css, CSSResultGroup, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { HtmlFor, spaceSeparatedStringConverter } from "@m3e/web/core";

import { GestureBinder } from "./GestureBinder";
import { GestureDetail } from "./GestureDetail";
import { GestureInput, PointerType } from "./GestureInput";
import { DefaultGestureOptions, GestureInputButton, GestureOptions } from "./GestureOptions";
import { GestureListener, GestureRecognizer } from "./GestureRecognizer";

/**
 * A base implementation for a non-visual element used to detect and interpret gestures from an
 * input stream produced from an attached element. This class must be inherited.
 * @template TOptions The type of options used to detect and interpret gestures.
 * @template TDetail The type of semantic detail emitted for a gesture.
 */
export abstract class GestureElementBase<
  TOptions extends GestureOptions,
  TDetail extends GestureDetail,
> extends HtmlFor(LitElement) {
  /** @private */ readonly #gestureListener: GestureListener<TDetail> = (detail) =>
    this.dispatchEvent(new CustomEvent<GestureDetail>("gesture", { detail }));

  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: none;
    }
  `;

  /** The recognizer used to detect and interpret gestures. */
  abstract readonly recognizer: GestureRecognizer<TOptions, TDetail>;

  /**
   * Whether gesture recognition is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: false }) disabled = false;

  /**
   * The priority in which to recognize gestures.
   * @default 1
   */
  @property({ type: Number, reflect: false }) priority = DefaultGestureOptions.priority;

  /**
   * Which buttons can be pressed.
   * @default ["primary"]
   */
  @property({ converter: spaceSeparatedStringConverter, reflect: false })
  buttons: readonly GestureInputButton[] = DefaultGestureOptions.buttons;

  /**
   * Which types of pointers can be used to recognize gestures.
   * @default ["mouse", "pen", "touch"]
   */
  @property({ attribute: "pointer-types", converter: spaceSeparatedStringConverter, reflect: false })
  pointerTypes: readonly PointerType[] = DefaultGestureOptions.pointerTypes;

  /**
   * Optional predicate used to determine whether input can be used to recognize gestures.
   * @param {GestureInput} input The input to evaluate.
   * @returns {boolean} `true` if the recognizer should process the input; otherwise, `false`.
   */
  @property({ attribute: false, reflect: false }) inputFilter?: (input: GestureInput) => boolean;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.recognizer.addListener(this.#gestureListener);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.recognizer.removeListener(this.#gestureListener);
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);
    GestureBinder.bind(control, this.recognizer);
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control) {
      GestureBinder.unbind(this.control, this.recognizer);
    }
    super.detach();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("disabled")) {
      this.recognizer.disabled = this.disabled;
    }

    this.recognizer.options = {
      priority: this.priority,
      buttons: this.buttons,
      pointerTypes: this.pointerTypes,
      inputFilter: this.inputFilter,
    } as TOptions;
  }
}
