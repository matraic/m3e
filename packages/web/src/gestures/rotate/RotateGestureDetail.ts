import { GestureDetail } from "@m3e/web/gestures";

/** Describes the semantic output of a rotate gesture. */
export interface RotateGestureDetail extends GestureDetail {
  /** Total rotation (radians) since activation. */
  readonly rotation: number;

  /** Incremental rotation (radians) between the last two samples. */
  readonly rotationDelta: number;

  /** Instantaneous angular velocity (radians/ms). */
  readonly rotationVelocity: number;

  /** Average angle (radians) of all pointers relative to centroid. */
  readonly currentAngle: number;

  /** Angle (radians) at activation. */
  readonly initialAngle: number;
}
