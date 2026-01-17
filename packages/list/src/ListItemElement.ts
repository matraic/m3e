import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

import { computeLineCount, DesignToken, hasAssignedNodes, ResizeController, Role } from "@m3e/core";
import { M3eListElement } from "./ListElement";

/**
 * An item in a list.
 *
 * @description
 * The `m3e-list-item` component represents a single item within a list. It supports rich
 * content, leading/trailing icons, overline, supporting text, and trailing supporting text
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
 *    <m3e-icon slot="leading-icon" name="person"></m3e-icon>
 *    <span slot="overline">Overline</span>
 *    Headline
 *    <span slot="supporting-text">Supporting text</span>
 *    <span slot="trailing-supporting-text">100+</span>
 *    <m3e-icon slot="trailing-icon" name="arrow_right"></m3e-icon>
 *  </m3e-list-item>
 * </m3e-list>
 * ```
 *
 * @tag m3e-list-item
 *
 * @slot - Renders the content of the list item.
 * @slot video - Renders the leading video of the list item.
 * @slot image - Renders the leading image of the list item.
 * @slot avatar - Renders the leading avatar of the list item.
 * @slot leading-icon - Renders the leading icon of the list item.
 * @slot overline - Renders the overline of the list item.
 * @slot supporting-text - Renders the supporting text of the list item.
 * @slot trailing-supporting-text - Renders the trailing supporting text of the list item.
 * @slot trailing-icon - Renders the trailing icon of the list item.
 *
 * @cssprop --m3e-list-item-spacing - Horizontal gap between elements.
 * @cssprop --m3e-list-item-padding-inline - Horizontal padding for the list item.
 * @cssprop --m3e-list-item-padding-block - Vertical padding for the list item.
 * @cssprop --m3e-list-item-height - Minimum height of the list item.
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
 * @cssprop --m3e-list-item-trailing-supporting-text-font-size - Font size for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-supporting-text-font-weight - Font weight for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-supporting-text-line-height - Line height for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-supporting-text-tracking - Letter spacing for trailing supporting text slot.
 * @cssprop --m3e-list-item-icon-size - Size for leading/trailing icons.
 * @cssprop --m3e-list-item-label-text-color - Color for the main content.
 * @cssprop --m3e-list-item-overline-color - Color for the overline slot.
 * @cssprop --m3e-list-item-supporting-text-color - Color for the supporting text slot.
 * @cssprop --m3e-list-item-trailing-supporting-text-color - Color for the trailing supporting text slot.
 * @cssprop --m3e-list-item-leading-icon-color - Color for the leading icon.
 * @cssprop --m3e-list-item-trailing-icon-color - Color for the trailing icon.
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
 * @cssprop --m3e-list-item-avatar-size - Size of the avatar slot.
 * @cssprop --m3e-list-item-avatar-shape - Border radius of the avatar slot.
 * @cssprop --m3e-list-item-avatar-font-size - Font size for avatar slot.
 * @cssprop --m3e-list-item-avatar-font-weight - Font weight for avatar slot.
 * @cssprop --m3e-list-item-avatar-line-height - Line height for avatar slot.
 * @cssprop --m3e-list-item-avatar-tracking - Letter spacing for avatar slot.
 * @cssprop --m3e-list-item-avatar-color - Background color of the avatar slot.
 * @cssprop --m3e-list-item-avatar-label-color - Text color of the avatar slot.
 * @cssprop --m3e-list-item-leading-media-top-offset - Top offset for leading media in multiline items.
 */
