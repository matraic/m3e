import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, Role } from "@m3e/core";

import { ListVariant } from "./ListVariant";
import { M3eListItemElement } from "./ListItemElement";

/**
 * A list of items.
 *
 * @description
 * The `m3e-list` component provides a list container for organizing and displaying
 * multiple list items. It supports flexible layout, custom padding, and divider insets
 * via CSS custom properties.
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
 * @tag m3e-list
 *
 * @slot - Renders the items of the list.
 *
 * @attr variant - The appearance variant of the list.
 *
 * @cssprop --m3e-list-divider-inset-start-size - Start inset for dividers within the list.
 * @cssprop --m3e-list-divider-inset-end-size - End inset for dividers within the list.
 * @cssprop --m3e-segmented-list-segment-gap - Gap between list item segments in segmented variant.
 * @cssprop --m3e-segmented-list-container-shape - Border radius of the segmented list container.
 * @cssprop --m3e-segmented-list-item-container-color - Background color of items in segmented variant.
 * @cssprop --m3e-segmented-list-item-container-shape - Border radius of items in segmented variant.
 * @cssprop --m3e-segmented-list-item-hover-container-shape - Border radius of items in segmented variant on hover.
 * @cssprop --m3e-segmented-list-item-focus-container-shape - Border radius of items in segmented variant on focus.
 * @cssprop --m3e-segmented-list-item-selected-container-shape - Border radius of items in segmented variant when selected.
 */
@customElement("m3e-list")
export class M3eListElement extends Role(LitElement, "list") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      box-sizing: border-box;

      --m3e-divider-inset-start-size: var(--m3e-list-divider-inset-start-size, 1rem);
      --m3e-divider-inset-end-size: var(--m3e-list-divider-inset-end-size, 1.5rem);
    }
    :host([variant="segmented"]) {
      row-gap: var(--m3e-segmented-list-segment-gap, 0.125rem);
      --m3e-list-item-container-color: var(--m3e-segmented-list-item-container-color, ${DesignToken.color.surface});
      --m3e-list-item-container-shape: var(
        --m3e-segmented-list-item-container-shape,
        ${DesignToken.shape.corner.extraSmall}
      );
      --m3e-list-item-hover-container-shape: var(
        --m3e-segmented-list-item-hover-container-shape,
        ${DesignToken.shape.corner.medium}
      );
      --m3e-list-item-focus-container-shape: var(
        --m3e-segmented-list-item-focus-container-shape,
        ${DesignToken.shape.corner.large}
      );
      --m3e-list-item-selected-container-shape: var(
        --m3e-segmented-list-item-selected-container-shape,
        ${DesignToken.shape.corner.large}
      );
    }
    :host([variant="segmented"]) ::slotted(.-first) {
      --_list-item-top-container-shape: var(--m3e-segmented-list-container-shape, ${DesignToken.shape.corner.large});
    }
    :host([variant="segmented"]) ::slotted(.-last) {
      --_list-item-bottom-container-shape: var(--m3e-segmented-list-container-shape, ${DesignToken.shape.corner.large});
    }
    :host([variant="segmented"]) ::slotted(m3e-divider) {
      display: none;
    }
    :host(.-has-video),
    :host(.-has-image),
    :host(.-has-avatar),
    :host(.-has-leading-icon) {
      --_list-item-reserved-leading-display: block;
    }
    :host(.-has-video) {
      --_list-item-reserved-leading-size: var(--m3e-list-item-video-width, 6.25rem);
    }
    :host(.-has-image) {
      --_list-item-reserved-leading-size: var(--m3e-list-item-image-width, 3.5rem);
    }
    :host(.-has-avatar) {
      --_list-item-reserved-leading-size: var(--m3e-list-item-avatar-size, 2.5rem);
    }
    :host(.-has-leading-icon) {
      --_list-item-reserved-leading-size: var(--m3e-list-item-icon-size, 1.5rem);
    }
  `;

  /** @private */ #items = new Array<M3eListItemElement>();
  /** @private */ #leadingSlots = { video: 0, image: 0, avatar: 0, icon: 0 };

  /**
   * The appearance variant of the list.
   * @default "standard"
   */
  @property() variant: ListVariant = "standard";

  /** The items of the list. */
  get items(): ReadonlyArray<M3eListItemElement> {
    return this.#items;
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot @slotchange="${this.#handleSlotChange}"></slot>`;
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    this.#items = (e.target as HTMLSlotElement)
      .assignedElements({ flatten: true })
      .filter((x) => x instanceof M3eListItemElement);

    this.#items.forEach((x, i) => {
      x.classList.toggle("-first", i === 0);
      x.classList.toggle("-last", i === this.#items.length - 1);
    });

    this.notifyItemsChange();
  }

  /**
   * @internal
   * Notifies the list that items have changed.
   */
  notifyItemsChange(): void {}

  /**
   * @internal
   * Notifies the list of a change to leading content slotted in a list item.
   * @param type The type of leading slot that changed.
   * @param {boolean} hasContent Whether content exists for the slot.
   */
  notifyItemLeadingSlotChange(slot: "video" | "image" | "avatar" | "icon", hasContent: boolean) {
    this.#leadingSlots[slot] += hasContent ? 1 : -1;
    let leadingSlot: "video" | "image" | "avatar" | "icon" | undefined = undefined;
    if (this.#leadingSlots.video > 0) {
      leadingSlot = "video";
    } else if (this.#leadingSlots.image > 0) {
      leadingSlot = "image";
    } else if (this.#leadingSlots.avatar > 0) {
      leadingSlot = "avatar";
    } else if (this.#leadingSlots.icon > 0) {
      leadingSlot = "icon";
    }

    this.classList.toggle("-has-video", leadingSlot == "video");
    this.classList.toggle("-has-image", leadingSlot == "image");
    this.classList.toggle("-has-avatar", leadingSlot == "avatar");
    this.classList.toggle("-has-leading-icon", leadingSlot == "icon");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-list": M3eListElement;
  }
}
