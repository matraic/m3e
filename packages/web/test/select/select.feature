Feature: Select
  Selects expose a combobox with a listbox of choices and submit selected values with a form.

  Rule: A single-select offers one selected value

    Scenario: The combobox starts collapsed
      Given a single-select labelled "Fruit"
      When the select renders
      Then the select has listbox popup semantics
      And the select is collapsed
      And the select listbox is hidden

    Scenario: Clicking opens the options
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      Then the select is expanded
      And the select listbox contains 3 options

    Scenario Outline: The listbox follows its scrolling container
      Given a <mode> labelled "<label>"
      And the select is inside a scrolling container
      When the select renders
      And the user opens the select
      And the select container scrolls down 50 pixels
      Then the select listbox stays open and moves up 50 pixels
      When the user chooses "<option>" in the select
      Then the select value is "<value>"

      Examples:
        | mode         | label    | option     | value |
        | single-select | Fruit    | Apples     | apple |
        | multi-select  | Language | JavaScript | js    |

    Scenario: Choosing an option closes the listbox and emits ordered events
      Given a single-select labelled "Fruit"
      When the select renders
      And the application observes select events
      And the user opens the select
      And the user chooses "Bananas" in the select
      Then the select listbox is hidden
      And the select value is "banana"
      And the select events are "beforeinput,input,change"

    Scenario: Canceling beforeinput prevents selection
      Given a single-select labelled "Fruit"
      When the select renders
      And the application cancels select beforeinput
      And the user opens the select
      And the user chooses "Apples" in the select
      Then the select has no value

    Scenario: A disabled option cannot be selected
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      And the user attempts to choose disabled option "Oranges" in the select
      Then the select is expanded
      And the select has no value

    Scenario: An initial value selects the matching option
      Given a single-select labelled "Fruit"
      And the select starts with value "banana"
      When the select renders
      Then the select value is "banana"

    Scenario: The application can set the value
      Given a single-select labelled "Fruit"
      When the select renders
      And the application sets the select value to "apple"
      Then the select value is "apple"

    Scenario: Clearing twice emits only one change
      Given a single-select labelled "Fruit"
      And the select starts with value "apple"
      When the select renders
      Then the select value is "apple"
      When the application observes select events
      And the application clears the select twice
      Then the select has no value
      And the select events are "change"

  Rule: The select supports keyboard interaction

    Scenario: Escape closes the listbox
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      And the user presses "Escape" in the select
      Then the select listbox is hidden
      And the select is collapsed

    Scenario: ArrowDown selects enabled options while closed
      Given a single-select labelled "Fruit"
      When the select renders
      And the user focuses the select
      And the user presses "ArrowDown" in the select
      Then the select value is "apple"
      When the user presses "ArrowDown" in the select
      Then the select value is "banana"

    Scenario: Enter selects the active option in an open listbox
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      And the user presses "ArrowDown" in the select
      And the user presses "Enter" in the select
      Then the select listbox is hidden
      And the select value is "banana"

  Rule: Disabled state and form constraints apply to the select

    Scenario: A disabled select cannot open
      Given a single-select labelled "Fruit"
      And the select starts disabled
      When the select renders
      And the application clicks the select
      Then the select listbox is hidden

    Scenario: A single selected value is submitted
      Given a single-select labelled "Fruit"
      And the select starts with value "apple"
      And the select is in a form
      When the select renders
      Then the select value is "apple"
      And the select form submits "fruit" as "apple"

    Scenario: A required select is invalid until a value is chosen
      Given a single-select labelled "Fruit"
      And the select is required
      When the select renders
      Then the select is invalid
      When the user opens the select
      And the user chooses "Apples" in the select
      Then the select is valid

  Rule: A multi-select allows independent choices

    Scenario: Choosing several options leaves the listbox open
      Given a multi-select labelled "Language"
      When the select renders
      And the user opens the select
      And the user chooses "JavaScript" in the select
      And the user chooses "Python" in the select
      Then the select listbox is visible
      And the select listbox supports multiple selection
      And the select values are "js,py"

    Scenario: Choosing a selected option deselects it
      Given a multi-select labelled "Language"
      When the select renders
      And the user opens the select
      And the user chooses "JavaScript" in the select
      And the user chooses "JavaScript" in the select
      Then the select has no value

    Scenario: A comma-separated initial value selects several options
      Given a multi-select labelled "Language"
      And the select starts with value "js,ts"
      When the select renders
      Then the select values are "js,ts"

    Scenario: All selected values are submitted
      Given a multi-select labelled "Language"
      And the select starts with value "js,py"
      And the select is in a form
      When the select renders
      Then the select values are "js,py"
      And the select form submits "lang" as the values "js,py"

  Rule: Accessible navigation keeps focus on the combobox

    Scenario: An associated label names the select without an aria-label
      Given a single-select labelled "Fruit"
      And the select uses only its associated label
      When the select renders
      Then the select has accessible name "Fruit"
      When the user clicks the select label
      Then the select is focused
      And the select listbox is visible

    Scenario: The combobox controls the visible listbox and its active option
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      Then the select controls its listbox
      And only the popup select options are exposed
      And the select active option is "Apples"
      And the select is focused
      When the user presses "ArrowDown" in the select
      Then the select active option is "Bananas"
      And the select is focused
      When the user presses "Escape" in the select
      Then the select has no popup relationships
      And the select is focused

    Scenario: Opening highlights the current selection
      Given a single-select labelled "Fruit"
      And the select starts with value "banana"
      When the select renders
      Then the select value is "banana"
      When the user opens the select
      Then the select active option is "Bananas"
      And select option "Bananas" is exposed as selected

    Scenario Outline: Keyboard activation opens without selecting
      Given a <mode> labelled "<label>"
      When the select renders
      And the user focuses the select
      And the user presses "<key>" in the select
      Then the select listbox is visible
      And the select has no value
      And the select is focused

      Examples:
        | mode          | label    | key   |
        | single-select | Fruit    | Enter |
        | single-select | Fruit    | Space |
        | multi-select  | Language | Enter |
        | multi-select  | Language | Space |

    Scenario: Tab closes the popup and moves to the following control
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      And the user presses "Tab" in the select
      Then the select listbox is hidden
      And the control after the select is focused

    Scenario: Home and End navigate the open list without selecting
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      And the user presses "End" in the select
      Then the select active option is "Bananas"
      And the select has no value
      When the user presses "Home" in the select
      Then the select active option is "Apples"
      And the select has no value

    Scenario: Typing finds an option without selecting until Enter
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      And the user presses "b" in the select
      Then the select active option is "Bananas"
      And the select has no value
      When the user presses "Enter" in the select
      Then the select value is "banana"

    Scenario: Multi-select keyboard toggles the active option without closing
      Given a multi-select labelled "Language"
      When the select renders
      And the user focuses the select
      And the user presses "ArrowDown" in the select
      Then the select active option is "JavaScript"
      When the user presses "Space" in the select
      Then the select value is "js"
      And select option "JavaScript" is exposed as selected
      When the user presses "Space" in the select
      Then the select has no value
      And the select listbox is visible
      And the select is focused

    Scenario: Disabled selects are skipped in the tab order
      Given a single-select labelled "Fruit"
      And the select starts disabled
      And the select starts with value "apple"
      And the select is in a form
      When the select renders
      Then the select value is "apple"
      When the user tabs from the control before the select
      Then the control after the select is focused
      And the select form submits no "fruit" values

  Rule: Moving the select preserves its behavior

    Scenario: Moving a closed select preserves its value and event handlers
      Given a single-select labelled "Fruit"
      And the select starts with value "apple"
      When the select renders
      Then the select value is "apple"
      When the application observes select events
      And the application moves the select to a new parent
      And the application moves the select to a new parent
      Then the select value is "apple"
      When the user opens the select
      And the user chooses "Bananas" in the select
      Then the select value is "banana"
      And the select events are "beforeinput,input,change"

    Scenario: Moving an open select cleans up its popup and allows reopening
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      And the application moves the select to a new parent
      Then no select popup remains in the document
      And the select is collapsed
      And the select has no popup relationships
      When the user opens the select
      Then exactly one select popup exists
      When the user chooses "Bananas" in the select
      Then the select value is "banana"

    Scenario: Moving a select between forms transfers its submitted value
      Given a single-select labelled "Fruit"
      And the select starts with value "apple"
      And the select is in a form
      When the select renders
      Then the select value is "apple"
      When the application moves the select to a new form
      Then the original select form submits no values
      And the destination select form submits "fruit" as "apple"
      When the user opens the select
      And the user chooses "Bananas" in the select
      Then the destination select form submits "fruit" as "banana"

    Scenario: Moving a multi-select retains every selected option
      Given a multi-select labelled "Language"
      And the select starts with value "js,py"
      When the select renders
      Then the select values are "js,py"
      When the application moves the select to a new parent
      And the user opens the select
      Then select option "JavaScript" is exposed as selected
      And select option "Python" is exposed as selected
      When the user chooses "TypeScript" in the select
      Then the select values are "js,ts,py"

  Rule: Dynamic options stay synchronized with the popup

    Scenario: An option added after moving the select can be chosen
      Given a single-select labelled "Fruit"
      When the select renders
      And the application moves the select to a new parent
      And the application adds select option "Pears" with value "pear"
      Then the select tracks 4 options
      When the user opens the select
      And the user chooses "Pears" in the select
      Then the select value is "pear"

    Scenario: An option added while open becomes available immediately
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      And the application adds select option "Pears" with value "pear"
      Then the select listbox contains 4 options
      When the user chooses "Pears" in the select
      Then the select value is "pear"

    Scenario: Removing every option closes an open popup
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      And the application removes every select option
      Then the select tracks 0 options
      And the select listbox is hidden
      And the select is collapsed

    Scenario: A pending value applies when options arrive later
      Given a single-select labelled "Fruit"
      And the select starts without options
      And the select starts with value "pear"
      When the select renders
      And the application adds select option "Pears" with value "pear"
      Then the select tracks 1 options
      When the user opens the select
      Then select option "Pears" is exposed as selected
      And the select value is "pear"

    Scenario: A programmatic value replaces the pending initial value
      Given a single-select labelled "Fruit"
      And the select starts without options
      And the select starts with value "pear"
      When the select renders
      And the application sets the select value to "peach"
      And the application adds select option "Peaches" with value "peach"
      Then the select tracks 1 options
      When the user opens the select
      Then select option "Peaches" is exposed as selected
      And the select value is "peach"

    Scenario: Programmatic value changes do not emit user input events
      Given a single-select labelled "Fruit"
      When the select renders
      And the application observes select events
      And the application sets the select value to "banana"
      Then the select value is "banana"
      When the user opens the select
      Then select option "Bananas" is exposed as selected
      And the select events are ""

  Rule: Form and popup state remain consistent after changes

    Scenario: Reset restores an initial single selection without input events
      Given a single-select labelled "Fruit"
      And the select starts with value "apple"
      And the select is in a form
      When the select renders
      Then the select value is "apple"
      When the user opens the select
      And the user chooses "Bananas" in the select
      Then the select value is "banana"
      And the select listbox is hidden
      And the select has no popup relationships
      When the application observes select events
      And the select form is reset
      Then the select value is "apple"
      And the select form submits "fruit" as "apple"
      And the select events are ""
      When the user opens the select
      Then select option "Apples" is exposed as selected

    Scenario: Reset restores every initial multi-selection
      Given a multi-select labelled "Language"
      And the select starts with value "js,py"
      And the select is in a form
      When the select renders
      Then the select values are "js,py"
      When the user opens the select
      And the user chooses "JavaScript" in the select
      And the user chooses "TypeScript" in the select
      And the user presses "Escape" in the select
      Then the select values are "ts,py"
      When the select form is reset
      Then the select values are "js,py"
      And the select form submits "lang" as the values "js,py"

    Scenario: Clearing an open required select restores focus and invalidity
      Given a single-select labelled "Fruit"
      And the select starts with value "apple"
      And the select is required
      And the select is in a form
      When the select renders
      Then the select value is "apple"
      When the application observes select events
      And the user opens the select
      And the application clears the select and restores focus
      Then the select has no value
      And the select listbox is hidden
      And the select is focused
      And the select is invalid
      And the select form submits no "fruit" values
      And the select events are "change"

    Scenario: Disabling an open select dismisses its popup and blocks selection
      Given a single-select labelled "Fruit"
      When the select renders
      And the application observes select events
      And the user opens the select
      And the application disables the select
      Then the select listbox is hidden
      And the select is collapsed
      When the application sends "ArrowDown" to the disabled select
      Then the select has no value
      And the select events are ""
      When the application enables the select
      And the user opens the select
      And the user chooses "Bananas" in the select
      Then the select value is "banana"

    Scenario: Removing the selected option clears its submitted value
      Given a single-select labelled "Fruit"
      And the select starts with value "apple"
      And the select is in a form
      When the select renders
      Then the select value is "apple"
      When the application removes select option "Apples"
      Then the select tracks 2 options
      And the select has no value
      And the select displays no selected label
      And the select form submits no "fruit" values

    Scenario: Disabling the selected option excludes it from submission
      Given a single-select labelled "Fruit"
      And the select starts with value "apple"
      And the select is in a form
      When the select renders
      Then the select value is "apple"
      When the application disables select option "Apples"
      Then the select has no value
      And the select form submits no "fruit" values
      When the user opens the select
      Then select option "Apples" is exposed as disabled

    Scenario: A disabled popup option cannot be activated after a runtime change
      Given a single-select labelled "Fruit"
      When the select renders
      And the user opens the select
      And the application disables select option "Bananas"
      Then select option "Bananas" is exposed as disabled
      When the user presses "ArrowDown" in the select
      Then the select active option is "Apples"
      And the select has no value

    Scenario: Rebuilding the open options preserves multi-selection
      Given a multi-select labelled "Language"
      And the select starts with value "js,py"
      When the select renders
      Then the select values are "js,py"
      When the user opens the select
      And the application adds select option "Ruby" with value "rb"
      Then the select listbox contains 4 options
      And select option "JavaScript" is exposed as selected
      And select option "Python" is exposed as selected
      When the user chooses "Ruby" in the select
      Then the select values are "js,py,rb"

    Scenario: Clicking outside dismisses the popup without changing selection
      Given a single-select labelled "Fruit"
      And the select starts with value "apple"
      When the select renders
      Then the select value is "apple"
      When the application observes select events
      And the user opens the select
      And the user clicks the control after the select
      Then the select listbox is hidden
      And the select has no popup relationships
      And the select value is "apple"
      And the select events are ""

    Scenario: A select popup remains usable inside a modal dialog
      Given a single-select labelled "Fruit"
      And the select is in a modal dialog
      When the select renders
      And the user opens the select
      Then the select listbox is inside the modal dialog
      When the user chooses "Bananas" in the select
      Then the select value is "banana"
      And the select is focused

    Scenario: Pressing one option and releasing on another does not select either
      Given a single-select labelled "Fruit"
      When the select renders
      And the application observes select events
      And the user opens the select
      And the user presses select option "Apples" and releases on "Bananas"
      Then the select has no value
      And the select events are ""

  Rule: Option groups preserve accessible names and navigation

    Scenario: Group names identify their popup options
      Given a single-select labelled "Fruit"
      And the select has grouped fruit options
      When the select renders
      And the user opens the select
      Then select group "Orchard" contains options "Apples,Oranges"
      And select group "Other fruit" contains options "Bananas,Pears"
      And the select listbox contains 4 options
      When the user chooses "Pears" in the select
      Then the select value is "pear"
      And the select listbox is hidden

    Scenario: Keyboard navigation crosses group boundaries and skips disabled options
      Given a single-select labelled "Fruit"
      And the select has grouped fruit options
      When the select renders
      And the user opens the select
      Then the select active option is "Apples"
      When the user presses "ArrowDown" in the select
      Then the select active option is "Bananas"
      When the user presses "ArrowUp" in the select
      Then the select active option is "Apples"
      When the user presses "End" in the select
      Then the select active option is "Pears"
      When the user presses "Enter" in the select
      Then the select value is "pear"

    Scenario: Multi-selection can span groups
      Given a multi-select labelled "Fruit"
      And the select has grouped fruit options
      And the select is in a form
      When the select renders
      And the user opens the select
      And the user chooses "Apples" in the select
      And the user chooses "Pears" in the select
      Then the select values are "apple,pear"
      And select option "Apples" is exposed as selected
      And select option "Pears" is exposed as selected
      And the select form submits "lang" as the values "apple,pear"

  Rule: An empty-value option represents no meaningful selection

    Scenario: Choosing None removes the displayed label and invalidates a required select
      Given a single-select labelled "Fruit"
      And the select includes a None option with an empty value
      And the select starts with value "apple"
      And the select is required
      And the select is in a form
      When the select renders
      Then the select value is "apple"
      And the select is valid
      When the user opens the select
      And the user chooses "None" in the select
      Then the select value is ""
      And the select listbox is hidden
      And the select displays no selected label
      And the select label does not float
      And the select is invalid
      And the select form submits "fruit" as ""
      And the select has no popup relationships
      When the user opens the select
      Then select option "None" is exposed as selected

    Scenario: Setting an empty value selects the matching None option
      Given a single-select labelled "Fruit"
      And the select includes a None option with an empty value
      And the select starts with value "apple"
      When the select renders
      Then the select value is "apple"
      When the application sets the select value to ""
      And the user opens the select
      Then select option "None" is exposed as selected
      And the select value is ""
      And the select displays no selected label

  Rule: Reconnecting a select does not redefine its reset value

    Scenario: A moved single-select resets to its original value
      Given a single-select labelled "Fruit"
      And the select starts with value "apple"
      And the select is in a form
      When the select renders
      Then the select value is "apple"
      When the application sets the select value to "banana"
      Then the select value is "banana"
      When the application moves the select within its form
      And the application moves the select within its form
      And the select form is reset
      Then the select value is "apple"
      And the select form submits "fruit" as "apple"
      When the user opens the select
      Then select option "Apples" is exposed as selected

    Scenario: A moved multi-select resets to all its original values
      Given a multi-select labelled "Language"
      And the select starts with value "js,py"
      And the select is in a form
      When the select renders
      Then the select values are "js,py"
      When the application sets the select value to "ts"
      Then the select value is "ts"
      When the application moves the select within its form
      And the select form is reset
      Then the select values are "js,py"
      And the select form submits "lang" as the values "js,py"

    Scenario: A select initially without a value still resets to no selection after moving
      Given a single-select labelled "Fruit"
      And the select is in a form
      When the select renders
      And the application sets the select value to "apple"
      Then the select value is "apple"
      When the application moves the select within its form
      And the select form is reset
      Then the select has no value
      And the select displays no selected label
      And the select form submits no "fruit" values

  Rule: Text-valued initial selections float the form-field label

    Scenario: Initially selected toppings float the label without explicit option values
      Given a multi-select labelled "Toppings"
      And the select has initially selected toppings without explicit values
      When the select renders
      Then the select values are "Extra cheese,Mushroom"
      And the select displays the selected label "Extra cheese, Mushroom"
      And the select form-field label floats

    Scenario: An initially selected text-valued option floats the label in single mode
      Given a single-select labelled "Toppings"
      And the select has initially selected toppings without explicit values
      When the select renders
      Then the select value is "Extra cheese"
      And the select displays the selected label "Extra cheese"
      And the select form-field label floats
