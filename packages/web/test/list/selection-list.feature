Feature: Selection lists
  Selection lists manage single and multiple option values with accessible keyboard interaction.

  Rule: Single selection updates values and events

    Scenario: Selecting a different option updates selection and emits input and change

      Given a single-selection list with two color options
      When the selection list fixture renders
      When selection events are observed
      When the user selects Blue
      Then Blue is selected and the list value is "blue"
      When the user selects Green
      Then Green is selected and the list value is "green"
      When the user selects Green again
      Then Green remains selected without additional selection events

  Rule: Multiple selection exposes selected values and state

    Scenario: Multiple options can be selected and deselected independently

      Given a multi-selection list with Search and Share options
      When the selection list fixture renders
      When selection events are observed
      When the user selects Search and Share
      Then both options are selected and the list value contains "search,share"
      When the user deselects Search
      Then only Share is selected and the list value contains "share"
      And selection change events report each updated value

  Rule: Selection indicators can be hidden

    Scenario: Hiding and restoring indicators updates existing options

      Given a selection list with visible selection indicators
      When the selection list fixture renders
      Then both selection indicators are visible
      When the application hides selection indicators
      Then both selection indicators are hidden
      When the application restores selection indicators
      Then both selection indicators are visible

  Rule: Options can change while the list is connected

    Scenario: Adding an option and removing a selected option updates list state

      Given a multi-selection list with Search and Share options
      When the selection list fixture renders
      When the user selects Search
      When the application adds the Analyze option
      Then Analyze is unselected and outside the tab order
      When the application removes Search
      Then Search is removed and the remaining options update list state

  Rule: Canceled and disabled options do not change selection

    Scenario: Canceled input and disabled options remain unselected

      Given a selection list with an enabled option and a disabled option
      When the selection list fixture renders
      When the application cancels changes to the enabled option
      When the user attempts to select both options
      Then neither option is selected and the list value is empty

  Rule: The entire list can be disabled

    Scenario: A disabled selection list blocks selection until re-enabled

      Given a multi-selection list with Search selected and Share unselected
      When the selection list fixture renders
      When the application disables the selection list
      Then the list and both options expose disabled state
      When the user attempts to select Share in the disabled list
      Then Search remains selected and Share remains unselected
      When the application enables the selection list
      Then the list and both options are enabled
      When the user selects Share
      Then both options are selected and the list value contains "search,share"

  Rule: Keyboard navigation moves among enabled options

    Scenario: Arrow navigation skips disabled options and Space selects the focused option

      Given a selection list with enabled and disabled navigation options
      When the selection list fixture renders
      When the user moves down through the enabled options
      Then the second enabled option is focused
      When the user moves down once more
      Then the last option is focused
      When the user selects the focused option with Space
      Then the last option is selected

    Scenario: Home, End, and arrow wrapping stay on enabled options

      Given a selection list with a disabled option between two enabled options
      When the selection list fixture renders
      When the user moves up from the first option
      Then the last option is focused
      When the user presses Home
      Then the first option is focused
      When the user presses End
      Then the last option is focused
      When the user moves down from the last option
      Then the first option is focused

  Rule: Selection list values participate in form submission

    Scenario: A changed single selection updates the submitted form value

      Given a single-selection list in a form with Blue selected
      When the selection list fixture renders
      When the user selects Green in the form list
      When the application reads the selection list form data
      Then the form value for "color" is "green"

    Scenario: A multi-selection list submits repeated values and omits disabled selections

      Given a multi-selection form list with enabled and disabled selections
      When the selection list fixture renders
      When the application reads the selection list form data
      Then the form values for "feature" are "search,share"

    Scenario: Resetting a selection form restores its initial selection

      Given a single-selection list in a form with Blue selected
      When the selection list fixture renders
      When the user selects Green in the form list
      Then Green is selected and the list value is "green"
      When the application resets the selection list form
      Then resetting the form restores Blue and clears Green
      When the application reads the selection list form data
      Then the form value for "color" is "blue"
