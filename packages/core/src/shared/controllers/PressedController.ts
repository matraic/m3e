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

  /**
   * A function used to determine whether a given keyboard key toggles the pressed state.
   * @param key The `KeyboardEvent.key` to test.
   * @returns Whether `key` toggles the pressed state.
   */
  isPressedKey?: (key: string) => boolean;
}

/** A `ReactiveController` used to monitor the pressed state of one or more elements. */
export class PressedController extends MonitorControllerBase {
  /** @private */ readonly #callback: PressedControllerCallback;
  /** @private */ readonly #isPressedKey?: (key: string) => boolean;
  /** @private */ readonly #pressedTargets = new Set<HTMLElement>();

  /** @private */ readonly #pointerDownHandler = (e: PointerEvent) => this.#handlePointerDown(e);
  /** @private */ readonly #pointerUpHandler = (e: PointerEvent) => this.#handlePointerUp(e);
  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @private */ readonly #keyUpHandler = (e: KeyboardEvent) => this.#handleKeyUp(e);

  /**
   * Initializes a new instance of this class.
   * @param {ReactiveControllerHost & HTMLElement} host The host element to which this controller will be added.
   * @param {PressedControllerOptions} options Options used to configure this controller.
   */
  constructor(host: ReactiveControllerHost & HTMLElement, options: PressedControllerOptions) {
    super(host, options);

    this.#callback = options.callback;
    this.#isPressedKey = options.isPressedKey;
  }

  /** @inheritdoc */
  override hostConnected(): void {
    document.addEventListener("pointerup", this.#pointerUpHandler);
    super.hostConnected();
  }

  /** @inheritdoc */
  override hostDisconnected(): void {
    document.removeEventListener("pointerup", this.#pointerUpHandler);
    super.hostDisconnected();
    this.#pressedTargets.clear();
  }

  /**
   * Starts observing the specified element.
   * @param {HTMLElement} target The element to start observing.
   */
  protected override _observe(target: HTMLElement): void {
    target.addEventListener("pointerdown", this.#pointerDownHandler);
    if (this.#isPressedKey) {
      target.addEventListener("keydown", this.#keyDownHandler);
      target.addEventListener("keyup", this.#keyUpHandler);
    }
  }

  /**
   * Stops observing the specified element.
   * @param {HTMLElement} target The element to stop observing.
   */
  protected override _unobserve(target: HTMLElement): void {
    target.removeEventListener("pointerdown", this.#pointerDownHandler);

    if (this.#isPressedKey) {
      target.removeEventListener("keydown", this.#keyDownHandler);
      target.removeEventListener("keyup", this.#keyUpHandler);
    }
  }

  /** @private */
  #handlePointerDown(e: PointerEvent): void {
    if (e.pointerType === "mouse" && e.button > 1) return;

    for (const target of e.composedPath()) {
      if (target instanceof HTMLElement && this.isObserving(target)) {
        this.#pressedTargets.add(target);
        this.#callback(true, { x: e.x, y: e.y }, target);
        break;
      }
    }
  }

  /** @private */
  #handlePointerUp(e: PointerEvent): void {
    if (e.pointerType === "mouse" && e.button > 1) return;

    this.#pressedTargets.forEach((x) => this.#callback(false, { x: e.x, y: e.y }, x));
    this.#pressedTargets.clear();
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;

    if (!this.#pressedTargets.has(target) && this.#isPressedKey?.(e.key)) {
      if (e.key === " ") {
        e.preventDefault();
      }

      this.#pressedTargets.add(target);
      const bounds = target.getBoundingClientRect();
      this.#callback(true, { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }, target);
    }
  }

  /** @private */
  #handleKeyUp(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;

    if (this.#pressedTargets.has(target) && this.#isPressedKey?.(e.key)) {
      this.#pressedTargets.delete(target);
      const bounds = target.getBoundingClientRect();
      this.#callback(false, { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }, target);
    }
  }
}
