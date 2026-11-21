Feature: Checkbox
  Checkboxes expose selection state, support accessible activation, and participate in forms.

  Rule: Checkboxes support labels and user selection

    Scenario: A wrapping label names and activates a focusable checkbox
      Given a checkbox wrapped in its Receive updates label
      When the checkbox renders
      Then a checkbox named "Receive updates" is visible
      When the user presses "Tab" on the checkbox
      Then the checkbox has keyboard focus
      When the user clicks checkbox label "Receive updates"
      Then the checkbox is checked

    Scenario: Pointer activation toggles state and emits ordered events
      Given an unchecked checkbox
      When the checkbox renders
      And the application observes checkbox events
      And the user clicks the checkbox
      Then the checkbox is checked
      And the checkbox exposes checked state "true"
      And the checkbox events are "beforeinput, input, change"
      When the user clicks the checkbox
      Then the checkbox is unchecked
      And the checkbox exposes checked state "false"
      And the checkbox events are "beforeinput, input, change, beforeinput, input, change"

    Scenario: Canceling beforeinput prevents selection and further events
      Given an unchecked checkbox
      When the checkbox renders
      And the application cancels checkbox beforeinput
      And the user clicks the checkbox
      Then the checkbox is unchecked
      And the checkbox exposes checked state "false"
      And the checkbox events are "beforeinput"

    Scenario: Activating an indeterminate checkbox clears its mixed state
      Given an indeterminate checkbox
      When the checkbox renders
      Then the checkbox exposes checked state "mixed"
      When the user clicks the checkbox
      Then the checkbox is checked
      And the checkbox is not indeterminate
      And the checkbox exposes checked state "true"

    Scenario: Space activates a checkbox but Enter does not
      Given an unchecked checkbox
      When the checkbox renders
      And the user focuses the checkbox
      And the user presses "Enter" on the checkbox
      Then the checkbox is unchecked
      When the user presses "Space" on the checkbox
      Then the checkbox is checked

    Scenario: Disabled checkboxes cannot be focused or changed
      Given a disabled checkbox
      When the checkbox renders
      Then the checkbox exposes disabled state
      And the checkbox is not keyboard focusable
      When the application clicks the checkbox
      Then the checkbox is unchecked

  Rule: Checkboxes participate in forms

    Scenario: Only checked checkboxes submit their name and value
      Given a checkbox named "updates" with value "weekly" in a form
      When the checkbox renders
      Then the preferences form has no checkbox values
      When the user clicks the checkbox
      Then the preferences form includes "updates" with value "weekly"
      When the user clicks the checkbox
      Then the preferences form has no checkbox values

    Scenario: Form reset restores the initially checked state
      Given an initially checked checkbox in a form
      When the checkbox renders
      And the user clicks the checkbox
      Then the checkbox is unchecked
      When the user resets the preferences form
      Then the checkbox is checked
      And the checkbox exposes checked state "true"

    Scenario: A required checkbox is invalid until checked
      Given a required checkbox in a form
      When the checkbox renders
      Then the preferences form is invalid
      When the user clicks the checkbox
      Then the preferences form is valid

  Rule: Accessible labels and state remain synchronized

    Scenario: An explicit label names and activates a checkbox
      Given a checkbox with an explicit Receive updates label
      When the checkbox renders
      Then the checkbox has native accessible name "Receive updates"
      When the user clicks checkbox label "Receive updates"
      Then the checkbox is checked
      And the checkbox exposes checked state "true"

    Scenario: A native wrapping label names a checkbox without an ARIA label
      Given a checkbox with a native wrapping label
      When the checkbox renders
      Then the checkbox has native accessible name "Receive updates"
      When the user clicks checkbox label "Receive updates"
      Then the checkbox is checked

    Scenario: Programmatic checked changes update ARIA without user events
      Given an unchecked checkbox
      When the checkbox renders
      And the application observes checkbox events
      And the application sets checkbox attribute "checked"
      Then the checkbox exposes checked state "true"
      When the application removes checkbox attribute "checked"
      Then the checkbox exposes checked state "false"
      And the checkbox events are ""

    Scenario: Programmatic mixed-state changes update ARIA
      Given an unchecked checkbox
      When the checkbox renders
      And the application sets checkbox attribute "indeterminate"
      Then the checkbox exposes checked state "mixed"
      When the application removes checkbox attribute "indeterminate"
      Then the checkbox exposes checked state "false"

    Scenario: Canceling activation preserves indeterminate state
      Given an indeterminate checkbox
      When the checkbox renders
      And the application cancels checkbox beforeinput
      And the user clicks the checkbox
      Then the checkbox exposes checked state "mixed"
      And the checkbox remains indeterminate
      And the checkbox events are "beforeinput"

    Scenario: Space emits the same ordered events as pointer activation
      Given an unchecked checkbox
      When the checkbox renders
      And the application observes checkbox events
      And the user focuses the checkbox
      And the user presses "Space" on the checkbox
      Then the checkbox is checked
      And the checkbox events are "beforeinput, input, change"

    Scenario: Reenabling a checkbox restores keyboard activation
      Given a disabled checkbox
      When the checkbox renders
      And the application removes checkbox attribute "disabled"
      Then the checkbox is keyboard focusable
      And the checkbox is not exposed as disabled
      When the user presses "Tab" on the checkbox
      Then the checkbox has keyboard focus
      When the user presses "Space" on the checkbox
      Then the checkbox is checked

    Scenario: Forced colors keep an unchecked checkbox outline visible
      Given an unchecked checkbox
      And forced colors are active for checkboxes
      When the checkbox renders
      Then the checkbox outline uses the system text color

  Rule: Forms handle disabled and mixed checkboxes

    Scenario: A checked checkbox uses on as its default value
      Given a checked checkbox named "updates" with no explicit value in a form
      When the checkbox renders
      Then the preferences form includes "updates" with value "on"

    Scenario: Disabled and indeterminate checkboxes do not submit values
      Given a checked checkbox named "updates" with no explicit value in a form
      When the checkbox renders
      And the application sets checkbox attribute "disabled"
      Then the preferences form has no checkbox values
      When the application removes checkbox attribute "disabled"
      Then the preferences form includes "updates" with value "on"
      When the application sets checkbox attribute "indeterminate"
      Then the preferences form has no checkbox values

    Scenario: Form reset restores the initially unchecked state
      Given a checkbox named "updates" with value "weekly" in a form
      When the checkbox renders
      And the user clicks the checkbox
      Then the checkbox is checked
      When the user resets the preferences form
      Then the checkbox is unchecked
      And the checkbox exposes checked state "false"

    Scenario: Form reset restores the initial indeterminate state
      Given an initially indeterminate checkbox in a form
      When the checkbox renders
      And the user clicks the checkbox
      Then the checkbox is checked
      When the user resets the preferences form
      Then the checkbox is unchecked
      And the checkbox remains indeterminate
      And the checkbox exposes checked state "mixed"

    Scenario: A disabled fieldset disables and excludes its checkbox
      Given a checked checkbox inside a disabled fieldset
      When the checkbox renders
      Then the checkbox exposes disabled state
      And the checkbox is not keyboard focusable
      And the preferences form has no checkbox values
      When the application enables the checkbox fieldset
      Then the checkbox is keyboard focusable
      And the preferences form includes "updates" with value "weekly"

  Rule: Checkboxes retain behavior when moved in the DOM

    Scenario: Moving a checkbox preserves selection and does not duplicate events
      Given an unchecked checkbox
      When the checkbox renders
      And the user clicks the checkbox
      And the application observes checkbox events
      And the application moves the checkbox to a new DOM parent
      Then the checkbox is in the new DOM parent
      And a checkbox named "Receive updates" is visible
      And the checkbox exposes checked state "true"
      When the user focuses the checkbox
      And the user presses "Space" on the checkbox
      Then the checkbox is unchecked
      And the checkbox events are "beforeinput, input, change"

    Scenario: Moving a disabled checkbox preserves activation suppression
      Given a disabled checkbox
      When the checkbox renders
      And the application observes checkbox events
      And the application moves the checkbox to a new DOM parent
      Then the checkbox exposes disabled state
      And the checkbox is not keyboard focusable
      When the application clicks the checkbox
      Then the checkbox is unchecked
      And the checkbox events are ""

    Scenario: Moving between forms transfers the submitted value
      Given a checked checkbox with a destination form
      When the checkbox renders
      Then the preferences form includes "updates" with value "weekly"
      When the application moves the checkbox to the destination form
      Then the preferences form has no checkbox values
      And the destination form includes the checkbox value
      When the user clicks the checkbox
      Then the destination form has no checkbox values

    Scenario: Moving into a new label updates naming and label activation
      Given a checkbox with a native wrapping label
      When the checkbox renders
      And the application observes checkbox events
      And the application moves the checkbox into a new label
      Then the checkbox has native accessible name "Destination updates"
      When the user clicks checkbox label "Destination updates"
      Then the checkbox is checked
      And the checkbox events are "beforeinput, input, change"
