Feature: Icon button
  The icon button provides accessible actions, form behavior, and configurable appearance.

  Rule: Icon button semantics and interaction

    Scenario: An icon button has an accessible name and can receive keyboard focus

      Given an icon button with variant "filled" labelled "Save"
      When the icon button renders
      Then an icon button named "Save" is visible
      When keyboard focus moves to the icon button
      Then the icon button is focused

    Scenario: An icon button uses a referenced label and hides its icon from assistive technology

      Given an icon button labelled by referenced text "Copy" with icon "content_copy"
      When the icon button renders
      Then an icon button named "Copy" is visible
      And no icon button icon is exposed as an image

    Scenario: A toggle icon button changes selected state and emits input events

      Given a toggle icon button labelled "Bold"
      When the icon button renders
      And the application records icon button input events
      And the user clicks the icon button
      Then the icon button's pressed state is "true"
      And the icon button has its selected attribute
      And icon button input events are "beforeinput, input, change"
      When the user clicks the icon button
      Then the icon button's pressed state is "false"

    Scenario Outline: A toggle icon button responds to keyboard activation

      Given a toggle icon button labelled "Bold"
      When the icon button renders
      And keyboard focus moves to the icon button
      And the user presses "<key>" on the icon button
      Then the icon button's pressed state is "true"

      Examples:
        | key   |
        | Space |
        | Enter |

    Scenario: A radio toggle icon button exposes checked instead of pressed state

      Given a radio toggle icon button labelled "Option"
      When the icon button renders
      Then the radio icon button checked state is "false"
      And the radio icon button has no pressed state
      When the user clicks the icon button
      Then the radio icon button checked state is "true"
      And the radio icon button has no pressed state

    Scenario: Canceling beforeinput prevents a toggle

      Given a toggle icon button labelled "Bold"
      When the icon button renders
      And the application records icon button input events and cancels beforeinput
      And the user clicks the icon button
      Then the icon button's pressed state is "false"
      And icon button input events are "beforeinput"

    Scenario: Programmatic toggle and selected changes update pressed semantics

      Given a toggle icon button labelled "Bold"
      When the icon button renders
      And the application sets icon button selected state to true
      Then the icon button's pressed state is "true"
      When the application sets icon button toggle state to false
      Then the icon button has no pressed state
      When the application sets icon button toggle state to true
      Then the icon button's pressed state is "true"
      When the application sets icon button selected state to false
      Then the icon button's pressed state is "false"

    Scenario: A dynamically disabled icon button can be enabled again

      Given a toggle icon button labelled "Bold"
      When the icon button renders
      And the application sets icon button disabled state to true
      Then the icon button has aria-disabled set to "true"
      When the application clicks the icon button programmatically
      Then the icon button's pressed state is "false"
      When the application sets icon button disabled state to false
      Then the icon button no longer has aria-disabled
      When the user clicks the icon button
      Then the icon button's pressed state is "true"

    Scenario: A disabled icon button cannot be focused or toggled

      Given a disabled toggle icon button labelled "Bold"
      When the icon button renders
      Then the icon button has aria-disabled set to "true"
      And the icon button has no tabindex
      When the application clicks the icon button programmatically
      Then the icon button's pressed state is "false"

    Scenario: A disabled-interactive icon button can be focused but not toggled

      Given a disabled-interactive toggle icon button labelled "Bold"
      When the icon button renders
      Then the icon button has aria-disabled set to "true"
      When keyboard focus moves to the icon button
      Then the icon button is focused
      When the user presses "Space" on the icon button
      Then the icon button's pressed state is "false"
      When the application clicks the icon button programmatically
      Then the icon button's pressed state is "false"

    Scenario: A toggle icon button fills its icon when selected

      Given a toggle icon button labelled "Favorite" with icon "favorite"
      When the icon button renders
      When keyboard focus moves to the icon button
      And the user presses "Space" on the icon button
      Then the icon button's pressed state is "true"
      And its icon is filled
      When the user presses "Space" on the icon button
      Then the icon button's pressed state is "false"
      And its icon is not filled

    Scenario: A toggle icon button swaps to its selected icon

      Given a toggle icon button labelled "Favorite" with unselected icon "favorite_border" and selected icon "favorite"
      When the icon button renders
      Then the unselected icon is visible
      And the icon button's selected icon is hidden
      When the user clicks the icon button
      Then the unselected icon is hidden
      And the icon button's selected icon is visible and filled
      When the user clicks the icon button
      Then the unselected icon is visible
      And the icon button's selected icon is hidden and not filled

    Scenario: Moving a toggle icon button to a new DOM parent preserves its behavior

      Given a toggle icon button labelled "Bold"
      When the icon button renders
      And the application records icon button input events
      And the application moves the icon button to a new DOM parent
      And the user clicks the icon button
      Then the icon button's pressed state is "true"
      And icon button input events are "beforeinput, input, change"

  Rule: Icon button form behavior

    Scenario: A reset icon button restores its form

      Given a reset form with a text field and an icon button
      When the icon button renders
      And the user changes the icon button form field to "Changed"
      And the user clicks the icon button
      Then the icon button form field value is "Original"

    Scenario: A disabled reset icon button leaves its form unchanged

      Given a disabled reset icon button with a text field in a form
      When the icon button renders
      And the user changes the icon button form field to "Changed"
      And the application clicks the icon button programmatically
      Then the icon button form field value is "Changed"

    Scenario: A submit icon button submits its name and value

      Given a form with a submit icon button named "action" and value "save"
      When the icon button renders
      And the application records the icon button form submission
      And the user clicks the icon button
      Then the form submission includes the icon button and its value

    Scenario: A disabled submit icon button does not submit its form

      Given a disabled submit icon button in a form
      When the icon button renders
      And the application records the icon button form submission
      And the application clicks the icon button programmatically
      Then no icon button form submission occurs

    Scenario: An icon button without a type does not submit its form

      Given a default-type icon button inside a form
      When the icon button renders
      And the application records the icon button form submission
      And the user clicks the icon button
      Then the icon button's effective type is "button"
      And no icon button form submission occurs

    Scenario: Canceling a reset icon button click leaves the form unchanged

      Given a reset form with a text field and an icon button
      When the icon button renders
      And the user changes the icon button form field to "Changed"
      And the application cancels icon button clicks
      And the user clicks the icon button
      And deferred icon button actions have completed
      Then the icon button form field value is "Changed"

    Scenario: Canceling a submit icon button click prevents submission

      Given a form with a submit icon button named "action" and value "save"
      When the icon button renders
      And the application records the icon button form submission
      And the application cancels icon button clicks
      And the user clicks the icon button
      And deferred icon button actions have completed
      Then no icon button form submission occurs

  Rule: Icon button links

    Scenario: An icon button with a destination is exposed as a link

      Given an icon button labelled "Go to destination" with destination "#destination"
      When the icon button renders
      Then an icon button link named "Go to destination" is visible

    Scenario: Activating a link icon button navigates to its destination

      Given an icon button labelled "Go to destination" with destination "#destination"
      When the icon button renders
      And the user clicks the icon button
      Then the icon button browser navigates to "#destination"

    Scenario: Adding and removing a destination updates icon button semantics

      Given an icon button labelled "Navigate" without a destination
      When the icon button renders
      Then an icon button named "Navigate" is visible
      When the application sets the icon button destination to "#destination"
      Then an icon button link named "Navigate" is visible
      When the user clicks the icon button
      Then the icon button browser navigates to "#destination"
      When the application removes the icon button destination
      Then an icon button named "Navigate" is visible
      And no icon button link named "Navigate" is exposed

    Scenario: A custom role is preserved when the destination changes

      Given an icon button labelled "Navigate" with the custom role "menuitem"
      When the icon button renders
      And the application sets the icon button destination to "#destination"
      Then the icon button retains the role "menuitem"
      When the application removes the icon button destination
      Then the icon button retains the role "menuitem"

    Scenario Outline: Disabled link icon buttons do not navigate

      Given a "<disabled-state>" link icon button labelled "Go to destination"
      When the icon button renders
      And the application clicks the icon button programmatically
      And deferred icon button actions have completed
      Then the icon button browser remains at ""

      Examples:
        | disabled-state       |
        | disabled             |
        | disabled-interactive |

    Scenario: A link icon button forwards native link attributes

      Given a link icon button targeting "_blank", rel "noopener", and download name "report.txt"
      When the icon button renders
      Then the icon button's internal link has target "_blank", rel "noopener", and download name "report.txt"
      And the icon button's internal link is hidden from assistive technology

  Rule: Icon button appearance

    Scenario Outline: An icon button reflects a supported variant

      Given an icon button with variant "<variant>"
      When the icon button renders
      Then the icon button reflects variant "<variant>"

      Examples:
        | variant  |
        | elevated |
        | filled   |
        | outlined |
        | standard |
        | tonal    |

    Scenario: An icon button defaults to standard variant, small size, rounded shape, and default width

      Given an icon button with default appearance
      When the icon button renders
      Then its effective appearance is standard, small, rounded, and default

    Scenario: Unsupported appearance values fall back to defaults

      Given an icon button with unsupported appearance values
      When the icon button renders
      Then the icon button reflects variant "standard"
      And the icon button reflects size "small"
      And the icon button reflects shape "rounded"
      And the icon button reflects width "default"

    Scenario Outline: An icon button reflects a supported size

      Given an icon button with size "<size>"
      When the icon button renders
      Then the icon button reflects size "<size>"

      Examples:
        | size        |
        | extra-small |
        | small       |
        | medium      |
        | large       |
        | extra-large |

    Scenario Outline: An icon button reflects a supported shape

      Given an icon button with shape "<shape>"
      When the icon button renders
      Then the icon button reflects shape "<shape>"

      Examples:
        | shape   |
        | rounded |
        | square  |

    Scenario Outline: An icon button reflects a supported width

      Given an icon button with width "<width>"
      When the icon button renders
      Then the icon button reflects width "<width>"

      Examples:
        | width   |
        | default |
        | narrow  |
        | wide    |

    Scenario: Every icon button size preserves a 48 by 48 pixel touch target

      Given icon buttons in every supported size
      When the icon buttons render
      Then every icon button keeps a 48 by 48 pixel touch target
