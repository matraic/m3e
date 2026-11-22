Feature: Headings
  Headings establish visual hierarchy and optional heading semantics.

  Rule: Headings render their content with a typescale

    Scenario: A heading uses the default variant and size

      Given a heading with content "Page title"
      When the heading renders
      Then the heading displays "Page title"
      And the heading uses the default display medium typescale
      And the heading has no heading semantics by default

    Scenario: Headings support variants, sizes, and emphasis

      Given headings with different variants, sizes, and emphasis
      When the headings render
      Then the first heading uses the emphasized large headline typescale
      And the second heading uses the small title typescale
      And the third heading uses the medium label typescale

    Scenario: Toggling emphasis updates the rendered typography

      Given two identical headline headings with one emphasized
      When the headings render
      Then the emphasized heading has different typography
      When the application toggles emphasis off
      Then both headings have the same typography
      When the application toggles emphasis on
      Then the emphasized heading has different typography

    Scenario: Unsupported variant and size values fall back to defaults

      Given a heading with unsupported variant and size values
      When the heading renders
      Then the heading falls back to display medium

  Rule: Heading semantics are opt-in and update accessibly

    Scenario Outline: Boundary heading levels provide heading semantics

      Given a heading at level <level>
      When the heading renders
      Then the heading is accessible as level <level> with name "Section title"

      Examples:
        | level |
        | 1     |
        | 6     |

    Scenario Outline: An invalid level does not provide heading semantics

      Given a heading with invalid level "<level>"
      When the heading renders
      Then the heading has no heading semantics

      Examples:
        | level       |
        | 0           |
        | 7           |
        | 2.5         |
        | not-a-number |

    Scenario: A heading level provides and updates accessible heading semantics

      Given a heading at level 2
      When the heading renders
      Then the heading is accessible as level 2 with name "Section title"
      When the application changes the heading level to 1
      Then the heading is accessible as level 1 with name "Section title"
      When the application changes the heading level to 7
      Then the heading has no heading semantics
      When the application removes the heading level
      Then the heading has no heading semantics
