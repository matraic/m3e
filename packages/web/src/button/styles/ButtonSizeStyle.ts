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
      padding-inline-start: calc(${ButtonSizeToken[size].leadingSpace} - calc(calc(var(--_adjacent-shrink, 0px) / 2)));
      padding-inline-end: calc(${ButtonSizeToken[size].trailingSpace} - calc(calc(var(--_adjacent-shrink, 0px) / 2)));
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
      outline-offset: calc(0px - ${ButtonSizeToken[size].outlineThickness});
      outline-width: ${ButtonSizeToken[size].outlineThickness};
    }
    :host(:not(:is(:state(--connected), :--connected))[size="${unsafeCSS(size)}"][shape="rounded"]) .base {
      border-radius: var(--_button-shape, ${ButtonSizeToken[size].shapeRound});
    }
    :host(
        :is(:state(--connected), :--connected)[size="${unsafeCSS(size)}"][shape="rounded"][toggle][selected]:not(
            :is(:state(--pressed), :--pressed)
          )
      )
      .base {
      border-radius: var(--_button-shape, ${ButtonSizeToken[size].shapeRound});
    }
    :host(
        :not(:is(:state(--connected), :--connected))[size="${unsafeCSS(size)}"][shape="rounded"][toggle][selected]:not(
            :is(:state(--pressed), :--pressed)
          )
      )
      .base {
      border-radius: ${ButtonSizeToken[size].selectedShapeRound};
    }
    :host(:not(:is(:state(--connected), :--connected))[size="${unsafeCSS(size)}"][shape="square"]) .base {
      border-radius: ${ButtonSizeToken[size].shapeSquare};
    }
    :host(
        :not(:is(:state(--connected), :--connected))[size="${unsafeCSS(size)}"][shape="square"][toggle][selected]:not(
            :is(:state(--pressed), :--pressed)
          )
      )
      .base {
      border-radius: var(--_button-shape, ${ButtonSizeToken[size].selectedShapeSquare});
    }
    :host(:not(:is(:state(--connected), :--connected))[size="${unsafeCSS(size)}"]:is(:state(--pressed), :--pressed))
      .base {
      border-radius: ${ButtonSizeToken[size].shapePressedMorph};
    }
    :host(:is(:state(--connected), :--connected)[size="${unsafeCSS(size)}"][shape="rounded"]:not([toggle][selected]))
      .base {
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
    :host(:is(:state(--connected), :--connected)[size="${unsafeCSS(size)}"][shape="square"]) .base {
      border-start-start-radius: var(--_button-square-start-shape, ${ButtonSizeToken[size].shapeSquare});
      border-end-start-radius: var(--_button-square-start-shape, ${ButtonSizeToken[size].shapeSquare});
      border-start-end-radius: var(--_button-square-end-shape, ${ButtonSizeToken[size].shapeSquare});
      border-end-end-radius: var(--_button-square-end-shape, ${ButtonSizeToken[size].shapeSquare});
    }
    :host(
        :is(:state(--connected), :--connected)[size="${unsafeCSS(size)}"][shape="square"][toggle][selected]:not(
            :is(:state(--pressed), :--pressed)
          )
      )
      .base {
      border-radius: var(--_button-shape, ${ButtonSizeToken[size].selectedShapeSquare});
    }
    :host(:is(:state(--connected), :--connected)[size="${unsafeCSS(size)}"]:is(:state(--pressed), :--pressed)) .base {
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
