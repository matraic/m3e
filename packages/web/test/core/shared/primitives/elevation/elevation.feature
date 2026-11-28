Feature: Elevation
  Scenario: An elevation is hidden from assistive technology and defaults to no level
    Given an elevation associated with a button
    When the elevation renders
    Then the elevation is hidden from assistive technology and has default properties

  Scenario: Elevation options are reflected
    Given an elevation with 'level="3" disabled'
    When the elevation renders
    Then the elevation reflects level 3 and disabled

  Scenario: Invalid levels are cleared
    Given an elevation associated with a button
    When the elevation renders
    And the application sets elevation level 9
    Then the elevation has no level

  Scenario Outline: Levels 0 through 5 are accepted
    Given an elevation associated with a button
    When the elevation renders
    And the application sets elevation level <level>
    Then the elevation level is <level>

    Examples:
      | level |
      | 0     |
      | 1     |
      | 2     |
      | 3     |
      | 4     |
      | 5     |

  Scenario: Levels can change repeatedly on the same elevation
    Given an elevation associated with a button
    When the elevation renders
    And the application sets elevation level 0
    Then the elevation level is 0
    When the application sets elevation level 1
    Then the elevation level is 1
    When the application sets elevation level 2
    Then the elevation level is 2
    When the application sets elevation level 3
    Then the elevation level is 3
    When the application sets elevation level 4
    Then the elevation level is 4
    When the application sets elevation level 5
    Then the elevation level is 5

  Scenario: A higher level casts a different shadow
    Given an elevation associated with a button
    When the elevation renders
    Then levels 0 and 4 cast different elevation shadows

  Scenario: Hover tracks the button
    Given an elevation associated with a button
    When the elevation renders
    And the user hovers the elevation button
    Then the elevation shadow shows "hover"
    When the pointer leaves the elevation button
    Then the elevation shadow does not show "hover"
    And the elevation shadow shows "resting"

  Scenario: Keyboard focus tracks the button
    Given an elevation associated with a button
    When the elevation renders
    And the user tabs to the elevation button
    Then the elevation shadow shows "focus"
    When the user tabs away from the elevation button
    Then the elevation shadow does not show "focus"

  Scenario: Pressing the button changes its elevation
    Given an elevation associated with a button
    When the elevation renders
    And the user hovers the elevation button
    And the user presses the elevation button
    Then the elevation shadow shows "pressed"
    When the user releases the elevation button
    Then the elevation shadow does not show "pressed"

  Scenario: Disabled elevation ignores interaction
    Given an elevation with 'disabled'
    When the elevation renders
    And the user hovers the elevation button
    And the user presses the elevation button
    And the user releases the elevation button
    Then the elevation shadow does not show interaction states

  Scenario: Disabling restores the resting level
    Given an elevation associated with a button
    When the elevation renders
    And the user hovers the elevation button
    Then the elevation shadow shows "hover"
    When the application disables the elevation
    Then the elevation shadow shows "resting"
    And the elevation shadow does not show "hover"

  Scenario: Removing the association stops tracking
    Given an elevation associated with a button
    When the elevation renders
    And the application removes the elevation association
    And the user hovers the elevation button
    Then the elevation shadow does not show interaction states
