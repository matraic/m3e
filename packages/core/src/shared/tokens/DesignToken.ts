import { ColorToken } from "./ColorToken";
import { DensityToken } from "./DensityToken";
import { ElevationToken } from "./ElevationToken";
import { MotionToken } from "./MotionToken";
import { ScrollbarToken } from "./ScrollbarToken";
import { ShapeToken } from "./ShapeToken";
import { StateToken } from "./StateToken";
import { TypescaleToken } from "./TypescaleToken";

/** Design tokens used to style components. */
export const DesignToken = {
  /** Design tokens that control color. */
  color: ColorToken,

  /** Design tokens that control elevation. */
  elevation: ElevationToken,

  /** Design tokens that control motion. */
  motion: MotionToken,

  /** Design tokens that control shape. */
  shape: ShapeToken,

  /** Design tokens that control state layer. */
  state: StateToken,

  /** Design tokens that control typescale. */
  typescale: TypescaleToken,

  /** Design tokens that control scrollbars. */
  scrollbar: ScrollbarToken,

  /** Design tokens that control density. */
  density: DensityToken,
} as const;
