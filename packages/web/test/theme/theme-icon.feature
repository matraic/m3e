Feature: Theme preview icon
  The theme icon previews a source color and color scheme.

  Scenario: A named preview is exposed as an image
    Given a theme icon named "Theme preview"
    Then the theme icon is a visible named image
    And the theme icon has valid surface and primary fills

  Scenario Outline: Each color variant produces a preview
    Given a theme icon with variant "<variant>"
    Then the theme icon uses variant "<variant>"
    And the theme icon has valid surface and primary fills

    Examples:
      | variant     |
      | monochrome  |
      | neutral     |
      | tonal-spot  |
      | vibrant     |
      | expressive  |
      | fidelity    |
      | content     |
      | rainbow     |
      | fruit-salad |

  Scenario: Changing the source color updates the preview
    Given a light theme icon with source color "#6750A4"
    When the theme icon source color changes to "#006A6A"
    Then the theme icon primary fill changes

  Scenario: Changing the variant updates the preview
    Given a light theme icon with source color "#6750A4"
    When the theme icon variant changes to "monochrome"
    Then the theme icon primary fill changes

  Scenario: Explicit schemes update the preview
    Given a light theme icon with source color "#6750A4"
    When the theme icon scheme changes to "dark"
    Then the theme icon uses a dark scheme
    And the theme icon surface fill changes
    When the theme icon scheme changes to "light"
    Then the theme icon uses a light scheme
    And the theme icon surface fill returns to its original color

  Scenario: Invalid options fall back to neutral and auto
    Given a theme icon with invalid options and a default theme icon
    Then the invalid theme icon uses neutral and auto
    And the invalid theme icon matches the default preview

  Scenario: CSS custom properties override preview colors
    Given a theme icon with custom preview colors
    Then the theme icon displays the custom preview colors

  Scenario: Auto follows preference changes after reconnection
    Given auto, light, and dark theme icons with a light system preference
    Then the auto theme icon matches the light preview
    When the auto theme icon is reconnected
    And the system changes to a "dark" color scheme
    Then the auto theme icon matches the dark preview
    When the system changes to a "light" color scheme
    Then the auto theme icon matches the light preview

  Scenario: An explicit scheme ignores system preference changes
    Given auto, light, and dark theme icons with a light system preference
    When the system changes to a "dark" color scheme
    Then the light theme icon uses a light scheme
    And the dark theme icon uses a dark scheme
