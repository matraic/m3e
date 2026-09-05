import { css, CSSResultGroup, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { HtmlFor, spaceSeparatedStringConverter } from "@m3e/web/core";

import { GestureInputButton } from "./GestureInputButton";
import { PointerType } from "./PointerInput";
import { GestureRecognizerOptions } from "./GestureRecognizerOptions";
import { GestureInput } from "./GestureInput";
import { detectGesture, GestureController } from "./detectGesture";
import { GestureDetail } from "./GestureDetail";

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

  /** @private */ #gestureController?: GestureController<GestureDetail, TOptions>;

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
  get gestureController(): GestureController<GestureDetail, TOptions> {
    if (!this.#gestureController) {
      this.#gestureController = detectGesture<GestureDetail, TOptions>(this.gestureType, {}, (detail) =>
        this.dispatchEvent(new CustomEvent("gesture", { detail })),
      );
    }
    return this.#gestureController;
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
    this.gestureController.attach(control);
  }

  /** @private */
  override detach(): void {
    this.gestureController.detach();
    super.detach();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("priority")) {
      this.gestureController.update(<TOptions>{ priority: this.priority });
    }
    if (_changedProperties.has("disabled")) {
      this.gestureController.update(<TOptions>{ disabled: this.disabled });
    }
    if (_changedProperties.has("buttons")) {
      this.gestureController.update(<TOptions>{ buttons: this.buttons });
    }
    if (_changedProperties.has("pointerTypes")) {
      this.gestureController.update(<TOptions>{ pointerTypes: this.pointerTypes });
    }
    if (_changedProperties.has("inputFilter")) {
      this.gestureController.update(<TOptions>{ inputFilter: this.inputFilter });
    }
  }
}
