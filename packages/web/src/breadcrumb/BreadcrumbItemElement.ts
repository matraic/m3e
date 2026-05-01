import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { AttachInternals, customElement, LinkButton, Role, setCustomState } from "@m3e/web/core";

import { M3eBreadcrumbItemButtonElement } from "./BreadcrumbItemButtonElement";
import { BreadcrumbItemCurrent } from "./BreadcrumbItemCurrent";
import { isIconOnly } from "./isIconOnly";

import "./BreadcrumbItemButtonElement";

/**
 * An item in a breadcrumb.
 *
 * @description
 * The `m3e-breadcrumb-item` element represents a single item in a breadcrumb
 * navigation trail. It renders an internal button and supports navigation
 * attributes for link behavior.
 *
 * @tag m3e-breadcrumb-item
 *
 * @slot - Renders the content of the breadcrumb item.
 *
 * @attr item-label - The accessible label used by the internal breadcrumb button.
 * @attr disabled - Whether the breadcrumb item is disabled.
 * @attr current - Marks the breadcrumb item as the current location in the trail.
 * @attr href - The URL to which the internal breadcrumb link button points.
 * @attr target - The target of the internal breadcrumb link button.
 * @attr download - A value indicating whether the internal link target will be downloaded, optionally specifying a file name.
 * @attr rel - The relationship between the internal link target and the document.
 *
 * @cssprop --m3e-breadcrumb-item-shape - Shape of the internal breadcrumb item button.
 * @cssprop --m3e-breadcrumb-item-container-height - Height of the internal breadcrumb item button container.
 * @cssprop --m3e-breadcrumb-item-icon-color - Color of breadcrumb item icon-only content.
 * @cssprop --m3e-breadcrumb-item-icon-padding-inline - Horizontal padding for icon-only breadcrumb items.
 * @cssprop --m3e-breadcrumb-item-icon-hover-state-layer-color - Hover state layer color for icon-only breadcrumb items.
 * @cssprop --m3e-breadcrumb-item-icon-focus-state-layer-color - Focus state layer color for icon-only breadcrumb items.
 * @cssprop --m3e-breadcrumb-item-icon-pressed-state-layer-color - Pressed state layer color for icon-only breadcrumb items.
 * @cssprop --m3e-breadcrumb-item-label-color - Color of breadcrumb item label content.
 * @cssprop --m3e-breadcrumb-item-label-font-size - Font size of breadcrumb item label content.
 * @cssprop --m3e-breadcrumb-item-label-font-weight - Font weight of breadcrumb item label content.
 * @cssprop --m3e-breadcrumb-item-label-line-height - Line height of breadcrumb item label content.
 * @cssprop --m3e-breadcrumb-item-label-tracking - Letter spacing of breadcrumb item label content.
 * @cssprop --m3e-breadcrumb-item-label-padding-inline - Horizontal padding for label breadcrumb items.
 * @cssprop --m3e-breadcrumb-item-label-hover-state-layer-color - Hover state layer color for label breadcrumb items.
 * @cssprop --m3e-breadcrumb-item-label-focus-state-layer-color - Focus state layer color for label breadcrumb items.
 * @cssprop --m3e-breadcrumb-item-label-pressed-state-layer-color - Pressed state layer color for label breadcrumb items.
 * @cssprop --m3e-breadcrumb-item-last-color - Color used for the current breadcrumb item.
 * @cssprop --m3e-breadcrumb-item-disabled-color - Disabled color used by the breadcrumb item button.
 * @cssprop --m3e-breadcrumb-item-disabled-opacity - Disabled opacity used by the breadcrumb item button.
 */
@customElement("m3e-breadcrumb-item")
export class M3eBreadcrumbItemElement extends LinkButton(AttachInternals(Role(LitElement, "listitem"))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .base {
      display: flex;
      align-items: center;
      height: 100%;
    }
    :host(:not(:state(-icon-only))[current]),
    :host(:not(:state(-icon-only))[current]) .base {
      min-width: 0;
    }
    .button {
      flex: 1 1 auto;
    }
    .separator {
      flex: none;
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 0.5rem;
      --m3e-icon-size: var(--m3e-breadcrumb-separator-icon-size, 1.5rem);
    }
    .separator-icon {
      width: 1em;
      height: 1em;
      font-size: var(--m3e-icon-size);
      vertical-align: middle;
    }
  `;

  /** @private */ @query(".button") private readonly _button!: M3eBreadcrumbItemButtonElement;
  /** @private */ #defaultSeparator?: Element;

  /**
   * The accessible label given to the item's internal button.
   * @default ""
   */
  @property({ attribute: "item-label" }) itemLabel = "";

  /**
   * Whether the element is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Indicates the current item in the breadcrumb path.
   * @default undefined
   */
  @property({ reflect: true }) current?: BreadcrumbItemCurrent;

  /** @inheritdoc */
  override focus(options?: FocusOptions): void {
    this._button?.focus(options);
  }

  /** @inheritdoc */
  override blur(): void {
    this._button?.blur();
  }

  /** @inheritdoc */
  override click(): void {
    this._button?.click();
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <m3e-breadcrumb-item-button
        class="button"
        aria-label="${ifDefined(this.itemLabel || undefined)}"
        ?disabled="${this.disabled}"
        current="${ifDefined(this.current)}"
        href="${ifDefined(this.href || undefined)}"
        target="${ifDefined(this.target || undefined)}"
        download="${ifDefined(this.download || undefined)}"
        rel="${ifDefined(this.rel || undefined)}"
      >
        <slot @slotchange="${this.#handleSlotChange}"></slot>
      </m3e-breadcrumb-item-button>
      ${this.#renderSeparator()}
    </div>`;
  }

  /** @private */
  #renderSeparator(): unknown {
    return this.current
      ? nothing
      : html`<div class="separator" aria-hidden="true">
          <svg class="separator-icon" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </svg>
        </div>`;
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    setCustomState(this, "-icon-only", isIconOnly(e.target as HTMLSlotElement));
  }

  /** @internal */
  _setSeparator(nodes: Array<Node>) {
    const separator = this.shadowRoot?.querySelector(".separator");
    if (!separator) return;

    if (nodes.length > 0) {
      if (!this.#defaultSeparator && separator.firstElementChild) {
        this.#defaultSeparator = separator.firstElementChild;
      }
      separator.replaceChildren(...nodes);
    } else if (this.#defaultSeparator) {
      separator.replaceChildren(this.#defaultSeparator);
      this.#defaultSeparator = undefined;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-breadcrumb-item": M3eBreadcrumbItemElement;
  }
}
