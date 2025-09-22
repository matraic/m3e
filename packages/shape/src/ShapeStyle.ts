import { css, CSSResultGroup } from "lit";

import { ShapeToken } from "./ShapeToken";

/**
 * Baseline styles for `M3eShapeElement`.
 * @internal
 */
export const ShapeStyle: CSSResultGroup = css`
  :host {
    display: inline-block;
    position: relative;
    aspect-ratio: 1 / 1;
    width: ${ShapeToken.size};
  }
  :host([name]) .wrapper {
    background-color: ${ShapeToken.containerColor};
    transition: ${ShapeToken.transition};
    transform-origin: center;
  }
  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    isolation: isolate;
    overflow: hidden;
  }
  ::slotted(img),
  ::slotted(video) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (prefers-reduced-motion) {
    .wrapper {
      transition: none;
    }
  }
`;
