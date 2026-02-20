/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  computeCssSize,
  DesignToken,
  EventAttribute,
  focusWhenReady,
  hasAssignedNodes,
  prefersReducedMotion,
  ResizeController,
  ScrollLockController,
  spaceSeparatedStringConverter,
  VelocityTracker,
} from "@m3e/core";

import { isModifierAllowed, M3eInteractivityChecker } from "@m3e/core/a11y";
import "@m3e/core/a11y";

/**
 * A sheet used to show secondary content anchored to the bottom of the screen.
 *
 * @description
 * The `m3e-bottom-sheet` component implements a Material 3 bottom sheet with
 * gesture‑driven resizing, detent snapping, and adaptive motion. It behaves as
 * a heavy surface: transitions use non‑bouncy, decelerating motion.
 *
 * The sheet supports direct manipulation through vertical drag gestures.
 * Movement below an 8px threshold is ignored to ensure reliable tap‑to‑cycle
 * behavior on the handle. Once activated, dragging updates the sheet height
 * with friction near the minimum height to prevent abrupt collapse.
 *
 * When detents are defined, the sheet snaps to the nearest detent on release.
 * If hideable, downward gestures may dismiss the sheet using either velocity
 * or a small distance threshold below the collapsed detent. When no detents
 * are present, the sheet behaves as a simple open/hidden surface with a
 * bottom‑measured hide threshold.
 *
 * @example
 * The following example shows a modal bottom sheet with a drag handle,
 * three detents (`fit`, `half`, and `full`), and an action list. The sheet
 * is opened using a dedicated `m3e-bottom-sheet-trigger` associated by ID.
 * ```html
 * <m3e-button>
 *   <m3e-bottom-sheet-trigger for="bottomSheet">
 *     Open Bottom sheet
 *   </m3e-bottom-sheet-trigger>
 * </m3e-button>
 *
 * <m3e-bottom-sheet id="bottomSheet" modal handle hideable detents="fit half full">
 *   <m3e-action-list>
 *     <m3e-list-action autofocus>
 *       <m3e-bottom-sheet-action>Google Keep</m3e-bottom-sheet-action>
 *       <span slot="supporting-text">Add to a note</span>
 *     </m3e-list-action>
 *     <m3e-list-action>
 *       <m3e-bottom-sheet-action>Google Docs</m3e-bottom-sheet-action>
 *       <span slot="supporting-text">Embed in a document</span>
 *     </m3e-list-action>
 *   </m3e-action-list>
 * </m3e-bottom-sheet>
 * ```
 *
 * @tag m3e-bottom-sheet
 *
 * @slot - Renders the content of the sheet.
 * @slot header - Renders the header of the sheet.
 *
 * @attr detent - The zero‑based index of the detent the sheet should open to.
 * @attr detents - Detents (discrete height states) the sheet can snap to.
 * @attr handle - Whether to display a drag handle and enable the top region of the sheet as a gesture surface for dragging between detents.
 * @attr handle-label - The accessible label given to the drag handle.
 * @attr hideable - Whether the bottom sheet can hide when its swiped down.
 * @attr hide-friction - The friction coefficient to hide the sheet, or set it to the next closest expanded detent.
 * @attr modal - Whether the bottom sheet behaves as modal.
 * @attr open - Whether the bottom sheet is open.
 *
 * @fires opening - Emitted when the sheet begins to open.
 * @fires opened - Emitted when the sheet has opened.
 * @fires cancel - Emitted when the sheet is cancelled.
 * @fires closing - Emitted when the sheet begins to close.
 * @fires closed - Emitted when the sheet has closed.
 *
 * @cssprop --m3e-bottom-sheet-width - The width of the sheet.
 * @cssprop --m3e-bottom-sheet-max-width - The maximum width of the sheet.
 * @cssprop --m3e-bottom-sheet-container-color - The background color of the sheet container.
 * @cssprop --m3e-bottom-sheet-elevation - The elevation level when not modal.
 * @cssprop --m3e-bottom-sheet-modal-elevation - The elevation level when modal.
 * @cssprop --m3e-bottom-sheet-full-elevation - The elevation level when full height.
 * @cssprop --m3e-bottom-sheet-z-index - The z-index of the non-modal sheet.
 * @cssprop --m3e-bottom-sheet-minimized-container-shape - The border radius when minimized.
 * @cssprop --m3e-bottom-sheet-container-shape - The border radius of the sheet container.
 * @cssprop --m3e-bottom-sheet-full-container-shape - The border radius when full height.
 * @cssprop --m3e-bottom-sheet-scrim-color - The color of the scrim overlay.
 * @cssprop --m3e-bottom-sheet-scrim-opacity - The opacity of the scrim overlay.
 * @cssprop --m3e-bottom-sheet-peek-height - The visible height when minimized.
 * @cssprop --m3e-bottom-sheet-compact-top-space - The top space in compact mode.
 * @cssprop --m3e-bottom-sheet-top-space - The top space in standard mode.
 * @cssprop --m3e-bottom-sheet-padding-block - The vertical padding.
 * @cssprop --m3e-bottom-sheet-padding-inline - The horizontal padding.
 * @cssprop --m3e-bottom-sheet-handle-container-height - The height of the drag handle container.
 * @cssprop --m3e-bottom-sheet-handle-width - The width of the drag handle.
 * @cssprop --m3e-bottom-sheet-handle-height - The height of the drag handle.
 * @cssprop --m3e-bottom-sheet-handle-shape - The border radius of the handle.
 * @cssprop --m3e-bottom-sheet-handle-color - The color of the drag handle.
 * @cssprop --m3e-bottom-sheet-handle-focus-ring-offset - The offset of the focus ring around the handle.
 */
