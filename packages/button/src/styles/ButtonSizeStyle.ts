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
      padding-inline-start: ${ButtonSizeToken[size].leadingSpace};
      padding-inline-end: ${ButtonSizeToken[size].trailingSpace};
      column-gap: ${ButtonSizeToken[size].iconLabelSpace};
    }
    :host([size="${unsafeCSS(size)}"].-grouped:not(.-connected).-adjacent-pressed:not(.-pressed)) .wrapper {
      padding-inline-start: calc(
        ${ButtonSizeToken[size].leadingSpace} -
          calc(calc(var(--_adjacent-button-width) * var(--m3e-standard-button-group-width-multiplier, 0.15)) / 4.25)
      );
      padding-inline-end: calc(
        ${ButtonSizeToken[size].trailingSpace} -
          calc(calc(var(--_adjacent-button-width) * var(--m3e-standard-button-group-width-multiplier, 0.15)) / 4.25)
      );
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
      outline-offset: calc(0px - ${ButtonSizeToken[size].outlineThickness});
      outline-width: ${ButtonSizeToken[size].outlineThickness};
    }
    :host(:not(.-connected)[size="${unsafeCSS(size)}"][shape="rounded"]) .base {
      border-radius: var(--_button-shape, ${ButtonSizeToken[size].shapeRound});
    }
    :host(:not(.-connected)[size="${unsafeCSS(size)}"][shape="rounded"][toggle][selected]:not(.-pressed)) .base {
      border-radius: ${ButtonSizeToken[size].selectedShapeRound};
    }
    :host(:not(.-connected)[size="${unsafeCSS(size)}"][shape="square"]) .base {
      border-radius: ${ButtonSizeToken[size].shapeSquare};
    }
    :host(:not(.-connected)[size="${unsafeCSS(size)}"][shape="square"][toggle][selected]:not(.-pressed)) .base {
      border-radius: var(--_button-shape, ${ButtonSizeToken[size].selectedShapeSquare});
    }
    :host(:not(.-connected)[size="${unsafeCSS(size)}"].-pressed) .base {
      border-radius: ${ButtonSizeToken[size].shapePressedMorph};
    }
    :host(.-connected[size="${unsafeCSS(size)}"][shape="rounded"]) .base {
      border-start-start-radius: var(
        --_button-rounded-start-shape,
        var(--_button-shape, ${ButtonSizeToken[size].shapeRound})
      );
      border-end-start-radius: var(
        --_button-rounded-start-shape,
        var(--_button-shape, ${ButtonSizeToken[size].shapeRound})
      );
      border-start-end-radius: var(
        --_button-rounded-end-shape,
        var(--_button-shape, ${ButtonSizeToken[size].shapeRound})
      );
      border-end-end-radius: var(
        --_button-rounded-end-shape,
        var(--_button-shape, ${ButtonSizeToken[size].shapeRound})
      );
    }
    :host(.-connected[size="${unsafeCSS(size)}"][shape="square"]) .base {
      border-start-start-radius: var(--_button-square-start-shape, ${ButtonSizeToken[size].shapeSquare});
      border-end-start-radius: var(--_button-square-start-shape, ${ButtonSizeToken[size].shapeSquare});
      border-start-end-radius: var(--_button-square-end-shape, ${ButtonSizeToken[size].shapeSquare});
      border-end-end-radius: var(--_button-square-end-shape, ${ButtonSizeToken[size].shapeSquare});
    }
    :host(.-connected[size="${unsafeCSS(size)}"][shape="square"][toggle][selected]:not(.-pressed)) .base {
      border-radius: var(--_button-shape, ${ButtonSizeToken[size].selectedShapeSquare});
    }
    :host(.-connected[size="${unsafeCSS(size)}"].-pressed) .base {
      border-start-start-radius: var(--_button-start-shape-pressed-morph, ${ButtonSizeToken[size].shapePressedMorph});
      border-end-start-radius: var(--_button-start-shape-pressed-morph, ${ButtonSizeToken[size].shapePressedMorph});
      border-start-end-radius: var(--_button-end-shape-pressed-morph, ${ButtonSizeToken[size].shapePressedMorph});
      border-end-end-radius: var(--_button-end-shape-pressed-morph, ${ButtonSizeToken[size].shapePressedMorph});
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
