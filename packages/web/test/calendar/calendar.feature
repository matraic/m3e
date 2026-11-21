Feature: Calendar
  Calendars support date selection, date restrictions, and navigation between periods.

  Rule: Dates and ranges can be selected

    Scenario: Selecting a date dispatches a change event
      Given a calendar starting at "2026-01-15" with selected date "2026-01-15"
      When the calendar renders
      And the application observes calendar changes
      And the user selects the date five days after the active date
      Then the calendar dispatches 1 change event
      And the selected date is "2026-01-20"
      And exactly 1 date is marked as pressed

    Scenario: Date boundaries disable out-of-range days and month navigation
      Given a calendar starting at "2026-01-15" with dates limited to "2026-01-10" through "2026-01-20"
      When the calendar renders
      Then the calendar shows the period "Jan 2026"
      And 20 dates are disabled
      And the "Previous month" navigation button is disabled
      And the "Next month" navigation button is disabled

    Scenario: Navigate to the next month
      Given a calendar starting at "2026-01-15"
      When the calendar renders
      And the user activates the "Next month" navigation button
      Then the calendar shows the period "Feb 2026"

    Scenario: Selecting a date completes a range
      Given a calendar starting at "2026-01-10" with range start "2026-01-10"
      When the calendar renders
      And the user selects the date five days after the active date
      Then the selected range is "2026-01-10" through "2026-01-15"

    Scenario: A blackout date cannot be selected
      Given a calendar starting at "2026-01-15"
      When the calendar renders
      And the application observes calendar changes
      And the application blacks out the 20th day of the month
      Then 1 date is disabled
      When the user selects the date five days after the active date
      Then no date is selected
      And the calendar dispatches 0 change event

    Scenario: Selecting an earlier date restarts an incomplete range
      Given a calendar starting at "2026-01-15" with range start "2026-01-15"
      When the calendar renders
      And the user selects the date five days before the active date
      Then the range starts at "2026-01-10" with no end

    Scenario: Selecting a date after a completed range starts a new range
      Given a calendar with range "2026-01-10" through "2026-01-15"
      When the calendar renders
      And the user selects "January 20, 2026" in the calendar grid
      Then the range starts at "2026-01-20" with no end

    Scenario Outline: Keyboard navigation moves focus without selecting a date
      Given a calendar starting at "2026-01-15"
      When the calendar renders
      And the user focuses the active date
      And the user presses "<key>" in the calendar
      Then the calendar grid focuses "<date>"
      And no date is selected

      Examples:
        | key          | date              |
        | Home         | January 1, 2026   |
        | End          | January 31, 2026  |
        | ArrowUp      | January 8, 2026   |
        | ArrowDown    | January 22, 2026  |
        | PageUp       | December 15, 2025 |
        | PageDown     | February 15, 2026 |
        | Alt+PageDown | January 15, 2027  |

  Rule: Calendars support different views and navigation labels

    Scenario: An invalid start view falls back to month
      Given a calendar starting at "2026-01-15" with start view "bogus"
      When the calendar renders
      Then the start view is "month"
      And the "Next month" navigation button is visible

    Scenario: A calendar can start in year view
      Given a calendar starting at "2026-01-15" with start view "year"
      When the calendar renders
      Then the "Next year" navigation button is visible
      And the "Previous year" navigation button is visible

    Scenario: A calendar can start in multi-year view
      Given a calendar starting at "2026-01-15" with start view "multi-year"
      When the calendar renders
      Then the "Next 24 years" navigation button is visible
      And the "Previous 24 years" navigation button is visible

    Scenario: Navigate years in year view
      Given a calendar starting at "2026-01-15" with start view "year"
      When the calendar renders
      And the user activates the "Next year" navigation button
      Then the active year is 2027
      When the user activates the "Previous year" navigation button
      And the user activates the "Previous year" navigation button
      Then the active year is 2025

    Scenario: Navigation buttons use custom labels
      Given a calendar starting at "2026-01-15" with month navigation labels "Earlier" and "Later"
      When the calendar renders
      Then the "Earlier" navigation button is visible
      And the "Later" navigation button is visible

    Scenario: The period button opens multi-year view
      Given a calendar starting at "2026-01-15"
      When the calendar renders
      And the user activates the "Jan 2026" navigation button
      Then the "Next 24 years" navigation button is visible

    Scenario: Choosing a year and month returns to the month view
      Given a calendar starting at "2026-01-15"
      When the calendar renders
      And the user activates the "Jan 2026" navigation button
      And the user selects "2028" in the calendar grid
      Then the "Next year" navigation button is visible
      When the user selects "April" in the calendar grid
      Then the calendar shows the period "Apr 2028"

    Scenario: Navigation stops at month boundaries across years
      Given a calendar starting at "2026-01-15" with dates limited to "2025-12-10" through "2026-02-20"
      When the calendar renders
      And the user activates the "Previous month" navigation button
      Then the calendar shows the period "Dec 2025"
      And the "Previous month" navigation button is disabled
      When the user activates the "Next month" navigation button
      And the user activates the "Next month" navigation button
      Then the calendar shows the period "Feb 2026"
      And the "Next month" navigation button is disabled

  Rule: Applications can disable dates

    Scenario: Weekend blackout dates are disabled
      Given a calendar starting at "2026-01-15"
      When the calendar renders
      And the application blacks out weekends
      Then at least 8 dates are disabled

    Scenario: Clearing blackout dates makes them selectable again
      Given a calendar starting at "2026-01-15"
      When the calendar renders
      And the application blacks out the 20th day of the month
      Then 1 date is disabled
      When the application clears blackout dates
      Then 0 dates are disabled
      When the user selects "January 20, 2026" in the calendar grid
      Then the selected date is "2026-01-20"

  Rule: Other views support keyboard navigation

    Scenario Outline: Keyboard navigation moves between months
      Given a calendar starting at "2026-06-15" with start view "year"
      When the calendar renders
      And the user focuses the active date
      And the user presses "<key>" in the calendar
      Then the calendar grid focuses "<month>"
      And the active year is <year>

      Examples:
        | key          | month    | year |
        | ArrowLeft    | May      | 2026 |
        | ArrowRight   | July     | 2026 |
        | ArrowUp      | February | 2026 |
        | ArrowDown    | October  | 2026 |
        | Home         | January  | 2026 |
        | End          | December | 2026 |
        | PageUp       | June     | 2025 |
        | PageDown     | June     | 2027 |
        | Alt+PageUp   | June     | 2016 |
        | Alt+PageDown | June     | 2036 |

    Scenario Outline: Keyboard navigation moves between years
      Given a calendar starting at "2026-01-15" with start view "multi-year"
      When the calendar renders
      And the user focuses the active date
      And the user presses "<key>" in the calendar
      Then the calendar grid focuses "<year>"

      Examples:
        | key          | year |
        | ArrowLeft    | 2025 |
        | ArrowRight   | 2027 |
        | ArrowUp      | 2023 |
        | ArrowDown    | 2029 |
        | Home         | 2016 |
        | End          | 2033 |
        | PageUp       | 2008 |
        | PageDown     | 2044 |
        | Alt+PageUp   | 1846 |
        | Alt+PageDown | 2206 |

    Scenario Outline: Keyboard activation chooses a year and month
      Given a calendar starting at "2026-01-15" with start view "multi-year"
      When the calendar renders
      And the user focuses the active date
      And the user presses "<key>" in the calendar
      Then the "Next year" navigation button is visible
      When the user presses "<key>" in the calendar
      Then the calendar shows the period "Jan 2026"

      Examples:
        | key   |
        | Enter |
        | Space |

  Rule: Navigation works with and without animation

    Scenario Outline: Animated navigation reaches the requested month
      Given a calendar starting at "2026-01-15"
      And normal calendar motion is enabled
      When the calendar renders
      And the user activates the "<button>" navigation button
      Then the calendar shows the period "<period>"
      And the calendar has finished sliding

      Examples:
        | button         | period   |
        | Previous month | Dec 2025 |
        | Next month     | Feb 2026 |

  Rule: Other views respect date limits

    Scenario Outline: Dates outside the allowed year are disabled
      Given a calendar starting at "2026-06-15" with dates limited to "2026-04-10" through "2026-08-20"
      And the calendar starts in "<view>" view
      When the calendar renders
      Then the "<previous>" navigation button is disabled
      And the "<next>" navigation button is disabled
      And the calendar grid item "<item>" is disabled
      When the user focuses the active date
      And the user presses "Home" in the calendar
      Then the calendar grid focuses "<first>"
      When the user presses "End" in the calendar
      Then the calendar grid focuses "<last>"

      Examples:
        | view       | previous          | next          | item | first | last   |
        | year       | Previous year     | Next year     | March | April | August |
        | multi-year | Previous 24 years | Next 24 years | 2025 | 2026  | 2026   |

  Rule: Applications can update the calendar after rendering

    Scenario: Changing the selected date updates the displayed period
      Given a calendar starting at "2026-01-15"
      When the calendar renders
      And the application sets the calendar attribute "date" to "2026-03-10"
      Then the selected date is "2026-03-10"
      And the calendar shows the period "Mar 2026"

    Scenario: Changing a range updates its selected end date
      Given a calendar starting at "2026-01-15"
      When the calendar renders
      And the application sets the calendar attribute "range-start" to "2026-02-10"
      Then the selected date is "2026-02-10"
      When the application sets the calendar attribute "range-end" to "2026-02-15"
      Then the selected range is "2026-02-10" through "2026-02-15"
      And the selected date is "2026-02-15"

    Scenario: Changing the start view resets the displayed view
      Given a calendar starting at "2026-01-15"
      When the calendar renders
      And the application sets the calendar attribute "start-view" to "year"
      Then the "Next year" navigation button is visible
      When the application sets the calendar attribute "start-view" to "bogus"
      Then the start view is "month"
      And the "Next month" navigation button is visible

    Scenario: Refreshing today's date updates the current-date indicator
      Given a calendar starting at "2026-01-15"
      And today's date is "2026-01-15"
      When the calendar renders
      Then the calendar marks "January 15, 2026" as today
      When the application refreshes today's date to "2026-01-16"
      Then the calendar marks "January 16, 2026" as today

  Rule: Navigation handles leap years and shorter months

    Scenario Outline: Moving to a shorter month clamps the active day
      Given a calendar starting at "<start>"
      When the calendar renders
      And the user focuses the active date
      And the user presses "<key>" in the calendar
      Then the calendar grid focuses "<date>"

      Examples:
        | start      | key          | date              |
        | 2026-01-31 | PageDown     | February 28, 2026 |
        | 2024-01-31 | PageDown     | February 29, 2024 |
        | 2024-02-29 | Alt+PageDown | February 28, 2025 |
        | 2026-03-31 | PageUp       | February 28, 2026 |
