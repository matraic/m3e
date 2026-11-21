import { customElement } from "@m3e/web/core";

import { M3eListElement } from "./ListElement";

/**
 * A list of actions.
 *
 * @description
 * The `m3e-action-list` component provides a specialized list container for action-based
 * interactions following Material 3 design principles.
 *
 * @example
 * Use `m3e-list-action` inside an action list to present actions.
 *
 * ```html
 * <m3e-action-list>
 *   <m3e-list-action>Action 1</m3e-list-action>
 *   <!-- Additional actions omitted for brevity -->
 * </m3e-action-list>
 * ```
 *
 * @example
 * Use `variant="segmented"` to present actions as separated items.
 *
 * ```html
 * <m3e-action-list variant="segmented">
 *   <m3e-list-action>Action 1</m3e-list-action>
 *   <!-- Additional actions omitted for brevity -->
 * </m3e-action-list>
 * ```
 *
 * @example
 * Use `disabled` on an individual list action.
 *
 * ```html
 * <m3e-action-list>
 *   <m3e-list-action disabled>Disabled action 1</m3e-list-action>
 *   <!-- Additional actions omitted for brevity -->
 * </m3e-action-list>
 * ```
 *
 * @example
 * Use `disabled` on an action in a segmented action list.
 *
 * ```html
 * <m3e-action-list variant="segmented">
 *   <m3e-list-action disabled>Disabled action 1</m3e-list-action>
 *   <!-- Additional actions omitted for brevity -->
 * </m3e-action-list>
 * ```
 *
 * @example
 * Use `href` to navigate to a destination.
 *
 * ```html
 * <m3e-action-list>
 *   <m3e-list-action href="https://www.google.com" target="_blank">Google</m3e-list-action>
 * </m3e-action-list>
 * ```
 *
 * @example
 * Use `m3e-expandable-list-item` and its `items` slot to group nested actions.
 *
 * ```html
 * <m3e-action-list>
 *   <m3e-expandable-list-item open>
 *     <m3e-icon slot="leading" name="stars"></m3e-icon>
 *     List item
 *     <div slot="items">
 *       <m3e-list-action>
 *         <m3e-icon slot="leading" name="stars"></m3e-icon>
 *         List item
 *       </m3e-list-action>
 *       <!-- Additional actions omitted for brevity -->
 *     </div>
 *   </m3e-expandable-list-item>
 *   <!-- Additional items omitted for brevity -->
 * </m3e-action-list>
 * ```
 *
 * @example
 * Use an expandable item in a `segmented` action list to group nested actions.
 *
 * ```html
 * <m3e-action-list variant="segmented">
 *   <m3e-expandable-list-item open>
 *     <m3e-icon slot="leading" name="stars"></m3e-icon>
 *     List item
 *     <div slot="items">
 *       <m3e-list-action>
 *         <m3e-icon slot="leading" name="stars"></m3e-icon>
 *         List item
 *       </m3e-list-action>
 *       <!-- Additional actions omitted for brevity -->
 *     </div>
 *   </m3e-expandable-list-item>
 *   <!-- Additional items omitted for brevity -->
 * </m3e-action-list>
 * ```
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
 * @cssprop --m3e-segmented-list-container-shape-family - Corner family of the segmented list's outer corners.
 * @cssprop --m3e-segmented-list-container-shape-family-start-start - Corner family of the block-start, inline-start outer corner.
 * @cssprop --m3e-segmented-list-container-shape-family-start-end - Corner family of the block-start, inline-end outer corner.
 * @cssprop --m3e-segmented-list-container-shape-family-end-start - Corner family of the block-end, inline-start outer corner.
 * @cssprop --m3e-segmented-list-container-shape-family-end-end - Corner family of the block-end, inline-end outer corner.
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
