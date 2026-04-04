/**
 * Emitted when the search view needs data for the current term.
 *
 * This event fires in two situations:
 * - When the search view opened
 * - When the user changes the input value (the term)
 */
export interface SearchViewQueryEventDetail {
  /** The term for which the component is requesting data. */
  term: string;
}
