/**
 * Specifies the possible phases of a gesture during recognition.
 *
 * - `start` — Initial conditions are satisfied and the gesture begins.
 * - `update` — The interaction continues and the gesture has changed or progressed.
 * - `end` — The interaction completes the gesture.
 * - `cancel` — The gesture has failed or been interrupted.
 */
export type GesturePhase = "start" | "update" | "end" | "cancel";

/** Describes the semantic output of a gesture. */
export interface GestureDetail {
  /** The name of the gesture. */
  readonly gestureName: string;

  /** The current phase of the gesture. */
  readonly phase: GesturePhase;

  /** The identifier of the input stream(s) that produced the detail. */
  readonly inputId: number | readonly number[];

  /** The timestamp at which the gesture detail was produced. */
  readonly timestamp: number;
}
