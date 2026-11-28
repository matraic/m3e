Feature: Timepicker
  Timepickers provide accessible controls for selecting and confirming a time.

  Rule: A timepicker opens with accessible controls

    Scenario: Opening exposes the dialog, actions, and expanded trigger
      Given a standard timepicker
      When the timepicker renders
      And the application opens the timepicker
      Then the timepicker trigger is expanded
      And the timepicker dialog is named "Choose a time"
      And timepicker action "OK" is visible
      And timepicker action "Cancel" is visible
      And the timepicker header is "Edit time"

    Scenario: Input fields have accessible names, values, and ranges
      Given a standard timepicker
      When the timepicker renders
      And the application opens the timepicker
      Then timepicker field "Hour" has value "14"
      And timepicker field "Hour" has spinbutton range "0" to "23"
      And timepicker field "Minute" has value "30"
      And timepicker field "Minute" has spinbutton range "0" to "59"
      And the timepicker has no period control

    Scenario: A 12-hour time exposes its selected period
      Given a 12-hour timepicker
      When the timepicker renders
      And the application opens the timepicker
      Then timepicker field "Hour" has value "02"
      And the timepicker radio "PM" is checked
      And the timepicker radio "AM" is not checked

    Scenario: Seconds are exposed when requested
      Given a timepicker with seconds
      When the timepicker renders
      And the application opens the timepicker
      Then timepicker field "Second" has value "00"
      And timepicker field "Second" has spinbutton range "0" to "59"

    Scenario: An empty seconds field disables confirmation
      Given a timepicker with seconds
      When the timepicker renders
      And the application opens the timepicker
      And the user presses "Backspace" in timepicker field "Second"
      Then the timepicker confirm action is disabled

    Scenario: Custom labels are exposed by their controls
      Given a timepicker with custom labels
      When the timepicker renders
      And the application opens the timepicker
      Then timepicker action "Apply" is visible
      And timepicker action "Close" is visible
      And the timepicker header is "Type time"
      And timepicker field "HH" is visible
      And timepicker field "MM" is visible

    Scenario: The mode toggle describes and changes the active mode
      Given a dial timepicker
      When the timepicker renders
      And the application opens the timepicker
      Then the timepicker header is "Select time"
      And the timepicker mode toggle controls the dial
      And the timepicker mode toggle has expanded state "true"
      When the user toggles the timepicker mode
      Then the timepicker header is "Edit time"
      And the timepicker mode toggle has expanded state "false"

    Scenario: Hiding the mode toggle removes that control
      Given a timepicker with the mode toggle hidden
      When the timepicker renders
      And the application opens the timepicker
      Then the timepicker mode toggle is absent

  Rule: Time selection can be edited, committed, or discarded

    Scenario: Confirming commits an edited time and emits change
      Given a standard timepicker
      When the timepicker renders
      And the application observes timepicker changes
      And the application opens the timepicker
      And the user presses "PageUp" in timepicker field "Minute"
      Then the timepicker time is "14:30:00"
      When the user activates timepicker action "OK"
      Then the timepicker time is "14:35:00"
      And the timepicker trigger is collapsed
      And the timepicker dispatches 1 change event

    Scenario: Canceling discards an edited time
      Given a standard timepicker
      When the timepicker renders
      And the application observes timepicker changes
      And the application opens the timepicker
      And the user presses "ArrowUp" in timepicker field "Hour"
      When the user activates timepicker action "Cancel"
      Then the timepicker time is "14:30:00"
      And the timepicker dispatches 0 change events
      And the timepicker trigger is collapsed

    Scenario: Arrow keys adjust a field and Backspace clears it
      Given a standard timepicker
      When the timepicker renders
      And the application opens the timepicker
      And the user presses "ArrowUp" in timepicker field "Minute"
      Then timepicker field "Minute" has value "31"
      When the user presses "ArrowDown" in timepicker field "Minute"
      And the user presses "ArrowDown" in timepicker field "Minute"
      Then timepicker field "Minute" has value "29"
      When the user presses "Backspace" in timepicker field "Minute"
      Then timepicker field "Minute" has value ""

    Scenario: Non-digit input is ignored while digits are accepted
      Given a standard timepicker
      When the timepicker renders
      And the application opens the timepicker
      And the user presses "x" in timepicker field "Minute"
      Then timepicker field "Minute" has value "30"
      When the user presses "5" in timepicker field "Minute"
      Then timepicker field "Minute" has value "05"

    Scenario Outline: Typing into an empty field normalizes the value
      Given a standard timepicker
      When the timepicker renders
      And the application opens the timepicker
      And the user clears timepicker field "<field>"
      And the user types "<typed>" into timepicker field "<field>"
      Then timepicker field "<field>" has value "<expected>"

      Examples:
        | field  | typed | expected |
        | Hour   | 10    | 10       |
        | Hour   | 07    | 07       |
        | Hour   | 25    | 05       |
        | Minute | 59    | 59       |
        | Minute | 75    | 05       |
        | Minute | 5     | 05       |

    Scenario: Filling a field sets a bounded whole value
      Given a standard timepicker
      When the timepicker renders
      And the application opens the timepicker
      And the user fills timepicker field "Hour" with "10"
      And the user fills timepicker field "Minute" with "45"
      Then timepicker field "Hour" has value "10"
      And timepicker field "Minute" has value "45"
      When the user fills timepicker field "Hour" with "99"
      Then timepicker field "Hour" has value "09"

    Scenario: Typing a digit into a populated field replaces its value
      Given a standard timepicker
      When the timepicker renders
      And the application opens the timepicker
      And the user presses "End" in timepicker field "Minute"
      And the user presses "3" in timepicker field "Minute"
      Then timepicker field "Minute" has value "03"

    Scenario: The period control changes AM and PM
      Given a 12-hour timepicker
      When the timepicker renders
      And the application observes timepicker changes
      And the application opens the timepicker
      And the user activates timepicker radio "AM"
      When the user activates timepicker action "OK"
      Then the timepicker time is "02:30:00"
      And the timepicker dispatches 1 change event

    Scenario: An empty field disables confirmation
      Given a standard timepicker
      When the timepicker renders
      And the application opens the timepicker
      And the user presses "Backspace" in timepicker field "Hour"
      Then the timepicker confirm action is disabled

    Scenario: Times before the minimum disable confirmation
      Given a timepicker with minimum time "09:00"
      When the timepicker renders
      And the application opens the timepicker
      Then the timepicker confirm action is enabled
      When the user replaces timepicker field "Hour" with "08"
      Then the timepicker confirm action is disabled
      When the user replaces timepicker field "Hour" with "10"
      Then the timepicker confirm action is enabled

    Scenario: Times after the maximum disable confirmation
      Given a timepicker with maximum time "15:00"
      When the timepicker renders
      And the application opens the timepicker
      When the user replaces timepicker field "Hour" with "16"
      Then the timepicker confirm action is disabled

    Scenario: The maximum time is inclusive
      Given a timepicker with maximum time "15:00"
      When the timepicker renders
      And the application opens the timepicker
      And the user replaces timepicker field "Minute" with "00"
      And the user replaces timepicker field "Hour" with "15"
      Then the timepicker confirm action is enabled
      When the user replaces timepicker field "Minute" with "01"
      Then the timepicker confirm action is disabled

    Scenario: Blackout times disable confirmation
      Given a standard timepicker
      When the timepicker renders
      And the application blacks out timepicker hour "9"
      And the application opens the timepicker
      When the user replaces timepicker field "Hour" with "09"
      Then the timepicker confirm action is disabled
      When the user replaces timepicker field "Hour" with "10"
      Then the timepicker confirm action is enabled

    Scenario: The dial selects an hour and minute
      Given a dial timepicker
      When the timepicker renders
      And the application opens the timepicker
      And the user selects hour "3" on the timepicker dial
      Then the timepicker dial is on the "minute" view
      When the user selects minute "35" on the timepicker dial
      Then the timepicker time is "14:30:00"
      When the user activates timepicker action "OK"
      Then the timepicker time is "03:35:00"

    Scenario: The dial advances through hour, minute, and second views
      Given a dial timepicker with seconds
      When the timepicker renders
      And the application opens the timepicker
      And the user selects hour "3" on the timepicker dial
      Then the timepicker dial is on the "minute" view
      When the user selects minute "35" on the timepicker dial
      Then the timepicker dial is on the "second" view
      When the user selects second "45" on the timepicker dial
      And the user activates timepicker action "OK"
      Then the timepicker time is "03:35:45"

  Rule: Timepickers integrate with triggers and date inputs

    Scenario: The public toggle opens and closes the picker
      Given a standard timepicker
      When the timepicker renders
      And the application toggles the timepicker
      Then the timepicker trigger is expanded
      When the application toggles the timepicker
      Then the timepicker trigger is collapsed

    Scenario: The timepicker toggle exposes dialog semantics
      Given a timepicker with a toggle
      When the timepicker renders
      Then the timepicker trigger has a dialog popup
      When the user clicks the timepicker trigger
      Then the timepicker trigger is expanded
      And the timepicker dialog is named "Choose a time"
      When the user clicks the timepicker trigger
      Then the timepicker trigger is collapsed

    Scenario: Confirming updates the associated time-enabled date input
      Given a timepicker associated with a time-enabled date input
      When the timepicker renders
      And the application observes timepicker and date input changes
      And the application opens the timepicker
      And the user presses "PageUp" in timepicker field "Minute"
      When the user activates timepicker action "OK"
      Then the timepicker time is "14:35:00"
      And the associated date input time is "14:35:00"
      And the timepicker dispatches 1 change event
      And the timepicker's date input dispatches 1 change event

    Scenario: Confirming an unchanged time does not change the date input
      Given a timepicker associated with a time-enabled date input
      When the timepicker renders
      And the application observes timepicker and date input changes
      And the application opens the timepicker
      When the user activates timepicker action "OK"
      Then the associated date input time is "14:30:00"
      And the timepicker dispatches 1 change event
      And the timepicker's date input dispatches 0 change events

  Rule: Modal and docked pickers preserve accessible interaction

    Scenario: A modal picker is named, modal, and restores trigger focus on Escape
      Given a modal timepicker
      When the timepicker renders
      And the application opens the timepicker
      Then the timepicker is exposed as a modal dialog
      When the user presses "Escape" in the timepicker
      Then the timepicker trigger is collapsed
      And the timepicker trigger has focus

    Scenario: Modal focus remains contained when tabbing in either direction
      Given a modal timepicker
      When the timepicker renders
      And the application opens the timepicker
      When the user tabs through the timepicker in both directions
      Then focus remains inside the timepicker

    Scenario: Hiding restores focus to the trigger
      Given a standard timepicker
      When the timepicker renders
      And the application opens the timepicker
      And the application hides the timepicker and restores focus
      Then the timepicker trigger has focus
      And the timepicker trigger is collapsed
      And the timepicker is closed

    Scenario: Clicking outside closes a docked picker
      Given a standard timepicker
      When the timepicker renders
      And the application opens the timepicker
      And the user clicks outside the timepicker
      Then the timepicker trigger is collapsed
      And the timepicker is closed

    Scenario: An automatic picker responds to viewport changes
      Given an automatic timepicker
      When the timepicker renders
      And the application opens the timepicker
      When the timepicker viewport changes to 500 pixels wide
      Then the timepicker uses the "modal" variant
      And the timepicker uses the "vertical" orientation
      And the timepicker is exposed as a modal dialog
      When the timepicker viewport changes to 700 pixels wide
      Then the timepicker uses the "horizontal" orientation
      When the timepicker viewport changes to 1280 pixels wide
      Then the timepicker uses the "docked" variant
      And the timepicker uses the "vertical" orientation
      And the timepicker is not modal

    Scenario: Invalid attribute values fall back to valid defaults
      Given a timepicker with invalid options
      When the timepicker renders
      Then the timepicker options are "docked,vertical,12,dial"
