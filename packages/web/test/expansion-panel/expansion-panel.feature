Feature: Expansion panels
  Expansion panels disclose content individually or as part of an accordion.

  Rule: A panel exposes an accessible disclosure

    Scenario: A header opens its labelled content region
      Given an expansion panel named "Shipping details"
      When the expansion panel renders
      Then the "Shipping details" header is collapsed
      And its content region is hidden
      And the header controls its labelled content region
      When the user clicks the "Shipping details" header
      Then the "Shipping details" panel is open
      And the "Shipping details" header is expanded
      And its content region is visible
      And the expansion panel content is visible

    Scenario: Opening and closing dispatches bubbling lifecycle events in order
      Given an expansion panel named "Details"
      When the expansion panel renders
      And the application observes expansion panel events
      And the user clicks the "Details" header
      Then the "Details" panel is open
      And the expansion panel events are "opening,opened"
      When the user clicks the "Details" header
      Then the "Details" panel is closed
      And the expansion panel events are "opening,opened,closing,closed"

    Scenario: A disabled panel cannot be opened
      Given a disabled expansion panel named "Unavailable section"
      When the expansion panel renders
      Then the "Unavailable section" header is disabled
      When the application clicks the "Unavailable section" header
      Then the "Unavailable section" panel is closed
      And the "Unavailable section" header is collapsed

    Scenario: Disabling an open panel prevents toggling until it is enabled again
      Given an expansion panel named "Details"
      When the expansion panel renders
      And the user clicks the "Details" header
      And the application disables the "Details" panel
      Then the "Details" header is disabled
      When the application clicks the "Details" header
      Then the "Details" panel is open
      When the application enables the "Details" panel
      Then the "Details" header is enabled
      When the user clicks the "Details" header
      Then the "Details" panel is closed

    Scenario: Keyboard activation toggles a panel
      Given an expansion panel named "Details"
      When the expansion panel renders
      And the user focuses the "Details" header
      And the user presses "Enter" in the expansion panel
      Then the "Details" header is expanded
      When the user presses "Space" in the expansion panel
      Then the "Details" header is collapsed

    Scenario: Arrow keys open and close a standalone panel
      Given an expansion panel named "Details"
      When the expansion panel renders
      And the user focuses the "Details" header
      And the user presses "ArrowDown" in the expansion panel
      Then the "Details" header is expanded
      When the user presses "ArrowUp" in the expansion panel
      Then the "Details" header is collapsed

    Scenario: Collapsed content and actions are excluded from keyboard navigation
      Given an expansion panel named "Details" with focusable content and actions
      When the expansion panel renders
      Then the content action is excluded from the accessibility tree
      And the panel action is excluded from the accessibility tree
      When the user focuses the "Details" header
      And the user presses "Tab" in the expansion panel
      Then focus is after the expansion panel
      When the user clicks the "Details" header
      Then the content action is visible
      And the panel action is visible
      When the user focuses the "Details" header
      And the user presses "Tab" in the expansion panel
      Then the content action is focused
      When the user presses "Tab" in the expansion panel
      Then the panel action is focused
      When the user clicks the "Details" header
      Then the content action is hidden
      And the panel action is hidden

    Scenario: An initially open panel can be closed programmatically
      Given an open expansion panel named "Details"
      When the expansion panel renders
      Then the "Details" header is expanded
      And its content region is visible
      When the application closes the "Details" panel
      Then the "Details" panel is closed
      And the "Details" header is collapsed
      And its content region is hidden

  Rule: Accordions coordinate their panels

    Scenario: A single accordion closes the previously opened panel
      Given an accordion with panels "First" and "Second"
      When the expansion panel renders
      And the user clicks the "First" header
      Then the "First" panel is open
      When the user clicks the "Second" header
      Then the "Second" panel is open
      And the "First" panel is closed

    Scenario: A multi accordion permits multiple open panels
      Given a multi accordion with panels "First" and "Second"
      When the expansion panel renders
      And the user clicks the "First" header
      And the user clicks the "Second" header
      Then the "First" panel is open
      And the "Second" panel is open

    Scenario: A single accordion reconciles initially open panels
      Given an accordion with initially open panels "First" and "Second"
      When the expansion panel renders
      Then the "First" panel is open
      And the "Second" panel is closed

    Scenario: A multi accordion preserves initially open panels
      Given a multi accordion with initially open panels "First" and "Second"
      When the expansion panel renders
      Then the "First" panel is open
      And the "Second" panel is open

    Scenario: Accordion arrow navigation skips disabled panels and wraps
      Given an accordion with a disabled middle panel
      When the expansion panel renders
      And the user focuses the "First" header
      And the user presses "ArrowDown" in the expansion panel
      Then the "Third" header is focused
      When the user presses "ArrowDown" in the expansion panel
      Then the "First" header is focused
      When the user presses "ArrowUp" in the expansion panel
      Then the "Third" header is focused
      And the "First" panel is closed
      And the "Third" panel is closed

  Rule: The indicator is configurable

    Scenario: The indicator defaults to vertical and after
      Given an expansion panel named "Details"
      When the expansion panel renders
      Then the indicator direction is "vertical" and position is "after"
      And the indicator is visible
      And the indicator is hidden from assistive technology

    Scenario: Invalid indicator values fall back to defaults
      Given an expansion panel with invalid indicator values
      When the expansion panel renders
      Then the indicator direction is "vertical" and position is "after"

    Scenario: The indicator direction and position can change dynamically
      Given an expansion panel named "Details"
      When the expansion panel renders
      And the application sets the indicator direction to "horizontal" and position to "before"
      Then the indicator direction is "horizontal" and position is "before"
      And the indicator appears before the "Details" header text

    Scenario: The indicator can be hidden and restored
      Given an expansion panel named "Details"
      When the expansion panel renders
      And the application hides the indicator
      Then the indicator is hidden
      And the "Details" header is collapsed
      When the application shows the indicator
      Then the indicator is visible

    Scenario: Indicator position changes its placement
      Given expansion panels with before and after indicators
      When the expansion panel renders
      Then the indicator appears before the "Before" header text
      And the indicator appears after the "After" header text

    Scenario: A custom indicator remains decorative
      Given an expansion panel named "Details" with a custom indicator
      When the expansion panel renders
      Then the custom indicator is visible
      And the indicator is hidden from assistive technology
      And the "Details" header is collapsed

  Rule: Panel behavior survives DOM movement

    Scenario: Moving an open panel preserves its accessible relationship and behavior
      Given an open expansion panel named "Details"
      When the expansion panel renders
      And the application observes expansion panel events
      And the application moves the panel to a new parent
      Then the "Details" panel is in its new parent
      And the "Details" header is expanded
      And its content region is visible
      And the header controls its labelled content region
      When the user clicks the "Details" header
      Then the "Details" panel is closed
      And the expansion panel events are "closing,closed"
      When the user clicks the "Details" header
      Then the "Details" panel is open
      And the expansion panel events are "closing,closed,opening,opened"

    Scenario: Moving an open panel between single accordions reconciles their state
      Given two single accordions with an open panel each
      When the expansion panel renders
      And the application moves "First" into the second accordion
      Then the "First" panel is closed
      And the "Second" panel is open
      And the first accordion contains 0 panels
      And the second accordion contains 2 panels
      When the user clicks the "First" header
      Then the "First" panel is open
      And the "Second" panel is closed

  Rule: Nested and dynamic accordions remain coordinated

    Scenario: Nested accordions manage their own panels and events
      Given an accordion containing a nested accordion
      When the expansion panel renders
      And the application observes nested panel events
      And the user clicks the "Inner first" header
      Then the "Outer" panel is open
      And the "Inner first" panel is open
      And the nested panel events are "panel-inner-first:opening,panel-inner-first:opened"
      And the outer accordion contains only "Outer,Sibling"
      And the inner accordion contains only "Inner first,Inner second"
      When the user focuses the "Outer" header
      And the user presses "ArrowDown" in the expansion panel
      Then the "Sibling" header is focused
      When the user focuses the "Inner first" header
      And the user presses "ArrowDown" in the expansion panel
      Then the "Inner second" header is focused

    Scenario: Adding, reordering and removing panels updates accordion behavior
      Given an accordion with panels "First" and "Second"
      When the expansion panel renders
      And the application adds a "Third" panel to the accordion
      Then the accordion panel order is "First,Second,Third"
      When the application moves "Third" before "First" in the accordion
      Then the accordion panel order is "Third,First,Second"
      When the user focuses the "Third" header
      And the user presses "ArrowDown" in the expansion panel
      Then the "First" header is focused
      When the application removes the "First" panel
      Then the accordion panel order is "Third,Second"
      When the user focuses the "Third" header
      And the user presses "ArrowDown" in the expansion panel
      Then the "Second" header is focused
      When the user clicks the "Third" header
      And the user clicks the "Second" header
      Then the "Third" panel is closed
      And the "Second" panel is open

    Scenario: Switching from multi to single reconciles open panels immediately
      Given a multi accordion with initially open panels "First" and "Second"
      When the expansion panel renders
      And the application disables multi on the accordion
      Then the "First" panel is open
      And the "Second" panel is closed
      When the application enables multi on the accordion
      And the user clicks the "Second" header
      Then the "First" panel is open
      And the "Second" panel is open

  Rule: Panel details respond to changes

    Scenario: A horizontal indicator follows direction changes after movement
      Given an open horizontal expansion panel named "Details"
      When the expansion panel renders
      Then the indicator appears before the "Details" header text
      And the indicator rotates clockwise
      When the application moves the panel to a new parent
      And the application changes the expansion page direction to "rtl"
      Then the indicator appears after the "Details" header text
      And the indicator rotates counterclockwise
      When the application changes the expansion page direction to "ltr"
      Then the indicator appears before the "Details" header text
      And the indicator rotates clockwise

    Scenario: Actions can be added and removed while the panel is open
      Given an open expansion panel named "Details"
      When the expansion panel renders
      Then the expansion actions area is hidden
      When the application adds an expansion action
      Then the expansion actions area is visible
      And the dynamic expansion action is accessible
      When the application removes the expansion action
      Then the expansion actions area is hidden
      And the dynamic expansion action is absent

    Scenario: Multiple open panels have distinct labelled regions
      Given a multi accordion with initially open panels "First" and "Second"
      When the expansion panel renders
      Then the "First" and "Second" panels have distinct header and region relationships
      And the "First" and "Second" regions are accessible by name

    Scenario Outline: Closing a panel restores focus from its content
      Given an expansion panel named "Details" with focusable content and actions
      When the expansion panel renders
      And the user clicks the "Details" header
      And the user focuses the <target> action
      And the application closes the "Details" panel
      Then the "Details" panel is closed
      And the "Details" header is focused

      Examples:
        | target  |
        | content |
        | panel   |

    Scenario: Closing a disabled panel leaves focus handling to the browser
      Given an expansion panel named "Details" with focusable content and actions
      When the expansion panel renders
      And the user clicks the "Details" header
      And the user focuses the content action
      And the application disables the "Details" panel
      And the application closes the "Details" panel
      Then the "Details" header is disabled
      And the "Details" header is not in the tab order
      And the content action is hidden
      And the content action is not focused

    Scenario: Closing an outer panel returns focus from a nested panel
      Given an accordion containing a nested accordion
      When the expansion panel renders
      And the user focuses the "Inner first" header
      And the application closes the "Outer" panel
      Then the "Outer" header is focused

    Scenario: Closing a panel does not steal focus from outside it
      Given an open expansion panel named "Details"
      When the expansion panel renders
      And the user focuses the element after the panel
      And the application closes the "Details" panel
      Then focus is after the expansion panel

  Rule: Animated transitions report their lifecycle

    Scenario: Animated opening and closing dispatch events in order
      Given an animated expansion panel named "Details"
      When the expansion panel renders
      And the application observes expansion panel events
      And the user clicks the "Details" header
      Then the expansion panel events are "opening,opened"
      When the user clicks the "Details" header
      Then the expansion panel events are "opening,opened,closing,closed"

    Scenario: Interrupting animations reports only the completed transition
      Given an animated expansion panel named "Details"
      When the expansion panel renders
      And the application observes expansion panel events
      And the application opens the panel during animation
      And the application waits for the expansion animation to run
      And the application closes the panel during animation
      And the application waits for the collapse animation to run
      And the application opens the panel during animation
      Then the expansion panel events are "opening,closing,opening,opened"
      And the "Details" panel is open

    Scenario: Interrupting a collapse reports only the final closed event
      Given an open animated expansion panel named "Details"
      When the expansion panel renders
      And the application observes expansion panel events
      And the application closes the panel during animation
      And the application waits for the initial collapse animation
      And the application opens the panel during animation
      And the application waits for the interrupted expansion animation
      And the application closes the panel during animation
      Then the expansion panel events are "closing,opening,closing,closed"
      And the "Details" panel is closed
