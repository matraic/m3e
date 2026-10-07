import { CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { AttachInternals, customElement, Role, setCustomEnumState, Vertical } from "@m3e/web/core";
import { RovingTabIndexManager, M3eInteractivityChecker } from "@m3e/web/core/a11y";
import { M3eDirectionality } from "@m3e/web/core/bidi";

import { isToolbarVariant, ToolbarVariant } from "./ToolbarVariant";
import { isToolbarShape, ToolbarShape } from "./ToolbarShape";

import { ToolbarShapeStyle, ToolbarStyle, ToolbarVariantStyle } from "./styles";

/**
 * Presents frequently used actions relevant to the current page.
 *
 * @description
 * The `m3e-toolbar` component presents contextual actions, navigation, and controls. Designed according to
 * Material 3 principles, it supports vertical and horizontal orientation, shape and variant customization,
 * and adaptive layout via CSS custom properties.
 *
 * @example
 * The following example illustrates a `vibrant`, `rounded` toolbar containing icon buttons.
 *
 * ```html
 * <m3e-toolbar variant="vibrant" shape="rounded">
 *  <m3e-icon-button>
 *    <m3e-icon name="arrow_back"></m3e-icon>
 *  </m3e-icon-button>
 *  <m3e-icon-button>
 *    <m3e-icon name="arrow_forward"></m3e-icon>
 *  </m3e-icon-button>
 *  <m3e-icon-button width="wide" variant="filled">
 *    <m3e-icon name="add"></m3e-icon>
 *  </m3e-icon-button>
 *  <m3e-icon-button>
 *    <m3e-icon name="picture_in_picture"></m3e-icon>
 *  </m3e-icon-button>
 *  <m3e-icon-button>
 *    <m3e-icon name="more_vert"></m3e-icon>
 *  </m3e-icon-button>
 * </m3e-toolbar>
 * ```
 *
 * @tag m3e-toolbar
 *
 * @slot - Renders the content of the toolbar.
 *
 * @attr elevated - Whether the toolbar is elevated.
 * @attr shape - The shape of the toolbar.
 * @attr variant - The appearance variant of the toolbar.
 * @attr vertical - Whether the element is oriented vertically.
 *
 * @cssprop --m3e-toolbar-size - The size (height or width) of the toolbar.
 * @cssprop --m3e-toolbar-spacing - The gap between toolbar items.
 * @cssprop --m3e-toolbar-rounded-shape - Border radius for rounded shape.
 * @cssprop --m3e-toolbar-square-shape - Border radius for square shape.
 * @cssprop --m3e-toolbar-rounded-leading-space - Leading space for rounded shape.
 * @cssprop --m3e-toolbar-rounded-trailing-space - Trailing space for rounded shape.
 * @cssprop --m3e-toolbar-rounded-top-space - Top space for rounded shape.
 * @cssprop --m3e-toolbar-rounded-bottom-space - Bottom space for rounded shape.
 * @cssprop --m3e-toolbar-square-leading-space - Leading space for square shape.
 * @cssprop --m3e-toolbar-square-trailing-space - Trailing space for square shape.
 * @cssprop --m3e-toolbar-square-top-space - Top space for square shape.
 * @cssprop --m3e-toolbar-square-bottom-space - Bottom space for square shape.
 * @cssprop --m3e-toolbar-container-color - Container background color for all variants.
 * @cssprop --m3e-toolbar-button-container-color - Button container background color for all variants.
 * @cssprop --m3e-toolbar-selected-button-container-color - Selected button container background color for all variants.
 * @cssprop --m3e-toolbar-icon-color - Icon color for all variants.
 * @cssprop --m3e-toolbar-selected-icon-color - Selected icon color for all variants.
 * @cssprop --m3e-toolbar-label-color - Label color for all variants.
 * @cssprop --m3e-toolbar-selected-label-color - Selected label color for all variants.
 * @cssprop --m3e-toolbar-disabled-icon-color - Icon color when disabled for all variants.
 * @cssprop --m3e-toolbar-disabled-icon-opacity - Icon opacity when disabled for all variants.
 * @cssprop --m3e-toolbar-disabled-label-color - Label color when disabled for all variants.
 * @cssprop --m3e-toolbar-label-icon-opacity - Label opacity when disabled for all variants.
 * @cssprop --m3e-toolbar-hover-state-layer-color - State layer color on hover for all variants.
 * @cssprop --m3e-toolbar-hover-selected-state-layer-color - Selected state layer color on hover for all variants.
 * @cssprop --m3e-toolbar-hover-state-layer-opacity - State layer opacity on hover for all variants.
 * @cssprop --m3e-toolbar-hover-icon-color - Icon color on hover for all variants.
 * @cssprop --m3e-toolbar-hover-selected-icon-color - Selected icon color on hover for all variants.
 * @cssprop --m3e-toolbar-hover-label-color - Label color on hover for all variants.
 * @cssprop --m3e-toolbar-hover-selected-label-color - Selected label color on hover for all variants.
 * @cssprop --m3e-toolbar-focus-state-layer-color - State layer color on focus for all variants.
 * @cssprop --m3e-toolbar-focus-selected-state-layer-color - Selected state layer color on focus for all variants.
 * @cssprop --m3e-toolbar-focus-state-layer-opacity - State layer opacity on focus for all variants.
 * @cssprop --m3e-toolbar-focus-icon-color - Icon color on focus for all variants.
 * @cssprop --m3e-toolbar-focus-selected-icon-color - Selected icon color on focus for all variants.
 * @cssprop --m3e-toolbar-focus-label-color - Label color on focus for all variants.
 * @cssprop --m3e-toolbar-focus-selected-label-color - Selected label color on focus for all variants.
 * @cssprop --m3e-toolbar-pressed-state-layer-color - State layer color on press for all variants.
 * @cssprop --m3e-toolbar-pressed-selected-state-layer-color - Selected state layer color on press for all variants.
 * @cssprop --m3e-toolbar-pressed-state-layer-opacity - State layer opacity on press for all variants.
 * @cssprop --m3e-toolbar-pressed-icon-color - Icon color on press for all variants.
 * @cssprop --m3e-toolbar-pressed-selected-icon-color - Selected icon color on press for all variants.
 * @cssprop --m3e-toolbar-pressed-label-color - Label color on press for all variants.
 * @cssprop --m3e-toolbar-pressed-selected-label-color - Selected label color on press for all variants.
 * @cssprop --m3e-toolbar-standard-container-color - Container background color for the standard variant.
 * @cssprop --m3e-toolbar-standard-button-container-color - Button container background color for the standard variant.
 * @cssprop --m3e-toolbar-standard-selected-button-container-color - Selected button container background color for the standard variant.
 * @cssprop --m3e-toolbar-standard-icon-color - Icon color for the standard variant.
 * @cssprop --m3e-toolbar-standard-selected-icon-color - Selected icon color for the standard variant.
 * @cssprop --m3e-toolbar-standard-label-color - Label color for the standard variant.
 * @cssprop --m3e-toolbar-standard-selected-label-color - Selected label color for the standard variant.
 * @cssprop --m3e-toolbar-standard-disabled-icon-color - Icon color when disabled for the standard variant.
 * @cssprop --m3e-toolbar-standard-disabled-icon-opacity - Icon opacity when disabled for the standard variant.
 * @cssprop --m3e-toolbar-standard-disabled-label-color - Label color when disabled for the standard variant.
 * @cssprop --m3e-toolbar-standard-disabled-label-opacity - Label opacity when disabled for the standard variant.
 * @cssprop --m3e-toolbar-standard-hover-state-layer-color - State layer color on hover for the standard variant.
 * @cssprop --m3e-toolbar-standard-hover-selected-state-layer-color - Selected state layer color on hover for the standard variant.
 * @cssprop --m3e-toolbar-standard-hover-state-layer-opacity - State layer opacity on hover for the standard variant.
 * @cssprop --m3e-toolbar-standard-hover-icon-color - Icon color on hover for the standard variant.
 * @cssprop --m3e-toolbar-standard-hover-selected-icon-color - Selected icon color on hover for the standard variant.
 * @cssprop --m3e-toolbar-standard-hover-label-color - Label color on hover for the standard variant.
 * @cssprop --m3e-toolbar-standard-hover-selected-label-color - Selected label color on hover for the standard variant.
 * @cssprop --m3e-toolbar-standard-focus-state-layer-color - State layer color on focus for the standard variant.
 * @cssprop --m3e-toolbar-standard-focus-selected-state-layer-color - Selected state layer color on focus for the standard variant.
 * @cssprop --m3e-toolbar-standard-focus-state-layer-opacity - State layer opacity on focus for the standard variant.
 * @cssprop --m3e-toolbar-standard-focus-icon-color - Icon color on focus for the standard variant.
 * @cssprop --m3e-toolbar-standard-focus-selected-icon-color - Selected icon color on focus for the standard variant.
 * @cssprop --m3e-toolbar-standard-focus-label-color - Label color on focus for the standard variant.
 * @cssprop --m3e-toolbar-standard-focus-selected-label-color - Selected label color on focus for the standard variant.
 * @cssprop --m3e-toolbar-standard-pressed-state-layer-color - State layer color on press for the standard variant.
 * @cssprop --m3e-toolbar-standard-pressed-selected-state-layer-color - Selected state layer color on press for the standard variant.
 * @cssprop --m3e-toolbar-standard-pressed-state-layer-opacity - State layer opacity on press for the standard variant.
 * @cssprop --m3e-toolbar-standard-pressed-icon-color - Icon color on press for the standard variant.
 * @cssprop --m3e-toolbar-standard-pressed-selected-icon-color - Selected icon color on press for the standard variant.
 * @cssprop --m3e-toolbar-standard-pressed-label-color - Label color on press for the standard variant.
 * @cssprop --m3e-toolbar-standard-pressed-selected-label-color - Selected label color on press for the standard variant.
 * @cssprop --m3e-toolbar-vibrant-container-color - Container background color for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-button-container-color - Button container background color for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-selected-button-container-color - Selected button container background color for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-icon-color - Icon color for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-selected-icon-color - Selected icon color for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-label-color - Label color for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-selected-label-color - Selected label color for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-disabled-icon-color - Icon color when disabled for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-disabled-icon-opacity - Icon opacity when disabled for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-disabled-label-color - Label color when disabled for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-disabled-label-opacity - Label opacity when disabled for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-hover-state-layer-color - State layer color on hover for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-hover-selected-state-layer-color - Selected state layer color on hover for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-hover-state-layer-opacity - State layer opacity on hover for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-hover-icon-color - Icon color on hover for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-hover-selected-icon-color - Selected icon color on hover for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-hover-label-color - Label color on hover for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-hover-selected-label-color - Selected label color on hover for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-focus-state-layer-color - State layer color on focus for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-focus-selected-state-layer-color - Selected state layer color on focus for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-focus-state-layer-opacity - State layer opacity on focus for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-focus-icon-color - Icon color on focus for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-focus-selected-icon-color - Selected icon color on focus for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-focus-label-color - Label color on focus for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-focus-selected-label-color - Selected label color on focus for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-pressed-state-layer-color - State layer color on press for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-pressed-selected-state-layer-color - Selected state layer color on press for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-pressed-state-layer-opacity - State layer opacity on press for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-pressed-icon-color - Icon color on press for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-pressed-selected-icon-color - Selected icon color on press for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-pressed-label-color - Label color on press for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-pressed-selected-label-color - Selected label color on press for the vibrant variant.
 */
@customElement("m3e-toolbar")
export class M3eToolbarElement extends Vertical(Role(AttachInternals(LitElement), "toolbar")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [ToolbarStyle, ToolbarShapeStyle, ToolbarVariantStyle];

  /** @private */ #directionalitySubscription?: () => void;
  /** @private */ #focusKeyManager = new RovingTabIndexManager()
    .withHomeAndEnd()
    .withDirectionality(M3eDirectionality.current);

  /**
   * The appearance variant of the toolbar.
   * @default "standard"
   */
  @property({ reflect: true, useDefault: true }) variant: ToolbarVariant = "standard";

  /**
   * The shape of the toolbar.
   * @default "square"
   */
  @property({ reflect: true, useDefault: true }) shape: ToolbarShape = "square";

  /**
   * Whether the toolbar is elevated.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) elevated = false;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.#applyVariant();
    this.#applyShape();

    this.#directionalitySubscription = M3eDirectionality.observe(
      () => (this.#focusKeyManager.directionality = M3eDirectionality.current),
    );
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#directionalitySubscription?.();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("shape")) {
      this.#applyShape();
    }
    if (_changedProperties.has("variant")) {
      this.#applyVariant();
    }
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("vertical")) {
      this.#focusKeyManager.vertical = this.vertical;
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<m3e-state-layer class="state-layer"></m3e-state-layer>
      <m3e-elevation class="elevation" level="${this.elevated ? 3 : 0}"></m3e-elevation>
      <div class="base">
        <slot @click=${this.#handleClick} @keydown=${this.#handleKeyDown} @slotchange=${this.#handleSlotChange}></slot>
      </div>`;
  }

  /** @private */
  #applyShape(): void {
    if (!isToolbarShape(this.shape)) {
      this.shape = "square";
    }
    setCustomEnumState(this, this.shape, "rounded", "square");
  }

  /** @private */
  #applyVariant(): void {
    if (!isToolbarVariant(this.variant)) {
      this.variant = "standard";
    }
    setCustomEnumState(this, this.variant, "standard", "vibrant");
  }

  /** @private */
  #handleSlotChange(): void {
    const items = M3eInteractivityChecker.findInteractiveElements(this, true);
    const { added } = this.#focusKeyManager.setItems(items);
    if (!this.#focusKeyManager.activeItem) {
      const active = added.find((x) => !x.hasAttribute("disabled"));
      if (active) {
        this.#focusKeyManager.updateActiveItem(active);
      }
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this.#focusKeyManager.onKeyDown(e);
  }

  /** @private */
  #handleClick(e: Event): void {
    const item = e.composedPath().find((x) => x instanceof HTMLElement && this.#focusKeyManager.items.includes(x));
    if (item) {
      this.#focusKeyManager.updateActiveItem(<HTMLElement>item);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-toolbar": M3eToolbarElement;
  }
}
