import { GestureInputClaimantOptions } from "./GestureInputClaimantOptions";
import { GestureInputDisposition } from "./GestureInputDisposition";
import { GestureInputResolution } from "./GestureInputResolution";

/** Defines functionality required dispositions claims against input. */
export interface GestureInputClaimant {
  /** The type of gesture produced from input. */
  readonly gestureType: string;

  /** Whether dispositions should resolve immediately. */
  readonly eager: boolean;

  /** Options used to disposition claims against input. */
  readonly options: GestureInputClaimantOptions;

  /**
   * Callback invoked when a disposition is made against input.
   * @param {number} id The identifier of the input for which a disposition is made.
   * @param {GestureDisposition} disposition The disposition for the input.
   */
  onDisposition?: (id: number, disposition: GestureInputDisposition) => void;

  /**
   * Receives resolution for a prior disposition against input.
   * @param {number} id The identifier of the input being resolved.
   * @param {GestureResolution} resolution The resolution for the input.
   */
  onResolution(id: number, resolution: GestureInputResolution): void;
}
