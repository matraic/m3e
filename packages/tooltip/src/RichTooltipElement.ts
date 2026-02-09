/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { DesignToken, getTextContent, hasAssignedNodes } from "@m3e/core";
import { M3eAriaDescriber, M3eInteractivityChecker } from "@m3e/core/a11y";
import { AnchorPosition } from "@m3e/core/anchoring";
import { M3eDirectionality } from "@m3e/core/bidi";

import { RichTooltipPosition } from "./RichTooltipPosition";
import { TooltipElementBase } from "./TooltipElementBase";

/**
 * Provides contextual details for a control, such as explaining the value or purpose of a feature.
 *
 * @description
 * The `m3e-rich-tooltip` component provides contextual guidance for a control. It supports an optional
 * subhead, multi-line supporting text, and optional action elements. When non‑interactive, it behaves
 * as a standard tooltip and contributes an `aria-describedby` message to its control. When interactive,
 * it becomes a lightweight anchored dialog with manual popover behavior, keyboard dismissal, and
 * click‑outside light‑dismiss.
 *
 * @example
 * The following example illustrates connecting an interactive rich tooltip to a button using the `for` attribute.
 * ```html
 * <m3e-icon-button id="btnSettings">
 *  <m3e-icon name="settings"></m3e-icon>
 * </m3e-icon-button>
 * <m3e-rich-tooltip for="btnSettings">
 *  <span slot="subhead">New settings available</span>
 *  Now you can adjust the uploaded image quality, and upgrade your available storage space.
 *  <div slot="actions">
 *    <m3e-button>
 *      <m3e-rich-tooltip-action>Learn more</m3e-rich-tooltip-action>
 *    </m3e-button>
 *  </div>
 * </m3e-rich-tooltip>
 * ```
 *
 * @tag m3e-rich-tooltip
 *
 * @slot - The main supporting text of the tooltip.
 * @slot subhead - Optional subhead text displayed above the supporting content.
 * @slot actions - Optional action elements displayed at the bottom of the tooltip.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr hide-delay - The amount of time, in milliseconds, before hiding the tooltip.
 * @attr position - The position of the tooltip.
 * @attr show-delay - The amount of time, in milliseconds, before showing the tooltip.
 *
 * @fires beforetoggle - Dispatched before the toggle state changes.
 * @fires toggle - Dispatched after the toggle state has changed.
 *
 * @cssprop --m3e-rich-tooltip-padding-top - Top padding of the tooltip container.
 * @cssprop --m3e-rich-tooltip-padding-bottom - Bottom padding of the tooltip container (when no actions are present).
 * @cssprop --m3e-rich-tooltip-padding-inline - Horizontal padding of the tooltip container.
 * @cssprop --m3e-rich-tooltip-max-width - Maximum width of the tooltip surface.
 * @cssprop --m3e-rich-tooltip-shape - Border‑radius of the tooltip container.
 * @cssprop --m3e-rich-tooltip-container-color - Background color of the tooltip surface.
 * @cssprop --m3e-rich-tooltip-subhead-color - Color of the subhead text.
 * @cssprop --m3e-rich-tooltip-subhead-font-size - Font size of the subhead text.
 * @cssprop --m3e-rich-tooltip-subhead-font-weight - Font weight of the subhead text.
 * @cssprop --m3e-rich-tooltip-subhead-line-height - Line height of the subhead text.
 * @cssprop --m3e-rich-tooltip-subhead-tracking - Letter‑spacing of the subhead text.
 * @cssprop --m3e-rich-tooltip-subhead-bottom-space - Space below the subhead before the supporting text.
 * @cssprop --m3e-rich-tooltip-supporting-text-color - Color of the supporting text.
 * @cssprop --m3e-rich-tooltip-supporting-text-font-size - Font size of the supporting text.
 * @cssprop --m3e-rich-tooltip-supporting-text-font-weight - Font weight of the supporting text.
 * @cssprop --m3e-rich-tooltip-supporting-text-line-height - Line height of the supporting text.
 * @cssprop --m3e-rich-tooltip-supporting-text-tracking - Letter‑spacing of the supporting text.
 * @cssprop --m3e-rich-tooltip-actions-padding-inline - Horizontal padding applied to the actions slot area.
 * @cssprop --m3e-rich-tooltip-actions-top-space - Space above the actions slot.
 * @cssprop --m3e-rich-tooltip-actions-bottom-space - Space below the actions slot.
 */
