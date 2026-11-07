import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { customElement, Role, spaceSeparatedStringConverter } from "@m3e/web/core";

import { SwipeRevealTrigger } from "./SwipeRevealTrigger";
import { SwipeRevealDismiss } from "./SwipeRevealDismiss";
import { SwipeRevealElastic } from "./SwipeRevealElastic";
import { SwipeRevealDefaults } from "./SwipeRevealDefaults";
import type { M3eSwipeRevealElement } from "./SwipeRevealElement";

/**
 * Coordinates a set of `m3e-swipe-reveal` elements.
 *
 * @description
 * The `m3e-swipe-reveal-group` component ensures only one contained item is revealed at a time, staggers
 * neighboring items by their position within the group, and supplies default settings to its items.
 * Items may override any setting.
 *
 * @example
 * The following example illustrates a group whose items stagger their neighbors and can be dismissed.
 * ```html
 * <m3e-swipe-reveal-group stagger="0.05" dismissible="trailing">
 *   <m3e-swipe-reveal>…</m3e-swipe-reveal>
 *   <m3e-swipe-reveal>…</m3e-swipe-reveal>
 * </m3e-swipe-reveal-group>
 * ```
 *
 * @tag m3e-swipe-reveal-group
 *
 * @slot - Renders the swipe-reveal elements to coordinate.
 *
 * @attr dismissible - The default side, if any, on which items can be dismissed.
 * @attr dismiss-threshold - The default baseline fraction of an item's width for dismissal.
 * @attr elastic - The default sides whose actions squish and grow as content is dragged.
 * @attr overshoot - The default distance, in pixels, content can be dragged past the actions.
 * @attr stagger - The default fraction (0 to 1) the nearest sibling follows a dragged item.
 * @attr stagger-count - The default number of siblings on each side that are staggered.
 * @attr threshold - The default fraction of the actions' width at which a release reveals or covers.
 * @attr triggers - The default space separated interactions that reveal actions.
 */
@customElement("m3e-swipe-reveal-group")
export class M3eSwipeRevealGroupElement extends Role(LitElement, "none") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
  `;

  /**
   * How far (0 to 1) a nearest sibling follows a dragged item. Each further sibling
   * follows by half as much as the previous. A value of `0` disables staggering.
   * @default 0
   */
  @property({ type: Number }) stagger: number = SwipeRevealDefaults.stagger;

  /**
   * The maximum number of siblings, on each side, to stagger.
   * @default 3
   */
  @property({ type: Number, attribute: "stagger-count" }) staggerCount: number = SwipeRevealDefaults.staggerCount;

  /**
   * The fraction (0 to 1) of an actions' width content must be dragged to reveal.
   * Closing a revealed item uses the same fraction in reverse.
   * @default 0.5
   */
  @property({ type: Number }) threshold: number = SwipeRevealDefaults.threshold;

  /**
   * The maximum distance (px) content can be dragged past fully revealing its actions.
   * Buttons grow with the overshoot. Set to `0` to disable.
   * @default 8
   */
  @property({ type: Number }) overshoot: number = SwipeRevealDefaults.overshoot;

  /**
   * The gestures used to reveal actions.
   * @default ["swipe"]
   */
  @property({ converter: spaceSeparatedStringConverter })
  triggers: readonly SwipeRevealTrigger[] = [...SwipeRevealDefaults.triggers];

  /**
   * The sides whose swipe can continue past the actions to dismiss the item.
   * @default "none"
   */
  @property() dismissible: SwipeRevealDismiss = SwipeRevealDefaults.dismissible;

  /**
   * The sides whose actions squish and grow as content is dragged.
   * @default "both"
   */
  @property() elastic: SwipeRevealElastic = SwipeRevealDefaults.elastic;

  /**
   * The baseline fraction (0 to 1) of an item's width for dismissal. The snap zone starts after full reveal.
   * @default 0.5
   */
  @property({ type: Number, attribute: "dismiss-threshold" })
  dismissThreshold: number = SwipeRevealDefaults.dismissThreshold;

  /** The swipe-reveal elements contained in the group. */
  get reveals(): readonly M3eSwipeRevealElement[] {
    return [...this.querySelectorAll("m3e-swipe-reveal")];
  }

  /** The revealed swipe-reveal in the group or `null` if none are revealed. */
  get revealed(): M3eSwipeRevealElement | null {
    return this.reveals.find((x) => x.state === "revealed") ?? null;
  }

  /** @inheritdoc */
  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    // Reveals read inherited values while rendering, so they must re-render when the group's change.
    if (changedProperties.has("triggers")) {
      for (const reveal of this.reveals) {
        reveal.requestUpdate();
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-swipe-reveal-group": M3eSwipeRevealGroupElement;
  }
}
