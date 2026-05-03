import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, unsafeCSS } from "lit";
import { property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  addCustomState,
  AttachInternals,
  customElement,
  deleteCustomState,
  DesignToken,
  Disabled,
  FormAssociated,
  formValue,
  MutationController,
  prefersReducedMotion,
  PressedController,
  ReconnectedCallback,
  registerStyleSheet,
  setCustomState,
  spaceSeparatedStringConverter,
} from "@m3e/web/core";

import { Breakpoint, M3eBreakpointObserver } from "@m3e/web/core/layout";
import { Direction, M3eDirectionality } from "@m3e/web/core/bidi";

import { SplitPaneOrientation } from "./SplitPaneOrientation";

/**
 * A dual-view layout that separates content with a movable drag handle.
 * @description
 * The `m3e-split-pane` component delivers a Material 3-inspired split view with a
 * movable drag handle, enabling responsive layout composition and pane resizing.
 * It supports keyboard interaction, adaptive orientation, and optional detent snapping
 * for consistent, accessible content distribution.
 *
 * @example
 * The following example illustrates the basic use of the `m3e-split-pane` with start and end content.
 * In this example, the start pane occupies 25% of the available width.
 * ```html
 * <m3e-split-pane value="25">
 *  <m3e-card slot="start"></m3e-card>
 *  <m3e-card slot="end"></m3e-card>
 * </m3e-split-pane>
 * ```
 *
 * @example
 * The next example demonstrates minimum and maximum constraints, where the start pane
 * may shrink to 25% but cannot grow beyond 50% of the available space.
 * ```html
 * <m3e-split-pane value="25" min="25" max="50">
 *  <m3e-card slot="start"></m3e-card>
 *  <m3e-card slot="end"></m3e-card>
 * </m3e-split-pane>
 * ```
 *
 * @example
 * The next example demonstrates percentage‑based detents, allowing the drag handle to snap at
 * 0%, 25%, 50%, 75%, and 100% of the available space.
 * ```html
 * <m3e-split-pane value="50" detents="0 25 50 75 100">
 *  <m3e-card slot="start"></m3e-card>
 *  <m3e-card slot="end"></m3e-card>
 * </m3e-split-pane>
 * ```
 *
 * @tag m3e-split-pane
 *
 * @slot start - Renders content at the logical start side of the pane.
 * @slot end - Renders content at the logical end side of the pane.
 *
 * @attr detents - Detents (discrete sizes) the start pane can snap to.
 * @attr label - The accessible label given to the moveable drag handle.
 * @attr max - A fractional value, between 0 and 100, indicating the maximum size of the start pane.
 * @attr min - A fractional value, between 0 and 100, indicating the minimum size of the start pane.
 * @attr orientation - The orientation of the split.
 * @attr overshoot-limit - A fractional value, between 0 and 100, indicating the maximum visual overshoot allowed when dragging past the minimum or maximum size.
 * @attr step - A fractional value, between 0 and 100, indicating the increment by which to adjust the value when resized via keyboard.
 * @attr value - A fractional value, between 0 and 100, indicating the size of the start pane.
 * @attr wrap-detents - Whether cycling through detents will wrap.
 *
 * @fires input - Fired continuously while the user adjusts the drag handle.
 * @fires change - Fired when the user finishes adjusting the drag handle.
 *
 * @cssprop --m3e-split-pane-drag-handle-hover-color - Color used for the drag handle hover state.
 * @cssprop --m3e-split-pane-drag-handle-hover-opacity - Opacity used for the drag handle hover state.
 * @cssprop --m3e-split-pane-drag-handle-focus-color - Color used for the drag handle focus state.
 * @cssprop --m3e-split-pane-drag-handle-focus-opacity - Opacity used for the drag handle focus state.
 * @cssprop --m3e-split-pane-drag-handle-color - Background color of the drag handle when not pressed.
 * @cssprop --m3e-split-pane-drag-handle-shape - Corner shape of the drag handle when not pressed.
 * @cssprop --m3e-split-pane-drag-handle-pressed-color - Background color of the drag handle when pressed.
 * @cssprop --m3e-split-pane-drag-handle-pressed-shape - Corner shape of the drag handle when pressed.
 * @cssprop --m3e-split-pane-drag-handle-container-width - Width of the drag handle container.
 * @cssprop --m3e-split-pane-drag-handle-width - Thickness of the drag handle when not pressed.
 * @cssprop --m3e-split-pane-drag-handle-height - Length of the drag handle when not pressed.
 * @cssprop --m3e-split-pane-drag-handle-pressed-width - Thickness of the drag handle when pressed.
 * @cssprop --m3e-split-pane-drag-handle-pressed-height - Length of the drag handle when pressed.
 */
