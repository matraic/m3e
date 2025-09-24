import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { FabSize } from "../FabSize";
import { FabSizeToken } from "./FabSizeToken";

/** @private */
function fabStyle(size: FabSize): CSSResult {
  return css`
    :host([size="${unsafeCSS(size)}"]) .base {
      height: ${FabSizeToken[size].containerHeight};
    }
    :host([size="${unsafeCSS(size)}"]) .base {
      border-radius: ${FabSizeToken[size].shape};
    }
    :host([size="${unsafeCSS(size)}"]) .label {
      font-size: ${FabSizeToken[size].labelTextFontSize};
      font-weight: ${FabSizeToken[size].labelTextFontWeight};
      line-height: ${FabSizeToken[size].labelTextLineHeight};
      letter-spacing: ${FabSizeToken[size].labelTextTracking};
    }
    :host([size="${unsafeCSS(size)}"]:not([extended])) .wrapper {
      padding-inline-start: ${FabSizeToken[size].leadingSpace};
      padding-inline-end: ${FabSizeToken[size].trailingSpace};
    }
    :host([size="${unsafeCSS(size)}"]:not([extended])) .icon {
      font-size: ${FabSizeToken[size].iconSize};
      --m3e-icon-size: ${FabSizeToken[size].iconSize};
    }
    :host([size="${unsafeCSS(size)}"][extended]) .wrapper {
      padding-inline-start: ${FabSizeToken[size].extendedLeadingSpace};
      padding-inline-end: ${FabSizeToken[size].extendedTrailingSpace};
      column-gap: ${FabSizeToken[size].iconLabelSpace};
    }
    :host([size="${unsafeCSS(size)}"][extended]) .icon {
      font-size: ${FabSizeToken[size].extendedIconSize};
      --m3e-icon-size: ${FabSizeToken[size].extendedIconSize};
    }
  `;
}

/**
 * Size variant styles for `M3eFabElement`.
 * @internal
 */
export const FabSizeStyle: CSSResultGroup = [fabStyle("small"), fabStyle("medium"), fabStyle("large")];
