Feature: Navigation rail
  Navigation rails present accessible destinations alongside an optional toggle and action, switch between compact and
  expanded presentations, and keep selection and keyboard focus consistent as destinations change.

  Rule: The rail is an accessible navigation landmark

    Scenario: A labelled rail starts compact and marks the current destination

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      Then the rail is exposed as the "Primary" navigation landmark
      And rail destination "Home" is the current page
      And rail destination "Search" is not the current page
      And rail destination "Settings" is exposed as disabled
      And the rail mode is "compact"
      And every rail destination is laid out "vertical"
      And the rail is 96px wide

  Rule: Selecting a destination updates the current destination

    Scenario: Clicking a destination selects it and deselects the previous one

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the user clicks rail destination "Search"
      Then rail destination "Search" is the current page
      And rail destination "Home" is not the current page
      And the rail reports "search" as selected

    Scenario Outline: Keyboard activation selects the focused destination

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the user focuses rail destination "Search"
      And the user presses "<key>" on the navigation rail
      Then rail destination "Search" is the current page
      And rail destination "Home" is not the current page

      Examples:
        | key   |
        | Enter |
        | Space |

    Scenario: A disabled destination cannot be selected

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the user attempts to click disabled rail destination "Settings"
      Then rail destination "Settings" is not the current page
      And rail destination "Home" is the current page

  Rule: Keyboard focus roves between enabled controls

    Scenario: The rail is a single tab stop that rests on the current destination

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the user focuses the control before the rail
      And the user presses "Tab" on the navigation rail
      Then rail destination "Home" is focused
      When the user presses "Tab" on the navigation rail
      Then focus moves past the navigation rail

    Scenario: Arrow keys move through enabled controls and wrap

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the user focuses rail destination "Home"
      And the user presses "ArrowDown" on the navigation rail
      Then rail destination "Search" is focused
      When the user presses "ArrowDown" on the navigation rail
      Then the rail menu button is focused
      When the user presses "ArrowUp" on the navigation rail
      Then rail destination "Search" is focused
      When the user presses "ArrowUp" on the navigation rail
      Then rail destination "Home" is focused

    Scenario: Home and End jump to the first and last enabled controls

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the user focuses rail destination "Home"
      And the user presses "End" on the navigation rail
      Then rail destination "Search" is focused
      When the user presses "Home" on the navigation rail
      Then the rail menu button is focused

  Rule: The mode determines presentation

    Scenario Outline: Each mode sets destination orientation and rail width

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations in mode "<mode>"
      When the navigation rail renders
      Then every rail destination is laid out "<orientation>"
      And the rail is <width>px wide

      Examples:
        | mode     | orientation | width |
        | compact  | vertical    | 96    |
        | expanded | horizontal  | 220   |
        | bogus    | vertical    | 96    |

    Scenario: Changing the mode updates orientation and width

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the application sets the rail mode to "expanded"
      Then every rail destination is laid out "horizontal"
      And the rail is 220px wide
      When the application sets the rail mode to "compact"
      Then every rail destination is laid out "vertical"
      And the rail is 96px wide

    Scenario: Auto mode follows the viewport

      Given a narrow viewport
      And a navigation rail with a menu toggle and home, search, and disabled settings destinations in mode "auto"
      When the navigation rail renders
      Then every rail destination is laid out "vertical"
      When the viewport widens
      Then every rail destination is laid out "horizontal"
      When the viewport narrows
      Then every rail destination is laid out "vertical"

    Scenario: A floating action button is extended only when expanded

      Given a navigation rail with a compose action
      When the navigation rail renders
      Then the compose action is not extended
      When the application sets the rail mode to "expanded"
      Then the compose action is extended
      When the application sets the rail mode to "compact"
      Then the compose action is not extended

    Scenario: A floating action button added to an expanded rail is extended

      Given a navigation rail with a compose action in mode "expanded"
      When the navigation rail renders
      And the application adds a second action to the rail
      Then the added action is extended

    Scenario: Width changes animate unless reduced motion is preferred

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      Then the rail animates width changes

    Scenario: Reduced motion disables the width animation

      Given the user has reduced motion enabled
      And a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      Then the rail does not animate width changes

  Rule: The toggle switches between compact and expanded

    Scenario: Activating the toggle expands and collapses the rail

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      Then the rail menu button controls the rail
      And the rail menu button is collapsed and not selected
      When the user clicks the rail menu button
      Then every rail destination is laid out "horizontal"
      And the rail menu button is expanded and selected
      When the user clicks the rail menu button
      Then every rail destination is laid out "vertical"
      And the rail menu button is collapsed and not selected

    Scenario Outline: Keyboard activation toggles the rail

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the user focuses the rail menu button
      And the user presses "<key>" on the navigation rail
      Then every rail destination is laid out "horizontal"
      When the user presses "<key>" on the navigation rail
      Then every rail destination is laid out "vertical"

      Examples:
        | key   |
        | Enter |
        | Space |

    Scenario: The toggle stays in sync when the mode changes without a click

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the application sets the rail mode to "expanded"
      Then the rail menu button is expanded and selected
      When the application sets the rail mode to "compact"
      Then the rail menu button is collapsed and not selected

    Scenario: The toggle stays in sync when auto mode crosses a breakpoint

      Given a narrow viewport
      And a navigation rail with a menu toggle and home, search, and disabled settings destinations in mode "auto"
      When the navigation rail renders
      Then the rail menu button is collapsed and not selected
      When the viewport widens
      Then the rail menu button is expanded and selected
      When the viewport narrows
      Then the rail menu button is collapsed and not selected

    Scenario: A non-toggle button reports expansion without a selected state

      Given a navigation rail with a plain menu button toggle
      When the navigation rail renders
      And the user clicks the rail menu button
      Then the rail menu button is expanded and not selected

    Scenario: Removing the toggle clears the references on its button

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the application removes the rail toggle
      Then the rail menu button has no expansion state and controls nothing

    Scenario: Retargeting the toggle moves its references to the new rail

      Given a navigation rail with a menu toggle and a secondary rail
      When the navigation rail renders
      And the application retargets the rail toggle to "secondary"
      Then the rail menu button controls "secondary"
      When the user clicks the rail menu button
      Then the rail "secondary" is 220px wide
      And the rail "rail" is 96px wide

    Scenario: Clearing the toggle target clears the references on its button

      Given a navigation rail with a menu toggle and a secondary rail
      When the navigation rail renders
      And the application clears the rail toggle target
      Then the rail menu button has no expansion state and controls nothing

  Rule: Rails on the same page are independent

    Scenario: Selecting a destination in one rail leaves another rail's selection alone

      Given a navigation rail with a menu toggle and a secondary rail
      When the navigation rail renders
      And the user clicks rail destination "Search"
      Then the rail "rail" has "search" selected
      And the rail "secondary" has "inbox" selected

  Rule: Destinations can change after the rail renders

    Scenario: A destination added later joins selection and keyboard navigation

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the application adds rail destination "Inbox"
      And the user clicks rail destination "Inbox"
      Then rail destination "Inbox" is the current page
      And rail destination "Home" is not the current page
      When the user presses "ArrowUp" on the navigation rail
      Then rail destination "Search" is focused

    Scenario: A moved rail keeps a working toggle

      Given a navigation rail with a menu toggle and home, search, and disabled settings destinations
      When the navigation rail renders
      And the application moves the rail to another container
      And the user clicks the rail menu button
      Then every rail destination is laid out "horizontal"
      And the rail menu button is expanded and selected
