/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { DesignToken, EventAttribute, focusWhenReady } from "@m3e/core";
import {} from "@m3e/core/a11y";

/**
 * A dialog that provides important prompts in a user flow.
 *
 * @description
 * The `m3e-dialog` component presents important prompts, alerts, and actions in user flows.
 * Designed according to Material 3 principles, it supports custom header, content, and
 * close icon slots, ARIA accessibility, focus management, and theming via CSS custom properties.
 *
 * @example
 * ```html
 * <m3e-button variant="filled">
 *   <m3e-dialog-trigger for="dlg">Open Dialog</m3e-dialog-trigger>
 * </m3e-button>
 * <m3e-dialog id="dlg" dismissible onclosed="console.log(this.returnValue)">
 *   <span slot="header">Dialog Title</span>
 *   Dialog content goes here.
 *   <div slot="actions" end>
 *     <m3e-button autofocus><m3e-dialog-action return-value="ok">Close</m3e-dialog-action></m3e-button>
 *   </div>
 * </m3e-dialog>
 * ```
 *
 * @tag m3e-dialog
 *
 * @slot - Renders the content of the dialog.
 * @slot header - Renders the header of the dialog.
 * @slot actions - Renders the actions of the dialog.
 * @slot close-icon - Renders the icon of the button used to close the dialog.
 *
 * @attr alert - Whether the dialog is an alert.
 * @attr close-label - The accessible label given to the button used to dismiss the dialog.
 * @attr disable-close -Whether users cannot click the backdrop or press escape to dismiss the dialog.
 * @attr dismissible - Whether a button is presented that can be used to close the dialog.
 * @attr no-focus-trap - Whether to disable focus trapping, which keeps keyboard `Tab` navigation within the dialog.
 * @attr open - Whether the dialog is open.
 *
 * @fires opening - Emitted when the dialog begins to open.
 * @fires opened - Emitted when the dialog has opened.
 * @fires cancel - Emitted when the dialog is cancelled.
 * @fires closing - Emitted when the dialog begins to close.
 * @fires closed - Emitted when the dialog has closed.
 *
 * @cssprop --m3e-dialog-shape - Border radius of the dialog container.
 * @cssprop --m3e-dialog-min-width - Minimum width of the dialog.
 * @cssprop --m3e-dialog-max-width - Maximum width of the dialog.
 * @cssprop --m3e-dialog-color - Foreground color of the dialog.
 * @cssprop --m3e-dialog-container-color - Background color of the dialog container.
 * @cssprop --m3e-dialog-scrim-color - Color of the scrim (backdrop overlay).
 * @cssprop --m3e-dialog-scrim-opacity - Opacity of the scrim when open.
 * @cssprop --m3e-dialog-header-container-color - Background color of the dialog header.
 * @cssprop --m3e-dialog-header-color - Foreground color of the dialog header.
 * @cssprop --m3e-dialog-header-font-size - Font size for the dialog header.
 * @cssprop --m3e-dialog-header-font-weight - Font weight for the dialog header.
 * @cssprop --m3e-dialog-header-line-height - Line height for the dialog header.
 * @cssprop --m3e-dialog-header-tracking - Letter spacing for the dialog header.
 * @cssprop --m3e-dialog-content-color - Foreground color of the dialog content.
 * @cssprop --m3e-dialog-content-font-size - Font size for the dialog content.
 * @cssprop --m3e-dialog-content-font-weight - Font weight for the dialog content.
 * @cssprop --m3e-dialog-content-line-height - Line height for the dialog content.
 * @cssprop --m3e-dialog-content-tracking - Letter spacing for the dialog content.
 */
