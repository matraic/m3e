Feature: Navigation bar layout
  The bar mode determines whether destinations are laid out vertically or horizontally.

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
