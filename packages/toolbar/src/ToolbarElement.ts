import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, Role, Vertical } from "@m3e/core";
import { RovingTabIndexManager, M3eInteractivityChecker } from "@m3e/core/a11y";

import { ToolbarVariant } from "./ToolbarVariant";
import { ToolbarShape } from "./ToolbarShape";

/**
 * @summary
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
 * @cssprop --m3e-toolbar-rounded-padding - Padding for rounded shape.
 * @cssprop --m3e-toolbar-square-padding - Padding for square shape.
 * @cssprop --m3e-toolbar-standard-container-color - Container color for the standard variant.
 * @cssprop --m3e-toolbar-standard-color - Foreground color for the standard variant.
 * @cssprop --m3e-toolbar-vibrant-container-color - Container color for the vibrant variant.
 * @cssprop --m3e-toolbar-vibrant-color - Foreground color for the vibrant variant.
 */
@customElement("m3e-toolbar")
export class M3eToolbarElement extends Vertical(Role(LitElement, "toolbar")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      position: relative;
    }
    .base {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      border-radius: inherit;
    }
    :host(:not([vertical])) {
      height: fit-content;
    }
    :host(:not([vertical])) .base {
      height: calc(var(--m3e-toolbar-size, 4rem) + ${DesignToken.density.calc(-3)});
      column-gap: var(--m3e-toolbar-spacing, 0.25rem);
    }
    :host([vertical]) {
      width: fit-content;
    }
    :host([vertical]) .base {
      width: calc(var(--m3e-toolbar-size, 4rem) + ${DesignToken.density.calc(-3)});
    }
    :host([vertical]) .base {
      flex-direction: column;
      justify-content: center;
      row-gap: var(--m3e-toolbar-spacing, 0.25rem);
    }
    :host([shape="rounded"]) {
      border-radius: var(--m3e-toolbar-rounded-shape, ${DesignToken.shape.corner.full});
    }
    :host([shape="rounded"]) .base {
      padding: var(--m3e-toolbar-rounded-padding, 0.5rem);
    }
    :host(:not([vertical])[shape="square"]) .base {
      padding-inline: var(--m3e-toolbar-square-padding, 1rem);
    }
    :host([vertical][shape="square"]) .base {
      padding-block: var(--m3e-toolbar-square-padding, 1rem);
    }
    :host([variant="standard"]) .state-layer {
      background-color: var(--m3e-toolbar-standard-container-color, ${DesignToken.color.surfaceContainer});
    }
    :host([variant="standard"]) .base {
      color: var(--m3e-toolbar-standard-color, ${DesignToken.color.onSurface});
    }
    :host([variant="vibrant"]) .state-layer {
      background-color: var(--m3e-toolbar-vibrant-container-color, ${DesignToken.color.primaryContainer});
    }
    :host([variant="vibrant"]) .base {
      color: var(--m3e-toolbar-vibrant-color, ${DesignToken.color.onPrimaryContainer});
    }
    @media (forced-colors: active) {
      :host([variant]) .state-layer {
        background-color: Canvas;
      }
      :host([variant]) .base {
        color: CanvasText;
        outline: 1px solid CanvasText;
      }
    }
  `;

  /** @private */ #focusKeyManager = new RovingTabIndexManager().withHomeAndEnd();

  /**
   * The appearance variant of the toolbar.
   * @default "standard"
   */
  @property({ reflect: true }) variant: ToolbarVariant = "standard";

  /**
   * The shape of the toolbar.
   * @default "square"
   */
  @property({ reflect: true }) shape: ToolbarShape = "square";

  /**
   * Whether the toolbar is elevated.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) elevated = false;

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
        <slot
          @click="${this.#handleClick}"
          @keydown="${this.#handleKeyDown}"
          @slotchange="${this.#handleSlotChange}"
        ></slot>
      </div>`;
  }

  /** @private */
  #handleSlotChange(): void {
    const { added } = this.#focusKeyManager.setItems(M3eInteractivityChecker.findInteractiveElements(this));
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
