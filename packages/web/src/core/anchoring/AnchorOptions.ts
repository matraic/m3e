import { AnchorPosition } from "./AnchorPosition";

/** Options used to anchor an element to another. */
export interface AnchorOptions {
  /** The position of the element, relative to the anchor. */
  position: AnchorPosition;

  /** Whether to improve positioning for inline elements which can span multiple lines. */
  inline?: boolean;

  /** Whether the element can be shifted to keep it in view. */
  shift?: boolean;

  /** Whether the element can flip to keep it in view. */
  flip?: boolean | AnchorPosition[];

  /** The logical margin, in pixels, between element and its anchor. */
  offset?: number;
}
