Feature: State layer
  Scenario: Defaults are hidden from assistive technology
    Given a state layer associated with a button
    When the state layer renders
    Then the state layer is hidden from assistive technology and has default properties

  Scenario: State layer options are reflected
    Given a state layer with "disabled disable-hover enable-pressed"
    When the state layer renders
    Then the state layer reflects "disabled, disable-hover, enable-pressed"

  Scenario Outline: States can be shown and hidden manually
    Given a state layer associated with a button
    When the state layer renders
    And the application shows state layer "<state>"
    Then the state layer shows "<state>"
    When the application hides state layer "<state>"
    Then the state layer does not show "<state>"

    Examples:
      | state   |
      | hover   |
      | focused |
      | pressed |

  Scenario: Hover tracks the associated button
    Given a state layer associated with a button
    When the state layer renders
    And the user hovers the state layer button
    Then the state layer shows "hover"
    When the pointer leaves the state layer button
    Then the state layer does not show "hover"

  Scenario: Hover can be disabled
    Given a state layer with "disable-hover"
    When the state layer renders
    And the user hovers the state layer button
    Then the state layer does not show "hover" after interaction

  Scenario: Keyboard focus shows focus state
    Given a state layer associated with a button
    When the state layer renders
    And the user tabs to the state layer button
    Then the state layer button is focused
    And the state layer shows "focused"
    When the user tabs away from the state layer button
    Then the state layer does not show "focused"

  Scenario: Pointer focus does not show focus state
    Given a state layer associated with a button
    When the state layer renders
    And the user clicks the state layer button
    Then the state layer button is focused
    And the state layer does not show "focused"

  Scenario: Disabled state layers ignore hover and focus
    Given a state layer with "disabled"
    When the state layer renders
    And the user hovers the state layer button
    And the user tabs to the state layer button
    Then the state layer does not show "hover|focused" after interaction

  Scenario: Disabling clears active states
    Given a state layer associated with a button
    When the state layer renders
    And the application shows state layer "hover"
    And the application shows state layer "focused"
    And the application disables the state layer
    Then the state layer does not show "hover|focused"

  Scenario: Pressed state is enabled explicitly
    Given a state layer with "enable-pressed"
    When the state layer renders
    And the user hovers the state layer button
    And the user presses the state layer button
    Then the state layer shows "pressed"
    When the user releases the state layer button
    Then the state layer does not show "pressed"

  Scenario: Pressed state is disabled by default
    Given a state layer associated with a button
    When the state layer renders
    And the user hovers the state layer button
    And the user presses the state layer button
    Then the state layer does not show "pressed" after interaction
    When the user releases the state layer button

  Scenario: Removing the association stops tracking
    Given a state layer associated with a button
    When the state layer renders
    And the application removes the state layer association
    And the user hovers the state layer button
    Then the state layer does not show "hover" after interaction

  Scenario: Disconnecting clears the active states
    Given a state layer associated with a button
    When the state layer renders
    And the application shows state layer "hover"
    And the application shows state layer "focused"
    And the application disconnects the state layer
    Then the disconnected state layer has no hover or focus state
