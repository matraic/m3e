import { GestureInput } from "./GestureInput";
import { GestureInputSource } from "./GestureInputSource";
import { PointerInput, PointerType } from "./PointerInput";
import { WheelInput } from "./WheelInput";

/**
 * Provides input from an HTML element for gesture detection.
 * @internal
 */
export class HtmlGestureInputSource implements GestureInputSource {
  /** @private */ readonly #element: HTMLElement;
  /** @private */ readonly #pointerEventHandler = (e: PointerEvent) => this.#handlePointerEvent(e);
  /** @private */ readonly #wheelEventHandler = (e: WheelEvent) => this.#handleWheelEvent(e);
  /** @private */ readonly #preventDefaultHandler = (e: Event) => this.#handlePreventDefault(e);

  /**
   * Initializes a new instance of this class.
   * @param {HTMLElement} element The element from which to provide a source of input for gesture detection.
   */
  constructor(element: HTMLElement) {
    this.#element = element;

    this.#element.addEventListener("pointerover", this.#pointerEventHandler);
    this.#element.addEventListener("pointerenter", this.#pointerEventHandler);
    this.#element.addEventListener("pointerdown", this.#pointerEventHandler);
    this.#element.addEventListener("pointermove", this.#pointerEventHandler);
    this.#element.addEventListener("pointerup", this.#pointerEventHandler);
    this.#element.addEventListener("pointercancel", this.#pointerEventHandler);
    this.#element.addEventListener("pointerleave", this.#pointerEventHandler);
    this.#element.addEventListener("pointerout", this.#pointerEventHandler);
    this.#element.addEventListener("lostpointercapture", this.#pointerEventHandler);
    this.#element.addEventListener("wheel", this.#wheelEventHandler, { passive: true });
    this.#element.addEventListener("gesturestart", this.#preventDefaultHandler);
    this.#element.addEventListener("gesturechange", this.#preventDefaultHandler);
    this.#element.addEventListener("gestureend", this.#preventDefaultHandler);
  }

  /** @inheritdoc */
  onInput?: (input: GestureInput) => void;

  /** Destroys the input source. */
  destroy(): void {
    this.#element.removeEventListener("pointerover", this.#pointerEventHandler);
    this.#element.removeEventListener("pointerenter", this.#pointerEventHandler);
    this.#element.removeEventListener("pointerdown", this.#pointerEventHandler);
    this.#element.removeEventListener("pointermove", this.#pointerEventHandler);
    this.#element.removeEventListener("pointerup", this.#pointerEventHandler);
    this.#element.removeEventListener("pointercancel", this.#pointerEventHandler);
    this.#element.removeEventListener("pointerleave", this.#pointerEventHandler);
    this.#element.removeEventListener("pointerout", this.#pointerEventHandler);
    this.#element.removeEventListener("lostpointercapture", this.#pointerEventHandler);
    this.#element.removeEventListener("wheel", this.#wheelEventHandler);
    this.#element.removeEventListener("gesturestart", this.#preventDefaultHandler);
    this.#element.removeEventListener("gesturechange", this.#preventDefaultHandler);
    this.#element.removeEventListener("gestureend", this.#preventDefaultHandler);
  }

  /** @private */
  #createPointerInput(e: PointerEvent): PointerInput {
    return {
      id: e.pointerId,
      type: e.type,
      currentTarget: <HTMLElement>e.currentTarget,
      target: <HTMLElement>e.target,
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      button: e.button,
      buttons: e.buttons,
      pointerType: <PointerType>e.pointerType,
      clientX: e.clientX,
      clientY: e.clientY,
      timestamp: e.timeStamp,
    };
  }

  /** @private */
  #createWheelInput(e: WheelEvent): WheelInput {
    return {
      id: -1,
      type: e.type,
      currentTarget: <HTMLElement>e.currentTarget,
      target: <HTMLElement>e.target,
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      metaKey: e.metaKey,
      button: e.button,
      buttons: e.buttons,
      deltaX: e.deltaX,
      deltaY: e.deltaY,
      deltaZ: e.deltaZ,
      deltaMode: e.deltaMode,
      timestamp: e.timeStamp,
    };
  }

  /** @private */
  #handlePointerEvent(e: PointerEvent): void {
    this.onInput?.(this.#createPointerInput(e));
  }

  /** @private */
  #handleWheelEvent(e: WheelEvent): void {
    this.onInput?.(this.#createWheelInput(e));
  }

  /** @private */
  #handlePreventDefault(e: Event): void {
    e.preventDefault();
  }
}
