Feature: Pseudo selection controls
  Pseudo controls provide visual selection indicators without exposing interactive controls.

  Scenario: An unchecked pseudo checkbox is hidden from assistive technology and has no icon
    Given a pseudo checkbox
    When the pseudo control renders
    Then the pseudo control is hidden from assistive technology
    And the pseudo checkbox has no icon

  Scenario: A checked pseudo checkbox shows a check mark
    Given a pseudo checkbox with "checked"
    When the pseudo control renders
    Then the pseudo checkbox shows a check mark
    And no checkbox control is exposed

  Scenario: Indeterminate takes precedence over checked
    Given a pseudo checkbox with "checked indeterminate disabled"
    When the pseudo control renders
    Then the pseudo checkbox shows a dash
    And the pseudo control reflects "checked, indeterminate, disabled"

  Scenario: The checkbox icon follows checked state
    Given a pseudo checkbox
    When the pseudo control renders
    And the application checks the pseudo control
    Then the pseudo checkbox has an icon
    When the application unchecks the pseudo control
    Then the pseudo checkbox has no icon

  Scenario: An unchecked pseudo radio is hidden from assistive technology
    Given a pseudo radio
    When the pseudo control renders
    Then the pseudo control is hidden from assistive technology
    And the pseudo radio dot is hidden
    When the application checks the pseudo control
    Then the pseudo radio dot is visible

  Scenario: A checked pseudo radio is not exposed as a control
    Given a pseudo radio with "checked disabled"
    When the pseudo control renders
    Then the pseudo control reflects "checked, disabled"
    And no radio control is exposed
