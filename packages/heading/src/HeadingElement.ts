import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken } from "@m3e/core";

import { HeadingLevel } from "./HeadingLevel";
import { HeadingSize } from "./HeadingSize";
import { HeadingVariant } from "./HeadingVariant";

/**
 * A heading to a page or section.
 *
 * @description
 * The `m3e-heading` component provides expressive, accessible headings for pages and sections, supporting display,
 * headline, title, and label variants in multiple sizes. It applies Material 3 typographic tokens for font size,
 * weight, line height, and letter spacing, ensuring visual hierarchy and clarity.
 *
 * @example
 * The following example illustrates use of the `m3e-heading` to present each variant and size.
 * ```html
 * <m3e-heading variant="display" size="large">Display Large</m3e-heading>
 * <m3e-heading variant="display" size="medium">Display Medium</m3e-heading>
 * <m3e-heading variant="display" size="small">Display Small</m3e-heading>
 * <m3e-heading variant="headline" size="large">Headline Large</m3e-heading>
 * <m3e-heading variant="headline" size="medium">Headline Medium</m3e-heading>
 * <m3e-heading variant="headline" size="small">Headline Small</m3e-heading>
 * <m3e-heading variant="title" size="large">Title Large</m3e-heading>
 * <m3e-heading variant="title" size="medium">Title Medium</m3e-heading>
 * <m3e-heading variant="title" size="small">Title Small</m3e-heading>
 * <m3e-heading variant="label" size="large">Label Large</m3e-heading>
 * <m3e-heading variant="label" size="medium">Label Medium</m3e-heading>
 * <m3e-heading variant="label" size="small">Label Small</m3e-heading>
 * ```
 *
 * @example
 * The next example illustrates use of the `level` attribute to designate the accessibility level of a heading.
 * When specified, ARIA `role="heading"` is applied and the `level` is propagated to `aria-level`.
 * ```html
 * <m3e-heading variant="headline" size="large" level="1">Page title</m3e-heading>
 * ```
 *
 * @tag m3e-heading
 *
 * @slot - Renders the content of the heading.
 *
 * @attr emphasized - Whether the heading uses an emphasized typescale.
 * @attr level - The accessibility level of the heading.
 * @attr size - The size of the heading.
 * @attr variant - The appearance variant of the heading.
 */
