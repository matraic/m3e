Feature: Tree
  A tree presents nested items that can be expanded, selected, and navigated by keyboard.

  Rule: The tree exposes its structure and expansion state

    Scenario: The tree has an accessible role and a single tab stop

      Given an M3E tree
      When the tree renders
      Then the tree is focusable and exposes 3 root tree items
      And the tree is not multiselectable

    Scenario: Items added later do not become additional tab stops

      Given an M3E tree
      When the tree renders
      And the application adds a root tree item "new" named "New"
      Then the new item is tracked without becoming a tab stop

    Scenario: Multi-selection is reflected in the tree's accessible state

      Given an M3E tree
      When the tree renders
      And the application enables multi-selection
      Then the tree exposes aria-multiselectable "true"
      When the application disables multi-selection
      Then the tree does not expose aria-multiselectable

    Scenario: Items report their hierarchy

      Given an M3E tree
      When the tree renders
      Then tree items report their levels, parents, paths, and children

    Scenario: Only parent items expose aria-expanded

      Given an M3E tree
      When the tree renders
      Then item "a" exposes aria-expanded "false"
      And item "c" has no aria-expanded attribute
      When the application expands item "a"
      Then item "a" exposes aria-expanded "true"

    Scenario: A leaf becomes expandable when it gains a child

      Given an M3E tree
      When the tree renders
      And the application adds a child beneath item "c"
      Then item "c" is expandable and collapsed

    Scenario: Items expand, collapse, and toggle only when they have children

      Given an M3E tree
      When the tree renders
      And the application expands item "a"
      Then tree item "a" is open
      When the application collapses item "a"
      Then tree item "a" is closed
      When the application toggles item "a"
      Then tree item "a" is open
      When the application expands item "c"
      Then tree item "c" is closed

    Scenario: Tree expansion and collapse can include descendants

      Given an M3E tree
      When the tree renders
      And the application expands all tree items and descendants
      Then tree item expansion states are "true,false,true,false,true,false,false"
      When the application collapses all tree items and descendants
      Then every tree item is closed

    Scenario: The tree and its items expose accessible names

      Given an M3E tree
      When the tree renders
      Then the tree has accessible name "Project files"
      And the root tree items have accessible names "Alpha, Beta, Gamma"
      When the application expands all tree items and descendants
      Then all tree items have accessible names "Alpha, Apple, Avocado, Deep, Beta, Banana, Gamma"

    Scenario: An item is visible only while its ancestors are open

      Given an M3E tree
      When the tree renders
      Then tree item "a1" is hidden
      When the application expands item "a"
      Then tree item "a1" is visible
      And tree item "a2x" is hidden

    Scenario: Expanding and collapsing emits lifecycle events in order

      Given an M3E tree
      When the tree renders
      And the application records expansion events for item "a"
      And the application expands item "a"
      Then item "a" emits events "opening, opened"
      When the application collapses item "a"
      Then item "a" emits events "opening, opened, closing, closed"

  Rule: Selection follows single, multiple, and cascading modes

    Scenario: Clicking a parent toggles it and selects it

      Given an M3E tree
      When the tree renders
      And the user clicks the label of item "a"
      Then tree item "a" is open
      And the selected tree items are "a"
      And item "a" has aria-selected "true"
      When the user clicks the label of item "a"
      Then tree item "a" is closed
      And the selected tree items are still "a"

    Scenario: Single selection replaces the selected item and emits change

      Given an M3E tree
      When the tree renders
      And the application records tree change events
      And the user clicks the label of item "c"
      Then the selected tree items are "c"
      When the user clicks the label of item "b"
      Then the selected tree items are "b"
      And item "c" has aria-selected "false"
      And the tree has emitted at least 2 change events

    Scenario: Clicking a selected leaf again keeps it selected

      Given an M3E tree
      When the tree renders
      And the user clicks the label of item "c"
      And the user clicks the label of item "c"
      Then the selected tree items are "c"

    Scenario: Multi-selection toggles items and uses aria-checked

      Given an M3E tree with multi-selection
      When the tree renders
      And the user clicks the label of item "c"
      Then item "c" has aria-checked "true"
      And item "c" has no aria-selected attribute
      When the user clicks the label of item "b"
      And the application expands item "b"
      And the user clicks the label of item "b1"
      Then the selected tree items are "b1, c"
      When the user clicks the label of item "c"
      Then item "c" has aria-checked "false"
      And the selected tree items are "b1"

    Scenario: The multi-selection checkbox selects and deselects its item

      Given an M3E tree with multi-selection
      When the tree renders
      Then the checkbox for item "c" is visible
      When the user clicks the checkbox for item "c"
      Then the selected tree items are "c"
      When the user clicks the checkbox for item "c"
      Then there are no selected tree items

    Scenario: Cascading selection marks partially selected parents indeterminate

      Given an M3E tree with cascading multi-selection
      When the tree renders
      And the application expands all tree items and descendants
      And the user clicks the checkbox for item "a1"
      Then the selected tree items are "a1"
      And tree item "a" is indeterminate
      And item "a" has aria-checked "mixed"
      When the user clicks the checkbox for item "a2x"
      Then the selected tree items are "a, a1, a2, a2x"
      And tree item "a" is not indeterminate
      And item "a" has aria-checked "true"
      When the user clicks the checkbox for item "a1"
      Then the selected tree items are "a2, a2x"
      And item "a" has aria-checked "mixed"

    Scenario: Selecting a parent cascades to all descendants

      Given an M3E tree with cascading multi-selection
      When the tree renders
      And the user clicks the checkbox for item "a"
      Then the selected tree items are "a, a1, a2, a2x"
      When the user clicks the checkbox for item "a"
      Then there are no selected tree items

    Scenario: Programmatic selection and deselection emit change events

      Given an M3E tree
      When the tree renders
      And the application records tree change events
      And the application selects item "c"
      Then the selected tree items are "c"
      When the application deselects item "c"
      Then there are no selected tree items
      And the tree has emitted exactly 2 change events

    Scenario: Disabled items ignore clicks

      Given an M3E tree with item "c" disabled
      When the tree renders
      Then tree item "c" exposes aria-disabled "true"
      And the user force-clicks the label of item "c"
      Then there are no selected tree items

    Scenario: Disabling a parent disables all descendants

      Given an M3E tree
      When the tree renders
      And the application disables tree item "a"
      Then tree item "a1" is disabled
      And tree item "a1" exposes aria-disabled "true"
      And tree item "a2x" is disabled

  Rule: Keyboard navigation follows the visible tree

    Scenario: Arrow keys move the active item through visible items

      Given an M3E tree
      When the tree renders
      And the user clicks the label of item "c"
      And the user focuses the tree
      And the user presses tree key "Home"
      Then the active tree item is "a"
      When the user presses tree key "ArrowDown"
      Then the active tree item is "b"
      When the user presses tree key "ArrowDown"
      Then the active tree item is "c"
      When the user presses tree key "ArrowUp"
      Then the active tree item is "b"
      When the user presses tree key "End"
      Then the active tree item is "c"

    Scenario: Right expands a parent and Left collapses or moves to its parent

      Given an M3E tree
      When the tree renders
      And the user clicks the label of item "c"
      And the user focuses the tree
      And the user presses tree key "Home"
      And the user presses tree key "ArrowRight"
      Then tree item "a" is open
      When the user presses tree key "ArrowDown"
      Then the active tree item is "a1"
      When the user presses tree key "ArrowLeft"
      Then the active tree item is "a"
      When the user presses tree key "ArrowLeft"
      Then tree item "a" is closed

    Scenario: Right on an open parent moves to its first enabled child

      Given an M3E tree with item "a1" disabled
      When the tree renders
      And the user clicks the label of item "c"
      And the user focuses the tree
      And the user presses tree key "Home"
      And the user presses tree key "ArrowRight"
      Then tree item "a" is open
      And the active tree item is "a"
      When the user presses tree key "ArrowRight"
      Then the active tree item is "a2"

    Scenario: Right on a leaf does nothing

      Given an M3E tree
      When the tree renders
      And the user clicks the label of item "c"
      And the user focuses the tree
      And the user presses tree key "ArrowRight"
      Then the active tree item is "c"

    Scenario: Left expands in right-to-left direction

      Given an M3E tree
      When the tree renders
      And the application sets the tree direction to right-to-left
      And the user clicks the label of item "c"
      And the user focuses the tree
      And the user presses tree key "Home"
      And the user presses tree key "ArrowLeft"
      Then tree item "a" is open
      When the user presses tree key "ArrowLeft"
      Then the active tree item is "a1"

    Scenario: Keyboard navigation skips collapsed and disabled items

      Given an M3E tree with item "b" disabled
      When the tree renders
      And the user clicks the label of item "c"
      And the user focuses the tree
      And the user presses tree key "Home"
      And the user presses tree key "ArrowDown"
      Then the active tree item is "c"

    Scenario: The asterisk key expands an item and its descendants

      Given an M3E tree
      When the tree renders
      And the user clicks the label of item "c"
      And the user focuses the tree
      And the user presses tree key "Home"
      And the user presses tree key "*"
      Then tree item "a" is open
      And tree item "a2" is open

    Scenario: Enter and Space select the active item

      Given an M3E tree
      When the tree renders
      And the user clicks the label of item "c"
      And the user focuses the tree
      And the user presses tree key "Home"
      And the user presses tree key "Enter"
      Then the selected tree items are "a"
      When the user presses tree key "ArrowDown"
      And the user presses tree key "Space"
      Then the selected tree items are "b"

    Scenario: Space toggles selection in multi-selection mode

      Given an M3E tree with multi-selection
      When the tree renders
      And the user focuses the tree
      And the user presses tree key "Home"
      And the user presses tree key "Space"
      Then the selected tree items are "a"
      When the user presses tree key "Space"
      Then there are no selected tree items

    Scenario: Typing jumps to a matching item

      Given an M3E tree
      When the tree renders
      And the user clicks the label of item "c"
      And the user focuses the tree
      And the user presses tree key "Home"
      And the user types "g" in the tree
      Then the active tree item is "c"

    Scenario: Collapsing an ancestor moves the active item to the nearest visible parent

      Given an M3E tree
      When the tree renders
      And the application expands all tree items and descendants
      And the user clicks the label of item "a2x"
      Then the active tree item is "a2x"
      When the application collapses all tree items and descendants
      Then the active tree item is "a"

  Rule: Tree items preserve link and icon behavior

    Scenario: Selecting a tree item activates its nested link

      Given an M3E tree with a linked item
      When the tree renders
      And the user clicks the label of item "l"
      Then the page navigates to "#target"
      And the nested link is not an additional tab stop

    Scenario: Selecting an item fills its slotted icon

      Given an M3E tree with an icon item
      When the tree renders
      And the user clicks the label of item "i"
      Then the item's icon is filled
