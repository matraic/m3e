Feature: Tabs
  Tabs organize related views with manual keyboard activation, panel relationships,
  optional header pagination, and touch navigation.

  Rule: Tab presentation follows the configured appearance

    Scenario: Primary indicator shape families do not change tab surfaces
      Given tabs with "Videos" initially selected
      And the tabs attribute "variant" is "primary"
      When the tabs component renders
      And the application sets the tabs shape families
      Then the primary tabs indicator has "4px 4px 0px 0px" corners
      When the application sets tabs "header-position" to "after"
      Then the primary tabs indicator has "0px 0px 4px 4px" corners
      And tab focus rings and state layers keep their own shapes
      When the application sets tabs "variant" to "secondary"
      Then the secondary tabs indicator has square round-family corners

    Scenario: Tabs expose navigation and panel roles
      Given a tabs component
      When the tabs component renders
      Then the tabs expose a tablist and three tabs with panel relationships

    Scenario: The selected attribute chooses the initial tab
      Given tabs with "Photos" initially selected
      When the tabs component renders
      Then the selected tab index is 1
      And only the tab named "Photos" is selected

    Scenario: Clicking a tab changes the view and emits selection events
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the user clicks the tab named "Audio"
      Then the selected tab index is 2
      And only the panel named "Audio" is visible
      And the tabs emit beforeinput, input, and change in order

    Scenario: Cancelling beforeinput prevents activation
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application cancels activation of the tab named "Photos"
      And the application records tab selection events
      And the user clicks the tab named "Photos"
      Then the selected tab index is 0
      And only the panel named "Videos" is visible
      And the tabs emit only beforeinput

    Scenario: The selected index can select a tab or clear selection
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application selects tab index 2
      Then the selected tab index is 2
      And only the tab named "Audio" is selected
      When the application selects tab index -1
      Then the selected tab index is -1
      And no tab is selected and all panels are hidden

    Scenario: Arrow keys wrap focus and Home and End reach the endpoints
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the user focuses the tab named "Videos"
      And the user presses "ArrowRight" in the tabs
      Then the tab named "Photos" has focus
      When the user presses "End" in the tabs
      Then the tab named "Audio" has focus
      When the user presses "ArrowRight" in the tabs
      Then the tab named "Videos" has focus
      When the user presses "ArrowLeft" in the tabs
      Then the tab named "Audio" has focus
      When the user presses "Home" in the tabs
      Then the tab named "Videos" has focus

    Scenario: Enter and Space activate the focused tab
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the user focuses the tab named "Videos"
      And the user presses "ArrowRight" in the tabs
      And the user presses "Enter" in the tabs
      Then the selected tab index is 1
      When the user presses "ArrowRight" in the tabs
      And the user presses "Space" in the tabs
      Then the selected tab index is 2

    Scenario: Disabled tabs cannot be clicked
      Given tabs with "Videos" initially selected
      And the tab named "Photos" is disabled
      When the tabs component renders
      Then the tab named "Photos" is unavailable
      When a click is dispatched to the tab named "Photos"
      Then the selected tab index is 0

    Scenario: Keyboard navigation skips disabled tabs
      Given tabs with "Videos" initially selected
      And the tab named "Photos" is disabled
      When the tabs component renders
      And the user focuses the tab named "Videos"
      And the user presses "ArrowRight" in the tabs
      Then the tab named "Audio" has focus

    Scenario: Unknown variants fall back to secondary
      Given a tabs component
      When the tabs component renders
      Then the tabs variant is "secondary"
      When the application sets tabs "variant" to "primary"
      Then the tabs attribute "variant" equals "primary"
      When the application sets tabs "variant" to "bogus"
      Then the tabs attribute "variant" equals "secondary"

    Scenario: Unknown header positions fall back to before
      Given a tabs component
      And the tabs attribute "header-position" is "bogus"
      When the tabs component renders
      Then the tabs attribute "header-position" equals "before"

    Scenario: Headers can appear after the content
      Given tabs with "Videos" initially selected
      And the tabs attribute "header-position" is "after"
      When the tabs component renders
      Then the tablist is below the selected panel

    Scenario: Stretched tabs fill their header
      Given tabs with "Videos" initially selected
      And the tabs attribute "stretch" is ""
      When the tabs component renders
      Then the tabs fill their header width

    Scenario: Pagination supports boolean and automatic modes
      Given a tabs component
      When the tabs component renders
      Then tabs pagination is enabled
      When the application sets tabs pagination mode to "disabled"
      Then the tabs attribute "disable-pagination" equals ""
      When the application sets tabs pagination mode to "auto"
      Then the tabs attribute "disable-pagination" equals "auto"
      And tabs pagination mode is automatic
      When the application sets tabs pagination mode to "enabled"
      Then the tabs have no disable-pagination attribute

    Scenario: Overflowing headers forward pagination labels
      Given overflowing tabs
      And the tabs attribute "previous-page-label" is "Back"
      And the tabs attribute "next-page-label" is "Forward"
      When the tabs component renders
      Then the tabs paging buttons are named "Back" and "Forward"

    Scenario: Unselected tabs can be added later
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application adds an unselected tab
      Then the tabs track 4 tabs
      And the selected tab index is 0

  Rule: Selection and accessible panel state stay synchronized

    Scenario: A panel gets its accessible name from its tab
      Given tabs with "Photos" initially selected
      When the tabs component renders
      Then the selected tab identifies its panel and the panel is named by its tab

    Scenario: Decorative icons do not alter tab names
      Given tabs with "Videos" initially selected
      And the tabs have decorative icons
      When the tabs component renders
      Then the tab names exclude decorative icons

    Scenario: Keyboard focus does not activate a tab until requested
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the user focuses the tab named "Videos"
      And the user presses "ArrowRight" in the tabs
      Then the tab named "Photos" has focus
      And the selected tab index is 0
      And only the panel named "Videos" is visible
      And only the tab named "Photos" is in the tab order
      And the tabs emit no selection events

    Scenario: Tab navigation enters the selected header and skips inactive panel controls
      Given tabs with "Photos" initially selected
      And the tab panels contain buttons
      When the tabs component renders
      And the user tabs into the tabs component
      Then the tab named "Photos" has focus
      And only the tab named "Photos" is in the tab order
      When the user presses "Tab" in the tabs
      Then the selected panel action has focus
      When the user presses "Tab" in the tabs
      Then focus is after the tabs component

    Scenario: Clicking the current tab emits no selection events
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the user clicks the tab named "Videos"
      Then the selected tab index is 0
      And the tabs emit no selection events

    Scenario: Programmatic selection changes the view without user events
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the application selects the tab named "Audio"
      Then the selected tab index is 2
      And only the tab named "Audio" is selected
      And only the panel named "Audio" is visible
      And the tabs emit no selection events

    Scenario: Programmatic deselection clears the current view
      Given tabs with "Photos" initially selected
      When the tabs component renders
      And the application deselects the tab named "Photos"
      Then the selected tab index is -1
      And no tab is selected and all panels are hidden
      And the tabs indicator has no width

    Scenario: An index beyond the end clears the current view
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application selects tab index 99
      Then the selected tab index is -1
      And no tab is selected and all panels are hidden

    Scenario: Tabs without an initial selection show no panel
      Given a tabs component
      When the tabs component renders
      Then the selected tab index is -1
      And no tab is selected and all panels are hidden

  Rule: Direction changes preserve keyboard navigation

    Scenario: Right-to-left arrows reverse horizontal movement
      Given tabs with "Photos" initially selected
      And the tabs document reads right to left
      When the tabs component renders
      And the user focuses the tab named "Photos"
      And the user presses "ArrowLeft" in the tabs
      Then the tab named "Audio" has focus
      When the user presses "ArrowRight" in the tabs
      Then the tab named "Photos" has focus

    Scenario: Keyboard direction updates after rendering
      Given tabs with "Photos" initially selected
      When the tabs component renders
      And the tabs document changes to right to left
      And the user focuses the tab named "Photos"
      And the user presses "ArrowLeft" in the tabs
      Then the tab named "Audio" has focus

  Rule: Runtime disabled states preserve selection and keyboard access

    Scenario: A disabled tab is skipped until it is re-enabled
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the application disables the tab named "Photos"
      Then the tab named "Photos" is unavailable
      When a click is dispatched to the tab named "Photos"
      And the user focuses the tab named "Videos"
      And the user presses "ArrowRight" in the tabs
      Then the tab named "Audio" has focus
      And the selected tab index is 0
      And the tabs emit no selection events
      When the application enables the tab named "Photos"
      Then the tab named "Photos" is available
      And only the tab named "Audio" is in the tab order
      When the user presses "ArrowLeft" in the tabs
      Then the tab named "Photos" has focus
      When the user presses "Enter" in the tabs
      Then the selected tab index is 1
      And only the panel named "Photos" is visible
      And the tabs emit beforeinput, input, and change in order

    Scenario: Disabling the selected tab retains its view but preserves a usable tab stop
      Given tabs with "Photos" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the application disables the tab named "Photos"
      Then the tab named "Photos" is unavailable
      And the selected tab index is 1
      And only the panel named "Photos" is visible
      When the user tabs into the tabs component
      Then the tab named "Videos" has focus
      When the user presses "ArrowRight" in the tabs
      Then the tab named "Audio" has focus
      When the application enables the tab named "Photos"
      Then the tab named "Photos" is available
      And only the tab named "Audio" is in the tab order
      And only the tab named "Photos" is selected
      And the tabs emit no selection events

    Scenario: Re-enabling a tab restores keyboard entry after every tab was disabled
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the application disables the tab named "Videos"
      And the application disables the tab named "Photos"
      And the application disables the tab named "Audio"
      Then no tab is in the tab order
      When the application enables the tab named "Audio"
      And the user tabs into the tabs component
      Then the tab named "Audio" has focus
      And only the tab named "Audio" is in the tab order
      And the selected tab index is 0
      And only the panel named "Videos" is visible
      And the tabs emit no selection events

  Rule: Dynamic tabs and DOM movement preserve the selected view

    Scenario: A newly added selected tab takes over single selection
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application adds a selected tab
      Then the tabs track 4 tabs
      And the selected tab index is 3
      And only the tab named "Extra" is selected
      And only the panel named "Extra" is visible
      When the user clicks the tab named "Photos"
      Then the selected tab index is 1
      And only the panel named "Photos" is visible

    Scenario: Removing the selected tab clears the view
      Given tabs with "Photos" initially selected
      When the tabs component renders
      And the application removes the tab named "Photos"
      Then the tabs track 2 tabs
      And the selected tab index is -1
      And no tab is selected and all panels are hidden
      And the tabs panel "p2" has no tab label references

    Scenario: Removing an earlier tab preserves the selected panel
      Given tabs with "Audio" initially selected
      When the tabs component renders
      And the application removes the tab named "Videos"
      Then the tabs track 2 tabs
      And the selected tab index is 1
      And only the panel named "Audio" is visible

    Scenario: Reconnecting a tab retains panel linkage without duplicate events
      Given tabs with "Photos" initially selected
      When the tabs component renders
      And the application reconnects the tab named "Photos"
      Then the tab named "Photos" controls only panel "p2"
      And the selected tab identifies its panel and the panel is named by its tab
      When the application records tab selection events
      And the user clicks the tab named "Audio"
      Then the selected tab index is 2
      And the tabs emit beforeinput, input, and change in order

    Scenario: Moving the entire component retains selection and keyboard direction
      Given tabs with "Photos" initially selected
      When the tabs component renders
      And the application moves the tabs component twice
      Then the selected tab index is 1
      And only the panel named "Photos" is visible
      And the selected tab identifies its panel and the panel is named by its tab
      When the tabs document changes to right to left
      And the user focuses the tab named "Photos"
      And the user presses "ArrowLeft" in the tabs
      Then the tab named "Audio" has focus
      When the application records tab selection events
      And the user presses "Enter" in the tabs
      Then the selected tab index is 2
      And the tabs emit beforeinput, input, and change in order

    Scenario: Updating a tab target replaces its accessible relationship
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application links the tab named "Audio" to the "Photos" panel
      Then the tab named "Audio" controls only panel "p2"
      And the tabs panel "p3" has no tab label references
      And the tabs panel "p2" is labelled by tabs "Photos" and "Audio"
      When the user clicks the tab named "Audio"
      Then the selected tab index is 2
      And only the panel named "Audio" is visible

  Rule: Pagination and indicators follow the active header

    Scenario: Selecting the final overflowing tab reveals its header
      Given overflowing tabs
      When the tabs component renders
      And the application selects tab index 9
      Then the selected tab index is 9
      And the selected tab is fully within the tabs scroll viewport

    Scenario: Right-to-left selection reveals the final overflowing header
      Given overflowing tabs
      And the tabs document reads right to left
      When the tabs component renders
      And the application selects tab index 9
      Then the selected tab index is 9
      And the selected tab is fully within the tabs scroll viewport

    Scenario: Pagination can be disabled and re-enabled at runtime
      Given overflowing tabs
      When the tabs component renders
      Then the tabs paging buttons are named "Previous page" and "Next page"
      When the application sets tabs pagination mode to "disabled"
      Then the tabs have no paging controls
      When the application sets tabs pagination mode to "enabled"
      Then the tabs paging buttons are named "Previous page" and "Next page"

    Scenario: Automatic pagination remains available for a desktop pointer
      Given overflowing tabs
      And the tabs attribute "disable-pagination" is "auto"
      When the tabs component renders
      Then the tabs paging buttons are named "Previous page" and "Next page"

    Scenario: Custom pagination icons are forwarded to the slide group
      Given overflowing tabs
      And the tabs have custom paging icons
      When the tabs component renders
      Then the tabs paging buttons are named "Previous page" and "Next page"
      And the custom tabs paging icons are visible

    Scenario: An empty component can accept its first selected tab
      Given an empty tabs component
      When the tabs component renders
      Then the selected tab index is -1
      And the tabs indicator has no width
      When the application adds a selected tab
      Then the tabs track 1 tabs
      And the selected tab index is 0
      And only the panel named "Extra" is visible

  Rule: Touch swipes change adjacent enabled views

    Scenario: A left swipe advances to the next panel
      Given tabs with "Videos" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the user swipes the selected tab panel "left"
      Then the selected tab index is 1
      And only the panel named "Photos" is visible
      And tab panels have no lingering swipe offsets
      And the tabs emit beforeinput, input, and change in order
      And swipe selection events describe a change from index 0 to 1 on tab "Photos"

    Scenario: A right swipe returns to the previous panel
      Given tabs with "Photos" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the user swipes the selected tab panel "right"
      Then the selected tab index is 0
      And only the panel named "Videos" is visible
      And tab panels have no lingering swipe offsets
      And the tabs emit beforeinput, input, and change in order
      And swipe selection events describe a change from index 1 to 0 on tab "Videos"

    Scenario Outline: Cancelling beforeinput prevents a swipe selection
      Given tabs with "Photos" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the application cancels activation of the tab named "<target>"
      And the user swipes the selected tab panel "<direction>"
      Then the selected tab index is 1
      And only the tab named "Photos" is selected
      And only the panel named "Photos" is visible
      And tab panels have no lingering swipe offsets
      And the tabs emit only beforeinput

      Examples:
        | target | direction |
        | Audio  | left      |
        | Videos | right     |

    Scenario Outline: Outward swipes do not wrap at the boundaries
      Given tabs with "<selected>" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the user swipes the selected tab panel "<direction>"
      Then the selected tab index is <index>
      And tab panels have no lingering swipe offsets
      And the tabs emit no selection events

      Examples:
        | selected | direction | index |
        | Videos   | right     | 0     |
        | Audio    | left      | 2     |

    Scenario Outline: Swipes do not activate an adjacent disabled tab
      Given tabs with "<selected>" initially selected
      And the tab named "Photos" is disabled
      When the tabs component renders
      And the application records tab selection events
      And the user swipes the selected tab panel "<direction>"
      Then the selected tab index is <index>
      And tab panels have no lingering swipe offsets
      And the tabs emit no selection events

      Examples:
        | selected | direction | index |
        | Videos   | left      | 0     |
        | Audio    | right     | 2     |

    Scenario: Swiping reverses direction in right-to-left documents
      Given tabs with "Photos" initially selected
      And the tabs document reads right to left
      When the tabs component renders
      And the user swipes the selected tab panel "right"
      Then the selected tab index is 2
      When the user swipes the selected tab panel "left"
      Then the selected tab index is 1
      And tab panels have no lingering swipe offsets

    Scenario: Cancelling a swipe restores the original view
      Given tabs with "Photos" initially selected
      When the tabs component renders
      And the application records tab selection events
      And the user cancels a left swipe on the selected tab panel
      Then the selected tab index is 1
      And only the panel named "Photos" is visible
      And tab panels have no lingering swipe offsets
      And the tabs emit no selection events

    Scenario: Swipe navigation can be disabled
      Given tabs with "Videos" initially selected
      And the tabs attribute "disable-swipe" is ""
      When the tabs component renders
      And the user swipes the selected tab panel "left"
      Then the selected tab index is 0
      And only the panel named "Videos" is visible

    Scenario: Swiping an interactive panel child does not change views
      Given tabs with "Videos" initially selected
      And the tab panels contain buttons
      When the tabs component renders
      And the user swipes left on the selected panel button
      Then the selected tab index is 0
      And only the panel named "Videos" is visible

  Rule: Indicator motion respects the user's preference

    Scenario: The primary indicator settles over the selected label with motion
      Given tabs with "Videos" initially selected
      And the tabs attribute "variant" is "primary"
      And the tabs allow motion
      When the tabs component renders
      And the user clicks the tab named "Audio"
      Then the tabs indicator aligns with the selected tab
      When the user clicks the tab named "Videos"
      Then the tabs indicator aligns with the selected tab

    Scenario: Reduced motion disables indicator transitions
      Given tabs with "Videos" initially selected
      And the tabs attribute "variant" is "primary"
      When the tabs component renders
      And the user clicks the tab named "Audio"
      Then the tabs indicator has no transition
      And only the panel named "Audio" is visible