@customElement("m3e-split-pane")
export class M3eSplitPaneElement extends FormAssociated(Disabled(ReconnectedCallback(AttachInternals(LitElement)))) {
  static {
    registerStyleSheet(css`
      @property --_split-pane-value {
        syntax: "<length-percentage>";
        inherits: true;
        initial-value: 50%;
      }
    `);
  }
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .base {
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    :host(:not(:state(-vertical))) .base {
      flex-direction: row;
    }
    :host(:state(-vertical)) .base {
      flex-direction: column;
    }
    :host(:state(-with-start):state(-with-end)) .start {
      flex: 0 1 calc(var(--_split-pane-value) - calc(var(--m3e-split-pane-drag-handle-container-width, 1.5rem) / 2));
    }
    :host(:not(:state(-with-end))) .start {
      flex: 1 1 auto;
    }
    :host(:state(-with-end)) .end {
      flex: 1 1 auto;
    }
    :host(:not(:state(-with-end))) .end {
      display: none;
    }
    :host(:not(:state(-animating))) .start[inert],
    :host(:not(:state(-animating))) .end[inert] {
      visibility: hidden;
    }
    .drag-handle {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      touch-action: none;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

      --m3e-state-layer-hover-color: var(--m3e-split-pane-drag-handle-hover-color, ${DesignToken.color.onSurface});
      --m3e-state-layer-hover-opacity: var(--m3e-split-pane-drag-handle-hover-opacity, 8%);
      --m3e-state-layer-focus-color: var(--m3e-split-pane-drag-handle-focus-color, ${DesignToken.color.onSurface});
      --m3e-state-layer-focus-opacity: var(--m3e-split-pane-drag-handle-focus-opacity, 10%);
    }
    :host(:is(:not(:state(-with-start)), :not(:state(-with-end)))) .drag-handle {
      display: none;
    }
    :host(:not(:state(-pressed))) .drag-handle:not([aria-disabled]) {
      cursor: grab;
    }
    :host(:state(-pressed)) .drag-handle:not([aria-disabled]) {
      cursor: grabbing;
    }
    .handle {
      position: relative;
      transition: ${unsafeCSS(`background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
        width ${DesignToken.motion.spring.fastEffects}, height ${DesignToken.motion.spring.fastEffects}`)};
    }
    .touch {
      z-index: 1;
      position: absolute;
      height: 3rem;
      width: 3rem;
      margin: auto;
      touch-action: none;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    :host(:not(:state(-pressed))) .handle {
      background-color: var(--m3e-split-pane-drag-handle-color, ${DesignToken.color.outline});
      border-radius: var(--m3e-split-pane-drag-handle-shape, ${DesignToken.shape.corner.full});
    }
    :host(:state(-pressed)) .handle {
      background-color: var(--m3e-split-pane-drag-handle-pressed-color, ${DesignToken.color.onSurface});
      border-radius: var(--m3e-split-pane-drag-handle-pressed-shape, ${DesignToken.shape.corner.medium});
    }
    :host(:not(:state(-vertical))) .drag-handle {
      flex-direction: column;
      width: var(--m3e-split-pane-drag-handle-container-width, 1.5rem);
    }
    :host(:not(:state(-vertical)):not(:state(-pressed))) .handle {
      width: var(--m3e-split-pane-drag-handle-width, 0.25rem);
      height: var(--m3e-split-pane-drag-handle-height, 3rem);
    }
    :host(:not(:state(-vertical)):state(-pressed)) .handle {
      width: var(--m3e-split-pane-drag-handle-pressed-width, 0.75rem);
      height: var(--m3e-split-pane-drag-handle-pressed-height, 3.25rem);
    }
    :host(:state(-vertical)) .drag-handle {
      height: var(--m3e-split-pane-drag-handle-container-width, 1.5rem);
    }
    :host(:state(-vertical):not(:state(-pressed))) .handle {
      width: var(--m3e-split-pane-drag-handle-height, 3rem);
      height: var(--m3e-split-pane-drag-handle-width, 0.25rem);
    }
    :host(:state(-vertical):state(-pressed)) .handle {
      width: var(--m3e-split-pane-drag-handle-pressed-height, 3.25rem);
      height: var(--m3e-split-pane-drag-handle-pressed-width, 0.75rem);
    }
    @media (prefers-reduced-motion) {
      .handle {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      :host(:state(-pressed)) .handle,
      :host(:not(:state(-pressed))) .handle {
        background-color: ButtonText;
      }
    }
  `;

  /** @private */ @state() _orientation?: Exclude<SplitPaneOrientation, "auto">;
  /** @private */ #breakpointUnobserve?: () => void;

  /** @private */ @query(".base") private _base!: HTMLElement;
  /** @private */ @query(".drag-handle") private _dragHandle!: HTMLElement;

  /** @private */ #dragState?: { startPos: number; startValue: number; cachedSize: number; min: number; max: number };
  /** @private */ #valueChanged = false;
  /** @private */ #snapAnimation?: Animation;

  /** @private */
  readonly #pressedController = new PressedController(this, {
    target: null,
    isPressedKey: (key) => key === " ",
    minPressedDuration: 150,
    callback: (pressed) => setCustomState(this, "-pressed", pressed && !this.disabled),
  });

  /** @private */
  readonly #startMutationController = new MutationController(this, {
    target: null,
    config: { attributeFilter: ["hidden"] },
    callback: () => this.#updatePaneVisibility("start"),
  });

  /** @private */
  readonly #endMutationController = new MutationController(this, {
    target: null,
    config: { attributeFilter: ["hidden"] },
    callback: () => this.#updatePaneVisibility("end"),
  });

  /**
   * A fractional value, between 0 and 100, indicating the size of the start pane.
   * @default 50
   */
  @property({ type: Number }) value = 50;

  /**
   * A fractional value, between 0 and 100, indicating the minimum size of the start pane.
   * @default 0
   */
  @property({ type: Number }) min = 0;

  /**
   * A fractional value, between 0 and 100, indicating the maximum size of the start pane.
   * @default 100
   */
  @property({ type: Number }) max = 100;

  /**
   * A fractional value, between 0 and 100, indicating the maximum visual overshoot allowed when dragging past the minimum or maximum size.
   * @default 4
   */
  @property({ attribute: "overshoot-limit", type: Number }) overshootLimit = 4;

  /**
   * A fractional value, between 0 and 100, indicating the increment by which to adjust the value when resized via keyboard.
   * @default 1
   */
  @property({ type: Number }) step = 1;

  /**
   * Detents (discrete sizes) the start pane can snap to.
   * @default []
   */
  @property({ attribute: "detents", converter: spaceSeparatedStringConverter }) detents: string[] = [];

  /**
   * Whether cycling through detents will wrap.
   * @default false
   */
  @property({ attribute: "wrap-detents", type: Boolean }) wrapDetents = false;

  /**
   * The orientation of the split.
   * @default "horizontal"
   */
  @property() orientation: SplitPaneOrientation = "horizontal";

  /**
   * The accessible label given to the movable drag handle.
   * @default "Resize panes"
   */
  @property() label: string = "Resize panes";

  /** A function used to generates human readable text for the accessible value (`aria-valuetext`) of the drag handle. */
  @property() valueFormatter?: (
    value: number,
    orientation: Omit<SplitPaneOrientation, "auto">,
    dir: Direction,
  ) => string | undefined = (value, orientation, dir) => {
    value = Math.round(value);
    if (value >= 48 && value <= 52) {
      return "Panes equally sized";
    }

    switch (value) {
      case 0:
        return orientation === "horizontal"
          ? dir === "ltr"
            ? "Left pane collapsed"
            : "Right pane collapsed"
          : "Top pane collapsed";
      case 100:
        return orientation === "horizontal"
          ? dir === "ltr"
            ? "Right pane collapsed"
            : "Left pane collapsed"
          : "Bottom pane collapsed";
      default:
        return orientation === "horizontal"
          ? dir === "ltr"
            ? `Left pane ${value}%, right pane ${100 - value}%`
            : `Left pane ${100 - value}%, right pane ${value}%`
          : `Top pane ${value}%, bottom pane ${100 - value}%`;
    }
  };

  /** The current orientation of the split. */
  get currentOrientation(): Exclude<SplitPaneOrientation, "auto"> {
    return this._orientation ?? (this.orientation !== "vertical" ? "horizontal" : "vertical");
  }

  /** @inheritdoc */
  override get [formValue](): string | File | FormData | null {
    return this.value?.toString() ?? null;
  }

  /**
   * Moves the drag handle to the collapsed position. If detents exist, snaps to the collapsed detent.
   * If no detents exist, moves to the minimum allowed value.
   */
  collapse(): void {
    this.snapToValue(this.min);
  }

  /**
   * Moves the drag handle to the expanded position. If detents exist, snaps to the expanded detent.
   * If no detents exist, moves to the maximum allowed value.
   */
  expand(): void {
    this.snapToValue(this.max);
  }

  /**
   * Moves the drag handle to the specified position. If detents exist, snaps to the closest detent.
   * If no detents exist, moves to the specified value.
   * @param {number} value A fractional value, between 0 and 100, indicating the size of the start pane.
   */
  snapToValue(value: number): void {
    const detent = this.#getClosestDetent(value);
    value = detent > -1 ? this.#computeDetent(this.detents[detent])! : value;
    if (!this.#snapAnimation) {
      this.#snapToValue(value);
    } else {
      this.#changeValue(value);
    }
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#clearOrientation();
    this.#pressedController.unobserve(this._dragHandle);
  }

  /** @inheritdoc */
  override reconnectedCallback(): void {
    super.reconnectedCallback();

    this.#initialize();

    if (this.orientation === "auto") {
      this.#initBreakpointMonitoring();
    }
  }

  /** @inheritdoc */
  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("orientation")) {
      this.#breakpointUnobserve?.();

      if (this.orientation === "auto") {
        this.#initBreakpointMonitoring();
      } else {
        this._orientation = undefined;
        this.#updateOrientation();
      }
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);
    if (_changedProperties.has("value")) {
      this._base.style.setProperty("--_split-pane-value", `${this.value}%`);
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.#initialize();
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <div class="start" id="start" ?inert="${this.value <= 0}">
        <slot name="start" @slotchange="${this.#handleStartSlotChange}"></slot>
      </div>
      ${this.#renderDragHandle()}
      <div class="end" ?inert="${this.value >= 100}">
        <slot name="end" @slotchange="${this.#handleEndSlotChange}"></slot>
      </div>
    </div>`;
  }

  /** @private */
  #renderDragHandle(): unknown {
    return html`<div
      id="drag-handle"
      class="drag-handle"
      role="separator"
      tabindex="${ifDefined(this.disabled ? undefined : 0)}"
      aria-label="${this.label}"
      aria-controls="start"
      aria-disabled="${ifDefined(this.disabled ? "true" : undefined)}"
      aria-orientation="${this.currentOrientation === "horizontal" ? "vertical" : "horizontal"}"
      aria-valuemin="${this.min}"
      aria-valuemax="${this.max}"
      aria-valuenow="${this.value}"
      aria-valuetext="${ifDefined(
        this.valueFormatter?.(this.value, this.currentOrientation, M3eDirectionality.current),
      )}"
      @pointerdown="${this.#handlePointerDown}"
      @pointerup="${this.#handlePointerUp}"
      @pointermove="${this.#handlePointerMove}"
      @keydown="${this.#handleKeyDown}"
      @dblclick="${this.#cycleDetent}"
    >
      ${this.disabled
        ? nothing
        : html`<div class="handle">
              <m3e-focus-ring for="drag-handle"></m3e-focus-ring>
              <m3e-state-layer for="drag-handle"></m3e-state-layer>
            </div>
            <div class="touch"></div>`}
    </div>`;
  }

  /** @private */
  #handleStartSlotChange(e: Event): void {
    this.#handleSlotChange(e.target as HTMLSlotElement, this.#startMutationController, "-with-start");
  }

