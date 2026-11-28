Feature: Split pane
  Split panes divide content accessibly and support keyboard, pointer, and programmatic resizing.

  Rule: The separator exposes the pane size and orientation

    Scenario: The separator exposes default label and values

      Given a split pane
      When the split pane renders
      Then the separator is visible with default label and values

    Scenario: The separator uses a custom label

      Given a split pane with a custom label
      When the split pane renders
      Then the separator is named "Sidebar width"

    Scenario: The separator reflects the value attribute

      Given a split pane with value 30
      When the split pane renders
      Then the separator reports value 30 and its pane proportions

    Scenario: The separator describes collapsed panes

      Given a split pane with value 0
      When the split pane renders
      Then the separator describes the left pane as collapsed
      When the application changes the split pane value to 100
      Then the separator describes the right pane as collapsed

    Scenario: A vertical split pane uses horizontal separator orientation

      Given a vertical split pane with value 25
      When the split pane renders
      Then the separator reports vertical pane proportions

    Scenario: An invalid orientation falls back to horizontal

      Given a split pane with invalid orientation
      When the split pane renders
      Then the split pane orientation is "horizontal"

    Scenario: A custom formatter provides accessible value text

      Given a split pane
      When the split pane renders
      And the application sets a custom value formatter and value 40
      Then the separator value text is "40 percent"

    Scenario: A formatter can omit accessible value text

      Given a split pane
      When the split pane renders
      And the application sets a value formatter that returns no text
      Then the separator has no value text

    Scenario: RTL changes horizontal value text to logical pane proportions

      Given a split pane in RTL with value 30
      When the split pane renders
      Then the separator value text is "Left pane 70%, right pane 30%"

  Rule: Keyboard input resizes within limits and follows detents

    Scenario: Arrow keys adjust the value by step and raise events

      Given a split pane with value 50
      When the split pane renders and records resize events
      And the user presses ArrowRight and ArrowLeft twice on the split pane
      Then the split pane value is 49
      And resize events include beforeinput, input, and change

    Scenario: Home and End move to the minimum and maximum

      Given a split pane with value 50, minimum 20, and maximum 80
      When the split pane renders
      And the user presses End and Home on the split pane
      Then the split pane value is 20

    Scenario: Home and End target the available detents

      Given a split pane with value 50, minimum 20, maximum 80, and detents "0 20 50 80 100"
      When the split pane renders
      And the user presses End and Home on the split pane
      Then the split pane value is 20

    Scenario: PageUp and PageDown move by at least ten

      Given a split pane with value 50
      When the split pane renders
      And the user presses PageDown and PageUp twice on the split pane
      Then the split pane value is 40

    Scenario: Keyboard changes clamp to the minimum and maximum

      Given a split pane with value 21, minimum 20, and maximum 80
      When the split pane renders
      And the user presses ArrowLeft twice on the split pane
      Then the split pane value is 20

    Scenario: Cancelling beforeinput prevents a keyboard change

      Given a split pane with value 50
      When the split pane renders and cancels beforeinput
      And the user presses "ArrowRight" on the split pane
      Then the split pane value is 50

    Scenario: Arrow keys move between detents

      Given a split pane with value 50 and detents "0 25 50 75 100"
      When the split pane renders
      And the user presses ArrowRight and ArrowLeft twice on the split pane
      Then the split pane value is 25

    Scenario: Enter cycles detents and wraps when enabled

      Given a split pane with value 0, detents "0 50 100", and wrapping
      When the split pane renders
      And the user presses Enter three times on the split pane
      Then the split pane value is 0

    Scenario: Enter does not wrap by default

      Given a split pane with value 100 and detents "0 50 100"
      When the split pane renders
      And the user presses Enter on the split pane
      Then the split pane value is 100

    Scenario: Space cycles to the next detent

      Given a split pane with value 0 and detents "0 50 100"
      When the split pane renders
      And the user presses Space on the split pane
      Then the split pane value is 50

    Scenario: Keyboard navigation skips invalid detents

      Given a split pane with value 25 and detents "invalid 25 75"
      When the split pane renders
      And the user presses "ArrowRight" on the split pane
      Then the split pane value is 75

    Scenario: RTL reverses horizontal arrow-key resizing

      Given a split pane in RTL with value 50
      When the split pane renders
      And the user presses "ArrowRight" on the split pane
      Then the split pane value is 49

    Scenario: Vertical arrow keys resize along the vertical axis

      Given a vertical split pane with value 50
      When the split pane renders
      And the user presses ArrowDown and ArrowUp on the split pane
      Then the split pane value is 50

    Scenario: A custom step controls keyboard increments

      Given a split pane with value 50 and step 10
      When the split pane renders
      And the user presses ArrowRight and ArrowLeft on the split pane
      Then the split pane value is 50

  Rule: Programmatic resizing and pointer gestures honor detents and bounds

    Scenario: Collapse and expand move to the minimum and maximum

      Given a split pane with value 50, minimum 10, and maximum 90
      When the split pane renders
      And the application collapses and expands the split pane
      Then the split pane value is 90

    Scenario: snapToValue chooses the closest detent

      Given a split pane with value 50 and detents "0 25 75"
      When the split pane renders
      And the application snaps the split pane to 70
      Then the split pane value is 75

    Scenario: Pixel detents are converted to a percentage of the width

      Given a split pane with value 50 and detents "100px 300px"
      When the split pane renders
      And the application snaps the split pane to 0
      Then the split pane value is 25

    Scenario: Pixel detents use the vertical pane dimension

      Given a vertical split pane with value 50 and pixel detents "50px 150px"
      When the split pane renders
      And the application snaps the split pane to 0
      Then the split pane value is 25

    Scenario: Dragging the handle changes the value and raises change

      Given a split pane with value 50
      When the split pane renders and records resize events
      And the user drags the split pane handle 40 pixels "right"
      Then the split pane value is greater than 55
      And one change event was raised

    Scenario: Dragging past the maximum settles at the maximum

      Given a split pane with maximum 70 and value 50
      When the split pane renders
      And the user drags the split pane handle 100 pixels "right"
      Then the split pane value is 70

    Scenario: Dragging below the minimum settles at the minimum

      Given a split pane with value 50, minimum 30, and maximum 80
      When the split pane renders
      And the user drags the split pane handle 100 pixels "left"
      Then the split pane value is 30

    Scenario: Dragging settles at the closest detent

      Given a split pane with value 50 and detents "0 25 75 100"
      When the split pane renders
      And the user drags the split pane handle 40 pixels "right"
      Then the split pane value is 75

    Scenario: Dragging follows the vertical orientation

      Given a vertical split pane with value 50
      When the split pane renders
      And the user drags the split pane handle 40 pixels "down"
      Then the split pane value is 70

    Scenario: Dragging in RTL reverses horizontal resizing

      Given a split pane in RTL with value 50
      When the split pane renders
      And the user drags the split pane handle 40 pixels "right"
      Then the split pane value is 40

    Scenario: Cancelling beforeinput prevents a drag change

      Given a split pane with value 50
      When the split pane renders and cancels beforeinput
      And the user drags the split pane handle 40 pixels "right"
      Then the split pane value is 50

  Rule: Pane visibility controls the resize handle

    Scenario: A disabled split pane removes the handle from the tab order

      Given a disabled split pane
      When the split pane renders
      Then the separator is disabled and not tabbable

    Scenario: A disabled split pane ignores dragging

      Given a disabled split pane with value 50
      When the split pane renders
      And the user drags the split pane handle 60 pixels "right"
      Then the split pane value is 50

    Scenario: Disabling a split pane at runtime prevents keyboard resizing

      Given a split pane with value 50
      When the split pane renders
      And the application disables resizing
      Then the separator is disabled and not tabbable
      When the user presses "ArrowRight" on the split pane
      Then the split pane value is 50

    Scenario: The handle is hidden when there is only one pane

      Given a split pane without an end pane
      When the split pane renders
      Then the separator is hidden

    Scenario: Hiding the end pane hides the handle

      Given a split pane
      When the split pane renders
      And the application hides the end pane
      Then the separator is hidden

    Scenario: Restoring the end pane restores the handle

      Given a split pane
      When the split pane renders
      And the application hides the end pane
      Then the separator is hidden
      When the application restores the end pane
      Then the separator is visible

    Scenario: Hiding and restoring the start pane updates the handle

      Given a split pane
      When the split pane renders
      And the application hides the start pane
      Then the separator is hidden
      When the application restores the start pane
      Then the separator is visible

    Scenario: Adding an end pane reveals the handle

      Given a split pane without an end pane
      When the split pane renders
      Then the separator is hidden
      When the application adds an end pane
      Then the separator is visible

  Rule: Orientation and form association stay synchronized

    Scenario: Auto orientation follows the viewport width

      Given a narrow split-pane viewport and an auto-orientation split pane
      When the split pane renders
      Then the separator has horizontal orientation
      When the split-pane viewport widens
      Then the separator has vertical orientation
      When the split-pane viewport narrows
      Then the separator has horizontal orientation

    Scenario: Changing orientation updates the separator

      Given a split pane
      When the split pane renders
      And the application changes the orientation to "vertical"
      Then the separator has horizontal orientation
      When the application changes the orientation to "horizontal"
      Then the separator has vertical orientation

    Scenario: Resetting a form restores the initial split value

      Given a split pane in a form with initial value 35
      When the split pane renders
      And the application changes the split pane value to 60
      And the application resets the split-pane form
      Then the split pane value is 35

    Scenario: A disabled fieldset disables the split pane form control

      Given a split pane in a disabled fieldset
      When the split pane renders
      Then the separator is disabled and not tabbable
      And the split pane is omitted from form data

    Scenario: A split pane participates in form submission

      Given a split pane in a form with initial value 35
      When the split pane renders
      Then the split pane form value is "35"

    Scenario: Snap changes animate when reduced motion is not preferred

      Given a split pane
      When the split pane renders with motion enabled
      And the application snaps the split pane to 75
      Then the split pane snap animation runs
      And the split pane value is eventually 75
