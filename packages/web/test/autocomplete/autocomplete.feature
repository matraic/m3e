Feature: Autocomplete
  The autocomplete attaches suggestions to an input and lets users filter and select them.

  Rule: Suggestions are accessible from the linked input

    Scenario: Focusing the input opens the list
      Given an autocomplete with fruit suggestions
      When the user focuses the input
      Then the input is exposed as an expanded combobox linked to a listbox
      And the visible suggestions are "Apples, Oranges, Bananas"

    Scenario: Arrow keys move the active suggestion without moving input focus
      Given an autocomplete with the fruit suggestions open
      When the user presses "ArrowDown"
      Then "Apples" is the active suggestion
      And focus stays on the input
      When the user presses "ArrowDown"
      Then "Oranges" is the active suggestion
      And focus stays on the input
      When the user presses "ArrowUp"
      Then "Apples" is the active suggestion
      And focus stays on the input

    Scenario: Enter selects the active suggestion
      Given an autocomplete with the fruit suggestions open
      When the user presses "ArrowDown" and then "Enter"
      Then the input shows "Apples"
      And the "Apples" option is selected with a component value of "Apples"

    Scenario: Enter commits the active suggestion with reduced motion
      Given the user prefers reduced motion
      And an autocomplete with the fruit suggestions open
      When the user presses "ArrowDown"
      Then "Apples" is the active suggestion
      When the user presses "Enter"
      Then the input shows "Apples"
      And the "Apples" option is selected with a component value of "Apples"
      And the combobox is collapsed
      And the suggestion panel is removed
      And the input no longer references an active suggestion
      And focus stays on the input

    Scenario: The first suggestion can be activated automatically
      Given an autocomplete that automatically activates its first suggestion
      When the user focuses the input
      Then "Apples" is the active suggestion
      When the user presses "Enter"
      Then the input shows "Apples"
      And the "Apples" option is selected with a component value of "Apples"

    Scenario Outline: Dismissing an active suggestion by keyboard
      Given an autocomplete with the fruit suggestions open
      When the user presses "ArrowDown"
      Then "Apples" is the active suggestion
      When the user presses "<key>"
      Then the combobox is collapsed
      And the input no longer references an active suggestion
      And <focus>

      Examples:
        | key    | focus                           |
        | Escape | focus stays on the input        |
        | Tab    | focus moves to the next control |

    Scenario: Down Arrow reopens the list after Escape
      Given an autocomplete with the fruit suggestions open
      When the user presses "Escape"
      Then the combobox is collapsed
      And focus stays on the input
      When the user presses "ArrowDown"
      Then the input is exposed as an expanded combobox linked to a listbox
      And the visible suggestions are "Apples, Oranges, Bananas"
      And focus stays on the input

    Scenario: Returning focus while the list is closing reopens it
      Given an autocomplete with the fruit suggestions open
      Then the visible suggestions are "Apples, Oranges, Bananas"
      When focus leaves and immediately returns to the input
      Then the input is exposed as an expanded combobox linked to a listbox
      And the visible suggestions are "Apples, Oranges, Bananas"
      And focus stays on the input

    Scenario: Arrow navigation skips disabled suggestions in both directions
      Given an autocomplete with "Oranges" disabled
      When the user focuses the input
      Then the "Oranges" suggestion is exposed as disabled
      When the user presses "ArrowDown"
      Then "Apples" is the active suggestion
      When the user presses "ArrowDown"
      Then "Bananas" is the active suggestion
      When the user presses "ArrowUp"
      Then "Apples" is the active suggestion
      And focus stays on the input

    Scenario: A read-only input does not open suggestions
      Given an autocomplete linked to a read-only input
      When the user focuses the input
      Then the combobox is collapsed
      And no suggestion panel is visible

    Scenario: Removing autocomplete cleans up the popup and its ARIA references
      Given an autocomplete with the fruit suggestions open
      Then the input is exposed as an expanded combobox linked to a listbox
      When the user presses "ArrowDown"
      Then "Apples" is the active suggestion
      When the application removes the autocomplete
      Then the suggestion panel is removed
      And the remaining input is a textbox with no suggestion references

    Scenario: Moving autocomplete in the DOM preserves its linked input behavior
      Given an autocomplete with fruit suggestions
      When the application moves autocomplete to a new DOM parent
      And the user focuses the input
      Then the input is exposed as an expanded combobox linked to a listbox
      And the visible suggestions are "Apples, Oranges, Bananas"

    Scenario: The suggestion panel can be styled with custom classes
      Given an autocomplete with the panel classes "fancy wide"
      When the user focuses the input
      Then the visible suggestions are "Apples, Oranges, Bananas"
      And the suggestion panel has both custom classes

  Rule: Suggestions are filtered by the current input

    Scenario: The default filter matches a substring regardless of case
      Given an autocomplete with fruit suggestions
      When the user types "BAN"
      Then the visible suggestions are "Bananas"
      When the user types "ANA"
      Then the visible suggestions are "Bananas"

    Scenario: A case-sensitive filter distinguishes uppercase and lowercase
      Given an autocomplete with case-sensitive filtering
      When the user types "ban"
      Then no suggestions match
      When the user types "Ban"
      Then the visible suggestions are "Bananas"

    Scenario Outline: Switching the built-in filter changes which suggestions match
      Given an autocomplete with the "<filter>" filter
      When the user types "<term>"
      Then the visible suggestions are "<suggestions>"

      Examples:
        | filter      | term | suggestions             |
        | starts-with | an   |                         |
        | starts-with | ba   | Bananas                 |
        | ends-with   | les  | Apples                  |
        | ends-with   | app  |                         |
        | none        | zzz  | Apples, Oranges, Bananas |

    Scenario: An application can supply its own filter
      Given an autocomplete with a custom case-insensitive prefix filter
      When the user types "AN"
      Then no suggestions match
      When the user types "BAN"
      Then the visible suggestions are "Bananas"

    Scenario: Filtering hides empty groups and clearing the filter restores them
      Given an autocomplete with grouped fruit suggestions
      When the user focuses the input
      Then the "Orchard" group contains the "Apples" suggestion
      And the "Tropical" group contains the "Bananas" suggestion
      When the user types "ban"
      Then the visible suggestions are "Bananas"
      And the "Orchard" group is not exposed
      And the "Tropical" group contains the "Bananas" suggestion
      When the user clears the input
      Then the visible suggestions are "Apples, Oranges, Bananas"
      And the "Orchard" group contains the "Apples" suggestion
      And the "Tropical" group contains the "Oranges" suggestion

  Rule: The application can load suggestions on demand

    Scenario: Focusing an empty autocomplete requests suggestions
      Given an autocomplete without suggestions that records queries
      When the user focuses the input
      Then a query is emitted with an empty term

    Scenario: Typing emits a query containing the entered term
      Given an autocomplete without suggestions that records queries
      When the user focuses the input
      And the user types "pear"
      Then the latest query contains "pear"

    Scenario: Async results replace the loading message without moving focus
      Given an autocomplete with fruit suggestions
      When the user types "ap"
      Then the visible suggestions are "Apples"
      When the application clears the old suggestions and starts loading
      Then the suggestion panel displays "Loading..."
      And the polite live region contains "Loading..."
      And focus stays on the input
      When the application receives "Apricots, Apricot halves"
      Then the visible suggestions are "Apricots, Apricot halves"
      And the suggestion panel does not display "Loading..."
      And focus stays on the input
      And the polite live region contains "2 options"

    Scenario: An empty async response replaces loading with a no-options message
      Given an autocomplete with fruit suggestions
      When the user types "ap"
      Then the visible suggestions are "Apples"
      When the application clears the old suggestions and starts loading
      Then the suggestion panel displays "Loading..."
      And the polite live region contains "Loading..."
      When the application receives no suggestions
      Then no suggestions match
      And the suggestion panel displays "No options"
      And the suggestion panel does not display "Loading..."
      And focus stays on the input
      And the polite live region contains "No options"

    Scenario: An empty async response closes the popup when the empty state is hidden
      Given an autocomplete that hides its empty-state message
      When the user types "ap"
      Then the visible suggestions are "Apples"
      When the application clears the old suggestions and starts loading
      Then the suggestion panel displays "Loading..."
      And the polite live region contains "Loading..."
      When the application receives no suggestions
      Then the combobox is collapsed
      And the suggestion panel does not display "No options"
      And the suggestion panel is removed
      And focus stays on the input
      And the polite live region contains "No options"

    Scenario: Async results do not reopen the popup after the user tabs away
      Given an autocomplete with fruit suggestions
      When the user types "ap"
      Then the visible suggestions are "Apples"
      When the application clears the old suggestions and starts loading
      Then the suggestion panel displays "Loading..."
      When the user presses "Tab"
      Then focus moves to the next control
      And the combobox is collapsed
      And no suggestion panel is visible
      When the application receives "Apricots, Apricot halves"
      Then the autocomplete has received "Apricots, Apricot halves"
      And the combobox is collapsed
      And no suggestion panel is visible
      And focus stays on the next control
      When the user presses "Shift+Tab"
      Then focus returns to the input
      And the input is exposed as an expanded combobox linked to a listbox
      And the visible suggestions are "Apricots, Apricot halves"

  Rule: Pointer selection commits only enabled options

    Scenario: Clicking an enabled option commits its label and value
      Given an autocomplete with the fruit suggestions open and changes recorded
      When the user clicks the "Oranges" suggestion
      Then the input shows "Oranges"
      And the "Oranges" option is selected with a component value of "orange-id"
      And the autocomplete emits 1 change event
      And the combobox is collapsed
      And focus stays on the input

    Scenario: Clicking a disabled option does not change the selection
      Given an autocomplete with "Bananas" disabled and changes recorded
      When the user focuses the input
      Then the "Bananas" suggestion is exposed as disabled
      When the user attempts to click the disabled "Bananas" suggestion
      Then the input is empty
      And no option is selected
      And the combobox is expanded
      And focus stays on the input
      And the autocomplete emits 0 change events

    Scenario: Disabling an option while the popup is open updates keyboard and pointer selection
      Given an autocomplete with the fruit suggestions open and changes recorded
      Then the "Oranges" suggestion is enabled
      When the application disables the "Oranges" option
      Then the "Oranges" suggestion is exposed as disabled
      When the user presses "ArrowDown"
      Then "Apples" is the active suggestion
      When the user presses "ArrowDown"
      Then "Bananas" is the active suggestion
      When the user attempts to click the disabled "Oranges" suggestion
      Then the input is empty
      And no option is selected
      And the combobox is expanded
      And focus stays on the input
      And the autocomplete emits 0 change events

  Rule: Clearing the input removes the committed value

    Scenario: Clearing the input removes a committed selection
      Given an autocomplete with the fruit suggestions open and changes recorded
      When the user clicks the "Oranges" suggestion
      Then the "Oranges" option is selected with a component value of "orange-id"
      And the autocomplete emits 1 change event
      And the combobox is collapsed
      When the user clears the input
      Then the input is empty
      And no option is selected
      And the autocomplete emits 2 change events

    Scenario: The application clears a selection and closes the open suggestions
      Given an autocomplete with the fruit suggestions open and changes recorded
      When the user clicks the "Oranges" suggestion
      Then the "Oranges" option is selected with a component value of "orange-id"
      And the autocomplete emits 1 change event
      And the combobox is collapsed
      When the user presses "ArrowDown"
      Then the combobox is expanded
      When the application calls clear()
      Then the input is empty
      And no option is selected
      And the autocomplete emits 2 change events
      And the combobox is collapsed
      And focus stays on the input

    Scenario: The application clears a selection and restores input focus
      Given an autocomplete with the fruit suggestions open and changes recorded
      When the user clicks the "Oranges" suggestion
      Then the "Oranges" option is selected with a component value of "orange-id"
      And the autocomplete emits 1 change event
      And the combobox is collapsed
      When the user leaves the input
      Then focus moves to the next control
      When the application calls clear(true)
      Then the input is empty
      And no option is selected
      And the autocomplete emits 2 change events
      And focus returns to the input

  Rule: The panel communicates empty and loading states

    Scenario: Custom loading content replaces the visual message but not the announcement
      Given an autocomplete with custom loading and empty-state content
      When the user types "ap"
      Then the visible suggestions are "Apples"
      When the application clears the old suggestions and starts loading
      Then the suggestion panel displays "Searching for fruit"
      And the suggestion panel does not display "Loading..."
      And the suggestion panel does not display "Try another fruit"
      And the polite live region contains "Loading..."
      When the application receives "Apricots"
      Then the visible suggestions are "Apricots"
      And the suggestion panel does not display "Searching for fruit"

    Scenario: Custom empty-state content replaces the visual message but not the announcement
      Given an autocomplete with custom loading and empty-state content
      When the user focuses the input
      Then the visible suggestions are "Apples, Oranges, Bananas"
      When the user types "pea"
      Then no suggestions match
      And the suggestion panel displays "Try another fruit"
      And the suggestion panel does not display "No options"
      And the polite live region contains "No options"
      When the application receives "Pears"
      Then the visible suggestions are "Pears"
      And the suggestion panel does not display "Try another fruit"

    Scenario Outline: The empty-state message can use the default or a custom label
      Given an autocomplete with <label>
      When the user types "zzz"
      Then no suggestions match
      And the suggestion panel displays "<message>"

      Examples:
        | label                        | message      |
        | the default empty-state label | No options   |
        | an empty-state label of "Nothing here" | Nothing here |

    Scenario: The empty-state message can be suppressed
      Given an autocomplete that hides its empty-state message
      When the user types "zzz"
      Then no suggestions match
      And the suggestion panel does not display "No options"

    Scenario Outline: The loading message can be shown, customized, or suppressed
      Given an autocomplete that is loading with <label>
      When the user focuses the input
      Then the suggestion panel <result>

      Examples:
        | label                                 | result                          |
        | the default loading label             | displays "Loading..."          |
        | a loading label of "Finding fruit..." | displays "Finding fruit..."    |
        | its loading message hidden            | does not display "Loading..."  |

  Rule: Leaving the input reconciles typed text with the committed selection

    Scenario: Leaving an optional autocomplete keeps edited text without committing a value
      Given an autocomplete with the fruit suggestions open and changes recorded
      When the user clicks the "Oranges" suggestion
      Then the "Oranges" option is selected with a component value of "orange-id"
      And the autocomplete emits 1 change event
      And the combobox is collapsed
      When the user types "Pear"
      And the user presses "Tab"
      Then the input shows "Pear"
      And no option is selected
      And the autocomplete emits 2 change events
      And focus moves to the next control

    Scenario: Leaving the input clears unselected text when selection is required
      Given an autocomplete that requires an option to be selected
      When the user types "zzz"
      And the user leaves the input
      Then the input is empty

    Scenario: Leaving the input restores the previously selected option
      Given a required autocomplete with "Apples" already selected
      When the user types "zzz"
      And the user leaves the input
      Then the input shows "Apples"
      And the "Apples" option is selected with a component value of "Apples"
