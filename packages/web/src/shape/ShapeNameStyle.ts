import { css, CSSResult, CSSResultGroup, unsafeCSS } from "lit";

import { ShapeName } from "./ShapeName";
import { ShapePolygon } from "./ShapePolygon";

/** @private */
function shapeStyle(name: ShapeName): CSSResult {
  return css`
    :host([name="${unsafeCSS(name)}"]) .wrapper {
      clip-path: polygon(${ShapePolygon[name]});
    }
  `;
}

/**
 * Name styles for `M3eShapeElement`.
 * @internal
 */
export const ShapeNameStyle: CSSResultGroup = [
  ...Object.getOwnPropertyNames(ShapePolygon).map((name) => shapeStyle(name as ShapeName)),
];
