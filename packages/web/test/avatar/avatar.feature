Feature: Avatar
  The avatar presents a user's image or initials.

  Rule: Avatar content comes from its default slot

    Scenario: Displays slotted initials
      Given an avatar with slotted initials
      When the avatar renders
      Then the avatar is visible
      And the initials "AB" are visible

    Scenario: Displays a slotted image
      Given an avatar with a slotted image
      When the avatar renders
      Then the avatar is visible
      And the slotted image has accessible name "Alex Morgan"

    Scenario: Displays a slotted icon with an accessible name
      Given an avatar with a slotted icon
      When the avatar renders
      Then the avatar is visible
      And the slotted icon has accessible name "Person"
