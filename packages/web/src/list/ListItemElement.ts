import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

import { computeLineCount, DesignToken, ResizeController, Role } from "@m3e/web/core";

import type { M3eListElement } from "./ListElement";
import { ListItemContentType } from "./ListItemContentType";

/**
 * An item in a list.
 *
 * @description
 * The `m3e-list-item` component represents a single item within a list. It supports rich
 * content, leading/trailing media, overline, supporting text, and trailing supporting text
 * via named slots. The component is highly customizable through CSS custom properties and
 * is designed for accessibility and flexible layout.
 *
 * @example
 * The following example illustrates a list with a single item using all supported slots.
 *
 * Note: This example uses the `@m3e/icon` package to present Material Design symbols, but any icon package can be
 * substituted depending on your design system or preferences
 *
 * ```html
 * <m3e-list>
 *  <m3e-list-item>
 *    <m3e-icon slot="leading" name="person"></m3e-icon>
 *    <span slot="overline">Overline</span>
 *    Headline
 *    <span slot="supporting-text">Supporting text</span>
 *    <m3e-icon slot="trailing" name="arrow_right"></m3e-icon>
 *  </m3e-list-item>
 * </m3e-list>
 * ```
 *
 * @tag m3e-list-item
 *
 * @slot - Renders the content of the list item.
 * @slot leading - Renders the leading content of the list item.
 * @slot overline - Renders the overline of the list item.
 * @slot supporting-text - Renders the supporting text of the list item.
 * @slot trailing - Renders the trailing content of the list item.
 *
 * @cssprop --m3e-list-item-between-space - Horizontal gap between elements.
 * @cssprop --m3e-list-item-leading-space - Horizontal padding for the leading side.
 * @cssprop --m3e-list-item-trailing-space - Horizontal padding for the trailing side.
 * @cssprop --m3e-list-item-padding-inline - Horizontal padding for the list item.
 * @cssprop --m3e-list-item-padding-block - Vertical padding for the list item.
 * @cssprop --m3e-list-item-one-line-top-space - Top padding for one-line items.
 * @cssprop --m3e-list-item-one-line-bottom-space - Bottom padding for one-line items.
 * @cssprop --m3e-list-item-two-line-top-space - Top padding for two-line items.
 * @cssprop --m3e-list-item-two-line-bottom-space - Bottom padding for two-line items.
 * @cssprop --m3e-list-item-three-line-top-space - Top padding for three-line items.
 * @cssprop --m3e-list-item-three-line-bottom-space - Bottom padding for three-line items.
 * @cssprop --m3e-list-item-font-size - Font size for main content.
 * @cssprop --m3e-list-item-font-weight - Font weight for main content.
 * @cssprop --m3e-list-item-line-height - Line height for main content.
 * @cssprop --m3e-list-item-tracking - Letter spacing for main content.
 * @cssprop --m3e-list-item-overline-font-size - Font size for overline slot.
 * @cssprop --m3e-list-item-overline-font-weight - Font weight for overline slot.
 * @cssprop --m3e-list-item-overline-line-height - Line height for overline slot.
 * @cssprop --m3e-list-item-overline-tracking - Letter spacing for overline slot.
 * @cssprop --m3e-list-item-supporting-text-font-size - Font size for supporting text slot.
 * @cssprop --m3e-list-item-supporting-text-font-weight - Font weight for supporting text slot.
 * @cssprop --m3e-list-item-supporting-text-line-height - Line height for supporting text slot.
 * @cssprop --m3e-list-item-supporting-text-tracking - Letter spacing for supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-font-size - Font size for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-font-weight - Font weight for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-line-height - Line height for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-tracking - Letter spacing for trailing supporting text slot.
 * @cssprop --m3e-list-item-icon-size - Size for leading/trailing icons.
 * @cssprop --m3e-list-item-label-text-color - Color for the main content.
 * @cssprop --m3e-list-item-overline-color - Color for the overline slot.
 * @cssprop --m3e-list-item-supporting-text-color - Color for the supporting text slot.
 * @cssprop --m3e-list-item-leading-color - Color for the leading content.
 * @cssprop --m3e-list-item-trailing-color - Color for the trailing content.
 * @cssprop --m3e-list-item-container-color - Background color of the list item.
 * @cssprop --m3e-list-item-container-shape - Border radius of the list item.
 * @cssprop --m3e-list-item-hover-container-shape - Border radius of the list item on hover.
 * @cssprop --m3e-list-item-focus-container-shape - Border radius of the list item on focus.
 * @cssprop --m3e-list-item-video-width - Width of the video slot.
 * @cssprop --m3e-list-item-video-height - Height of the video slot.
 * @cssprop --m3e-list-item-video-shape - Border radius of the video slot.
 * @cssprop --m3e-list-item-image-width - Width of the image slot.
 * @cssprop --m3e-list-item-image-height - Height of the image slot.
 * @cssprop --m3e-list-item-image-shape - Border radius of the image slot.
 * @cssprop --m3e-list-item-three-line-top-offset - Top offset for media in three line items.
 * @cssprop --m3e-list-item-one-line-height - Minimum height of a one line list item.
 * @cssprop --m3e-list-item-two-line-height - Minimum height of a two line list item.
 * @cssprop --m3e-list-item-three-line-height - Minimum height of a three line list item.
 */
