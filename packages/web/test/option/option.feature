Feature: Option
  Options are the selectable choices of listboxes. They resolve their value and label, reflect selected and disabled
  state, coordinate selection with their listbox, highlight search terms, and can be grouped and arranged in panels.

  Rule: An option is a listbox option with a label and value

    Scenario: An option is exposed with the option role

      Given an option "Apple"
      When the options render
      Then option "Apple" is exposed as an option

    Scenario: The value falls back to the label

      Given an option "Apple"
      When the options render
      Then option "Apple" has value "Apple" and label "Apple"

    Scenario: An explicit value wins over the label

      Given an option "Banana" with value "bn"
      When the options render
      Then option "Banana" has value "bn" and label "Banana"

    Scenario: An option with an empty value is empty

      Given an option "None" with value ""
      When the options render
      Then option "None" is empty

    Scenario: An option without an explicit value is not empty

      Given an option "Apple"
      When the options render
      Then option "Apple" is not empty

  Rule: An option reflects its state

    Scenario: The selected state is exposed

      Given a selected option "Apple"
      When the options render
      Then option "Apple" is exposed as selected
      When the application deselects option "Apple"
      Then option "Apple" is exposed as not selected

    Scenario: The disabled state is exposed

      Given a disabled option "Apple"
      When the options render
      Then option "Apple" is exposed as disabled
      When the application enables option "Apple"
      Then option "Apple" is not exposed as disabled

    Scenario: Changing the selected or disabled state notifies the host

      Given an option "Apple" inside a host
      When the options render
      And the host starts counting state-change events
      And the application selects option "Apple"
      Then the host has received 1 state-change event
      When the application disables option "Apple"
      Then the host has received 2 state-change events

    Scenario: Selecting an option deselects the others in a single-select listbox

      Given a single-select listbox with selected option "Apple" and option "Banana"
      When the options render
      And the application selects option "Banana"
      Then option "Apple" is exposed as not selected
      And option "Banana" is exposed as selected

    Scenario: Selecting an option keeps the others in a multi-select listbox

      Given a multi-select listbox with selected option "Apple" and option "Banana"
      When the options render
      And the application selects option "Banana"
      Then option "Apple" is exposed as selected
      And option "Banana" is exposed as selected

  Rule: An option highlights the search term

    Scenario: The search term is highlighted

      Given an option "Apple" with search term "pp"
      When the options render
      Then option "Apple" highlights its search term

    Scenario: Highlighting can be disabled

      Given an option "Apple" with search term "pp" and highlighting disabled
      When the options render
      Then option "Apple" does not highlight its search term

    Scenario: A selected option is not highlighted

      Given a selected option "Apple" with search term "pp"
      When the options render
      Then option "Apple" does not highlight its search term

    Scenario: A disabled option disables its state layer

      Given a disabled option "Apple"
      When the options render
      Then option "Apple" disables its state layer

  Rule: An option group is a labelled group

    Scenario: A group is labelled by its label slot

      Given an option group labelled "Fruits" containing option "Apple"
      When the options render
      Then option group "Fruits" is exposed as a group

    Scenario: A group keeps an existing label ID

      Given an option group labelled "Fruits" with label ID "mine"
      When the options render
      Then the option group is labelled by "mine"
      And only one element has ID "mine"

    Scenario: Removing the label removes the reference

      Given an option group labelled "Fruits" containing option "Apple"
      When the options render
      Then the option group is labelled by a generated label
      When the application removes the option group label
      Then the option group has no labelled-by reference

  Rule: An option panel is a listbox that marks its first and last visible options

    Scenario: A panel is exposed as a listbox

      Given an option panel containing option "Apple"
      When the options render
      Then the option panel is exposed as a listbox

    Scenario: The first and last options are marked

      Given an option panel containing options "Apple", "Banana", and "Cherry"
      When the options render
      Then option "Apple" is marked as "first"
      And option "Banana" is marked as "neither"
      And option "Cherry" is marked as "last"

    Scenario: Hidden options are skipped when marking the first and last options

      Given an option panel containing hidden option "Apple", option "Banana", and hidden option "Cherry"
      When the options render
      Then option "Banana" is marked as "first and last"
      And option "Apple" is marked as "neither"

    Scenario: The first and last options update when options change

      Given an option panel containing option "Apple"
      When the options render
      And the application appends option "Zucchini" to the option panel
      Then option "Zucchini" is marked as "last"
      And option "Apple" is marked as "first"

    Scenario: State changes of its options do not escape the panel

      Given an option panel containing option "Apple" inside a host
      When the options render
      And the host starts counting state-change events
      And the application selects option "Apple"
      Then option "Apple" is exposed as selected
      And the host has received 0 state-change events
