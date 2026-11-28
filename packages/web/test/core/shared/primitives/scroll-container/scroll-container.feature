Feature: Scroll container dividers
  Scenario: Default dividers reflect the scroll position
    Given a scroll container with tall content
    When the scroll container renders
    Then the scroll container defaults to above-below dividers
    And only the below divider is visible
    When the scroll container is scrolled to the middle
    Then both scroll dividers are visible
    When the scroll container is scrolled to the end
    Then only the above divider is visible

  Scenario: The thin attribute is reflected
    Given a scroll container with tall content and attributes 'thin'
    When the scroll container renders
    Then the scroll container reflects thin

  Scenario: Dividers are hidden when the content fits
    Given a scroll container with short content
    When the scroll container renders
    Then neither scroll divider is visible

  Scenario Outline: Divider options restrict visible dividers
    Given a scroll container with tall content and attributes 'dividers="<mode>"'
    When the scroll container renders
    And the scroll container is scrolled to the middle
    Then <visible> scroll dividers are visible

    Examples:
      | mode  | visible |
      | above | above   |
      | below | below   |
      | none  | neither |

  Scenario: An invalid dividers value falls back to the default
    Given a scroll container with tall content and attributes 'dividers="bogus"'
    When the scroll container renders
    Then the scroll container defaults to above-below dividers

  Scenario: Adding content updates dividers
    Given a scroll container with short content
    When the scroll container renders
    Then neither scroll divider is visible
    When the application adds tall content to the scroll container
    Then only the below divider is visible