  /** @private */
  #handleEndSlotChange(e: Event): void {
    this.#handleSlotChange(e.target as HTMLSlotElement, this.#endMutationController, "-with-end");
  }

  /** @private */
  #handleSlotChange(slot: HTMLSlotElement, mutationController: MutationController, state: string): void {
    for (const target of mutationController.targets) {
      mutationController.unobserve(target);
    }

    const assignedElements = new Array<Element>();
    setCustomState(this, state, this.#hasVisibleElements(slot, assignedElements));

    for (const element of assignedElements) {
      if (element instanceof HTMLElement) {
        mutationController.observe(element);
      }
    }
  }

  /** @private */
  #updatePaneVisibility(pane: "start" | "end"): void {
    setCustomState(
      this,
      `-with-${pane}`,
      this.#hasVisibleElements(this.shadowRoot?.querySelector<HTMLSlotElement>(`slot[name='${pane}']`)),
    );
  }

  /** @private */
  #hasVisibleElements(slot?: HTMLSlotElement | null, assignedElements?: Element[]): boolean {
    assignedElements = assignedElements ?? [];
    assignedElements.push(...(slot?.assignedElements({ flatten: true }) ?? []));
    return assignedElements.length > 0 && !assignedElements.every((x) => x.hasAttribute("hidden"));
  }

  /** @private */
  #initialize() {
    this.#pressedController.observe(this._dragHandle);
  }

  /** @private */
  #initBreakpointMonitoring(): void {
    this.#breakpointUnobserve = M3eBreakpointObserver.observe([Breakpoint.XSmall], (matches) => {
      this._orientation = matches.get(Breakpoint.XSmall) ? "vertical" : "horizontal";
      this.#updateOrientation();
    });
  }

  /** @private */
  #updateOrientation(): void {
    setCustomState(this, "-vertical", this.currentOrientation === "vertical");
  }

  /** @private */
  #clearOrientation(): void {
    deleteCustomState(this, "-vertical");
    this._orientation = undefined;
    this.#breakpointUnobserve?.();
    this.#breakpointUnobserve = undefined;
  }

  /** @private */
  #handlePointerDown(e: PointerEvent): void {
    if (e.pointerType === "mouse" && e.button > 1) return;
    if (this.disabled) return;

    this._dragHandle.setPointerCapture(e.pointerId);
    this.#valueChanged = false;

    let min = this.min;
    if (min === 0 && this.detents.length > 0) {
      const detent = this.#getClosestDetent(0);
      if (detent > -1) {
        min = this.#computeDetent(this.detents[detent]) ?? this.min;
      }
    }

    let max = this.max;
    if (max === 100 && this.detents.length > 0) {
      const detent = this.#getClosestDetent(100);
      if (detent > -1) {
        max = this.#computeDetent(this.detents[detent]) ?? this.max;
      }
    }

    this.#dragState = {
      startPos: this.currentOrientation === "vertical" ? e.clientY : e.clientX,
      startValue: this.value,
      cachedSize: this.currentOrientation === "vertical" ? this.clientHeight : this.clientWidth,
      min,
      max,
    };
  }

  /** @private */
  #handlePointerMove(e: PointerEvent): void {
    if (!this._dragHandle.hasPointerCapture(e.pointerId) || !this.#dragState) return;

    const pos = this.currentOrientation === "vertical" ? e.clientY : e.clientX;

    let delta =
      this.#dragState.cachedSize > 0 ? ((pos - this.#dragState.startPos) / this.#dragState.cachedSize) * 100 : 0;
    if (M3eDirectionality.current === "rtl" && this.currentOrientation !== "vertical") {
      delta = -delta;
    }

    let value = this.#dragState.startValue + delta;
    if (value < this.#dragState.min) {
      const overshoot = this.#dragState.min - value;
      const compressed = (this.overshootLimit * overshoot) / (overshoot + this.overshootLimit);
      value = this.#dragState.min - compressed;
    } else if (value > this.#dragState.max) {
      const overshoot = value - this.#dragState.max;
      const compressed = (this.overshootLimit * overshoot) / (overshoot + this.overshootLimit);
      value = this.#dragState.max + compressed;
    }

    if (this.#changeValue(value, false, true)) {
      this.#valueChanged = true;
    }
  }

  /** @private */
  #handlePointerUp(e: PointerEvent): void {
    if (e.pointerType === "mouse" && e.button > 1) return;
    if (this._dragHandle.hasPointerCapture(e.pointerId)) {
      this._dragHandle.releasePointerCapture(e.pointerId);
      this.#dragState = undefined;

      const detent = this.#getClosestDetent(this.value);
      if (detent >= 0) {
        const value = this.#computeDetent(this.detents[detent]);
        if (value !== undefined) {
          this.#snapToValue(value, false);
        }
      } else if (this.value < this.min) {
        this.#snapToValue(this.min, false);
      } else if (this.value > this.max) {
        this.#snapToValue(this.max, false);
      }

      if (this.#valueChanged) {
        this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
        this.#valueChanged = false;
      }
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    const ltr = M3eDirectionality.current === "ltr" || this.currentOrientation === "vertical";
    switch (e.key) {
      case "Up":
      case "ArrowUp":
      case "Left":
      case "ArrowLeft": {
        e.preventDefault();
        const detent = this.#getClosestDetent(this.value);
        if (detent >= 0) {
          const nextDetent = ltr ? this.#getNextLowerDetent(detent) : this.#getNextHigherDetent(detent);
          if (nextDetent !== detent && !this.#snapAnimation) {
            const value = this.#computeDetent(this.detents[nextDetent]);
            if (value !== undefined) {
              this.#snapToValue(value);
            }
          }
        } else if (this.step > 1) {
          if (!this.#snapAnimation) {
            this.#snapToValue(this.value + (ltr ? -this.step : this.step));
          }
        } else {
          this.#changeValue(this.value + (ltr ? -this.step : this.step));
        }
        break;
      }

      case "Down":
      case "ArrowDown":
      case "Right":
      case "ArrowRight": {
        e.preventDefault();
        const detent = this.#getClosestDetent(this.value);
        if (detent >= 0) {
          const nextDetent = ltr ? this.#getNextHigherDetent(detent) : this.#getNextLowerDetent(detent);
          if (nextDetent !== detent && !this.#snapAnimation) {
            const value = this.#computeDetent(this.detents[nextDetent]);
            if (value !== undefined) {
              this.#snapToValue(value);
            }
          }
        } else if (this.step > 1) {
          if (!this.#snapAnimation) {
            this.#snapToValue(this.value + (ltr ? this.step : -this.step));
          }
        } else {
          this.#changeValue(this.value + (ltr ? this.step : -this.step));
        }

        break;
      }

      case "Home": {
        e.preventDefault();
        if (!this.#snapAnimation) {
          const next = this.#getClosestDetent(this.min);
          if (next > -1) {
            this.#snapToValue(this.#computeDetent(this.detents[next])!);
          } else {
            this.#snapToValue(this.min);
          }
        }

        break;
      }

      case "End": {
        e.preventDefault();
        if (!this.#snapAnimation) {
          const next = this.#getClosestDetent(this.max);
          if (next > -1) {
            this.#snapToValue(this.#computeDetent(this.detents[next])!);
          } else {
            this.#snapToValue(this.max);
          }
        }

        break;
      }

      case "PageUp": {
        e.preventDefault();
        if (!this.#snapAnimation) {
          const detent = this.#getClosestDetent(this.value);
          if (detent >= 0) {
            const nextDetent = this.#getNextLowerDetent(detent);
            if (nextDetent !== detent) {
              const value = this.#computeDetent(this.detents[nextDetent]);
              if (value !== undefined) {
                this.#snapToValue(value);
              }
            }
          } else {
            this.#snapToValue(this.value - Math.max(10, this.step));
          }
        }

        break;
      }

      case "PageDown": {
        e.preventDefault();
        if (!this.#snapAnimation) {
          const detent = this.#getClosestDetent(this.value);
          if (detent >= 0) {
            const nextDetent = this.#getNextHigherDetent(detent);
            if (nextDetent !== detent) {
              const value = this.#computeDetent(this.detents[nextDetent]);
              if (value !== undefined) {
                this.#snapToValue(value);
              }
            }
          } else {
            this.#snapToValue(this.value + Math.max(10, this.step));
          }
        }

        break;
      }

      case "Enter":
        if (!this.#snapAnimation) {
          this.#cycleDetent();
        }

        break;

      case " ":
        e.preventDefault();
        if (!this.#snapAnimation) {
          this.#cycleDetent();
        }
        break;
    }
  }

  /** @private */
  #changeValue(value: number, emitChange = true, allowOvershoot = false): boolean {
    this.#clearSnapAnimation();

    if (!allowOvershoot) {
      value = Math.max(this.min, Math.min(this.max, value));
    }

    if (value != this.value) {
      const prev = this.value;
      this.value = value;

      if (this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
        this._base.style.setProperty("--_split-pane-value", `${this.value}%`);
        if (emitChange) {
          this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
        }
        return true;
      } else {
        this.value = prev;
      }
    }
    return false;
  }

  /** @private */
  #getClosestDetent(value: number): number {
    let closestDetent = -1;
    let closestDistance = Infinity;

    for (let i = 0; i < this.detents.length; i++) {
      const detent = this.#computeDetent(this.detents[i]);
      if (detent === undefined) continue;

      const distance = Math.abs(value - detent);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestDetent = i;
      }
    }
    return closestDetent;
  }

  /** @private */
  #getNextHigherDetent(detentIndex: number): number {
    const currentValue = this.#computeDetent(this.detents[detentIndex]);
    if (currentValue === undefined) return detentIndex;

    let value = Infinity;
    let nextDetent = detentIndex;
    for (let i = 0; i < this.detents.length; i++) {
      if (i === detentIndex) continue;
      const detent = this.#computeDetent(this.detents[i]);
      if (detent === undefined) continue;
      if (detent > currentValue && detent < value) {
        value = detent;
        nextDetent = i;
      }
    }
    return nextDetent;
  }

  /** @private */
  #getNextLowerDetent(detentIndex: number): number {
    const currentValue = this.#computeDetent(this.detents[detentIndex]);
    if (currentValue === undefined) return detentIndex;

    let value = -Infinity;
    let nextDetent = detentIndex;
    for (let i = 0; i < this.detents.length; i++) {
      if (i === detentIndex) continue;
      const detent = this.#computeDetent(this.detents[i]);
      if (detent === undefined) continue;
      if (detent < currentValue && detent > value) {
        value = detent;
        nextDetent = i;
      }
    }
    return nextDetent;
  }

  /** @private */
  #computeDetent(detent: string): number | undefined {
    const value = detent.endsWith("px") ? this.clientWidth / parseFloat(detent) : parseFloat(detent);
    return !isNaN(value) ? value : undefined;
  }

  /** @private */
  #clearSnapAnimation(): void {
    this.#snapAnimation?.cancel();
    this.#snapAnimation = undefined;
  }

  /** @private */
  #snapToValue(value: number, emitChange = true): void {
    this.#clearSnapAnimation();

    value = Math.max(this.min, Math.min(this.max, value));
    if (value === this.value) return;

    if (!prefersReducedMotion()) {
      addCustomState(this, "-animating");

      this.#snapAnimation = this._base.animate(
        [{ "--_split-pane-value": `${this.value}%` }, { "--_split-pane-value": `${value}%` }],
        {
          duration: 250,
          easing: "cubic-bezier(0.2, 0.0, 0, 1.0)",
        },
      );
      this.#snapAnimation.onfinish = () => {
        this.#changeValue(value, emitChange);
        this.#snapAnimation = undefined;
        deleteCustomState(this, "-animating");
      };
    } else {
      this.#changeValue(value, emitChange);
    }
  }

  /** @private */
  #cycleDetent(): void {
    if (this.detents.length === 0) return;

    const detent = this.#getClosestDetent(this.value);
    if (detent === -1) return;

    let next = this.#getNextHigherDetent(detent);
    if (next === detent && this.wrapDetents) {
      next = this.#getClosestDetent(0);
      if (next === -1) return;
    }

    const value = this.#computeDetent(this.detents[next]);
    if (value !== undefined) {
      this.#snapToValue(value);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-split-pane": M3eSplitPaneElement;
  }
}
