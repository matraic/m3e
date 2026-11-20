Feature: Bottom sheet
  A bottom sheet presents secondary content and supports trigger, modal, and detent interactions.

  Rule: Sheets open and close through their controls

    Scenario: The open attribute controls the declarative sheet state
      Given a sheet that is open declaratively
      Then the sheet is open
      When the application removes the open attribute
      Then the sheet is closed

    Scenario: A trigger opens the sheet and a sheet action closes it
      Given a sheet with a trigger and a close action
      When the user activates the "Open actions" trigger
      Then the sheet is open
      And the "Open actions" trigger reports expanded
      When the user activates the "Close sheet" action
      Then the sheet is closed

    Scenario: The opening event can prevent a sheet from opening
      Given a sheet whose opening event is canceled
      When the user activates the "Open sheet" trigger
      Then the sheet is closed

    Scenario: Opening and closing dispatch lifecycle events in order
      Given a sheet with lifecycle event recording
      When the application opens the sheet
      Then the lifecycle events are "opening, opened"
      When the application closes the sheet
      Then the lifecycle events are "opening, opened, closing, closed"

    Scenario: The closing event can prevent a sheet from closing
      Given an open sheet whose closing event is canceled
      When the application closes the sheet
      Then the sheet is open

    Scenario: The sheet exposes show, hide, and toggle methods
      Given a closed sheet
      When the application calls "show" on the sheet
      Then the sheet is open
      When the application calls "toggle" on the sheet
      Then the sheet is closed
      When the application calls "toggle" on the sheet
      Then the sheet is open
      When the application calls "hide" on the sheet
      Then the sheet is closed

    Scenario: A secondary trigger opens the sheet without owning its ARIA references
      Given a sheet with primary and secondary triggers
      Then the primary trigger controls and labels the sheet
      And the secondary trigger has no ARIA ownership
      When the user activates the "Open secondary" trigger
      Then the sheet is open
      And the secondary trigger has no ARIA ownership

    Scenario: A secondary modal trigger announces a dialog without owning its ARIA references
      Given a modal sheet with primary and secondary triggers
      Then the "Open primary" trigger announces a dialog
      And the "Open secondary" trigger announces a dialog
      And the secondary trigger has no ARIA ownership
      When the user activates the "Open secondary" trigger
      Then the sheet is open
      And the secondary trigger has no ARIA ownership

    Scenario: A standard sheet exposes a region and syncs its primary trigger state
      Given a sheet with primary and secondary triggers
      Then the standard sheet is exposed as a labelled region
      And the primary trigger controls and labels the sheet
      When the user activates the "Open primary" trigger
      Then the "Open primary" trigger reports expanded
      When the application closes the sheet
      Then the sheet is closed
      And the primary trigger reports collapsed

  Rule: Modal sheets support accessible dismissal

    Scenario: Escape closes a modal sheet and restores focus to its trigger
      Given a modal sheet with a trigger
      When the user activates the "Open sheet" trigger
      Then the sheet is exposed as a modal dialog
      And content behind the modal sheet is inert
      And the "Open sheet" trigger announces a dialog
      When the user presses "Escape" to dismiss the sheet
      Then the sheet is closed
      And focus returns to the "Open sheet" trigger

    Scenario: Clicking outside closes a modal sheet
      Given a modal sheet with a trigger
      When the user activates the "Open sheet" trigger
      Then the sheet is exposed as a modal dialog
      When the user clicks outside the sheet
      Then the sheet is closed

    Scenario: The cancel event can prevent modal dismissal
      Given an open modal sheet whose cancel event is canceled
      When the user presses "Escape" to dismiss the sheet
      Then the sheet is open

    Scenario: Autofocus and tab navigation stay within the modal sheet
      Given a modal sheet with an autofocus control and another action
      When the user activates the "Open sheet" trigger
      Then focus is on "Save"
      When the user tabs within the modal sheet
      Then focus is on "Cancel"
      When the user tabs within the modal sheet
      Then focus is on "Save"

  Rule: Sheets coordinate detents and exclusivity

    Scenario: Opening another sheet closes the previously opened sheet
      Given two sheets
      When the application opens the "First" sheet
      Then the "First" sheet is open
      When the application opens the "Second" sheet
      Then the "Second" sheet is open
      And the "First" sheet is closed

    Scenario: A trigger opens a modal sheet at its configured detent
      Given a modal sheet with a trigger targeting the half detent
      When the user activates the "Open sheet" trigger
      Then the sheet is exposed as a modal dialog
      And the sheet opens at about half the viewport height

    Scenario: The sheet detent attribute selects its initial height
      Given a modal sheet configured to open at its half detent
      Then the sheet is open
      And the sheet opens at about half the viewport height

    Scenario Outline: Unit-based detents set explicit sheet heights
      Given a sheet with the detent "<detent>"
      When the application opens the sheet
      Then the sheet height matches the detent "<detent>"

      Examples:
        | detent |
        | 200px  |
        | 75%    |

    Scenario: The handle keyboard controls move between detents
      Given an open sheet with a keyboard-operable handle and detents
      When the user presses "ArrowUp" on the sheet handle
      Then the sheet is taller than its initial height
      When the user presses "ArrowDown" on the sheet handle
      Then the sheet is shorter than its expanded height
      When the user presses "ArrowDown" on the sheet handle
      Then the sheet is open

    Scenario: The handle cycles through detents and stays open at the largest detent
      Given an open sheet with a keyboard-operable handle and detents
      When the user activates the sheet handle
      Then the sheet is taller than its initial height
      When the user activates the sheet handle
      Then the sheet reaches its largest detent
      When the user activates the sheet handle
      Then the sheet is open

    Scenario: A hideable sheet closes when keyboard navigation moves below its lowest detent
      Given an open hideable sheet with a keyboard-operable handle and detents
      When the user presses "ArrowDown" on the sheet handle
      Then the sheet is closed

    Scenario: An upward swipe advances to the next detent
      Given an open sheet with a handle and explicit detents
      When the user swipes up on the sheet handle
      Then the sheet height matches the detent "300px"

    Scenario: A partial drag settles at the nearest detent
      Given an open sheet with a handle and explicit detents
      When the user partially drags up on the sheet handle
      Then the sheet height matches the detent "300px"

    Scenario: A collapsed sheet keeps its content inert until expanded
      Given an open sheet with a collapsed detent and custom peek height
      Then the sheet content is inert
      When the application expands the sheet to the next detent
      Then the sheet content is interactive

    Scenario: A sheet at its fit detent grows when its content grows
      Given an open sheet at its fit detent with resizable content
      When the application changes the sheet content height to 260 pixels
      Then the sheet is taller than its initial height

    Scenario: A sheet at its half detent adjusts when the viewport height changes
      Given a modal sheet configured to open at its half detent
      When the application resizes the viewport to 600 pixels high
      Then the sheet remains at about half the viewport height

    Scenario: Activating a handle closes a sheet without detents
      Given an open sheet with a handle and no detents
      When the user activates the sheet handle
      Then the sheet is closed

    Scenario: A hideable sheet dismisses when swiped down
      Given an open hideable modal sheet with a handle
      When the user swipes down on the sheet handle
      Then the sheet is closed

    Scenario: A custom handle label is available to assistive technology
      Given an open sheet with the handle label "Resize options"
      Then the sheet handle has the accessible name "Resize options"

  Rule: Triggers remain connected when moved in the DOM

    Scenario: Moving a trigger preserves its connection to the sheet
      Given a sheet with a movable trigger
      When the application moves the trigger to a new DOM parent
      And the user activates the "Open sheet" trigger
      Then the sheet is open
      And the "Open sheet" trigger reports expanded

  Rule: Sheets remain functional when moved in the DOM

    Scenario: Moving an open sheet preserves its close action
      Given a sheet with a trigger and a close action
      When the user activates the "Open actions" trigger
      And the application moves the sheet to a new DOM parent
      Then the sheet is open
      When the user activates the "Close sheet" action
      Then the sheet is closed

  Rule: Header content can be used to drag sheets without a handle

    Scenario: Dragging the header moves a sheet without a handle
      Given an open sheet with draggable header content and no handle
      When the user drags up on the sheet header
      Then the sheet height matches the detent "300px"

    Scenario: Interacting with a header button does not drag the sheet
      Given an open sheet with a button in its header and no handle
      When the user drags up on the header button
      Then the sheet height matches the detent "100px"
