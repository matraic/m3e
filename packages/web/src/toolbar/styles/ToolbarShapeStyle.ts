import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { DesignToken } from "@m3e/web/core";

import { ToolbarShape } from "../ToolbarShape";
import { ToolbarShapeToken } from "./ToolbarShapeToken";

/** @private */
function toolbarShapeStyle(shape: ToolbarShape): CSSResult {
  const selector = unsafeCSS(`:is(:state(--${shape}), :--${shape})`);
  return css`
    :host(${selector}) .base,
    :host(${selector}) .state-layer,
    :host(${selector}) .elevation {
      border-radius: ${ToolbarShapeToken[shape].shape};
    }
    :host(${selector}:not([vertical])) .base {
      padding-inline-start: ${ToolbarShapeToken[shape].leadingSpace};
      padding-inline-end: ${ToolbarShapeToken[shape].trailingSpace};
      padding-block-start: calc(${ToolbarShapeToken[shape].topSpace} + ${DesignToken.density.calc(-3)});
      padding-block-end: calc(${ToolbarShapeToken[shape].bottomSpace} + ${DesignToken.density.calc(-3)});
    }
    :host(${selector}[vertical]) .base {
      padding-block-start: calc(${ToolbarShapeToken[shape].leadingSpace} + ${DesignToken.density.calc(-3)});
      padding-block-end: calc(${ToolbarShapeToken[shape].trailingSpace} + ${DesignToken.density.calc(-3)});
      padding-inline-start: ${ToolbarShapeToken[shape].topSpace};
      padding-inline-end: ${ToolbarShapeToken[shape].bottomSpace};
    }
  `;
}

/**
 * Shape variant styles for `M3eToolbarElement`.
 * @internal
 */
export const ToolbarShapeStyle: CSSResultGroup = [toolbarShapeStyle("square"), toolbarShapeStyle("rounded")];