@customElement("m3e-bottom-sheet")
export class M3eBottomSheetElement extends EventAttribute(
  LitElement,
  "opening",
  "opened",
  "cancel",
  "closing",
  "closed",
) {
  static {
    if (document) {
      const lightDomStyle = new CSSStyleSheet();
      lightDomStyle.replaceSync(
        css`
          @property --_bottom-sheet-height {
            syntax: "<length>";
            inherits: false;
            initial-value: 50vh;
          }
          m3e-bottom-sheet > [slot="header"] {
            margin-block-end: var(--m3e-bottom-sheet-padding-block, 0.5rem);
            margin-inline: var(--m3e-bottom-sheet-padding-inline, 1rem);
          }
        `.toString(),
      );
      document.adoptedStyleSheets.push(lightDomStyle);
    }
  }

  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      position: fixed;
      left: 50%;
      top: calc(100vh - var(--_bottom-sheet-height));
      margin: 0;
      padding: 0;
      outline: none;
      overflow: hidden;
      border: none;
      box-sizing: border-box;
      width: var(--m3e-bottom-sheet-width, 100%);
      max-width: var(--m3e-bottom-sheet-max-width, 40rem);
      height: var(--_bottom-sheet-height);
      background-color: var(--m3e-bottom-sheet-container-color, ${DesignToken.color.surfaceContainerLow});
      transition: ${unsafeCSS(
        `transform ${DesignToken.motion.duration.medium2} ${DesignToken.motion.easing.standardDecelerate},
        border-radius ${DesignToken.motion.duration.medium2} ${DesignToken.motion.easing.standard}`,
      )};
    }
    :host(:not([modal]):not(.-full)) .elevation {
      --m3e-elevation-level: var(--m3e-bottom-sheet-elevation, ${DesignToken.elevation.level1});
    }
    :host([modal]:not(.-full)) .elevation {
      --m3e-elevation-level: var(--m3e-bottom-sheet-modal-elevation, ${DesignToken.elevation.level1});
    }
    :host(.-full) .elevation {
      --m3e-elevation-level: var(--m3e-bottom-sheet-full-elevation, ${DesignToken.elevation.level1});
    }
    :host(:not([modal])) {
      z-index: var(--m3e-bottom-sheet-z-index, 10);
    }
    :host(:not([modal]):not([open])),
    :host([modal]:not(:popover-open)) {
      border-radius: var(--m3e-bottom-sheet-minimized-container-shape, ${DesignToken.shape.corner.none});
      transform: translateX(-50%) translateY(100%);
    }
    :host(:not([modal])[open]:not(.-full)),
    :host([modal]:not(.-full):popover-open) {
      border-radius: var(--m3e-bottom-sheet-container-shape, ${DesignToken.shape.corner.extraLargeTop});
    }
    :host(:not([modal])[open].-full),
    :host([modal].-full:popover-open) {
      border-radius: var(--m3e-bottom-sheet-full-container-shape, ${DesignToken.shape.corner.extraLargeTop});
    }
    :host(:not([modal])[open]),
    :host([modal]:popover-open) {
      transform: translateX(-50%) translateY(0);
    }
    :host([modal])::backdrop {
      transition: ${unsafeCSS(
        `background-color ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}, 
        overlay ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete,
        visibility ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    :host([modal]:popover-open)::backdrop {
      background-color: color-mix(
        in srgb,
        var(--m3e-bottom-sheet-scrim-color, ${DesignToken.color.scrim}) var(--m3e-bottom-sheet-scrim-opacity, 32%),
        transparent
      );
      transition: ${unsafeCSS(
        `background-color ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard}, 
        overlay ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard} allow-discrete,
        visibility ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    @starting-style {
      :host([modal]:popover-open)::backdrop {
        background-color: color-mix(
          in srgb,
          var(--m3e-bottom-sheet-scrim-color, ${DesignToken.color.scrim}) 0%,
          transparent
        );
      }
    }
    .base {
      display: flex;
      border-radius: inherit;
      flex-direction: column;
      height: 100%;
      --_bottom-sheet-peek-height: var(--m3e-bottom-sheet-peek-height, 0);
      --_bottom-sheet-top-space: var(--m3e-bottom-sheet-compact-top-space, 4.5rem);
    }
    @media (max-height: 640px) {
      .base {
        --_bottom-sheet-top-space: var(--m3e-bottom-sheet-top-space, 3.5rem);
      }
    }
    .body {
      flex: 1 1 auto;
      overflow-y: auto;
      scrollbar-width: ${DesignToken.scrollbar.thinWidth};
      scrollbar-color: ${DesignToken.scrollbar.color};
      padding-block-end: var(--m3e-bottom-sheet-padding-block, 0.5rem);
      padding-inline: var(--m3e-bottom-sheet-padding-inline, 1rem);
    }
    .content {
      height: fit-content;
    }
    :host(:not([handle]):not(.-has-header)) .header {
      display: none;
    }
    :host(:not([handle]):not(.-has-header)) .body,
    .header {
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
      padding-block-start: var(--m3e-bottom-sheet-padding-block, 0.5rem);
    }
    .header {
      cursor: grab;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      box-sizing: border-box;
      flex: none;
      display: flex;
      flex-direction: column;
      min-height: 3rem;
      --m3e-app-bar-container-color: var(--m3e-bottom-sheet-container-color, ${DesignToken.color.surfaceContainerLow});
    }
    .handle-row {
      position: relative;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 1;
      visibility: visible;
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard},
        padding ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard},
        height ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard},
        visibility ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
      height: var(--m3e-bottom-sheet-handle-container-height, 1.5rem);
    }
    .handle {
      position: relative;
      width: var(--m3e-bottom-sheet-handle-width, 2rem);
      height: var(--m3e-bottom-sheet-handle-height, 0.25rem);
      border-radius: var(--m3e-bottom-sheet-handle-shape, ${DesignToken.shape.corner.full});
      background-color: var(--m3e-bottom-sheet-handle-color, ${DesignToken.color.onSurfaceVariant});
    }
    .focus-ring {
      top: calc(0px - var(--m3e-bottom-sheet-handle-focus-ring-offset, 0.125rem));
      left: calc(0px - var(--m3e-bottom-sheet-handle-focus-ring-offset, 0.125rem));
      right: calc(0px - var(--m3e-bottom-sheet-handle-focus-ring-offset, 0.125rem));
      bottom: calc(0px - var(--m3e-bottom-sheet-handle-focus-ring-offset, 0.125rem));
    }
    .handle-touch {
      position: absolute;
      aspect-ratio: 1 / 1;
      height: 3rem;
      left: calc(0px - calc(calc(3rem - var(--m3e-bottom-sheet-handle-width, 2rem)) / 2));
      right: calc(0px - calc(calc(3rem - var(--m3e-bottom-sheet-handle-width, 2rem)) / 2));
      top: calc(
        0px - calc(
            calc(3rem - var(--m3e-bottom-sheet-handle-container-height, 1.5rem)) - calc(
                var(--m3e-bottom-sheet-handle-height, 0.25rem) / 2
              )
          )
      );
    }
    @media (prefers-reduced-motion) {
      :host,
      :host([modal])::backdrop,
      :host([modal]:popover-open)::backdrop,
      .handle {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      :host([modal])::backdrop,
      :host([modal]:popover-open)::backdrop {
        transition: none;
      }
      .base {
        border-style: solid;
        border-width: 1px;
        border-color: CanvasText;
      }
      .handle {
        background-color: ButtonText;
      }
    }
  `;

  /** @private */ private static __openSheet?: M3eBottomSheetElement;

  /** @private */ readonly #documentClickHandler = (e: Event) => this.#handleDocumentClick(e);
  /** @private */ readonly #documentKeyDownHandler = (e: KeyboardEvent) => this.#handleDocumentKeyDown(e);
  /** @private */ readonly #windowResizeHandler = () => this.#handleWindowResize();
  /** @private */ readonly #inerts = new Array<HTMLElement>();
  /** @private */ readonly #velocityTracker = new VelocityTracker();
  /** @private */ readonly #scrollLockController = new ScrollLockController(this);

  /** @private */
  readonly #resizeController = new ResizeController(this, {
    target: null,
    skipInitial: true,
    callback: (x) => this.#handleSectionResize(x),
  });

  /** @private */ #trigger: Element | null = null;
  /** @private */ #dragState?: { startY: number; startHeight: number; maxHeight: number; minHeight: number };
  /** @private */ #dragged = false;
  /** @private */ #activeDetent = 0;
  /** @private */ #requestDetent?: number;
  /** @private */ #cachedContentHeight = 0;
  /** @private */ #cachedHeaderHeight = 0;
  /** @private */ #snapAnimation?: Animation;

  /**
   * Whether the bottom sheet behaves as modal.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) modal = false;

  /**
   * Whether the bottom sheet is open.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * Whether to display a drag handle and enable the top region of the sheet as a gesture
   * surface for dragging between detents.
   * @default false
   */
  @property({ type: Boolean }) handle = false;

  /**
   * The accessible label given to the drag handle.
   * @default "Drag handle"
   */
  @property({ attribute: "handle-label" }) handleLabel = "Drag handle";

  /**
   * Detents (discrete height states) the sheet can snap to.
   * @default []
   */
  @property({ attribute: "detents", converter: spaceSeparatedStringConverter }) detents: string[] = [];

  /**
   * The zero‑based index of the detent the sheet should open to.
   * @default 0
   */
  @property({ type: Number }) detent = 0;

  /**
   * Whether the bottom sheet can hide when its swiped down.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) hideable = false;

  /**
   * The friction coefficient to hide the sheet, or set it to the next closest expanded detent.
   * @default 0.5
   */
  @property({ attribute: "hide-friction", type: Number }) hideFriction = 0.5;

  /**
   * Shows the sheet.
   * @param {number} detent The zero‑based index of the detent the sheet should open to.
   */
  show(detent: number = this.detent): void {
    if (!this.open) {
      this.#requestDetent = detent;
      this.open = true;
    } else if (detent !== undefined && this.#activeDetent !== detent) {
      this.#snapToDetent(detent);
    }
  }

  /** Hides the sheet. */
  hide(): void {
    this.open = false;
  }

  /**
   * Toggles the opened state of the sheet.
   * @param {number} detent The zero‑based index of the detent the sheet should open to.
   */
  toggle(detent?: number): void {
    if (this.open) {
      this.hide();
    } else {
      this.show(detent);
    }
  }

  /** Moves the sheet to the next detent. */
  cycle(): void {
    if (!this.open) {
      this.show();
    } else if (this.detents.length > 0) {
      if (this.#activeDetent < this.detents.length - 1) {
        this.#activeDetent++;
        this.#snapToDetent(this.#activeDetent);
      } else if (this.hideable) {
        this.hide();
      }
    } else {
      this.hide();
    }
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("modal")) {
      this.role = this.modal ? "dialog" : "region";
      this.ariaModal = this.modal ? "true" : null;
      this.popover = this.modal ? "manual" : null;
    }
  }

  /** @inheritdoc */
  override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    const content = this.shadowRoot?.querySelector<HTMLElement>(".content");
    if (content) {
      this.#cachedContentHeight = content.clientHeight;
      this.#resizeController.observe(content);
    }

    const header = this.shadowRoot?.querySelector<HTMLElement>(".header");
    if (header) {
      this.#cachedHeaderHeight = header.clientHeight;
      this.#resizeController.observe(header);
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("open")) {
      if (this.open) {
        if (!this.dispatchEvent(new Event("opening", { cancelable: true }))) {
          this.open = false;
          return;
        }

        // Only one sheet can be open at a time.
        if (M3eBottomSheetElement.__openSheet !== this) {
          M3eBottomSheetElement.__openSheet?.hide();
        }
        M3eBottomSheetElement.__openSheet = this;

        this.inert = false;

        window.addEventListener("resize", this.#windowResizeHandler);

        // If there are detents (regardless of handle) open to the requested, default (or first) detent.
        // Otherwise, open to fit unless its greater than half.

        if (this.detents.length > 0) {
          this.#activeDetent = Math.min(Math.max(0, this.#requestDetent ?? this.detent), this.detents.length - 1);
          this.#updateHeight(this.#computeDetentHeight(this.detents[this.#activeDetent]));
        } else {
          this.#updateHeight(Math.min(this.#computeDetentHeight("fit"), this.#computeDetentHeight("half")));
        }
        this.#requestDetent = undefined;
      } else {
        if (!this.dispatchEvent(new Event("closing", { cancelable: true }))) {
          this.open = true;
          return;
        }

        // The following ensures layout is stable so that first tab isn't "skipped"
        requestAnimationFrame(() => (this.inert = true));

        window.removeEventListener("resize", this.#windowResizeHandler);

        if (M3eBottomSheetElement.__openSheet === this) {
          M3eBottomSheetElement.__openSheet = undefined;
        }
      }

      if (this.modal) {
        if (this.open) {
          this.#trigger = document.activeElement;
          this.#applyInert();
          this.#scrollLockController.lock();
          this.showPopover();
          requestAnimationFrame(() => {
            document.addEventListener("click", this.#documentClickHandler);
            document.addEventListener("keydown", this.#documentKeyDownHandler);
          });

          let focusable: HTMLElement | null | undefined = this.querySelector<HTMLElement>("[autofocus]");
          if (!focusable || !M3eInteractivityChecker.isFocusable(focusable)) {
            focusable = this.shadowRoot?.querySelector(".handle");
          }
          if (focusable) {
            focusWhenReady(focusable);
          }
        } else {
          this.#snapToHeight(0).then(() => {
            this.#restoreInert();
            this.#scrollLockController.unlock();
            document.removeEventListener("click", this.#documentClickHandler);
            document.removeEventListener("keydown", this.#documentKeyDownHandler);
            this.hidePopover();
            if (this.#trigger instanceof HTMLElement) {
              this.#trigger.focus();
            }
            this.#trigger = null;
          });
        }
      }

      this.dispatchEvent(new Event(this.open ? "opened" : "closed"));
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<m3e-focus-trap ?disabled="${!this.modal}">
      <div class="base">
        <m3e-elevation class="elevation"></m3e-elevation>
        <div
          class="header"
          @pointerdown="${this.#handleHeaderPointerDown}"
          @pointermove="${this.#handleHeaderPointerMove}"
          @pointerup="${this.#handleHeaderPointerUp}"
        >
          ${this.handle
            ? html`<div class="handle-row">
                <div
                  id="handle"
                  class="handle"
                  role="button"
                  aria-label="${this.handleLabel}"
                  tabindex="0"
                  @click="${this.#handleDragHandleClick}"
                  @keydown="${this.#handleDragHandleKeyDown}"
                >
                  <m3e-focus-ring class="focus-ring" for="handle"></m3e-focus-ring>
                  <div class="handle-touch" aria-hidden="true"></div>
                </div>
              </div>`
            : nothing}
          <slot name="header" @slotchange="${this.#handleHeaderSlotChange}"></slot>
        </div>
        <div class="body">
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    </m3e-focus-trap>`;
  }

  /** @private */
  #handleHeaderSlotChange(e: Event): void {
    this.classList.toggle("-has-header", hasAssignedNodes(e.target as HTMLSlotElement));
  }

  /** @private */
  #handleHeaderPointerDown(e: PointerEvent): void {
    if (e.button === 2) return;

    if (e.target instanceof HTMLElement && M3eInteractivityChecker.isFocusable(e.target)) {
      return;
    }

    (<HTMLElement>e.target).setPointerCapture(e.pointerId);
    (<HTMLElement>e.target).style.cursor = "grabbing";

    this.#velocityTracker.reset();
    this.#velocityTracker.add(e.clientY);

    this.#dragState = {
      startY: e.clientY,
      startHeight: this.clientHeight,
      maxHeight: this.#computeMaxHeight(),
      minHeight: this.#computeMinHeight(),
    };
    this.#dragged = false;
  }

  /** @private */
  #handleHeaderPointerMove(e: PointerEvent): void {
    if (!this.#dragState) {
      return;
    }

    const minDragThreshold = 8;
    if (Math.abs(e.clientY - this.#dragState.startY) <= minDragThreshold) {
      // Ignore movement under threshold
      return;
    }

    (e.getCoalescedEvents?.() ?? [e]).forEach((x) => this.#velocityTracker.add(x.clientY, e.timeStamp));

    let newHeight = this.#dragState.startHeight - (e.clientY - this.#dragState.startY);
    if (newHeight < this.#dragState.minHeight) {
      const overshoot = (this.#dragState.minHeight - newHeight) * this.hideFriction;
      newHeight = this.#dragState.minHeight - overshoot;
    }

    this.#updateHeight(Math.min(this.#dragState.maxHeight, newHeight));
    this.#dragged = true;
  }

  /** @private */
  #handleHeaderPointerUp(e: PointerEvent): void {
    if (!this.#dragState) return;

    try {
      (<HTMLElement>e.target).releasePointerCapture(e.pointerId);
      (<HTMLElement>e.target).style.cursor = "";

      if (!this.#dragged) return;

      const significantVelocityThreshold = e.pointerType === "touch" ? 1200 : 500;
      const velocity = this.#velocityTracker.getVelocity();

      this.#velocityTracker.reset();

      if (this.hideable && velocity >= significantVelocityThreshold) {
        if (this.dispatchEvent(new Event("cancel", { cancelable: true }))) {
          this.hide();
        }
      } else if (Math.abs(velocity) >= significantVelocityThreshold) {
        if (this.detents.length > 0) {
          const nextDetent = this.#getNextHigherDetent();
          if (nextDetent !== this.#activeDetent) {
            this.#snapToDetent(nextDetent);
          }
        } else {
          this.#snapToHeight(this.#computeDetentHeight("full"));
        }
      } else {
        const hideDistanceThreshold = 20;
        if (this.hideable) {
          const collapsed = this.#dragState.minHeight;
          if (this.clientHeight < collapsed - hideDistanceThreshold) {
            this.hide();
            return;
          }
        }

        if (this.detents.length > 0) {
          this.#snapToDetent(this.#getClosestDetent());
        } else if (this.clientHeight < this.#dragState.minHeight) {
          this.#snapToHeight(this.#dragState.minHeight);
        }
      }
    } finally {
      this.#dragState = undefined;
    }
  }

  /** @private */
  #handleDocumentClick(e: Event): void {
    if (
      this.open &&
      this.modal &&
      !e.composedPath().includes(this) &&
      this.dispatchEvent(new Event("cancel", { cancelable: true }))
    ) {
      this.hide();
    }
  }

  /** @private */
  #handleDocumentKeyDown(e: KeyboardEvent): void {
    if (this.open && this.modal && e.key === "Escape" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();

      if (this.dispatchEvent(new Event("cancel", { cancelable: true }))) {
        this.hide();
      }
    }
  }

  /** @private */
  #handleWindowResize(): void {
    if (this.detents.length > 0 && this.detents[this.#activeDetent] === "half") {
      this.#updateHeight(this.#computeDetentHeight("half"));
      return;
    }

    const maxHeight = this.#computeMaxHeight();
    if (this.classList.contains("-full")) {
      this.#updateHeight(maxHeight);
    } else if (this.clientHeight > maxHeight) {
      this.#updateHeight(maxHeight);
    }
  }

  /** @private */
  #handleDragHandleClick(): void {
    if (!this.#dragged) {
      this.cycle();
    }
    this.#dragged = false;
  }

  /** @private */
  #handleDragHandleKeyDown(e: KeyboardEvent): void {
    if (e.defaultPrevented || !isModifierAllowed(e)) return;

    switch (e.key) {
      case "Up":
      case "ArrowUp":
        e.preventDefault();
        if (this.detents.length > 0) {
          const nextDetent = this.#getNextHigherDetent();
          if (nextDetent !== this.#activeDetent) {
            this.#snapToDetent(nextDetent);
          }
        } else {
          this.#snapToHeight(this.#computeDetentHeight("full"));
        }
        break;

      case "Down":
      case "ArrowDown":
        e.preventDefault();
        if (this.detents.length > 0) {
          const nextDetent = this.#getNextLowerDetent();
          if (nextDetent !== this.#activeDetent) {
            this.#snapToDetent(nextDetent);
          } else if (this.hideable) {
            this.hide();
          }
        } else if (this.hideable) {
          this.hide();
        }

        break;
    }
  }

  /** @private */
  #getNextHigherDetent(): number {
    const currentHeight = this.clientHeight;
    let nextHeight = Infinity;
    let nextDetent = this.#activeDetent;
    for (let i = 0; i < this.detents.length; i++) {
      if (i === this.#activeDetent) continue;
      const detentHeight = this.#computeDetentHeight(this.detents[i]);
      if (detentHeight > currentHeight && detentHeight < nextHeight) {
        nextHeight = detentHeight;
        nextDetent = i;
      }
    }
    return nextDetent;
  }

  /** @private */
  #getNextLowerDetent(): number {
    const currentHeight = this.clientHeight;
    let nextHeight = -Infinity;
    let nextDetent = this.#activeDetent;
    for (let i = 0; i < this.detents.length; i++) {
      if (i === this.#activeDetent) continue;
      const detentHeight = this.#computeDetentHeight(this.detents[i]);
      if (detentHeight < currentHeight && detentHeight > nextHeight) {
        nextHeight = detentHeight;
        nextDetent = i;
      }
    }
    return nextDetent;
  }

  /** @private */
  #getClosestDetent(): number {
    const currentHeight = this.clientHeight;
    let closestDetent = this.#activeDetent;
    let closestDistance = Infinity;

    for (let i = 0; i < this.detents.length; i++) {
      const detentHeight = this.#computeDetentHeight(this.detents[i]);
      const distance = Math.abs(currentHeight - detentHeight);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestDetent = i;
      }
    }
    return closestDetent;
  }

  /** @private */
  #computeDetentHeight(detent: string): number {
    switch (detent) {
      case "collapsed":
        return this.#computeMinHeight();
      case "half":
        return this.#computeMaxHeight() * 0.5;
      case "full":
        return this.#computeMaxHeight();
      case "fit":
        return this.#computeFitHeight();
    }

    if (detent.endsWith("%")) {
      return this.#computeMaxHeight() * (parseFloat(detent) / 100);
    }

    if (detent.endsWith("px")) {
      return parseFloat(detent);
    }

    return this.#computeMinHeight();
  }

  /** @private */
  #computeMaxHeight(): number {
    const base = this.shadowRoot?.querySelector<HTMLElement>(".base");
    return window.innerHeight - (base ? computeCssSize(base, "var(--_bottom-sheet-top-space)") : 0);
  }

  /** @private */
  #computeMinHeight(): number {
    return this.detents.includes("fit") && !this.detents.includes("collapsed")
      ? this.#computeFitHeight()
      : this.#computePeekHeight();
  }

  /** @private */
  #computePeekHeight(): number {
    const base = this.shadowRoot?.querySelector<HTMLElement>(".base");
    return this.#cachedHeaderHeight + (base ? computeCssSize(base, "var(--_bottom-sheet-peek-height)") : 0);
  }

  /** @private */
  #computeFitHeight(): number {
    const body = this.shadowRoot?.querySelector<HTMLElement>(".body");
    if (!body) {
      return 0;
    }

    const bodyStyle = getComputedStyle(body);
    return (
      this.#cachedHeaderHeight +
      this.#cachedContentHeight +
      parseFloat(bodyStyle.paddingBlockStart) +
      parseFloat(bodyStyle.paddingBlockEnd)
    );
  }

  /** @private */
  #handleSectionResize(entries: ResizeObserverEntry[]): void {
    const oldCachedContentHeight = this.#cachedContentHeight;
    const oldCachedHeaderHeight = this.#cachedHeaderHeight;

    for (const entry of entries) {
      if (entry.target.classList.contains("content")) {
        this.#cachedContentHeight = (<ResizeObserverSize>(
          (Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize)
        )).blockSize;
      } else if (entry.target.classList.contains("header")) {
        this.#cachedHeaderHeight = (<ResizeObserverSize>(
          (Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize)
        )).blockSize;
      }
    }

    if (
      this.open &&
      this.detents.length > 0 &&
      (oldCachedContentHeight !== this.#cachedContentHeight || oldCachedHeaderHeight !== this.#cachedHeaderHeight)
    ) {
      switch (this.detents[this.#activeDetent]) {
        case "fit":
          this.#updateHeight(this.#computeFitHeight());
          break;

        case "collapsed":
          this.#updateHeight(this.#computeMinHeight());
          break;
      }
    }
  }

  /** @private */
  #snapToDetent(detent: number): void {
    if (detent >= 0 && detent < this.detents.length) {
      this.#activeDetent = detent;
      this.#snapToHeight(this.#computeDetentHeight(this.detents[detent]));
    }
  }

  /** @private */
  async #snapToHeight(height: number): Promise<void> {
    if (this.#snapAnimation) {
      this.#updateHeight(this.clientHeight);
      this.#snapAnimation?.cancel();
      this.#snapAnimation = undefined;
    }

    if (!prefersReducedMotion()) {
      this.#snapAnimation = this.animate(
        [{ "--_bottom-sheet-height": `${this.clientHeight}px` }, { "--_bottom-sheet-height": `${height}px` }],
        {
          duration: 250,
          easing: "cubic-bezier(0.2, 0.0, 0, 1.0)",
        },
      );
      this.#snapAnimation.onfinish = () => {
        this.#updateHeight(height);
        this.#snapAnimation = undefined;
      };
      await this.#snapAnimation.finished;
    } else {
      this.#updateHeight(height);
    }
  }

  /** @private */
  #updateHeight(height: number): void {
    this.style.setProperty("--_bottom-sheet-height", `${height}px`);
    this.classList.toggle("-full", height === this.#computeMaxHeight());
    const content = this.shadowRoot?.querySelector<HTMLElement>(".content");
    if (content) {
      content.inert = height <= this.#computePeekHeight();
    }
  }

  /** @private */
  #applyInert() {
    this.#inerts.length = 0;

    for (
      let current: Node = this as Node;
      current.parentNode && current.parentNode !== document.documentElement;
      current = current.parentNode
    ) {
      for (const sibling of current.parentNode.children) {
        if (sibling instanceof HTMLElement && sibling !== current && !sibling.inert) {
          sibling.inert = true;
          this.#inerts.push(sibling);
        }
      }
    }
  }

  /** @private */
  #restoreInert(): void {
    this.#inerts.forEach((x) => (x.inert = false));
    this.#inerts.length = 0;
  }
}

interface M3eBottomSheetElementEventMap extends HTMLElementEventMap {
  opening: Event;
  opened: Event;
  closing: Event;
  closed: Event;
  cancel: Event;
}

export interface M3eBottomSheetElement {
  addEventListener<K extends keyof M3eBottomSheetElementEventMap>(
    type: K,
    listener: (this: M3eBottomSheetElement, ev: M3eBottomSheetElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eBottomSheetElementEventMap>(
    type: K,
    listener: (this: M3eBottomSheetElement, ev: M3eBottomSheetElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-bottom-sheet": M3eBottomSheetElement;
  }
}
