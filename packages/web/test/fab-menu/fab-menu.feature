Feature: Floating action button menus
  FAB menus reveal related actions from a floating action button.

  Rule: A FAB menu exposes accessible actions

    Scenario: The FAB announces and opens its menu
      Given a FAB menu with two actions
      When the FAB menu renders
      Then the FAB menu trigger announces a collapsed menu
      And the FAB menu actions are excluded from the accessibility tree
      When the user opens the FAB menu
      Then the FAB menu trigger announces an expanded menu
      And the FAB menu is visible
      And the FAB menu has 2 accessible actions
      And the FAB menu action "First action" is visible

    Scenario: Selecting an action closes the menu and restores focus
      Given a FAB menu with two actions
      When the FAB menu renders
      And the user opens the FAB menu
      And the user selects FAB menu action "First action"
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu
      And the FAB menu trigger is focused

    Scenario: A canceled action keeps the menu open
      Given a FAB menu with two actions
      When the FAB menu renders
      And the user opens the FAB menu
      And the application cancels the next FAB menu action
      And the user selects FAB menu action "First action"
      Then the FAB menu remains open
      And the FAB menu action was canceled
      When the user selects FAB menu action "First action"
      Then the FAB menu is hidden
      And the FAB menu trigger is focused

    Scenario: Escape closes the menu and restores focus
      Given a FAB menu with two actions
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu is visible
      When the user presses "Escape" in the FAB menu
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu
      And the FAB menu trigger is focused

    Scenario Outline: Immediately closing does not focus an action later
      Given a FAB menu with two actions and motion preference "<motion>"
      When the FAB menu renders
      And the application closes the FAB menu as soon as it opens
      And the user opens the FAB menu
      Then the FAB menu trigger announces a collapsed menu
      And the FAB menu is hidden
      And no FAB menu action receives delayed focus
      And the FAB menu trigger is focused

      Examples:
        | motion        |
        | no-preference |
        | reduce        |

    Scenario: Escape restores focus after an action is focused
      Given a FAB menu with two actions
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "First action" is focused
      When the user presses "Escape" in the FAB menu
      Then the FAB menu is hidden
      And the FAB menu trigger is focused

    Scenario: Arrow navigation skips disabled actions
      Given a FAB menu with a disabled action between two enabled actions
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "First action" is focused
      And FAB menu action "Unavailable action" is disabled
      When the user presses "ArrowDown" in the FAB menu
      Then FAB menu action "Last action" is focused
      When the user presses "ArrowUp" in the FAB menu
      Then FAB menu action "First action" is focused
      When the application clicks FAB menu action "Unavailable action"
      Then the FAB menu remains open

    Scenario: Home, End and arrow keys navigate between actions and the FAB
      Given a FAB menu with two actions
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "First action" is focused
      When the user presses "End" in the FAB menu
      Then the FAB menu trigger is focused
      When the user presses "ArrowDown" in the FAB menu
      Then FAB menu action "First action" is focused
      When the user presses "ArrowUp" in the FAB menu
      Then the FAB menu trigger is focused
      When the user presses "ArrowUp" in the FAB menu
      Then FAB menu action "Second action" is focused
      When the user presses "Home" in the FAB menu
      Then FAB menu action "First action" is focused

    Scenario: Tab closes the menu and moves focus onward
      Given a FAB menu with two actions
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "First action" is focused
      When the user presses "Tab" in the FAB menu
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu
      And focus moves past the FAB menu

    Scenario Outline: A menu with no visible actions stays closed
      Given a FAB menu with "<contents>"
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu
      And the FAB menu actions are excluded from the accessibility tree
      When the user presses "Enter" in the FAB menu
      And the user presses "Space" in the FAB menu
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu

      Examples:
        | contents            |
        | no actions          |
        | only hidden actions |

    Scenario: A menu with only disabled actions keeps focus on its FAB
      Given a FAB menu with "only disabled actions"
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu is visible
      And the FAB menu has 2 accessible actions
      And all FAB menu actions are disabled
      When the FAB menu settles its initial focus
      Then the FAB menu trigger is focused
      When the user presses "ArrowDown" in the FAB menu
      And the user presses "ArrowUp" in the FAB menu
      And the user presses "Home" in the FAB menu
      And the user presses "End" in the FAB menu
      Then the FAB menu trigger is focused
      When the user presses "Escape" in the FAB menu
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu
      And the FAB menu trigger is focused

    Scenario: An empty FAB menu cannot be opened through the API
      Given a FAB menu with "no actions"
      When the FAB menu renders
      And the application opens the FAB menu through its API
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu

    Scenario: A disabled FAB cannot open its menu
      Given a FAB menu with a disabled trigger
      When the FAB menu renders
      Then the FAB menu trigger is disabled
      When the application clicks the FAB menu trigger
      Then the FAB menu is hidden
      And the FAB menu trigger remains collapsed
      And the FAB menu actions are excluded from the accessibility tree
      When the user clicks the disabled FAB menu trigger
      Then the FAB menu is hidden

    Scenario: A disabled-interactive FAB cannot open its menu
      Given a FAB menu with a disabled-interactive trigger
      When the FAB menu renders
      Then the FAB menu trigger is disabled
      When the user focuses the FAB menu trigger
      Then the FAB menu trigger is focused
      When the user presses "Enter" in the FAB menu
      And the user presses "Space" in the FAB menu
      And the user clicks the disabled FAB menu trigger
      And the application clicks the FAB menu trigger
      Then the FAB menu is hidden
      And the FAB menu trigger remains collapsed
      And the FAB menu actions are excluded from the accessibility tree

    Scenario: An action added while open joins keyboard navigation
      Given a FAB menu with two actions
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "First action" is focused
      When the application adds FAB menu action "Third action"
      Then the FAB menu has 3 accessible actions
      And FAB menu action "First action" is focused
      When the user presses "End" in the FAB menu
      Then the FAB menu trigger is focused
      When the user presses "ArrowUp" in the FAB menu
      Then FAB menu action "Third action" is focused
      When the user presses "Home" in the FAB menu
      Then FAB menu action "First action" is focused

    Scenario: Adding an action while the FAB is focused preserves the active item
      Given a FAB menu with two actions
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "First action" is focused
      When the user presses "End" in the FAB menu
      Then the FAB menu trigger is focused
      When the application adds FAB menu action "Third action"
      Then the FAB menu has 3 accessible actions
      And the FAB menu trigger is focused
      When the user presses "ArrowUp" in the FAB menu
      Then FAB menu action "Third action" is focused

    Scenario: Adding an action makes an empty FAB menu available
      Given a FAB menu with "no actions"
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu is hidden
      When the application adds FAB menu action "First action"
      And the user opens the FAB menu
      Then the FAB menu is visible
      And FAB menu action "First action" is focused

    Scenario: Removing an unfocused action preserves keyboard navigation
      Given a FAB menu with two actions
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "First action" is focused
      When the application removes FAB menu action "Second action"
      Then the FAB menu has 1 accessible action
      And FAB menu action "First action" is focused
      When the user presses "ArrowDown" in the FAB menu
      Then the FAB menu trigger is focused
      When the user presses "ArrowDown" in the FAB menu
      Then FAB menu action "First action" is focused

    Scenario: Disabling and enabling an action updates keyboard navigation
      Given a FAB menu with two actions
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "First action" is focused
      When the application disables FAB menu action "Second action"
      Then FAB menu action "Second action" is disabled
      When the user presses "ArrowDown" in the FAB menu
      Then the FAB menu trigger is focused
      When the application enables FAB menu action "Second action"
      Then FAB menu action "Second action" is enabled
      When the user presses "ArrowUp" in the FAB menu
      Then FAB menu action "Second action" is focused

    Scenario Outline: Keyboard activation selects an action
      Given a FAB menu with two actions
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "First action" is focused
      When the user presses "<key>" in the FAB menu
      Then the FAB menu is hidden
      And the FAB menu trigger is focused

      Examples:
        | key   |
        | Enter |
        | Space |

    Scenario: A link action navigates and closes the menu
      Given a FAB menu with a link action
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu action "Open destination" is visible
      When the user selects FAB menu action "Open destination"
      Then the FAB menu is hidden
      And the FAB menu navigates to "#destination"

    Scenario: Removing the last action closes the FAB menu
      Given a FAB menu with a link action
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu is visible
      When the application removes FAB menu action "Open destination"
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu

    Scenario: Removing the last action while opening cancels the FAB menu
      Given a FAB menu with a link action
      When the FAB menu renders
      And the application removes the last FAB menu action while opening
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu
      When the application adds FAB menu action "First action"
      And the user opens the FAB menu
      Then the FAB menu is visible
      And FAB menu action "First action" is focused

    Scenario: Canceling a link action prevents navigation and keeps the menu open
      Given a FAB menu with a link action
      When the FAB menu renders
      And the user opens the FAB menu
      And the application cancels the next FAB menu action
      And the user selects FAB menu action "Open destination"
      And deferred FAB menu link actions have completed
      Then the FAB menu remains open
      And the FAB menu action was canceled
      And the FAB menu navigates to ""

    Scenario: A disabled link action cannot navigate
      Given a FAB menu with a disabled link action
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "Unavailable destination" is disabled
      When the application clicks FAB menu action "Unavailable destination"
      And the user clicks the disabled FAB menu action "Unavailable destination"
      And deferred FAB menu link actions have completed
      Then the FAB menu remains open
      And the FAB menu navigates to ""

    Scenario: Link attributes are forwarded to native activation
      Given a FAB menu link action with target, rel and download
      When the FAB menu renders
      And the application observes native FAB menu link activation
      And the user opens the FAB menu
      Then the FAB menu has 1 accessible action
      And the FAB menu link exposes its attributes on the hidden native anchor
      When the user selects FAB menu action "Download report"
      Then the FAB menu is hidden
      And native FAB menu link activation preserves its attributes

    Scenario: Decorative icons do not alter action names
      Given a FAB menu action with a decorative icon
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu action "Share" is visible
      And the FAB menu icon is excluded from the accessibility tree

  Rule: FAB menus adapt to constrained space and display modes

    Scenario: Forced-color container and item shapes are independent
      Given a FAB menu with independent forced-color shapes
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu has the configured round container and beveled item shapes
      When the application changes the FAB menu container shape to bevel
      Then the FAB menu container is beveled

    Scenario Outline: Focus rings remain visible while scrolling
      Given a scrollable FAB menu in "<direction>" direction
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu scrolls
      And FAB menu action "Share" is focused
      When the user navigates the scrollable FAB menu
      Then focus rings and FAB alignment remain visible for both ends of the menu

      Examples:
        | direction |
        | ltr       |
        | rtl       |

    Scenario: A raised FAB menu scrolls below the trigger without blocking the page
      Given a scrollable FAB menu above a page action
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "Share" is focused
      And the FAB menu scrolls
      And the last FAB menu action begins above the trigger
      When the user scrolls the FAB menu to the beginning
      Then the last FAB menu action is reachable below the trigger at the viewport edge
      When the user clicks the page action behind the FAB menu
      Then the FAB menu is hidden

    @fab-menu-touch
    Scenario: A scrollable FAB menu is a touch target
      Given a touch-scrollable FAB menu
      When the FAB menu renders
      And the user taps the FAB menu trigger
      Then the FAB menu scrolls
      And the empty FAB menu area receives pointer input

    Scenario: A scrollable FAB menu retains its width when closing
      Given a scrollable FAB menu with a maximum width
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu scrolls
      And the FAB menu retains its constrained width when closing

    Scenario Outline: FAB menu variants are normalized
      Given a FAB menu with variant "<input>"
      When the FAB menu renders
      Then the FAB menu variant is "<expected>"

      Examples:
        | input       | expected  |
        | primary     | primary   |
        | secondary   | secondary |
        | tertiary    | tertiary  |
        | unsupported | primary   |

  Rule: FAB menu motion follows the selected motion scheme

    Scenario: Menu actions stagger in opposite orders when opening and closing
      Given a FAB menu with "expressive" motion
      When the FAB menu renders
      Then FAB menu action stagger delays match the opening and closing sequences

    Scenario Outline: Actions grow from zero using the fast spatial spring
      Given a FAB menu with "<motion>" motion
      When the FAB menu renders
      Then FAB menu actions grow to their natural widths using the selected fast spatial spring

      Examples:
        | motion     |
        | standard   |
        | expressive |

    Scenario: Labels and menu width remain anchored while actions grow
      Given a FAB menu with "expressive" motion
      When the FAB menu renders
      Then FAB menu labels and width remain anchored throughout the growing animation

    Scenario: Reopening while closing continues from the current widths
      Given a FAB menu with "expressive" motion
      When the FAB menu renders
      Then FAB menu actions reopen from their current widths to their natural widths

    Scenario: Open actions resize when their content changes
      Given a FAB menu with "expressive" motion
      When the FAB menu renders
      And the user opens the FAB menu
      And the FAB menu finishes its animations
      And the application lengthens the first FAB menu action
      Then the first FAB menu action grows with its content

    Scenario: Reduced motion opens and closes without item animation
      Given a FAB menu with expressive motion and reduced motion
      When the FAB menu renders
      Then FAB menu actions open and close without animation

  Rule: FAB menu behavior survives DOM movement

    Scenario: Moving a closed menu preserves its trigger and actions
      Given a FAB menu with two actions
      When the FAB menu renders
      And the application moves the FAB menu to another parent
      And the user opens the FAB menu
      Then the FAB menu trigger announces an expanded menu
      And the FAB menu action "First action" is visible
      When the user selects FAB menu action "First action"
      Then the FAB menu is hidden
      And the FAB menu trigger is focused

    Scenario Outline: Moving an open menu leaves it ready to reopen
      Given a FAB menu with two actions and motion preference "<motion>"
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu is visible
      When the application moves the FAB menu to another parent
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu
      When the user opens the FAB menu
      Then the FAB menu is visible
      And FAB menu action "First action" is focused

      Examples:
        | motion        |
        | no-preference |
        | reduce        |

    Scenario: Moving a closing menu finishes its transition and allows reopening
      Given a FAB menu with two actions and motion preference "no-preference"
      When the FAB menu renders
      And the user opens the FAB menu
      Then FAB menu action "First action" is focused
      When the user presses "Escape" in the FAB menu
      And the application moves the FAB menu to another parent
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu
      When the user opens the FAB menu
      Then the FAB menu is visible
      And FAB menu action "First action" is focused

    Scenario: Moving a menu while it is opening cancels the pending opening
      Given a FAB menu with two actions
      When the FAB menu renders
      And the application moves the FAB menu while it is opening
      Then the FAB menu is hidden
      And the FAB menu trigger announces a collapsed menu
      When the user opens the FAB menu
      Then the FAB menu is visible
      And FAB menu action "First action" is focused

    Scenario: Moving a trigger transfers its semantics and behavior
      Given two FABs and a FAB menu trigger in the first
      When the FAB menu renders
      And the application moves the FAB menu trigger to the second FAB
      Then the first FAB no longer announces a FAB menu
      And the second FAB announces a collapsed FAB menu
      When the user opens the FAB menu from the second FAB
      Then the second FAB announces an expanded FAB menu
      And the FAB menu action "First action" is visible

    Scenario: Moving an open menu trigger closes the menu before transferring it
      Given two FABs and a FAB menu trigger in the first
      When the FAB menu renders
      And the user opens the FAB menu
      Then the FAB menu is visible
      When the application moves the FAB menu trigger to the second FAB
      Then the FAB menu is hidden
      And the first FAB no longer announces a FAB menu
      And the second FAB announces a collapsed FAB menu
      When the user opens the FAB menu from the second FAB
      Then the second FAB announces an expanded FAB menu
      And the FAB menu action "First action" is visible

    Scenario: Moving a trigger while its menu is opening cancels the pending opening
      Given two FABs and a FAB menu trigger in the first
      When the FAB menu renders
      And the application moves the FAB menu trigger while the menu is opening
      Then the FAB menu is hidden
      And the first FAB no longer announces a FAB menu
      And the second FAB announces a collapsed FAB menu
      When the user opens the FAB menu from the second FAB
      Then the second FAB announces an expanded FAB menu
      And the FAB menu action "First action" is visible

    Scenario: Moving an inactive trigger does not close another FAB's menu
      Given two FABs sharing a FAB menu
      When the FAB menu renders
      And the user opens the FAB menu
      And the application moves the inactive FAB menu trigger
      Then the FAB menu is visible
      And the FAB menu trigger announces an expanded menu
      And the FAB menu action "First action" is visible

    Scenario: Moving an action transfers it to the other FAB menu
      Given two FAB menus with an action in the first
      When the FAB menu renders
      And the application moves the action to the second FAB menu
      And the user opens the FAB menu from the second FAB
      Then the FAB menu action "First action" is visible
      When the user selects FAB menu action "First action"
      Then the second FAB menu is hidden
      And the second FAB menu trigger is focused
