Feature: Icons
  Icons render Material Symbols with configurable appearance and accessible naming.

  Rule: Icons render a glyph with configurable appearance

    Scenario: An icon is decorative by default

      Given an icon named "home"
      When the icon renders
      Then the icon displays "home"
      And the icon is hidden from assistive technology
      And the icon glyph is marked as non-translatable

    Scenario: An icon supports variants, fill, grade, weight, and optical size

      Given an icon with its presentation settings configured
      When the icon renders
      Then the icon uses the configured presentation settings

    Scenario: Unsupported presentation settings fall back to defaults

      Given an icon with unsupported presentation settings
      When the icon renders
      Then the icon uses the default presentation settings

  Rule: Icons can provide accessible names

    Scenario: An icon with an accessible label is exposed as an image

      Given an icon named "home" with accessible label "Home"
      When the icon renders
      Then the icon is exposed as an image named "Home"

    Scenario: An icon keeps its accessible label when its name changes

      Given an icon named "home" with accessible label "Current icon"
      When the icon renders
      Then the icon is exposed as an image named "Current icon"
      When the application changes the icon name to "settings"
      Then the icon displays "settings"
      And the icon is exposed as an image named "Current icon"

    Scenario: An icon can get its accessible name from a label reference

      Given an icon named "search" labelled by referenced text "Search"
      When the icon renders
      Then the icon is exposed as an image named "Search"

    Scenario Outline: An icon preserves an explicit aria-hidden value

      Given an icon with explicit aria-hidden value "<value>"
      When the icon renders
      Then the icon preserves aria-hidden value "<value>"

      Examples:
        | value |
        | true  |
        | false |

  Rule: Registered SVG icons render instead of font glyphs

    Scenario: An icon renders the registered outlined or filled SVG

      Given outlined and filled SVG icons are registered
      When the icon renders
      Then the outlined and filled icons render their registered SVG paths

    Scenario: An icon renders an SVG when it is registered after rendering

      Given an icon waiting for SVG registration
      When the icon renders
      Then the icon displays "late-icon"
      When the application registers the icon
      Then the icon renders the registered SVG path
