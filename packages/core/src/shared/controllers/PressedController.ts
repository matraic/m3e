import { ReactiveControllerHost } from "lit";

import { MonitorControllerBase, MonitorControllerOptions } from "./MonitorControllerBase";

/** The callback function invoked when the pressed state of an element changes. */
export type PressedControllerCallback = (
  pressed: boolean,
  point: { x: number; y: number },
  target: HTMLElement
) => void;

/** Encapsulates options used to configure a `PressedController`. */
export interface PressedControllerOptions extends MonitorControllerOptions {
  /** The callback invoked when the pressed state of an element changes. */
  callback: PressedControllerCallback;

  /** The minimum amount of time, in milliseconds, to retain a pressed state. */
  minPressedDuration?: number;

  /** Whether events are captured. */
  capture?: boolean;

  /**
   * A function used to determine whether a given keyboard key toggles the pressed state.
   * @param key The `KeyboardEvent.key` to test.
   * @returns Whether `key` toggles the pressed state.
   */
  isPressedKey?: (key: string) => boolean;
}

/** A `ReactiveController` used to monitor the pressed state of one or more elements. */
export class PressedController extends MonitorControllerBase {
  /** @private */ readonly #capture?: boolean;
  /** @private */ readonly #callback: PressedControllerCallback;
  /** @private */ readonly #isPressedKey?: (key: string) => boolean;
  /** @private */ readonly #pressedTargets = new Map<HTMLElement, number>();
  /** @private */ readonly #minPressedDuration: number;

  /** @private */ readonly #pointerDownHandler = (e: PointerEvent) => this.#handlePointerDown(e);
  /** @private */ readonly #pointerUpHandler = (e: PointerEvent) => this.#handlePointerUp(e);
  /** @private */ readonly #touchEndHandler = (e: TouchEvent) => this.#handleTouchEnd(e);
  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @private */ readonly #keyUpHandler = (e: KeyboardEvent) => this.#handleKeyUp(e);

  /**
   * Initializes a new instance of this class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {PressedControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: PressedControllerOptions) {
    super(host, options);

    this.#capture = options.capture;
    this.#callback = options.callback;
    this.#isPressedKey = options.isPressedKey;
    this.#minPressedDuration = options.minPressedDuration ?? 0;
  }

  /** @inheritdoc */
  override hostConnected(): void {
    document.addEventListener("pointerup", this.#pointerUpHandler, { capture: this.#capture });
    document.addEventListener("touchend", this.#touchEndHandler, { capture: this.#capture });
    document.addEventListener("touchcancel", this.#touchEndHandler, { capture: this.#capture });

    super.hostConnected();
  }

  /** @inheritdoc */
  override hostDisconnected(): void {
    document.removeEventListener("pointerup", this.#pointerUpHandler, { capture: this.#capture });
    document.addEventListener("touchend", this.#touchEndHandler, { capture: this.#capture });
    document.addEventListener("touchcancel", this.#touchEndHandler, { capture: this.#capture });

    super.hostDisconnected();
    this.#pressedTargets.clear();
  }

  /**
   * Starts observing the specified element.
   * @param {HTMLElement} target The element to start observing.
   */
  protected override _observe(target: HTMLElement): void {
    target.addEventListener("pointerdown", this.#pointerDownHandler, { capture: this.#capture });

    if (this.#isPressedKey) {
      target.addEventListener("keydown", this.#keyDownHandler, { capture: this.#capture });
      target.addEventListener("keyup", this.#keyUpHandler, { capture: this.#capture });
    }
  }

  /**
   * Stops observing the specified element.
   * @param {HTMLElement} target The element to stop observing.
   */
  protected override _unobserve(target: HTMLElement): void {
    target.removeEventListener("pointerdown", this.#pointerDownHandler, { capture: this.#capture });

    if (this.#isPressedKey) {
      target.removeEventListener("keydown", this.#keyDownHandler, { capture: this.#capture });
      target.removeEventListener("keyup", this.#keyUpHandler, { capture: this.#capture });
    }
  }

  /** @private */
  #handlePointerDown(e: PointerEvent): void {
    if (e.pointerType === "mouse" && e.button > 1) return;

    for (const target of e.composedPath()) {
      if (target instanceof HTMLElement && this.isObserving(target)) {
        if (!this.#pressedTargets.has(target)) {
          this.#pressedTargets.set(target, performance.now());
          this.#callback(true, { x: e.x, y: e.y }, target);
        }
        break;
      }
    }
  }

  /** @private */
  #handlePointerUp(e: PointerEvent): void {
    if (e.pointerType === "mouse" && e.button > 1) return;

    const x = e.x;
    const y = e.y;

    for (const target of this.#pressedTargets.keys()) {
      const remainingTime = this.#minPressedDuration - (performance.now() - this.#pressedTargets.get(target)!);
      if (remainingTime > 0) {
        setTimeout(() => {
          this.#pressedTargets.delete(target);
          this.#callback(false, { x, y }, target);
        }, remainingTime);
      } else {
        this.#pressedTargets.delete(target);
        this.#callback(false, { x, y }, target);
      }
    }
  }

  /** @private */
  #handleTouchEnd(e: TouchEvent): void {
    const x = e.touches[0]?.clientX ?? 0;
    const y = e.touches[0]?.clientY ?? 0;

    for (const target of this.#pressedTargets.keys()) {
      const remainingTime = this.#minPressedDuration - (performance.now() - this.#pressedTargets.get(target)!);
      if (remainingTime > 0) {
        setTimeout(() => {
          this.#pressedTargets.delete(target);
          this.#callback(false, { x, y }, target);
        }, remainingTime);
      } else {
        this.#pressedTargets.delete(target);
        this.#callback(false, { x, y }, target);
      }
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    if (e.target !== e.currentTarget) return;
    const target = e.currentTarget as HTMLElement;

    if (this.#isPressedKey?.(e.key)) {
      if (e.key === " ") {
        e.preventDefault();
      }

      if (!this.#pressedTargets.has(target)) {
        this.#pressedTargets.set(target, performance.now());
        const bounds = target.getBoundingClientRect();
        this.#callback(true, { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }, target);
      }
    }
  }

  /** @private */
  #handleKeyUp(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;

    if (this.#pressedTargets.has(target) && this.#isPressedKey?.(e.key)) {
      const remainingTime = this.#minPressedDuration - (performance.now() - this.#pressedTargets.get(target)!);
      const bounds = target.getBoundingClientRect();
      if (remainingTime > 0) {
        setTimeout(() => {
          this.#pressedTargets.delete(target);
          this.#callback(false, { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }, target);
        }, remainingTime);
      } else {
        this.#pressedTargets.delete(target);
        this.#callback(false, { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }, target);
      }
    }
  }
}
