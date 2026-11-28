Feature: Ripple
  Scenario: Defaults are hidden from assistive technology
    Given a ripple associated with a button
    When the ripple renders
    Then the ripple is hidden from assistive technology and has default properties

  Scenario: Ripple options are reflected
    Given a ripple with "disabled centered unbounded"
    When the ripple renders
    Then the ripple reflects "disabled, centered, unbounded"

  Scenario: Manual persistent ripples remain until hidden
    Given a ripple associated with a button
    When the ripple renders
    And the application shows a persistent ripple
    Then there is one visible persistent ripple
    And the ripple remains visible
    When the application hides the ripple
    Then there are no visible ripples

  Scenario: Non-persistent ripples end on their own
    Given a ripple associated with a button
    When the ripple renders
    And the application shows a non-persistent ripple
    Then the ripple eventually becomes invisible

  Scenario: An explicit radius determines ripple size
    Given a ripple associated with a button
    When the ripple renders
    And the application sets ripple radius to 25
    And the application shows a persistent ripple
    Then the ripple dimensions are 50 pixels

  Scenario: The default radius reaches the farthest corner
    Given a ripple associated with a button
    When the ripple renders
    And the application shows a persistent ripple at the top left
    Then the ripple reaches the farthest corner

  Scenario: Centered ripples start in the center
    Given a ripple with "centered"
    When the ripple renders
    And the application sets ripple radius to 10
    And the application shows a persistent ripple at zero
    Then the ripple starts in the center

  Scenario: Pressing the button starts and releases a ripple
    Given a ripple associated with a button
    When the ripple renders
    And the user hovers the ripple button
    And the user presses the ripple button
    Then there is one visible ripple
    When the user releases the ripple button
    Then there are no visible ripples

  Scenario: Space starts and releases a ripple
    Given a ripple associated with a button
    When the ripple renders
    And the user focuses the ripple button
    And the user holds Space on the ripple button
    Then there is one ripple
    When the user releases Space on the ripple button
    Then there are no ripples

  Scenario: Disabled ripples ignore presses but allow manual display
    Given a ripple with "disabled"
    When the ripple renders
    And the user hovers the ripple button
    And the user presses the ripple button
    And the user releases the ripple button
    Then the ripple is not visible after interaction
    When the application shows a persistent ripple
    Then there is one ripple

  Scenario: Disabling removes an active ripple
    Given a ripple associated with a button
    When the ripple renders
    And the application shows a persistent ripple
    And the application disables the ripple
    Then there are no ripples

  Scenario: Removing the association stops press tracking
    Given a ripple associated with a button
    When the ripple renders
    And the application removes the ripple association
    And the user hovers the ripple button
    And the user presses the ripple button
    And the user releases the ripple button
    Then the ripple is not visible after interaction

  Scenario: Disconnecting cleans up ripples
    Given a ripple associated with a button
    When the ripple renders
    And the application shows a persistent ripple
    And the application disconnects the ripple
    Then the disconnected ripple is not visible
