import { css, CSSResultGroup, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { HtmlFor, spaceSeparatedStringConverter } from "@m3e/web/core";

import { GestureDetector } from "./GestureDetector";
import { GestureRecognizer } from "./GestureRecognizer";
import { GestureInputButton } from "./GestureInputButton";
import { HtmlGestureInputSource } from "./HtmlGestureInputSource";
import { PointerType } from "./PointerInput";
import { GestureDetailOf, GestureRecognizerOptions } from "./GestureRecognizerOptions";
import { createGestureRecognizer } from "./GestureRecognizerRegistry";

/**
 * A base implementation for an element used to detect gestures. This class must be inherited.
 * @template TOptions The type of options used to recognize gestures.
 */
export abstract class GestureElementBase<
  TOptions extends GestureRecognizerOptions<GestureDetailOf<TOptions>>,
> extends HtmlFor(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: none;
    }
  `;

  /** @private */ static readonly #detectors = new Map<HTMLElement, GestureDetector>();
  /** @private */ static readonly #sources = new Map<HTMLElement, HtmlGestureInputSource>();
  /** @private */ #recognizer: GestureRecognizer<TOptions> | null = null;

  /** The type of gesture to recognize. */
  abstract gestureType: string;

  /** The recognizer used to detect gestures. */
  get recognizer(): GestureRecognizer<TOptions> | null {
    if (this.#recognizer) return this.#recognizer;
    this.#recognizer = createGestureRecognizer(this.gestureType);
    this.#recognizer?.updateOptions(<TOptions>{
      onGesture: (detail: GestureDetailOf<TOptions>) => {
        this.dispatchEvent(new CustomEvent("gesture", { detail }));
      },
    });
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

  /** @private */
  override attach(control: HTMLElement): void {
    super.attach(control);

    let source = GestureElementBase.#sources.get(control);
    if (!source) {
      source = new HtmlGestureInputSource(control);
      GestureElementBase.#sources.set(control, source);
    }

    let detector = GestureElementBase.#detectors.get(control);
    if (!detector) {
      detector = new GestureDetector(source);
      GestureElementBase.#detectors.set(control, detector);
    }

    detector.addRecognizer(<GestureRecognizer>(<unknown>this.recognizer));
  }

  /** @private */
  override detach(): void {
    if (this.control) {
      const detector = GestureElementBase.#detectors.get(this.control);
      if (detector) {
        detector.removeRecognizer(<GestureRecognizer>(<unknown>this.recognizer));
        if (detector.size === 0) {
          GestureElementBase.#detectors.delete(this.control);
          GestureElementBase.#sources.get(this.control)?.destroy();
          GestureElementBase.#sources.delete(this.control);
        }
      }
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
  }
}
