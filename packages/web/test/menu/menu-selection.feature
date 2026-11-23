Feature: Menu selections
  Checkbox and radio menu items expose and update their checked states.

  Rule: Checkbox actions keep independent checked states

    Scenario: Space toggles a checkbox without closing the menu

      Given a menu with unchecked Bold and checked Italic options
      When the selection menu renders
      And the user opens the selection menu
      Then Bold is unchecked and Italic is checked
      When the user focuses menu option "Bold"
      And the user presses Space in the selection menu
      Then Bold is checked and the selection menu remains open
      When the user selects menu option "Italic"
      Then Italic is unchecked and the selection menu is closed

    Scenario: A disabled checkbox cannot be toggled

      Given a menu with a disabled checkbox option
      When the selection menu renders
      And the user opens the selection menu
      When the user attempts to activate the disabled checkbox
      Then the disabled checkbox remains unchecked and the menu stays open

  Rule: Radio actions are exclusive within their accessible group

    Scenario: Selecting a radio action replaces the checked action

      Given a menu with an Order radio group
      When the selection menu renders
      And the user opens the selection menu
      Then the Order group exposes its radio actions and current choice
      When the user selects radio action "Descending"
      Then Descending is checked and Ascending is unchecked
      And the selection menu is closed
