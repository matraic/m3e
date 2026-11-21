Feature: Chips and chip sets
  Non-interactive chips display discrete values and can be grouped horizontally or vertically.

  Scenario: A chip displays its label and decorative icons
    Given a chip labeled Design with leading and trailing icons
    When the base chips render
    Then the Design chip and both icons are visible
    And the base chip value is "Design"

  Scenario: Appearance variants fall back to outlined for unknown values
    Given base chips with elevated, outlined, and unknown variants
    When the base chips render
    Then the base chips use elevated, outlined, and outlined variants

  Scenario: A chip set arranges its chips vertically
    Given a vertical base chip set
    When the base chips render
    Then the base chip set has two chips and vertical orientation

  Scenario: Changing the label updates the implicit chip value
    Given a chip labeled Design with leading and trailing icons
    When the base chips render
    And the application replaces the base chip label with "Motion"
    Then the base chip value is "Motion"
    When the application sets the base chip value to "topic"
    And the application replaces the base chip label with "Accessibility"
    Then the base chip value is "topic"

  Scenario: Decorative icons do not create interactive controls
    Given a base chip followed by a focusable button
    When the base chips render
    Then the base chip has no keyboard tab stop
    When the user tabs past the base chip
    Then the following button has focus

  Scenario: Moving a chip set preserves its content and layout
    Given a vertical base chip set
    When the base chips render
    And the application moves the base chip set to a new parent
    Then the base chip set is in the new parent
    And the base chip set has two chips and vertical orientation
    When the application appends a base chip labeled "Motion"
    Then the base chip set contains three chips
