Feature: Suggestion chips
  Suggestion chips provide accessible actions and links, including form submission.

  Scenario: Enter activates a suggestion chip and disabling removes its tab stop
    Given a suggestion action chip
    When the action chip renders
    Then the action chip is a button named "Open suggestions"
    When the application observes action chip clicks
    And the user focuses the action chip
    And the user presses "Enter" on the action chip
    Then the action chip clicks are "click"
    When the application sets action chip attribute "disabled" to ""
    Then the action chip exposes disabled state
    And the action chip has no keyboard tab stop

  Scenario: Space activates a suggestion chip once
    Given a suggestion action chip
    When the action chip renders
    And the application observes action chip clicks
    And the user focuses the action chip
    And the user presses "Space" on the action chip
    Then the action chip clicks are "click"

  Scenario: A disabled suggestion chip suppresses activation
    Given a suggestion action chip
    When the action chip renders
    And the application sets action chip attribute "disabled" to ""
    And the application observes action chip clicks
    And the application clicks the action chip
    Then the action chip clicks are ""

  Scenario: A disabled-interactive suggestion chip remains focusable without activating
    Given a suggestion action chip
    When the action chip renders
    And the application sets action chip attribute "disabled-interactive" to ""
    Then the action chip exposes disabled state
    And the action chip has a keyboard tab stop
    When the application observes action chip clicks
    And the user focuses the action chip
    Then the action chip has focus
    When the user presses "Enter" on the action chip
    And the user presses "Space" on the action chip
    And the application clicks the action chip
    Then the action chip clicks are ""

  Scenario: Reenabling a suggestion chip restores activation
    Given a suggestion action chip
    When the action chip renders
    And the application sets action chip attribute "disabled" to ""
    And the application removes action chip attribute "disabled"
    Then the action chip has a keyboard tab stop
    When the application observes action chip clicks
    And the user focuses the action chip
    And the user presses "Enter" on the action chip
    Then the action chip clicks are "click"

  Scenario: Changing href updates suggestion chip link semantics
    Given a suggestion action chip
    When the action chip renders
    And the application sets action chip attribute "href" to "#details"
    Then the action chip is a link named "Open suggestions"
    When the application removes action chip attribute "href"
    Then the action chip is a button named "Open suggestions"

  Scenario: Moving a suggestion chip preserves naming and single activation
    Given a suggestion action chip
    When the action chip renders
    And the application observes action chip clicks
    And the application moves the action chip to a new parent
    Then the action chip is in the new parent
    And the action chip is a button named "Open suggestions"
    When the user focuses the action chip
    And the user presses "Enter" on the action chip
    Then the action chip clicks are "click"

  Scenario: Moving a disabled suggestion chip preserves suppression
    Given a suggestion action chip
    When the action chip renders
    And the application sets action chip attribute "disabled" to ""
    And the application observes action chip clicks
    And the application moves the action chip to a new parent
    Then the action chip exposes disabled state
    And the action chip has no keyboard tab stop
    When the application clicks the action chip
    Then the action chip clicks are ""

  Scenario: A suggestion chip submits its form once after DOM movement
    Given a suggestion action chip that submits a form
    When the action chip renders
    And the application observes chip form submissions
    And the application reconnects the action chip inside its form
    And the user focuses the action chip
    And the user presses "Enter" on the action chip
    Then the chip form was submitted once with the action value
