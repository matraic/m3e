Feature: Collapsible content
  Scenario: Defaults and closed content
    Given a collapsible
    When the collapsible renders
    Then the collapsible has its default properties
    And the collapsible content is hidden

  Scenario: Open content is visible and interactive
    Given a collapsible with 'open'
    When the collapsible renders
    Then the collapsible content is visible and not inert
    And the collapsible has emitted no events

  Scenario: Properties are reflected
    Given a collapsible
    When the collapsible renders
    And the application sets the collapsible properties
    Then the collapsible reflects its properties

  Scenario: Opening and closing emit ordered events
    Given a collapsible
    When the collapsible renders
    And the application opens the collapsible
    Then the collapsible events are "opening, opened"
    And the collapsible content is visible and not inert
    When the application closes the collapsible
    Then the collapsible events are "opening, opened, closing, closed"
    And the collapsible content is hidden and inert

  Scenario: Closing initially open content emits closing events
    Given a collapsible with 'open'
    When the collapsible renders
    And the application closes the collapsible
    Then the collapsible events are "closing, closed"
    And the collapsible content is hidden and inert

  Scenario: Opening and closing animate when motion is allowed
    Given a collapsible with motion enabled
    When the collapsible renders
    And the application opens the collapsible
    Then the collapsible events are "opening, opened"
    And the collapsible content is visible and not inert
    When the application closes the collapsible
    Then the collapsible events are "opening, opened, closing, closed"
    And the collapsible content is hidden and inert

  Scenario: No-animate completes without a transition
    Given a collapsible with 'no-animate' and motion enabled
    When the collapsible renders
    And the application opens the collapsible
    Then the collapsible events are "opening, opened"

  Scenario: Orientation updates its custom state
    Given a collapsible with 'orientation="horizontal"'
    When the collapsible renders
    Then the collapsible state is "horizontal" instead of "vertical"
    When the application sets collapsible orientation to "both"
    Then the collapsible state is "both" instead of "horizontal"

  Scenario: Invalid orientation falls back to horizontal
    Given a collapsible with 'orientation="bogus"'
    When the collapsible renders
    Then the collapsible reflects orientation "horizontal"

  Scenario: Horizontal content collapses its width
    Given a collapsible with 'orientation="horizontal"'
    When the collapsible renders
    Then the collapsible width is zero
    When the application opens the collapsible
    Then the collapsible width is greater than zero
