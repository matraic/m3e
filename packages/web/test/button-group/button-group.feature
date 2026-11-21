Feature: Button group
  Button groups organize related actions and coordinate their selection and press behavior.

  Rule: Groups expose appropriate semantics and selection behavior

    Scenario: A group exposes its buttons
      Given a standard group with Save and Cancel buttons
      When the group renders
      Then a group named "Actions" is visible
      And the Save and Cancel buttons are visible

    Scenario: Toggle buttons in a single-select group behave as radio options
      Given a single-select group with Day, Week, and Month toggle buttons
      When the group renders
      Then a radiogroup named "Period" is visible
      And its toggle buttons have radio roles
      When the user selects "Week"
      Then "Week" is selected
      And "Day" is not selected
      When the user selects "Month"
      Then "Month" is selected
      And "Week" is not selected
      When the user selects "Month"
      Then "Month" is not selected

    Scenario: Single-select options support keyboard focus and activation
      Given a single-select group with Day, Week, and Month toggle buttons
      When the group renders
      And the user tabs into the Period options
      Then the "Day" option has keyboard focus
      When the user tabs to the next Period option
      Then the "Week" option has keyboard focus
      When the user presses Space on the focused Period option
      Then "Week" is selected

    Scenario: Single-select icon options expose their checked state
      Given a single-select group with Bold and Italic icon options
      When the group renders
      And the user selects icon option "Bold"
      Then "Bold" is selected
      And "Italic" is not selected

    Scenario: A reconnected group keeps its radio semantics
      Given a single-select group with Day, Week, and Month toggle buttons
      When the group renders
      And the user detaches and reinserts the Period group
      Then a radiogroup named "Period" is visible
      And its toggle buttons have radio roles

    Scenario: Moving an option to a multi-select group updates its role
      Given a source radio group and a destination multi-select group
      When the group renders
      And the user moves "Beta" to the destination group
      Then "Beta" is a button in the destination group
      When the user selects "Beta"
      Then "Beta" is pressed

    Scenario: A multi-select group allows multiple toggle buttons to be selected
      Given a multi-select group with Bold and Italic toggle buttons
      When the group renders
      Then a group named "Formatting" is visible
      When the user selects "Bold"
      And the user selects "Italic"
      Then "Bold" is pressed
      And "Italic" is pressed

    Scenario: A multi-select group supports icon toggle buttons
      Given a multi-select group with Bold and Italic icon buttons
      When the group renders
      Then a group named "Icon formatting" is visible
      When the user activates both icon options
      Then both icon options are pressed

    Scenario: Adding a toggle button updates the group's selection semantics
      Given an empty labeled button group
      When the group renders
      And a toggle option is added to the group
      Then a radiogroup named "Dynamic" is visible
      And the Pin option has a radio role

  Rule: Groups support their variants, sizes, and motion settings

    Scenario Outline: A group accepts its supported variant and size
      Given a button group with variant "<variant>" and size "<size>"
      When the group renders
      Then the group reflects variant "<variant>"
      And the group reflects size "<size>"

      Examples:
        | variant   | size        |
        | standard  | small       |
        | connected | large       |

    Scenario: A group falls back to standard and small for unknown values
      Given a button group with an unknown variant and size
      When the group renders
      Then the group reflects variant "standard"
      And the group reflects size "small"

    Scenario Outline: Standard buttons use the theme's fast spatial spring
      Given a standard group using the "<motion>" motion scheme
      When the group renders
      Then each button and its label wrapper use the fast spatial spring

      Examples:
        | motion     |
        | standard   |
        | expressive |

    Scenario: Expressive motion overshoots widths while a button is pressed
      Given an expressive group with three buttons
      When the group renders
      And the user presses the middle button
      Then every button's width transition overshoots

    Scenario: A released button label stays within its box while the width springs back
      Given an expressive group with Start, Directions, and Share buttons
      When the group renders
      And the user presses and releases "Directions"
      Then its label does not overflow during the return spring

    Scenario: A neighboring button shrinks by no more than its end padding
      Given a standard group with a long first label and Day and Week buttons
      When the group renders
      And the user holds the first button down
      Then the Day button shrinks by no more than its end padding
      And the pressed button grows by the same amount
      And the Week button keeps its width

    Scenario: Pressing a connected button does not resize its neighbors
      Given a connected group with Start, Directions, and Share toggle buttons
      When the group renders
      And the user holds connected button "Directions"
      Then no connected group button changes width

    Scenario: Buttons return to their resting widths after quick successive presses
      Given a standard group with a long first label and Day and Week buttons
      When the group renders
      And the user presses the buttons in quick succession
      Then every button returns to its resting width

    Scenario: Reduced motion resizes pressed buttons without transitions
      Given reduced motion is preferred
      And a standard group with One and Two buttons
      When the group renders
      And the user holds down "Two"
      Then the pressed button grows without running transitions
