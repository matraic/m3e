Feature: Selection indicator
  Scenario: Defaults are hidden from assistive technology
    Given a selection indicator associated with a button
    When the selection indicator renders
    Then the selection indicator is hidden from assistive technology and has default properties

  Scenario: Indicator properties are reflected
    Given a selection indicator with "disabled selected bounce centered"
    When the selection indicator renders
    Then the selection indicator reflects "disabled, selected, bounce, centered"

  Scenario: The indicator is visible only when selected
    Given a selection indicator associated with a button
    When the selection indicator renders
    Then the selection indicator opacity is 0
    When the application selects the indicator
    Then the selection indicator opacity is 1
    When the application deselects the indicator
    Then the selection indicator opacity is 0

  Scenario: The hover state can be shown and hidden manually
    Given a selection indicator associated with a button
    When the selection indicator renders
    And the application shows the indicator hover state
    Then the indicator layer shows "hover"
    When the application hides the indicator hover state
    Then the indicator layer does not show "hover"

  Scenario: Hover tracks the button
    Given a selection indicator associated with a button
    When the selection indicator renders
    And the user hovers the indicator button
    Then the indicator layer shows "hover"
    When the pointer leaves the indicator button
    Then the indicator layer does not show "hover"

  Scenario: Keyboard focus tracks the button
    Given a selection indicator associated with a button
    When the selection indicator renders
    And the user tabs to the indicator button
    Then the indicator layer shows "focused"

  Scenario: Pressing the button shows the pressed state
    Given a selection indicator associated with a button
    When the selection indicator renders
    And the user hovers the indicator button
    And the user presses the indicator button
    Then the indicator layer shows "pressed"
    When the user releases the indicator button

  Scenario: A disabled indicator disables its state layer
    Given a selection indicator with "disabled"
    When the selection indicator renders
    Then the indicator state layer is disabled
    When the user hovers the indicator button
    Then the indicator layer does not show hover after interaction

  Scenario: The inner layer follows the same control
    Given a selection indicator associated with a button
    When the selection indicator renders
    Then the indicator state layer is attached to the button

  Scenario: Removing the association stops tracking
    Given a selection indicator associated with a button
    When the selection indicator renders
    And the application removes the indicator association
    And the user hovers the indicator button
    Then the indicator layer does not show hover after interaction

  Scenario: Pressing records the origin
    Given a selection indicator associated with a button
    When the selection indicator renders with motion enabled
    And the user presses the indicator button at an offset
    Then the indicator records the press origin
    When the user releases the indicator button

  Scenario: Centered indicators do not record the origin
    Given a selection indicator with "centered"
    When the selection indicator renders with motion enabled
    And the user presses the indicator button at an offset
    Then the indicator does not record the press origin
    When the user releases the indicator button
