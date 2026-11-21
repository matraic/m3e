Feature: Card
  Cards organize content and can provide an accessible action or link.

  Rule: Cards support adaptive shapes

    Scenario Outline: Cut shapes propagate to media and interaction surfaces
      Given an actionable media card with variant "<variant>" and cut shapes
      When the card renders
      Then the card surface, media, and visual primitives use cut corners
      And the card surface has CSS "border-radius" of "12px"

      Examples:
        | variant  |
        | filled   |
        | outlined |
        | elevated |

    Scenario: Logical corners respond to direction and card overrides
      Given a card with mixed logical corner defaults
      When the card renders
      Then the card surface has CSS "corner-shape" of "superellipse(1) superellipse(0)"
      When the application sets the card attribute "dir" to "rtl"
      Then the card surface has CSS "corner-shape" of "superellipse(0) superellipse(1)"
      When the application sets card CSS property "--m3e-card-shape-family" to "bevel"
      Then the card surface has CSS "corner-shape" of "superellipse(0)"
      When the application sets card CSS property "--m3e-card-shape-family" to "round"
      Then the card surface has CSS "corner-shape" of "superellipse(1)"
      When the application sets card CSS property "--m3e-card-shape-family-start-start" to "bevel"
      Then the card surface has CSS "corner-start-start-shape" of "superellipse(0)"
      And the card surface has CSS "corner-start-end-shape" of "superellipse(1)"
      When the application removes card CSS property "--m3e-card-shape-family-start-start"
      Then the card surface has CSS "corner-shape" of "superellipse(1)"
      When the application removes card CSS property "--m3e-card-shape-family"
      Then the card surface has CSS "corner-shape" of "superellipse(0) superellipse(1)"

  Rule: Cards display their content and appearance settings

    Scenario: Dedicated slots display their content
      Given a card with header, content, actions, and footer
      When the card renders
      Then card text "Product name" is visible
      And card text "Product details" is visible
      And card text "Buy now" is visible
      And card text "In stock" is visible

    Scenario: The default slot supports custom content
      Given a card with default content "Custom card content"
      When the card renders
      Then card text "Custom card content" is visible

    Scenario: Defaults to filled, vertical, and block presentation
      Given a card with default content "Card content"
      When the card renders
      Then the card surface has CSS "corner-shape" of "superellipse(1)"
      And the card surface has CSS "border-radius" of "12px"
      And the card's effective variant is "filled"
      And the card's effective orientation is "vertical"
      And the card uses block presentation

    Scenario: Inline cards render inline
      Given an inline card
      When the card renders
      Then the card reflects attribute "inline" with value ""
      And the card has CSS "display" of "inline-block"

    Scenario Outline: Accepts a supported variant
      Given a card with variant "<variant>"
      When the card renders
      Then the card reflects attribute "variant" with value "<variant>"

      Examples:
        | variant  |
        | filled   |
        | outlined |
        | elevated |

    Scenario: An unknown variant falls back to filled
      Given a card with variant "unknown"
      When the card renders
      Then the card's effective variant is "filled"

    Scenario Outline: Accepts a supported orientation
      Given a card with orientation "<orientation>"
      When the card renders
      Then the card reflects attribute "orientation" with value "<orientation>"
      And the card surface has CSS "flex-direction" of "<direction>"

      Examples:
        | orientation | direction |
        | horizontal  | row       |
        | vertical    | column    |

    Scenario: An unknown orientation falls back to vertical
      Given a card with orientation "diagonal"
      When the card renders
      Then the card's effective orientation is "vertical"

  Rule: Actionable cards expose accessible interaction

    Scenario: Only actionable cards are buttons and focusable
      Given a static card and an actionable card
      When the card renders
      Then a card button named "Actionable card" is visible
      And the static card is not keyboard focusable
      And the actionable card has tabindex "0"

    Scenario: Pointer, Enter, and Space activate an actionable card
      Given an actionable card named "Open details"
      When the card renders
      And the application observes card clicks
      And the user clicks the card
      Then the card dispatches 1 click
      When the user focuses the card
      And the user presses "Enter" on the card
      Then the card dispatches 2 clicks
      When the user presses "Space" on the card
      Then the card dispatches 3 clicks

    Scenario: Disabled cards suppress clicks
      Given a disabled actionable card
      When the card renders
      And the application observes card clicks
      Then the card reflects attribute "aria-disabled" with value "true"
      And the card is not keyboard focusable
      When the application clicks the card
      Then the card dispatches 0 clicks

    Scenario: An actionable card with an href is a link
      Given an actionable link card
      When the card renders
      Then a card link named "View details" is visible

    Scenario: Tab skips static cards and focuses actionable cards
      Given a static card and an actionable card
      When the card renders
      And the user presses "Tab" on the card
      Then the actionable card has keyboard focus

    Scenario: Disabled-interactive cards retain focus but suppress activation
      Given a disabled-interactive actionable card
      When the card renders
      And the application observes card clicks
      Then the card reflects attribute "aria-disabled" with value "true"
      And the actionable card has tabindex "0"
      When the user presses "Tab" on the card
      Then the actionable card has keyboard focus
      When the user presses "Enter" on the card
      And the user presses "Space" on the card
      And the application clicks the card
      Then the card dispatches 0 clicks

    Scenario: Removing disabled restores keyboard activation
      Given a disabled actionable card
      When the card renders
      And the application observes card clicks
      And the application removes card attribute "disabled"
      Then the actionable card has tabindex "0"
      And the card is not exposed as disabled
      When the user focuses the card
      And the user presses "Enter" on the card
      Then the card dispatches 1 click

    Scenario: Changing href updates link and button semantics
      Given an actionable card named "Open details"
      When the card renders
      And the application sets the card attribute "href" to "#details"
      Then a card link named "Open details" is visible
      When the application removes card attribute "href"
      Then a card button named "Open details" is visible

    Scenario: Forced colors preserve an outline and disabled indication
      Given a disabled actionable card
      And forced colors are active for cards
      When the card renders
      Then the card surface has CSS "border-style" of "solid"
      And the card surface has CSS "border-width" of "1px"
      And the card surface uses the disabled system color

  Rule: Cards update after rendering

    Scenario: Variant and orientation changes update the surface
      Given a card with default content "Card content"
      When the card renders
      And the application sets the card attribute "variant" to "outlined"
      Then the card surface has CSS "border-style" of "solid"
      When the application sets the card attribute "orientation" to "horizontal"
      Then the card surface has CSS "flex-direction" of "row"
      When the application sets the card attribute "variant" to "unknown"
      Then the card's effective variant is "filled"
      When the application sets the card attribute "orientation" to "diagonal"
      Then the card's effective orientation is "vertical"
      And the card surface has CSS "flex-direction" of "column"

    Scenario: Removing dedicated content reveals default content
      Given a card with dedicated and default content
      When the card renders
      Then card text "Product details" is visible
      And card text "Fallback content" is not visible
      When the application removes the card content slot
      Then card text "Fallback content" is visible

  Rule: Cards can move between DOM parents

    Scenario: Moving an actionable card preserves content and activation without duplicate listeners
      Given an actionable card named "Open details"
      And the card has variant "outlined" and orientation "horizontal"
      When the card renders
      And the application observes card clicks
      And the application moves the card to a new DOM parent
      Then the card is in the new DOM parent
      And a card button named "Open details" is visible
      And the card surface has CSS "border-style" of "solid"
      And the card surface has CSS "flex-direction" of "row"
      When the user clicks the card
      Then the card dispatches 1 click
      When the application moves the card to a new DOM parent
      And the user focuses the card
      And the user presses "Enter" on the card
      Then the card dispatches 2 clicks

    Scenario: Moving a pressed card clears its pressed state
      Given an actionable card named "Open details"
      When the card renders
      And the user focuses the card
      And the user holds Space on the card
      Then the card surface is pressed
      When the application moves the card to a new DOM parent
      Then the card surface is not pressed
      When the user releases Space on the card
      Then a card button named "Open details" is visible

    Scenario: Moving a disabled card preserves suppression
      Given a disabled actionable card
      When the card renders
      And the application observes card clicks
      And the application moves the card to a new DOM parent
      Then the card reflects attribute "aria-disabled" with value "true"
      And the card is not keyboard focusable
      When the application clicks the card
      Then the card dispatches 0 clicks
