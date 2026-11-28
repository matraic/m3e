Feature: Toolbar
  A toolbar presents named actions in a keyboard-navigable group.

  Rule: The toolbar exposes its appearance and orientation

    Scenario: A toolbar has an accessible role and standard defaults
      Given a toolbar with three actions
      When the toolbar renders
      Then the toolbar is visible with role "toolbar"
      And the toolbar defaults to standard, square, and not elevated

    Scenario: Changing orientation updates its accessible state
      Given a toolbar with three actions
      When the toolbar renders
      And the application sets the toolbar vertical
      Then the toolbar exposes vertical orientation
      When the application sets the toolbar horizontal
      Then the toolbar does not expose vertical orientation

    Scenario: Variant, shape, and elevation are reflected
      Given a toolbar with attributes 'variant="vibrant" shape="rounded" elevated'
      When the toolbar renders
      Then the toolbar reflects its vibrant rounded elevated appearance

    Scenario: Elevation changes the elevation level
      Given a toolbar with three actions
      When the toolbar renders
      Then the toolbar elevation level is "0"
      When the application elevates the toolbar
      Then the toolbar elevation level is "3"

    Scenario: Invalid appearance values fall back to defaults
      Given a toolbar with attributes 'variant="x" shape="x"'
      When the toolbar renders
      Then the toolbar reflects its default variant and shape

    Scenario: A toolbar exposes its accessible name and actions
      Given a toolbar named "Editing" with three actions
      When the toolbar renders
      Then the toolbar is named "Editing"
      And the toolbar exposes the actions "One, Two, Three"

  Rule: Keyboard and pointer navigation maintain one tab stop

    Scenario: Only the first item is initially in the tab order
      Given a toolbar with three actions
      When the toolbar renders
      Then toolbar action tab indexes are "0, -1, -1"

    Scenario: Arrow keys, Home, and End move focus
      Given a toolbar with three actions
      When the toolbar renders
      And the user focuses toolbar action "One"
      And the user presses "ArrowRight" in the toolbar
      Then toolbar action "Two" is focused
      And toolbar action tab indexes are "-1, 0, -1"
      When the user presses "End" in the toolbar
      Then toolbar action "Three" is focused
      When the user presses "Home" in the toolbar
      Then toolbar action "One" is focused

    Scenario: Arrow keys wrap at the ends
      Given a toolbar with three actions
      When the toolbar renders
      And the user focuses toolbar action "One"
      And the user presses "ArrowLeft" in the toolbar
      Then toolbar action "Three" is focused
      When the user presses "ArrowRight" in the toolbar
      Then toolbar action "One" is focused

    Scenario Outline: Vertical arrows keep their direction in either writing direction
      Given a vertical toolbar with direction "<direction>"
      When the toolbar renders
      And the user focuses toolbar action "One"
      And the user presses "ArrowDown" in the toolbar
      Then toolbar action "Two" is focused
      When the user presses "ArrowUp" in the toolbar
      Then toolbar action "One" is focused

      Examples:
        | direction |
        | ltr       |
        | rtl       |

    Scenario: Horizontal arrows reverse in right-to-left
      Given a toolbar with direction "rtl"
      When the toolbar renders
      And the user focuses toolbar action "One"
      And the user presses "ArrowLeft" in the toolbar
      Then toolbar action "Two" is focused
      When the user presses "ArrowRight" in the toolbar
      Then toolbar action "One" is focused

    Scenario: Clicking an action makes it the tab stop
      Given a toolbar with three actions
      When the toolbar renders
      And the user clicks toolbar action "Three"
      Then toolbar action tab indexes are "-1, -1, 0"

    Scenario: The first enabled action is the initial tab stop
      Given a toolbar with its first action disabled
      When the toolbar renders
      Then toolbar action "Two" is a tab stop
      And toolbar action "One" is disabled

    Scenario: Keyboard navigation skips a disabled action
      Given a toolbar with its second action disabled
      When the toolbar renders
      And the user focuses toolbar action "One"
      And the user presses "ArrowRight" in the toolbar
      Then toolbar action "Three" is focused
      And toolbar action "Two" is disabled

    Scenario: Newly added actions join keyboard navigation
      Given a toolbar with three actions
      When the toolbar renders
      And the application adds toolbar action "Four"
      Then toolbar action tab indexes are "0, -1, -1, -1"
      When the user clicks toolbar action "Three"
      And the user presses "ArrowRight" in the toolbar
      Then toolbar action "Four" is focused

  Rule: Reconnected toolbars remain keyboard accessible

    Scenario: Reconnecting preserves keyboard navigation and responds to direction changes
      Given a toolbar with three actions
      When the toolbar renders
      And the user clicks toolbar action "Two"
      And the application reconnects the toolbar
      And the application changes toolbar direction to "rtl"
      And the user focuses toolbar action "Two"
      And the user presses "ArrowLeft" in the toolbar
      Then toolbar action "Three" is focused
      And toolbar action tab indexes are "-1, -1, 0"
