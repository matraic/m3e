Feature: Filter chips and filter chip sets
  Filter chips expose selection and support single-selection radiogroups or multi-selection groups.

  Scenario: A filter chip toggles radio selection
    Given a filter chip set with one Design chip
    When the filter chips render
    Then filter chip "Design" exposes radio state "false"
    When the user clicks filter chip "Design"
    Then filter chip "Design" is selected
    And filter chip "Design" exposes radio state "true"
    When the user clicks filter chip "Design"
    Then filter chip "Design" is not selected
    And filter chip "Design" exposes radio state "false"

  Scenario: A single-selection set can switch to multiple selection
    Given a filter chip set with Design initially selected and Accessibility unselected
    When the filter chips render
    And the user clicks filter chip "Accessibility"
    Then filter chip "Design" is not selected
    And filter chip "Accessibility" is selected
    When the application sets filter set attribute "multi" to ""
    Then the Topics filter set is a group
    When the user clicks filter chip "Design"
    Then filter chip "Design" exposes pressed state "true"
    And filter chip "Accessibility" exposes pressed state "true"

  Scenario: Canceling beforeinput prevents selection
    Given a filter chip set with one Design chip
    When the filter chips render
    And the application cancels filter chip beforeinput
    And the user clicks filter chip "Design"
    Then filter chip "Design" is not selected
    And filter chip "Design" exposes radio state "false"
    And the filter set events are "beforeinput"

  Scenario: Selection emits ordered bubbling events
    Given a filter chip set with one Design chip
    When the filter chips render
    And the application observes filter set events
    And the user clicks filter chip "Design"
    Then the filter set events are "beforeinput, input, change"

  Scenario: Keyboard navigation focuses enabled chips and wraps without selecting
    Given a filter chip set with a disabled middle chip
    When the filter chips render
    Then the Topics filter set is a radiogroup
    When the user focuses filter chip "Design"
    And the user presses "ArrowRight" in the filter set
    Then filter chip "Motion" has focus
    And filter chip "Motion" is not selected
    When the user presses "ArrowRight" in the filter set
    Then filter chip "Design" has focus
    And filter chip "Design" is not selected

  Scenario: Space toggles a filter chip
    Given a filter chip set with one Design chip
    When the filter chips render
    And the user focuses filter chip "Design"
    And the user presses "Space" in the filter set
    Then filter chip "Design" exposes radio state "true"

  Scenario: Changing selection mode replaces incompatible ARIA states
    Given a filter chip set with one Design chip
    When the filter chips render
    And the user clicks filter chip "Design"
    And the application sets filter set attribute "multi" to ""
    Then filter chip "Design" exposes pressed state "true"
    And filter chip "Design" has no radio state
    When the application removes filter set attribute "multi"
    Then filter chip "Design" exposes radio state "true"
    And filter chip "Design" has no pressed state

  Scenario: Disabled filter sets suppress selection
    Given a filter chip set with one Design chip
    When the filter chips render
    And the application sets filter set attribute "disabled" to ""
    Then filter chip "Design" exposes disabled state
    When the application observes filter set events
    And the application clicks filter chip "Design"
    Then filter chip "Design" is not selected
    And the filter set events are ""

  Scenario: Programmatic selection updates ARIA without user events
    Given a filter chip set with one Design chip
    When the filter chips render
    And the application observes filter set events
    And the application selects filter chip "Design"
    Then filter chip "Design" exposes radio state "true"
    And the filter set events are ""

  Scenario: Multiple selected filters submit their values
    Given a multi-select filter set in a form
    When the filter chips render
    And the user clicks filter chip "Design"
    And the user clicks filter chip "Accessibility"
    Then the filter form values are Design and Accessibility
    When the user clicks filter chip "Design"
    Then the filter form includes only "accessibility"
    When the user clicks filter chip "Accessibility"
    Then the filter form has no values
    When the application selects filter chip "Design"
    Then the filter form includes only "design"
    When the application sets filter set attribute "disabled" to ""
    Then the filter form has no values

  Scenario: Moving a filter set preserves semantics and one selection event sequence
    Given a filter chip set with Design initially selected and Accessibility unselected
    When the filter chips render
    And the application observes filter set events
    And the application moves the filter set to a new parent
    Then the filter set is in the new parent
    And the Topics filter set is a radiogroup
    And filter chip "Design" exposes radio state "true"
    When the user focuses filter chip "Design"
    And the user presses "ArrowRight" in the filter set
    Then filter chip "Accessibility" has focus
    And filter chip "Accessibility" exposes radio state "false"
    And filter chip "Design" exposes radio state "true"
    When the user presses "Space" in the filter set
    Then filter chip "Accessibility" exposes radio state "true"
    And the filter set events are "beforeinput, input, change"

  Scenario: Moving a filter chip between sets adopts the destination role
    Given a filter chip with a multi-select destination set
    When the filter chips render
    And the application moves Design into the destination filter set
    Then the destination filter set contains Design
    And filter chip "Design" exposes pressed state "false"
    When the user clicks filter chip "Design"
    Then filter chip "Design" exposes pressed state "true"
    And the original filter set has no selected values

  Scenario: A chip moved to a multi-select set becomes a tab stop
    Given a single-select filter set and a multi-select destination set
    When the filter chips render
    Then filter chip "Accessibility" is not a tab stop
    When the application moves Accessibility into the destination filter set
    Then filter chip "Accessibility" is a tab stop

  Scenario: A single-selection form submits its initial and replacement selections
    Given an initially selected filter set in a form
    When the filter chips render
    Then the filter form includes only "design"
    When the application selects filter chip "Accessibility"
    Then filter chip "Design" is not selected
    And the filter form includes only "accessibility"

  Scenario: A disabled-interactive filter chip retains focus without selecting
    Given a filter chip set with one Design chip
    When the filter chips render
    And the application sets filter chip "Design" attribute "disabled-interactive"
    Then filter chip "Design" exposes disabled state
    When the application observes filter set events
    And the user focuses filter chip "Design"
    Then filter chip "Design" has focus
    When the user presses "Space" in the filter set
    Then filter chip "Design" is not selected
    And the filter set events are ""
