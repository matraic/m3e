import { CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  AttachInternals,
  customElement,
  Disabled,
  hasAssignedNodes,
  LinkButton,
  PressedController,
  Role,
  setCustomState,
} from "@m3e/web/core";

import { M3eCarouselItemActionElement } from "./CarouselItemActionElement";
import "./CarouselItemActionElement";

import { CarouselItemStyle } from "./styles";

/**
 * An actionable item in a Material 3 carousel or grid.
 *
 * @description
 * The `m3e-carousel-item` component displays media or custom content with optional title and subtitle overlays.
 * The entire item acts as a button by default, or as a link when `href` is set. Slotted content supplies the
 * action's accessible name, which can be overridden with `label`. Content must not contain interactive elements.
 *
 * Directly slotted images and videos fill the content area with a centered cover crop. The carousel reveals or
 * hides portions of the media as items change size rather than resizing it. Video playback is controlled by the
 * application.
 *
 * Title and subtitle text appears near the bottom of the item. In responsive carousel layouts, the text fades
 * as items contract into previews while remaining part of the action's accessible name. An optional text scrim
 * provides a gradient behind the overlays and fades with them.
 *
 * @tag m3e-carousel-item
 *
 * @slot - Media or custom content.
 * @slot title - The primary overlay text.
 * @slot subtitle - The secondary overlay text.
 *
 * @attr href - The destination URL. When omitted, the item has a button action.
 * @attr target - The browsing context in which to open the link.
 * @attr rel - The relationship between the linked resource and the current document.
 * @attr download - Whether to download the link, optionally specifying a filename.
 * @attr disabled - Whether the item's action is disabled.
 * @attr label - An accessible label for the primary action, overriding the slotted content.
 *
 * @fires click - Dispatched when the item's primary action is activated.
 *
 * @cssprop --m3e-carousel-item-shape - The resting corner radius.
 * @cssprop --m3e-carousel-item-text-color - The overlay text color.
 * @cssprop --m3e-carousel-item-title-font-size - Font size for the title slot.
 * @cssprop --m3e-carousel-item-title-text-color - Color for the title slot.
 * @cssprop --m3e-carousel-item-subtitle-font-size - Font size for the subtitle slot.
 * @cssprop --m3e-carousel-item-subtitle-text-color - Color for the subtitle slot.
 * @cssprop --m3e-carousel-item-scrim-color - The bottom text scrim color.
 * @cssprop --m3e-carousel-item-scrim-opacity - The bottom text scrim opacity, from 0 to 1.
 * @cssprop --m3e-carousel-item-shape-pressed-morph - The pressed corner radius, capped at the resting radius.
 * @cssprop --m3e-carousel-item-hover-elevation - The hover shadow.
 * @cssprop --m3e-carousel-item-outline-width - The outline width. Set to 0 to disable it.
 * @cssprop --m3e-carousel-item-outline-color - The resting outline color.
 * @cssprop --m3e-carousel-item-hover-outline-color - The hover outline color.
 * @cssprop --m3e-carousel-item-focus-outline-color - The focus outline color.
 * @cssprop --m3e-carousel-item-pressed-outline-color - The pressed outline color.
 * @cssprop --m3e-carousel-item-disabled-outline-color - The disabled outline color.
 * @cssprop --m3e-carousel-item-disabled-outline-opacity - The disabled outline opacity.
 * @cssprop --m3e-carousel-item-hover-state-layer-color - The hover state-layer color.
 * @cssprop --m3e-carousel-item-hover-state-layer-opacity - The hover state-layer opacity.
 * @cssprop --m3e-carousel-item-focus-state-layer-color - The focus state-layer color.
 * @cssprop --m3e-carousel-item-focus-state-layer-opacity - The focus state-layer opacity.
 * @cssprop --m3e-carousel-item-pressed-state-layer-color - The pressed ripple color.
 * @cssprop --m3e-carousel-item-pressed-state-layer-opacity - The pressed ripple opacity.
 * @cssprop --m3e-carousel-item-ripple-color - Overrides the pressed state-layer color for the ripple.
 * @cssprop --m3e-carousel-item-ripple-opacity - Overrides the pressed state-layer opacity for the ripple.
 *
 * @example
 * Place images or videos directly inside items in a carousel or grid. Replace the media placeholders.
 * Video playback is controlled by the application; do not add interactive controls inside the item.
 * ```html
 * <m3e-carousel-item label="View the coast">
 *   <img src="[YOUR IMAGE URL HERE]" alt="" loading="lazy" />
 * </m3e-carousel-item>
 *
 * <m3e-carousel-item label="Play coastal tour">
 *   <video src="[YOUR VIDEO URL HERE]" poster="[YOUR IMAGE URL HERE]"
 *     muted playsinline preload="metadata"></video>
 * </m3e-carousel-item>
 * ```
 *
 * @example
 * Add a title and subtitle over an item's media.
 * ```html
 * <m3e-carousel-item>
 *   <img src="[YOUR IMAGE URL HERE]" alt="" />
 *   <span slot="title">Coast</span>
 *   <span slot="subtitle">Follow the ocean breeze</span>
 * </m3e-carousel-item>
 * ```
 *
 * @example
 * Use `href` for a link, or listen for `click` on a button item. Place the items inside a carousel or grid.
 * ```html
 * <m3e-carousel-item href="/destinations/coast">Coast</m3e-carousel-item>
 * <m3e-carousel-item id="tour">Play coastal tour</m3e-carousel-item>
 * ```
 * ```js
 * document.querySelector("#tour").addEventListener("click", () => {
 *   // Perform the application's action.
 * });
 * ```
 *
 * @example
 * Disable an item's action or hide it from the layout.
 * ```html
 * <m3e-carousel aria-label="Destinations">
 *   <m3e-carousel-item>Coast</m3e-carousel-item>
 *   <m3e-carousel-item disabled>Forest unavailable</m3e-carousel-item>
 *   <m3e-carousel-item hidden>Mountains</m3e-carousel-item>
 * </m3e-carousel>
 * ```
 *
 * @example
 * ```html
 * <m3e-carousel aria-label="Destinations">
 *   <m3e-carousel-item href="/destinations/coast">Coast</m3e-carousel-item>
 *   <m3e-carousel-item href="/destinations/forest">Forest</m3e-carousel-item>
 * </m3e-carousel>
 * ```
 *
 * @example
 * Without `href`, listen for `click` to perform an action. Use `label` for image-only content.
 * ```html
 * <m3e-carousel-item label="Play coastal tour">
 *   <img src="coast.jpg" alt="" loading="lazy" />
 * </m3e-carousel-item>
 * ```
 *
 * @example
 * Use videos without native controls because the entire item is one action.
 * ```html
 * <m3e-carousel-item label="Play coastal tour">
 *   <video src="coast.mp4" poster="coast.jpg" muted playsinline preload="metadata"></video>
 * </m3e-carousel-item>
 * ```
 *
 * @example
 * Add bottom-start text overlays to media.
 * ```html
 * <m3e-carousel-item href="/destinations/coast" style="--m3e-carousel-item-scrim-opacity: 0.65">
 *   <img src="coast.jpg" alt="" loading="lazy" />
 *   <span slot="title">Explore the coast</span>
 *   <span slot="subtitle">Weekend escapes</span>
 * </m3e-carousel-item>
 * ```
 */
