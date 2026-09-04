/** Represents input from which to recognize gestures. */
export interface GestureInput {
  /** The identifier of the input. */
  readonly id: number;

  /** The type of input. */
  readonly type: string;

  /** Whether the ctrl key was pressed. */
  readonly ctrlKey: boolean;

  /** Whether the shift key was pressed. */
  readonly shiftKey: boolean;

  /** Whether the alt key was pressed. */
  readonly altKey: boolean;

  /** Whether the meta key was pressed. */
  readonly metaKey: boolean;

  /** The element to which the event handler has been attached. */
  readonly currentTarget: HTMLElement;

  /** A reference to the object onto which the input was dispatched. */
  readonly target: EventTarget;

  /** Which button is pressed on the input device. */
  readonly button: number;

  /** Which buttons are pressed on the input device. */
  readonly buttons: number;

  /** Time (ms) at which the input was created. */
  readonly timestamp: number;
}
