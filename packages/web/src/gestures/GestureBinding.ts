import { GestureInput, PointerInput, WheelInput, GestureInputKind, PointerType } from "./GestureInput";
import { GestureRecognizer } from "./GestureRecognizer";
import { GestureResolver } from "./GestureResolver";

/**
 * Binds an element to gesture recognizers.
 * @internal
 */
export class GestureBinding {
  /** @private */ readonly #resolver = new GestureResolver();
  /** @private */ readonly #releasedCaptures = new Set<number>();
  /** @private */ readonly #pointerEventHandler = (e: PointerEvent) => this.#handlePointerEvent(e);
  /** @private */ readonly #wheelEventHandler = (e: WheelEvent) => this.#handleWheelEvent(e);
  /** @private */ readonly #preventDefaultHandler = (e: Event) => e.preventDefault();
  /** @private */ readonly #resizeObserver?: ResizeObserver;
  /** @private */ #cachedElementBounds?: DOMRect;

  /**
   * Initializes new instance of this class.
   * @param {HTMLElement} element The element to bind for gesture input.
   */
  constructor(public readonly element: HTMLElement) {
    element.addEventListener("pointerover", this.#pointerEventHandler);
    element.addEventListener("pointerenter", this.#pointerEventHandler);
    element.addEventListener("pointerdown", this.#pointerEventHandler);
    element.addEventListener("pointermove", this.#pointerEventHandler);
    element.addEventListener("pointerup", this.#pointerEventHandler);
    element.addEventListener("pointercancel", this.#pointerEventHandler);
    element.addEventListener("pointerleave", this.#pointerEventHandler);
    element.addEventListener("pointerout", this.#pointerEventHandler);
    element.addEventListener("lostpointercapture", this.#pointerEventHandler);
    element.addEventListener("wheel", this.#wheelEventHandler, { passive: true });
    element.addEventListener("gesturestart", this.#preventDefaultHandler);
    element.addEventListener("gesturechange", this.#preventDefaultHandler);
    element.addEventListener("gestureend", this.#preventDefaultHandler);

    if (window !== undefined && window.ResizeObserver) {
      this.#resizeObserver = new ResizeObserver(() => (this.#cachedElementBounds = undefined));
      this.#resizeObserver.observe(element);
    }
  }

  /** Whether there are no recognizers registered with this binding. */
  get empty(): boolean {
    return this.#resolver.recognizers.length == 0;
  }

  /**
   * Registers one or more recognizers with this binding.
   * @param {readonly GestureRecognizer[]} recognizers The recognizers to add.
   */
  addRecognizer(...recognizers: readonly GestureRecognizer[]): void {
    recognizers.forEach((x) => this.#resolver.addRecognizer(x));
  }

  /**
   * Unregisters one or more recognizers from this binding.
   * @param {readonly GestureRecognizer[]} recognizers The recognizers to remove.
   */
  removeRecognizer(...recognizers: readonly GestureRecognizer[]): void {
    recognizers.forEach((x) => this.#resolver.removeRecognizer(x));
  }

  /** Resets the binding to its initial state. */
  reset(): void {
    for (const id of this.#releasedCaptures) {
      if (this.element.hasPointerCapture(id)) {
        this.element.releasePointerCapture(id);
      }
    }

    this.#cachedElementBounds = undefined;
    this.#releasedCaptures.clear();
    this.#resolver.clear();
  }

  /** Removes all recognizers and detaches all event listeners. */
  destroy(): void {
    this.#resizeObserver?.disconnect();
    this.#cachedElementBounds = undefined;
    this.#releasedCaptures.clear();
    this.#resolver.destroy();

    this.element.removeEventListener("pointerover", this.#pointerEventHandler);
    this.element.removeEventListener("pointerenter", this.#pointerEventHandler);
    this.element.removeEventListener("pointerdown", this.#pointerEventHandler);
    this.element.removeEventListener("pointermove", this.#pointerEventHandler);
    this.element.removeEventListener("pointerup", this.#pointerEventHandler);
    this.element.removeEventListener("pointercancel", this.#pointerEventHandler);
    this.element.removeEventListener("pointerleave", this.#pointerEventHandler);
    this.element.removeEventListener("pointerout", this.#pointerEventHandler);
    this.element.removeEventListener("lostpointercapture", this.#pointerEventHandler);
    this.element.removeEventListener("wheel", this.#wheelEventHandler);
    this.element.removeEventListener("gesturestart", this.#preventDefaultHandler);
    this.element.removeEventListener("gesturechange", this.#preventDefaultHandler);
    this.element.removeEventListener("gestureend", this.#preventDefaultHandler);
  }

  /** @private */
  #handlePointerEvent(e: PointerEvent): void {
    let input = this.#createPointerInput(e);

    if (e.type === "lostpointercapture") {
      // Ignore intentionally released pointer captures.
      if (this.#releasedCaptures.has(input.inputId)) {
        this.#releasedCaptures.delete(input.inputId);
        return;
      }

      // Convert lostpointercapture to a pointercancel to inform recognizers they should cancel gestures.
      input = { ...input, kind: "pointercancel" };
    }

    this.#dispatchInput(input);

    switch (e.type) {
      case "pointerdown":
      case "pointermove":
        // Capture pointer if any recognizer requires capture.
        if (
          this.#resolver.recognizers.some((x) => x.shouldCapturePointer(input)) &&
          !input.currentTarget.hasPointerCapture(input.inputId)
        ) {
          input.currentTarget.setPointerCapture(input.inputId);
        }
        break;

      case "pointerup":
      case "pointercancel":
        // Resolve dispositions on input for terminal events.
        this.#resolver.resolve(input.inputId);

        // Release pointer capture.
        if (input.currentTarget.hasPointerCapture(input.inputId)) {
          input.currentTarget.releasePointerCapture(input.inputId);
          this.#releasedCaptures.add(input.inputId);
        }
        break;
    }
  }

  /** @private */
  #handleWheelEvent(e: WheelEvent): void {
    this.#dispatchInput(this.#createWheelInput(e));
  }

  /** @private */
  #dispatchInput(input: GestureInput): void {
    for (const recognizer of this.#resolver.recognizers) {
      if (recognizer.canReceiveInput(input)) {
        recognizer.onInput(input);
      }
    }
  }

  /** @private */
  #createPointerInput(e: PointerEvent): PointerInput {
    const bounds = this.#cachedElementBounds ?? (this.#cachedElementBounds = this.element.getBoundingClientRect());
    return {
      inputId: e.pointerId,
      kind: <GestureInputKind>e.type,
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
      localX: e.clientX - bounds.left,
      localY: e.clientY - bounds.top,
      timestamp: e.timeStamp,
    };
  }

  /** @private */
  #createWheelInput(e: WheelEvent): WheelInput {
    return {
      inputId: -1,
      kind: <GestureInputKind>e.type,
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
}