@customElement("m3e-list-item")
export class M3eListItemElement extends Role(LitElement, "listitem") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .base {
      display: flex;
      min-height: inherit;
      width: 100%;
      box-sizing: border-box;
      column-gap: var(--m3e-list-item-between-space, 1rem);
      padding-inline-start: var(--m3e-list-item-leading-space, 1rem);
      padding-inline-end: var(--m3e-list-item-trailing-space, 1rem);
      border-top-left-radius: var(
        --_list-item-top-container-shape,
        var(--m3e-list-item-container-shape, ${DesignToken.shape.corner.none})
      );
      border-top-right-radius: var(
        --_list-item-top-container-shape,
        var(--m3e-list-item-container-shape, ${DesignToken.shape.corner.none})
      );
      border-bottom-left-radius: var(
        --_list-item-bottom-container-shape,
        var(--m3e-list-item-container-shape, ${DesignToken.shape.corner.none})
      );
      border-bottom-right-radius: var(
        --_list-item-bottom-container-shape,
        var(--m3e-list-item-container-shape, ${DesignToken.shape.corner.none})
      );
      transition: ${unsafeCSS(
        `border-radius ${DesignToken.motion.spring.fastEffects}, background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`,
      )};
    }
    :host(.-one-line) {
      min-height: calc(var(--m3e-list-item-one-line-height, 3.5rem) + ${DesignToken.density.calc(-3)});
    }
    :host(.-one-line) .base {
      padding-block-start: var(--m3e-list-item-one-line-top-space, 0.5rem);
      padding-block-end: var(--m3e-list-item-one-line-bottom-space, 0.5rem);
    }
    :host(.-two-line) {
      min-height: calc(var(--m3e-list-item-two-line-height, 4.5rem) + ${DesignToken.density.calc(-3)});
    }
    :host(.-two-line) .base {
      padding-block-start: var(--m3e-list-item-two-line-top-space, 0.5rem);
      padding-block-end: var(--m3e-list-item-two-line-bottom-space, 0.5rem);
    }
    :host(.-three-line) {
      min-height: calc(var(--m3e-list-item-three-line-height, 5.5rem) + ${DesignToken.density.calc(-3)});
    }
    :host(.-three-line) .base {
      padding-block-start: var(--m3e-list-item-three-line-top-space, 0.75rem);
      padding-block-end: var(--m3e-list-item-three-line-bottom-space, 0.75rem);
    }
    :host(:not(.-three-line)) .base {
      align-items: center;
    }
    :host(.-three-line) .base {
      align-items: flex-start;
    }
    :host(:not(:disabled):not([selected]:not(:hover))) .base.focus-visible {
      border-top-left-radius: var(
        --_list-item-top-container-shape,
        var(--m3e-list-item-focus-container-shape, ${DesignToken.shape.corner.large})
      );
      border-top-right-radius: var(
        --_list-item-top-container-shape,
        var(--m3e-list-item-focus-container-shape, ${DesignToken.shape.corner.large})
      );
      border-bottom-left-radius: var(
        --_list-item-bottom-container-shape,
        var(--m3e-list-item-focus-container-shape, ${DesignToken.shape.corner.large})
      );
      border-bottom-right-radius: var(
        --_list-item-bottom-container-shape,
        var(--m3e-list-item-focus-container-shape, ${DesignToken.shape.corner.large})
      );
    }
    :host(:not(:disabled):not([selected]):hover) .base {
      border-top-left-radius: var(
        --_list-item-top-container-shape,
        var(--m3e-list-item-hover-container-shape, ${DesignToken.shape.corner.medium})
      );
      border-top-right-radius: var(
        --_list-item-top-container-shape,
        var(--m3e-list-item-hover-container-shape, ${DesignToken.shape.corner.medium})
      );
      border-bottom-left-radius: var(
        --_list-item-bottom-container-shape,
        var(--m3e-list-item-hover-container-shape, ${DesignToken.shape.corner.medium})
      );
      border-bottom-right-radius: var(
        --_list-item-bottom-container-shape,
        var(--m3e-list-item-hover-container-shape, ${DesignToken.shape.corner.medium})
      );
    }
    .content {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      align-items: unset;
      justify-content: unset;
    }
    ::slotted([slot="overline"]) {
      font-size: var(--m3e-list-item-overline-font-size, ${DesignToken.typescale.standard.label.small.fontSize});
      font-weight: var(--m3e-list-item-overline-font-weight, ${DesignToken.typescale.standard.label.small.fontWeight});
      line-height: var(--m3e-list-item-overline-line-height, ${DesignToken.typescale.standard.label.small.lineHeight});
      letter-spacing: var(--m3e-list-item-overline-tracking, ${DesignToken.typescale.standard.label.small.tracking});
    }
    ::slotted([slot="supporting-text"]) {
      font-size: var(--m3e-list-item-supporting-text-font-size, ${DesignToken.typescale.standard.body.medium.fontSize});
      font-weight: var(
        --m3e-list-item-supporting-text-font-weight,
        ${DesignToken.typescale.standard.body.medium.fontWeight}
      );
      line-height: var(
        --m3e-list-item-supporting-text-line-height,
        ${DesignToken.typescale.standard.body.medium.lineHeight}
      );
      letter-spacing: var(
        --m3e-list-item-supporting-text-tracking,
        ${DesignToken.typescale.standard.body.medium.tracking}
      );
    }
    ::slotted(:not([slot])) {
      font-size: var(--m3e-list-item-font-size, ${DesignToken.typescale.standard.body.large.fontSize});
      font-weight: var(--m3e-list-item-font-weight, ${DesignToken.typescale.standard.body.large.fontWeight});
      line-height: var(--m3e-list-item-line-height, ${DesignToken.typescale.standard.body.large.lineHeight});
      letter-spacing: var(--m3e-list-item-tracking, ${DesignToken.typescale.standard.body.large.tracking});
    }
    :host(.-has-leading) slot[name="leading"],
    :host(.-has-trailing) slot[name="trailing"] {
      display: flex;
      justify-content: center;
    }
    :host(:not(.-has-leading)) slot[name="leading"] {
      display: var(--_list-item-leading-reserved-display, contents);
    }
    :host(:not(.-has-trailing)) slot[name="trailing"] {
      display: var(--_list-item-trailing-reserved-display, contents);
    }
    slot[name="leading"] {
      min-width: var(--_list-item-leading-reserved-space, 0px);
      margin-inline-start: calc(0px - var(--_list-item-leading-reserved-outset, 0px));
    }
    slot[name="trailing"] {
      min-width: var(--_list-item-trailing-reserved-space, 0px);
      margin-inline-end: calc(0px - var(--_list-item-trailing-reserved-outset, 0px));
    }
    ::slotted(span[slot="trailing"]),
    ::slotted([slot="trailing-supporting-text"]) {
      white-space: nowrap;
      font-size: var(--m3e-list-item-trailing-text-font-size, ${DesignToken.typescale.standard.label.small.fontSize});
      font-weight: var(
        --m3e-list-item-trailing-text-font-weight,
        ${DesignToken.typescale.standard.label.small.fontWeight}
      );
      line-height: var(
        --m3e-list-item-trailing-text-line-height,
        ${DesignToken.typescale.standard.label.small.lineHeight}
      );
      letter-spacing: var(
        --m3e-list-item-trailing-text-tracking,
        ${DesignToken.typescale.standard.label.small.tracking}
      );
    }
    ::slotted(video[slot="leading"]),
    ::slotted(video[slot="trailing"]),
    ::slotted(img[slot="leading"]),
    ::slotted(img[slot="trailing"]) {
      display: block;
      margin: 0 auto;
      overflow: hidden;
      object-fit: cover;
    }
    ::slotted(video) {
      width: var(--m3e-list-item-video-width, 6.25rem);
      height: var(--m3e-list-item-video-height, 3.5rem);
    }
    ::slotted(video[slot="leading"]),
    ::slotted(video[slot="trailing"]) {
      border-radius: var(--m3e-list-item-video-shape, ${DesignToken.shape.corner.none});
    }
    ::slotted(video[slot="leading"]) {
      margin-inline-start: calc(0px - var(--_list-item-leading-video-outset, 0px));
    }
    ::slotted(video[slot="trailing"]) {
      margin-inline-end: calc(0px - var(--_list-item-trailing-video-outset, 0px));
    }
    ::slotted(img) {
      user-drag: none;
      user-select: none;
      pointer-events: none;
      width: var(--m3e-list-item-image-width, 3.5rem);
      height: var(--m3e-list-item-image-height, 3.5rem);
    }
    ::slotted(img[slot="leading"]),
    ::slotted(img[slot="trailing"]) {
      border-radius: var(--m3e-list-item-image-shape, ${DesignToken.shape.corner.none});
    }
    ::slotted(m3e-icon[slot="leading"]),
    ::slotted(m3e-icon[slot="leading-icon"]),
    ::slotted(m3e-icon[slot="trailing"]),
    ::slotted(m3e-icon[slot="trailing-icon"]) {
      --m3e-icon-size: var(--m3e-list-item-icon-size, 1.5rem);
    }
    :host(:not(:disabled)) ::slotted(m3e-icon[slot="leading"]),
    :host(:not(:disabled)) ::slotted(m3e-icon[slot="leading-icon"]) {
      color: var(--m3e-list-item-leading-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:not(:disabled)) .content {
      color: var(--m3e-list-item-label-text-color, ${DesignToken.color.onSurface});
    }
    :host(:not(:disabled)) ::slotted([slot="overline"]) {
      color: var(--m3e-list-item-overline-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:not(:disabled)) ::slotted([slot="supporting-text"]) {
      color: var(--m3e-list-item-supporting-text-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:not(:disabled)) ::slotted([slot="trailing"]),
    :host(:not(:disabled)) ::slotted([slot="trailing-supporting-text"]),
    :host(:not(:disabled)) ::slotted([slot="trailing-icon"]) {
      color: var(--m3e-list-item-trailing-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:not(:disabled)) .base {
      background-color: var(--_list-item-container-color, var(--m3e-list-item-container-color, transparent));
    }
    :host(:disabled) .base {
      background-color: var(--m3e-list-item-disabled-container-color, transparent);
    }
    :host(:disabled) ::slotted(video),
    :host(:disabled) ::slotted(img),
    :host(:disabled) ::slotted(m3e-avatar) {
      opacity: var(--m3e-list-item-disabled-media-opacity, 38%);
    }
    :host(:disabled) .content {
      color: color-mix(
        in srgb,
        var(--m3e-list-item-disabled-label-text-color, ${DesignToken.color.onSurface})
          var(--m3e-list-item-disabled-label-text-opacity, 38%),
        transparent
      );
    }
    :host(:disabled) ::slotted([slot="overline"]) {
      color: color-mix(
        in srgb,
        var(--m3e-list-item-disabled-overline-color, ${DesignToken.color.onSurface})
          var(--m3e-list-item-disabled-overline-opacity, 38%),
        transparent
      );
    }
    :host(:disabled) ::slotted([slot="supporting-text"]) {
      color: color-mix(
        in srgb,
        var(--m3e-list-item-disabled-supporting-text-color, ${DesignToken.color.onSurface})
          var(--m3e-list-item-disabled-supporting-text-opacity, 38%),
        transparent
      );
    }
    :host(:disabled) ::slotted([slot="leading"]),
    :host(:disabled) ::slotted([slot="leading-icon"]) {
      color: color-mix(
        in srgb,
        var(--m3e-list-item-disabled-leading-color, ${DesignToken.color.onSurface})
          var(--m3e-list-item-disabled-leading-opacity, 38%),
        transparent
      );
    }
    :host(:disabled) ::slotted([slot="trailing"]),
    :host(:disabled) ::slotted([slot="trailing-supporting-text"]),
    :host(:disabled) ::slotted([slot="trailing-icon"]) {
      color: color-mix(
        in srgb,
        var(--m3e-list-item-disabled-trailing-color, ${DesignToken.color.onSurface})
          var(--m3e-list-item-disabled-trailing-opacity, 38%),
        transparent
      );
    }
    :host(:not(:disabled)) .state-layer {
      --m3e-state-layer-hover-color: var(--m3e-list-item-hover-state-layer-color, ${DesignToken.color.onSurface});
      --m3e-state-layer-hover-opacity: var(
        --m3e-list-item-hover-state-layer-opacity,
        ${DesignToken.state.hoverStateLayerOpacity}
      );
      --m3e-state-layer-focus-color: var(--m3e-list-item-focus-state-layer-color, ${DesignToken.color.onSurface});
      --m3e-state-layer-focus-opacity: var(
        --m3e-list-item-focus-state-layer-opacity,
        ${DesignToken.state.focusStateLayerOpacity}
      );
    }
    :host(:not(:disabled)) .ripple {
      --m3e-ripple-color: var(--m3e-list-item-pressed-state-layer-color, ${DesignToken.color.onSurface});
      --m3e-ripple-opacity: var(
        --m3e-list-item-pressed-state-layer-opacity,
        ${DesignToken.state.pressedStateLayerOpacity}
      );
    }
    @media (forced-colors: active) {
      :host(:disabled) ::slotted([slot="leading"]),
      :host(:disabled) ::slotted([slot="leading-icon"]),
      :host(:disabled) .content,
      :host(:disabled) ::slotted([slot="overline"]),
      :host(:disabled) ::slotted([slot="supporting-text"]),
      :host(:disabled) ::slotted([slot="trailing"]),
      :host(:disabled) ::slotted([slot="trailing-supporting-text"]),
      :host(:disabled) ::slotted([slot="trailing-icon"]) {
        color: GrayText;
      }
    }
    @media (prefers-reduced-motion) {
      .base {
        transition: none;
      }
    }
  `;

  /** @private */
  #resizeController = new ResizeController(this, { target: null, callback: () => this.#updateMultiline() });

  /** @private */ #leadingContentType: ListItemContentType;
  /** @private */ #trailingContentType: ListItemContentType;

  /** The type of leading content. */
  get leadingContentType(): ListItemContentType {
    return this.#leadingContentType;
  }

  /** The type of trailing content. */
  get trailingContentType(): ListItemContentType {
    return this.#trailingContentType;
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    const content = this.shadowRoot?.querySelector<HTMLElement>(".content");
    if (content) {
      this.#resizeController.observe(content);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">${this._renderBase()}</div>`;
  }

  /** @internal */
  protected _renderBase(): unknown {
    return html`<slot name="leading" @slotchange="${this._handleLeadingSlotChange}">
        <slot name="leading-icon" @slotchange="${this._handleLeadingSlotChange}"></slot>
      </slot>
      <div class="content">
        <slot name="overline"></slot>
        <slot></slot>
        <slot name="supporting-text"></slot>
      </div>
      <slot name="trailing" @slotchange="${this._handleTrailingSlotChange}">
        <slot name="trailing-supporting-text" @slotchange="${this._handleTrailingSlotChange}"></slot>
        <slot name="trailing-icon" @slotchange="${this._handleTrailingSlotChange}"></slot>
      </slot>`;
  }

  /** @private */
  #updateMultiline(): void {
    const content = this.shadowRoot?.querySelector<HTMLElement>(".content") ?? null;
    const lines = content === null ? 0 : computeLineCount(content);
    this.classList.toggle("-one-line", lines <= 1);
    this.classList.toggle("-two-line", lines == 2);
    this.classList.toggle("-three-line", lines > 2);
  }

  /** @internal */
  protected _handleLeadingSlotChange(e: Event): void {
    const contentType = this.#leadingContentType;
    this.#leadingContentType = this.#getSlotContentType(e.target as HTMLSlotElement);
    this.classList.toggle("-has-leading", this.#leadingContentType !== undefined);
    if (contentType !== this.#leadingContentType) {
      this.closest<M3eListElement>("m3e-list,m3e-action-list,m3e-selection-list")?.notifyLeadingContentTypeChange(
        contentType,
        this.#leadingContentType,
      );
    }
  }

  /** @internal */
  protected _handleTrailingSlotChange(e: Event): void {
    const contentType = this.#trailingContentType;
    this.#trailingContentType = this.#getSlotContentType(e.target as HTMLSlotElement);
    this.classList.toggle("-has-trailing", this.#trailingContentType !== undefined);
    if (contentType !== this.#trailingContentType) {
      this.closest<M3eListElement>("m3e-list,m3e-action-list,m3e-selection-list")?.notifyTrailingContentTypeChange(
        contentType,
        this.#trailingContentType,
      );
    }
  }

  /** @private */
  #getSlotContentType(slot: HTMLSlotElement): ListItemContentType {
    const elements = slot.assignedElements({ flatten: true });
    if (elements.some((x) => x.tagName === "VIDEO")) return "video";
    if (elements.some((x) => x.tagName === "IMG")) return "image";
    if (elements.some((x) => x.tagName === "M3E-AVATAR")) return "avatar";
    if (elements.some((x) => x.tagName === "M3E-ICON")) return "icon";
    return elements.length > 0 ? "text" : undefined;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-list-item": M3eListItemElement;
  }
}
