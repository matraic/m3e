Feature: Theme
  The m3e-theme element applies color, motion, density, and focus tokens to its content.

  Rule: Motion schemes provide scoped spring tokens

    Scenario Outline: A motion scheme supplies valid spring transitions
      Given a theme with motion scheme "<scheme>"
      Then its spring durations are "<durations>" milliseconds
      And each spring token is a valid CSS transition

      Examples:
        | scheme     | durations                    |
        | standard   | 350, 500, 750, 150, 200, 300 |
        | expressive | 350, 500, 650, 150, 200, 300 |

    Scenario: A nested theme uses its own motion scheme
      Given an expressive theme containing a standard theme
      Then the outer content uses expressive spring durations
      And the inner content uses standard spring durations

    Scenario: An unknown motion scheme falls back to standard
      Given an expressive theme containing standard and unknown motion schemes
      Then the unknown motion scheme becomes "standard"
      And its spring tokens match the standard theme

  Rule: Color tokens respond to the theme configuration

    Scenario: Changing the source color updates tokens and dispatches a change event
      Given a light theme with source color "#6750A4"
      And its primary color is a valid hex color
      When its color attribute changes to "#006A6A"
      Then it dispatches a change event
      And its primary color changes

    Scenario: Moving a theme preserves its styles
      Given a nested light theme with source color "#006A6A"
      When the theme moves directly under the body
      Then its primary color remains unchanged
      When the theme moves back to its nested parent
      Then its primary color remains unchanged

    Scenario Outline: Each color variant derives a primary color
      Given a light theme with source color "#6750A4" and variant "<variant>"
      Then its primary color is a valid hex color

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
        | bogus       |

    Scenario Outline: Changing a color option updates the palette
      Given a theme with source color "#6750A4" and "<attribute>" set to "<from>"
      When its "<attribute>" attribute changes to "<to>"
      Then its primary color changes

      Examples:
        | attribute | from       | to         |
        | variant   | tonal-spot | monochrome |
        | contrast  | standard   | high       |
        | contrast  | standard   | medium     |
        | scheme    | light      | dark       |

    Scenario: Updating color through the property updates the palette
      Given a light theme with source color "#6750A4"
      When its color property changes to "#00897B"
      Then its primary color changes

    Scenario Outline: Auto color scheme follows system preference
      Given the system prefers the "<scheme>" color scheme
      And an auto theme and a "<scheme>" theme
      Then their surface colors match

      Examples:
        | scheme |
        | dark   |
        | light  |

  Rule: Density and focus indicators are configurable

    Scenario Outline: Density is reflected in the density token
      Given a theme with density <density>
      Then its density token is <density>

      Examples:
        | density |
        | 0       |
        | -1      |
        | -2      |

    Scenario Outline: Strong focus controls focus ring visibility
      Given a theme with strong focus "<state>"
      Then its focus ring visibility is "<visibility>"

      Examples:
        | state    | visibility |
        | enabled  | visible    |
        | disabled | hidden     |

    Scenario: Updating density through the property updates the token
      Given a theme with density 0
      When its density property changes to -2
      Then its density token is -2

    Scenario: Updating strong focus through the property updates the token
      Given a theme with strong focus "disabled"
      When its strong focus property is enabled
      Then its focus ring visibility is "visible"

  Rule: Removing an attribute restores its default

    Scenario: Removing an invalid variant restores the default, not the invalid-value fallback
      Given a theme with invalid variant "bogus"
      Then its variant is "neutral"
      When its "variant" attribute is removed
      Then its variant is "tonal-spot"

    Scenario Outline: Removing an attribute restores a fresh theme's property and tokens
      Given a fresh theme and a theme with "<attribute>" set to "<value>"
      And the configured property "<property>" differs from the fresh theme
      When the configured theme's "<attribute>" attribute is removed
      Then its "<property>" property and derived tokens match the fresh theme

      Examples:
        | attribute    | value    | property    |
        | color        | #006A6A  | color       |
        | variant      | vibrant  | variant     |
        | scheme       | dark     | scheme      |
        | contrast     | high     | contrast    |
        | motion       | standard | motion      |
        | density      | -2       | density     |
        | strong-focus |          | strongFocus |