@customElement("m3e-list-item")
export class M3eListItemElement extends Role(LitElement, "listitem") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      flex: none;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      column-gap: var(--m3e-list-item-spacing, 1rem);
      padding-inline: var(--m3e-list-item-padding-inline, 1rem);
      padding-block: var(--m3e-list-item-padding-block, 0.625rem);
      min-height: calc(var(--m3e-list-item-height, 3rem) + ${DesignToken.density.calc(-3)});
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
      transition: border-radius ${DesignToken.motion.spring.fastEffects};
    }
    :host(:not(:disabled):not([selected]):hover:not(:focus-visible)) {
      border-radius: var(--m3e-list-item-hover-container-shape, ${DesignToken.shape.corner.none});
    }
    :host(:not(:disabled):not([selected]):focus-visible) {
      border-radius: var(--m3e-list-item-focus-container-shape, ${DesignToken.shape.corner.none});
    }
    .base {
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
    ::slotted([slot="trailing-supporting-text"]) {
      white-space: nowrap;
      font-size: var(
        --m3e-list-item-trailing-supporting-text-font-size,
        ${DesignToken.typescale.standard.label.small.fontSize}
      );
      font-weight: var(
        --m3e-list-item-trailing-supporting-text-font-weight,
        ${DesignToken.typescale.standard.label.small.fontWeight}
      );
      line-height: var(
        --m3e-list-item-trailing-supporting-text-line-height,
        ${DesignToken.typescale.standard.label.small.lineHeight}
      );
      letter-spacing: var(
        --m3e-list-item-trailing-supporting-text-tracking,
        ${DesignToken.typescale.standard.label.small.tracking}
      );
    }
    ::slotted([slot="video"]) {
      width: var(--m3e-list-item-video-width, 6.25rem);
      height: var(--m3e-list-item-video-height, 3.5rem);
      border-radius: var(--m3e-list-item-video-shape, ${DesignToken.shape.corner.small});
    }
    ::slotted([slot="image"]) {
      user-drag: none;
      user-select: none;
      pointer-events: none;
      width: var(--m3e-list-item-image-width, 3.5rem);
      height: var(--m3e-list-item-image-height, 3.5rem);
      border-radius: var(--m3e-list-item-image-shape, ${DesignToken.shape.corner.small});
    }
    ::slotted([slot="video"]),
    ::slotted([slot="image"]) {
      display: block;
      margin: 0 auto;
      overflow: hidden;
      object-fit: cover;
    }
    ::slotted([slot="avatar"]) {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      aspect-ratio: 1 / 1;
      width: var(--m3e-list-item-avatar-size, 2.5rem);
      border-radius: var(--m3e-list-item-avatar-shape, ${DesignToken.shape.corner.full});
      font-size: var(--m3e-list-item-avatar-font-size, ${DesignToken.typescale.standard.title.medium.fontSize});
      font-weight: var(--m3e-list-item-avatar-font-weight, ${DesignToken.typescale.standard.title.medium.fontWeight});
      line-height: var(--m3e-list-item-avatar-line-height, ${DesignToken.typescale.standard.title.medium.lineHeight});
      letter-spacing: var(--m3e-list-item-avatar-tracking, ${DesignToken.typescale.standard.title.medium.tracking});
      background-color: var(--m3e-list-item-avatar-color, ${DesignToken.color.primaryContainer});
      color: var(--m3e-list-item-avatar-label-color, ${DesignToken.color.onPrimaryContainer});
    }
    ::slotted([slot="leading-icon"]),
    ::slotted([slot="trailing-icon"]) {
      min-width: var(--m3e-list-item-icon-size, 1.5rem);
      font-size: var(--m3e-list-item-icon-size, 1.5rem);
    }
    :host(:not(:disabled)) ::slotted([slot="leading-icon"]) {
      color: var(--m3e-list-item-leading-icon-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:not(:disabled)) .base {
      color: var(--m3e-list-item-label-text-color, ${DesignToken.color.onSurface});
    }
    :host(:not(:disabled)) ::slotted([slot="overline"]) {
      color: var(--m3e-list-item-overline-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:not(:disabled)) ::slotted([slot="supporting-text"]) {
      color: var(--m3e-list-item-supporting-text-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:not(:disabled)) ::slotted([slot="trailing-supporting-text"]) {
      color: var(--m3e-list-item-trailing-supporting-text-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:not(:disabled)) ::slotted([slot="trailing-icon"]) {
      color: var(--m3e-list-item-trailing-icon-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:not(:disabled)) {
      background-color: var(--m3e-list-item-container-color, ${DesignToken.color.surface});
    }
    :host(:disabled) .base {
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
    :host(:disabled) ::slotted([slot="trailing-supporting-text"]) {
      color: color-mix(
        in srgb,
        var(--m3e-list-item-disabled-trailing-supporting-text-color, ${DesignToken.color.onSurface})
          var(--m3e-list-item-disabled-trailing-supporting-text-opacity, 38%),
        transparent
      );
    }
    :host(:disabled) ::slotted([slot="leading-icon"]) {
      color: color-mix(
        in srgb,
        var(--m3e-list-item-disabled-leading-icon-color, ${DesignToken.color.onSurface})
          var(--m3e-list-item-disabled-leading-icon-opacity, 38%),
        transparent
      );
    }
    :host(:disabled) ::slotted([slot="trailing-icon"]) {
      color: color-mix(
        in srgb,
        var(--m3e-list-item-disabled-trailing-icon-color, ${DesignToken.color.onSurface})
          var(--m3e-list-item-disabled-trailing-icon-opacity, 38%),
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
    :host(.-has-video) slot[name="image"],
    :host(.-has-video) slot[name="avatar"],
    :host(.-has-video) slot[name="leading-icon"],
    :host(.-has-image) slot[name="video"],
    :host(.-has-image) slot[name="avatar"],
    :host(.-has-image) slot[name="leading-icon"],
    :host(.-has-avatar) slot[name="video"],
    :host(.-has-avatar) slot[name="image"],
    :host(.-has-avatar) slot[name="leading-icon"],
    :host(.-has-leading-icon) slot[name="video"],
    :host(.-has-leading-icon) slot[name="image"],
    :host(.-has-leading-icon) slot[name="avatar"],
    :host(:not(.-has-video):not(.-has-image):not(.-has-avatar):not(.-has-leading-icon)) slot[name="video"],
    :host(:not(.-has-video):not(.-has-image):not(.-has-avatar):not(.-has-leading-icon)) slot[name="image"],
    :host(:not(.-has-video):not(.-has-image):not(.-has-avatar):not(.-has-leading-icon)) slot[name="avatar"] {
      display: none;
    }
    :host(:not(.-has-video):not(.-has-image):not(.-has-avatar):not(.-has-leading-icon)) slot[name="leading-icon"] {
      display: var(--_list-item-reserved-leading-display);
      min-width: var(--_list-item-reserved-leading-size);
    }
    :host(.-has-video) slot[name="video"],
    :host(.-has-image) slot[name="image"],
    :host(.-has-avatar) slot[name="avatar"],
    :host(.-has-leading-icon) slot[name="leading-icon"] {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      min-width: var(--_list-item-reserved-leading-size);
    }
    :host(.-multiline.-has-video) slot[name="video"],
    :host(.-multiline.-has-image) slot[name="image"],
    :host(.-multiline.-has-avatar) slot[name="avatar"] {
      align-self: flex-start;
      margin-top: var(--m3e-list-item-leading-media-top-offset, 0.25rem);
    }
    @media (forced-colors: active) {
      :host(:disabled) .base,
      :host(:disabled) ::slotted([slot="overline"]),
      :host(:disabled) ::slotted([slot="supporting-text"]),
      :host(:disabled) ::slotted([slot="trailing-supporting-text"]),
      :host(:disabled) ::slotted([slot="leading-icon"]),
      :host(:disabled) ::slotted([slot="trailing-icon"]) {
        color: GrayText;
      }
    }
    @media (prefers-reduced-motion) {
      :host {
        transition: none;
      }
    }
  `;

  /** @private */
  #resizeController = new ResizeController(this, { target: null, callback: () => this.#updateMultiline() });

  /** @private */ #leadingSlots = { video: false, image: false, avatar: false, icon: false };
  /** @private */ #leadingSlot?: "video" | "image" | "avatar" | "icon";

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    const base = this.shadowRoot?.querySelector<HTMLElement>(".base");
    if (base) {
      this.#resizeController.observe(base);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot name="video" @slotchange="${this._handleVideoSlotChange}"></slot>
      <slot name="image" @slotchange="${this._handleImageSlotChange}"></slot>
      <slot name="avatar" @slotchange="${this._handleAvatarSlotChange}"></slot>
      <slot name="leading-icon" @slotchange="${this._handleLeadingIconSlotChange}"></slot>
      <div class="base">
        <slot name="overline"></slot>
        <slot></slot>
        <slot name="supporting-text"></slot>
      </div>
      <slot name="trailing-supporting-text"></slot>
      <slot name="trailing-icon"></slot>`;
  }

  /** @internal */
  protected _handleVideoSlotChange(e: Event): void {
    this.#handleLeadingSlotChange("video", e);
  }

  /** @internal */
  protected _handleImageSlotChange(e: Event): void {
    this.#handleLeadingSlotChange("image", e);
  }

  /** @internal */
  protected _handleAvatarSlotChange(e: Event): void {
    this.#handleLeadingSlotChange("avatar", e);
  }

  /** @internal */
  protected _handleLeadingIconSlotChange(e: Event): void {
    this.#handleLeadingSlotChange("icon", e);
  }

  /** @private */
  #handleLeadingSlotChange(slot: "video" | "image" | "avatar" | "icon", e: Event) {
    const hasContent = hasAssignedNodes(<HTMLSlotElement>e.target);
    this.#leadingSlots[slot] = hasContent;

    let leadingSlot: "video" | "image" | "avatar" | "icon" | undefined = undefined;
    if (this.#leadingSlots.video) {
      leadingSlot = "video";
    } else if (this.#leadingSlots.image) {
      leadingSlot = "image";
    } else if (this.#leadingSlots.avatar) {
      leadingSlot = "avatar";
    } else if (this.#leadingSlots.icon) {
      leadingSlot = "icon";
    }

    this.classList.toggle("-has-video", leadingSlot == "video");
    this.classList.toggle("-has-image", leadingSlot == "image");
    this.classList.toggle("-has-avatar", leadingSlot == "avatar");
    this.classList.toggle("-has-leading-icon", leadingSlot == "icon");

    if (this.#leadingSlot !== leadingSlot) {
      const list = this.closest<M3eListElement>("m3e-list, m3e-action-list, m3e-selection-list");
      if (this.#leadingSlot) {
        list?.notifyItemLeadingSlotChange(this.#leadingSlot, false);
      }
      this.#leadingSlot = leadingSlot;
      if (this.#leadingSlot) {
        list?.notifyItemLeadingSlotChange(this.#leadingSlot, true);
      }
    }
  }

  /** @private */
  #updateMultiline(): void {
    const base = this.shadowRoot?.querySelector<HTMLElement>(".base") ?? null;
    this.classList.toggle("-multiline", base !== null && computeLineCount(base) > 1);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-list-item": M3eListItemElement;
  }
}
