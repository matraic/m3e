import { customElement } from "lit/decorators.js";

import { RovingTabIndexManager, selectionManager } from "@m3e/core/a11y";

import { M3eListElement } from "./ListElement";
import { M3eListActionElement } from "./ListActionElement";
import { M3eExpandableListItem } from "./ExpandableListItemElement";
import { M3eListItemButtonElement } from "./ListItemButtonElement";
import { M3eListItemElement } from "./ListItemElement";

/**
 * A list of actions.
 *
 * @description
 * The `m3e-action-list` component provides a specialized list container for action-based
 * interactions following Material 3 design principles. It manages keyboard navigation with
 * roving tab index, supporting arrow keys, Home/End navigation, and vertical orientation.
 * The component is optimized for scenarios where each list item represents a clickable action.
 *
 * @tag m3e-action-list
 *
 * @slot - Renders the items of the list.
 *
 * @attr variant - The appearance variant of the list.
 *
 * @cssprop --m3e-list-divider-inset-start-size - Start inset for dividers within the list.
 * @cssprop --m3e-list-divider-inset-end-size - End inset for dividers within the list.
 * @cssprop --m3e-segmented-list-segment-gap - Gap between list items in segmented variant.
 * @cssprop --m3e-segmented-list-container-shape - Border radius of the segmented list container.
 * @cssprop --m3e-segmented-list-item-container-color - Background color of items in segmented variant.
 * @cssprop --m3e-segmented-list-item-disabled-container-color - Background color of disabled items in segmented variant.
 * @cssprop --m3e-segmented-list-item-container-shape - Border radius of items in segmented variant.
 * @cssprop --m3e-segmented-list-item-hover-container-shape - Border radius of items in segmented variant on hover.
 * @cssprop --m3e-segmented-list-item-focus-container-shape - Border radius of items in segmented variant on focus.
 * @cssprop --m3e-segmented-list-item-selected-container-shape - Border radius of items in segmented variant when selected.
 */
@customElement("m3e-action-list")
export class M3eActionListElement extends M3eListElement {
  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this[selectionManager].onKeyDown(e);

  /** @private */
  readonly [selectionManager] = new RovingTabIndexManager<M3eListItemButtonElement>()
    .withWrap()
    .withHomeAndEnd()
    .withVerticalOrientation()
    .withSkipPredicate((x) => {
      if (x.disabled) return true;

      const listItem = (x.getRootNode() as ShadowRoot).host as M3eListItemElement;
      if (listItem.parentElement?.slot === "items") {
        let expandable = listItem.closest("m3e-expandable-list-item");
        while (expandable) {
          if (!expandable.open) {
            return true;
          }

          const ancestor = expandable.closest<M3eExpandableListItem | M3eActionListElement>(
            "m3e-expandable-list-item,m3e-action-list",
          );
          if (ancestor instanceof M3eExpandableListItem) {
            expandable = ancestor;
          }
          break;
        }
      }
      return false;
    });

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("keydown", this.#keyDownHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this.#keyDownHandler);
  }

  /** @inheritdoc */
  override async notifyItemsChange(): Promise<void> {
    const items = [
      ...this.querySelectorAll<M3eListActionElement | M3eExpandableListItem>(
        "m3e-list-action,m3e-expandable-list-item",
      ),
    ];

    for (const item of items) {
      if (item.isUpdatePending) {
        await item.updateComplete;
      }
    }

    if (this.isUpdatePending) {
      await this.updateComplete;
    }

    const { added } = this[selectionManager].setItems(
      items.map((x) => (x instanceof M3eExpandableListItem ? x.button : x.button)),
    );

    if (!this[selectionManager].activeItem) {
      this[selectionManager].updateActiveItem(added.find((x) => !x.disabled));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-action-list": M3eActionListElement;
  }
}
