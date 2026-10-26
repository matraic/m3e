import { customElement } from "@pulse/web/core";

import { M3eListElement } from "./ListElement";

/**
 * A list of actions.
 *
 * @description
 * The `m3e-action-list` component provides a specialized list container for action-based
 * interactions following Material 3 design principles.
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
export class M3eActionListElement extends M3eListElement {}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-action-list": M3eActionListElement;
  }
}
