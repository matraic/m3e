Feature: Form field
  Form fields present controls with labels, contextual help, and validation feedback.

  Rule: Form fields label and focus their controls

    Scenario: Clicking the field focuses its labelled control
      Given a form field labelled "Email address"
      When the form field renders
      Then the form field control is accessible as "Email address"
      When the user clicks the form field
      Then the form field control is focused

    Scenario: The form field supports both appearance variants
      Given outlined and filled form fields
      When the form field renders
      Then the form fields have their configured variants

    Scenario: An automatic label floats for focus or a value
      Given a form field labelled "Name"
      When the form field renders
      Then the form field label is not floating
      When the user focuses the form field control
      Then the form field label is floating
      When the user leaves the form field control
      Then the form field label is not floating
      When the user enters "Ada" in the form field control
      Then the form field label is floating

    Scenario: An always-floating label stays floated after focus
      Given a form field labelled "Name" with an always-floating label
      When the form field renders
      Then the form field label uses the floating font size
      When the user focuses the form field control
      And the user leaves the form field control
      Then the form field label retains its floating font size

    Scenario: Updating a label updates its accessible name and outlined notch
      Given a form field labelled "Name" with an always-floating label
      When the form field renders
      Then the outline notch matches the label "Name"
      When the application changes the form field label to "Full legal name"
      Then the form field control is accessible as "Full legal name"
      And the outline notch matches the label "Full legal name" and is wider

    Scenario: A disabled control cannot be focused by clicking the field
      Given a disabled form field control
      When the form field renders
      Then the form field control is disabled
      When the user clicks the form field
      Then the form field control is not focused

    Scenario: A read-only control can be focused but not edited
      Given a read-only form field control with value "Original"
      When the form field renders
      Then the form field control is enabled and read-only
      When the user focuses the form field control
      And the user types " changed" in the form field control
      Then the form field control is focused
      And the form field control value is "Original"

    Scenario: Changing disabled state updates the field and focus behavior
      Given a form field labelled "Name"
      When the form field renders
      And the application disables the form field control
      Then the form field control is disabled
      And the form field is marked disabled
      When the user clicks the form field
      Then the form field control is not focused
      When the application enables the form field control
      Then the form field is not marked disabled
      When the user clicks the form field
      Then the form field control is focused

    Scenario: Changing read-only state updates the field and editability
      Given a form field labelled "Name"
      When the form field renders
      And the application makes the form field control read-only
      Then the form field is marked read-only
      When the user focuses the form field control
      And the user types "Ada" in the form field control
      Then the form field control value is ""
      When the application makes the form field control editable
      Then the form field is not marked read-only
      When the user types "Ada" in the form field control
      Then the form field control value is "Ada"

    Scenario: An interactive suffix keeps its own focus and action
      Given a form field with an interactive suffix
      When the form field renders
      And the user activates the form field suffix
      Then the form field suffix is focused
      And the form field suffix action is invoked once

  Rule: Form fields communicate hints and validation errors

    Scenario: A hint describes the control
      Given a form field with a hint
      When the form field renders
      Then the form field hint is visible
      And the form field control is described by "Use at least 4 characters"

    Scenario: Consumer descriptions survive hint changes, field movement, and control replacement
      Given a form field with a hint and a consumer description
      When the form field renders
      Then the form field control is described by "External guidance"
      And the form field control is described by "Use at least 4 characters"
      When the application changes the form field hint to "New help"
      Then the form field control is described by "External guidance"
      And the form field control is described by "New help"
      And the form field control is not described by "Use at least 4 characters"
      When the application moves the form field to another parent
      Then the form field control is described by "External guidance"
      And the form field control is described by "New help"
      When the application replaces the form field control with a separately described control
      Then the new form field control is described by "External guidance"
      And the new form field control is described by "New help"
      And the removed form field control is described only by "External guidance"

    Scenario: Always hiding the subscript keeps it hidden on focus
      Given a form field with an always-hidden hint
      When the form field renders
      Then the form field subscript is not displayed
      When the user focuses the form field control
      Then the form field subscript is not displayed

    Scenario: An automatic subscript appears on focus and while invalid
      Given a required form field with automatic subscript
      When the form field renders
      Then the form field subscript is transparent
      When the user focuses the form field control
      Then the form field subscript is opaque
      When the user leaves the form field control
      Then the form field control is invalid
      And the form field subscript is opaque
      And the form field error is visible

    Scenario: Validation errors replace the visible hint
      Given a required form field with hint and error
      When the form field renders
      Then the form field hint is visible
      When the user focuses the form field control
      And the user leaves the form field control
      Then the form field control is invalid
      And the form field error is visible
      And the form field hint is hidden
      And the form field control is described by "This field is required"
      When the user enters "Ada" in the form field control
      And the user leaves the form field control
      Then the form field control is valid
      And the form field hint is visible
      And the form field error is hidden
      And the form field control is not described by "This field is required"

    Scenario: Native validation supplies an error when no error is slotted
      Given a required form field without an error message
      When the form field renders
      And the user focuses the form field control
      And the user leaves the form field control
      Then the form field control is invalid
      And the native validation message is visible and describes the control
      When the user enters "Ada" in the form field control
      And the user leaves the form field control
      Then the form field control is valid
      And the form field error is hidden
      And the native validation message no longer describes the control

    Scenario: A manually forced error makes the control invalid
      Given a form field with a manually forced error
      When the form field renders
      Then the form field control is invalid
      And the form field error is visible
      And the form field control fails native validity
      When the application clears the form field error
      Then the form field control is valid
      And the form field control passes native validity

    Scenario: An application can apply and clear a forced error after rendering
      Given a form field with an error message
      When the form field renders
      And the application forces a form field error
      Then the form field control is invalid
      And the form field error is visible
      And the form field native validation message is "Reference is invalid"
      When the application clears the form field error
      Then the form field control is valid
      And the form field control passes native validity

    Scenario: A control's custom validity is preserved and displayed
      Given a form field with an error message
      When the form field renders
      And the application sets the control's custom validity to "Server rejected reference"
      And the user focuses the form field control
      And the user leaves the form field control
      Then the form field control is invalid
      And the form field error is visible
      And the form field native validation message is "Server rejected reference"
      When the application sets the control's custom validity to ""
      And the user focuses the form field control
      And the user leaves the form field control
      Then the form field control is valid
      And the form field error is hidden

    Scenario: Updating hint text updates the accessible description
      Given a form field with a hint
      When the form field renders
      And the application changes the form field hint to "New help"
      Then the form field control is described by "New help"
      And the form field control is not described by "Use at least 4 characters"
      When the application changes the form field hint text node to "Updated help"
      Then the form field control is described by "Updated help"
      And the form field control is not described by "New help"

    Scenario: Adding, replacing, and removing a hint updates the description
      Given a form field without a hint
      When the form field renders
      And the application adds a "hint" slot with text "First hint"
      Then the form field control is described by "First hint"
      And the form field hint displays "First hint"
      When the application replaces the "hint" slot with text "Second hint"
      Then the form field control is described by "Second hint"
      And the form field control is not described by "First hint"
      And the form field hint displays "Second hint"
      When the application removes the "hint" slot
      Then the form field control is not described by "Second hint"

    Scenario: Adding, replacing, and removing an error updates validation feedback
      Given a required form field without an error message
      When the form field renders
      And the application adds an "error" slot with text "First error"
      And the user focuses the form field control
      And the user leaves the form field control
      Then the form field control is described by "First error"
      And the form field error displays "First error"
      When the application replaces the "error" slot with text "Second error"
      Then the form field control is described by "Second error"
      And the form field control is not described by "First error"
      And the form field error displays "Second error"
      When the application removes the "error" slot
      Then the form field control is not described by "Second error"
      And the native validation message is visible and describes the control

    Scenario: Updating a forced error updates its description and native validity
      Given a form field with a manually forced error
      When the form field renders
      And the application changes the form field error text node to "Updated error"
      Then the form field control is described by "Updated error"
      And the form field control is not described by "Reference is invalid"
      And the form field native validation message is "Updated error"

    Scenario: Removing a valid field does not remove another field's shared error description
      Given an invalid and a valid form field with the same error text
      When the form field renders
      Then the form field control is described by "Shared error"
      When the application removes the valid form field
      Then the form field control is described by "Shared error"

    Scenario: Identical hint and error text remains described after validation
      Given a required form field with identical hint and error text
      When the form field renders
      And the user focuses the form field control
      And the user leaves the form field control
      Then the form field control is described by "Shared guidance"
      When the user enters "Ada" in the form field control
      And the user leaves the form field control
      Then the form field control is valid
      And the form field control is described by "Shared guidance"

    Scenario: Resetting a form clears displayed validation
      Given a required form field in a form
      When the form field renders
      And the user focuses the form field control
      And the user leaves the form field control
      Then the form field control is invalid
      When the application resets the form
      Then the form field control is valid
      And the form field hint is visible

  Rule: Required markers reflect the control

    Scenario: A required control shows a decorative required marker
      Given a required form field
      When the form field renders
      Then the form field is marked required
      And the required marker is visible and hidden from assistive technology
      And the form field control is accessible as "Name"

    Scenario: The required marker can be hidden without removing the requirement
      Given a required form field with the required marker hidden
      When the form field renders
      Then the form field is marked required
      And the form field has no required marker
      And the form field control is required

    Scenario: An optional control has no required marker
      Given an optional form field
      When the form field renders
      Then the form field is not marked required
      And the form field has no required marker

    Scenario: Changing the requirement updates the marker
      Given an optional form field
      When the form field renders
      And the application makes the form field control required
      Then the form field is marked required
      And the required marker is visible and hidden from assistive technology
      When the application makes the form field control optional
      Then the form field is not marked required
      And the form field has no required marker

  Rule: Form fields continue coordinating controls after DOM movement

    Scenario: Moving a form field preserves its control association and hint
      Given a form field with a hint
      When the form field renders
      And the application moves the form field to another parent
      Then the form field control is accessible as "Username"
      And the form field control is described by "Use at least 4 characters"
      When the user clicks the form field
      Then the form field control is focused
      When the user enters "Ada" in the form field control
      Then the form field label is floating

    Scenario: Moving an invalid form field preserves its validation feedback
      Given a required form field with hint and error
      When the form field renders
      And the user focuses the form field control
      And the user leaves the form field control
      And the application moves the form field to another parent
      Then the form field control is invalid
      And the form field error is visible
      And the form field control is described by "This field is required"
      When the user enters "Ada" in the form field control
      And the user leaves the form field control
      Then the form field control is valid
      And the form field hint is visible

    Scenario: Replacing a control transfers the field association
      Given a form field with a hint
      When the form field renders
      And the application replaces the form field control
      Then the new form field control is described by "Use at least 4 characters"
      And the removed form field control is not described by "Use at least 4 characters"
      When the user clicks the form field
      Then the new form field control is focused

    Scenario: Replacing an invalid control does not transfer its invalid state
      Given a required form field with hint and error
      When the form field renders
      And the user focuses the form field control
      And the user leaves the form field control
      And the application replaces the form field control
      Then the new form field control is described by "Helpful hint"
      And the form field control is valid
      And the form field error is hidden

    Scenario: Moving a field into a shadow root transfers its descriptions
      Given a form field with a hint
      When the form field renders
      And the application moves the form field into a shadow root
      Then the form field control is described by "Use at least 4 characters"
      And the original document has no form field description
      When the application moves the form field to another parent
      Then the form field control is described by "Use at least 4 characters"
      And the original shadow root has no form field description

    Scenario: Moving a field between forms transfers its reset listener
      Given a required form field in two forms
      When the form field renders
      And the application moves the form field to the second form
      And the user focuses the form field control
      And the user leaves the form field control
      Then the form field control is invalid
      When the application resets the first form
      Then the form field control is invalid
      When the application resets the second form
      Then the form field control is valid