@customElement("m3e-rich-tooltip")
export class M3eRichTooltipElement extends TooltipElementBase {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    .base {
      display: flex;
      flex-direction: column;
      position: absolute;
      padding: unset;
      margin: unset;
      border: unset;
      padding-block-start: var(--m3e-rich-tooltip-padding-top, 0.75rem);
      padding-inline: var(--m3e-rich-tooltip-padding-inline, 1rem);
      max-width: var(--m3e-rich-tooltip-max-width, 20rem);
      box-sizing: border-box;
      overflow: visible;
      border-radius: var(--m3e-rich-tooltip-shape, ${DesignToken.shape.corner.medium});
      background-color: var(--m3e-rich-tooltip-container-color, ${DesignToken.color.surfaceContainer});
      visibility: hidden;
      opacity: 0;
      transform: scale(0.8);
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}, 
            transform ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard},
            overlay ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete,
            visibility ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    .base:not(.has-actions) {
      padding-block-end: var(--m3e-rich-tooltip-padding-bottom, 0.75rem);
    }
    .base::backdrop {
      background-color: transparent;
    }
    .base:not(:popover-open) {
      visibility: hidden;
      opacity: 0;
      transform: scale(0.8);
    }
    .base:popover-open {
      visibility: visible;
      opacity: 1;
      transform: scale(1);
    }
    .base:not(.has-subhead) .subhead,
    .base:not(.has-actions) .actions {
      display: none;
    }
    .subhead {
      color: var(--m3e-rich-tooltip-subhead-color, ${DesignToken.color.onSurfaceVariant});
      font-size: var(--m3e-rich-tooltip-subhead-font-size, ${DesignToken.typescale.standard.title.small.fontSize});
      font-weight: var(
        --m3e-rich-tooltip-subhead-font-weight,
        ${DesignToken.typescale.standard.title.small.fontWeight}
      );
      line-height: var(
        --m3e-rich-tooltip-subhead-line-height,
        ${DesignToken.typescale.standard.title.small.lineHeight}
      );
      letter-spacing: var(--m3e-rich-tooltip-subhead-tracking, ${DesignToken.typescale.standard.title.small.tracking});
      padding-block-end: var(--m3e-rich-tooltip-subhead-bottom-space, 0.25rem);
    }
    .content {
      color: var(--m3e-rich-tooltip-supporting-text-color, ${DesignToken.color.onSurfaceVariant});
      font-size: var(
        --m3e-rich-tooltip-supporting-text-font-size,
        ${DesignToken.typescale.standard.body.medium.fontSize}
      );
      font-weight: var(
        --m3e-rich-tooltip-supporting-text-font-weight,
        ${DesignToken.typescale.standard.body.medium.fontWeight}
      );
      line-height: var(
        --m3e-rich-tooltip-supporting-text-line-height,
        ${DesignToken.typescale.standard.body.medium.lineHeight}
      );
      letter-spacing: var(
        --m3e-rich-tooltip-supporting-text-tracking,
        ${DesignToken.typescale.standard.body.medium.tracking}
      );
    }
    .actions {
      margin-inline: calc(
        0px - calc(
            var(--m3e-rich-tooltip-padding-inline, 1rem) - var(--m3e-rich-tooltip-actions-padding-inline, 0.25rem)
          )
      );
      padding-block-start: var(--m3e-rich-tooltip-actions-top-space, 0.75rem);
      padding-block-end: var(--m3e-rich-tooltip-actions-bottom-space, 0.5rem);
    }
    ::slotted([slot="actions"]) {
      flex: none;
      display: flex;
      align-items: center;
      min-height: 1.5rem;
      column-gap: 0.5rem;
    }
    ::slotted([slot="actions"][end]) {
      justify-content: flex-end;
    }
    @starting-style {
      .base:popover-open {
        opacity: 0;
        transform: scale(0.8);
      }
    }
    @media (prefers-reduced-motion) {
      .base {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      .base {
        background-color: Canvas;
        color: CanvasText;
        box-sizing: border-box;
        border: 1px solid CanvasText;
      }
    }
  `;

  /** @private */ private static __nextId = 0;
  /** @private */ #id = M3eRichTooltipElement.__nextId++;
  /** @private */ #subheadText = "";
  /** @private */ #contentText = "";
  /** @private */ #message = "";
  /** @private */ #messageRegistered = false;

  /** @private */ @state() private _hasSubhead = false;
  /** @private */ @state() private _interactive = false;

  /** @private */ readonly #documentClickHandler = (e: MouseEvent) => this.#handleDocumentClick(e);

  /**
   * The position of the tooltip.
   * @default "below-after"
   */
  @property() position: RichTooltipPosition = "below-after";

  /** @inheritdoc */
  protected override get _isInteractive() {
    return this._interactive;
  }

  /** @inheritdoc */
  protected override get _anchorPosition(): AnchorPosition {
    switch (this.position) {
      case "above":
        return "top";
      case "above-after":
        return M3eDirectionality.current === "rtl" ? "top-start" : "top-end";
      case "above-before":
        return M3eDirectionality.current === "rtl" ? "top-end" : "top-start";
      case "after":
        return M3eDirectionality.current === "rtl" ? "left" : "right";
      case "before":
        return M3eDirectionality.current === "rtl" ? "right" : "left";
      case "below":
        return "bottom";
      case "below-after":
        return M3eDirectionality.current === "rtl" ? "bottom-start" : "bottom-end";
      case "below-before":
        return M3eDirectionality.current === "rtl" ? "bottom-end" : "bottom-start";
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    const subheadId = this._interactive && this._hasSubhead ? `m3e-rich-tooltip-${this.#id}-subhead` : undefined;
    return html`<div
      class="base"
      popover="manual"
      role="${ifDefined(this._interactive ? "dialog" : undefined)}"
      aria-labelledby="${ifDefined(subheadId)}"
      @keydown="${this.#handleKeyDown}"
      @beforetoggle="${this.#handleBeforeToggle}"
      @toggle="${this.#handleToggle}"
    >
      <m3e-elevation level="3"></m3e-elevation>
      <div class="subhead" id="${ifDefined(subheadId)}">
        <slot name="subhead" @slotchange="${this.#handleSubheadSlotChange}"></slot>
      </div>
      <div class="content"><slot @slotchange="${this.#handleContentSlotChange}"></slot></div>
      <div class="actions">
        <slot name="actions" @slotchange="${this.#handleActionsSlotChange}"></slot>
      </div>
    </div>`;
  }

  /** @inheritdoc */
  override show(): Promise<void> {
    if (this._interactive) {
      document.addEventListener("click", this.#documentClickHandler);
    }

    return super.show();
  }

  /**
   * Manually hides the tooltip.
   * @param [restoreFocus=true] Whether to restore focus to the element that triggered the interactive tooltip.
   */
  override hide(restoreFocus = true): void {
    if (this._interactive) {
      document.removeEventListener("click", this.#documentClickHandler);
    }

    super.hide();

    if (restoreFocus && this._interactive && this.control && M3eInteractivityChecker.isFocusable(this.control)) {
      this.control.focus();
    }
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    this.#updateMessage();

    if (this._interactive) {
      control.ariaHasPopup = "dialog";
    }
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (changedProperties.has("_interactive")) {
      this.ariaHidden = this._interactive ? null : "true";
      this.#updateMessage();

      if (this.control && this._interactive) {
        this.control.ariaHasPopup = "dialog";
      }
    }
  }

  /** @inheritdoc */
  protected override _updatePosition(base: HTMLElement, x: number, y: number): void {
    if (this.position.includes("before") && this.position !== "before") {
      if (M3eDirectionality.current === "rtl") {
        x += this.control?.clientWidth ?? 0;
      } else {
        x -= this.control?.clientWidth ?? 0;
      }
    }
    if (this.position.includes("after") && this.position !== "after") {
      if (M3eDirectionality.current === "rtl") {
        x -= this.control?.clientWidth ?? 0;
      } else {
        x += this.control?.clientWidth ?? 0;
      }
    }

    if (M3eDirectionality.current === "rtl") {
      base.style.right = `${window.innerWidth - x - base.clientWidth}px`;
      base.style.left = "";
    } else {
      base.style.left = `${x}px`;
      base.style.right = "";
    }

    base.style.top = `${y}px`;
  }

  /** @private */
  #handleBeforeToggle(e: ToggleEvent): void {
    const forwarded = new ToggleEvent("beforetoggle", {
      oldState: e.oldState,
      newState: e.newState,
      bubbles: true,
      composed: true,
      cancelable: e.cancelable,
    });

    if (!this.dispatchEvent(forwarded)) {
      e.preventDefault();
      this.hide();
    }
  }

  /** @private */
  #handleToggle(e: ToggleEvent): void {
    const forwarded = new ToggleEvent("toggle", {
      oldState: e.oldState,
      newState: e.newState,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(forwarded);
  }

  /** @private */
  #handleDocumentClick(e: MouseEvent): void {
    if (!e.composedPath().some((x) => x instanceof M3eRichTooltipElement || x === this.control)) {
      this.hide();
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "Escape" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      this.hide();
    }
  }

  /** @private */
  #handleSubheadSlotChange(e: Event): void {
    this._hasSubhead = hasAssignedNodes(e.target as HTMLSlotElement);
    this.shadowRoot?.querySelector(".base")?.classList.toggle("has-subhead", this._hasSubhead);
    this.#subheadText = this._hasSubhead ? getTextContent(e.target as HTMLSlotElement, true) : "";
    this.#updateMessage();
  }

  /** @private */
  #handleContentSlotChange(e: Event): void {
    this._interactive = M3eInteractivityChecker.findInteractiveElements(this).length > 0;
    this.#contentText = getTextContent(e.target as HTMLSlotElement, true);
    this.#updateMessage();
  }

  /** @private */
  #handleActionsSlotChange(e: Event): void {
    this.shadowRoot
      ?.querySelector(".base")
      ?.classList.toggle("has-actions", hasAssignedNodes(e.target as HTMLSlotElement));

    this._interactive = M3eInteractivityChecker.findInteractiveElements(this).length > 0;
    this.#updateMessage();
  }

  /** @private */
  #updateMessage() {
    const message = this.#subheadText ? `${this.#subheadText}/n${this.#contentText}` : this.#contentText;
    if (this.isConnected && this.control) {
      if (this.#message && this.#messageRegistered) {
        M3eAriaDescriber.removeDescription(this.control, this.#message);
        this.#messageRegistered = false;
      }

      this.#message = message;

      if (this.#message && !this._interactive) {
        M3eAriaDescriber.describe(this.control, this.#message);
        this.#messageRegistered = true;
      }
    }
  }
}

interface M3eRichTooltipElementEventMap extends HTMLElementEventMap {
  beforetoggle: ToggleEvent;
  toggle: ToggleEvent;
}

export interface M3eRichTooltipElement {
  addEventListener<K extends keyof M3eRichTooltipElementEventMap>(
    type: K,
    listener: (this: M3eRichTooltipElement, ev: M3eRichTooltipElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eRichTooltipElementEventMap>(
    type: K,
    listener: (this: M3eRichTooltipElement, ev: M3eRichTooltipElementEventMap[K]) => void,
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
    "m3e-rich-tooltip": M3eRichTooltipElement;
  }
}
