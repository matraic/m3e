Feature: Navigation menu
  Navigation menus present a hierarchical tree of destinations and support keyboard navigation.

  Rule: The menu exposes an accessible tree

    Scenario: Collapsed branches hide their descendants from the accessibility tree

      Given a navigation menu with nested destinations
      When the navigation menu renders
      Then the navigation menu is a tree named "Docs"
      And the tree exposes 3 items
      And item "guides" is collapsed
      And item "advanced" is collapsed
      And item "start" is not expandable
      And item "overview" is not expandable
      And item "archive" is disabled
      When the application expands all navigation menu items
      Then the tree exposes 6 items
      And all navigation menu items have unique IDs
      When the application collapses all navigation menu items
      Then the tree exposes 3 items
      And item "theming" is hidden

    Scenario: A labelled group exposes its label and items

      Given a navigation menu with a labelled group
      When the navigation menu renders
      Then a group named "Reference" contains the tree item "API"

    Scenario: Items without IDs receive unique IDs

      Given a navigation menu with destinations without IDs
      When the navigation menu renders
      Then all navigation menu items have unique IDs

  Rule: Parent items expand and collapse

    Scenario: Clicking a parent toggles its descendants

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the user clicks navigation label "Guides"
      Then item "guides" is expanded
      And item "start" is visible
      When the user clicks navigation label "Guides"
      Then item "guides" is collapsed
      And item "start" is hidden

    Scenario: The public API expands and collapses all levels

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the application expands all navigation menu items
      Then item "guides" is expanded
      And item "advanced" is expanded
      And item "theming" is visible
      When the application collapses all navigation menu items
      Then item "guides" is collapsed
      And item "advanced" is collapsed
      And item "theming" is hidden

    Scenario: Items report their ancestors and children

      Given a navigation menu with nested destinations
      When the navigation menu renders
      Then item "theming" has level 3, parent "advanced", and path "guides, advanced, theming"
      And item "guides" has children "start, advanced"

  Rule: Selecting a leaf marks its path

    Scenario: Selecting a different leaf updates the current destination

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the user clicks navigation label "Overview"
      Then item "overview" is current
      When the application expands all navigation menu items
      And the user clicks navigation label "Theming"
      Then item "theming" is current
      And item "overview" is not current
      And the navigation menu reports "theming" as selected
      And item "guides" is selected but not current
      And item "advanced" is selected but not current

    Scenario: A disabled destination cannot be selected

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the user attempts to click navigation label "Archive"
      Then the navigation menu has no selection

    Scenario: Disabling a branch disables its children

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the application disables item "guides"
      And the application expands all navigation menu items
      Then item "guides" is disabled
      And item "start" is disabled
      And item "theming" is disabled
      When the user attempts to click navigation label "Getting started"
      Then the navigation menu has no selection

  Rule: Keyboard interaction navigates the visible enabled tree

    Scenario: Arrow keys navigate and expand branches

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the user focuses the navigation menu
      Then item "overview" is the active descendant
      When the user presses "ArrowDown" in the navigation menu
      Then item "guides" is the active descendant
      When the user presses "ArrowRight" in the navigation menu
      Then item "guides" is expanded
      When the user presses "ArrowDown" in the navigation menu
      Then item "start" is the active descendant
      When the user presses "ArrowLeft" in the navigation menu
      Then item "guides" is the active descendant
      When the user presses "ArrowLeft" in the navigation menu
      Then item "guides" is collapsed

    Scenario: Home and End skip disabled and collapsed items

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the user focuses the navigation menu
      And the user presses "End" in the navigation menu
      Then item "guides" is the active descendant
      When the user presses "Home" in the navigation menu
      Then item "overview" is the active descendant

    Scenario: Enter toggles a branch and asterisk expands its descendants

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the user focuses the navigation menu
      And the user presses "ArrowDown" in the navigation menu
      And the user presses "Enter" in the navigation menu
      Then item "guides" is expanded
      When the user presses "Enter" in the navigation menu
      Then item "guides" is collapsed
      When the user presses "*" in the navigation menu
      Then item "guides" is expanded
      And item "advanced" is expanded

    Scenario: Enter selects the active leaf and follows its link

      Given a navigation menu with a linked destination
      When the navigation menu renders
      And the user focuses the navigation menu
      And the user presses "Enter" in the navigation menu
      Then item "home" is current
      And the navigation menu link navigates to "#home-page"

    Scenario: Collapsing a branch containing the active item moves activity to its parent

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the application expands all navigation menu items
      And the user focuses the navigation menu
      And the user presses "End" in the navigation menu
      Then item "theming" is the active descendant
      When the application collapses all navigation menu items
      Then item "guides" is the active descendant

  Rule: The menu follows changes to the DOM

    Scenario: A top-level item added and removed updates keyboard navigation

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the application adds a top-level destination "News"
      Then the navigation menu contains item "news"
      When the user focuses the navigation menu
      And the user presses "End" in the navigation menu
      Then item "news" is the active descendant
      When the application removes item "news"
      Then the navigation menu does not contain item "news"
      And item "overview" is the active descendant
      When the user presses "ArrowDown" in the navigation menu
      Then item "guides" is the active descendant

    Scenario: Adding a nested destination makes it available to keyboard navigation

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the application adds destination "News" under item "guides"
      And the application expands all navigation menu items
      Then the navigation menu contains item "news"
      When the user focuses the navigation menu
      And the user presses "End" in the navigation menu
      Then item "news" is the active descendant
      When the application removes item "news"
      Then the navigation menu does not contain item "news"
      And item "overview" is the active descendant

    Scenario: Adding a destination to an existing group updates the menu

      Given a navigation menu with a labelled group
      When the navigation menu renders
      And the application adds destination "News" under item "group"
      Then the navigation menu contains item "news"
      When the user focuses the navigation menu
      And the user presses "End" in the navigation menu
      Then item "news" is the active descendant

    Scenario: Removing every enabled item clears the active descendant

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the application removes item "overview"
      And the application removes item "guides"
      Then the navigation menu has no active descendant

    Scenario: Moving a branch within the menu updates the hierarchy

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the application moves item "advanced" under item "overview"
      Then item "theming" has level 3, parent "advanced", and path "overview, advanced, theming"
      And item "overview" has children "advanced"
      And item "guides" has children "start"

    Scenario: Moving a destination between menus updates their membership

      Given two navigation menus with destinations
      When the navigation menu renders
      And the application moves item "overview" to the second menu
      Then the navigation menu does not contain item "overview"
      And the second menu contains item "overview"
      When the user clicks navigation label "Overview"
      Then the second menu reports "overview" as selected
      And the navigation menu has no selection

    Scenario: Moving a labelled group preserves its accessible name

      Given a navigation menu with a labelled group
      When the navigation menu renders
      And the application moves the group to another container
      Then a group named "Reference" contains the tree item "API"

    Scenario: A detached menu picks up nested changes when reconnected

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the application adds a nested destination while the menu is detached
      Then the navigation menu contains item "news"
      When the application expands all navigation menu items
      And the user focuses the navigation menu
      And the user presses "End" in the navigation menu
      Then item "news" is the active descendant

  Rule: Link destinations retain tree navigation semantics

    Scenario: A linked destination is an accessible tree item

      Given a navigation menu with a first-class link
      When the link navigation menu renders
      Then the linked destination is a tree item named "Home"
      And the link navigation menu has one accessible tree item
      And the link destination is not current
      When the user focuses the link navigation menu
      Then the linked destination is the active descendant of the focused tree

    Scenario: The destination does not add an extra tab stop

      Given a navigation menu with a first-class link
      When the link navigation menu renders
      And the user focuses the link navigation menu
      And the user presses "Tab" in the link navigation menu
      Then focus moves past the link navigation menu

    Scenario: Clicking a first-class link selects and navigates

      Given a navigation menu with a first-class link
      When the link navigation menu renders
      And the user clicks the first-class destination
      Then the link destination is current
      And the link navigation menu reports the destination as selected
      And the link navigation menu navigates to "#home-page"
      And the linked destination is the active descendant of the focused tree

    Scenario: Clicking a destination keeps focus in the tree when navigating an iframe

      Given a navigation menu with a link targeting an iframe
      When the link navigation menu renders
      And the user focuses the control before the link navigation menu
      And the user clicks the first-class destination
      Then the linked destination is the active descendant of the focused tree
      And the destination iframe navigates to the link
      And the linked destination is the active descendant of the focused tree

    Scenario: Pointer focus does not show the keyboard focus ring

      Given a navigation menu with a first-class link
      When the link navigation menu renders
      And the user focuses the control before the link navigation menu
      And the user presses "Tab" in the link navigation menu
      Then the linked destination has a visible focus ring
      When the user clicks the first-class destination
      Then the linked destination does not have a visible focus ring
      When the user presses "ArrowDown" in the link navigation menu
      Then the linked destination has a visible focus ring

    Scenario: Pointer focus remains visible in forced colors

      Given forced colors are active for the link navigation menu
      And a navigation menu with a first-class link
      When the link navigation menu renders
      And the user focuses the control before the link navigation menu
      And the user clicks the first-class destination
      Then the linked destination is the active descendant of the focused tree
      And the linked destination has a visible focus ring

    Scenario: Programmatically clicking a destination selects and navigates

      Given a navigation menu with a first-class link
      When the link navigation menu renders
      And the application clicks the linked item
      Then the link destination is current
      And the link navigation menu reports the destination as selected
      And the link navigation menu navigates to "#home-page"

    Scenario: A pointer click activates the item instead of the internal link

      Given a navigation menu with a first-class link
      When the link navigation menu renders
      And the application observes clicks on the linked item
      And the user clicks the first-class destination
      Then the linked item receives one click and the internal link default is prevented
      And the link navigation menu navigates to "#home-page"

    Scenario Outline: Keyboard activation navigates even when the item is already current

      Given a navigation menu with a first-class link
      When the link navigation menu renders
      And the user focuses the link navigation menu
      And the user presses "<key>" in the link navigation menu
      Then the link destination is current
      And the link navigation menu navigates to "#home-page"
      When the application changes the current fragment
      And the user presses "<key>" in the link navigation menu
      Then the link navigation menu navigates to "#home-page"
      And the linked destination is the active descendant of the focused tree

      Examples:
        | key   |
        | Enter |
        | Space |

    Scenario: A disabled linked destination cannot navigate

      Given a navigation menu with a disabled first-class link
      When the link navigation menu renders
      Then the linked destination is a tree item named "Home"
      And the linked destination is exposed as disabled
      And the first-class destination has no internal link
      When the user attempts to click the disabled link destination
      Then the link navigation menu has no selected destination
      And the link navigation menu has not navigated

    Scenario: A parent with an href only expands

      Given a navigation menu with a parent that has an href
      When the link navigation menu renders
      And the user clicks the parent destination
      Then the parent destination is expanded
      And the link navigation menu has not navigated
      And the parent destination has no internal link

    Scenario: A parent's href does not intercept its child's link

      Given a navigation menu with a parent and child that have hrefs
      When the link navigation menu renders
      And the user clicks the parent destination
      And the user clicks the child destination
      Then the link navigation menu navigates to "#child-page"
      And the child destination is current

  Rule: Link attributes and native link interactions are preserved

    Scenario: Link attributes reach the internal anchor

      Given a navigation menu with link target, relationship, and download attributes
      When the link navigation menu renders
      Then the destination link has the specified link attributes

    Scenario: Keyboard activation honors a new-window target

      Given a navigation menu with a first-class link opening in a new tab
      When the link navigation menu renders
      And the user focuses the link navigation menu
      And the user opens the destination using Enter
      Then the new tab navigates to the link destination
      And the link navigation menu has not navigated

    Scenario: A download without a filename remains a download

      Given a navigation menu with an unnamed download link
      When the link navigation menu renders
      Then the destination link has an empty download attribute
      When the user downloads the first-class destination
      Then the destination is downloaded

    Scenario: Setting the download property to an empty string enables downloading

      Given a navigation menu with a first-class link
      When the link navigation menu renders
      And the application sets an empty download property
      Then the destination link has an empty download attribute
      And the linked destination has an empty download attribute

    Scenario: A modified click opens the destination without navigating the current page

      Given a navigation menu with an external first-class link
      When the link navigation menu renders
      And the user opens the destination in a new tab
      Then the new tab navigates to the link destination
      And the link navigation menu has not navigated

    Scenario: A context click targets the destination link

      Given a navigation menu with a first-class link
      When the link navigation menu renders
      And the user opens the destination context menu
      Then the context menu targets the destination link

    Scenario: Canceling a click prevents link navigation

      Given a navigation menu with a first-class link
      When the link navigation menu renders
      And the application cancels clicks on the linked destination
      And the user clicks the first-class destination
      Then the link navigation menu has not navigated

    Scenario: Changing the destination updates the link

      Given a navigation menu with a first-class link
      When the link navigation menu renders
      And the application changes the link destination to "#updated"
      And the user clicks the first-class destination
      Then the link navigation menu navigates to "#updated"

  Rule: Existing slotted links remain supported

    Scenario: Clicking a slotted link activates it once

      Given a navigation menu with an existing slotted link
      When the link navigation menu renders
      And the application counts slotted link clicks
      And the user clicks the slotted link
      Then the slotted link was clicked once
      And the link destination is current
      And the link navigation menu navigates to "#home-page"

    Scenario Outline: Keyboard activation follows a slotted link

      Given a navigation menu with an existing slotted link
      When the link navigation menu renders
      And the application counts slotted link clicks
      And the user focuses the link navigation menu
      And the user presses "<key>" in the link navigation menu
      Then the slotted link was clicked once
      And the link destination is current
      And the link navigation menu navigates to "#home-page"
      And the linked destination is the active descendant of the focused tree

      Examples:
        | key   |
        | Enter |
        | Space |

    Scenario: A slotted link retains tree focus without a pointer focus ring

      Given a navigation menu with an existing slotted link
      When the link navigation menu renders
      And the user focuses the control before the link navigation menu
      And the user presses "Tab" in the link navigation menu
      Then the linked destination has a visible focus ring
      When the user clicks the slotted link
      Then the linked destination is the active descendant of the focused tree
      And the linked destination does not have a visible focus ring
      When the user presses "ArrowDown" in the link navigation menu
      Then the linked destination has a visible focus ring

    Scenario: A slotted link does not add an extra tab stop

      Given a navigation menu with an existing slotted link
      When the link navigation menu renders
      And the user focuses the link navigation menu
      And the user presses "Tab" in the link navigation menu
      Then focus moves past the link navigation menu

    Scenario: A modified click opens a slotted link in a new tab

      Given a navigation menu with an external slotted link
      When the link navigation menu renders
      And the user opens the slotted link in a new tab
      Then the new tab navigates to the link destination
      And the link navigation menu has not navigated

    Scenario: Canceling a slotted link click prevents navigation

      Given a navigation menu with an existing slotted link
      When the link navigation menu renders
      And the application cancels clicks on the slotted link
      And the user clicks the slotted link
      Then the link navigation menu has not navigated
      And the link navigation menu has no selected destination

    Scenario: Canceling the item click prevents slotted link navigation

      Given a navigation menu with an existing slotted link
      When the link navigation menu renders
      And the application cancels clicks on the linked destination
      And the user clicks the slotted link
      Then the link navigation menu has not navigated

    Scenario: A disabled slotted link cannot navigate

      Given a navigation menu with a disabled slotted link
      When the link navigation menu renders
      And the user attempts to click the disabled slotted link
      Then the link navigation menu has no selected destination
      And the link navigation menu has not navigated

  Rule: Horizontal tree navigation follows directionality

    Scenario: RTL arrows expand, return to the parent, and collapse

      Given a navigation menu with nested destinations in RTL
      When the navigation menu renders
      And the user focuses the navigation menu
      And the user presses "ArrowDown" in the navigation menu
      And the user presses "ArrowLeft" in the navigation menu
      Then item "guides" is expanded
      When the user presses "ArrowDown" in the navigation menu
      Then item "start" is the active descendant
      When the user presses "ArrowRight" in the navigation menu
      Then item "guides" is the active descendant
      When the user presses "ArrowRight" in the navigation menu
      Then item "guides" is collapsed
      When the user presses "ArrowRight" in the navigation menu
      Then item "guides" is the active descendant
      And item "guides" is collapsed

  Rule: Group labels follow DOM changes

    Scenario: Replacing a generated group label updates the accessible name and releases its ID

      Given a navigation menu with a labelled group
      When the navigation menu renders
      And the application replaces the group label with "Resources"
      Then a group named "Resources" contains the tree item "API"
      And the group references its current label
      And the old group label has no generated ID

    Scenario: Replacing a consumer-labelled group preserves the consumer's ID

      Given a navigation menu with a group label using a consumer ID
      When the navigation menu renders
      And the application replaces the group label with "Resources"
      Then a group named "Resources" contains the tree item "API"
      And the old group label retains ID "reference-label"
      And the group references its current label

    Scenario: Removing and restoring a group label updates its accessible name

      Given a navigation menu with a labelled group
      When the navigation menu renders
      And the application removes the group label
      Then the group has no labelled-by reference
      And the group label presentation is hidden
      And the old group label has no generated ID
      When the application adds group label "Resources" with ID "resources-label"
      Then a group named "Resources" contains the tree item "API"
      And the group references label ID "resources-label"

  Rule: Targeted expansion only changes the requested branches

    Scenario: Expanding a specific branch leaves other branches collapsed

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the application expands item "guides" without descendants
      Then item "guides" is expanded
      And item "advanced" is collapsed
      And item "start" is visible
      And item "theming" is hidden
      When the application expands item "advanced" with descendants
      Then item "advanced" is expanded
      And item "theming" is visible

    Scenario: Targeted collapse restores activity to the nearest visible ancestor

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the application expands all navigation menu items
      And the user focuses the navigation menu
      And the user presses "End" in the navigation menu
      Then item "theming" is the active descendant
      When the application collapses item "advanced" without descendants
      Then item "advanced" is the active descendant
      And item "advanced" is collapsed
      And item "guides" is expanded
      When the application collapses item "guides" with descendants
      Then item "guides" is the active descendant
      And item "guides" is collapsed
      And item "advanced" is collapsed

    Scenario: A nonrecursive collapse retains the descendants' expansion state

      Given a navigation menu with nested destinations
      When the navigation menu renders
      And the application expands all navigation menu items
      And the application collapses item "guides" without descendants
      Then item "guides" is collapsed
      And item "advanced" is expanded
      When the application expands item "guides" without descendants
      Then item "theming" is visible

  Rule: Icons reflect selection and slot changes

    Scenario: Selecting another destination clears the previous icon's filled state

      Given a navigation menu with destination icons
      When the navigation menu renders
      And the user clicks navigation label "Overview"
      Then the icon in item "overview" is filled
      When the user clicks navigation label "Archive"
      Then the icon in item "archive" is filled
      And the icon in item "overview" is not filled

    Scenario: Adding and removing an icon changes presentation without changing the accessible name

      Given a navigation menu with nested destinations
      When the navigation menu renders
      Then item "overview" has no visible icon presentation
      When the application adds an icon to item "overview"
      Then item "overview" has visible icon presentation
      And item "overview" is a tree item named "Overview"
      When the application removes the icon from item "overview"
      Then item "overview" has no visible icon presentation
      And item "overview" is a tree item named "Overview"

  Rule: Decorative dividers do not enter the accessible tree

    Scenario: Dividers do not add tree destinations or keyboard stops

      Given a navigation menu with a divider between destinations
      When the navigation menu renders
      Then the navigation divider is hidden from accessibility
      And the tree exposes 2 items
      When the user focuses the navigation menu
      And the user presses "ArrowDown" in the navigation menu
      Then item "archive" is the active descendant

  Rule: Initial selection determines the active destination

    Scenario: An initially selected leaf becomes the active destination

      Given a navigation menu with an initially selected destination
      When the navigation menu renders
      Then the navigation menu reports "archive" as selected
      And item "archive" is current
      When the user focuses the navigation menu
      Then item "archive" is the active descendant

    Scenario: An initially selected disabled leaf does not receive activity

      Given a navigation menu with an initially selected disabled destination
      When the navigation menu renders
      And the user focuses the navigation menu
      Then item "overview" is the active descendant
      And item "archive" is disabled

  Rule: Disabled items reject programmatic activation

    Scenario Outline: A disabled item click cannot select or navigate

      Given a navigation menu with a disabled "<approach>" destination
      When the navigation menu renders
      And the application clicks navigation item "home"
      Then the navigation menu has no selection
      When the application dispatches a navigation click on item "home"
      Then the navigation menu has no selection
      And the disabled navigation click is prevented
      And the navigation page has not navigated

      Examples:
        | approach |
        | href     |
        | slotted  |

    Scenario Outline: A disabled item click cannot close its drawer

      Given a disabled navigation destination in a "<side>" "<mode>" drawer
      When the navigation menu renders
      And the application clicks navigation item "home"
      And the application dispatches a navigation click on item "home"
      Then the navigation menu has no selection
      And the navigation page has not navigated
      And the "<side>" navigation drawer stays open

      Examples:
        | side  | mode |
        | start | push |
        | start | over |
        | end   | push |
        | end   | over |
