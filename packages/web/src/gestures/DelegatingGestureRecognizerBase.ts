import { GestureDetail } from "./GestureDetail";
import { GestureInput, PointerInput, WheelInput } from "./GestureInput";
import { GestureOptions } from "./GestureOptions";
import { GestureDisposition, GestureListener, GestureRecognizer } from "./GestureRecognizer";
import { GestureRecognizerBase } from "./GestureRecognizerBase";

/**
 * A base implementation for a {@link GestureRecognizer} which delegates recognition to another recognizer. This class must be inherited.
 * @template TOptions The type of options used to detect and interpret gestures.
 * @template TDetail The type of semantic detail emitted for a gesture.
 * @template TInnerOptions The type of options used to detect and interpret gestures by the inner recognizer.
 * @template TInnerDetail The type of semantic detail emitted by the inner recognizer.
 * @template TInnerRecognizer The type of recognizer to which recognition is delegated.
 */
export abstract class DelegatingGestureRecognizerBase<
  TOptions extends GestureOptions,
  TDetail extends GestureDetail,
  TInnerOptions extends GestureOptions = GestureOptions,
  TInnerDetail extends GestureDetail = GestureDetail,
  TInnerRecognizer extends GestureRecognizer<TInnerOptions, TInnerDetail> = GestureRecognizer<
    TInnerOptions,
    TInnerDetail
  >,
> extends GestureRecognizerBase<TOptions, TDetail> {
  /** @private */ readonly #listener: GestureListener<TInnerDetail> = (detail) => this._handleGesture(detail);
  /** @private*/ #inner?: TInnerRecognizer;

  /**
   * Initializes a new instance of this class.
   * @param {Partial<TOptions>} options The options used to detect and interpret gestures.
   * @param {GestureListener<TDetail>} listener The function invoked when semantic detail is emitted.
   * @param {TInnerRecognizer} inner The recognizer used to detect the gesture to repeat.
   */
  constructor(options?: Partial<TOptions>, listener?: GestureListener<TDetail>, inner?: TInnerRecognizer) {
    super(options, listener);

    if (inner) {
      this._inner = inner;
    }
  }

  /** The recognizer to which recognition is delegated. */
  protected get _inner(): TInnerRecognizer | undefined {
    return this.#inner;
  }

  protected set _inner(value: TInnerRecognizer | undefined) {
    if (this.#inner) {
      this.#inner.removeListener(this.#listener);
      this.#inner.onDisposition = undefined;
      this.#inner.reset();
    }

    this.#inner = value;

    if (this.#inner) {
      this.#inner.reset();

      this.#inner.disabled = this.disabled;
      this._applyOptions(this.options, this.#inner);

      this.#inner.onDisposition = this._handleDisposition.bind(this);
      this.#inner.addListener(this.#listener);
    }
  }

  /** @inheritdoc */
  override get disabled(): boolean {
    return super.disabled;
  }
  override set disabled(value: boolean) {
    super.disabled = value;
    if (this._inner) {
      this._inner.disabled = value;
    }
  }

  /** @inheritdoc */
  override get options(): TOptions {
    return super.options;
  }
  override set options(value: Partial<TOptions>) {
    super.options = value;
    if (this._inner) {
      this._applyOptions(this.options, this._inner);
    }
  }

  /** @inheritdoc */
  override get eager(): boolean {
    return this._inner?.eager ?? false;
  }

  /** @inheritdoc */
  override shouldCapturePointer(input: PointerInput): boolean {
    return this._inner?.shouldCapturePointer(input) ?? false;
  }

  /** @inheritdoc */
  override canReceiveInput(input: GestureInput): boolean {
    return this._inner?.canReceiveInput(input) ?? false;
  }

  /** @inheritdoc */
  protected override _onPointerOver(input: PointerInput): void {
    this._inner?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerEnter(input: PointerInput): void {
    this._inner?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerDown(input: PointerInput): void {
    this._inner?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerMove(input: PointerInput): void {
    this._inner?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerUp(input: PointerInput): void {
    this._inner?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerCancel(input: PointerInput): void {
    this._inner?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerOut(input: PointerInput): void {
    this._inner?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onPointerLeave(input: PointerInput): void {
    this._inner?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onWheel(input: WheelInput): void {
    this._inner?.onInput(input);
  }

  /** @inheritdoc */
  protected override _onAccept(inputId: number): void {
    this._inner?.onResolution(inputId, "accept");
  }

  /** @inheritdoc */
  protected override _onReject(inputId: number): void {
    this._inner?.onResolution(inputId, "reject");
  }

  /** @inheritdoc */
  override reset(): void {
    this._inner?.reset();
  }

  /**
   * Applies options to the inner recognizer.
   * @param {TOptions} options The options to apply.
   * @param {TInnerRecognizer} inner The recognizer to which recognition is delegated.
   */
  protected _applyOptions(options: TOptions, inner: TInnerRecognizer): void {
    inner.options = {
      priority: options.priority,
      buttons: options.buttons,
      pointerTypes: options.pointerTypes,
      inputFilter: options.inputFilter,
    } as TInnerOptions;
  }

  /**
   * Handles dispositions from the inner recognizer.
   * @param {number} inputId The identifier of the input stream to disposition.
   * @param {GestureDisposition} disposition The disposition of the input stream.
   */
  protected _handleDisposition(inputId: number, disposition: GestureDisposition) {
    switch (disposition) {
      case "accept":
        this._accept(inputId);
        break;
      case "defer":
        this._defer(inputId);
        break;
      case "hold":
        this._hold(inputId);
        break;
      case "reject":
        this._reject(inputId);
        break;
      case "release":
        this._release(inputId);
        break;
    }
  }

  /**
   * Handles semantic detail emitted from the inner recognizer.
   * @param {TInnerDetail} detail The semantic detail emitted from the inner recognizer.
   */
  protected abstract _handleGesture(detail: TInnerDetail): void;
}
