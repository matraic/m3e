import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { ButtonSize } from "../ButtonSize";
import { ButtonSizeToken } from "./ButtonSizeToken";

/** @private */
function buttonStyle(size: ButtonSize): CSSResult {
  return css`
    :host([size="${unsafeCSS(size)}"]) .base {
      height: ${ButtonSizeToken[size].containerHeight};
    }
    :host([size="${unsafeCSS(size)}"]) .wrapper {
      padding-left: ${ButtonSizeToken[size].leadingSpace};
      padding-right: ${ButtonSizeToken[size].trailingSpace};
      column-gap: ${ButtonSizeToken[size].iconLabelSpace};
    }
    :host([size="${unsafeCSS(size)}"]) .label {
      font-size: ${ButtonSizeToken[size].labelTextFontSize};
      font-weight: ${ButtonSizeToken[size].labelTextFontWeight};
      line-height: ${ButtonSizeToken[size].labelTextLineHeight};
      letter-spacing: ${ButtonSizeToken[size].labelTextTracking};
    }
    :host([size="${unsafeCSS(size)}"]) .icon {
      font-size: ${ButtonSizeToken[size].iconSize};
      --m3e-icon-size: ${ButtonSizeToken[size].iconSize};
    }
    :host([size="${unsafeCSS(size)}"]) .base {
      outline-width: ${ButtonSizeToken[size].outlineThickness};
    }
    :host([size="${unsafeCSS(size)}"][shape="rounded"]) .base {
      border-radius: var(--_button-shape, ${ButtonSizeToken[size].shapeRound});
    }
    :host([size="${unsafeCSS(size)}"][shape="square"]) .base {
      border-radius: ${ButtonSizeToken[size].shapeSquare};
    }
    :host([size="${unsafeCSS(size)}"][shape="rounded"][toggle][selected]) .base:not(.pressed) {
      border-radius: ${ButtonSizeToken[size].selectedShapeRound};
    }
    :host([size="${unsafeCSS(size)}"][shape="square"][toggle][selected]) .base:not(.pressed) {
      border-radius: var(--_button-shape, ${ButtonSizeToken[size].selectedShapeSquare});
    }
    :host([size="${unsafeCSS(size)}"]) .base.pressed {
      border-radius: ${ButtonSizeToken[size].shapePressedMorph};
    }
  `;
}

/**
 * Size variant styles for `M3eButtonElement`.
 * @internal
 */
export const ButtonSizeStyle: CSSResultGroup = [
  buttonStyle("extra-small"),
  buttonStyle("small"),
  buttonStyle("medium"),
  buttonStyle("large"),
  buttonStyle("extra-large"),
];