@customElement("m3e-heading")
export class M3eHeadingElement extends LitElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    :host([variant="display"][size="large"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.display.large.fontSize};
      font-weight: ${DesignToken.typescale.standard.display.large.fontWeight};
      line-height: ${DesignToken.typescale.standard.display.large.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.display.large.tracking};
    }
    :host([variant="display"][size="medium"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.display.medium.fontSize};
      font-weight: ${DesignToken.typescale.standard.display.medium.fontWeight};
      line-height: ${DesignToken.typescale.standard.display.medium.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.display.medium.tracking};
    }
    :host([variant="display"][size="small"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.display.small.fontSize};
      font-weight: ${DesignToken.typescale.standard.display.small.fontWeight};
      line-height: ${DesignToken.typescale.standard.display.small.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.display.small.tracking};
    }
    :host([variant="headline"][size="large"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.headline.large.fontSize};
      font-weight: ${DesignToken.typescale.standard.headline.large.fontWeight};
      line-height: ${DesignToken.typescale.standard.headline.large.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.headline.large.tracking};
    }
    :host([variant="headline"][size="medium"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.headline.medium.fontSize};
      font-weight: ${DesignToken.typescale.standard.headline.medium.fontWeight};
      line-height: ${DesignToken.typescale.standard.headline.medium.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.headline.medium.tracking};
    }
    :host([variant="headline"][size="small"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.headline.small.fontSize};
      font-weight: ${DesignToken.typescale.standard.headline.small.fontWeight};
      line-height: ${DesignToken.typescale.standard.headline.small.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.headline.small.tracking};
    }
    :host([variant="title"][size="large"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.title.large.fontSize};
      font-weight: ${DesignToken.typescale.standard.title.large.fontWeight};
      line-height: ${DesignToken.typescale.standard.title.large.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.title.large.tracking};
    }
    :host([variant="title"][size="medium"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.title.medium.fontSize};
      font-weight: ${DesignToken.typescale.standard.title.medium.fontWeight};
      line-height: ${DesignToken.typescale.standard.title.medium.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.title.medium.tracking};
    }
    :host([variant="title"][size="small"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.title.small.fontSize};
      font-weight: ${DesignToken.typescale.standard.title.small.fontWeight};
      line-height: ${DesignToken.typescale.standard.title.small.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.title.small.tracking};
    }
    :host([variant="label"][size="large"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.label.large.fontSize};
      font-weight: ${DesignToken.typescale.standard.label.large.fontWeight};
      line-height: ${DesignToken.typescale.standard.label.large.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.label.large.tracking};
    }
    :host([variant="label"][size="medium"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.label.medium.fontSize};
      font-weight: ${DesignToken.typescale.standard.label.medium.fontWeight};
      line-height: ${DesignToken.typescale.standard.label.medium.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.label.medium.tracking};
    }
    :host([variant="label"][size="small"]:not([emphasized])) {
      font-size: ${DesignToken.typescale.standard.label.small.fontSize};
      font-weight: ${DesignToken.typescale.standard.label.small.fontWeight};
      line-height: ${DesignToken.typescale.standard.label.small.lineHeight};
      letter-spacing: ${DesignToken.typescale.standard.label.small.tracking};
    }
    :host([variant="display"][size="large"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.display.large.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.display.large.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.display.large.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.display.large.tracking};
    }
    :host([variant="display"][size="medium"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.display.medium.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.display.medium.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.display.medium.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.display.medium.tracking};
    }
    :host([variant="display"][size="small"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.display.small.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.display.small.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.display.small.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.display.small.tracking};
    }
    :host([variant="headline"][size="large"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.headline.large.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.headline.large.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.headline.large.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.headline.large.tracking};
    }
    :host([variant="headline"][size="medium"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.headline.medium.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.headline.medium.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.headline.medium.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.headline.medium.tracking};
    }
    :host([variant="headline"][size="small"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.headline.small.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.headline.small.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.headline.small.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.headline.small.tracking};
    }
    :host([variant="title"][size="large"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.title.large.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.title.large.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.title.large.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.title.large.tracking};
    }
    :host([variant="title"][size="medium"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.title.medium.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.title.medium.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.title.medium.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.title.medium.tracking};
    }
    :host([variant="title"][size="small"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.title.small.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.title.small.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.title.small.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.title.small.tracking};
    }
    :host([variant="label"][size="large"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.label.large.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.label.large.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.label.large.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.label.large.tracking};
    }
    :host([variant="label"][size="medium"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.label.medium.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.label.medium.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.label.medium.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.label.medium.tracking};
    }
    :host([variant="label"][size="small"][emphasized]) {
      font-size: ${DesignToken.typescale.emphasized.label.small.fontSize};
      font-weight: ${DesignToken.typescale.emphasized.label.small.fontWeight};
      line-height: ${DesignToken.typescale.emphasized.label.small.lineHeight};
      letter-spacing: ${DesignToken.typescale.emphasized.label.small.tracking};
    }
  `;

  /**
   * Whether the heading uses an emphasized typescale.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) emphasized = false;

  /**
   * The appearance variant of the heading.
   * @default "display"
   */
  @property({ reflect: true }) variant: HeadingVariant = "display";

  /**
   * The size of the heading.
   * @default "medium"
   */
  @property({ reflect: true }) size: HeadingSize = "medium";

  /**
   * The accessibility level of the heading.
   * @default undefined
   */
  @property({ type: Number }) level?: HeadingLevel;

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("level")) {
      this.ariaLevel = this.level !== undefined ? `${this.level}` : null;
      this.role = this.ariaLevel ? "heading" : null;
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-heading": M3eHeadingElement;
  }
}
