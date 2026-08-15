import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { IconButtonSize } from "../IconButtonSize";
import { IconButtonSizeToken } from "./IconButtonSizeToken";

/** @private */
function iconButtonStyle(size: IconButtonSize): CSSResult {
  const selector = unsafeCSS(`:is(:state(--${size}), :--${size})`);
  return css`
    :host(${selector}) .base {
      height: ${IconButtonSizeToken[size].containerHeight};
    }
    :host(${selector}:is(:state(--default), :--default)) .wrapper {
      padding-inline-start: calc(
        ${IconButtonSizeToken[size].defaultLeadingSpace} - calc(var(--_adjacent-shrink, 0px) / 2)
      );
      padding-inline-end: calc(
        ${IconButtonSizeToken[size].defaultTrailingSpace} - calc(var(--_adjacent-shrink, 0px) / 2)
      );
    }
    :host(${selector}:is(:state(--narrow), :--narrow)) .wrapper {
      padding-inline-start: calc(
        ${IconButtonSizeToken[size].narrowLeadingSpace} - calc(var(--_adjacent-shrink, 0px) / 2)
      );
      padding-inline-end: calc(
        ${IconButtonSizeToken[size].narrowTrailingSpace} - calc(var(--_adjacent-shrink, 0px) / 2)
      );
    }
    :host(${selector}:is(:state(--wide), :--wide)) .wrapper {
      padding-inline-start: calc(
        ${IconButtonSizeToken[size].wideLeadingSpace} - calc(var(--_adjacent-shrink, 0px) / 2)
      );
      padding-inline-end: calc(${IconButtonSizeToken[size].wideTrailingSpace} - calc(var(--_adjacent-shrink, 0px) / 2));
    }
    :host(${selector}) .icon {
      font-size: ${IconButtonSizeToken[size].iconSize};
    }
    :host(${selector}) .base {
      outline-offset: calc(0px - ${IconButtonSizeToken[size].outlineThickness});
      outline-width: ${IconButtonSizeToken[size].outlineThickness};
    }
    :host(
        :not(:is(:state(--connected), :--connected))${selector}:is(:state(--rounded), :--rounded):not(
            :is(:state(--pressed), :--pressed)
          )
      )
      .base {
      border-radius: var(--_button-shape, ${IconButtonSizeToken[size].shapeRound});
    }
    :host(
        :is(:state(--connected), :--connected)${selector}:is(:state(--rounded), :--rounded)[toggle][selected]:not(
            :is(:state(--pressed), :--pressed)
          )
      )
      .base {
      border-radius: var(--_button-shape, ${IconButtonSizeToken[size].shapeRound});
    }
    :host(:not(:is(:state(--connected), :--connected))${selector}:is(:state(--square), :--square)) .base {
      border-radius: ${IconButtonSizeToken[size].shapeSquare};
    }
    :host(
        :not(:is(:state(--connected), :--connected))${selector}:is(:state(--rounded), :--rounded)[toggle][selected]:not(
            :is(:state(--pressed), :--pressed)
          )
      )
      .base {
      border-radius: ${IconButtonSizeToken[size].selectedShapeRound};
    }
    :host(
        :not(:is(:state(--connected), :--connected))${selector}:is(:state(--square), :--square)[toggle][selected]:not(
            :is(:state(--pressed), :--pressed)
          )
      )
      .base {
      border-radius: var(--_button-shape, ${IconButtonSizeToken[size].selectedShapeSquare});
    }
    :host(:not(:is(:state(--connected), :--connected))${selector}:is(:state(--pressed), :--pressed)) .base {
      border-radius: ${IconButtonSizeToken[size].shapePressedMorph};
    }
    :host(:is(:state(--connected), :--connected)${selector}:is(:state(--rounded), :--rounded):not([toggle][selected]))
      .base {
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
    :host(:is(:state(--connected), :--connected)${selector}:is(:state(--square), :--square)) .base {
      border-start-start-radius: var(--_button-square-start-shape, ${IconButtonSizeToken[size].shapeSquare});
      border-end-start-radius: var(--_button-square-start-shape, ${IconButtonSizeToken[size].shapeSquare});
      border-start-end-radius: var(--_button-square-end-shape, ${IconButtonSizeToken[size].shapeSquare});
      border-end-end-radius: var(--_button-square-end-shape, ${IconButtonSizeToken[size].shapeSquare});
    }
    :host(
        :is(:state(--connected), :--connected)${selector}:is(:state(--square), :--square)[toggle][selected]:not(
            :is(:state(--pressed), :--pressed)
          )
      )
      .base {
      border-radius: var(--_button-shape, ${IconButtonSizeToken[size].selectedShapeSquare});
    }
    :host(:is(:state(--connected), :--connected)${selector}:is(:state(--pressed), :--pressed)) .base {
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
