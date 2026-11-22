Feature: Drawer container
  Drawer containers arrange start and end drawers around main content.

  Rule: Drawers provide responsive layouts

    Scenario: A closed drawer leaves main content visible
      Given a drawer container
      When the drawer container renders
      Then the start drawer is attached but hidden
      And the main drawer content is visible
      And the closed start navigation is excluded from the accessibility tree
      And the main landmark is accessible
      And the default drawer modes are side

    Scenario: Drawer width leaves room for the scrim and respects its maximum
      Given a drawer container
      When the drawer viewport is 320 pixels wide
      And the drawer container renders
      Then the start drawer width is "264px"
      When the drawer viewport is 500 pixels wide
      Then the start drawer width is "360px"
      When the application sets the drawer scrim minimum space to "80px"
      And the drawer viewport is 320 pixels wide
      Then the start drawer width is "240px"

    Scenario: Oversized drawer widths are constrained
      Given a drawer container with oversized start drawer widths
      When the drawer viewport is 320 pixels wide
      And the drawer container renders
      Then the start drawer width is "264px"

    Scenario: Both side drawers can be open together
      Given a drawer container with both side drawers open
      When the drawer container renders
      Then the start drawer is open
      And the end drawer is open
      And the start drawer is visible
      And the end drawer is visible
      And the main drawer content is interactive
      And the start navigation landmark is accessible

    Scenario: An opposite non-side drawer closes when a drawer opens
      Given a drawer container with an open start over drawer and an end push drawer
      When the drawer container renders
      And the application opens the end drawer
      Then the end drawer is open
      And the start drawer is closed

    Scenario Outline: Invalid drawer modes fall back to side
      Given a drawer container with both modes set to "<mode>"
      When the drawer container renders
      Then the drawer modes are "side" and "side"

      Examples:
        | mode  |
        | bogus |
        | side  |

    Scenario: Automatic mode follows breakpoints and closes when switching to an overlay
      Given a drawer container with an open automatic start drawer
      When the drawer viewport is 960 pixels wide
      And the drawer container renders
      And the application observes drawer changes
      Then the start drawer uses "side" mode
      When the drawer viewport is 959 pixels wide
      Then the start drawer uses "push" mode
      And the start drawer is closed
      And the drawer container dispatches 1 change event
      When the application opens the start drawer
      And the drawer viewport is 599 pixels wide
      Then the start drawer uses "over" mode
      And the start drawer is closed
      And the drawer container dispatches 2 change events
      When the drawer viewport is 960 pixels wide
      Then the start drawer uses "side" mode

  Rule: Drawer dividers appear in side mode

    Scenario: Side dividers can be enabled
      Given a drawer container with both side dividers
      When the drawer container renders
      Then both drawer divider attributes are present
      And the side drawers draw divider borders

    Scenario: Side dividers are absent by default
      Given a drawer container with both side drawers open
      When the drawer container renders
      Then both drawer divider attributes are absent
      And the side drawers do not draw divider borders

    Scenario Outline: Each side divider can be enabled independently
      Given a drawer container with only the <side> divider
      When the drawer container renders
      Then only the <side> drawer draws a divider border

      Examples:
        | side  |
        | start |
        | end   |

  Rule: Toggles and scrims control drawers accessibly

    Scenario: A toggle opens and closes its start drawer
      Given a start over drawer with a toggle
      When the drawer container renders
      And the application observes drawer changes
      Then the drawer toggle controls "navigation"
      And the drawer toggle is collapsed
      And the drawer toggle has no pressed state
      When the user clicks the drawer toggle
      Then the start drawer is open
      And the drawer toggle is expanded and selected
      And the drawer container dispatches 1 change event
      When the user clicks the drawer toggle
      Then the start drawer is closed
      And the drawer toggle is collapsed and unselected
      And the drawer container dispatches 2 change events

    Scenario: A toggle controls the end drawer
      Given an end over drawer with a toggle
      When the drawer container renders
      Then the drawer toggle controls "details"
      And the drawer toggle is collapsed
      When the user clicks the drawer toggle
      Then the end drawer is open
      And the drawer toggle is expanded and selected

    Scenario: Clicking the scrim closes an open drawer and updates its toggle
      Given a start over drawer with a toggle
      When the drawer container renders
      And the application observes drawer changes
      And the user clicks the drawer toggle
      And the user clicks the drawer scrim
      Then the start drawer is closed
      And the drawer toggle is collapsed and unselected
      And the drawer container dispatches 2 change events
      And the main drawer content is interactive

    Scenario Outline: Open modal drawers make main content inert and contain focus
      Given an open start "<mode>" drawer with focusable content
      When the drawer container renders
      Then the main drawer content is inert
      And the main landmark is excluded from the accessibility tree
      And the start drawer is visible
      When the user tabs from the last start drawer action
      Then focus remains in the start drawer
      When the user clicks the drawer scrim
      Then the main drawer content is interactive
      And the main landmark is accessible

      Examples:
        | mode |
        | over |
        | push |

    Scenario: An open side drawer remains interactive when the other drawer uses over mode
      Given an open side start drawer and a closed over end drawer
      When the drawer container renders
      Then the main drawer content is interactive

    Scenario: An open end side drawer remains interactive when the start drawer uses push mode
      Given an open side end drawer and a closed push start drawer
      When the drawer container renders
      Then the main drawer content is interactive

  Rule: Drawer behavior survives DOM movement

    Scenario: Moving an open over container preserves its mode and scrim behavior
      Given a start over drawer with a toggle
      When the drawer container renders
      And the user clicks the drawer toggle
      And the application moves the drawer container to a new parent
      Then the drawer container is in its new parent
      And the start drawer uses "over" mode
      And the main drawer content is inert
      When the user clicks the drawer scrim
      Then the start drawer is closed
      And the drawer toggle is collapsed and unselected

    Scenario: Moving an open side container preserves its layout
      Given a drawer container with both side drawers open
      When the drawer container renders
      And the application moves the drawer container to a new parent
      Then the start drawer uses "side" mode
      And the main drawer content is offset for the start drawer
      And the main drawer content is interactive

    Scenario: Moving a drawer toggle transfers its controls and click behavior
      Given a start over drawer with a toggle
      When the drawer container renders
      And the application moves the drawer toggle to a new button
      Then the original drawer toggle has no drawer semantics
      And the new drawer toggle controls "navigation"
      When the user clicks the original drawer toggle
      Then the start drawer is closed
      When the user clicks the new drawer toggle
      Then the start drawer is open
      And the new drawer toggle is expanded

    Scenario: Retargeting a drawer toggle updates its controls
      Given a start over drawer with a toggle
      When the drawer container renders
      And the application retargets the drawer toggle to "details"
      Then the drawer toggle controls "details"
      When the user clicks the drawer toggle
      Then the end drawer is open
      And the start drawer is closed

    Scenario: Moving an automatic drawer container retains breakpoint monitoring
      Given a drawer container with an open automatic start drawer
      When the drawer viewport is 960 pixels wide
      And the drawer container renders
      And the application moves the drawer container to a new parent
      And the drawer viewport is 599 pixels wide
      Then the start drawer uses "over" mode
      And the start drawer is closed

  Rule: Drawer layouts and controls respond to changes

    Scenario Outline: An end modal drawer contains focus and restores main content
      Given an open end "<mode>" drawer with focusable content
      When the drawer container renders
      Then the main drawer content is inert
      And the main landmark is excluded from the accessibility tree
      And the end drawer is visible
      When the user tabs from the last end drawer action
      Then focus moves to the first end drawer action
      When the user shift-tabs from the first end drawer action
      Then focus moves to the last end drawer action
      When the user clicks the drawer scrim
      Then the end drawer is closed
      And the main drawer content is interactive
      And the main landmark is accessible

      Examples:
        | mode |
        | over |
        | push |

    Scenario: Dismissing an end modal drawer leaves an open start side drawer
      Given an open side start drawer and a closed over end drawer
      When the drawer container renders
      And the application opens the end drawer
      Then the start drawer is open
      And the end drawer is open
      And the main drawer content is inert
      When the user clicks the drawer scrim
      Then the start drawer is open
      And the end drawer is closed
      And the main drawer content is interactive

    Scenario: Dismissing a start modal drawer leaves an open end side drawer
      Given an open side end drawer and a closed push start drawer
      When the drawer container renders
      And the application opens the start drawer
      Then the start drawer is open
      And the end drawer is open
      And the main drawer content is inert
      When the user clicks the drawer scrim
      Then the start drawer is closed
      And the end drawer is open
      And the main drawer content is interactive

    Scenario: Changing the mode of an open drawer updates the layout
      Given an open start side drawer 180 pixels wide
      When the drawer container renders
      Then the main drawer content has a left offset of 180 pixels
      And the main drawer content is interactive
      When the application changes the start drawer mode to "push"
      Then the start drawer uses "push" mode
      And the main drawer content has a left offset of 180 pixels
      And the main drawer content is inert
      And the drawer scrim is visible
      When the application changes the start drawer mode to "over"
      Then the start drawer uses "over" mode
      And the main drawer content has a left offset of 0 pixels
      And the main drawer content is inert
      When the application changes the start drawer mode to "side"
      Then the start drawer uses "side" mode
      And the main drawer content has a left offset of 180 pixels
      And the main drawer content is interactive
      And the drawer scrim is hidden

    Scenario: Resizing an open side drawer updates the content offset
      Given an open start side drawer 180 pixels wide
      When the drawer container renders
      Then the main drawer content has a left offset of 180 pixels
      When the application changes the start drawer width to 240 pixels
      Then the start drawer width is "240px"
      And the main drawer content has a left offset of 240 pixels

    Scenario: Right-to-left layout places start and end drawers on opposite sides
      Given a right-to-left drawer container with open side drawers
      When the drawer container renders
      Then the start drawer is at the right edge and the end drawer is at the left edge
      And the main content offsets match the drawer widths in right-to-left layout

    Scenario: Moving an open toggle transfers its expanded and selected state
      Given a start over drawer with a toggle
      When the drawer container renders
      And the user clicks the drawer toggle
      And the application moves the drawer toggle to a new button
      Then the original drawer toggle has no drawer semantics
      And the new drawer toggle controls "navigation"
      And the new drawer toggle is expanded
      And the new drawer toggle is selected
      When the user clicks the drawer scrim
      Then the start drawer is closed
      And the new drawer toggle is collapsed and unselected

    Scenario: Retargeting a toggle to another container transfers change listening
      Given two drawer containers and a start drawer toggle
      When the drawer container renders
      And the user clicks the drawer toggle
      And the application retargets the drawer toggle to "other-navigation"
      Then the drawer toggle controls "other-navigation"
      And the drawer toggle is collapsed and unselected
      When the other container opens without dispatching a change event
      And the original container dispatches a change event
      Then the drawer toggle is collapsed and unselected
      When the other container dispatches a change event
      Then the drawer toggle is expanded and selected
      When the user clicks the drawer toggle
      Then the other start drawer is closed
      And the drawer toggle is collapsed and unselected

    Scenario: An automatic end drawer responds to breakpoint changes
      Given a drawer container with an open automatic end drawer
      When the drawer viewport is 960 pixels wide
      And the drawer container renders
      And the application observes drawer changes
      Then the end drawer uses "side" mode
      When the drawer viewport is 959 pixels wide
      Then the end drawer uses "push" mode
      And the end drawer is closed
      And the drawer container dispatches 1 change event
      When the application opens the end drawer
      And the drawer viewport is 599 pixels wide
      Then the end drawer uses "over" mode
      And the end drawer is closed
      And the drawer container dispatches 2 change events
      When the drawer viewport is 960 pixels wide
      Then the end drawer uses "side" mode

    Scenario Outline: Keyboard activation opens and closes a drawer
      Given a start over drawer with a toggle
      When the drawer container renders
      And the user activates the drawer toggle with "<key>"
      Then the start drawer is open
      And the drawer toggle is expanded and selected
      When the user activates the drawer toggle with "<key>"
      Then the start drawer is closed
      And the drawer toggle is collapsed and unselected

      Examples:
        | key   |
        | Enter |
        | Space |
