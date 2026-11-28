Feature: Text overflow
  Scenario: Long text truncates with an ellipsis
    Given a text overflow element with long text in a 100 pixel container
    When the text overflow element renders
    Then the text overflow uses a single-line ellipsis
    And the text overflow fits its container and its content overflows

  Scenario: Short text is not truncated
    Given a text overflow element with short text
    When the text overflow element renders
    Then the text overflow content does not overflow

  Scenario: Slotted text is displayed
    Given a text overflow element containing "Hello"
    When the text overflow element renders
    Then the text overflow content "Hello" is visible

  Scenario: The hidden attribute hides the element
    Given a hidden text overflow element containing "Hello"
    When the text overflow element renders
    Then the text overflow element is hidden
