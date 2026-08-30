/** Encapsulates detail for a gesture. */
export interface GestureDetail {
  /** Identifier of the input that produced the gesture. */
  readonly id: number;

  /** Timestamp the gesture was detected. */
  readonly timestamp: number;

  /** The type of the gesture. */
  readonly gestureType: string;
}
