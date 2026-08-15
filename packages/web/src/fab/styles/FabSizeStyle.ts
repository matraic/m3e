import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { FabSize } from "../FabSize";
import { FabSizeToken } from "./FabSizeToken";

/** @private */
function fabStyle(size: FabSize): CSSResult {
  const selector = unsafeCSS(`:is(:state(--${size}), :--${size})`);
  return css`
    :host(${selector}) .base {
      min-height: ${FabSizeToken[size].containerHeight};
    }
    :host(${selector}) .base {
      border-radius: ${FabSizeToken[size].shape};
    }
    :host(${selector}) .label {
      font-size: ${FabSizeToken[size].labelTextFontSize};
      font-weight: ${FabSizeToken[size].labelTextFontWeight};
      line-height: ${FabSizeToken[size].labelTextLineHeight};
      letter-spacing: ${FabSizeToken[size].labelTextTracking};
    }
    :host(${selector}:not([extended])) .wrapper {
      padding-inline-start: ${FabSizeToken[size].leadingSpace};
      padding-inline-end: ${FabSizeToken[size].trailingSpace};
    }
    :host(${selector}:not([extended])) .icon {
      font-size: ${FabSizeToken[size].iconSize};
      --m3e-icon-size: ${FabSizeToken[size].iconSize};
    }
    :host(${selector}[extended]) .wrapper {
      padding-inline-start: ${FabSizeToken[size].extendedLeadingSpace};
      padding-inline-end: ${FabSizeToken[size].extendedTrailingSpace};
      column-gap: ${FabSizeToken[size].iconLabelSpace};
    }
    :host(${selector}[extended]) .icon {
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
