Feature: Badge
  The badge displays a compact visual indicator and can be sized or positioned.

  Rule: Badge content and defaults

    Scenario: Renders its slotted content
      Given a badge with slotted content "10"
      When the badge renders
      Then the badge element is visible
      And the badge shows slotted content "10"

    Scenario: Defaults to medium size and above-after position
      Given a badge attached to its target
      When the badge renders
      Then the badge's effective size is "medium"
      And the badge's effective position is "above-after"
      And the badge is positioned at "above-after"

  Rule: Badge size

    Scenario Outline: Accepts a supported size
      Given a badge with size "<size>"
      When the badge renders
      Then the badge's effective size is "<size>"
      And the badge measures <dimension> pixels square

      Examples:
        | size   | dimension |
        | small  | 6         |
        | medium | 22        |
        | large  | 28        |

    Scenario: Falls back to medium for an unknown size
      Given a badge with size "extra-large"
      When the badge renders
      Then the badge's effective size is "medium"

    Scenario: A small badge hides its slotted label
      Given a badge with size "small"
      When the badge renders
      Then the badge suppresses its label

    Scenario Outline: Adds padding appropriate to a long label and size
      Given a badge with size "<size>"
      And a badge with slotted content "100"
      When the badge renders
      Then the badge's horizontal padding is "<padding>"

      Examples:
        | size   | padding |
        | small  | 0px     |
        | medium | 4px     |
        | large  | 8px     |

  Rule: Badge position

    Scenario Outline: Accepts a supported position
      Given a badge attached to its target with position "<position>"
      When the badge renders
      Then the badge's effective position is "<position>"
      And the badge is positioned at "<position>"

      Examples:
        | position     |
        | above-after  |
        | above-before |
        | below-before |
        | below-after  |
        | before       |
        | after        |
        | above        |
        | below        |

    Scenario: Falls back to above-after for an unknown position
      Given a badge with position "center"
      When the badge renders
      Then the badge's effective position is "above-after"

  Rule: Badge content and appearance

    Scenario: Adds horizontal padding when its label grows
      Given a badge with slotted content "10"
      When the badge renders
      And the application changes its label to "100"
      Then the badge's horizontal padding is "4px"
      And the badge shows slotted content "100"

    Scenario: Applies custom foreground and background colors
      Given a badge with custom foreground and background colors
      When the badge renders
      Then the badge uses foreground color "rgb(1, 2, 3)"
      And the badge uses background color "rgb(4, 5, 6)"

  Rule: Attached badges remain anchored after reconnection

    Scenario: Changing the target moves the badge anchor
      Given a badge attached to its target
      When the badge renders
      And the application changes the badge target
      Then the badge is attached to target "badge-target-next"
      And the badge is positioned at "above-after"

    Scenario Outline: Logical corner positions follow directionality changes
      Given a badge attached to its target with position "<position>"
      When the badge renders
      And the application changes the page direction to "rtl"
      Then the badge is positioned at "<position>"

      Examples:
        | position     |
        | above-after  |
        | above-before |

    Scenario: Reconnecting an attached badge restores its position
      Given a badge attached to its target
      When the badge renders
      And the application moves the badge to a new DOM parent
      Then the badge is attached to its target
      And the badge is positioned at "above-after"

    Scenario: Updating a disconnected badge preserves its padding after moving
      Given a badge attached to its target
      When the badge renders
      And the application disconnects the badge, changes its label to "100", and moves it to a new DOM parent
      Then the badge is attached to its target
      And the badge's horizontal padding is "4px"
      And the badge is positioned at "above-after"
