Feature: Date input
  Date inputs expose editable date and time segments and participate in forms.

  Rule: Segments describe the selected date and time

    Scenario: Date segments support custom accessible labels
      Given a date input with custom date segment labels
      When the date input renders
      Then the date input group is visible
      And the date segment "Month of year" is visible
      And the date segment "Day of month" is visible
      And the date segment "Calendar year" is visible

    Scenario: Date, time, and datetime modes expose their segments
      Given date, 24-hour time with seconds, and 24-hour datetime inputs
      When the date input renders
      Then the number of "Month" date segments is 2
      And the number of "Day" date segments is 2
      And the number of "Year" date segments is 2
      And the number of "Hour" date segments is 2
      And the number of "Minute" date segments is 2
      And the number of "Second" date segments is 1
      And the number of "Period" date segments is 0

    Scenario: An unsupported type falls back to date
      Given a date input with an unsupported type
      When the date input renders
      Then the effective date input type is "date"
      And the date segment "Month" is visible
      And the number of "Hour" date segments is 0

    Scenario: Date segments expose values, limits, and a month name
      Given a date input with local date "2024-02-29"
      When the date input renders
      Then date segment "Month" exposes value "2" from "1" to "12"
      And date segment "Month" exposes value text "February"
      And date segment "Day" exposes value "29" from "1" to "29"
      And date segment "Year" exposes value "2024" from "1" to "9999"

    Scenario: Twelve-hour time exposes a period segment
      Given a 12-hour time input with a local afternoon value
      When the date input renders
      Then the date segment "Period" is visible
      And date segment "Period" exposes value "1" from "0" to "1"

    Scenario: Changing time format and seconds updates the segments
      Given a 12-hour time input with a local afternoon value
      When the date input renders
      And the user focuses the "Hour" date segment
      And the application sets date input attribute "time-format" to "24"
      Then the number of "Period" date segments is 0
      And the "Hour" date segment has focus
      When the application sets date input attribute "show-seconds" to ""
      Then the date segment "Second" is visible
      When the application removes date input attribute "show-seconds"
      And the application sets date input attribute "time-format" to "12"
      Then the number of "Second" date segments is 0
      And the date segment "Period" is visible
      And the date input value has not changed

    Scenario: Changing datetime configuration updates time segments
      Given a datetime input with a local afternoon value
      When the date input renders
      And the application sets date input attribute "time-format" to "24"
      And the application sets date input attribute "show-seconds" to ""
      Then the date segment "Month" is visible
      And the date segment "Second" is visible
      And the number of "Period" date segments is 0
      And the date input value has not changed

  Rule: Users can edit and navigate segments

    Scenario: ArrowUp updates a time value and emits ordered events
      Given a 24-hour time input with seconds and a preset value
      When the date input renders
      And the application observes date input events
      And the user focuses the "Hour" date segment
      And the user presses "ArrowUp" in the date input
      Then the hour segment has increased by one
      When the user leaves the date input
      Then the date input value has increased by one hour
      And the date input events are "beforeinput, input, change"

    Scenario: A read-only input keeps its value
      Given a read-only 24-hour time input with seconds and a preset value
      When the date input renders
      Then the "Hour" date segment is read-only
      When the user focuses the "Hour" date segment
      And the user presses "ArrowUp" in the date input
      Then the hour segment has not changed
      And the date input value is "2024-01-15T10:30:00.000Z"

    Scenario: Read-only segments remain navigable without emitting edits
      Given a read-only 24-hour time input with seconds and a preset value
      When the date input renders
      And the application observes date input events
      And the user focuses the "Hour" date segment
      And the user presses "ArrowRight" in the date input
      Then the "Minute" date segment has focus
      When the user presses "Delete" in the date input
      And the user leaves the date input
      Then the date input value is "2024-01-15T10:30:00.000Z"
      And the date input events are ""

    Scenario: Disabled segments are not editable or keyboard focusable
      Given a disabled 24-hour time input with seconds and a preset value
      When the date input renders
      Then the "Hour" date segment is disabled and not keyboard focusable
      When the application observes date input events
      And the user tabs past the date input
      Then the control after the date input has focus
      And the date input value is "2024-01-15T10:30:00.000Z"
      And the date input events are ""

    Scenario: Arrow keys move between date segments
      Given a date input with local date "2024-02-29"
      When the date input renders
      And the user focuses the "Month" date segment
      And the user presses "ArrowRight" in the date input
      Then the "Day" date segment has focus
      When the user presses "ArrowLeft" in the date input
      Then the "Month" date segment has focus

    Scenario: Home and End select the segment limits
      Given a date input with local date "2024-02-29"
      When the date input renders
      And the user focuses the "Month" date segment
      And the user presses "Home" in the date input
      Then date segment "Month" exposes value "1" from "1" to "12"
      When the user presses "End" in the date input
      Then date segment "Month" exposes value "12" from "1" to "12"

    Scenario: A 24-hour input can cross noon and wrap at midnight
      Given a 24-hour time input with a local afternoon value
      When the date input renders
      And the user focuses the "Hour" date segment
      And the user presses "Home" in the date input
      Then date segment "Hour" exposes value "0" from "0" to "23"
      When the user presses "End" in the date input
      Then date segment "Hour" exposes value "23" from "0" to "23"
      When the user presses "ArrowUp" in the date input
      Then date segment "Hour" exposes value "0" from "0" to "23"

    Scenario: A 12-hour input switches between morning and afternoon
      Given a 12-hour time input with a local morning value
      When the date input renders
      And the user focuses the "Period" date segment
      And the user presses "ArrowUp" in the date input
      Then date segment "Period" exposes value "1" from "0" to "1"
      And the date input local hour is 22
      When the user presses "ArrowDown" in the date input
      Then date segment "Period" exposes value "0" from "0" to "1"
      And the date input local hour is 10

    Scenario: Canceling beforeinput prevents an arrow-key edit
      Given a 24-hour time input with seconds and a preset value
      When the date input renders
      And the application cancels date input beforeinput
      And the user focuses the "Hour" date segment
      And the user presses "ArrowUp" in the date input
      And the user leaves the date input
      Then the hour segment has not changed
      And the date input value is "2024-01-15T10:30:00.000Z"
      And the date input events are "beforeinput"

    Scenario: Typing a complete hour commits once when moving to the next segment
      Given a 24-hour time input with local morning value and seconds
      When the date input renders
      And the application observes date input events
      And the user focuses the "Hour" date segment
      And the user types "12" in the date input
      Then the "Minute" date segment has focus
      And date segment "Hour" exposes value "12" from "0" to "23"
      When the user leaves the date input
      Then the date input local hour is 12
      And the date input events are "beforeinput, input, change"

    Scenario: Canceling beforeinput prevents a typed hour from committing
      Given a 24-hour time input with local morning value and seconds
      When the date input renders
      And the application cancels date input beforeinput
      And the user focuses the "Hour" date segment
      And the user types "12" in the date input
      And the user leaves the date input
      Then the date input value has not changed
      And the date input events are "beforeinput"

  Rule: Values participate in form submission and validation

    Scenario: A date input submits its ISO value
      Given a date input named "start" with a preset value in a form
      When the date input renders
      Then the schedule form includes "start" with value "2024-01-15T10:30:00.000Z"

    Scenario: Disabling excludes a value and reenabling restores it
      Given a date input named "start" with a preset value in a form
      When the date input renders
      And the application sets date input attribute "disabled" to ""
      Then the schedule form has no values
      When the application removes date input attribute "disabled"
      Then the schedule form includes "start" with value "2024-01-15T10:30:00.000Z"

    Scenario: Reset restores the initial date value
      Given a date input named "start" with a preset value in a form
      When the date input renders
      And the application sets the date input value to "2025-03-20"
      And the user resets the schedule form
      Then the date input value is "2024-01-15T10:30:00.000Z"
      And the schedule form includes "start" with value "2024-01-15T10:30:00.000Z"

    Scenario: A required empty date input fails validation when touched
      Given a required empty date input in a form
      When the date input renders
      And the user focuses the "Month" date segment
      And the user leaves the date input
      Then the date input reports a missing value
      When the application sets the date input value to "2024-02-29"
      Then the date input is valid

    Scenario: Date limits reject dates outside the allowed range
      Given a date input with date limits in a form
      When the date input renders
      And the user focuses the "Month" date segment
      And the user leaves the date input
      Then the date input reports a range underflow
      When the application sets the date input value to "2024-04-15"
      Then the date input reports a range overflow
      When the application sets the date input value to "2024-02-29"
      Then the date input is valid

  Rule: Date inputs retain behavior when moved in the DOM

    Scenario: A moved date input retains accessible segments and emits one edit sequence
      Given a 24-hour time input with seconds and a preset value
      When the date input renders
      And the application observes date input events
      And the application moves the date input to a new DOM parent
      Then the date input is in the new DOM parent
      And the date segment "Hour" is visible
      And the date segment "Minute" is visible
      And the date segment "Second" is visible
      When the user focuses the "Hour" date segment
      And the user presses "ArrowUp" in the date input
      And the user leaves the date input
      Then the date input value has increased by one hour
      And the date input events are "beforeinput, input, change"

    Scenario: A moved read-only input still prevents editing
      Given a read-only 24-hour time input with seconds and a preset value
      When the date input renders
      And the application observes date input events
      And the application moves the date input to a new DOM parent
      Then the "Hour" date segment is read-only
      When the user focuses the "Hour" date segment
      And the user presses "ArrowUp" in the date input
      And the user leaves the date input
      Then the date input value is "2024-01-15T10:30:00.000Z"
      And the date input events are ""

    Scenario: A moved disabled input remains excluded from keyboard focus
      Given a disabled 24-hour time input with seconds and a preset value
      When the date input renders
      And the application observes date input events
      And the application moves the date input to a new DOM parent
      Then the "Hour" date segment is disabled and not keyboard focusable
      When the user tabs past the date input
      Then the control after the date input has focus
      And the date input value is "2024-01-15T10:30:00.000Z"
      And the date input events are ""

    Scenario: Moving between forms transfers date input ownership
      Given a date input named "start" with a destination form
      When the date input renders
      Then the schedule form includes "start" with value "2024-01-15T10:30:00.000Z"
      When the application moves the date input to the destination form
      Then the schedule form has no values
      And the destination form includes "start" with value "2024-01-15T10:30:00.000Z"

  Rule: Partial edits and clearing preserve event and validation behavior

    Scenario: Blurring commits a partially typed segment with ordered events
      Given a 24-hour time input with local morning value and seconds
      When the date input renders
      And the application observes date input events
      And the user focuses the "Hour" date segment
      And the user types "1" in the date input
      And the user leaves the date input
      Then the date input local hour is 1
      And the date input events are "beforeinput, input, change"

    Scenario: Canceling a partial segment on blur restores the old value
      Given a 24-hour time input with local morning value and seconds
      When the date input renders
      And the application cancels date input beforeinput
      And the user focuses the "Hour" date segment
      And the user types "1" in the date input
      And the user leaves the date input
      Then the date input value has not changed
      And the date input events are "beforeinput"

    Scenario: An arrow key adjusts a partially typed segment after committing it
      Given a 24-hour time input with local morning value and seconds
      When the date input renders
      And the application observes date input events
      And the user focuses the "Hour" date segment
      And the user types "1" in the date input
      And the user presses "ArrowUp" in the date input
      And the user leaves the date input
      Then the date input local hour is 2
      And the date input events are "beforeinput, input, beforeinput, input, change"

    Scenario: Canceling edits prevents both a partial commit and an arrow adjustment
      Given a 24-hour time input with local morning value and seconds
      When the date input renders
      And the application cancels date input beforeinput
      And the user focuses the "Hour" date segment
      And the user types "1" in the date input
      And the user presses "ArrowUp" in the date input
      And the user leaves the date input
      Then the date input value has not changed
      And the date input events are "beforeinput, beforeinput"

    Scenario: Focusing and leaving without an edit preserves fractional seconds
      Given a date input with fractional seconds
      When the date input renders
      And the application observes date input events
      And the user focuses the "Month" date segment
      And the user leaves the date input
      Then the date input value has not changed
      And the date input events are ""

    Scenario: Deleting a date segment produces an incomplete value until restored
      Given a required date input with local date "2024-02-29" in a form
      When the date input renders
      And the application observes date input events
      And the user focuses the "Month" date segment
      And the user presses "Delete" in the date input
      Then the "Month" date segment has no value
      And the date input has no value
      And the schedule form has no values
      When the user leaves the date input
      Then the date input reports an incomplete value
      And the date input events are "beforeinput, input, change"
      When the application sets the date input value to "2024-02-29"
      Then the date input is valid

    Scenario: Backspace in an empty segment moves to the previous segment
      Given a date input with local date "2024-02-29"
      When the date input renders
      And the user focuses the "Day" date segment
      And the user presses "Backspace" in the date input
      Then the "Day" date segment has no value
      When the user presses "Backspace" in the date input
      Then the "Month" date segment has focus

    Scenario: Clearing all required date segments reports a missing value
      Given a required date input with local date "2024-02-29" in a form
      When the date input renders
      And the user focuses the "Month" date segment
      And the user presses "Delete" in the date input
      And the user focuses the "Day" date segment
      And the user presses "Delete" in the date input
      And the user focuses the "Year" date segment
      And the user presses "Delete" in the date input
      And the user leaves the date input
      Then the date input has no value
      And the date input reports a missing value

    Scenario: Canceling a delete restores the complete date
      Given a date input with local date "2024-02-29"
      When the date input renders
      And the application cancels date input beforeinput
      And the user focuses the "Month" date segment
      And the user presses "Delete" in the date input
      And the user leaves the date input
      Then date segment "Month" exposes value "2" from "1" to "12"
      And the date input value has not changed
      And the date input events are "beforeinput"

  Rule: Date and time boundaries remain valid

    Scenario Outline: Changing month clamps the day to the destination month
      Given a date input with local date "<initial>"
      When the date input renders
      And the user focuses the "Month" date segment
      And the user presses "ArrowDown" in the date input
      Then date segment "Month" exposes value "2" from "1" to "12"
      And date segment "Day" exposes value "<day>" from "1" to "<day>"
      And the date input local date is "<expected>"

      Examples:
        | initial    | day | expected   |
        | 2024-03-31 | 29  | 2024-02-29 |
        | 2023-03-31 | 28  | 2023-02-28 |

    Scenario: Changing a leap year clamps February 29
      Given a date input with local date "2024-02-29"
      When the date input renders
      And the user focuses the "Year" date segment
      And the user presses "ArrowDown" in the date input
      Then date segment "Day" exposes value "28" from "1" to "28"
      And the date input local date is "2023-02-28"

    Scenario: The period segment switches between noon and midnight on the same day
      Given a 12-hour time input set to local noon
      When the date input renders
      And the user focuses the "Period" date segment
      And the user presses "ArrowDown" in the date input
      Then the date input local hour is 0
      And the date input local date is "2024-01-15"
      When the user presses "ArrowUp" in the date input
      Then the date input local hour is 12
      And the date input local date is "2024-01-15"

    Scenario: Typing a 12-hour noon hour keeps the afternoon period
      Given a 12-hour time input with a local afternoon value
      When the date input renders
      And the user focuses the "Hour" date segment
      And the user types "12" in the date input
      And the user leaves the date input
      Then the date input local hour is 12
      And the date input local date is "2024-01-15"

    Scenario: Page keys wrap by five within the hour segment
      Given a 24-hour time input set to local 22:30
      When the date input renders
      And the user focuses the "Hour" date segment
      And the user presses "PageUp" in the date input
      Then date segment "Hour" exposes value "3" from "0" to "23"
      When the user presses "PageDown" in the date input
      Then date segment "Hour" exposes value "22" from "0" to "23"

    Scenario: The mouse wheel adjusts a focused minute segment
      Given a 24-hour time input with local morning value and seconds
      When the date input renders
      And the application observes date input events
      And the user focuses the "Minute" date segment
      And the user scrolls down over the "Minute" date segment
      Then date segment "Minute" exposes value "29" from "0" to "59"
      When the user scrolls up over the "Minute" date segment
      Then date segment "Minute" exposes value "30" from "0" to "59"
      When the user leaves the date input
      Then the date input events are "beforeinput, input, beforeinput, input, change"

  Rule: Date and time constraints include blackout predicates

    Scenario: Time limits reject values outside their inclusive bounds
      Given a 24-hour time input with time limits in a form
      When the date input renders
      And the user focuses the "Hour" date segment
      And the user leaves the date input
      Then the date input reports a range underflow
      When the application sets the date input value to "2024-01-15T17:31:00"
      Then the date input reports a range overflow
      When the application sets the date input value to "2024-01-15T08:15:00"
      Then the date input is valid
      When the application sets the date input value to "2024-01-15T17:30:00"
      Then the date input is valid

    Scenario: A blackout date invalidates a date and allows other dates
      Given a date input with a blackout date in a form
      When the date input renders
      And the application installs the blackout date predicate
      And the user focuses the "Month" date segment
      And the user leaves the date input
      Then the date input reports a blackout error
      When the application sets the date input value to "2024-02-28"
      Then the date input is valid

    Scenario: A blackout time invalidates a time and allows other times
      Given a 24-hour time input with a blackout time in a form
      When the date input renders
      And the application installs the blackout time predicate
      And the user focuses the "Hour" date segment
      And the user leaves the date input
      Then the date input reports a blackout error
      When the application sets the date input value to "2024-01-15T10:30:00"
      Then the date input is valid

    Scenario: Datetime validation checks both date and time blackout predicates
      Given a datetime input with blackout constraints in a form
      When the date input renders
      And the application installs the blackout date predicate
      And the application installs the blackout time predicate
      And the user focuses the "Month" date segment
      And the user leaves the date input
      Then the date input reports a blackout error
      When the application sets the date input value to "2024-02-28T07:30:00"
      Then the date input reports a blackout error
      When the application sets the date input value to "2024-02-28T10:30:00"
      Then the date input is valid

  Rule: Date inputs integrate with forms and form fields

    Scenario: Invalid submission is blocked until the date is corrected
      Given a required empty date input with a submit button
      When the date input renders
      And the application observes schedule form submissions and invalid events
      And the user focuses the "Month" date segment
      And the user leaves the date input
      And the user submits the schedule form
      Then the schedule form has 0 submissions
      And the date input has 1 invalid event
      When the application sets the date input value to "2024-02-29"
      And the user submits the schedule form
      Then the schedule form has 1 submissions
      And the date input has 1 invalid event
      And the submitted schedule form contains the date input value as "start"

    Scenario: A disabled fieldset disables the date input until reenabled
      Given a date input with a preset value inside a disabled fieldset
      When the date input renders
      And the application observes date input events
      Then the "Month" date segment is disabled and not keyboard focusable
      And the schedule form has no values
      When the user scrolls up over the "Month" date segment
      Then the date input value has not changed
      And the date input events are ""
      When the application enables the date input fieldset
      Then the "Month" date segment is keyboard focusable
      And the schedule form includes "start" with value "2024-01-15T10:30:00.000Z"
      When the user focuses the "Month" date segment
      And the user presses "ArrowUp" in the date input
      Then the date input value has changed

    Scenario: Disabling a focused input prevents keyboard edits
      Given a 24-hour time input with seconds and a preset value
      When the date input renders
      And the application observes date input events
      And the user focuses the "Hour" date segment
      And the application sets date input attribute "disabled" to ""
      And the user presses "ArrowUp" in the date input
      Then the date input value has not changed
      And the date input events are ""

    Scenario: Reset restores a partially cleared date and its validation state
      Given a required date input with a local date and a reset button
      When the date input renders
      And the user focuses the "Month" date segment
      And the user presses "Delete" in the date input
      And the user leaves the date input
      Then the date input reports an incomplete value
      And the schedule form has no values
      When the user resets the schedule form
      Then the date input local date is "2024-02-29"
      And date segment "Month" exposes value "2" from "1" to "12"
      And date segment "Day" exposes value "29" from "1" to "29"
      And date segment "Year" exposes value "2024" from "1" to "9999"
      And the schedule form contains the date input value as "start"
      And the date input is valid and untouched

    Scenario: A read-only date input is submitted but cannot be edited
      Given a read-only date input with a preset value in a form
      When the date input renders
      Then the "Month" date segment is read-only
      And the schedule form includes "start" with value "2024-01-15T10:30:00.000Z"
      When the user focuses the "Month" date segment
      And the user presses "ArrowUp" in the date input
      And the user leaves the date input
      Then the date input value has not changed
      And the schedule form includes "start" with value "2024-01-15T10:30:00.000Z"

    Scenario: An external date input belongs to the form named by its form attribute
      Given a date input associated with an external schedule form
      When the date input renders
      Then the date input belongs to the schedule form
      And the schedule form includes "start" with value "2024-01-15T10:30:00.000Z"

    Scenario: A form field exposes a date input label, hint, and validation error
      Given a required date input in a labeled form field with a hint and error
      When the date input renders
      Then the date input has accessible name "Appointment date"
      And the date input is described by "Enter a date"
      When the user focuses the "Month" date segment
      And the user leaves the date input
      Then the date input is exposed as invalid
      And the date input is described by "A date is required"
      And the date input form field shows the error

  Rule: Date strings preserve their documented meaning

    Scenario Outline: Local date strings retain their calendar and clock fields
      Given a datetime input with date string "<value>"
      When the date input renders
      Then the date input local date is "2024-02-29"
      And the date input local time is "<time>"

      Examples:
        | value                   | time         |
        | 2024-02-29              | 00:00:00.000 |
        | 2024-02-29T13:45:12     | 13:45:12.000 |
        | 2024-02-29T13:45:12.123 | 13:45:12.123 |

    Scenario Outline: Timestamp strings represent an instant
      Given a datetime input with date string "<value>"
      When the date input renders
      Then the date input value is "<instant>"

      Examples:
        | value                             | instant                  |
        | 2024-02-29T13:45:12Z              | 2024-02-29T13:45:12.000Z |
        | 2024-02-29T13:45:12.123Z          | 2024-02-29T13:45:12.123Z |
        | 2024-02-29T13:45:12+05:30         | 2024-02-29T08:15:12.000Z |
        | 2024-02-29T13:45:12.123-04:00     | 2024-02-29T17:45:12.123Z |

    Scenario Outline: Unrecognized date strings have no value
      Given a datetime input with date string "<value>"
      When the date input renders
      Then the date input has no value

      Examples:
        | value                    |
        | not-a-date               |
        | 2024-02-29T13:45         |
        | 2024-02-29T13:45:12.12Z  |

  Rule: Incomplete time and datetime values can be restored

    Scenario Outline: Clearing and reentering a required segment restores the form value
      Given a required "<type>" input with seconds in "<format>" format in a form
      When the date input renders
      And the application observes date input events
      And the user focuses the "<segment>" date segment
      And the user presses "Delete" in the date input
      Then the "<segment>" date segment has no value
      And the date input has no value
      And the schedule form has no values
      When the user leaves the date input
      Then the date input reports an incomplete value
      When the user focuses the "<segment>" date segment
      And the user types "<digits>" in the date input
      And the user leaves the date input
      Then the date input is valid
      And the date input value has not changed
      And the schedule form contains the date input value as "start"
      And the date input events are "beforeinput, input, change, beforeinput, input, change"

      Examples:
        | type     | format | segment | digits |
        | time     | 24     | Minute  | 30     |
        | time     | 24     | Second  | 45     |
        | time     | 12     | Period  | a      |
        | datetime | 24     | Day     | 15     |
        | datetime | 24     | Second  | 45     |
        | datetime | 12     | Period  | a      |

    Scenario: Clearing all required time segments reports a missing value
      Given a required "time" input with seconds in "24" format in a form
      When the date input renders
      And the user focuses the "Hour" date segment
      And the user presses "Delete" in the date input
      And the user focuses the "Minute" date segment
      And the user presses "Delete" in the date input
      And the user focuses the "Second" date segment
      And the user presses "Delete" in the date input
      And the user leaves the date input
      Then the date input has no value
      And the date input reports a missing value
      When the application sets the date input value to "2024-01-15T10:30:45"
      Then the date input is valid

    Scenario: Clearing all required datetime segments reports a missing value
      Given a required "datetime" input with seconds in "24" format in a form
      When the date input renders
      And the user focuses the "Month" date segment
      And the user presses "Delete" in the date input
      And the user focuses the "Day" date segment
      And the user presses "Delete" in the date input
      And the user focuses the "Year" date segment
      And the user presses "Delete" in the date input
      And the user focuses the "Hour" date segment
      And the user presses "Delete" in the date input
      And the user focuses the "Minute" date segment
      And the user presses "Delete" in the date input
      And the user focuses the "Second" date segment
      And the user presses "Delete" in the date input
      And the user leaves the date input
      Then the date input has no value
      And the date input reports a missing value
      When the application sets the date input value to "2024-01-15T10:30:45"
      Then the date input is valid

  Rule: Period letters switch between morning and afternoon

    Scenario: Typing period letters switches noon and midnight on the same day
      Given a 12-hour time input set to local noon
      When the date input renders
      And the application observes date input events
      And the user focuses the "Period" date segment
      And the user types "a" in the date input
      And the user leaves the date input
      Then the date input local hour is 0
      And the date input local date is "2024-01-15"
      When the user focuses the "Period" date segment
      And the user types "P" in the date input
      And the user leaves the date input
      Then the date input local hour is 12
      And the date input local date is "2024-01-15"
      And the date input events are "beforeinput, input, change, beforeinput, input, change"

    Scenario: Canceling a typed period change preserves the original time
      Given a 12-hour time input set to local noon
      When the date input renders
      And the application cancels date input beforeinput
      And the user focuses the "Period" date segment
      And the user types "a" in the date input
      And the user leaves the date input
      Then the date input value has not changed
      And the date input events are "beforeinput"

  Rule: Time limits include seconds

    Scenario: Time values immediately outside second-level bounds are invalid
      Given a 24-hour time input with second-level limits in a form
      When the date input renders
      And the user focuses the "Hour" date segment
      And the user leaves the date input
      Then the date input reports a range underflow
      When the application sets the date input value to "2024-01-15T08:15:30"
      Then the date input is valid
      When the application sets the date input value to "2024-01-15T08:15:31"
      Then the date input is valid
      When the application sets the date input value to "2024-01-15T17:30:44"
      Then the date input is valid
      When the application sets the date input value to "2024-01-15T17:30:45"
      Then the date input is valid
      When the application sets the date input value to "2024-01-15T17:30:46"
      Then the date input reports a range overflow
