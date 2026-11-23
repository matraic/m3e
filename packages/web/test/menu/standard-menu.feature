Feature: Standard menus
  Menus present accessible actions, support keyboard navigation, and manage focus.

  Rule: Menu triggers expose popup semantics and control visibility

    Scenario: A trigger opens and closes its accessible menu

      Given a standard menu with enabled and disabled actions
      When the menu fixture renders
      Then the trigger exposes collapsed menu semantics
      And the menu and its actions are hidden
      When the user opens the menu
      Then the menu is visible with all accessible actions
      When the user closes the menu
      Then the menu is hidden and the trigger is collapsed

    Scenario: Selecting an action closes the menu and restores focus

      Given a standard menu with enabled and disabled actions
      When the menu fixture renders
      And the user opens the menu
      When the user selects menu action "Apple"
      Then the menu closes and focus returns to its trigger

    Scenario: A disabled action cannot activate or close the menu

      Given a standard menu with enabled and disabled actions
      When the menu fixture renders
      And the user opens the menu
      When the user attempts to activate disabled menu action "Apricot"
      Then the disabled action remains unavailable and the menu stays open

  Rule: Keyboard interaction preserves menu focus behavior

    Scenario: Escape closes the menu and restores trigger focus

      Given a standard menu with enabled and disabled actions
      When the menu fixture renders
      And the user opens the menu
      And the user focuses menu action "Apple"
      When the user presses "Escape" in the menu
      Then the menu closes and focus returns to its trigger

    Scenario: Tab closes the menu and moves focus onward

      Given a standard menu with enabled and disabled actions
      When the menu fixture renders
      And the user opens the menu
      And the user focuses menu action "Apple"
      When the user presses "Tab" in the menu
      Then the menu is hidden
      And focus moves past the menu

    Scenario: Arrow keys skip disabled actions and Home and End reach enabled boundaries

      Given a standard menu with enabled and disabled actions
      When the menu fixture renders
      And the user opens the menu
      And the user focuses menu action "Apple"
      When the user presses "ArrowDown" in the menu
      Then menu action "Avocado" is focused
      When the user presses "ArrowDown" in the menu
      Then menu action "Apple" is focused
      When the user presses "End" in the menu
      Then menu action "Avocado" is focused
      When the user presses "Home" in the menu
      Then menu action "Apple" is focused

    Scenario: Clicking outside closes the menu

      Given a standard menu with enabled and disabled actions
      When the menu fixture renders
      And the user opens the menu
      When the user clicks outside the menu
      Then the menu is hidden and the trigger is collapsed

  Rule: Invalid menu variants fall back to the standard appearance

    Scenario: An invalid variant is normalized

      Given a menu with an invalid variant
      When the menu fixture renders
      Then the menu uses the standard variant
