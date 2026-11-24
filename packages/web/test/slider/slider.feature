Feature: Slider
  Sliders let users select a value or a range with accessible thumbs.

  Rule: Thumbs expose accessible value semantics

    Scenario: A thumb exposes its name, value, bounds, and orientation

      Given a single slider
      When the slider renders
      Then slider thumb "Volume" exposes minimum 0, maximum 100, and value 50
      And slider thumb "Volume" exposes orientation "horizontal"

    Scenario: Custom bounds are exposed

      Given a single slider with attributes 'min="10" max="20"' and value 15
      When the slider renders
      Then slider thumb "Volume" exposes minimum 10, maximum 20, and value 15

    Scenario: Range thumbs are bounded by their neighbors

      Given a range slider
      When the slider renders
      Then slider thumb "Minimum" exposes minimum 0, maximum 75, and value 25
      And slider thumb "Maximum" exposes minimum 25, maximum 100, and value 75

    Scenario: Vertical sliders expose their orientation

      Given a single slider with attributes 'orientation="vertical"' and value 40
      When the slider renders
      Then slider thumb "Volume" exposes orientation "vertical"

    Scenario: A thumb supports an external accessible label and value text

      Given a slider labelled by external text with an accessible value description
      When the slider renders
      Then slider thumb "Playback volume" exposes minimum 0, maximum 100, and value 50
      And slider thumb "Playback volume" exposes value text "Half volume"

    Scenario: Range thumbs are separate tab stops in DOM order

      Given a range slider
      When the slider renders
      And the user focuses the control before the slider
      And the user presses slider key "Tab"
      Then slider thumb "Minimum" is focused
      When the user presses slider key "Tab"
      Then slider thumb "Maximum" is focused
      When the user presses slider key "Tab"
      Then focus moves past the slider

    Scenario: Disabled thumbs are skipped by keyboard navigation

      Given a single slider with attributes 'disabled' and value 50
      When the slider renders
      Then slider thumb "Volume" is exposed as disabled
      When the user focuses the control before the slider
      And the user presses slider key "Tab"
      Then focus moves past the slider

    Scenario: Keyboard focus shows a ring but pointer focus does not

      Given a single slider
      When the slider renders
      And the user focuses the control before the slider
      And the user presses slider key "Tab"
      Then slider thumb "Volume" has a visible focus ring
      When the user clicks slider value 80 beside thumb "Volume"
      Then slider thumb "Volume" is focused
      And slider thumb "Volume" has no visible focus ring

    Scenario: Forced colors preserve the keyboard focus indicator

      Given forced colors are active for sliders
      And a single slider
      When the slider renders
      And the user focuses the control before the slider
      And the user presses slider key "Tab"
      Then slider thumb "Volume" has a visible focus ring

    Scenario: Re-enabling a slider restores keyboard access

      Given a single slider with attributes 'disabled' and value 50
      When the slider renders
      And the application enables the slider
      And the user focuses the control before the slider
      And the user presses slider key "Tab"
      Then slider thumb "Volume" is focused
      When the user presses slider key "ArrowRight"
      Then slider thumb "Volume" has value 51

  Rule: Keyboard interaction respects steps and bounds

    Scenario Outline: An unset thumb starts keyboard interaction from its accessible minimum

      Given a single slider without a thumb value and minimum <minimum>
      When the slider renders
      Then slider thumb "Volume" exposes minimum <minimum>, maximum 100, and value <minimum>
      When the user focuses slider thumb "Volume"
      And the user presses slider key "ArrowRight"
      Then slider thumb "Volume" has value <value>

      Examples:
        | minimum | value |
        | 0       | 1     |
        | 10      | 11    |

    Scenario: An unset upper thumb starts keyboard interaction from its neighbor

      Given a range slider without an upper thumb value
      When the slider renders
      Then slider thumb "Maximum" exposes minimum 25, maximum 100, and value 25
      When the user focuses slider thumb "Maximum"
      And the user presses slider key "ArrowRight"
      Then slider thumb "Maximum" has value 26
      And slider thumb "Minimum" has value 25

    Scenario: Arrow keys change the value by one step

      Given a single slider
      When the slider renders
      And the user focuses slider thumb "Volume"
      And the user presses slider key "ArrowRight"
      Then slider thumb "Volume" has value 51
      When the user presses slider key "ArrowUp"
      Then slider thumb "Volume" has value 52
      When the user presses slider key "ArrowLeft"
      And the user presses slider key "ArrowDown"
      Then slider thumb "Volume" has value 50

    Scenario: A custom step controls keyboard increments

      Given a single slider with attributes 'step="5"' and value 50
      When the slider renders
      And the user focuses slider thumb "Volume"
      And the user presses slider key "ArrowRight"
      Then slider thumb "Volume" has value 55

    Scenario: Home, End, and page keys jump through values

      Given a single slider
      When the slider renders
      And the user focuses slider thumb "Volume"
      And the user presses slider key "Home"
      Then slider thumb "Volume" has value 0
      When the user presses slider key "PageUp"
      Then slider thumb "Volume" has value 10
      When the user presses slider key "PageDown"
      Then slider thumb "Volume" has value 0
      When the user presses slider key "End"
      Then slider thumb "Volume" has value 100

    Scenario Outline: Arrow keys cannot exceed either bound

      Given a single slider with attributes '' and value <value>
      When the slider renders
      And the user focuses slider thumb "Volume"
      And the user presses slider key "<key>"
      Then slider thumb "Volume" has value <value>

      Examples:
        | value | key        |
        | 100   | ArrowRight |
        | 0     | ArrowLeft  |

    Scenario Outline: Page keys honor custom steps and direction

      Given a slider with step <step> and direction "<direction>"
      When the slider renders
      And the user focuses slider thumb "Volume"
      And the user presses slider key "<key>"
      Then slider thumb "Volume" has value <value>

      Examples:
        | step | direction | key      | value |
        | 5    | ltr       | PageUp   | 55    |
        | 5    | ltr       | PageDown | 45    |
        | 5    | rtl       | PageUp   | 45    |
        | 5    | rtl       | PageDown | 55    |
        | 1    | rtl       | PageUp   | 40    |
        | 1    | rtl       | PageDown | 60    |

    Scenario: Space does not change the value or scroll the page

      Given a single slider on a scrollable page
      When the slider renders
      And the application observes slider events
      And the user focuses slider thumb "Volume"
      And the application observes Space scrolling
      And the user presses slider key "Space"
      Then slider thumb "Volume" has value 50
      And the slider events are ""
      And Space scrolling was prevented

    Scenario Outline: Range thumbs cannot cross their neighbor

      Given a range slider
      When the slider renders
      And the user focuses slider thumb "<thumb>"
      And the user presses slider key "<key>"
      Then slider thumb "<thumb>" has value <value>

      Examples:
        | thumb   | key  | value |
        | Minimum | End  | 75    |
        | Maximum | Home | 25    |

    Scenario Outline: Keyboard direction follows the slider axis

      Given a single slider with orientation "<orientation>" and direction "<direction>"
      When the slider renders
      And the user focuses slider thumb "Volume"
      And the user presses slider key "<key>"
      Then slider thumb "Volume" has value <value>

      Examples:
        | orientation | direction | key        | value |
        | horizontal  | rtl       | ArrowRight | 49    |
        | horizontal  | rtl       | ArrowLeft  | 51    |
        | vertical    | ltr       | ArrowUp    | 51    |
        | vertical    | rtl       | ArrowUp    | 51    |
        | vertical    | rtl       | ArrowDown  | 49    |

  Rule: Input events can be observed and canceled

    Scenario: Keyboard input commits on key release

      Given a single slider
      When the slider renders
      And the application observes slider events
      And the user focuses slider thumb "Volume"
      And the user holds slider key "ArrowRight"
      Then the slider events are "beforeinput,input"
      When the user releases slider key "ArrowRight"
      Then the slider events are "beforeinput,input,change"

    Scenario: Canceling beforeinput prevents a keyboard change

      Given a single slider
      When the slider renders
      And the application cancels slider beforeinput
      And the user focuses slider thumb "Volume"
      And the user presses slider key "ArrowRight"
      Then slider thumb "Volume" has value 50
      And the slider events are "beforeinput"

    Scenario: An unchanged value dispatches no input events

      Given a single slider with attributes '' and value 0
      When the slider renders
      And the application observes slider events
      And the user focuses slider thumb "Volume"
      And the user presses slider key "Home"
      Then the slider events are ""

    Scenario: Canceling beforeinput prevents a track click change

      Given a single slider
      When the slider renders
      And the application cancels slider beforeinput
      And the user clicks slider value 80 beside thumb "Volume"
      Then slider thumb "Volume" has value 50
      And the slider events are "beforeinput"

  Rule: Pointer interaction selects and drags values

    Scenario: A track click initializes an unset thumb

      Given a single slider without a thumb value and minimum 0
      When the slider renders
      And the user clicks slider value 80 beside thumb "Volume"
      Then slider thumb "Volume" has value 80
      And slider thumb "Volume" is focused

    Scenario: Clicking the track selects a value and focuses the thumb

      Given a single slider
      When the slider renders
      And the user clicks slider value 20 beside thumb "Volume"
      Then slider thumb "Volume" has value 20
      And slider thumb "Volume" is focused

    Scenario Outline: Track clicks outside the range move the appropriate thumb

      Given a range slider with orientation "<orientation>" and direction "<direction>"
      When the slider renders
      Then slider thumb "Maximum" has transform "<transform>"
      When the application observes slider events
      And the user clicks slider value 90 beside thumb "Minimum"
      Then slider thumb "Maximum" has value 90
      And slider thumb "Minimum" has value 25
      When the user clicks slider value 10 beside thumb "Minimum"
      Then slider thumb "Maximum" has value 90
      And slider thumb "Minimum" has value 10
      And the slider events are "beforeinput,input,change,beforeinput,input,change"

      Examples:
        | orientation | direction | transform                     |
        | horizontal  | ltr       | matrix(1, 0, 0, 1, 213, 0)     |
        | horizontal  | rtl       | matrix(1, 0, 0, 1, -213, 0)    |
        | vertical    | ltr       | matrix(1, 0, 0, 1, 0, -138)    |

    Scenario Outline: Track clicks inside the range move the nearest thumb

      Given a range slider with orientation "<orientation>" and direction "<direction>"
      When the slider renders
      And the application observes slider events
      And the user clicks slider value <value> beside thumb "Minimum"
      Then slider thumb "Minimum" has value <minimum>
      And slider thumb "Maximum" has value <maximum>
      And slider thumb "<focused>" is focused
      And the slider events are "beforeinput,input,change"

      Examples:
        | orientation | direction | value | minimum | maximum | focused |
        | horizontal  | ltr       | 40    | 40      | 75      | Minimum |
        | horizontal  | ltr       | 60    | 25      | 60      | Maximum |
        | horizontal  | ltr       | 50    | 25      | 50      | Maximum |
        | horizontal  | rtl       | 40    | 40      | 75      | Minimum |
        | horizontal  | rtl       | 60    | 25      | 60      | Maximum |
        | horizontal  | rtl       | 50    | 25      | 50      | Maximum |
        | vertical    | ltr       | 40    | 40      | 75      | Minimum |
        | vertical    | ltr       | 60    | 25      | 60      | Maximum |
        | vertical    | ltr       | 50    | 25      | 50      | Maximum |

    Scenario: Clicking beyond a disabled upper thumb does not move the lower thumb

      Given a range slider with a disabled upper thumb
      When the slider renders
      And the application observes slider events
      And the user clicks slider value 95 beside thumb "Minimum"
      Then slider thumb "Minimum" has value 25
      And slider thumb "Maximum" has value 75
      And the slider events are ""

    Scenario: Clicking inside the range does not move a disabled nearest thumb

      Given a range slider with a disabled upper thumb
      When the slider renders
      And the application observes slider events
      And the user clicks slider value 60 beside thumb "Minimum"
      Then slider thumb "Minimum" has value 25
      And slider thumb "Maximum" has value 75
      And the slider events are ""

    Scenario: Dragging moves a thumb

      Given a single slider
      When the slider renders
      And the user drags slider thumb "Volume" to value 80
      Then slider thumb "Volume" has value 80

    Scenario Outline: Dragging a range thumb leaves its neighbor unchanged and cannot cross it

      Given a range slider with orientation "<orientation>" and direction "<direction>"
      When the slider renders
      And the user drags slider thumb "<thumb>" to value <value>
      Then slider thumb "Minimum" has value <minimum>
      And slider thumb "Maximum" has value <maximum>
      And slider thumb "<thumb>" is focused
      And slider thumb "Minimum" exposes minimum 0, maximum <maximum>, and value <minimum>
      And slider thumb "Maximum" exposes minimum <minimum>, maximum 100, and value <maximum>

      Examples:
        | orientation | direction | thumb   | value | minimum | maximum |
        | horizontal  | ltr       | Minimum | 40    | 40      | 75      |
        | horizontal  | ltr       | Maximum | 60    | 25      | 60      |
        | horizontal  | ltr       | Minimum | 90    | 75      | 75      |
        | horizontal  | ltr       | Maximum | 10    | 25      | 25      |
        | horizontal  | rtl       | Minimum | 90    | 75      | 75      |
        | horizontal  | rtl       | Maximum | 10    | 25      | 25      |
        | vertical    | ltr       | Minimum | 90    | 75      | 75      |
        | vertical    | ltr       | Maximum | 10    | 25      | 25      |

    Scenario: Dragging a disabled range thumb changes neither value

      Given a range slider with a disabled upper thumb
      When the slider renders
      And the application observes slider events
      And the user drags slider thumb "Maximum" to value 90
      Then slider thumb "Minimum" has value 25
      And slider thumb "Maximum" has value 75
      And the slider events are ""

    Scenario: Track clicks snap to a discrete step

      Given a single slider with attributes 'step="25" discrete' and value 50
      When the slider renders
      And the user clicks slider value 80 beside thumb "Volume"
      Then slider thumb "Volume" has value 75

    Scenario: A disabled slider ignores track clicks

      Given a single slider with attributes 'disabled' and value 50
      When the slider renders
      And the application observes slider events
      And the user clicks slider value 90 beside thumb "Volume"
      Then slider thumb "Volume" has value 50
      And slider thumb "Volume" is exposed as disabled
      And the slider events are ""

    Scenario: A slider spanning zero exposes the zero tick and snaps pointer values

      Given a single slider with attributes 'min="-50" max="50" step="5"' and value -25
      When the slider renders
      Then the slider zero tick is visible and inactive
      When the user clicks slider value 32 beside thumb "Volume"
      Then slider thumb "Volume" has value 30
      And the slider zero tick is visible and active
      When the user clicks slider value 0 beside thumb "Volume"
      Then slider thumb "Volume" has value 0
      And the slider zero tick is hidden by the thumb

    Scenario: A stepped drag animates and clears its transition on completion

      Given an animated stepped slider
      When the slider renders
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 142, 0)"
      When the application observes slider events
      And the application observes slider transform transitions
      And the user starts dragging slider thumb "Volume"
      And the pointer delivers a slow movement to slider value 80
      And the user releases the slider pointer
      Then slider thumb "Volume" has value 80
      And the slider transform animation completes

    Scenario: A fast drag stops animating and follows the pointer immediately

      Given an animated stepped slider
      When the slider renders
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 142, 0)"
      When the user starts dragging slider thumb "Volume"
      And the pointer delivers a slow movement to slider value 75
      Then slider thumb "Volume" has an active transform transition
      When the pointer delivers a fast movement to slider value 90
      Then slider thumb "Volume" has value 90
      And slider thumb "Volume" has no transform transition
      When the user releases the slider pointer
      Then slider thumb "Volume" is focused

  Rule: Layout remains correct after resizing and DOM movement

    Scenario: Changing direction updates positioning and subsequent input

      Given a single slider
      When the slider renders
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 142, 0)"
      When the application changes slider direction to "rtl"
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, -142, 0)"
      When the user focuses slider thumb "Volume"
      And the user presses slider key "ArrowRight"
      Then slider thumb "Volume" has value 49
      When the user clicks slider value 80 beside thumb "Volume"
      Then slider thumb "Volume" has value 80
      When the application changes slider direction to "ltr"
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 227.2, 0)"
      When the user presses slider key "ArrowRight"
      Then slider thumb "Volume" has value 81

    Scenario: Hidden sliders initialize using resize-delivered dimensions

      Given a hidden slider with measurement monitoring
      When the slider renders
      And the application reveals the slider
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 142, 0)"
      When the application sets slider thumb "Volume" to value 75
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 213, 0)"
      When the application makes the slider vertical with height 300
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 0, -213)"
      And the slider did not synchronously measure its layout

    Scenario: Thumb sizing and slider resizing work after reconnection

      Given a single slider
      When the slider renders
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 142, 0)"
      When the application sets slider thumb width to 12
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 138, 0)"
      When the application sets slider width to 420
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 198, 0)"
      When the application moves the slider to another container
      And the application sets slider thumb width to 20
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 194, 0)"

    Scenario: Pointer coordinates refresh after movement and transformation

      Given a single slider
      When the slider renders
      Then slider thumb "Volume" has transform "matrix(1, 0, 0, 1, 142, 0)"
      When the application moves and scales the slider
      And the user clicks slider value 80 beside thumb "Volume"
      Then slider thumb "Volume" has value 80

    Scenario: A reconnected slider handles input once

      Given a single slider
      When the slider renders
      And the application observes slider events
      And the application moves the slider to another container
      And the user focuses slider thumb "Volume"
      And the user presses slider key "ArrowRight"
      Then slider thumb "Volume" has value 51
      And the slider events are "beforeinput,input,change"

    Scenario: Moving a thumb to another slider refreshes ownership and semantics

      Given two sliders with different bounds and orientations
      When the slider renders
      And the application moves the volume thumb to the second slider
      Then the first slider tracks no thumbs
      And the second slider tracks the volume thumb
      And slider thumb "Volume" exposes minimum 10, maximum 90, and value 50
      And slider thumb "Volume" exposes orientation "vertical"
      When the application observes events on both sliders
      And the user focuses slider thumb "Volume"
      And the user presses slider key "ArrowUp"
      Then slider thumb "Volume" has value 55
      And the first slider has no input events
      And the second slider events are "beforeinput,input,change"

    Scenario: Removing a range thumb restores single-thumb bounds

      Given a range slider
      When the slider renders
      And the application removes slider thumb "Maximum"
      Then slider thumb "Minimum" exposes minimum 0, maximum 100, and value 25
      When the user focuses slider thumb "Minimum"
      And the user presses slider key "End"
      Then slider thumb "Minimum" has value 100

    Scenario: Adding a range thumb updates neighbor bounds

      Given a single slider
      When the slider renders
      And the application adds a maximum thumb with value 75
      Then slider thumb "Volume" exposes minimum 0, maximum 75, and value 50
      And slider thumb "Maximum" exposes minimum 50, maximum 100, and value 75
      When the application sets slider thumb "Maximum" to value 90
      Then slider thumb "Volume" exposes minimum 0, maximum 90, and value 50
      When the user focuses slider thumb "Volume"
      And the user presses slider key "End"
      Then slider thumb "Volume" has value 90
      And slider thumb "Maximum" exposes minimum 90, maximum 100, and value 90

  Rule: Labels and forms reflect thumb values

    Scenario: Display formatting updates the floating label

      Given a single slider with attributes 'labelled' and value 50
      When the slider renders
      And the application formats slider values as percentages
      And the user focuses slider thumb "Volume"
      And the user presses slider key "ArrowRight"
      Then the slider floating label is "51%"

    Scenario: A thumb contributes its value to a form

      Given a slider in a form with value 30
      When the slider renders
      Then the slider form value is "30"
      When the user focuses slider thumb "Volume"
      And the user presses slider key "ArrowRight"
      Then the slider form value is "31"

    Scenario: Moving a slider between forms updates form association

      Given a slider in a form with value 30
      When the slider renders
      And the application moves the slider into the second form
      Then the original form has no slider value
      And the second form slider value is "30"

    Scenario: A range slider submits both current values and resets both defaults

      Given a range slider in a form
      When the slider renders
      Then the range form contains minimum "25" and maximum "75"
      When the user focuses slider thumb "Minimum"
      And the user presses slider key "ArrowRight"
      And the user focuses slider thumb "Maximum"
      And the user presses slider key "ArrowLeft"
      Then the range form contains minimum "26" and maximum "74"
      And slider thumb "Minimum" exposes minimum 0, maximum 74, and value 26
      And slider thumb "Maximum" exposes minimum 26, maximum 100, and value 74
      When the user resets the range form
      Then the range form contains minimum "25" and maximum "75"
      And slider thumb "Minimum" exposes minimum 0, maximum 75, and value 25
      And slider thumb "Maximum" exposes minimum 25, maximum 100, and value 75
      And slider thumb "Minimum" has transform "matrix(1, 0, 0, 1, 71, 0)"
      And slider thumb "Maximum" has transform "matrix(1, 0, 0, 1, 213, 0)"

    Scenario: Invalid sizes fall back to extra-small

      Given a single slider with attributes 'size="bogus"' and value 50
      When the slider renders
      Then the slider size is "extra-small"