@customElement("m3e-dialog")
export class M3eDialogElement extends EventAttribute(LitElement, "opening", "opened", "cancel", "closing", "closed") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    .base {
      font: inherit;
      border: unset;
      outline: unset;
      padding: unset;
      display: flex;
      flex-direction: column;
      position: fixed;
      overflow: visible;
      border-radius: var(--m3e-dialog-shape, ${DesignToken.shape.corner.extraLarge});
      min-width: var(--m3e-dialog-min-width, 17.5rem);
      max-width: var(--m3e-dialog-max-width, 35rem);
      color: var(--m3e-dialog-color, ${DesignToken.color.onSurface});
      background-color: var(--m3e-dialog-container-color, ${DesignToken.color.surfaceContainerHigh});
      visibility: hidden;
      opacity: 0;
      transform-origin: top;
      transform: translateY(-3.125rem) scaleY(0.8);
    }
    .base::backdrop {
      background-color: color-mix(in srgb, var(--m3e-dialog-scrim-color, ${DesignToken.color.scrim}) 0%, transparent);
      margin-inline-end: -20px;
    }
    .base:not([open]) {
      visibility: hidden;
      opacity: 0;
      transform: translateY(-3.125rem) scaleY(0.8);
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.emphasized}, 
        transform ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.emphasized},
        overlay ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.emphasized} allow-discrete,
        visibility ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.emphasized} allow-discrete`
      )};
    }
    .base[open] {
      visibility: visible;
      opacity: 1;
      transform: translateY(0) scaleY(1);
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.emphasized}, 
        transform ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.emphasized},
        overlay ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.emphasized} allow-discrete,
        visibility ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.emphasized} allow-discrete`
      )};
    }
    .base:not([open])::backdrop {
      transition: ${unsafeCSS(
        `background-color ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}, 
        overlay ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete,
        visibility ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete`
      )};
    }
    .base[open]::backdrop {
      background-color: color-mix(
        in srgb,
        var(--m3e-dialog-scrim-color, ${DesignToken.color.scrim}) var(--m3e-dialog-scrim-opacity, 32%),
        transparent
      );
      transition: ${unsafeCSS(
        `background-color ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard}, 
        overlay ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard} allow-discrete,
        visibility ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard} allow-discrete`
      )};
    }
    @starting-style {
      .base[open] {
        opacity: 0;
        transform: translateY(-3.125rem) scaleY(0.8);
      }
      .base[open]::backdrop {
        background-color: color-mix(in srgb, var(--m3e-dialog-scrim-color, ${DesignToken.color.scrim}) 0%, transparent);
      }
    }
    .header {
      flex: none;
      display: flex;
      align-items: center;
      padding: 1.5rem 1.5rem 1rem 1.5rem;
      background-color: var(--m3e-dialog-header-container-color, transparent);
    }
    ::slotted([slot="header"]) {
      margin: unset;
      flex: 1 1 auto;
      color: var(--m3e-dialog-header-color, inherit);
      font-size: var(--m3e-dialog-header-font-size, ${DesignToken.typescale.standard.headline.small.fontSize});
      font-weight: var(--m3e-dialog-header-font-weight, ${DesignToken.typescale.standard.headline.small.fontWeight});
      line-height: var(--m3e-dialog-header-line-height, ${DesignToken.typescale.standard.headline.small.lineHeight});
      letter-spacing: var(--m3e-dialog-header-tracking, ${DesignToken.typescale.standard.headline.small.tracking});
    }
    .content {
      padding-inline: 1.5rem;
      color: var(--m3e-dialog-content-color, ${DesignToken.color.onSurfaceVariant});
      font-size: var(--m3e-dialog-content-font-size, ${DesignToken.typescale.standard.body.medium.fontSize});
      font-weight: var(--m3e-dialog-content-font-weight, ${DesignToken.typescale.standard.body.medium.fontWeight});
      line-height: var(--m3e-dialog-content-line-height, ${DesignToken.typescale.standard.body.medium.lineHeight});
      letter-spacing: var(--m3e-dialog-content-tracking, ${DesignToken.typescale.standard.body.medium.tracking});
    }
    ::slotted([slot="actions"]) {
      flex: none;
      display: flex;
      align-items: center;
      min-height: 1.5rem;
      padding: 1.5rem;
      column-gap: 0.5rem;
    }
    ::slotted([slot="actions"][end]) {
      justify-content: flex-end;
    }
    :host(:not(.-has-actions)) .content {
      margin-bottom: 1.5rem;
    }
    .close {
      margin-inline-start: 0.5rem;
    }
    ::slotted([slot="close-icon"]),
    .close-icon {
      width: 1em;
      font-size: var(--m3e-icon-button-icon-size, 1.5rem) !important;
    }
    @media (forced-colors: active) {
      .base:not([open])::backdrop,
      .base[open]::backdrop {
        transition: none;
      }
      .base {
        border-style: solid;
        border-width: 1px;
        border-color: CanvasText;
      }
    }
    @media (prefers-reduced-motion) {
      .base:not([open]),
      .base[open],
      .base:not([open])::backdrop,
      .base[open]::backdrop {
        transition: none;
      }
    }
  `;

  /** @private */ private static __nextId = 0;
  /** @private */ #id = M3eDialogElement.__nextId++;

  /** @private */ #open = false;
  /** @private */ #escapePressedWithoutCancel = false;
  /** @private */ @state() private _hasActions = false;
  /** @private */ @query(".base") private readonly _base!: HTMLDialogElement;
  /** @private */ @query(".content") private readonly _content!: HTMLDialogElement;

  /**
   * Whether the dialog is an alert.
   * @default false
   */
  @property({ type: Boolean }) alert = false;

  /**
   * Whether the dialog is open.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) get open() {
    return this.#open;
  }
  set open(value: boolean) {
    if (value === this.#open) return;
    this.#open = value;
    if (this.#open) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Whether a button is presented that can be used to close the dialog.
   * @default false
   */
  @property({ type: Boolean }) dismissible = false;

  /**
   * Whether users cannot click the backdrop or press ESC to dismiss the dialog.
   * @default false
   */
  @property({ attribute: "disable-close", type: Boolean }) disableClose = false;

  /**
   * Whether to disable focus trapping, which keeps keyboard `Tab` navigation within the dialog.
   * @default false
   */
  @property({ attribute: "no-focus-trap", type: Boolean }) noFocusTrap = false;

  /**
   * The accessible label given to the button used to dismiss the dialog.
   * @default "Close"
   */
  @property({ attribute: "close-label" }) closeLabel = "Close";

  /**
   * The return value of the dialog.
   * @default ""
   */
  returnValue = "";

  /**
   * Asynchronously opens the dialog.
   * @returns {Promise<void>} A `Promise` that resolves when the dialog is open.
   */
  async show(): Promise<void> {
    await this.updateComplete;

    if (this._base.open) {
      return;
    }

    if (!this.dispatchEvent(new Event("opening", { cancelable: true }))) {
      this.open = false;
      return;
    }

    this._base.showModal();
    this._content.scrollTop = 0;
    const focusable = this.querySelector<HTMLElement>("[autofocus]");

    if (focusable) {
      focusWhenReady(focusable);
    }

    this.dispatchEvent(new Event("opened"));
  }

  /**
   * Asynchronously closes the dialog.
   * @param {string} returnValue The value to return.
   * @returns {Promise<void>} A `Promise` that resolves when the dialog is closed.
   */
  async hide(returnValue: string = this.returnValue): Promise<void> {
    if (!this.isConnected) {
      this.open = false;
      return;
    }

    await this.updateComplete;

    if (!this._base.open) {
      this.open = false;
      return;
    }

    const prevReturnValue = this.returnValue;
    this.returnValue = returnValue;

    if (!this.dispatchEvent(new Event("closing", { cancelable: true }))) {
      this.returnValue = prevReturnValue;
      return;
    }

    this.open = false;
    this._base.close(returnValue);
    this.dispatchEvent(new Event("closed"));
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<dialog
      class="base"
      role="${ifDefined(this.alert ? "alertdialog" : undefined)}"
      aria-labelledby="m3e-dialog-${this.#id}-header"
      .returnValue="${this.returnValue}"
      @close="${this.#handleClose}"
      @cancel="${this.#handleCancel}"
      @click="${this.#handleClick}"
      @keydown="${this.#handleKeyDown}"
    >
      <m3e-elevation level="3"></m3e-elevation>
      <m3e-focus-trap ?disabled="${this.noFocusTrap}">
        <div class="header">
          <slot name="header" id="m3e-dialog-${this.#id}-header"></slot>
          ${this.#renderCloseButton()}
        </div>
        <m3e-scroll-container class="content" dividers="${this._hasActions ? "above-below" : "above"}">
          <slot></slot>
        </m3e-scroll-container>
        <slot name="actions" @slotchange="${this.#handleActionsSlotChange}"></slot>
      </m3e-focus-trap>
    </dialog>`;
  }

  /** @private */
  #renderCloseButton(): unknown {
    return !this.dismissible
      ? nothing
      : html`<m3e-icon-button aria-label="${this.closeLabel}" class="close" @click="${this.hide}">
          <slot name="close-icon">
            <svg class="close-icon" viewBox="0 -960 960 960" fill="currentColor">
              <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
              />
            </svg>
          </slot>
        </m3e-icon-button>`;
  }

  /** @private */
  #handleClose(): void {
    if (!this.#escapePressedWithoutCancel) {
      return;
    }
    this.#escapePressedWithoutCancel = true;
    this._base?.dispatchEvent(new Event("cancel", { cancelable: true }));
  }

  /** @private */
  #handleCancel(e: Event): void {
    if (e.target !== this._base) return;
    this.#escapePressedWithoutCancel = false;
    e.preventDefault();
    if (!this.dispatchEvent(new Event("cancel", { cancelable: true }))) {
      this.hide();
    }
  }

  /** @private */
  #handleClick(e: Event): void {
    if (!this.disableClose && e.target === this._base) {
      this.hide();
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "Escape" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      if (!this.disableClose) {
        this.hide();
      }
    }
  }

  /** @private */
  #handleActionsSlotChange(e: Event): void {
    this._hasActions = (<HTMLSlotElement>e.target).assignedNodes({ flatten: true }).length > 0;
    this.classList.toggle("-has-actions", this._hasActions);
  }
}

interface M3eDialogElementEventMap extends HTMLElementEventMap {
  opening: Event;
  opened: Event;
  closing: Event;
  closed: Event;
  cancel: Event;
}

export interface M3eDialogElement {
  addEventListener<K extends keyof M3eDialogElementEventMap>(
    type: K,
    listener: (this: M3eDialogElement, ev: M3eDialogElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof M3eDialogElementEventMap>(
    type: K,
    listener: (this: M3eDialogElement, ev: M3eDialogElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-dialog": M3eDialogElement;
  }
}
