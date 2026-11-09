import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";

import { customElement } from "@m3e/web/core";

import { ShapeName } from "./ShapeName";
import { ShapeStyle } from "./ShapeStyle";
import { ShapeNameStyle } from "./ShapeNameStyle";

/**
 * A shape used to add emphasis and decorative flair.
 *
 * @description
 * The `m3e-shape` component allows you to use abstract shapes thoughtfully to add emphasis and decorative flair,
 * including built-in shape morphing.
 *
 * All shape names are sourced from the Material Shape library: `4-leaf-clover`, `4-sided-cookie`, `6-sided-cookie`,
 * `7-sided-cookie`, `8-leaf-clover`, `9-sided-cookie`, `12-sided-cookie`, `arch`, `arrow`, `boom`, `bun`, `burst`,
 * `circle`, `diamond`, `fan`, `flower`, `gem`, `ghost-ish`, `heart`, `hexagon`, `oval`, `pentagon`, `pill`, `pixel-circle`,
 * `pixel-triangle`, `puffy`, `puffy-diamond`, `semicircle`, `slanted`, `soft-boom`, `soft-burst`, `square`, `sunny`,
 * `triangle`, and `very-sunny`. Refer to the Material Shape library for visual references and details.
 *
 * @example
 * Showcase: Shapes. Import `@m3e/web/shape`.
 *
 * ```html
 * <m3e-shape name="12-sided-cookie"></m3e-shape>
 * <m3e-shape name="9-sided-cookie"></m3e-shape>
 * <m3e-shape name="8-leaf-clover"></m3e-shape>
 * <m3e-shape name="7-sided-cookie"></m3e-shape>
 * <m3e-shape name="6-sided-cookie"></m3e-shape>
 * <m3e-shape name="4-sided-cookie"></m3e-shape>
 * <m3e-shape name="4-leaf-clover"></m3e-shape>
 * <br />
 * <m3e-shape name="arch"></m3e-shape>
 * <m3e-shape name="arrow"></m3e-shape>
 * <m3e-shape name="boom"></m3e-shape>
 * <m3e-shape name="bun"></m3e-shape>
 * <m3e-shape name="diamond"></m3e-shape>
 * <m3e-shape name="fan"></m3e-shape>
 * <m3e-shape name="flower"></m3e-shape>
 * <br />
 * <m3e-shape name="gem"></m3e-shape>
 * <m3e-shape name="ghost-ish"></m3e-shape>
 * <m3e-shape name="heart"></m3e-shape>
 * <m3e-shape name="hexagon"></m3e-shape>
 * <m3e-shape name="pentagon"></m3e-shape>
 * <m3e-shape name="pill"></m3e-shape>
 * <m3e-shape name="pixel-circle"></m3e-shape>
 * <br />
 * <m3e-shape name="pixel-triangle"></m3e-shape>
 * <m3e-shape name="puffy"></m3e-shape>
 * <m3e-shape name="puffy-diamond"></m3e-shape>
 * <m3e-shape name="semicircle"></m3e-shape>
 * <m3e-shape name="slanted"></m3e-shape>
 * <m3e-shape name="soft-boom"></m3e-shape>
 * <m3e-shape name="soft-burst"></m3e-shape>
 * <br />
 * <m3e-shape name="square"></m3e-shape>
 * <m3e-shape name="circle"></m3e-shape>
 * <m3e-shape name="triangle"></m3e-shape>
 * ```
 *
 * @example
 * Showcase: Images and video. Import `@m3e/web/shape`.
 *
 * ```html
 * <m3e-shape name="sunny">
 *   <img src="https://www.shutterstock.com/shutterstock/videos/1006393/thumb/1.jpg?ip=x480" />
 * </m3e-shape>
 * <m3e-shape name="sunny">
 *   <video
 *     autoplay
 *     loop
 *     poster="https://www.shutterstock.com/shutterstock/videos/1006393/thumb/1.jpg?ip=x480"
 *     preload="auto"
 *   >
 *     <source
 *       src="https://www.shutterstock.com/shutterstock/videos/1006393/preview/stock-footage-business-people-working-in-office.webm"
 *       type="video/webm"
 *     />
 *     <source
 *       src="https://www.shutterstock.com/shutterstock/videos/1006393/preview/stock-footage-business-people-working-in-office.mp4"
 *       type="video/mp4"
 *     />
 *   </video>
 * </m3e-shape>
 * ```
 *
 * @tag m3e-shape
 *
 * @slot - Renders the clipped content of the shape.
 *
 * @attr name - The name of the shape.
 *
 * @cssprop --m3e-shape-size - Default size of the shape.
 * @cssprop --m3e-shape-container-color - Container (background) color of the shape.
 * @cssprop --m3e-shape-transition - Transition used to morph between shapes.
 */
@customElement("m3e-shape")
export class M3eShapeElement extends LitElement {
  /** The styles of the element. */
  static override styles = [ShapeStyle, ShapeNameStyle];

  /**
   * The name of the shape.
   * @default null
   */
  @property({ reflect: true }) name: ShapeName | null = null;

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="wrapper"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-shape": M3eShapeElement;
  }
}
