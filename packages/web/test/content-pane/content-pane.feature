Feature: Content pane
  Content panes present document content on a vertically scrollable surface.

  Rule: Panes display and scroll their content

    Scenario: Default slot content is visible with vertical scrolling
      Given a content pane with document content
      When the content pane renders
      Then the document content is visible
      And the content pane allows vertical scrolling and clips horizontal overflow

    Scenario: Vertical scrolling works while horizontal overflow is clipped
      Given a content pane with oversized content
      When the content pane renders
      And the application scrolls the content pane down 100 pixels
      Then the content pane has scrolled down 100 pixels
      And the content pane overflows vertically and horizontally
      And the content pane allows vertical scrolling and clips horizontal overflow

    Scenario: A hidden pane is not visible
      Given a hidden content pane
      When the content pane renders
      Then the content pane is hidden

    Scenario: Hiding and showing a pane updates its content visibility
      Given a content pane with document content
      When the content pane renders
      And the application hides the content pane
      Then the content pane is hidden
      And the document content is hidden
      When the application shows the content pane
      Then the document content is visible

    Scenario: Replacing slotted content updates the pane
      Given a content pane with document content
      When the content pane renders
      And the application replaces the document content
      Then the replacement content is visible
      And the original document content is absent

  Rule: Panes preserve the semantics of their contents

    Scenario: A named pane exposes its heading and link
      Given a named content pane containing a heading and a link
      When the content pane renders
      Then a region named "Documentation" is visible
      And the document heading is visible inside the region
      And the document link is visible inside the region
      When the user tabs to the document link
      Then the document link has focus

    Scenario: Hidden panes are excluded from accessible content
      Given a hidden named content pane containing a heading and a link
      When the content pane renders
      Then the documentation region is not exposed
      And the document link is not exposed
      When the application shows the content pane
      Then a region named "Documentation" is visible
      And the document link is visible inside the region

    Scenario: Keyboard focus reveals an offscreen control
      Given a content pane with an offscreen button
      When the content pane renders
      And the user tabs to the offscreen button
      Then the offscreen button has focus
      And the content pane has scrolled to reveal the button

  Rule: Surface appearance can be customized

    Scenario: The pane applies custom padding, color, and shape
      Given a content pane with custom surface styles
      When the content pane renders
      Then the content pane uses the custom surface styles

    Scenario: Reduced motion disables surface transitions
      Given a content pane with document content
      And reduced motion is enabled for the content pane
      When the content pane renders
      Then the content pane surface has no transition

    Scenario: Forced colors removes the rounded surface and transition
      Given a content pane with custom surface styles
      And forced colors are enabled for the content pane
      When the content pane renders
      Then the content pane surface has no corner radius or transition

  Rule: Panes retain behavior when moved in the DOM

    Scenario: Moving a pane preserves its accessible contents and keyboard access
      Given a named content pane containing a heading and a link
      When the content pane renders
      And the application moves the content pane to a new DOM parent
      Then the content pane is in the new DOM parent
      And a region named "Documentation" is visible
      And the document heading is visible inside the region
      And the document link is visible inside the region
      When the user tabs to the document link
      Then the document link has focus

    Scenario: Moving a scrollable pane retains content and scrolling
      Given a content pane with oversized content
      When the content pane renders
      And the application moves the content pane to a new DOM parent
      Then the content pane is in the new DOM parent
      And the content pane overflows vertically and horizontally
      And the oversized content is visible
      When the application scrolls the content pane down 100 pixels
      Then the content pane has scrolled down 100 pixels
      And the content pane allows vertical scrolling and clips horizontal overflow

    Scenario: Reconnecting a pane recalculates inherited scrollbar width
      Given a content pane inheriting a 4 pixel scrollbar width
      When the content pane renders
      Then the content pane scrollbar compensation is "4px"
      When the application moves the content pane to a parent with a 10 pixel scrollbar width
      Then the content pane is in the new DOM parent
      And the content pane scrollbar compensation is "10px"
      And the document content is visible
      When the application moves the content pane to a parent with a 6 pixel scrollbar width
      Then the content pane scrollbar compensation is "6px"
