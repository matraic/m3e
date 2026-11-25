Feature: Skeleton
  Skeleton placeholders preserve loading layout, expose shape variants, and respect motion preferences.

  Rule: Loading state controls content and placeholder visibility

    Scenario: Loading content is hidden
      Given a skeleton
      When the skeleton renders
      Then the skeleton content is hidden

    Scenario: Loaded content is revealed
      Given a loaded skeleton
      When the skeleton renders
      Then the skeleton content is visible

    Scenario: Loading can become loaded later
      Given a skeleton
      When the skeleton renders
      And the application loads the skeleton
      Then the skeleton content is visible

    Scenario: Hidden loading content cannot receive pointer clicks
      Given a skeleton
      When the skeleton renders
      And the user clicks hidden skeleton content
      Then hidden skeleton content receives no click

    Scenario: Loaded content receives pointer clicks
      Given a skeleton
      When the skeleton renders
      And the application loads and records a click
      And the user clicks loaded skeleton content
      Then loaded skeleton content receives one click

    Scenario: A hidden skeleton is not displayed
      Given a hidden skeleton
      When the skeleton renders
      Then the skeleton is hidden

  Rule: Animation and shape properties fall back safely

    Scenario: Skeleton defaults are wave and auto
      Given a skeleton
      When the skeleton renders
      Then the skeleton defaults are "wave" and "auto"

    Scenario: Invalid properties fall back to defaults
      Given a skeleton with invalid animation and shape
      When the skeleton renders
      Then the skeleton attributes fall back to "wave" and "auto"

    Scenario Outline: Wave and pulse animate while loading
      Given a skeleton with animation "<animation>"
      When the skeleton renders
      Then the skeleton animation is active

      Examples:
        | animation |
        | wave      |
        | pulse     |

    Scenario: None does not animate
      Given a skeleton with animation "none"
      When the skeleton renders
      Then the skeleton animation is stopped

    Scenario: Loading to loaded stops animation
      Given a skeleton
      When the skeleton renders
      Then the skeleton animation is active
      When the application loads the skeleton
      Then the skeleton animation is stopped

    Scenario: Loaded to loading restarts animation
      Given a loaded skeleton
      When the skeleton renders
      Then the skeleton animation is stopped
      When the application unloads the skeleton
      Then the skeleton animation is active

    Scenario: Runtime animation changes recreate motion
      Given a skeleton with animation "none"
      When the skeleton renders
      And the application changes the skeleton animation to "pulse"
      Then the skeleton animation is active

  Rule: Placeholders match slotted content

    Scenario: Every slotted element gets a placeholder
      Given a skeleton with two slotted elements
      When the skeleton renders
      Then the skeleton has 2 placeholders

    Scenario: Circular shape uses its radius token
      Given a skeleton with a circular radius token
      When the skeleton renders
      Then the first placeholder has circular radius "7px"

    Scenario: Auto shape copies radius and mixed corner families
      Given a skeleton with mixed auto corner content
      When the skeleton renders
      Then the first placeholder has border radius "9px"
      And the first placeholder has corner shape "superellipse(0) superellipse(1)"

    Scenario: RTL shadow-surface shapes preserve explicit skeleton families
      Given a skeleton with RTL avatar content
      When the skeleton renders
      Then the first placeholder has border radius "9px"
      And the first placeholder has top-left corner shape "superellipse(1)"
      And the first placeholder has top-right corner shape "superellipse(0)"
      And the first placeholder has bottom-left corner shape "superellipse(0)"
      And the first placeholder has bottom-right corner shape "superellipse(0)"
      When the application changes the skeleton shape to "rounded"
      Then the first placeholder has border radius "16px"
      And the first placeholder has corner shape "superellipse(1)"
      When the application changes the skeleton shape to "circular"
      Then the first placeholder has border radius "9999px"
      When the application changes the skeleton shape to "square"
      Then the first placeholder has border radius "0px"
      When the application changes the skeleton shape to "auto"
      Then the first placeholder has border radius "9px"
      And the first placeholder has top-right corner shape "superellipse(0)"

    Scenario: Switching to auto copies a content zero radius
      Given a skeleton with explicit rounded shape and zero-radius cut content
      When the skeleton renders
      Then the first placeholder has border radius "16px"
      When the application changes the skeleton shape to "auto"
      Then the first placeholder has border radius "0px"
      And the first placeholder has corner shape "superellipse(0)"

    Scenario: Adding and removing slotted elements updates placeholders
      Given a skeleton
      When the skeleton renders
      Then the skeleton has 1 placeholders
      When the application adds a slotted element
      Then the skeleton has 2 placeholders
      When the application removes the last slotted element
      Then the skeleton has 1 placeholders

    Scenario: Resizing slotted content updates the placeholder
      Given a skeleton
      When the skeleton renders
      And the application changes the slotted element width to 240
      Then the first placeholder matches the slotted element width

  Rule: Lifecycle and accessibility preferences stop or resume motion safely

    Scenario: Disconnect removes placeholders and reconnect restores them
      Given a skeleton
      When the skeleton renders
      Then the skeleton has 1 placeholders
      When the application reconnects the skeleton
      Then the skeleton placeholders remain synchronized
      And the skeleton animation is active

    Scenario: Reduced motion pauses wave and preference changes resume it
      Given a skeleton
      And the skeleton user prefers reduced motion
      When the skeleton renders
      Then the skeleton animation is paused
      When the application changes the skeleton motion preference to "no-preference"
      Then the skeleton animation is running
      When the application changes the skeleton motion preference to "reduce"
      Then the skeleton animation is paused

    Scenario: Reduced motion pauses pulse
      Given a skeleton with animation "pulse"
      And the skeleton user prefers reduced motion
      When the skeleton renders
      Then the skeleton animation is paused

    Scenario: Forced colors pause motion
      Given a skeleton
      And the skeleton user has forced colors enabled
      When the skeleton renders
      Then the skeleton animation is paused
      And the first placeholder has corner shape "superellipse(1)"
      When the application changes forced colors to "none"
      Then the skeleton animation is running
