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

  Rule: The mode determines destination orientation

    Scenario: Compact and expanded modes switch destination orientation

      Given a navigation bar layout fixture
      When the navigation bar layout renders
      Then every destination is laid out "vertical"
      When the application sets the bar mode to "expanded"
      Then every destination is laid out "horizontal"
      When the application sets the bar mode to "compact"
      Then every destination is laid out "vertical"

    Scenario: An invalid mode falls back to compact

      Given a navigation bar layout fixture in mode "bogus"
      When the navigation bar layout renders
      Then the bar mode is "compact"
      And every destination is laid out "vertical"

    Scenario: Destinations added later adopt the current orientation

      Given a navigation bar layout fixture in mode "expanded"
      When the navigation bar layout renders
      And the application adds a layout destination
      Then every destination is laid out "horizontal"

  Rule: Auto mode follows the viewport

    Scenario: Auto mode is compact on small viewports and expanded on large ones

      Given a small viewport
      And a navigation bar layout fixture in mode "auto"
      When the navigation bar layout renders
      Then every destination is laid out "vertical"
      When the viewport becomes large
      Then every destination is laid out "horizontal"
      When the viewport becomes small
      Then every destination is laid out "vertical"

    Scenario: A moved auto mode bar keeps following the viewport

      Given a small viewport
      And a navigation bar layout fixture in mode "auto"
      When the navigation bar layout renders
      And the application moves the bar to another container
      Then every destination is laid out "vertical"
      When the viewport becomes large
      Then every destination is laid out "horizontal"

    Scenario: Leaving auto mode stops following the viewport

      Given a small viewport
      And a navigation bar layout fixture in mode "auto"
      When the navigation bar layout renders
      And the application sets the bar mode to "compact"
      When the viewport becomes large
      Then every destination is laid out "vertical"

  Rule: Destination shapes remain consistent across orientations

    Scenario: Item layers keep their shape with an independent focus ring shape

      Given a navigation bar layout fixture with bevel items and a round focus ring
      When the navigation bar layout renders
      Then the destination layers use the bevel shape
      And the destination focus ring is round with a 12px radius
      When the application sets the bar mode to "expanded"
      Then every destination is laid out "horizontal"
      And the destination focus ring is bevel with a 9999px radius
      And the destination layers use the bevel shape

  Rule: Focus remains accessible across layouts

    Scenario Outline: Keyboard focus shows a ring and pointer focus hides it

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the application sets the bar mode to "<mode>"
      And the user focuses the control before the bar
      And the user presses "Tab" on the navigation bar
      Then destination "Home" has a visible navigation focus ring
      When the user clicks destination "Search"
      Then destination "Search" is focused
      And destination "Search" has no visible navigation focus ring

      Examples:
        | mode     |
        | compact  |
        | expanded |

    Scenario: Re-enabling a destination restores its tab stop and activation

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the application enables destination "Settings"
      And the user focuses destination "Search"
      And the user presses "Tab" on the navigation bar
      Then destination "Settings" is focused
      When the user presses "Enter" on the navigation bar
      Then destination "Settings" is the current page
      And destination "Home" is not the current page

  Rule: Selected icons follow selection and slot changes

    Scenario: A selected icon replaces the default icon without changing the accessible name

      Given a navigation bar with a separate selected icon
      When the navigation bar renders
      Then the default Home icon is visible
      And the selected Home icon is hidden
      When the user clicks destination "Home"
      Then the selected Home icon is visible
      And the default Home icon is hidden
      And destination "Home" is the current page
      When the user clicks destination "Search"
      Then the default Home icon is visible
      And the selected Home icon is hidden

    Scenario: Adding and removing a selected icon restores the default icon

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the application adds a selected Home icon
      Then the selected Home icon is visible
      And the default Home icon is hidden
      When the application removes the selected Home icon
      Then the default Home icon is visible
      And destination "Home" is the current page

  Rule: Link activation preserves navigation semantics

    Scenario Outline: Activating a link selects and navigates

      Given a navigation bar with a fragment link
      When the navigation bar renders
      And the application listens for navigation events
      And the user activates the Home link using "<activation>"
      Then the navigation bar page fragment is "#home-page"
      And the Home navigation link is current
      And the bar reports "home" as selected
      And the navigation events "beforeinput, input, change" were dispatched

      Examples:
        | activation |
        | pointer    |
        | Enter      |
        | Space      |

    Scenario: A modified link click opens a new tab without navigating the current page

      Given a navigation bar with an external link
      When the navigation bar renders
      And the user opens the Home link in a new tab
      Then the navigation bar page fragment is ""

    Scenario: A disabled linked destination cannot be programmatically activated

      Given a navigation bar with a disabled fragment link
      When the navigation bar renders
      And the application listens for navigation events
      And the application dispatches a click on the Home link
      Then the bar reports no selection
      And no navigation events were dispatched
      And the navigation bar page fragment is ""

  Rule: Reconnection restores ownership without duplicate interaction

    Scenario: A moved bar retains membership and emits one event sequence

      Given a navigation bar with home, search, and disabled settings destinations
      When the navigation bar renders
      And the application listens for navigation events
      And the application moves the bar to another container
      Then the primary bar tracks destinations "home, search, settings" with matching owners
      When the user clicks destination "Search"
      Then the bar reports "search" as selected
      And the navigation events "beforeinput, input, change" were dispatched

    Scenario: Moving a destination updates both bars' public membership and ownership

      Given a compact primary bar and an expanded secondary bar
      When the navigation bar renders
      And the application moves destination "Search" to the secondary bar
      Then the primary bar tracks destinations "home" with matching owners
      And the secondary bar tracks destinations "inbox, search" with matching owners

    Scenario: Entering auto mode starts viewport monitoring

      Given a small viewport
      And a navigation bar layout fixture in mode "expanded"
      When the navigation bar layout renders
      Then every destination is laid out "horizontal"
      When the application sets the bar mode to "auto"
      Then the effective navigation bar mode is "compact"
      And every destination is laid out "vertical"
      When the viewport becomes large
      Then the effective navigation bar mode is "expanded"
      And every destination is laid out "horizontal"
