import type { SwipeRevealSide } from "./SwipeRevealSide";

/** Describes the detail of events emitted by a swipe-reveal. */
export interface SwipeRevealEventDetail {
  /**
   * The side the event concerns. For `covered` this is the side that was covered, and for
   * `dismiss` and `dismissed` it is the side the item was dismissed toward.
   */
  readonly side: SwipeRevealSide;
}
