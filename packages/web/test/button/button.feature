Feature: Button
  The button provides accessible actions, form behavior, and configurable appearance.

  Rule: Button semantics and interaction

    Scenario: A button has an accessible name and can receive keyboard focus
      Given a filled button labeled "Save"
      When the button renders
      Then a button named "Save" is visible
      When keyboard focus moves to the button
      Then the button is focused

    Scenario: A toggle button changes its selected state and emits input events
      Given a toggle button labeled "Bold"
      When the button renders
      And the application records button input events
      And the user clicks the button
      Then its pressed state is "true"
      And its selected attribute is present
      And the input events are "beforeinput, input, change"
      When the user clicks the button
      Then its pressed state is "false"

    Scenario Outline: A toggle button responds to keyboard activation
      Given a toggle button labeled "Bold"
      When the button renders
      And keyboard focus moves to the button
      And the user presses "<key>" on the button
      Then its pressed state is "true"

      Examples:
        | key   |
        | Space |
        | Enter |

    Scenario: Canceling beforeinput prevents a toggle
      Given a toggle button labeled "Bold"
      When the button renders
      And the application records button input events and cancels beforeinput
      And the user clicks the button
      Then its pressed state is "false"
      And the input events are "beforeinput"

    Scenario: Programmatic toggle and selected changes update pressed semantics
      Given a toggle button labeled "Bold"
      When the button renders
      And the application sets selected to true
      Then its pressed state is "true"
      When the application sets toggle to false
      Then it has no pressed state
      When the application sets toggle to true
      Then its pressed state is "true"
      When the application sets selected to false
      Then its pressed state is "false"

    Scenario: A dynamically disabled button can be enabled again
      Given a toggle button labeled "Bold"
      When the button renders
      And the application sets disabled to true
      Then it has aria-disabled set to "true"
      When the application clicks the button programmatically
      Then its pressed state is "false"
      When the application sets disabled to false
      Then it no longer has aria-disabled
      When the user clicks the button
      Then its pressed state is "true"

    Scenario: A disabled button cannot be focused or toggled
      Given a disabled toggle button labeled "Bold"
      When the button renders
      Then it has aria-disabled set to "true"
      And it has no tabindex
      When the application clicks the button programmatically
      Then its pressed state is "false"

    Scenario: A disabled-interactive button can be focused but not toggled
      Given a disabled-interactive toggle button labeled "Bold"
      When the button renders
      Then it has aria-disabled set to "true"
      When keyboard focus moves to the button
      Then the button is focused
      When the user presses "Space" on the button
      Then its pressed state is "false"
      When the application clicks the button programmatically
      Then its pressed state is "false"

    Scenario: A selected toggle button shows its selected label
      Given a toggle button labeled "Start" with selected label "Stop"
      When the button renders
      And the user clicks the button
      Then a button named "Stop" is visible

    Scenario: A button's icons do not change its accessible name
      Given a button labeled "Open" with leading and trailing icons
      When the button renders
      Then a button named "Open" is visible
      And its leading and trailing icons are visible
      And no icon is exposed as an image

    Scenario: A toggle button switches and fills its selected icon
      Given a toggle button labeled "Start" with selected label "Stop", leading icon "play_arrow", and selected icon "stop"
      When the button renders
      Then the leading icon is visible
      And the selected icon is hidden
      When the user clicks the button
      Then the leading icon is hidden
      And the selected icon is visible and filled
      When the user clicks the button
      Then the leading icon is visible
      And the selected icon is hidden and not filled

    Scenario: A toggle button initialized as selected shows its selected label
      Given a selected toggle button labeled "Start" with selected label "Stop"
      When the button renders
      Then its pressed state is "true"
      And a button named "Stop" is visible
      When the user clicks the button
      Then its pressed state is "false"
      And a button named "Start" is visible

    Scenario: A reset button restores its form
      Given a reset form with a text field and a button
      When the form renders
      And the user changes the text field to "Changed"
      And the user clicks the button
      Then the text field value is "Original"

    Scenario: A disabled reset button leaves its form unchanged
      Given a disabled reset button with a text field in a form
      When the form renders
      And the user changes the text field to "Changed"
      And the application clicks the button programmatically
      Then the text field value is "Changed"

    Scenario: A submit button submits its name and value
      Given a form with a submit button named "action" and value "save"
      When the form renders
      And the application records form submission
      And the user clicks the button
      Then the form submission includes the button and its value

    Scenario: A disabled submit button does not submit its form
      Given a disabled submit button in a form
      When the form renders
      And the application records form submission
      And the application clicks the button programmatically
      Then no form submission occurs

    Scenario: Canceling a reset button click leaves the form unchanged
      Given a reset form with a text field and a button
      When the form renders
      And the user changes the text field to "Changed"
      And the application cancels button clicks
      And the user clicks the button
      And deferred button actions have completed
      Then the text field value is "Changed"

    Scenario: Canceling a submit button click prevents submission
      Given a form with a submit button named "action" and value "save"
      When the form renders
      And the application records form submission
      And the application cancels button clicks
      And the user clicks the button
      And deferred button actions have completed
      Then no form submission occurs

    Scenario: A button without a type does not submit its form
      Given a default-type button inside a form
      When the form renders
      And the application records form submission
      And the user clicks the button
      Then its effective type is "button"
      And no form submission occurs

    Scenario: A button with a destination is exposed as a link
      Given a link button labeled "Go to destination"
      When the button renders
      Then a link named "Go to destination" is visible

    Scenario: Activating a link button navigates to its destination
      Given a link button labeled "Go to destination"
      When the button renders
      And the user clicks the button
      Then the browser navigates to "#destination"

    Scenario: Adding and removing a destination updates button semantics
      Given a button labeled "Navigate" without a destination
      When the button renders
      Then a button named "Navigate" is visible
      When the application sets the destination to "#destination"
      Then a link named "Navigate" is visible
      When the user clicks the button
      Then the browser navigates to "#destination"
      When the application removes the destination
      Then a button named "Navigate" is visible
      And no link named "Navigate" is exposed
      When the application changes the browser fragment to "#other"
      And the user clicks the button
      And deferred button actions have completed
      Then the browser remains at "#other"

    Scenario: Changing a destination preserves an explicit custom role
      Given a button labeled "Navigate" with the custom role "menuitem"
      When the button renders
      And the application sets the destination to "#destination"
      Then the button retains the role "menuitem"
      When the application removes the destination
      Then the button retains the role "menuitem"

    Scenario Outline: Disabled link buttons do not navigate
      Given a "<disabled-state>" link button labeled "Go to destination"
      When the button renders
      And the application clicks the button programmatically
      And deferred button actions have completed
      Then the browser remains at ""

      Examples:
        | disabled-state       |
        | disabled             |
        | disabled-interactive |

    Scenario: A link button opens its destination in a new page
      Given a link button targeting a new page
      When the button renders
      And the user opens the link button
      Then the new page has the destination "#destination"

    Scenario: A link button downloads its destination
      Given a link button for a file named "report.txt"
      When the button renders
      And the user downloads the link button's destination
      Then the downloaded file is named "report.txt" and contains "Button download"

    Scenario: A link button forwards native link attributes
      Given a link button with target "_blank", rel "noopener", and download name "report.txt"
      When the button renders
      Then its internal link has target "_blank", rel "noopener", and download name "report.txt"
      And its internal link is hidden from assistive technology

    Scenario: Moving a toggle button to a new DOM parent preserves its behavior
      Given a toggle button labeled "Bold"
      When the button renders
      And the application records button input events
      And the application moves the button to a new DOM parent
      And the user clicks the button
      Then its pressed state is "true"
      And the input events are "beforeinput, input, change"

  Rule: Button appearance

    Scenario Outline: A button reflects a supported variant
      Given a button with variant "<variant>"
      When the button renders
      Then it reflects variant "<variant>"

      Examples:
        | variant  |
        | elevated |
        | filled   |
        | tonal    |
        | outlined |
        | text     |

    Scenario: An unknown variant falls back to text
      Given a button with variant "bogus"
      When the button renders
      Then it reflects variant "text"

    Scenario: A button defaults to small size and rounded shape
      Given a button with default appearance
      When the button renders
      Then its effective button size is "small"
      And its effective button shape is "rounded"

    Scenario: An unknown size falls back to small
      Given a button with size "bogus"
      When the button renders
      Then it reflects size "small"

    Scenario: An unknown shape falls back to rounded
      Given a button with shape "bogus"
      When the button renders
      Then it reflects shape "rounded"

    Scenario: Taller sizes render taller buttons
      Given buttons in every supported size
      When the buttons render
      Then each button is taller than the previous size

    Scenario: Square and rounded buttons have different corner radii
      Given rounded and square filled buttons
      When the buttons render for shape comparison
      Then their corner radii are different

    Scenario: A rounded button is fully rounded
      Given a rounded filled button
      When the button renders
      Then its corner radius is at least half its height

    Scenario Outline: Density changes visual height without shrinking the touch target
      Given buttons at every density for size "<size>"
      When the buttons render at every density
      Then each density step increases visual height
      And every density button keeps a 48 by 48 pixel touch target

      Examples:
        | size        |
        | extra-small |
        | small       |
