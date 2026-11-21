Feature: Carousel lifecycle
  Carousel collections retain their semantics and interaction when moved in the DOM.

  Scenario Outline: A moved collection preserves selection and keyboard navigation
    Given a lifecycle "<tag>" collection with four items
    When the lifecycle collection renders
    And the application selects lifecycle item 2
    And the application observes lifecycle selection changes
    And the application moves the lifecycle collection to a new DOM parent
    Then the lifecycle collection is in its new parent
    And the lifecycle collection remains a grid named "Destinations"
    And lifecycle item 2 remains selected
    When the user focuses lifecycle item "Item 2"
    And the user presses "Home" in the lifecycle collection
    Then lifecycle item "Item 1" has keyboard focus
    And lifecycle item 1 is selected
    And exactly 1 lifecycle selection change was emitted

    Examples:
      | tag               |
      | m3e-carousel      |
      | m3e-carousel-grid |

  Scenario Outline: A moved collection still observes size changes
    Given a lifecycle "<tag>" collection with four items
    When the lifecycle collection renders
    And the application moves the lifecycle collection to a new DOM parent
    And the application resizes the lifecycle collection to 200 pixels
    Then all lifecycle items fit the resized collection
    And the lifecycle collection remains a grid named "Destinations"

    Examples:
      | tag               |
      | m3e-carousel      |
      | m3e-carousel-grid |
