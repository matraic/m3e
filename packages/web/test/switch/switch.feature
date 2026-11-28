Feature: Switch
  A switch exposes an on/off state, supports user activation, and participates in forms.

  Rule: A switch supports labels and user activation

    Scenario: A labeled switch is focusable and initially unchecked
      Given a switch wrapped in its Wi-Fi label
      When the switch renders
      Then a switch named "Wi-Fi" is visible
      And the switch exposes checked state "false"
      When the user presses "Tab" on the switch
      Then the switch has keyboard focus

    Scenario: Clicking the label toggles the switch
      Given a switch wrapped in its Wi-Fi label
      When the switch renders
      And the user clicks the Wi-Fi switch label
      Then the switch is checked
      When the user clicks the Wi-Fi switch label
      Then the switch is unchecked

    Scenario: Pointer activation toggles state and emits ordered events
      Given an unchecked switch
      When the switch renders
      And the application observes switch events
      And the user clicks the switch
      Then the switch exposes checked state "true"
      When the user clicks the switch
      Then the switch exposes checked state "false"
      And the switch events are "beforeinput, input, change, beforeinput, input, change"

    Scenario: Canceling beforeinput prevents a change
      Given an unchecked switch
      When the switch renders
      And the application cancels switch beforeinput
      And the user clicks the switch
      Then the switch is unchecked
      And the switch events are "beforeinput"

    Scenario: Enter and Space toggle the switch
      Given an unchecked switch
      When the switch renders
      And the user focuses the switch
      And the user presses "Enter" on the switch
      Then the switch is checked
      When the user presses "Space" on the switch
      Then the switch is unchecked

    Scenario: An initially checked switch exposes its state
      Given a checked switch
      When the switch renders
      Then the switch exposes checked state "true"

    Scenario: A disabled switch is not focusable and does not toggle
      Given a disabled switch
      When the switch renders
      And the application observes switch events
      Then the switch exposes disabled state
      And the switch is not keyboard focusable
      When the application clicks the switch
      Then the switch is unchecked
      And the switch events are ""

  Rule: Accessible state and feedback remain synchronized

    Scenario Outline: Native labels name and activate the switch
      Given a switch with a native "<association>" Wi-Fi label
      When the switch renders
      Then the switch has native accessible name "Wi-Fi"
      When the user clicks the Wi-Fi switch label
      Then the switch is checked
      And the switch exposes checked state "true"

      Examples:
        | association |
        | wrapping    |
        | explicit    |

    Scenario: Programmatic checked changes update accessibility without user events
      Given an unchecked switch
      When the switch renders
      And the application observes switch events
      And the application sets the switch checked property to "true"
      Then the switch is checked
      And the switch exposes checked state "true"
      When the application sets the switch checked property to "false"
      Then the switch is unchecked
      And the switch exposes checked state "false"
      And the switch events are ""

    Scenario: Re-enabling a switch restores keyboard activation
      Given a disabled switch
      When the switch renders
      And the application enables the switch
      Then the switch is keyboard focusable
      And the switch is not exposed as disabled
      When the user presses "Tab" on the switch
      Then the switch has keyboard focus
      When the user presses "Space" on the switch
      Then the switch is checked
      And the switch exposes checked state "true"

    Scenario: Forced colors distinguish checked, unchecked, and disabled switches
      Given an unchecked switch
      And forced colors are active for switches
      When the switch renders
      Then the switch track uses the "ButtonText" system color for its "border"
      When the user clicks the switch
      Then the switch track uses the "ButtonText" system color for its "background"
      When the application disables the switch
      Then the switch track uses the "GrayText" system color for its "background"

  Rule: Icons can be configured

    Scenario: Icons default to none and invalid values fall back to none
      Given switches with default and invalid icons
      When the switch renders
      Then the default switch has icons "none"
      And the invalid switch reflects icons "none"

    Scenario Outline: Supported icon modes are accepted
      Given a switch with icons "<icons>"
      When the switch renders
      Then the switch has icons "<icons>"

      Examples:
        | icons    |
        | none     |
        | selected |
        | both     |

    Scenario Outline: Icon visibility follows selection and disabled state
      Given a switch with icons "<icons>"
      And switch icon motion is disabled
      When the switch renders
      Then the visible switch icon is "<unchecked>"
      When the user clicks the switch
      Then the visible switch icon is "<checked>"
      When the application disables the switch
      Then the visible switch icon is "<checked>"
      When the application sets the switch checked property to "false"
      Then the visible switch icon is "none"

      Examples:
        | icons    | unchecked  | checked  |
        | none     | none       | none     |
        | selected | none       | selected |
        | both     | unselected | selected |

  Rule: A switch participates in forms

    Scenario: Only a checked switch submits its name and value
      Given a switch named "wifi" with value "yes" in a form
      When the switch renders
      Then the switch form has no values
      When the user clicks the switch
      Then the switch form includes "wifi" with value "yes"
      When the user clicks the switch
      Then the switch form has no values

    Scenario: A checked switch submits the default value
      Given a checked switch named "wifi" without an explicit value in a form
      When the switch renders
      Then the switch form includes "wifi" with value "on"

    Scenario: A disabled switch is not submitted
      Given a checked disabled switch named "wifi" in a form
      When the switch renders
      Then the switch form has no values

    Scenario: Form reset restores the initially checked state
      Given an initially checked switch in a form
      When the switch renders
      And the user clicks the switch
      Then the switch is unchecked
      When the user resets the switch form
      Then the switch is checked

    Scenario: Form reset restores the initially unchecked state
      Given an initially unchecked switch in a form
      When the switch renders
      And the user clicks the switch
      Then the switch is checked
      When the user resets the switch form
      Then the switch is unchecked
      And the switch exposes checked state "false"

    Scenario: A disabled fieldset disables and excludes its switch
      Given a checked switch in a disabled fieldset
      When the switch renders
      Then the switch exposes disabled state
      And the switch is not keyboard focusable
      And the switch form has no values
      When the application enables the switch fieldset
      Then the switch is keyboard focusable
      And the switch is not exposed as disabled
      And the switch form includes "wifi" with value "yes"

    Scenario: Moving between forms transfers the switch value
      Given a checked switch with a destination form
      When the switch renders
      Then the switch form includes "wifi" with value "yes"
      When the application moves the switch to its destination form
      Then the switch form has no values
      And the destination switch form includes "wifi" with value "yes"
      When the user clicks the switch
      Then the destination switch form has no values

  Rule: Switch interactions remain reliable after lifecycle changes

    Scenario: Reconnecting a switch preserves its state and handles activation once
      Given an unchecked switch
      When the switch renders
      And the user clicks the switch
      And the application observes switch events
      And the application reconnects the switch
      Then the switch is checked
      And the switch exposes checked state "true"
      When the user clicks the switch
      Then the switch is unchecked
      And the switch events are "beforeinput, input, change"

    Scenario: Canceling a click prevents activation
      Given an unchecked switch
      When the switch renders
      And the application observes switch events
      And the application cancels the next switch click
      And the user clicks the switch
      Then the switch is unchecked
      And the switch events are ""
      When the user clicks the switch
      Then the switch is checked
      And the switch events are "beforeinput, input, change"

    Scenario: A native label provides hover and pressed feedback
      Given a switch with a native "wrapping" Wi-Fi label
      When the switch renders
      And the user hovers the Wi-Fi switch label
      Then the switch shows hover feedback
      When the user presses the Wi-Fi switch label
      Then the switch shows pressed feedback
      When the user releases the Wi-Fi switch label
      Then the switch no longer shows pressed feedback
      And the switch is checked
      When the user moves away from the Wi-Fi switch label
      Then the switch no longer shows hover feedback
