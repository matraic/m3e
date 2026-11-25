Feature: Search

  A search bar is a prominent entry point for search. A search view expands from its bar to show results, either
  docked beneath the bar or covering the screen.

  Rule: A search bar gives its input search semantics

    Scenario: The slotted input becomes a searchbox

      Given a search bar
      When the search renders
      Then the search input is exposed as a searchbox named "Search"
      And the search input has input mode "search"

    Scenario: Clicking the bar focuses its input

      Given a search bar
      When the search renders
      And the user clicks the empty space of the search bar
      Then the search input is focused

    Scenario: A replaced input takes over the bar's behavior

      Given a clearable search bar labelled "Clear search"
      When the search renders
      And the application replaces the search input
      And the user types "apple" in the search input
      Then the search input is exposed as a searchbox named "Replacement"
      And the "Clear search" search button is visible

  Rule: A clearable bar offers a button to clear the term

    Scenario: The clear button appears only while the input has text

      Given a clearable search bar labelled "Clear search"
      When the search renders
      Then the "Clear search" search button is hidden
      When the user types "apple" in the search input
      Then the "Clear search" search button is visible
      When the user empties the search input
      Then the "Clear search" search button is hidden

    Scenario: A bar that is not clearable has no clear button

      Given a search bar
      When the search renders
      And the user types "apple" in the search input
      Then the search has no buttons

    Scenario: Clearing empties the input, refocuses it and dispatches clear

      Given a clearable search bar labelled "Clear search"
      When the search renders
      And the search records the events "clear"
      And the user types "apple" in the search input
      And the user activates the "Clear search" search button
      Then the search input is empty
      And the search input is focused
      And the search events are "clear"

    Scenario: Clearing notifies listeners that the input changed

      Given a clearable search bar labelled "Clear search"
      When the search renders
      And the user types "apple" in the search input
      And the search records the events "input"
      And the application clears the search
      Then the search events are "input"

    Scenario: Clearing an empty input does nothing

      Given a clearable search bar labelled "Clear search"
      When the search renders
      And the search records the events "clear,input"
      And the application clears the search
      Then the search events are ""

  Rule: A search view exposes its input and results

    Scenario: The input is a searchbox that opens a dialog

      Given a search view
      When the search renders
      Then the search input is exposed as a searchbox named "Search"
      And the search input has popup "dialog"

    Scenario: A closed view hides its results

      Given a search view
      When the search renders
      Then the search view is closed
      And the search results are hidden
      And the search has no dialog

    Scenario: An open view is a modal dialog that makes the page inert

      Given a search view that is open
      When the search renders
      Then the search view has a dialog
      And the search results are visible
      And the content outside the search view is inert

    Scenario: Leading content follows the open state

      Given a search view
      When the search renders
      Then the search text "Closed lead" is visible
      And the search text "Open lead" is hidden
      When the user focuses the search input
      Then the search text "Open lead" is visible
      And the search text "Closed lead" is hidden

    Scenario: The search icon can be hidden while the view is closed

      Given a search view that hides its search icon
      When the search renders
      Then the search icon is hidden
      When the user focuses the search input
      Then the search view has a dialog
      And the "Close" search button is visible

  Rule: A search view opens and closes

    Scenario: Focusing the input opens the view

      Given a search view
      When the search renders
      And the user focuses the search input
      Then the search view is open
      And the search results are visible
      And the search view has a dialog

    Scenario: The open attribute opens the view

      Given a search view that is open
      When the search renders
      Then the search results are visible

    Scenario: Typing into a closed view opens it

      Given a search view
      When the search renders
      And the application dispatches an input event on the search input
      Then the search view is open

    Scenario: Clicking the focused input reopens a view closed with Escape

      Given a search view
      When the search renders
      And the user focuses the search input
      And the user presses "Escape" in the search view
      Then the search view is closed
      When the user clicks the search input
      Then the search view is open

    Scenario: Escape closes the view when there is no term

      Given a search view that is open
      When the search renders
      And the user presses "Escape" in the search view
      Then the search view is closed
      And the search results are hidden

    Scenario: Escape clears the term and then closes the view

      Given a search view that is open
      When the search renders
      And the user types "apple" in the search input
      And the user presses "Escape" in the search view
      Then the search input is empty
      And the search view is closed

    Scenario: Escape from another control in the view closes it

      Given a search view that is open
      When the search renders
      And the user focuses the "Close" search button
      And the user presses "Escape" in the search view
      Then the search view is closed
      And the search input is focused

    Scenario: The back button closes the view and returns to the input

      Given a search view that is open
      When the search renders
      And the user activates the leading search button
      Then the search view is closed
      And the search input is focused

    Scenario: The back button clears any term as it closes

      Given a search view that is open
      When the search renders
      And the user types "apple" in the search input
      And the user activates the leading search button
      Then the search input is empty
      And the search view is closed

    Scenario: Closing releases the page

      Given a search view that is open
      When the search renders
      And the user presses "Escape" in the search view
      Then the content outside the search view is not inert
      And the page scrolling is not locked

    Scenario: Changing the mode closes an open view

      Given a search view that is open
      When the search renders
      And the application sets the search mode to "fullscreen"
      Then the search view is closed

  Rule: A search view reports its toggle state

    Scenario: Opening dispatches beforetoggle and toggle

      Given a search view
      When the search renders
      And the search records the events "beforetoggle,toggle"
      And the user focuses the search input
      Then the search events are "beforetoggle:open,toggle:open"

    Scenario: Closing dispatches beforetoggle and toggle

      Given a search view that is open
      When the search renders
      And the search view finishes opening
      And the search records the events "beforetoggle,toggle"
      And the user presses "Escape" in the search view
      Then the search events are "beforetoggle:closed,toggle:closed"

    Scenario: Canceling beforetoggle keeps the view closed

      Given a search view
      When the search renders
      And the application cancels the search toggle to "open"
      And the user focuses the search input
      Then the search view is closed
      And the search results are hidden

    Scenario: Canceling beforetoggle keeps the view open

      Given a search view that is open
      When the search renders
      And the search view finishes opening
      And the application cancels the search toggle to "closed"
      And the user presses "Escape" in the search view
      Then the search view is open
      And the search results are visible

  Rule: A search view reports the term as it changes

    Scenario: Typing dispatches a query for each change while open

      Given a search view
      When the search renders
      And the search records the events "query"
      And the user focuses the search input
      And the search view finishes opening
      And the user types "ab" one key at a time in the search input
      Then the search events are "query:,query:a,query:ab"

    Scenario: Opening reports the term already in the input

      Given a search view whose input starts with "apple"
      When the search renders
      And the search records the events "query"
      And the user focuses the search input
      Then the search events are "query:apple"

    Scenario: Clearing from the application dispatches query and clear

      Given a search view that is open
      When the search renders
      And the search view finishes opening
      And the user types "apple" in the search input
      And the search records the events "query,clear"
      And the application clears the search
      Then the search input is empty
      And the search events are "query:,clear"

  Rule: A search view offers a button to clear the term or close the view

    Scenario: The trailing button closes the view while the term is empty

      Given a search view that is open
      When the search renders
      Then the trailing search button is named "Close"
      When the user activates the trailing search button
      Then the search view is closed
      And the search input is focused

    Scenario: The trailing button clears the term and keeps the view open

      Given a search view that is open
      When the search renders
      And the search view finishes opening
      And the search records the events "query,clear"
      And the user types "apple" in the search input
      Then the trailing search button is named "Clear"
      When the user activates the trailing search button
      Then the search input is empty
      And the search view is open
      And the search events are "query:apple,query:,clear"

    Scenario: The buttons use custom labels

      Given a search view with the clear label "Erase" and the close label "Dismiss"
      When the search renders
      And the user focuses the search input
      Then the trailing search button is named "Dismiss"
      When the user types "apple" in the search input
      Then the trailing search button is named "Erase"

  Rule: A docked view closes when focus leaves it

    Scenario: Focus leaving clears the term and closes the view

      Given a search view that is open
      When the search renders
      And the user types "apple" in the search input
      And focus leaves the search view
      Then the search input is empty
      And the search view is closed

    Scenario Outline: The results align with the bar

      Given a search view that is open
      And the page reads <direction>
      When the search renders
      Then the search results panel is aligned with the bar

      Examples:
        | direction     |
        | left to right |
        | right to left |

    Scenario: Page scrolling is locked while open

      Given a search view that is open
      When the search renders
      Then the page scrolling is locked

  Rule: A fullscreen view covers the screen

    Scenario Outline: The view fills the viewport

      Given a fullscreen search view
      And <motion> motion for the search
      When the search renders
      And the user focuses the search input
      Then the search view is open
      And the search results panel fills the viewport

      Examples:
        | motion  |
        | normal  |
        | reduced |

    Scenario Outline: Escape closes the view

      Given a fullscreen search view that is open
      And <motion> motion for the search
      When the search renders
      And the search view finishes opening
      And the search records the events "beforetoggle,toggle"
      And the user presses "Escape" in the search view
      Then the search view is closed
      And the search events are "beforetoggle:closed,toggle:closed"

      Examples:
        | motion  |
        | normal  |
        | reduced |

    Scenario: Focus leaving does not close the view

      Given a fullscreen search view that is open
      When the search renders
      And the search view finishes opening
      And focus leaves the search view
      Then the search view is open

  Rule: A search view follows its mode

    Scenario Outline: The current mode follows the mode

      Given a search view with mode "<mode>"
      When the search renders
      Then the search view reports the current mode "<current>"

      Examples:
        | mode       | current    |
        | docked     | docked     |
        | fullscreen | fullscreen |
        | bogus      | docked     |

    Scenario Outline: An automatic mode follows the viewport

      Given a search view with mode "auto"
      And a viewport <width> pixels wide
      When the search renders
      Then the search view reports the current mode "<current>"

      Examples:
        | width | current    |
        | 400   | fullscreen |
        | 1200  | docked     |

    Scenario: Crossing the breakpoint switches the mode and closes an open view

      Given a search view with mode "auto" that is open
      And a viewport 1200 pixels wide
      When the search renders
      And the search viewport becomes 400 pixels wide
      Then the search view reports the current mode "fullscreen"
      And the search view is closed

    Scenario: A moved view keeps following the viewport

      Given a search view with mode "auto"
      And a viewport 1200 pixels wide
      When the search renders
      And the application moves the search view
      And the search viewport becomes 400 pixels wide
      Then the search view reports the current mode "fullscreen"
