import { GestureDetail } from "./GestureDetail";
import { GestureInput, PointerInput, PointerType, WheelInput } from "./GestureInput";
import { DefaultGestureOptions, GestureInputButton, GestureOptions } from "./GestureOptions";
import {
  GestureDisposition,
  GestureDispositionCallback,
  GestureListener,
  GestureRecognizer,
  GestureResolution,
} from "./GestureRecognizer";

const GESTURE_INPUT_BUTTON_NAME_TO_INDEX = new Map<GestureInputButton, number>([
  ["primary", 0],
  ["middle", 1],
  ["secondary", 2],
  ["back", 3],
  ["forward", 4],
]);

/**
 * A base implementation for a {@link GestureRecognizer} used to detect and interpret gestures from incoming input
 * streams. This class must be inherited.
 * @template TOptions The type of options used to detect and interpret gestures.
 * @template TDetail The type of semantic detail emitted for a gesture.
 */
export abstract class GestureRecognizerBase<
  TOptions extends GestureOptions,
  TDetail extends GestureDetail,
> implements GestureRecognizer<TOptions, TDetail> {
  /** @private */ #options: TOptions;
  /** @private */ #disabled: boolean = false;
  /** @private */ readonly #listeners = new Array<GestureListener<TDetail>>();

  /**
   * Initializes a new instance of this class.
   * @param {Partial<TOptions>} options The options used to detect and interpret gestures.
   * @param {GestureListener<TDetail>} listener The function invoked when semantic detail is emitted.
   */
  constructor(options?: Partial<TOptions>, listener?: GestureListener<TDetail>) {
    this.#options = { ...this.defaultOptions, ...options };
    if (listener) {
      this.addListener(listener);
    }
  }

  /** @inheritdoc */
  get options(): TOptions {
    return this.#options;
  }
  set options(value: Partial<TOptions>) {
    this.#options = { ...this.#options, ...value };
  }

  /** Whether gesture recognition is disabled. */
  get disabled(): boolean {
    return this.#disabled;
  }
  set disabled(value: boolean) {
    this.#disabled = value;
    if (this.#disabled) {
      this.reset();
    }
  }

  /** The default options used to detect and interpret gestures. */
  get defaultOptions(): TOptions {
    return { ...DefaultGestureOptions } as TOptions;
  }

  /** @inheritdoc */
  get eager(): boolean {
    return false;
  }

  /** @inheritdoc */
  canReceiveInput(input: GestureInput): boolean {
    if (this.disabled) return false;
    if (!(this.options.inputFilter?.(input) ?? true)) return false;

    // Only test allowed buttons on pointerdown.
    if (input.kind === "pointerdown" && this.options.buttons.length > 0) {
      let allowedButton = false;
      for (const allowedName of this.options.buttons) {
        const allowedIndex = GESTURE_INPUT_BUTTON_NAME_TO_INDEX.get(allowedName);
        if (allowedIndex === undefined) continue;

        const allowedMask = 1 << allowedIndex;
        if ((input.buttons & allowedMask) !== 0) {
          allowedButton = true;
          break;
        }
      }

      if (!allowedButton) {
        return false;
      }
    }

    if (this.options.pointerTypes.length > 0) {
      if ("pointerType" in input && !this.options.pointerTypes.includes(<PointerType>input.pointerType)) {
        return false;
      }
    }

    return true;
  }

  /** @inheritdoc */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldCapturePointer(_input: PointerInput): boolean {
    return false;
  }

  /** @inheritdoc */
  onInput(input: GestureInput): void {
    if (!this.canReceiveInput(input)) return;

    switch (input.kind) {
      case "pointerover":
        this._onPointerOver(<PointerInput>input);
        break;

      case "pointerenter":
        this._onPointerEnter(<PointerInput>input);
        break;

      case "pointerdown":
        this._onPointerDown(<PointerInput>input);
        break;

      case "pointermove":
        this._onPointerMove(<PointerInput>input);
        break;

      case "pointerup":
        this._onPointerUp(<PointerInput>input);
        break;

      case "pointercancel":
        this._onPointerCancel(<PointerInput>input);
        break;

      case "pointerout":
        this._onPointerOut(<PointerInput>input);
        break;

      case "pointerleave":
        this._onPointerLeave(<PointerInput>input);
        break;

      case "wheel":
        this._onWheel(<WheelInput>input);
        break;
    }
  }

  /** Processes input from a `pointerover` event. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onPointerOver(_input: PointerInput): void {}

  /** Processes input from a `pointerenter` event. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onPointerEnter(_input: PointerInput): void {}

  /** Processes input from a `pointerdown` event. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onPointerDown(_input: PointerInput): void {}

  /** Processes input from a `pointermove` event. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onPointerMove(_input: PointerInput): void {}

  /** Processes input from a `pointerup` event. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onPointerUp(_input: PointerInput): void {}

  /** Processes input from a `pointercancel` event. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onPointerCancel(_input: PointerInput): void {}

  /** Processes input from a `pointerout` event. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onPointerOut(_input: PointerInput): void {}

  /** Processes input from a `pointerleave` event. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onPointerLeave(_input: PointerInput): void {}

  /** Processes input from a `wheel` event. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _onWheel(_input: WheelInput): void {}

  /** @inheritdoc */
  onDisposition?: GestureDispositionCallback | undefined;

  /**
   * Dispositions the specified input stream as accepted.
   * @param {number | readonly number[]} inputId The identifier(s) of the input stream to accepted.
   */
  protected _accept(inputId: number | readonly number[]): void {
    this.#disposition(inputId, "accept");
  }

  /**
   * Dispositions the specified input stream as rejected.
   * @param {number | readonly number[]} inputId The identifier(s) of the input stream to reject.
   */
  protected _reject(inputId: number | readonly number[]): void {
    this.#disposition(inputId, "reject");
  }

  /**
   * Dispositions the specified input stream as held.
   * @param {number} inputId The identifier of the input stream to hold.
   */
  protected _hold(inputId: number | readonly number[]): void {
    this.#disposition(inputId, "hold");
  }

  /**
   * Dispositions the specified input stream as released.
   * @param {number} inputId The identifier of the input stream to release.
   */
  protected _release(inputId: number | readonly number[]): void {
    this.#disposition(inputId, "release");
  }

  /**
   * Dispositions the specified input stream as deferred.
   * @param {number} inputId The identifier of the input stream to defer.
   */
  protected _defer(inputId: number | readonly number[]): void {
    this.#disposition(inputId, "defer");
  }

  /**
   * Emits semantic detail about a recognized gesture.
   * @param {TDetail} detail The detail to emit.
   */
  protected _emit(detail: TDetail): void {
    this.#listeners.forEach((x) => x(detail));
  }

  /** @inheritdoc */
  addListener(listener: GestureListener<TDetail>): void {
    if (!this.#listeners.includes(listener)) {
      this.#listeners.push(listener);
    }
  }

  /** @inheritdoc */
  removeListener(listener: GestureListener<TDetail>): void {
    const index = this.#listeners.indexOf(listener);
    if (index >= 0) {
      this.#listeners.splice(index, 1);
    }
  }

  /** @inheritdoc */
  onResolution(inputId: number, resolution: GestureResolution): void {
    switch (resolution) {
      case "accept":
        this._onAccept(inputId);
        break;
      case "reject":
        this._onReject(inputId);
        break;
    }
  }

  /**
   * Handles an accepted input stream.
   * @param {number} inputId The identifier of the accepted input stream.
   */
  protected abstract _onAccept(inputId: number): void;

  /**
   * Handles a rejected input stream.
   * @param {number} inputId The identifier of the rejected input stream.
   */
  protected abstract _onReject(inputId: number): void;

  /** @inheritdoc */
  abstract reset(): void;

  /** @private */
  #disposition(inputId: number | readonly number[], disposition: GestureDisposition): void {
    const ids = Array.isArray(inputId) ? inputId : [inputId];
    for (const id of ids) {
      this.onDisposition?.(id, disposition);
    }
  }
}
