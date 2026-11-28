Feature: Stepper
  A stepper guides users through a multi-step workflow.

  Rule: Steps and panels provide accessible navigation

    Scenario: The first enabled step is selected and its panel is shown

      Given a stepper
      When the stepper renders
      Then the first step is selected and only its panel is visible

    Scenario: Steps and panels expose accessible names and relationships

      Given a stepper
      When the stepper renders
      Then each stepper tab has an accessible name and its panel is labelled by it
      And only the selected step is in the tab order
      When the user clicks stepper step "Two"
      Then the active step panel has accessible name "Two"

    Scenario: Vertical orientation is exposed to assistive technology

      Given a stepper with attributes "orientation='vertical'"
      When the stepper renders
      Then the stepper tablist has aria-orientation "vertical"
      And the second step has display order "1"

    Scenario: Keyboard navigation moves focus and Enter selects a step

      Given a stepper
      When the stepper renders
      And the user focuses stepper step "One"
      And the user presses "ArrowRight" in the stepper
      Then stepper step "Two" has focus
      And the selected step index is 0
      When the user presses "End" in the stepper
      Then stepper step "Three" has focus
      When the user presses "Home" in the stepper
      Then stepper step "One" has focus
      When the user presses "ArrowRight" in the stepper
      And the user presses "Enter" in the stepper
      Then the selected step index is 1

    Scenario: Arrow navigation wraps from the last step to the first

      Given a stepper
      When the stepper renders
      And the user focuses stepper step "One"
      And the user presses "End" in the stepper
      And the user presses "ArrowRight" in the stepper
      Then stepper step "One" has focus

  Rule: Steps can be selected and navigation can be cancelled

    Scenario: Clicking a step changes the panel and emits selection events

      Given a stepper
      When the stepper renders and records selection events
      And the user clicks stepper step "Two"
      Then the selected step index is 1
      And stepper panel "Two" is visible
      And the stepper emits beforeinput, input, and change in order

    Scenario: Cancelling beforeinput prevents a step change

      Given a stepper
      When the stepper renders and records selection events
      And the application cancels beforeinput on stepper step "Two"
      And the user clicks stepper step "Two"
      Then the selected step index is 0
      And the stepper emits only beforeinput

    Scenario: Moving on marks the previous step completed

      Given a stepper
      When the stepper renders
      And the user clicks stepper step "Two"
      Then stepper step "One" is completed

    Scenario: Step actions navigate forward, backward, and reset

      Given a stepper
      When the stepper renders
      And the user activates stepper action "Next"
      Then the selected step index is 1
      When the user activates stepper action "Next2"
      Then the selected step index is 2
      When the user activates stepper action "Back3"
      Then the selected step index is 1
      When the user activates stepper action "Back"
      Then the selected step index is 0
      When the user activates stepper action "Next"
      And the user activates stepper action "Next2"
      And the user activates stepper action "Reset"
      Then the selected step index is 0
      And stepper step "One" is not completed

    Scenario: Imperative next and previous methods report whether they moved

      Given a stepper
      When the stepper renders
      And the application moves the stepper previous
      Then the movement is rejected
      When the application moves the stepper next
      Then the movement is accepted
      When the application moves the stepper next
      Then the movement is accepted
      When the application moves the stepper next
      Then the movement is rejected
      And the selected step index is 2

    Scenario: moveTo emits one change and rejects invalid indexes

      Given a stepper
      When the stepper renders and records selection events
      And the application moves the stepper to index 2
      Then the movement is accepted
      When the application moves the stepper to index 9
      Then the movement is rejected
      When the application moves the stepper to index -1
      Then the movement is rejected
      And the stepper emits one change event

    Scenario: Disabled steps cannot be activated or navigated to

      Given a stepper with step "Two" disabled
      When the stepper renders
      Then stepper step "Two" is exposed as disabled
      When the user dispatches a click on stepper step "Two"
      Then the selected step index is 0
      When the application moves the stepper to index 1
      Then the movement is rejected
      When the application moves the stepper next
      Then the movement is rejected

    Scenario: The first enabled step is selected when the first is disabled

      Given a stepper with the first step disabled
      When the stepper renders
      Then the selected step index is 1

    Scenario: Dynamically added steps keep the selection and get an accessible panel

      Given a stepper
      When the stepper renders
      And the application adds an associated fourth step
      Then the stepper contains 4 steps and keeps the selected index at 0
      And the fourth step and panel are accessibly associated

  Rule: Linear progression respects validity and editability

    Scenario: An invalid required step blocks linear progression

      Given a linear stepper
      When the stepper renders
      And the application attempts to move the stepper next
      Then the movement is rejected
      And stepper step "One" is marked invalid
      And the selected step index is 0
      When the application fills the first step's required field
      And the application attempts to move the stepper next
      Then the movement is accepted
      And the selected step index is 1

    Scenario: An optional invalid step may be left in linear mode

      Given a linear stepper with an optional first step
      When the stepper renders
      Then stepper step "One" is labelled optional
      When the application attempts to move the stepper next
      Then the movement is accepted
      And the selected step index is 1

    Scenario: Linear mode prevents skipping ahead

      Given a linear stepper
      When the stepper renders
      And the application fills the first step's required field
      And the application moves the stepper to index 2
      Then the movement is rejected
      And the selected step index is 0

    Scenario: Linear mode prevents returning to a completed non-editable step

      Given a linear stepper
      When the stepper renders
      And the application fills the first step's required field
      And the application moves the stepper next
      And the application moves the stepper previous
      Then the movement is rejected
      And the selected step index is 1

    Scenario: Linear mode allows returning to a completed editable step

      Given a linear stepper with an editable first step
      When the stepper renders
      And the application fills the first step's required field
      And the application moves the stepper next
      And the application moves the stepper previous
      Then the movement is accepted
      And the selected step index is 0

    Scenario: Reset clears form data and completion state

      Given a stepper
      When the stepper renders
      And the application fills the first step's required field
      And the application moves the stepper next
      And the application resets the stepper
      Then the selected step index is 0
      And the first step's required field is empty
      And stepper step "One" is not completed

  Rule: Configuration controls the stepper layout

    Scenario: Invalid orientation and positions fall back to defaults

      Given a stepper with attributes "orientation='bogus' header-position='bogus' label-position='bogus'"
      When the stepper renders
      Then the stepper attribute "orientation" is "horizontal"
      And the stepper attribute "header-position" is "above"
      And the stepper attribute "label-position" is "end"

    Scenario: Header position below places the tabs after the panel

      Given a stepper with attributes "header-position='below'"
      When the stepper renders
      Then the tablist is below the selected step panel
