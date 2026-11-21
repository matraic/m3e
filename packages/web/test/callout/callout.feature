Feature: Callout
  Callouts present supporting content with visual emphasis.

  Rule: Callouts display their content and defaults

    Scenario: Renders its label, icon, and supporting content
      Given a callout with an icon, label, and supporting content
      When the callout renders
      Then the callout is exposed as complementary content
      And the callout label "Account notice" is visible
      And the callout content "Your profile needs attention." is visible
      And the callout icon "i" is visible

    Scenario: Defaults to the secondary variant and rounded shape
      Given a callout with supporting content
      When the callout renders
      Then the callout's effective variant is "secondary"
      And the callout's effective shape is "rounded"

  Rule: Callouts support appearance variants

    Scenario Outline: Accepts a supported variant
      Given a callout with variant "<variant>"
      When the callout renders
      Then the callout reflects variant "<variant>"

      Examples:
        | variant   |
        | primary   |
        | secondary |
        | tertiary  |
        | error     |
        | surface   |

    Scenario: Falls back to secondary for an unknown variant
      Given a callout with variant "unknown"
      When the callout renders
      Then the callout's effective variant is "secondary"

  Rule: Callouts support different shapes

    Scenario Outline: Accepts a supported shape
      Given a callout with shape "<shape>"
      When the callout renders
      Then the callout reflects shape "<shape>"

      Examples:
        | shape   |
        | rounded |
        | square  |

    Scenario: Falls back to rounded for an unknown shape
      Given a callout with shape "pill"
      When the callout renders
      Then the callout's effective shape is "rounded"

  Rule: Callouts can move between DOM parents

    Scenario: Moving a callout preserves its content and appearance settings
      Given a callout with an icon, label, and supporting content
      And a callout with variant "primary"
      And a callout with shape "square"
      When the callout renders
      And the application moves the callout to a new DOM parent
      Then the callout is in the new DOM parent
      And the callout is exposed as complementary content
      And the callout label "Account notice" is visible
      And the callout content "Your profile needs attention." is visible
      And the callout icon "i" is visible
      And the callout's effective variant is "primary"
      And the callout's effective shape is "square"
