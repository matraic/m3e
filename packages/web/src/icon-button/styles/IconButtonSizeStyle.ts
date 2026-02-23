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
      padding-inline-start: ${IconButtonSizeToken[size].defaultLeadingSpace};
      padding-inline-end: ${IconButtonSizeToken[size].defaultTrailingSpace};
    }
    :host([size="${unsafeCSS(size)}"][width="narrow"]) .wrapper {
      padding-inline-start: ${IconButtonSizeToken[size].narrowLeadingSpace};
      padding-inline-end: ${IconButtonSizeToken[size].narrowTrailingSpace};
    }
    :host([size="${unsafeCSS(size)}"][width="wide"]) .wrapper {
      padding-inline-start: ${IconButtonSizeToken[size].wideLeadingSpace};
      padding-inline-end: ${IconButtonSizeToken[size].wideTrailingSpace};
    }
    :host([size="${unsafeCSS(size)}"]) .icon {
      font-size: ${IconButtonSizeToken[size].iconSize};
    }
    :host([size="${unsafeCSS(size)}"]) .base {
      outline-offset: calc(0px - ${IconButtonSizeToken[size].outlineThickness});
      outline-width: ${IconButtonSizeToken[size].outlineThickness};
    }
    :host(:not(.-connected)[size="${unsafeCSS(size)}"][shape="rounded"]:not(.-pressed)) .base {
      border-radius: var(--_button-shape, ${IconButtonSizeToken[size].shapeRound});
    }
    :host(:not(.-connected)[size="${unsafeCSS(size)}"][shape="square"]) .base {
      border-radius: ${IconButtonSizeToken[size].shapeSquare};
    }
    :host(:not(.-connected)[size="${unsafeCSS(size)}"][shape="rounded"][toggle][selected]:not(.-pressed)) .base {
      border-radius: ${IconButtonSizeToken[size].selectedShapeRound};
    }
    :host(:not(.-connected)[size="${unsafeCSS(size)}"][shape="square"][toggle][selected]:not(.-pressed)) .base {
      border-radius: var(--_button-shape, ${IconButtonSizeToken[size].selectedShapeSquare});
    }
    :host(:not(.-connected)[size="${unsafeCSS(size)}"].-pressed) .base {
      border-radius: ${IconButtonSizeToken[size].shapePressedMorph};
    }
    :host(.-connected[size="${unsafeCSS(size)}"][shape="rounded"]) .base {
      border-start-start-radius: var(
        --_button-rounded-start-shape,
        var(--_button-shape, ${IconButtonSizeToken[size].shapeRound})
      );
      border-end-start-radius: var(
        --_button-rounded-start-shape,
        var(--_button-shape, ${IconButtonSizeToken[size].shapeRound})
      );
      border-start-end-radius: var(
        --_button-rounded-end-shape,
        var(--_button-shape, ${IconButtonSizeToken[size].shapeRound})
      );
      border-end-end-radius: var(
        --_button-rounded-end-shape,
        var(--_button-shape, ${IconButtonSizeToken[size].shapeRound})
      );
    }
    :host(.-connected[size="${unsafeCSS(size)}"][shape="square"]) .base {
      border-start-start-radius: var(--_button-square-start-shape, ${IconButtonSizeToken[size].shapeSquare});
      border-end-start-radius: var(--_button-square-start-shape, ${IconButtonSizeToken[size].shapeSquare});
      border-start-end-radius: var(--_button-square-end-shape, ${IconButtonSizeToken[size].shapeSquare});
      border-end-end-radius: var(--_button-square-end-shape, ${IconButtonSizeToken[size].shapeSquare});
    }
    :host(.-connected[size="${unsafeCSS(size)}"][shape="square"][toggle][selected]:not(.-pressed)) .base {
      border-radius: var(--_button-shape, ${IconButtonSizeToken[size].selectedShapeSquare});
    }
    :host(.-connected[size="${unsafeCSS(size)}"].-pressed) .base {
      border-start-start-radius: var(
        --_button-start-shape-pressed-morph,
        ${IconButtonSizeToken[size].shapePressedMorph}
      );
      border-end-start-radius: var(--_button-start-shape-pressed-morph, ${IconButtonSizeToken[size].shapePressedMorph});
      border-start-end-radius: var(--_button-end-shape-pressed-morph, ${IconButtonSizeToken[size].shapePressedMorph});
      border-end-end-radius: var(--_button-end-shape-pressed-morph, ${IconButtonSizeToken[size].shapePressedMorph});
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
