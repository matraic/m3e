import { GestureDetail } from "./GestureDetail";
import { GestureInput } from "./GestureInput";
import { GestureInputButton } from "./GestureInputButton";
import { GestureInputDisposition } from "./GestureInputDisposition";
import { GestureInputResolution } from "./GestureInputResolution";
import { GestureCallback, GestureRecognizer } from "./GestureRecognizer";
import { PointerInput } from "./PointerInput";
import { WheelInput } from "./WheelInput";

/**
 * A base implementation for a {@link GestureRecognizer} used to recognize gestures.
 * @template TDetail The type of detail emitted when a gesture is recognized.
 */
export abstract class GestureRecognizerBase<
  TDetail extends GestureDetail = GestureDetail,
> implements GestureRecognizer<TDetail> {
  /** @private */ #priority: number = 1;
  /** @private */ #disabled = false;
  /** @private */ #allowedButtons: Array<GestureInputButton> = ["primary"];

  /** @inheritdoc */
  abstract readonly gestureType: string;

  /** @inheritdoc */
  get eager(): boolean {
    return false;
  }

  /** @inheritdoc */
  get priority(): number {
    return this.#priority;
  }
  set priority(value: number) {
    this.#priority = value;
  }

  /** @inheritdoc */
  get disabled(): boolean {
    return this.#disabled;
  }
  set disabled(value: boolean) {
    this.#disabled = value;
    if (this.#disabled) {
      this.reset();
    }
  }

  /** @inheritdoc */
  get allowedButtons(): ReadonlyArray<GestureInputButton> {
    return this.#allowedButtons;
  }
  set allowedButtons(value: ReadonlyArray<GestureInputButton>) {
    this.#allowedButtons = [...value];
  }

  /** @inheritdoc */
  onGesture?: GestureCallback<TDetail>;

  /** @inheritdoc */
  onDisposition?: ((id: number, disposition: GestureInputDisposition) => void) | undefined;

  /** @inheritdoc */
  abstract reset(): void;

  /**
   * Dispositions the specified input as accepted.
   * @param {number} id The identifier of the input to accepted.
   */
  protected _acceptInput(id: number): void {
    if (this.disabled) return;
    this.onDisposition?.(id, "accept");
  }

  /**
   * Dispositions the specified input as rejected.
   * @param {number} id The identifier of the input to reject.
   */
  protected _rejectInput(id: number): void {
    if (this.disabled) return;
    this.onDisposition?.(id, "reject");
  }

  /**
   * Dispositions the specified input as held.
   * @param {number} id The identifier of the input to hold.
   */
  protected _holdInput(id: number): void {
    if (this.disabled) return;
    this.onDisposition?.(id, "hold");
  }

  /**
   * Dispositions the specified input as released.
   * @param {number} id The identifier of the input to release.
   */
  protected _releaseInput(id: number): void {
    if (this.disabled) return;
    this.onDisposition?.(id, "release");
  }

  /**
   * Dispositions the specified input as deferred.
   * @param {number} id The identifier of the input to defer.
   */
  protected _deferInput(id: number): void {
    if (this.disabled) return;
    this.onDisposition?.(id, "defer");
  }

  /** @inheritdoc */
  onResolution(id: number, resolution: GestureInputResolution): void {
    if (this.disabled) return;
    switch (resolution) {
      case "accept":
        this._onAcceptInput(id);
        break;

      case "reject":
        this._onRejectInput(id);
        break;
    }
  }

  /**
   * Handles accepted input.
   * @param id The identifier of the accepted input.
   */
  protected abstract _onAcceptInput(id: number): void;

  /**
   * Handles rejected input.
   * @param id The identifier of the rejected input.
   */
  protected abstract _onRejectInput(id: number): void;

  /** @inheritdoc */
  onInput(input: GestureInput): void {
    if (this.disabled) return;
    switch (input.type) {
      case "pointerover":
        this._onPointerOver(<PointerInput>input);
        break;

      case "pointerenter":
        this._onPointerEnter(<PointerInput>input);
        break;

      case "pointerdown":
        if (!this._isAllowedButton(<PointerInput>input)) {
          this._rejectInput(input.id);
        } else {
          this._onPointerDown(<PointerInput>input);
        }
        break;

      case "pointermove":
        this._onPointerMove(<PointerInput>input);
        break;

      case "pointerup":
        if (!this._isAllowedButton(<PointerInput>input)) {
          this._rejectInput(input.id);
        } else {
          this._onPointerUp(<PointerInput>input);
        }
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

  /**
   * Determines whether the `button` for the specified input is permitted.
   * @param {PointerInput} input The gesture input to test.
   * @returns {boolean} `true` if the changed button is allowed; otherwise `false`.
   */
  protected _isAllowedButton(input: PointerInput): boolean {
    const button = new Map<number, GestureInputButton>([
      [0, "primary"],
      [1, "middle"],
      [2, "secondary"],
      [3, "back"],
      [4, "forward"],
    ]).get(input.button);
    return button !== undefined && this.allowedButtons.includes(button);
  }

  /**
   * Emits a recognized gesture.
   * @param {TDetail} detail Detail for the recognized gesture.
   */
  protected _emitGesture(detail: TDetail): void {
    this.onGesture?.(detail);
  }
}
