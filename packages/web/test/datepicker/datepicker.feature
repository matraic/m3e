Feature: Datepicker
  Datepickers present a calendar for choosing and confirming dates.

  Rule: A picker opens and commits or discards selections

    Scenario: Opening a docked picker exposes its calendar and actions
      Given a datepicker starting at "2026-01-15"
      When the datepicker renders
      And the application opens the datepicker
      Then the datepicker trigger is expanded
      And the datepicker shows the period "Jan 2026"
      And the datepicker action "Cancel" is visible
      And the datepicker action "OK" is visible

    Scenario: Confirming commits a pending date and emits change
      Given a datepicker with date "2026-01-15" starting at "2026-01-15"
      When the datepicker renders
      And the application observes datepicker changes
      And the application opens the datepicker
      And the user selects the date five days after the active date in the datepicker
      Then the datepicker date is "2026-01-15"
      When the user activates the datepicker action "OK"
      Then the datepicker date is "2026-01-20"
      And the datepicker trigger is collapsed
      And the datepicker dispatches 1 change event

    Scenario: Canceling discards a pending date
      Given a datepicker with date "2026-01-15" starting at "2026-01-15"
      When the datepicker renders
      And the application observes datepicker changes
      And the application opens the datepicker
      And the user selects the date five days after the active date in the datepicker
      And the user activates the datepicker action "Cancel"
      Then the datepicker date is "2026-01-15"
      And the datepicker trigger is collapsed
      And the datepicker dispatches 0 change event

    Scenario: Clearing removes the selected date and emits change
      Given a clearable datepicker with date "2026-01-15"
      When the datepicker renders
      And the application observes datepicker changes
      And the application opens the datepicker
      And the user activates the datepicker action "Clear"
      Then the datepicker has no date
      And the datepicker trigger is collapsed
      And the datepicker dispatches 1 change event

    Scenario: A modal picker closes on Escape and restores focus
      Given a modal datepicker starting at "2026-01-15"
      When the datepicker renders
      And the application opens the datepicker
      Then the datepicker is exposed as a modal dialog
      When the user presses "Escape" in the datepicker
      Then the datepicker trigger is collapsed
      And the datepicker trigger has focus

  Rule: Datepickers expose accessible controls

    Scenario: The toggle exposes dialog semantics and opens and closes the picker
      Given a datepicker with a toggle
      When the datepicker renders
      Then the datepicker trigger has a dialog popup
      When the user clicks the datepicker trigger
      Then the datepicker trigger is expanded
      And the datepicker dialog named "Choose a date" is visible
      And the datepicker calendar grid is visible
      When the user clicks the datepicker trigger
      Then the datepicker trigger is collapsed

    Scenario: Custom action and navigation labels are exposed
      Given a datepicker with custom labels
      When the datepicker renders
      And the application opens the datepicker
      Then the datepicker action "Apply date" is visible
      And the datepicker action "Discard date" is visible
      And the datepicker action "Remove date" is visible
      And the datepicker action "Earlier month" is visible
      And the datepicker action "Later month" is visible

    Scenario Outline: Custom navigation labels are exposed in each calendar view
      Given a datepicker with custom navigation labels in "<view>" view
      When the datepicker renders
      And the application opens the datepicker
      Then the datepicker action "<previous>" is visible
      And the datepicker action "<next>" is visible

      Examples:
        | view       | previous      | next         |
        | year       | Earlier year  | Later year   |
        | multi-year | Earlier years | Later years  |

  Rule: Datepicker configuration is applied to the calendar

    Scenario Outline: The picker opens in the configured calendar view
      Given a datepicker starting at "2026-01-15" in "<view>" view
      When the datepicker renders
      And the application opens the datepicker
      Then the datepicker action "<navigation>" is visible

      Examples:
        | view       | navigation    |
        | year       | Next year     |
        | multi-year | Next 24 years |

    Scenario: Date limits and blackout dates disable calendar dates
      Given a datepicker with date limits and a blackout date
      When the datepicker renders
      And the application blacks out January 15 in the datepicker
      And the application opens the datepicker
      Then datepicker date "January 9, 2026" is disabled
      And datepicker date "January 15, 2026" is disabled
      And datepicker date "January 20, 2026" is enabled
      And datepicker date "January 21, 2026" is disabled

    Scenario: Confirming a range commits both dates
      Given a datepicker with range start "2026-01-10"
      When the datepicker renders
      And the application observes datepicker changes
      And the application opens the datepicker
      And the user selects "January 15, 2026" in the datepicker
      And the user activates the datepicker action "OK"
      Then the datepicker range is "2026-01-10" through "2026-01-15"
      And the datepicker dispatches 1 change event

    Scenario: Clearing a range removes both dates
      Given a clearable datepicker with range "2026-01-10" through "2026-01-15"
      When the datepicker renders
      And the application observes datepicker changes
      And the application opens the datepicker
      And the user activates the datepicker action "Clear"
      Then the datepicker range is empty
      And the datepicker dispatches 1 change event

  Rule: A datepicker integrates with a date input

    Scenario: Confirming updates the associated date input
      Given a datepicker associated with a date input
      When the datepicker renders
      And the application observes datepicker and date input changes
      And the application opens the datepicker
      And the user selects the date five days after the active date in the datepicker
      And the user activates the datepicker action "OK"
      Then the datepicker date is "2026-01-20"
      And the associated date input date is "2026-01-20"
      And the datepicker dispatches 1 change event
      And the associated date input dispatches 1 change event

    Scenario: Clearing updates the associated date input
      Given a clearable datepicker associated with a date input
      When the datepicker renders
      And the application observes datepicker and date input changes
      And the application opens the datepicker
      And the user activates the datepicker action "Clear"
      Then the datepicker has no date
      And the associated date input has no date
      And the associated date input dispatches 1 change event

  Rule: Datepickers retain behavior when moved in the DOM

    Scenario: Moving a closed picker preserves its toggle and selection behavior
      Given a datepicker with a toggle and a selected date
      When the datepicker renders
      And the application observes datepicker changes
      And the application moves the datepicker to a new DOM parent
      Then the datepicker is in the new DOM parent
      And the datepicker trigger has a dialog popup
      When the user clicks the datepicker trigger
      And the user selects the date five days after the active date in the datepicker
      And the user activates the datepicker action "OK"
      Then the datepicker date is "2026-01-20"
      And the datepicker trigger is collapsed
      And the datepicker dispatches 1 change event

    Scenario: Moving a toggle to a new trigger transfers its popup behavior
      Given a datepicker with a toggle
      When the datepicker renders
      And the application moves the datepicker toggle to a new trigger
      Then the original datepicker trigger has no popup
      And the new datepicker trigger has a dialog popup
      When the user clicks the datepicker trigger
      Then the datepicker is closed
      When the user clicks the new datepicker trigger
      Then the new datepicker trigger is expanded
      And the datepicker calendar grid is visible

    Scenario: Moving an open modal picker closes it and allows reopening
      Given a modal datepicker starting at "2026-01-15"
      When the datepicker renders
      And the application opens the datepicker
      And the application moves the datepicker to a new DOM parent
      Then the datepicker trigger is collapsed
      And the datepicker is closed
      And the modal background is interactive again
      When the application opens the datepicker
      Then the datepicker trigger is expanded
      And the datepicker is exposed as a modal dialog
      When the user presses "Escape" in the datepicker
      Then the datepicker trigger is collapsed
      And the datepicker trigger has focus

  Rule: Dismissal, responsive behavior, and lifecycle preserve picker state

    Scenario Outline: Dismissal discards a pending date when the picker is reopened
      Given a "<variant>" datepicker with date "2026-01-15"
      When the datepicker renders
      And the application observes datepicker changes
      And the application opens the datepicker
      And the user selects the date five days after the active date in the datepicker
      And the user dismisses the datepicker using "<method>"
      Then the datepicker trigger is collapsed
      And the datepicker date is "2026-01-15"
      And the datepicker dispatches 0 change event
      When the application opens the datepicker
      Then datepicker date "January 15, 2026" is selected
      And datepicker date "January 20, 2026" is not selected

      Examples:
        | variant | method  |
        | docked  | Cancel  |
        | docked  | outside |
        | modal   | Escape  |

    Scenario: An open automatic picker responds to viewport changes
      Given an automatic datepicker starting at "2026-01-15"
      When the viewport is 959 pixels wide
      And the datepicker renders
      And the application opens the datepicker
      Then the datepicker uses the "modal" variant
      And the datepicker is exposed as a modal dialog
      And the modal background is inert and scrolling is locked
      When the viewport is 960 pixels wide
      Then the datepicker uses the "docked" variant
      And the datepicker is no longer modal
      And the modal background is interactive again
      When the viewport is 599 pixels wide
      Then the datepicker uses the "modal" variant
      And the modal background is inert and scrolling is locked
      When the viewport is 600 pixels wide
      Then the datepicker uses the "modal" variant
      When the user presses "Escape" in the datepicker
      Then the modal background is interactive again
      And the datepicker trigger has focus

    Scenario: A modal picker contains keyboard focus until dismissed
      Given a modal datepicker starting at "2026-01-15"
      When the datepicker renders
      And the application opens the datepicker
      Then the modal background is inert and scrolling is locked
      When the user tabs through the datepicker in both directions
      Then focus remains inside the datepicker
      When the user activates the datepicker action "Cancel"
      Then the modal background is interactive again
      And the datepicker trigger has focus
      When the user clicks the other datepicker trigger
      Then the other datepicker trigger has focus

    Scenario: A new range is committed only after confirmation
      Given an empty range datepicker starting at "2026-01-15"
      When the datepicker renders
      And the application observes datepicker changes
      And the application opens the datepicker
      And the user selects "January 10, 2026" in the datepicker
      And the user selects "January 15, 2026" in the datepicker
      Then the datepicker range is empty
      When the user activates the datepicker action "OK"
      Then the datepicker range is "2026-01-10" through "2026-01-15"
      And the datepicker dispatches 1 change event

    Scenario: Canceling a replacement range retains the committed range
      Given a clearable datepicker with range "2026-01-10" through "2026-01-15"
      When the datepicker renders
      And the application observes datepicker changes
      And the application opens the datepicker
      And the user selects "January 20, 2026" in the datepicker
      And the user selects "January 22, 2026" in the datepicker
      And the user activates the datepicker action "Cancel"
      Then the datepicker range is "2026-01-10" through "2026-01-15"
      And the datepicker dispatches 0 change event
      When the application opens the datepicker
      Then datepicker date "January 10, 2026" is selected
      And datepicker date "January 15, 2026" is selected
      And datepicker date "January 20, 2026" is not selected

    Scenario: Moving an open docked picker closes it and allows reopening
      Given a datepicker starting at "2026-01-15"
      When the datepicker renders
      And the application opens the datepicker
      And the application moves the datepicker to a new DOM parent
      Then the datepicker trigger is collapsed
      And the datepicker is closed
      When the application opens the datepicker
      Then the datepicker trigger is expanded
      And the datepicker calendar grid is visible

    Scenario Outline: Disconnecting a picker while it opens cancels the opening
      Given a "<variant>" datepicker with date "2026-01-15"
      When the datepicker renders
      And the application begins opening and "<movement>" the datepicker "<stage>"
      Then the datepicker is closed
      And the datepicker trigger is not expanded
      And the modal background is interactive again
      And the disconnected datepicker has no active anchoring
      When the application opens the datepicker
      Then the datepicker trigger is expanded
      And the datepicker calendar grid is visible

      Examples:
        | variant | movement | stage                  |
        | docked  | moves    | before calendar render |
        | docked  | removes  | before calendar render |
        | modal   | moves    | before calendar render |
        | modal   | removes  | before calendar render |
        | docked  | moves    | after calendar render  |
        | docked  | removes  | after calendar render  |
        | modal   | moves    | after calendar render  |
        | modal   | removes  | after calendar render  |
        | docked  | moves    | after calendar update  |
        | docked  | removes  | after calendar update  |
        | modal   | moves    | after calendar update  |
        | modal   | removes  | after calendar update  |

    Scenario: A new opening is not canceled by an earlier disconnected opening
      Given a "modal" datepicker with date "2026-01-15"
      When the datepicker renders
      And the application moves the datepicker during opening and immediately opens it again
      Then the datepicker trigger is expanded
      And the datepicker is exposed as a modal dialog
      And the modal background is inert and scrolling is locked
      When the user presses "Escape" in the datepicker
      Then the modal background is interactive again
