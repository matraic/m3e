import { GestureDetail } from "./GestureDetail";

/**
 * Callback invoked when a gesture is recognized.
 * @template TDetail The type of detail emitted for the gesture.
 */
export type GestureCallback<TDetail extends GestureDetail = GestureDetail> = (detail: TDetail) => void;
