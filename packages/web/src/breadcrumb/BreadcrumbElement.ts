import { css, CSSResultGroup, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

import { customElement, Role } from "@m3e/web/core";

import type { M3eBreadcrumbItemElement } from "./BreadcrumbItemElement";

/**
 * Displays a hierarchical navigation path and identifies the user's
 * current location within an application.
 *
 * @description
 * The `m3e-breadcrumb` component arranges `m3e-breadcrumb-item` children into
 * a trail of navigation steps. It tracks the last item as the current page and
 * supports a custom separator slot for alternate divider content.
 *
 * @example
 * The following example illustrates a simple breadcrumb with three items.
 * ```html
 * <m3e-breadcrumb>
 *   <m3e-breadcrumb-item href="/dashboard">Dashboard</m3e-breadcrumb-item>
 *   <m3e-breadcrumb-item href="/dashboard/reports">Reports</m3e-breadcrumb-item>
 *   <m3e-breadcrumb-item href="/dashboard/reports/annual">Annual</m3e-breadcrumb-item>
 * </m3e-breadcrumb>
 * ```
 *
 * @tag m3e-breadcrumb
 *
 * @slot - Renders breadcrumb items.
 * @slot separator - Renders a custom separator between breadcrumb items.
 *
 * @attr wrap - Whether breadcrumb items should wrap onto a new line.
 */
@customElement("m3e-breadcrumb")
export class M3eBreadcrumbElement extends Role(LitElement, "navigation") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .base {
      display: flex;
      align-items: center;
    }
    :host([wrap]) .base {
      flex-wrap: wrap;
    }
    slot[name="separator"] {
      display: none;
    }
  `;

  /** @private */ #customSeparator: Element[] = [];

  /**
   * Whether items wrap to a new line.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) wrap = false;

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base" role="list">
      <slot @slotchange="${this.#handleSlotChange}"></slot>
      <slot name="separator" @slotchange="${this.#handleSeparatorSlotChange}"></slot>
    </div>`;
  }

  /** @private */
  #handleSlotChange(): void {
    const items = this.querySelectorAll("m3e-breadcrumb-item");
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (i < items.length - 1) {
        item.removeAttribute("current");
      } else if (!item.hasAttribute("current")) {
        item.setAttribute("current", "page");
      }
      this.#setSeparator(item);
    }
  }

  /** @private */
  #handleSeparatorSlotChange(e: Event): void {
    this.#customSeparator = (e.target as HTMLSlotElement).assignedElements({ flatten: true });
    this.querySelectorAll("m3e-breadcrumb-item").forEach((x) => this.#setSeparator(x));
  }

  /** @private */
  #setSeparator(item: M3eBreadcrumbItemElement): void {
    item._setSeparator(
      this.#customSeparator.map((x) => {
        const clone = <Element>x.cloneNode(true);
        clone.part = "separator";
        return clone;
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-breadcrumb": M3eBreadcrumbElement;
  }
}