@customElement("m3e-carousel-item")
export class M3eCarouselItemElement extends LinkButton(Disabled(AttachInternals(Role(LitElement, "gridcell"))), true) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = CarouselItemStyle;

  /** @private */ @query(".action") private _action?: M3eCarouselItemActionElement;

  /** @internal */
  @property({ attribute: false }) vertical = false;

  /** @internal */
  get action(): M3eCarouselItemActionElement | undefined {
    return this._action;
  }

  constructor() {
    super();

    new PressedController(this, {
      filter: (event) => this.disabled || (event instanceof PointerEvent && (!event.isPrimary || event.button !== 0)),
      isPressedKey: (key) => !this.href && key === " ",
      callback: (pressed) => setCustomState(this, "--pressed", pressed && !this.disabled),
    });

    this.addEventListener("focusout", () => this.cancelPress());
    this.addEventListener("pointercancel", () => this.cancelPress());
  }

  /** An accessible label for the primary action, overriding the slotted content. */
  @property() label: string | null = null;

  /** Moves focus to the item's primary action. */
  override focus(options?: FocusOptions): void {
    this._action?.focus(options);
  }

  /** Activates the item's primary action. */
  override click(): void {
    this._action?.click();
  }

  /** @internal */
  cancelPress(): void {
    setCustomState(this, "--pressed", false);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.cancelPress();
  }

  /** @inheritdoc */
  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    this.role = this.vertical ? "row" : "gridcell";
  }

  /** @inheritdoc */
  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    if (this.disabled) {
      this.cancelPress();
    }
  }

  /** @private */
  #handleTextSlotChange(event: Event): void {
    const slot = event.target;

    if (slot instanceof HTMLSlotElement) {
      slot.parentElement?.parentElement?.classList.toggle(`has-${slot.name}`, hasAssignedNodes(slot));
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base" role=${ifDefined(this.vertical ? "gridcell" : undefined)}>
      <m3e-carousel-item-action
        id="action"
        class="action"
        .href=${this.href}
        .target=${this.target}
        .rel=${this.rel}
        .download=${this.download}
        .disabled=${this.disabled}
        .fullscreen=${this.vertical}
        aria-label=${ifDefined(this.label ?? undefined)}
        ><div class="content">
          <slot></slot>
          <div class="text">
            <div class="title">
              <slot name="title" @slotchange=${this.#handleTextSlotChange}></slot>
            </div>
            <div class="subtitle">
              <slot name="subtitle" @slotchange=${this.#handleTextSlotChange}></slot>
            </div>
          </div></div
      ></m3e-carousel-item-action>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-carousel-item": M3eCarouselItemElement;
  }
}
