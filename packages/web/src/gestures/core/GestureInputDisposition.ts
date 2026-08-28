/**
 * Specifies the possible dispositions of an input during gesture recognition.
 * - `accept` — The recognizer intends to claim a gesture.
 * - `reject` — The recognizer declines or withdraws.
 * - `hold` — The recognizer delays its decision and requests more input.
 * - `release` — The recognizer releases a previously held decision.
 */
export type GestureInputDisposition = "accept" | "reject" | "hold" | "release";
