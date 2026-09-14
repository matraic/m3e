/** Specifies the kinds of DOM input events that can participate in gesture recognition. */
export type GestureInputKind =
  | "pointerover"
  | "pointerenter"
  | "pointerdown"
  | "pointermove"
  | "pointerup"
  | "pointercancel"
  | "pointerout"
  | "pointerleave"
  | "wheel";

/** Represents a normalized input event used during gesture recognition. */
export interface GestureInput {
  /** The identifier for this input stream. */
  readonly inputId: number;

  /** The kind of input event represented by this sample. */
  readonly kind: GestureInputKind;

  /** Whether the Ctrl key was pressed. */
  readonly ctrlKey: boolean;

  /** Whether the Shift key was pressed. */
  readonly shiftKey: boolean;

  /** Whether the Alt key was pressed. */
  readonly altKey: boolean;

  /** Whether the Meta key was pressed. */
  readonly metaKey: boolean;

  /** The element on which the event listener was registered. */
  readonly currentTarget: HTMLElement;

  /** The event’s dispatch target. */
  readonly target: EventTarget;

  /** The button pressed for this event (if any). */
  readonly button: number;

  /** Bitmask of all buttons pressed for this event. */
  readonly buttons: number;

  /** Timestamp (ms) at which the input sample was produced. */
  readonly timestamp: number;
}

/** Specifies the pointer types capable of producing gesture input. */
export type PointerType = "mouse" | "pen" | "touch";

/** Represents a normalized pointer input sample used during gesture recognition. */
export interface PointerInput extends GestureInput {
  /** The type of pointer that produced this input sample. */
  readonly pointerType: PointerType;

  /** Horizontal viewport coordinate where the input occurred. */
  readonly clientX: number;

  /** Vertical viewport coordinate where the input occurred. */
  readonly clientY: number;

  /** Element-relative horizontal coordinate where the input occurred.  */
  readonly localX: number;

  /** Element-relative vertical coordinate where the input occurred.  */
  readonly localY: number;
}

/** Represents a wheel input sample used during gesture recognition. */
export interface WheelInput extends GestureInput {
  /** Horizontal scroll delta. */
  readonly deltaX: number;

  /** Vertical scroll delta. */
  readonly deltaY: number;

  /** Z‑axis scroll delta (rarely used). */
  readonly deltaZ: number;

  /** Unit of the delta values (pixels, lines, or pages). */
  readonly deltaMode: number;
}
