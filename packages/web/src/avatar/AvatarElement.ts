import { css, CSSResultGroup, html, LitElement } from "lit";

import { customElement, DesignToken } from "@m3e/web/core";

/**
 * An image, icon or textual initials representing a user or other identity.
 *
 * @description
 * The `m3e-avatar` component is a reusable identity primitive that displays visual or
 * textual representation with consistent sizing, shape, and typography.
 *
 * @example
 * An avatar can display initials, an image, or an icon. Replace the image URL placeholder and import `@m3e/web/icon` when using `m3e-icon`. Provide appropriate alternative text or an accessible name when the image or icon conveys identity.
 * ```html
 * <m3e-avatar>AB</m3e-avatar>
 * <m3e-avatar>
 *   <img src="[YOUR IMAGE URL HERE]" />
 * </m3e-avatar>
 * <m3e-avatar>
 *   <m3e-icon name="person"></m3e-icon>
 * </m3e-avatar>
 * ```
 *
 * @tag m3e-avatar
 *
 * @slot - Renders the content of the avatar.
 *
 * @cssprop --m3e-avatar-size - Size of the avatar.
 * @cssprop --m3e-avatar-shape - Border radius of the avatar.
 * @cssprop --m3e-avatar-font-size - Font size for the avatar.
 * @cssprop --m3e-avatar-font-weight - Font weight for the avatar.
 * @cssprop --m3e-avatar-line-height - Line height for the avatar.
 * @cssprop --m3e-avatar-tracking - Letter spacing for the avatar.
 * @cssprop --m3e-avatar-color - Background color of the avatar.
 * @cssprop --m3e-avatar-label-color - Text color of the avatar.
 */
@customElement("m3e-avatar")
export class M3eAvatarElement extends LitElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      vertical-align: middle;
      aspect-ratio: 1 / 1;
      width: var(--m3e-avatar-size, 40px);
    }
    :host([hidden]) {
      display: none;
    }
    .base {
      contain: layout style paint;
      user-select: none;
      white-space: nowrap;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: var(--m3e-avatar-shape, ${DesignToken.shape.corner.full});
      font-size: var(--m3e-avatar-font-size, ${DesignToken.typescale.standard.title.medium.fontSize});
      font-weight: var(--m3e-avatar-font-weight, ${DesignToken.typescale.standard.title.medium.fontWeight});
      line-height: var(--m3e-avatar-line-height, ${DesignToken.typescale.standard.title.medium.lineHeight});
      letter-spacing: var(--m3e-avatar-tracking, ${DesignToken.typescale.standard.title.medium.tracking});
      background-color: var(--m3e-avatar-color, ${DesignToken.color.primaryContainer});
      color: var(--m3e-avatar-label-color, ${DesignToken.color.onPrimaryContainer});
    }
    ::slotted(img) {
      display: block;
      margin: 0 auto;
      overflow: hidden;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  `;

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base"><slot></slot></div>`;
  }
}
