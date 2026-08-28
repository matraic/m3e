import { GestureInputDisposition } from "./GestureInputDisposition";
import { GestureInputResolution } from "./GestureInputResolution";

/** Defines functionality required dispositions claims against input. */
export interface GestureInputClaimant {
  /** Whether dispositions should resolve immediately. */
  readonly eager: boolean;

  /** The priority in which dispositions should resolve. */
  priority: number;

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
