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
 * Place breadcrumb items in order from the broadest level to the current location. The last item is automatically treated as the current page.
 * ```html
 * <m3e-breadcrumb>
 *   <m3e-breadcrumb-item>Dashboard</m3e-breadcrumb-item>
 *   <m3e-breadcrumb-item>Reports</m3e-breadcrumb-item>
 *   <m3e-breadcrumb-item>Annual</m3e-breadcrumb-item>
 * </m3e-breadcrumb>
 * ```
 *
 * @example
 * Use `href` for links on earlier items. The last item is the current location and is not interactive; supply additional items as in the basic example.
 * ```html
 * <m3e-breadcrumb>
 *   <m3e-breadcrumb-item href="https://developer.mozilla.org/en-US/docs/Web" target="_blank">Web</m3e-breadcrumb-item>
 *   <!-- Additional items omitted for brevity -->
 * </m3e-breadcrumb>
 * ```
 *
 * @example
 * Use the `icon` slot for an icon before a label, or place an icon in the default slot and use `item-label` for an icon-only item. Import `@m3e/web/icon` when using `m3e-icon`.
 * ```html
 * <m3e-breadcrumb>
 *   <m3e-breadcrumb-item item-label="Dashboard">
 *     <m3e-icon name="dashboard"></m3e-icon>
 *   </m3e-breadcrumb-item>
 *   <m3e-breadcrumb-item>
 *     <m3e-icon slot="icon" name="analytics"></m3e-icon>Reports
 *   </m3e-breadcrumb-item>
 *   <m3e-breadcrumb-item>
 *     <m3e-icon slot="icon" name="calendar_month"></m3e-icon>Annual
 *   </m3e-breadcrumb-item>
 * </m3e-breadcrumb>
 * ```
 *
 * @example
 * Use the `separator` slot for a custom separator. Supply the additional items shown in the basic example.
 * ```html
 * <m3e-breadcrumb>
 *   <span slot="separator">/</span>
 *   <m3e-breadcrumb-item>Dashboard</m3e-breadcrumb-item>
 *   <!-- Additional items omitted for brevity -->
 * </m3e-breadcrumb>
 * ```
 *
 * @example
 * Use `wrap` to allow breadcrumb items to wrap. Supply the items shown in the basic example.
 * ```html
 * <m3e-breadcrumb wrap>
 *   <!-- Items omitted for brevity -->
 * </m3e-breadcrumb>
 * ```
 *
 * @example
 * Use `--md-sys-density-scale` to adjust the breadcrumb density. Supply the items shown in the basic example. The showcase omits additional breadcrumbs and density classes.
 * ```html
 * <m3e-breadcrumb class="density-3">
 *   <!-- Items omitted for brevity -->
 * </m3e-breadcrumb>
 * <!-- Additional breadcrumbs omitted for brevity -->
 * ```
 * ```css
 * .density-3 {
 *   --md-sys-density-scale: -3;
 * }
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
    :host([hidden]) {
      display: none;
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
      <slot @slotchange=${this.#handleSlotChange}></slot>
      <slot name="separator" @slotchange=${this.#handleSeparatorSlotChange}></slot>
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
