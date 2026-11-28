Feature: List key manager page navigation
  Scenario Outline: Page keys skip disabled items in the page direction
    Given a list key manager with direction "<direction>" and 25 items
    And items 8 and 13 are disabled for navigation
    When the active item is 18 and PageUp is pressed
    Then the active item is 7 and the key is handled
    When the active item is 3 and PageDown is pressed
    Then the active item is 14 and the key is handled
    When the active item is 3 and PageUp is pressed
    Then the active item is 0 and the key is handled
    When the active item is 23 and PageDown is pressed
    Then the active item is 24 and the key is handled

    Examples:
      | direction |
      | ltr       |
      | rtl       |
