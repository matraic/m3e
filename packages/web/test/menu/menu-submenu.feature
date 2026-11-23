Feature: Menu submenus
  Nested menus expose their relationships and remain usable through keyboard and DOM changes.

  Rule: Submenu triggers expose and control their nested menu

    Scenario: Activating a submenu action opens it and selecting an action closes the menu hierarchy

      Given a menu with a Fruits submenu
      When the submenu fixture renders
      Then the submenu action exposes collapsed popup semantics
      And the submenu is hidden from the accessibility tree
      When the user opens the root menu
      And the user activates submenu action "Fruits"
      Then the submenu is visible and announced as expanded
      When the user selects submenu action "Apricot"
      Then the menu hierarchy is closed and focus returns to the root trigger

    Scenario: Arrow keys open and close only the submenu

      Given a menu with a Fruits submenu
      When the submenu fixture renders
      And the user opens the root menu
      And the user focuses submenu action "Fruits"
      When the user presses "ArrowRight" in the submenu parent
      Then the submenu is visible
      When the user focuses submenu action "Apricot"
      And the user presses "ArrowLeft" in the submenu
      Then the submenu is hidden and focus returns to "Fruits"
      And the root menu remains visible

    Scenario: Open menus reposition when an ancestor or parent menu scrolls

      Given a scrollable menu with a submenu
      When the scrollable menu fixture renders
      And the user opens the root menu
      And the user opens submenu "Fruits"
      Then both open menus follow their scrolling ancestors

  Rule: Menu behavior survives DOM movement

    Scenario: Moving a closed menu preserves its trigger and actions

      Given a movable menu with enabled and disabled actions
      When the menu movement fixture renders
      And the application moves the closed menu to another parent
      Then the trigger still controls the menu
      When the user opens the moved menu
      Then the moved menu is visible with all accessible actions

    Scenario: Moving an open trigger closes the menu and transfers its semantics

      Given a menu with two trigger buttons
      When the menu movement fixture renders
      And the user opens the first root menu
      Then the root menu is visible
      When the application moves the menu trigger to the second button
      Then the first button no longer announces a menu
      And the second button announces a collapsed menu
      And the root menu is hidden
      When the user opens the root menu from the second button
      Then the second button announces an expanded menu
      And the root menu is visible
