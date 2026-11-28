Feature: Slide
  Scenario: With no selection, all items are parked and inert
    Given a slide with three items and no selection
    When the slide renders
    Then the slide has no selected index
    And slide items "One, Two, Three" are before and inert

  Scenario: The selected index is reflected and positions the items
    Given a slide with three items and selected index 1
    When the slide renders
    Then slide items "One" are before and inert
    And slide item "Two" is selected and visible
    And slide items "Three" are after and inert
    And slide items "One, Three" are hidden
    When the application sets the slide index to 2
    Then the slide reflects index 2

  Scenario: Changing the selection moves the items
    Given a slide with three items and selected index 0
    When the slide renders
    Then slide item "One" is selected and visible
    When the application sets the slide index to 2
    Then slide item "Three" is selected and visible
    And slide items "One, Two" are before and inert

  Scenario: Clearing the selection parks the selected item
    Given a slide with three items and selected index 1
    When the slide renders
    Then slide item "Two" is selected and visible
    When the application clears the slide index
    Then slide items "Two" are before and inert

  Scenario: A newly added item is positioned
    Given a slide with three items and selected index 0
    When the slide renders
    And the application adds slide item "Four"
    Then slide items "Four" are after and inert

  Scenario: A removed item is restored
    Given a slide with three items and selected index 1
    When the slide renders
    Then slide items "One" are before and inert
    When the application removes slide item "One"
    Then slide item "One" is restored
