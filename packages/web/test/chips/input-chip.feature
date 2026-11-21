Feature: Input chips and input chip sets
  Input chip sets expose a keyboard-accessible grid for adding and removing discrete values.

  Rule: Removal and input preserve existing behavior

    Scenario: A labeled remove button removes its chip and emits remove
      Given an input chip set with a custom removal label
      When the input chips render
      And the application observes input chip changes
      And the user clicks the chip remove button "Remove keyword"
      Then the input chip set recorded one remove event
      And the input chip set contains 0 chips

    Scenario: Input adds a chip and reports its value
      Given an empty input chip set
      When the input chips render
      And the application observes input chip changes
      And the user enters input chip value "TypeScript"
      Then input chip "TypeScript" is visible
      And the chip input is empty
      And the input chip changes are "add:TypeScript"
      When the user clicks the chip remove button "Remove"
      Then the input chip set contains 0 chips
      And the input chip changes are "add:TypeScript, remove:TypeScript"

    Scenario: Duplicate input values are not added twice
      Given an input chip set with a removable TypeScript chip
      When the input chips render
      And the application observes input chip changes
      And the user enters input chip value "TypeScript"
      Then the input chip set contains 1 chips
      And the chip input is empty
      And the input chip changes are ""

    Scenario: Overflow chips are shown when the input is focused
      Given an input chip set limited to one visible chip
      When the input chips render
      Then input chip "One" is visible
      And input chip "Two" is hidden
      And the input chip overflow count is visible
      When the user focuses the chip input
      Then input chip "Two" is visible

  Rule: Chips support accessible removal and focus management

    Scenario: Input chip sets expose a named grid with labeled cells
      Given an input chip set with a removable TypeScript chip
      When the input chips render
      Then the Keywords input chip set is a grid
      And the TypeScript input chip has a labeled grid cell
      And the default Remove button is accessible

    Scenario Outline: Delete and Backspace remove a focused chip
      Given an input chip set with a removable TypeScript chip
      When the input chips render
      And the application observes input chip changes
      And the user focuses the TypeScript chip cell
      And the user presses "<key>" in the input chip set
      Then the input chip set contains 0 chips
      And the input chip changes are "remove:TypeScript"
      And the chip input has focus

      Examples:
        | key       |
        | Delete    |
        | Backspace |

    Scenario: Delete does not remove a non-removable chip
      Given an input chip set with a non-removable TypeScript chip
      When the input chips render
      And the user focuses the TypeScript chip cell
      And the user presses "Delete" in the input chip set
      Then the input chip set contains 1 chips

    Scenario: Backspace in an empty input removes the last removable chip
      Given an input chip set with two removable chips
      When the input chips render
      And the application observes input chip changes
      And the user focuses the chip input
      And the user presses "Backspace" in the input chip set
      Then the input chip set contains 1 chips
      And input chip "TypeScript" is visible
      And the input chip changes are "remove:JavaScript"

    Scenario: Backspace in a nonempty input does not remove chips
      Given an input chip set with a removable TypeScript chip
      When the input chips render
      And the user fills the chip input with "Draft"
      And the user presses "Backspace" in the input chip set
      Then the input chip set contains 1 chips

    Scenario: Removing a chip focuses the next remove button
      Given an input chip set with two removable chips
      When the input chips render
      And the user clicks the first chip remove button
      Then the JavaScript chip remove button has focus

    Scenario: Disabled sets disable input and suppress removal
      Given an input chip set with a removable TypeScript chip
      When the input chips render
      And the application sets input set attribute "disabled" to ""
      Then the chip input is disabled
      And the chip remove button is disabled
      When the application observes input chip changes
      And the application clicks the chip remove button
      Then the input chip set contains 1 chips
      And the input chip changes are ""

    Scenario: Changing remove-label updates the accessible removal button name
      Given an input chip set with a removable TypeScript chip
      When the input chips render
      And the application changes the chip removal label to "Remove TypeScript"
      Then the Remove TypeScript button is accessible

    Scenario: Keyboard navigation moves from a chip cell to its removal button
      Given an input chip set with a removable TypeScript chip
      When the input chips render
      And the user focuses the TypeScript chip cell
      And the user presses "ArrowRight" in the input chip set
      Then the TypeScript chip remove button has focus

    Scenario: A disabled-interactive input chip remains focusable without removal
      Given an input chip set with a removable TypeScript chip
      When the input chips render
      And the application sets input chip attribute "disabled-interactive"
      Then the chip remove button is disabled
      When the application observes input chip changes
      And the user focuses the TypeScript chip cell
      Then the TypeScript chip cell has focus
      When the user presses "Delete" in the input chip set
      And the application clicks the chip remove button
      Then the input chip set contains 1 chips
      And the input chip changes are ""

  Rule: Collections update dynamically and after DOM movement

    Scenario: Unfocusing the set restores its overflow limit
      Given an input chip set limited to one visible chip
      When the input chips render
      And the user focuses the chip input
      Then input chip "Two" is visible
      When the user focuses the outside button
      Then input chip "Two" is hidden
      When the application removes input set attribute "max-chips"
      Then input chip "Two" is visible

    Scenario: Replacing the input attaches listeners to the new textbox
      Given an empty input chip set
      When the input chips render
      And the application observes input chip changes
      And the application replaces the chip input
      And the user enters input chip value "TypeScript"
      Then the input chip set contains 1 chips
      And the chip input is empty
      And the input chip changes are "add:TypeScript"

    Scenario: Moving an input chip set preserves grid semantics and single change events
      Given an empty input chip set
      When the input chips render
      And the application observes input chip changes
      And the application moves the input chip set to a new parent
      Then the input chip set is in the new parent
      And the Keywords input chip set is a grid
      When the user enters input chip value "TypeScript"
      Then the input chip set contains 1 chips
      And the input chip changes are "add:TypeScript"
      When the user focuses the TypeScript chip cell
      And the user presses "Delete" in the input chip set
      Then the input chip set contains 0 chips
      And the input chip changes are "add:TypeScript, remove:TypeScript"

    Scenario: Moving a chip between input sets updates removal ownership
      Given an input chip with a destination input set
      When the input chips render
      And the application observes both input sets
      And the application moves TypeScript into the destination input set
      Then the destination input set contains TypeScript
      When the user clicks the chip remove button "Remove"
      Then both input sets contain no chips
      And only the destination input set reports removal

    Scenario: Moving a disabled input set preserves input and removal suppression
      Given an input chip set with a removable TypeScript chip
      When the input chips render
      And the application sets input set attribute "disabled" to ""
      And the application observes input chip changes
      And the application moves the input chip set to a new parent
      Then the chip input is disabled
      And the chip remove button is disabled
      When the application clicks the chip remove button
      Then the input chip set contains 1 chips
      And the input chip changes are ""

