Feature: Split button
  A split button combines a primary action with a separate menu trigger.

  Rule: The split button groups and configures its two buttons

    Scenario: The split button exposes a group containing both buttons

      Given a split button
      When the split button renders
      Then the split button exposes a group with both buttons

    Scenario: The split button defaults to the filled variant and small size

      Given a split button
      When the split button renders
      Then the split button defaults to filled and small

    Scenario: The split button applies its variant and size to both buttons

      Given a split button with variant "tonal" and size "large"
      When the split button renders
      Then both split-button buttons use variant "tonal" and size "large"

    Scenario: Changing the variant updates both buttons

      Given a split button
      When the split button renders
      And the application changes the split-button variant to "outlined"
      Then both split-button buttons use variant "outlined"

    Scenario: Changing the size updates both buttons

      Given a split button
      When the split button renders
      And the application changes the split-button size to "extra-large"
      Then both split-button buttons use size "extra-large"

    Scenario: Invalid values fall back to defaults

      Given a split button with invalid variant and size
      When the split button renders
      Then the split button falls back to filled and small

    Scenario: Both buttons use a rounded shape

      Given a split button
      When the split button renders
      Then both split-button buttons use a rounded shape

  Rule: The leading button performs the primary action and the trailing button opens the menu

    Scenario: Activating the leading button performs the primary action without opening the menu

      Given a split button
      When the split button renders and records the primary action
      And the user activates the leading button
      Then the primary action runs once
      And the split-button menu stays closed

    Scenario: Activating the trailing button opens its menu and exposes its expanded state

      Given a split button
      When the split button renders
      And the user activates the trailing button
      Then the split-button menu is visible in the viewport
      And the trailing button is expanded
      And the split-button menu has 2 menu items

    Scenario: Choosing a menu item closes the menu and restores trailing-button focus

      Given a split button
      When the split button renders
      And the user activates the trailing button
      And the user chooses the "Duplicate" split-button menu item
      Then the split-button menu is hidden
      And the trailing button is collapsed
      And focus returns to the trailing button

  Rule: Hidden and dynamically replaced content stays synchronized

    Scenario: A hidden split button is not displayed

      Given a hidden split button
      When the split button renders
      Then the split button is hidden

    Scenario: Replacement buttons inherit the split button's current configuration

      Given a split button with variant "tonal" and size "large"
      When the split button renders
      And the application replaces both split-button buttons
      Then both replacement buttons use variant "tonal" and size "large"
      And both replacement buttons use a rounded shape
