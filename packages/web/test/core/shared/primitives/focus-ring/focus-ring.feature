Feature: Focus ring
  A focus ring highlights keyboard focus on its associated control.

  Scenario: The ring is hidden from assistive technology
    Given a focus ring associated with a button
    When the focus ring renders
    Then the focus ring is hidden from assistive technology

  Scenario: Inward and disabled attributes reflect property changes
    Given a focus ring associated with a button with "inward disabled"
    When the focus ring renders
    Then the focus ring reflects "inward, disabled"
    When the application clears the focus ring properties
    Then the focus ring does not reflect "inward, disabled"

  Scenario: The outline can be shown and hidden manually
    Given a focus ring associated with a button
    When the focus ring renders
    And the application shows the focus ring
    Then the focus ring outline is visible
    When the application hides the focus ring
    Then the focus ring outline is not visible

  Scenario: Keyboard focus shows the outline
    Given a focus ring associated with a button
    When the focus ring renders
    And the user tabs to the focus ring button
    Then the focus ring outline is visible
    When the user tabs away from the focus ring button
    Then the focus ring outline is not visible

  Scenario: Pointer focus does not show the outline
    Given a focus ring associated with a button
    When the focus ring renders
    And the user clicks the focus ring button
    Then the focus ring button is focused
    And the focus ring outline is not visible

  Scenario: A disabled ring ignores focus
    Given a focus ring associated with a button with "disabled"
    When the focus ring renders
    And the user tabs to the focus ring button
    Then the focus ring button is focused
    And the focus ring outline is not visible

  Scenario: Disabling hides a visible ring
    Given a focus ring associated with a button
    When the focus ring renders
    And the application shows the focus ring
    And the application disables the focus ring
    Then the focus ring outline is not visible

  Scenario: Removing the association stops focus tracking
    Given a focus ring associated with a button
    When the focus ring renders
    And the application removes the focus ring association
    And the user tabs to the focus ring button
    Then the focus ring button is focused
    And the focus ring outline is not visible

  Scenario: A visible ring draws a solid outline
    Given a focus ring associated with a button
    When the focus ring renders
    And the user tabs to the focus ring button
    Then the focus ring outline is solid

  Scenario: Disconnecting hides the outline
    Given a focus ring associated with a button
    When the focus ring renders
    And the application shows the focus ring
    And the application disconnects the focus ring
    Then the disconnected focus ring outline is not visible
