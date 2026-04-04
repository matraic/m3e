/**
 * Emitted when the autocomplete needs option data for the current term.
 *
 * This event fires in two situations:
 * - When the input receives focus and no options are available yet
 * - When the user changes the input value (the term)
 */
export interface AutocompleteQueryEventDetail {
  /** The term for which the component is requesting option data. */
  term: string;
}
