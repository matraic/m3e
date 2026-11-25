Feature: Radio group
  Radio groups let a user choose exactly one option from a set. They coordinate selection, keyboard navigation,
  validation, and form participation across their radios.

  Rule: A radio group exposes mutually exclusive choices

    Scenario: A group of unchecked radios is exposed as a radiogroup

      Given a "Size" radio group with Small, Medium, and Large radios
      When the radio group renders
      Then the radio group is exposed as the "Size" radiogroup
      And the radio group exposes 3 radios
      And no radio is checked
      And the radio group value is none

    Scenario: Checking a radio unchecks the previous one and updates the value

      Given a "Size" radio group with Small, Medium, and Large radios
      When the radio group renders
      And the user clicks the "Small" radio
      Then the "Small" radio is checked
      And the radio group value is "s"
      When the user clicks the "Large" radio
      Then the "Large" radio is checked
      And the "Small" radio is not checked
      And the radio group value is "l"

    Scenario: A checked radio initializes the group value

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Medium" radio starts checked
      When the radio group renders
      Then the "Medium" radio is checked
      And the radio group value is "m"

    Scenario: Only one radio stays checked when several start checked

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Small" radio starts checked
      And the "Medium" radio starts checked
      When the radio group renders
      Then the "Small" radio is checked
      And the "Medium" radio is not checked
      And the radio group value is "s"

    Scenario: A wrapping label names a radio and checks it when clicked

      Given a "Size" radio group with Small, Medium, and Large radios
      And each radio is wrapped in a label
      When the radio group renders
      And the user clicks the label text "Medium"
      Then the radio group value is "m"

    Scenario: Checking a radio from the application updates the group

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Medium" radio starts checked
      When the radio group renders
      And the application checks the "Large" radio
      Then the "Large" radio is checked
      And the "Medium" radio is not checked
      And the radio group value is "l"

    Scenario: Removing the checked radio clears the value

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Medium" radio starts checked
      When the radio group renders
      And the application removes the "Medium" radio
      Then the radio group value is none

    Scenario: A checked radio added later takes over the selection

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Medium" radio starts checked
      When the radio group renders
      And the application adds a checked "Extra large" radio with value "xl"
      Then the "Extra large" radio is checked
      And the "Medium" radio is not checked
      And the radio group value is "xl"

  Rule: Checking a radio dispatches cancelable events

    Scenario: A user selection dispatches beforeinput, input, and change

      Given a "Size" radio group with Small, Medium, and Large radios
      When the radio group renders
      And the radio group starts recording events
      And the user clicks the "Small" radio
      Then the radio group recorded the events "beforeinput, input, change"

    Scenario: Canceling beforeinput keeps the radio unchecked

      Given a "Size" radio group with Small, Medium, and Large radios
      When the radio group renders
      And the radio group cancels beforeinput
      And the user clicks the "Small" radio
      Then the "Small" radio is not checked
      And the radio group value is none

    Scenario: Clicking the checked radio again dispatches nothing

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Small" radio starts checked
      When the radio group renders
      And the radio group starts recording events
      And the user clicks the "Small" radio
      Then the radio group recorded the events ""

    Scenario: Checking a radio from the application dispatches no events

      Given a "Size" radio group with Small, Medium, and Large radios
      When the radio group renders
      And the radio group starts recording events
      And the application checks the "Large" radio
      Then the radio group recorded the events ""

  Rule: The keyboard moves selection between radios

    Scenario: The group is a single tab stop that rests on the checked radio

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Medium" radio starts checked
      When the radio group renders
      And the user tabs into the radio group
      Then the "Medium" radio is focused
      When the user presses "Tab" in the radio group
      Then the button "After" is focused

    Scenario: With no radio checked the group rests on the first enabled radio

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Small" radio starts disabled
      When the radio group renders
      And the user tabs into the radio group
      Then the "Medium" radio is focused
      And the "Medium" radio is not checked

    Scenario: Space checks the focused radio

      Given a "Size" radio group with Small, Medium, and Large radios
      When the radio group renders
      And the user tabs into the radio group
      And the user presses "Space" in the radio group
      Then the "Small" radio is checked

    Scenario Outline: Arrow keys check the next or previous radio and wrap around

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "<start>" radio starts checked
      When the radio group renders
      And the user focuses the "<start>" radio
      And the user presses "<key>" in the radio group
      Then the "<end>" radio is checked
      And the "<end>" radio is focused

      Examples:
        | start  | key        | end    |
        | Small  | ArrowDown  | Medium |
        | Small  | ArrowRight | Medium |
        | Medium | ArrowUp    | Small  |
        | Medium | ArrowLeft  | Small  |
        | Large  | ArrowDown  | Small  |
        | Small  | ArrowUp    | Large  |

    Scenario Outline: Horizontal arrow keys follow the reading direction

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Small" radio starts checked
      And the radio group is rendered right-to-left
      When the radio group renders
      And the user focuses the "Small" radio
      And the user presses "<key>" in the radio group
      Then the "<end>" radio is checked

      Examples:
        | key        | end    |
        | ArrowLeft  | Medium |
        | ArrowRight | Large  |

    Scenario: Arrow keys skip disabled radios

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Small" radio starts checked
      And the "Medium" radio starts disabled
      When the radio group renders
      And the user focuses the "Small" radio
      And the user presses "ArrowDown" in the radio group
      Then the "Large" radio is checked
      And the "Medium" radio is not checked

  Rule: A disabled radio or group cannot be changed

    Scenario: A disabled radio is exposed as disabled and cannot be checked

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Small" radio starts disabled
      When the radio group renders
      And the user clicks the "Small" radio without actionability checks
      Then the "Small" radio is exposed as disabled
      And the "Small" radio is not checked

    Scenario: A disabled group disables every radio

      Given a "Size" radio group with Small, Medium, and Large radios
      And the radio group is disabled
      When the radio group renders
      And the user clicks the "Small" radio without actionability checks
      Then the "Small" radio is exposed as disabled
      And the "Medium" radio is exposed as disabled
      And the "Large" radio is exposed as disabled
      And no radio is checked

    Scenario: Enabling the group enables its radios again

      Given a "Size" radio group with Small, Medium, and Large radios
      And the radio group is disabled
      When the radio group renders
      And the application enables the radio group
      Then the "Small" radio is not exposed as disabled
      And the "Large" radio is not exposed as disabled

    Scenario: A radio added to a disabled group is disabled

      Given a "Size" radio group with Small, Medium, and Large radios
      And the radio group is disabled
      When the radio group renders
      And the application adds a "Extra large" radio with value "xl"
      Then the "Extra large" radio is exposed as disabled

    Scenario: Enabling the group keeps an individually disabled radio disabled

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Medium" radio starts disabled
      And the radio group is disabled
      When the radio group renders
      And the application enables the radio group
      Then the "Small" radio is not exposed as disabled
      And the "Medium" radio is exposed as disabled

  Rule: The group name identifies its radios in a form

    Scenario: The group name is applied to its radios, including radios added later

      Given a "Size" radio group with Small, Medium, and Large radios
      When the radio group renders
      And the application adds a "Extra large" radio with value "xl"
      Then every radio is named "size"

    Scenario: A radio keeps its own name

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Medium" radio starts named "own"
      When the radio group renders
      Then the "Medium" radio is named "own"
      And the "Small" radio is named "size"

    Scenario: Changing the group name renames its radios

      Given a "Size" radio group with Small, Medium, and Large radios
      When the radio group renders
      And the application renames the radio group to "shirt"
      Then every radio is named "shirt"

    Scenario: Radios with the same name outside a group are mutually exclusive

      Given two radios named "pet" outside a group
      When the radio group renders
      And the user clicks the "Cat" radio
      And the user clicks the "Dog" radio
      Then the "Dog" radio is checked
      And the "Cat" radio is not checked

  Rule: The checked radio submits its value with a form

    Scenario: The selected value is submitted

      Given a "Size" radio group with Small, Medium, and Large radios
      And the radio group is inside a form
      When the radio group renders
      And the user clicks the "Medium" radio
      Then the form submits "m" for "size"

    Scenario: Nothing is submitted until a radio is checked

      Given a "Size" radio group with Small, Medium, and Large radios
      And the radio group is inside a form
      When the radio group renders
      Then the form submits nothing for "size"

    Scenario: A checked radio that is disabled is not submitted

      Given a "Size" radio group with Small, Medium, and Large radios
      And the radio group is inside a form
      And the "Medium" radio starts checked
      And the "Medium" radio starts disabled
      When the radio group renders
      Then the form submits nothing for "size"

    Scenario: Resetting the form restores the initial selection

      Given a "Size" radio group with Small, Medium, and Large radios
      And the radio group is inside a form
      And the "Medium" radio starts checked
      When the radio group renders
      And the user clicks the "Large" radio
      And the user resets the form
      Then the "Medium" radio is checked
      And the "Large" radio is not checked
      And the radio group value is "m"

    Scenario: Resetting the form clears a selection made from nothing

      Given a "Size" radio group with Small, Medium, and Large radios
      And the radio group is inside a form
      When the radio group renders
      And the user clicks the "Large" radio
      And the user resets the form
      Then no radio is checked
      And the radio group value is none

  Rule: A required group is invalid until a radio is checked

    Scenario: Selecting a radio makes a required group valid

      Given a "Size" radio group with Small, Medium, and Large radios
      And the radio group is required
      When the radio group renders
      Then the radio group is invalid
      When the user clicks the "Small" radio
      Then the radio group is valid

    Scenario: Leaving a required group without a selection marks it invalid

      Given a "Size" radio group with Small, Medium, and Large radios
      And the radio group is required
      When the radio group renders
      And the user tabs into the radio group
      And the user presses "Tab" in the radio group
      Then the radio group has the invalid state

    Scenario: An invalid group is reflected on every radio

      Given a "Size" radio group with Small, Medium, and Large radios
      When the radio group renders
      And the application marks the radio group invalid
      Then every radio has the invalid state
      When the application marks the radio group valid
      Then no radio has the invalid state

    Scenario: Marking the group touched and dirty marks every radio

      Given a "Size" radio group with Small, Medium, and Large radios
      When the radio group renders
      And the application marks the radio group touched and dirty
      Then every radio is touched and dirty
      When the application marks the radio group untouched and pristine
      Then no radio is touched or dirty

  Rule: Forced colors use system colors

    Scenario Outline: Radios are drawn with system colors

      Given a "Size" radio group with Small, Medium, and Large radios
      And the "Small" radio starts checked
      And the "Large" radio starts disabled
      And the user uses forced colors in the radio group
      When the radio group renders
      Then the "<radio>" radio is drawn with the "<color>" system color

      Examples:
        | radio | color      |
        | Small | CanvasText |
        | Large | GrayText   |
