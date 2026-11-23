Feature: Navigation bar
  Navigation bars present accessible destinations, track the current destination, and keep selection consistent as
  destinations move.

  Rule: The bar exposes accessible navigation semantics

    Scenario: The bar is a labelled navigation landmark that marks the current destination

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      Then the bar is exposed as the "Primary" navigation landmark
      And destination "Home" is the current page
      And destination "Search" is not the current page
      And destinations do not expose selected or pressed states
      And destination "Settings" is exposed as disabled
      And only the icon of destination "Home" is filled

    Scenario: A destination with an href is exposed as a link

      Given a navigation bar with a linked destination
      When the navigation bar renders
      Then destination link "Home" points to "/home"

  Rule: Selecting a destination updates the current destination

    Scenario: Clicking a destination selects it and notifies listeners

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the application listens for navigation events
      When the user clicks destination "Search"
      Then destination "Search" is the current page
      And destination "Home" is not the current page
      And only the icon of destination "Search" is filled
      And the bar reports "search" as selected
      And the navigation events "beforeinput, input, change" were dispatched

    Scenario Outline: Keyboard activation selects the focused destination

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the user focuses destination "Search"
      When the user presses "<key>" on the navigation bar
      Then destination "Search" is the current page
      And destination "Home" is not the current page

      Examples:
        | key   |
        | Enter |
        | Space |

    Scenario: Canceling beforeinput prevents selection

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the application cancels navigation changes
      When the user clicks destination "Search"
      Then destination "Search" is not the current page
      And destination "Home" is the current page

    Scenario: A disabled destination cannot be selected

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the application listens for navigation events
      When the user attempts to click disabled destination "Settings"
      Then destination "Settings" is not the current page
      And destination "Home" is the current page
      And no navigation events were dispatched

    Scenario: A disabled interactive destination remains focusable but cannot be selected

      Given a navigation bar with a disabled interactive search destination
      When the navigation bar renders
      And the user focuses destination "Search"
      Then destination "Search" is focused
      And destination "Search" is exposed as disabled
      When the user presses "Enter" on the navigation bar
      Then destination "Search" is not the current page
      And destination "Home" is the current page

  Rule: Keyboard focus moves through enabled destinations in order

    Scenario: Tab visits each enabled destination and skips disabled ones

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the user focuses the control before the bar
      When the user presses "Tab" on the navigation bar
      Then destination "Home" is focused
      When the user presses "Tab" on the navigation bar
      Then destination "Search" is focused
      When the user presses "Tab" on the navigation bar
      Then focus moves past the navigation bar

  Rule: Selection stays consistent as destinations move

    Scenario: A destination added later participates in single selection

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the application adds destination "Inbox"
      When the user clicks destination "Inbox"
      Then destination "Inbox" is the current page
      And destination "Home" is not the current page
      And the bar reports "inbox" as selected

    Scenario: Adding a selected destination preserves the existing selection

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the application adds selected destination "Inbox"
      Then destination "Home" is the current page
      And destination "Inbox" is not the current page
      And the bar reports "home" as selected

    Scenario: Removing the selected destination clears the bar selection

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the application removes destination "Home"
      Then the bar reports no selection
      And the bar has 2 destinations

    Scenario: A destination moved to another bar joins that bar's layout and selection

      Given a compact primary bar and an expanded secondary bar
      When the navigation bar renders
      And the application moves destination "Search" to the secondary bar
      Then the primary bar has 1 destination
      And destination "Search" is laid out "horizontal"
      When the user clicks destination "Search"
      Then destination "Search" is the current page
      And destination "Inbox" is not the current page
      And destination "Home" is the current page

    Scenario: A selected destination moved into another bar does not replace its selection

      Given a compact primary bar and an expanded secondary bar
      When the navigation bar renders
      And the application moves destination "Home" to the secondary bar
      Then destination "Inbox" is the current page
      And destination "Home" is not the current page
