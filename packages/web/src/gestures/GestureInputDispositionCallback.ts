import { GestureInputDisposition } from "./GestureInputDisposition";

/** Callback invoked when a disposition is made against input. */
export type GestureInputDispositionCallback = (id: number, disposition: GestureInputDisposition) => void;
