Feature: Slide group
  Slide groups expose directional paging controls only when their content overflows.
  Paging follows the content orientation and document direction.

  Rule: Paging controls reflect available content

    Scenario: Content that fits needs no paging controls
      Given a slide group with 2 items in a 600 pixel width
      When the slide group renders
      Then the slide group has no paging buttons

    Scenario: Overflowing content exposes both paging controls
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      Then both slide-group paging buttons are visible

    Scenario: Only forward paging is available at the start
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      Then the slide-group previous button is disabled
      And the slide-group next button is enabled

    Scenario: Forward paging advances one viewport
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      And the user pages the slide group forward
      Then the slide group has scrolled forward on its main axis only
      And the slide-group previous button is enabled

    Scenario: Backward paging returns to the start
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      And the user pages the slide group forward
      And the user pages the slide group backward
      Then the slide group is at the start
      And the slide-group previous button is disabled

    Scenario: Forward paging stops at the end
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      And the user pages to the end of the slide group
      Then the slide group is at the end
      And the slide-group next button is disabled
      And the slide-group previous button is enabled

    Scenario: Paging controls use custom accessible labels
      Given a slide group with 10 items in a 300 pixel width
      And the slide-group previous and next labels are "Back" and "Forward"
      When the slide group renders
      Then the slide-group paging buttons are named "Back" and "Forward"

    Scenario: Shrinking the group reveals paging controls
      Given a slide group with 10 items in a 1200 pixel width
      When the slide group renders
      Then the slide group has no paging buttons
      When the application resizes the slide group to 300 pixels wide
      Then both slide-group paging buttons are visible

    Scenario: Vertical paging scrolls only vertically
      Given a slide group with 10 items in a 300 pixel width
      And the slide group is vertical
      When the slide group renders
      And the user pages the slide group forward
      Then the slide group has scrolled forward on its main axis only

    Scenario: A hidden group is not displayed
      Given a slide group with 10 items in a 300 pixel width
      And the slide group is hidden
      When the slide group renders
      Then the slide group is not displayed

    Scenario: Growing the group removes unnecessary paging controls
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      Then both slide-group paging buttons are visible
      When the application resizes the slide group to 1200 pixels wide
      Then the slide group has no paging buttons

    Scenario: An empty group has no paging controls
      Given a slide group with 0 items in a 300 pixel width
      When the slide group renders
      Then the slide group has no paging buttons

    Scenario: Disabled groups suppress paging controls
      Given a slide group with 10 items in a 300 pixel width
      And the slide group is disabled
      When the slide group renders
      Then the slide group has no paging buttons

    Scenario: Disabling and re-enabling a group refreshes paging
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      Then both slide-group paging buttons are visible
      When the application sets slide-group "disabled" to ""
      Then the slide group has no paging buttons
      When the application removes slide-group "disabled"
      Then both slide-group paging buttons are visible
      And the slide-group previous button is disabled
      And the slide-group next button is enabled

  Rule: Thresholds ignore small overflows and snap near endpoints

    Scenario Outline: Controls appear only when overflow exceeds the threshold
      Given a slide group with 1 items in a 300 pixel width
      And each slide-group item is <itemWidth> pixels wide
      And the slide-group threshold is 10 pixels
      When the slide group renders
      Then <result>

      Examples:
        | itemWidth | result                                           |
        | 300       | the slide group has no paging buttons            |
        | 309       | the slide group has no paging buttons            |
        | 310       | the slide group has no paging buttons            |
        | 311       | both slide-group paging buttons are visible      |

    Scenario: Changing the threshold refreshes paging without resizing
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      Then both slide-group paging buttons are visible
      When the application sets slide-group "threshold" to "1000"
      Then the slide group has no paging buttons
      When the application sets slide-group "threshold" to "0"
      Then both slide-group paging buttons are visible

    Scenario: Horizontal paging snaps to a nearby end
      Given a slide group with 1 items in a 300 pixel width
      And each slide-group item is 530 pixels wide
      And the slide-group threshold is 100 pixels
      When the slide group renders
      And the user pages the slide group forward
      Then the slide group is at the end
      And the slide-group next button is disabled
      When the user pages the slide group backward
      Then the slide group is at the start
      And the slide-group previous button is disabled

    Scenario: Vertical paging snaps to a nearby end
      Given a slide group with 13 items in a 300 pixel width
      And the slide group is vertical
      And the slide group is 300 pixels high
      And the slide-group threshold is 100 pixels
      When the slide group renders
      And the user pages the slide group forward
      Then the slide group is at the end
      And the slide-group next button is disabled
      When the user pages the slide group backward
      Then the slide group is at the start
      And the slide-group previous button is disabled

  Rule: Paging respects orientation and document direction

    Scenario: Vertical paging reaches both endpoints
      Given a slide group with 10 items in a 300 pixel width
      And the slide group is vertical
      When the slide group renders
      And the user pages the slide group forward
      And the user pages the slide group backward
      Then the slide group is at the start
      And the slide-group previous button is disabled
      When the user pages to the end of the slide group
      Then the slide group is at the end
      And the slide-group next button is disabled

    Scenario: Right-to-left paging reaches both endpoints
      Given a slide group with 10 items in a 300 pixel width
      And the slide-group document reads right to left
      When the slide group renders
      Then the slide-group previous button is disabled
      And the slide-group next button is enabled
      When the user pages the slide group forward
      Then the slide group has scrolled forward on its main axis only
      When the user pages the slide group backward
      Then the slide group is at the start
      When the user pages to the end of the slide group
      Then the slide group is at the end
      And the slide-group next button is disabled

    Scenario: Document direction can change after rendering
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      Then both slide-group paging buttons are visible
      When the slide-group document changes to right to left
      And the user pages the slide group forward
      Then the slide group has scrolled forward on its main axis only
      When the user pages the slide group backward
      Then the slide group is at the start

    Scenario: Orientation can change after rendering
      Given a slide group with 2 items in a 300 pixel width
      When the slide group renders
      Then the slide group has no paging buttons
      When the application sets slide-group "vertical" to ""
      And the application changes the slide group to 10 items
      Then both slide-group paging buttons are visible
      When the user pages the slide group forward
      Then the slide group has scrolled forward on its main axis only

  Rule: Content and lifecycle changes keep paging current

    Scenario: Adding items introduces overflow
      Given a slide group with 2 items in a 300 pixel width
      When the slide group renders
      Then the slide group has no paging buttons
      When the application changes the slide group to 10 items
      Then both slide-group paging buttons are visible
      And the slide-group next button is enabled

    Scenario: Removing items clears overflow
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      Then both slide-group paging buttons are visible
      When the application changes the slide group to 2 items
      Then the slide group has no paging buttons

    Scenario: Adding items after reaching the end enables forward paging
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      And the user pages to the end of the slide group
      Then the slide-group next button is disabled
      When the application changes the slide group to 12 items
      Then the slide-group next button is enabled
      When the user pages to the end of the slide group
      Then the slide group is at the end

    Scenario: A moved group still responds to resizing and direction changes
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      Then both slide-group paging buttons are visible
      When the application moves the slide group between containers twice
      And the application resizes the slide group to 1200 pixels wide
      Then the slide group has no paging buttons
      When the application resizes the slide group to 300 pixels wide
      Then both slide-group paging buttons are visible
      When the slide-group document changes to right to left
      And the user pages the slide group forward
      Then the slide group has scrolled forward on its main axis only

  Rule: Paging controls supplement rather than replace content accessibility

    Scenario: Custom icons retain accessible paging names
      Given a slide group with 10 items in a 300 pixel width
      And the slide group has custom paging icons
      When the slide group renders
      Then both slide-group paging buttons are visible
      And the slide-group custom paging icons are visible

    Scenario: Paging labels can change after rendering
      Given a slide group with 10 items in a 300 pixel width
      When the slide group renders
      Then both slide-group paging buttons are visible
      When the application sets slide-group "previous-page-label" to "Earlier"
      And the application sets slide-group "next-page-label" to "Later"
      Then the slide-group paging buttons are named "Earlier" and "Later"

    Scenario: Tab navigation visits content without extra paging stops
      Given a slide group with 3 items in a 200 pixel width
      And the slide-group items are focusable
      When the slide group renders
      Then both slide-group paging buttons are visible
      When the user tabs into the slide group
      Then the first slide-group item has focus
      When the user tabs through the slide-group items
      Then focus is after the slide group
