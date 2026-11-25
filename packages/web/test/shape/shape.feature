Feature: Shape
  Shapes clip their contents to a named outline and can be sized and colored with tokens.

  Rule: A shape's name determines its outline

    Scenario: An unnamed shape has no clipping
      Given an unnamed shape
      When the shape renders
      Then the shape has no clip path

    Scenario: A named shape clips to a polygon
      Given a shape named "sunny"
      When the shape renders
      Then the shape has a polygon clip path

    Scenario: Different names produce different outlines
      Given shapes named "sunny", "heart", and "square"
      When the shape renders
      Then the shapes have different clip paths

    Scenario: Changing the name changes the outline
      Given a shape named "sunny"
      When the shape renders
      And the application changes the shape name to "heart"
      Then the shape's clip path changes

    Scenario: Removing the name removes clipping
      Given a shape named "sunny"
      When the shape renders
      And the application removes the shape name
      Then the shape has no clip path

    Scenario: An unknown name has no clipping
      Given a shape named "bogus"
      When the shape renders
      Then the shape has no clip path

  Rule: A shape supports content and styling

    Scenario: The size token sets both dimensions
      Given a shape sized "120px"
      When the shape renders
      Then the shape is "120px" wide and high

    Scenario: Content is rendered inside the shape
      Given a shape containing "Inside"
      When the shape renders
      Then the shape content "Inside" is visible

    Scenario: A hidden shape is not displayed
      Given a hidden shape
      When the shape renders
      Then the shape is hidden

    Scenario: The container color token sets the background
      Given a shape with container color "rgb(255, 0, 0)"
      When the shape renders
      Then the shape background is "rgb(255, 0, 0)"
