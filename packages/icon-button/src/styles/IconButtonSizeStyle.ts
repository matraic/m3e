import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { IconButtonSize } from "../IconButtonSize";
import { IconButtonSizeToken } from "./IconButtonSizeToken";

/** @private */
function iconButtonStyle(size: IconButtonSize): CSSResult {
  return css`
    :host([size="${unsafeCSS(size)}"]) .base {
      height: ${IconButtonSizeToken[size].containerHeight};
    }
    :host([size="${unsafeCSS(size)}"][width="default"]) .wrapper {
      padding-left: ${IconButtonSizeToken[size].defaultLeadingSpace};
      padding-right: ${IconButtonSizeToken[size].defaultTrailingSpace};
    }
    :host([size="${unsafeCSS(size)}"][width="narrow"]) .wrapper {
      padding-left: ${IconButtonSizeToken[size].narrowLeadingSpace};
      padding-right: ${IconButtonSizeToken[size].narrowTrailingSpace};
    }
    :host([size="${unsafeCSS(size)}"][width="wide"]) .wrapper {
      padding-left: ${IconButtonSizeToken[size].wideLeadingSpace};
      padding-right: ${IconButtonSizeToken[size].wideTrailingSpace};
    }
    :host([size="${unsafeCSS(size)}"]) .icon {
      font-size: ${IconButtonSizeToken[size].iconSize};
    }
    :host([size="${unsafeCSS(size)}"]) .base {
      outline-width: ${IconButtonSizeToken[size].outlineThickness};
    }
    :host([size="${unsafeCSS(size)}"][shape="rounded"]) .base {
      border-radius: var(--_button-shape, ${IconButtonSizeToken[size].shapeRound});
    }
    :host([size="${unsafeCSS(size)}"][shape="square"]) .base {
      border-radius: ${IconButtonSizeToken[size].shapeSquare};
    }
    :host([size="${unsafeCSS(size)}"][shape="rounded"][toggle][selected]:not(.-pressed)) .base {
      border-radius: ${IconButtonSizeToken[size].selectedShapeRound};
    }
    :host([size="${unsafeCSS(size)}"][shape="square"][toggle][selected]:not(.-pressed)) .base {
      border-radius: var(--_button-shape, ${IconButtonSizeToken[size].selectedShapeSquare});
    }
    :host([size="${unsafeCSS(size)}"].-pressed) .base {
      border-radius: ${IconButtonSizeToken[size].shapePressedMorph};
    }
  `;
}

/**
 * Size variant styles for `M3eIconButtonElement`.
 * @internal
 */
export const IconButtonSizeStyle: CSSResultGroup = [
  iconButtonStyle("extra-small"),
  iconButtonStyle("small"),
  iconButtonStyle("medium"),
  iconButtonStyle("large"),
  iconButtonStyle("extra-large"),
];
