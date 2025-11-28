import { autoUpdate, computePosition, flip, inline, Middleware, offset, platform, shift } from "@floating-ui/dom";
import { offsetParent } from "composed-offset-position";

import { AnchorOptions } from "./AnchorOptions";
import { AnchorPosition } from "./AnchorPosition";

/**
 * Positions an element relative to an anchor element.
 * @param {HTMLElement} target The element to position.
 * @param {HTMLElement} anchor The element in which to anchor `target`.
 * @param {AnchorOptions} options Options that control positioning relative to the anchor.
 * @param {((x: number, y: number, position: AnchorPosition) => void)} update Callback used to position `target`.
 * @returns {Promise<() => void>} Promise that resolves to a function used to stop updating target when the position of the anchor element changes.
 */
export async function positionAnchor(
  target: HTMLElement,
  anchor: HTMLElement,
  options: AnchorOptions,
  update: (x: number, y: number, position: AnchorPosition) => void
): Promise<() => void> {
  async function computeAnchorPosition() {
    const middleware = new Array<Middleware>();

    if (options?.inline) {
      middleware.push(inline());
    }
    if (options.flip) {
      middleware.push(options.flip === true ? flip() : flip({ fallbackPlacements: options.flip }));
    }
    if (options.shift) {
      middleware.push(shift());
    }
    if (options.offset && !isNaN(options.offset)) {
      middleware.push(offset(options.offset));
    }

    const result = await computePosition(anchor, target, {
      placement: options.position,
      middleware: middleware,
      platform: { ...platform, getOffsetParent: (x) => platform.getOffsetParent(x, offsetParent) },
    });

    update(result.x, result.y, result.placement);
  }

  await computeAnchorPosition();
  return autoUpdate(anchor, target, async () => await computeAnchorPosition());
}
