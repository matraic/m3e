/** Emitted when a user selects a different page size or navigates to another page. */
export interface PageEventDetail {
  /** The zero-based index of the current page index. */
  pageIndex: number;

  /** The zero-based index of the page which was previously selected. */
  previousPageIndex?: number;

  /** The current page size. */
  pageSize: number | "all";

  /** The current total number of items being paged. */
  length: number;
}
