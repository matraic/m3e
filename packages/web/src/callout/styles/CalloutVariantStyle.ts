import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { CalloutVariant } from "../CalloutVariant";
import { CalloutVariantToken } from "./CalloutVariantToken";

/** @private */
function calloutVariantStyle(variant: CalloutVariant): CSSResult {
  const selector = unsafeCSS(`:is(:state(--${variant}), :--${variant})`);
  return css`
    :host(${selector}) .base {
      background-color: ${CalloutVariantToken[variant].containerColor};
    }
    :host(${selector}) .base::before {
      background-color: ${CalloutVariantToken[variant].leadingAccentColor};
    }
    :host(${selector}) slot[name="icon"] {
      color: ${CalloutVariantToken[variant].iconColor};
    }
    :host(${selector}) slot[name="label"] {
      color: ${CalloutVariantToken[variant].labelTextColor};
    }
    :host(${selector}) .content {
      color: ${CalloutVariantToken[variant].contentColor};
    }
  `;
}

/**
 * Appearance variant styles for `M3eCalloutElement`.
 * @internal
 */
export const CalloutVariantStyle: CSSResultGroup = [
  calloutVariantStyle("primary"),
  calloutVariantStyle("secondary"),
  calloutVariantStyle("tertiary"),
  calloutVariantStyle("error"),
  calloutVariantStyle("surface"),
];
