import { CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

import {
  addCustomState,
  AttachInternals,
  customElement,
  deleteCustomState,
  hasAssignedNodes,
  hasCustomState,
  ReconnectedCallback,
  ResizeController,
  waitForUpdate,
} from "@m3e/web/core";

import { Breakpoint, M3eBreakpointObserver } from "@m3e/web/core/layout";
import { SupportsDirectionality } from "@m3e/web/core/bidi";
import "@m3e/web/core/a11y";

import { DrawerMode, isDrawerMode } from "./DrawerMode";

import { DrawerContainerStyle } from "./styles";

/**
 * A container for one or two sliding drawers.
 *
 * @description
 * A responsive layout container that manages left and right drawers alongside main content.
 * Supports `over`, `push`, `side`, and `auto` modes, adapting drawer behavior based on breakpoint size.
 * Encodes spatial hierarchy, motion transitions, and accessibility semantics for modal, dismissible,
 * and permanent navigation.
 *
 * @example
 * Use the `start` and `end` slots for drawers and the default slot for main content.
 *
 * ```html
 * <m3e-drawer-container start end>
 *   <div slot="start">Start drawer</div>
 *   <div>Main content</div>
 *   <div slot="end">End drawer</div>
 * </m3e-drawer-container>
 * ```
 *
 * @example
 * Set the width of a drawer on its slotted element.
 *
 * ```html
 * <m3e-drawer-container start>
 *   <div slot="start" style="width: 200px;">Start drawer</div>
 *   <div>Main content</div>
 * </m3e-drawer-container>
 * ```
 *
 * @example
 * Use `start-mode="push"` to move content when the drawer opens.
 *
 * ```html
 * <m3e-drawer-container start start-mode="push">
 *   <div slot="start">Start drawer</div>
 *   <div>Main content</div>
 * </m3e-drawer-container>
 * ```
 *
 * @example
 * Use `start-mode="over"` to overlay the main content.
 *
 * ```html
 * <m3e-drawer-container start start-mode="over">
 *   <div slot="start">Start drawer</div>
 *   <div>Main content</div>
 * </m3e-drawer-container>
 * ```
 *
 * @example
 * Use `end-divider` to show a divider for a side-mode drawer.
 *
 * ```html
 * <m3e-drawer-container end end-mode="side" end-divider>
 *   <div>Main content</div>
 *   <div slot="end">End drawer</div>
 * </m3e-drawer-container>
 * ```
 *
 * @example
 * Nest a drawer toggle in a clickable element and connect `for` to the drawer's id. Import `@m3e/web/icon-button` and `@m3e/web/icon` for the button and icons; place the button in an element that supports its `leading-icon` slot.
 *
 * ```html
 * <m3e-icon-button slot="leading-icon" aria-label="Menu" toggle>
 *   <m3e-icon name="menu"></m3e-icon>
 *   <m3e-icon slot="selected" name="menu_open"></m3e-icon>
 *   <m3e-drawer-toggle for="nav-drawer"></m3e-drawer-toggle>
 * </m3e-icon-button>
 * <m3e-drawer-container start-mode="over">
 *   <div slot="start" id="nav-drawer">Start drawer</div>
 *   <div>Main content</div>
 * </m3e-drawer-container>
 * ```
 *
 * @example
 * Use semantic elements for drawer and main content as appropriate.
 *
 * ```html
 * <m3e-drawer-container>
 *   <nav slot="start"></nav>
 *   <main></main>
 *   <aside slot="end"></aside>
 * </m3e-drawer-container>
 * ```
 *
 * @tag m3e-drawer-container
 *
 * @slot - Renders the main content.
 * @slot start - Renders the start drawer.
 * @slot end - Renders the end drawer.
 *
 * @attr end - Whether the end drawer is open.
 * @attr end-mode - The behavior mode of the end drawer.
 * @attr end-divider - Whether to show a divider between the end drawer and content for `side` mode.
 * @attr start - Whether the start drawer is open.
 * @attr start-mode - The behavior mode of the start drawer.
 * @attr start-divider - Whether to show a divider between the start drawer and content for `side` mode.
 *
 * @fires change - Dispatched when the state of the start or end drawers change.
 *
 * @cssprop --m3e-drawer-container-color - The background color of the drawer container.
 * @cssprop --m3e-drawer-container-elevation - The elevation level of the drawer container.
 * @cssprop --m3e-drawer-container-width - The width of the drawer container.
 * @cssprop --m3e-drawer-container-scrim-opacity - The opacity of the scrim behind the drawer.
 * @cssprop --m3e-modal-drawer-start-shape - The shape of the drawer's start edge (typically left in LTR), used by a modal end drawer.
 * @cssprop --m3e-modal-drawer-end-shape - The shape of the drawer's end edge (typically right in LTR), used by a modal start drawer.
 * @cssprop --m3e-modal-drawer-container-color - The background color of the modal drawer container.
 * @cssprop --m3e-modal-drawer-elevation - The elevation level of the modal drawer container.
 * @cssprop --m3e-drawer-divider-color - The color of the divider between drawer sections.
 * @cssprop --m3e-drawer-divider-thickness - The thickness of the divider line.
 */
@customElement("m3e-drawer-container")
export class M3eDrawerContainerElement extends SupportsDirectionality(
  ReconnectedCallback(AttachInternals(LitElement)),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = DrawerContainerStyle;

  /** @private */ @state() private _startMode: Exclude<DrawerMode, "auto"> = "side";
  /** @private */ @state() private _endMode: Exclude<DrawerMode, "auto"> = "side";
  /** @private */ #breakpointUnobserve?: () => void;
  /** @private */ #disableStartFocusTrap = false;
  /** @private */ #disableEndFocusTrap = false;

  /** @private */
  #resizeController = new ResizeController(this, {
    target: null,
    skipInitial: true,
    callback: (entries) => this.#handleDrawerResize(entries),
  });

  /**
   * Whether the start drawer is open.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) start = false;

  /**
   * The behavior mode of the start drawer.
   * @default "side"
   */
  @property({ attribute: "start-mode", reflect: true, useDefault: true }) startMode: DrawerMode = "side";

  /**
   * Whether to show a divider between the start drawer and content for `side` mode.
   * @default "side"
   */
  @property({ attribute: "start-divider", type: Boolean, reflect: true }) startDivider = false;

  /**
   * Whether the end drawer is open.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) end = false;

  /**
   * The behavior mode of the end drawer.
   * @default "side"
   */
  @property({ attribute: "end-mode", reflect: true, useDefault: true }) endMode: DrawerMode = "side";

  /**
   * Whether to show a divider between the end drawer and content for `side` mode.
   * @default "side"
   */
  @property({ attribute: "end-divider", type: Boolean, reflect: true }) endDivider = false;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    addCustomState(this, "--no-animate");
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#breakpointUnobserve?.();
    this.#clearMode();
  }

  /** @inheritdoc */
  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("startMode") && !isDrawerMode(this.startMode)) {
      this.startMode = "side";
    }

    if (changedProperties.has("endMode") && !isDrawerMode(this.endMode)) {
      this.endMode = "side";
    }

    if (changedProperties.has("startMode") || changedProperties.has("endMode")) {
      this.#breakpointUnobserve?.();

      if (this.startMode === "auto" || this.endMode === "auto") {
        this.#initBreakpointMonitoring();
      } else {
        this.#updateMode();
      }
    }

    if (changedProperties.has("start")) {
      if (this.start && this.end && this._endMode !== "side") {
        this.end = false;
      }
    } else if (changedProperties.has("end")) {
      if (this.end && this.start && this._startMode !== "side") {
        this.start = false;
      }
    }
  }

  /** @inheritdoc */
  override reconnectedCallback(): void {
    super.reconnectedCallback();
    this.#initialize();

    if (this.startMode === "auto" || this.endMode === "auto") {
      this.#initBreakpointMonitoring();
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    if (this.startMode === "side" && this.endMode === "side") {
      this.#updateMode();
    }
    this.#initialize();
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <div class="start">
        <m3e-focus-trap ?disabled="${!this.start || this._startMode === "side" || this.#disableStartFocusTrap}">
          <slot name="start" @slotchange=${this.#handleStartSlotChange}></slot>
        </m3e-focus-trap>
      </div>
      <div
        class="content"
        .inert="${(this._startMode !== "side" || this._endMode !== "side") && (this.start || this.end)}"
      >
        <slot></slot>
      </div>
      <div class="scrim" @click=${this.#handleScrimClick}></div>
      <div class="end">
        <m3e-focus-trap ?disabled="${!this.end || this._endMode === "side" || this.#disableEndFocusTrap}">
          <slot name="end" @slotchange=${this.#handleEndSlotChange}></slot>
        </m3e-focus-trap>
      </div>
    </div>`;
  }

  /** @private */
  #initialize(): void {
    let drawer = this.shadowRoot?.querySelector<HTMLElement>(".start");
    if (drawer) this.#resizeController.observe(drawer);
    drawer = this.shadowRoot?.querySelector(".end");
    if (drawer) this.#resizeController.observe(drawer);
  }

  /** @private */
  #handleScrimClick() {
    if (this._startMode !== "side") {
      this.start = false;
    }
    if (this._endMode !== "side") {
      this.end = false;
    }
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** @private */
  #handleStartSlotChange(e: Event): void {
    this.#disableStartFocusTrap = !hasAssignedNodes(<HTMLSlotElement>e.target);
  }

  /** @private */
  #handleEndSlotChange(e: Event): void {
    this.#disableEndFocusTrap = !hasAssignedNodes(<HTMLSlotElement>e.target);
  }

  /** @private */
  #handleDrawerResize(entries: ResizeObserverEntry[]): void {
    const base = this.shadowRoot?.querySelector<HTMLElement>(".base");
    if (base) {
      for (const entry of entries) {
        const borderSize: ResizeObserverSize = Array.isArray(entry.borderBoxSize)
          ? entry.borderBoxSize[0]
          : entry.borderBoxSize;

        if (entry.target.classList.contains("start")) {
          base.style.setProperty("--_start-drawer-size", `${borderSize.inlineSize}px`);
        } else if (entry.target.classList.contains("end")) {
          base.style.setProperty("--_end-drawer-size", `${borderSize.inlineSize}px`);
        }
      }
    }

    if (hasCustomState(this, "--no-animate")) {
      // Force synchronous layout flush
      void this.offsetTop;
      deleteCustomState(this, "--no-animate");
    }
  }

  /** @private */
  #initBreakpointMonitoring(): void {
    this.#breakpointUnobserve = M3eBreakpointObserver.observe([Breakpoint.XSmall, Breakpoint.Small], (matches) =>
      this.#updateMode(matches, true),
    );
  }

  /** @private */
  #clearMode(): void {
    deleteCustomState(this, "--start-over");
    deleteCustomState(this, "--start-push");
    deleteCustomState(this, "--start-side");
    deleteCustomState(this, "--end-over");
    deleteCustomState(this, "--end-push");
    deleteCustomState(this, "--end-side");
  }

  /** @inheritdoc */
  async #updateMode(breakpoints?: Map<string, boolean>, autoClose = false): Promise<void> {
    let autoCloseStart = false,
      autoCloseEnd = false;
    if (this.startMode === "auto") {
      if (breakpoints?.get(Breakpoint.Medium)) {
        this._startMode = "side";
      } else if (breakpoints?.get(Breakpoint.Small)) {
        autoCloseStart = this._startMode === "side" && this.start;
        this._startMode = "push";
      } else if (breakpoints?.get(Breakpoint.XSmall)) {
        autoCloseStart = this._startMode !== "over" && this.start;
        this._startMode = "over";
      } else {
        this._startMode = "side";
      }
    } else {
      this._startMode = this.startMode;
    }

    if (this.endMode === "auto") {
      if (breakpoints?.get(Breakpoint.Medium)) {
        this._endMode = "side";
      } else if (breakpoints?.get(Breakpoint.Small)) {
        autoCloseEnd = this._endMode === "side" && this.end;
        this._endMode = "push";
      } else if (breakpoints?.get(Breakpoint.XSmall)) {
        autoCloseEnd = this._endMode !== "over" && this.end;
        this._endMode = "over";
      } else {
        this._endMode = "side";
      }
    } else {
      this._endMode = this.endMode;
    }

    this.#clearMode();

    addCustomState(this, `--start-${this._startMode}`);
    addCustomState(this, `--end-${this._endMode}`);

    if (autoClose && (autoCloseStart || autoCloseEnd)) {
      if (autoCloseStart) {
        this.start = false;
      }
      if (autoCloseEnd) {
        this.end = false;
      }

      await waitForUpdate(this);
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-drawer-container": M3eDrawerContainerElement;
  }
}
