Feature: Table of contents
  A table of contents reflects target headings and navigates to the current section.

  Rule: Headings generate a hierarchical table of contents

    Scenario: Default depth includes the first two relative levels
      Given a table of contents for scrollable headings
      When the table of contents renders
      Then the table of contents hierarchy is "Intro:1, Install:2, API:1"

    Scenario: Maximum depth updates the hierarchy and is clamped
      Given a table of contents for scrollable headings
      When the table of contents renders
      And the application sets table of contents depth to 3
      Then the table of contents labels are "Intro, Install, Deep, API"
      When the application sets table of contents depth to 1
      Then the table of contents labels are "Intro, API"
      When the application sets table of contents depth to 0
      Then the table of contents labels are "Intro, API"

    Scenario: Heading levels are relative to the shallowest heading
      Given a table of contents for headings starting at level 3
      When the table of contents renders
      Then the table of contents hierarchy is "One:1, Two:2"

    Scenario: Custom headings participate
      Given a table of contents for custom headings
      When the table of contents renders
      Then the table of contents labels are "Custom, Child"

    Scenario: Ignored headings are excluded
      Given a table of contents with an ignored heading
      When the table of contents renders
      Then the table of contents labels are "Keep"

    Scenario: A table of contents with no target has no items
      Given a table of contents without a target
      When the table of contents renders
      Then the table of contents labels are ""

    Scenario: Adding a heading regenerates the items
      Given a table of contents for scrollable headings
      When the table of contents renders
      Then the table of contents labels are "Intro, Install, API"
      When the application adds the heading "Added"
      Then the table of contents labels are "Intro, Install, API, Added"

    Scenario: Removing the target clears items
      Given a table of contents for scrollable headings
      When the table of contents renders
      Then the table of contents labels are "Intro, Install, API"
      When the application removes the table of contents target
      Then the table of contents labels are ""

    Scenario: Overline and title slots set their states
      Given a table of contents with overline and title
      When the table of contents renders
      Then the table of contents exposes both header states

  Rule: Table of contents items expose and navigate to sections

    Scenario: Generated items are named links and expose the current section
      Given a table of contents for scrollable headings
      When the table of contents renders
      Then the table of contents exposes 3 links
      And the table of contents link "Install" is visible
      And the current table of contents item is "Intro"
      And only the "Intro" table of contents item exposes the current state

    Scenario: Keyboard users can focus and activate section links
      Given a table of contents for scrollable headings
      When the table of contents renders
      And the user tabs to the first table of contents link
      Then the table of contents link "Intro" has focus
      And the table of contents link "Intro" shows keyboard focus
      When the user tabs to the next table of contents link
      Then the table of contents link "Install" has focus
      When the user presses Enter on the table of contents link
      Then the current table of contents item is "Install"
      And only the "Install" table of contents item exposes the current state

    Scenario: Clicking an item scrolls to the section
      Given a table of contents for scrollable headings
      When the table of contents renders
      Then the current table of contents item is "Intro"
      When the user clicks the table of contents link "API"
      Then the current table of contents item is "API"
      And the target scroll position exceeds 300 pixels

    Scenario: Scrolling the target updates the current item
      Given a table of contents for scrollable headings
      When the table of contents renders
      Then the current table of contents item is "Intro"
      When the application scrolls the target to its last heading
      Then the current table of contents item is "API"
      When the application scrolls the target to the top
      Then the current table of contents item is "Intro"

    Scenario: A selected item uses aria-current instead of aria-selected
      Given a standalone table of contents item
      When the table of contents renders
      And the application selects the table of contents item
      Then the item exposes current state without aria-selected
      When the application deselects the table of contents item
      Then the item no longer exposes current state

    Scenario: Disabled items do not activate from the keyboard
      Given a standalone table of contents item
      When the table of contents renders
      And the application observes item activations
      And the application disables the table of contents item
      And Enter is dispatched to the table of contents item
      Then the item has no tab stop and no activations

    Scenario: Reconnecting an item does not duplicate keyboard activation
      Given a standalone table of contents item
      When the table of contents renders
      And the application observes item activations
      And the application reconnects the table of contents item twice
      And the user tabs to the standalone item
      Then the standalone item shows keyboard focus
      When the user presses Enter on the table of contents link
      Then the item has exactly one activation

  Rule: Navigation respects scrolling boundaries

    Scenario: A nested target scrolls without moving its outer container
      Given a table of contents in a nested scroller with scroll spacing
      When the table of contents renders
      And the application scrolls the outer table of contents container to 100 pixels
      And the user clicks the table of contents link "Destination"
      Then the current table of contents item is "Destination"
      And the destination is 28 pixels from the target top
      And the outer table of contents container remains at its original scroll position

    Scenario: A non-scrolling target scrolls its ancestor
      Given a table of contents for a non-scrolling target
      When the table of contents renders
      And the user clicks the table of contents link "Destination"
      Then the current table of contents item is "Destination"
      And the outer table of contents container scrolls beyond 300 pixels

    Scenario: Nested scrollers reveal a heading without moving the outer container
      Given a table of contents for a heading in nested target scrollers
      When the table of contents renders
      And the application scrolls the outer table of contents container to 100 pixels
      And the user clicks the table of contents link "Destination"
      Then the inner and target scrollers move to reveal the destination
      And the outer table of contents container remains at its original scroll position
      And the destination heading is in the viewport

  Rule: Reconnecting restores observation and navigation

    Scenario: Reconnecting picks up new headings and continues tracking changes
      Given a table of contents for scrollable headings
      When the table of contents renders
      Then the table of contents labels are "Intro, Install, API"
      When the application disconnects the table of contents
      And the application adds the heading "Added"
      And the application reconnects the table of contents
      Then the table of contents labels are "Intro, Install, API, Added"
      When the application adds the heading "Later"
      Then the table of contents labels are "Intro, Install, API, Added, Later"
      When the user clicks the table of contents link "API"
      Then the current table of contents item is "API"
