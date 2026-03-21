import { M3eInputChipElement } from "./InputChipElement";

/** Specifies the type of change made to a set of input chips */
export type InputChipSetChangeType = "add" | "remove";

/** Encapsulates information about changes to a set of input chips. */
export interface InputChipSetChangeEventDetail {
  /** The type of change that occurred. */
  type: InputChipSetChangeType;

  /** The value of the input chip. */
  value: string;

  /** A reference to the input chip. */
  chip: M3eInputChipElement;
}
