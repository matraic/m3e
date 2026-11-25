Feature: Segmented button

  A segmented button groups related choices. By default exactly one segment can be selected, like radios. With
  `multi`, any number of segments can be toggled, like toggle buttons.

  Rule: A single-select segmented button behaves like a radio group

    Scenario: The group exposes radios

      Given a single-select segmented button labelled "Size"
      When the segmented button renders
      Then the segmented button is exposed as the "Size" radiogroup
      And the segmented button has 3 radios
      And no segment is selected

    Scenario: Checking a segment unchecks the previous one

      Given a single-select segmented button labelled "Size"
      When the segmented button renders
      And the user clicks the "Small" segment
      Then the "Small" segment is selected
      When the user clicks the "Large" segment
      Then the "Large" segment is selected
      And the "Small" segment is not selected

    Scenario: Clicking the checked segment again keeps it checked

      Given a single-select segmented button labelled "Size"
      When the segmented button renders
      And the user clicks the "Small" segment
      And the user clicks the "Small" segment
      Then the "Small" segment is selected

    Scenario: A checked segment initializes the value

      Given a single-select segmented button labelled "Size"
      And the "Medium" segment starts checked
      When the segmented button renders
      Then the "Medium" segment is selected
      And the segmented button value is "m"

    Scenario: The value is none when nothing is selected

      Given a single-select segmented button labelled "Size"
      When the segmented button renders
      Then the segmented button value is none

    Scenario: Only the first segment stays checked when several start checked

      Given a single-select segmented button labelled "Size"
      And the "Small" segment starts checked
      And the "Large" segment starts checked
      When the segmented button renders
      Then the "Small" segment is selected
      And the "Large" segment is not selected
      And the segmented button value is "s"

    Scenario: Checking a segment from the application updates the group

      Given a single-select segmented button labelled "Size"
      And the "Medium" segment starts checked
      When the segmented button renders
      And the application checks the "Large" segment
      Then the "Large" segment is selected
      And the "Medium" segment is not selected
      And the segmented button value is "l"

    Scenario: A checked segment added later takes over the selection

      Given a single-select segmented button labelled "Size"
      And the "Medium" segment starts checked
      When the segmented button renders
      And the application adds a checked "Extra large" segment with value "xl"
      Then the "Extra large" segment is selected
      And the "Medium" segment is not selected
      And the segmented button value is "xl"

    Scenario: Removing the checked segment clears the value

      Given a single-select segmented button labelled "Size"
      And the "Medium" segment starts checked
      When the segmented button renders
      And the application removes the "Medium" segment
      Then the segmented button value is none

    Scenario: A checked segment that is disabled is left out of the value

      Given a single-select segmented button labelled "Size"
      And the "Medium" segment starts checked
      And the "Medium" segment starts disabled
      When the segmented button renders
      Then the segmented button value is none

  Rule: Checking a segment dispatches cancelable events

    Scenario: A user selection dispatches beforeinput, input, and change

      Given a single-select segmented button labelled "Size"
      When the segmented button renders
      And the segmented button records the events "beforeinput,input,change"
      And the user clicks the "Small" segment
      Then the segmented button recorded the events "beforeinput,input,change"

    Scenario: Canceling beforeinput keeps the segment unchecked

      Given a single-select segmented button labelled "Size"
      When the segmented button renders
      And the application cancels beforeinput on the segmented button
      And the user clicks the "Small" segment
      Then the "Small" segment is not selected

    Scenario: Clicking the checked segment again dispatches nothing

      Given a single-select segmented button labelled "Size"
      And the "Small" segment starts checked
      When the segmented button renders
      And the segmented button records the events "beforeinput,input,change"
      And the user clicks the "Small" segment
      Then the segmented button recorded the events ""

    Scenario: Checking a segment from the application dispatches no events

      Given a single-select segmented button labelled "Size"
      When the segmented button renders
      And the segmented button records the events "beforeinput,input,change"
      And the application checks the "Large" segment
      Then the segmented button recorded the events ""

  Rule: The keyboard moves the selection

    Scenario: The group is a single tab stop on the checked segment

      Given a single-select segmented button labelled "Size"
      And the "Medium" segment starts checked
      When the segmented button renders
      And the user tabs 1 time from the "Before" button
      Then the "Medium" segment is focused
      When the user tabs 1 time from the "Medium" segment
      Then the "After" button is focused

    Scenario Outline: Arrow keys check the next or previous segment and wrap around

      Given a single-select segmented button labelled "Size"
      When the segmented button renders
      And the user clicks the "<start>" segment
      And the user presses "<key>" in the segmented button
      Then the "<end>" segment is selected
      And the "<start>" segment is not selected

      Examples:
        | start  | key        | end    |
        | Small  | ArrowRight | Medium |
        | Medium | ArrowRight | Large  |
        | Large  | ArrowRight | Small  |
        | Small  | ArrowLeft  | Large  |
        | Large  | ArrowLeft  | Medium |

    Scenario Outline: Horizontal arrow keys follow the reading direction

      Given a single-select segmented button labelled "Size"
      And the segmented button page reads right to left
      When the segmented button renders
      And the user clicks the "Small" segment
      And the user presses "<key>" in the segmented button
      Then the "<end>" segment is selected

      Examples:
        | key        | end    |
        | ArrowLeft  | Medium |
        | ArrowRight | Large  |

    Scenario: Arrow keys skip disabled segments

      Given a single-select segmented button labelled "Size"
      And the "Medium" segment starts disabled
      When the segmented button renders
      And the user clicks the "Small" segment
      And the user presses "ArrowRight" in the segmented button
      Then the "Large" segment is selected

  Rule: A disabled segment or group cannot be changed

    Scenario: A disabled segment cannot be checked

      Given a single-select segmented button labelled "Size"
      And the "Small" segment starts disabled
      When the segmented button renders
      And the application clicks the "Small" segment
      Then the "Small" segment is not selected

    Scenario: A disabled group ignores clicks

      Given a single-select segmented button labelled "Size"
      And the segmented button starts disabled
      When the segmented button renders
      And the application clicks the "Small" segment
      Then no segment is selected

    Scenario: A disabled group disables every segment

      Given a single-select segmented button labelled "Size"
      And the segmented button starts disabled
      When the segmented button renders
      Then every segment is disabled

    Scenario: Enabling the group enables its segments again

      Given a single-select segmented button labelled "Size"
      And the segmented button starts disabled
      When the segmented button renders
      And the application enables the segmented button
      Then every segment is enabled

    Scenario: A disabled segment keeps a divider against an enabled neighbour

      Given a single-select segmented button labelled "Size"
      And the "Small" segment starts disabled
      And the "Medium" segment starts disabled
      When the segmented button renders
      Then the "Small" segment has no divider
      And the "Medium" segment has a divider
      When the application enables the "Medium" segment
      Then the "Medium" segment has no divider
      And the "Small" segment has a divider

  Rule: A single-select segmented button participates in a form

    Scenario: The selected value is submitted

      Given a single-select segmented button labelled "Size"
      And the segmented button sits in a form
      When the segmented button renders
      And the user clicks the "Medium" segment
      Then the segmented button form submits "size" as "m"

    Scenario: A disabled group submits nothing

      Given a single-select segmented button labelled "Size"
      And the "Medium" segment starts checked
      And the segmented button starts disabled
      And the segmented button sits in a form
      When the segmented button renders
      Then the segmented button form submits nothing for "size"

    Scenario: Resetting the form restores the initial selection

      Given a single-select segmented button labelled "Size"
      And the "Medium" segment starts checked
      And the segmented button sits in a form
      When the segmented button renders
      And the user clicks the "Large" segment
      And the segmented button form is reset
      Then the "Medium" segment is selected
      And the "Large" segment is not selected

  Rule: A multi-select segmented button behaves like a set of toggle buttons

    Scenario: The group exposes toggle buttons

      Given a multi-select segmented button labelled "Filter"
      When the segmented button renders
      Then the segmented button is exposed as the "Filter" group
      And the "Alpha" segment is not pressed
      And the segmented button has 0 radios

    Scenario: Segments toggle independently

      Given a multi-select segmented button labelled "Filter"
      When the segmented button renders
      And the user clicks the "Alpha" segment
      And the user clicks the "Beta" segment
      Then the "Alpha" segment is pressed
      And the "Beta" segment is pressed
      When the user clicks the "Alpha" segment
      Then the "Alpha" segment is not pressed
      And the "Beta" segment is pressed

    Scenario: One selected segment reports its value as text

      Given a multi-select segmented button labelled "Filter"
      When the segmented button renders
      And the user clicks the "Gamma" segment
      Then the segmented button value is "c"

    Scenario: Several selected segments report a list of values

      Given a multi-select segmented button labelled "Filter"
      When the segmented button renders
      And the user clicks the "Alpha" segment
      And the user clicks the "Gamma" segment
      Then the segmented button value is the list "a,c"

    Scenario: Arrow keys do not change the selection

      Given a multi-select segmented button labelled "Filter"
      When the segmented button renders
      And the user clicks the "Alpha" segment
      And the user presses "ArrowRight" in the segmented button
      Then the "Alpha" segment is pressed
      And the "Beta" segment is not pressed

    Scenario: Every segment is a tab stop

      Given a multi-select segmented button labelled "Filter"
      When the segmented button renders
      And the user tabs 2 times from the "Before" button
      Then the "Beta" segment is focused

    Scenario: A segment added in multi-select mode is a tab stop

      Given a multi-select segmented button labelled "Filter"
      When the segmented button renders
      And the application adds a checked "Delta" segment with value "d"
      Then the "Delta" segment is a tab stop
      When the user tabs 1 time from the "Gamma" segment
      Then the "Delta" segment is focused

    Scenario: A checked segment added later joins the selection

      Given a multi-select segmented button labelled "Filter"
      And the "Alpha" segment starts checked
      When the segmented button renders
      And the application adds a checked "Delta" segment with value "d"
      Then the "Alpha" segment is pressed
      And the "Delta" segment is pressed
      And the segmented button value is the list "a,d"

    Scenario: Every selected value is submitted

      Given a multi-select segmented button labelled "Filter"
      And the segmented button sits in a form
      When the segmented button renders
      And the user clicks the "Alpha" segment
      And the user clicks the "Beta" segment
      Then the segmented button form submits "filter" as the list "a,b"

    Scenario: A disabled group is marked aria-disabled

      Given a multi-select segmented button labelled "Filter"
      And the segmented button starts disabled
      When the segmented button renders
      Then the segmented button is marked aria-disabled

    Scenario: Turning multi on switches to toggle buttons

      Given a single-select segmented button labelled "Size"
      And the "Small" segment starts checked
      When the segmented button renders
      And the application turns multi on
      Then the segmented button is exposed as the "Size" group
      And the "Small" segment is pressed
      And the segmented button has 0 radios

    Scenario: Turning multi off switches to radios and keeps the first selection

      Given a multi-select segmented button labelled "Filter"
      And the "Alpha" segment starts checked
      And the "Gamma" segment starts checked
      When the segmented button renders
      And the application turns multi off
      Then the segmented button is exposed as the "Filter" radiogroup
      And the segmented button has 3 radios
      And the "Alpha" segment is selected
      And the "Gamma" segment is not selected

  Rule: A segment is shaped and decorated by its position and state

    Scenario: The outer corners are rounded

      Given a single-select segmented button labelled "Size"
      When the segmented button renders
      Then the "Small" segment has rounded start corners
      And the "Small" segment has square end corners
      And the "Medium" segment has square start corners
      And the "Medium" segment has square end corners
      And the "Large" segment has square start corners
      And the "Large" segment has rounded end corners

    Scenario: Adding a segment moves the rounded end corners

      Given a single-select segmented button labelled "Size"
      When the segmented button renders
      And the application adds a "Huge" segment with value "h"
      Then the "Large" segment has square end corners
      And the "Huge" segment has rounded end corners

    Scenario: A checked segment shows a check instead of its icon

      Given a single-select segmented button labelled "Size"
      And the "Small" segment has an icon
      When the segmented button renders
      Then the "Small" segment shows its icon
      And the "Small" segment shows no check
      When the user clicks the "Small" segment
      Then the "Small" segment shows a check
      And the "Small" segment shows no icon

    Scenario: The selection indicator can be hidden

      Given a single-select segmented button labelled "Size"
      And the segmented button hides its selection indicator
      And the "Small" segment starts checked
      And the "Small" segment has an icon
      When the segmented button renders
      Then the "Small" segment shows no check
      And the "Small" segment shows its icon

    Scenario: A segment added later honors the hidden selection indicator

      Given a single-select segmented button labelled "Size"
      And the segmented button hides its selection indicator
      When the segmented button renders
      And the application adds a checked "Huge" segment with value "h"
      Then the "Huge" segment shows no check
