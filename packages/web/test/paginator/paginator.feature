Feature: Paginator
  Paginators describe the current range of a long list, move between pages, and let the user choose how many items
  each page shows, reporting every change through a page event.

  Rule: The paginator describes the current range

    Scenario: A labelled paginator shows the range and the page size label

      Given a paginator of 95 items in pages of 10 labelled "Pagination"
      When the paginator renders
      Then the paginator is exposed as the "Pagination" group
      And the paginator shows the range "1 - 10 of 95"
      And the paginator shows the label "Items per page:"

    Scenario: The last range is clamped to the length

      Given a paginator of 95 items in pages of 10 on page index 9
      When the paginator renders
      Then the paginator shows the range "91 - 95 of 95"

    Scenario: An empty list reports no range

      Given a paginator of 95 items in pages of 10
      When the paginator renders
      And the application empties the paginator
      Then the paginator shows the range "0 of 0"

    Scenario: A custom range label formatter replaces the default

      Given a paginator of 95 items in pages of 10
      When the paginator renders
      And the application formats the range as the page number and page count
      And the application moves the paginator to page index 1
      Then the paginator shows the range "Page 2 of 10"

    Scenario Outline: The page count and navigation availability follow the page

      Given a paginator of 95 items in pages of <size> on page index <index>
      When the paginator renders
      Then the paginator reports <count> pages with previous <previous> and next <next>

      Examples:
        | size | index | count | previous    | next        |
        | 10   | 0     | 10    | unavailable | available   |
        | 10   | 9     | 10    | available   | unavailable |
        | all  | 0     | 0     | unavailable | unavailable |

  Rule: The paginator moves between pages

    Scenario: The next and previous buttons move one page and dispatch page events

      Given a paginator of 95 items in pages of 10
      When the paginator renders
      And the paginator starts recording page events
      Then the "Previous page" button is disabled
      When the user activates the "Next page" button
      Then the paginator shows the range "11 - 20 of 95"
      And the "Previous page" button is enabled
      When the user activates the "Previous page" button
      Then the paginator shows the range "1 - 10 of 95"
      And the paginator has recorded 2 page events
      And the last page event moved from page index 1 to 0 with page size 10 of 95 items

    Scenario Outline: The buttons that cannot move are disabled at the ends

      Given a paginator of 25 items in pages of 10 on page index <index>
      When the paginator renders
      Then the "<disabled>" button is disabled
      And the "<enabled>" button is enabled

      Examples:
        | index | disabled      | enabled       |
        | 0     | Previous page | Next page     |
        | 2     | Next page     | Previous page |

    Scenario: The first and last buttons are hidden unless requested

      Given a paginator of 95 items in pages of 10
      When the paginator renders
      Then the paginator has no "First page" button
      And the paginator has no "Last page" button

    Scenario: The first and last buttons jump to the ends and dispatch page events

      Given a paginator of 95 items in pages of 10
      And the paginator shows first and last buttons
      When the paginator renders
      And the paginator starts recording page events
      Then the "First page" button is disabled
      When the user activates the "Last page" button
      Then the paginator shows the range "91 - 95 of 95"
      And the "Last page" button is disabled
      And the last page event moved from page index 0 to 9 with page size 10 of 95 items
      When the user activates the "First page" button
      Then the paginator shows the range "1 - 10 of 95"
      And the last page event moved from page index 9 to 0 with page size 10 of 95 items

    Scenario Outline: The keyboard activates a navigation button

      Given a paginator of 95 items in pages of 10
      When the paginator renders
      And the user presses "<key>" on the "Next page" button
      Then the paginator shows the range "11 - 20 of 95"

      Examples:
        | key   |
        | Enter |
        | Space |

    Scenario: Navigation that is not possible dispatches no page events

      Given a paginator of 25 items in pages of 10
      When the paginator renders
      And the paginator starts recording page events
      And the application attempts every navigation that is not possible
      Then the paginator has recorded 0 page events

    Scenario: A custom icon replaces the default navigation icon

      Given a paginator of 95 items in pages of 10
      And the paginator has a custom next page icon
      When the paginator renders
      Then the custom next page icon is visible

  Rule: The paginator chooses the page size

    Scenario: Choosing a page size returns to the first page and dispatches a page event

      Given a paginator of 95 items in pages of 10 on page index 3
      And the paginator offers the page sizes "5,10,25"
      When the paginator renders
      And the paginator starts recording page events
      Then the paginator shows the range "31 - 40 of 95"
      When the user chooses the page size "25"
      Then the paginator shows the range "1 - 25 of 95"
      And the paginator has recorded 1 page event
      And the last page event moved from page index 3 to 0 with page size 25 of 95 items

    Scenario: Choosing all items hides the range actions until a size is chosen again

      Given a paginator of 95 items in pages of 10
      And the paginator offers the page sizes "5,10,all"
      When the paginator renders
      And the user chooses the page size "All"
      Then the "Next page" button is hidden
      And the paginator page size is "all"
      When the user chooses the page size "10"
      Then the paginator shows the range "1 - 10 of 95"
      And the "Next page" button is enabled

    Scenario: The current page size is included in the choices

      Given a paginator of 95 items in pages of 7
      And the paginator offers the page sizes "5,10"
      When the paginator renders
      And the user opens the page size selector
      Then the page size choices are "5, 7, 10"

    Scenario: A page size set by the application is included in the choices

      Given a paginator of 95 items in pages of 10
      And the paginator offers the page sizes "5,10"
      When the paginator renders
      And the application sets the paginator page size to 7
      And the user opens the page size selector
      Then the page size choices are "5, 7, 10"

    Scenario: A single page size disables the selector

      Given a paginator of 95 items in pages of 10
      And the paginator offers the page sizes "10"
      When the paginator renders
      Then the page size selector is disabled

    Scenario: Choosing a page size applies immediately when reduced motion is preferred

      Given a paginator of 95 items in pages of 10
      And the paginator offers the page sizes "5,10,25"
      And the user prefers reduced motion in the paginator
      When the paginator renders
      And the user chooses the page size "25"
      Then the paginator shows the range "1 - 25 of 95"

    Scenario: The page size selector can be hidden

      Given a paginator of 95 items in pages of 10
      And the paginator hides its page size selector
      When the paginator renders
      Then the paginator hides the label "Items per page:"
      And the paginator shows the range "1 - 10 of 95"
      When the application sets the paginator page size to "all"
      Then the paginator hides the range "1 - 10 of 95"

  Rule: The paginator can be labelled and disabled

    Scenario: Custom labels replace the defaults

      Given a paginator of 95 items in pages of 10
      And the paginator shows first and last buttons
      And the paginator uses the labels "Rows:", "Start", "Back", "Forward", and "End"
      When the paginator renders
      Then the paginator shows the label "Rows:"
      And the paginator has a "Start" button
      And the paginator has a "Back" button
      And the paginator has a "Forward" button
      And the paginator has a "End" button

    Scenario: A disabled paginator disables every control

      Given a paginator of 95 items in pages of 10 on page index 2
      And the paginator shows first and last buttons
      And the paginator is disabled
      When the paginator renders
      Then the "First page" button is disabled
      And the "Previous page" button is disabled
      And the "Next page" button is disabled
      And the "Last page" button is disabled
      And the page size selector is disabled

  Rule: The paginator mirrors its icons for right-to-left languages

    Scenario Outline: Navigation icons follow the reading direction

      Given a paginator of 95 items in pages of 10
      And the paginator is rendered <direction>
      When the paginator renders
      Then the "Next page" button icon is <mirroring>

      Examples:
        | direction     | mirroring    |
        | left-to-right | not mirrored |
        | right-to-left | mirrored     |
