/** Encapsulates options used to disposition claims against input */
export interface GestureInputClaimantOptions {
  /**
   * The priority in which dispositions should resolve.
   * @default 1
   */
  readonly priority: number;
}
