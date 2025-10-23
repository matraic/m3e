import { CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { hasAssignedNodes } from "@m3e/core";
import { Breakpoint, M3eBreakpointObserver } from "@m3e/core/layout";

import { DrawerMode } from "./DrawerMode";

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
 * The following example illustrates a typical drawer layout.
 * ```html
 * <m3e-drawer-container>
 *  <nav slot="start">
 *    <!-- Start drawer content -->
 *  </nav>
 *  <main>
 *    <!-- Main content -->
 *  </main>
 *  <aside slot="end">
 *    <!-- End drawer content -->
 *  </aside>
 * <m3e-drawer-container>
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
 * @fires change - Emitted when the state of the start or end drawers change.
 *
 * @cssprop --m3e-drawer-container-color - The background color of the drawer container.
 * @cssprop --m3e-drawer-container-elevation - The elevation level of the drawer container.
 * @cssprop --m3e-drawer-container-width - The width of the drawer container.
 * @cssprop --m3e-drawer-container-scrim-opacity - The opacity of the scrim behind the drawer.
 * @cssprop --m3e-modal-drawer-start-shape - The shape of the drawer’s start edge (typically left in LTR).
 * @cssprop --m3e-modal-drawer-end-shape - The shape of the drawer’s end edge (typically right in LTR).
 * @cssprop --m3e-modal-drawer-container-color - The background color of the modal drawer container.
 * @cssprop --m3e-modal-drawer-elevation - The elevation level of the modal drawer container.
 * @cssprop --m3e-drawer-divider-color - The color of the divider between drawer sections.
 * @cssprop --m3e-drawer-divider-thickness - The thickness of the divider line.
 */
@customElement("m3e-drawer-container")
export class M3eDrawerContainerElement extends LitElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = DrawerContainerStyle;

  /** @private */ @state() private _startMode: Exclude<DrawerMode, "auto"> = "side";
  /** @private */ @state() private _endMode: Exclude<DrawerMode, "auto"> = "side";
  /** @private */ #breakpointUnobserve?: () => void;
  /** @private */ #disableStartFocusTrap = false;
  /** @private */ #disableEndFocusTrap = false;

  /**
   * Whether the start drawer is open.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) start = false;

  /**
   * The behavior mode of the start drawer.
   * @default "side"
   */
  @property({ attribute: "start-mode", reflect: true }) startMode: DrawerMode = "side";

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
  @property({ attribute: "end-mode", reflect: true }) endMode: DrawerMode = "side";

  /**
   * Whether to show a divider between the end drawer and content for `side` mode.
   * @default "side"
   */
  @property({ attribute: "end-divider", type: Boolean, reflect: true }) endDivider = false;

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#breakpointUnobserve?.();
    this.#clearMode();
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("startMode") || changedProperties.has("endMode")) {
      this.#breakpointUnobserve?.();

      if (this.startMode === "auto" || this.endMode === "auto") {
        this.#breakpointUnobserve = M3eBreakpointObserver.observe([Breakpoint.XSmall, Breakpoint.Small], (matches) =>
          this.#updateMode(matches, true)
        );
      } else {
        this.#updateMode();
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<m3e-focus-trap ?disabled="${!this.start || this._startMode === "side" || this.#disableStartFocusTrap}">
        <slot name="start" @slotchange="${this.#handleStartSlotChange}"></slot>
      </m3e-focus-trap>
      <div
        class="content"
        .inert="${(this._startMode !== "side" || this._endMode !== "side") && (this.start || this.end)}"
      >
        <slot></slot>
      </div>
      <div class="scrim" @click="${this.#handleScrimClick}"></div>
      <m3e-focus-trap ?disabled="${!this.end || this._endMode === "side" || this.#disableEndFocusTrap}">
        <slot name="end" @slotchange="${this.#handleEndSlotChange}"></slot>
      </m3e-focus-trap>`;
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

  /** @inheritdoc */
  #clearMode(): void {
    this.classList.remove("-start-over");
    this.classList.remove("-start-push");
    this.classList.remove("-start-side");
    this.classList.remove("-end-over");
    this.classList.remove("-end-push");
    this.classList.remove("-end-side");
  }

  /** @inheritdoc */
  #updateMode(breakpoints?: Map<string, boolean>, autoClose = false) {
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

    this.classList.add(`-start-${this._startMode}`);
    this.classList.add(`-end-${this._endMode}`);

    if (autoClose && (autoCloseStart || autoCloseEnd)) {
      if (autoCloseStart) {
        this.start = false;
      }
      if (autoCloseEnd) {
        this.end = false;
      }

      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-drawer-container": M3eDrawerContainerElement;
  }
}
