Feature: Divider
  Dividers separate content with horizontal or vertical lines.

  Rule: Dividers expose a separator in the configured orientation

    Scenario: A divider is horizontal by default
      Given a horizontal divider
      When the divider renders
      Then the divider is exposed as a visible separator
      And the divider is not vertical
      And the divider has display "block" and dimensions "300px" by "1px"

    Scenario: A vertical divider uses vertical dimensions
      Given a vertical divider
      When the divider renders
      Then the divider is exposed as a visible separator
      And the divider has the "vertical" attribute
      And the divider has display "block" and dimensions "1px" by "100px"

    Scenario: A hidden divider is not visible
      Given a hidden divider
      When the divider renders
      Then the divider separator is hidden

  Rule: Insets shorten the divider line

    Scenario: A divider has no inset by default
      Given a horizontal divider
      When the divider renders
      Then the divider line has left and right insets of 0 and 0 pixels

    Scenario: A shared inset indents both ends
      Given a horizontal divider with a 20 pixel inset
      When the divider renders
      Then the divider line has left and right insets of 20 and 20 pixels

    Scenario Outline: Start and end insets indent one side
      Given a horizontal divider with "<attribute>" of <size> pixels
      When the divider renders
      Then the divider line has left and right insets of <left> and <right> pixels

      Examples:
        | attribute   | size | left | right |
        | inset-start | 12   | 12   | 0     |
        | inset-end   | 8    | 0    | 8     |

    Scenario: Horizontal insets follow changes in page direction
      Given dividers with directional insets
      When the divider renders
      Then the divider lines have physical insets:
        | divider | left | right |
        | start   | 12   | 0     |
        | end     | 0    | 8     |
        | both    | 12   | 8     |
        | none    | 0    | 0     |
      When the application changes divider page direction to "rtl"
      Then the divider lines have physical insets:
        | divider | left | right |
        | start   | 0    | 12    |
        | end     | 8    | 0     |
        | both    | 8    | 12    |
        | none    | 0    | 0     |
      When the application changes divider page direction to "ltr"
      Then the divider lines have physical insets:
        | divider | left | right |
        | start   | 12   | 0     |
        | end     | 0    | 8     |
        | both    | 12   | 8     |
        | none    | 0    | 0     |

    Scenario: Insets run along the vertical axis on a vertical divider
      Given a vertical divider with a 16 pixel inset
      When the divider renders
      Then the divider line has top and bottom insets of 16 and 16 pixels

    Scenario: Inset attributes are reflected
      Given a divider with all inset attributes
      When the divider renders
      Then the divider has the "inset" attribute
      And the divider has the "inset-start" attribute
      And the divider has the "inset-end" attribute

  Rule: Dividers expose their orientation to assistive technology

    Scenario: The separator orientation follows changes to the vertical property
      Given a horizontal divider
      When the divider renders
      Then assistive technology sees a "horizontal" separator
      And the divider is not keyboard focusable
      When the application sets the divider vertical property to true
      Then assistive technology sees a "vertical" separator
      And the divider has the "vertical" attribute
      When the application sets the divider vertical property to false
      Then assistive technology sees a "horizontal" separator
      And the divider is not vertical

    Scenario: A vertical divider exposes vertical orientation initially
      Given a vertical divider
      When the divider renders
      Then assistive technology sees a "vertical" separator

  Rule: Dividers retain their behavior when moved in the DOM

    Scenario: Moving a vertical inset divider preserves its appearance and semantics
      Given a vertical divider with a 16 pixel inset
      When the divider renders
      And the application moves the divider to a new DOM parent
      Then the divider is in the new DOM parent
      And the divider is exposed as a visible separator
      And assistive technology sees a "vertical" separator
      And the divider has the "vertical" attribute
      And the divider line has top and bottom insets of 16 and 16 pixels
      When the application sets the divider vertical property to false
      Then assistive technology sees a "horizontal" separator
      And the divider is not vertical

    Scenario: A moved horizontal divider still follows page direction
      Given a horizontal divider with "inset-start" of 12 pixels
      When the divider renders
      And the application moves the divider to a new DOM parent
      And the application changes divider page direction to "rtl"
      Then the divider is in the new DOM parent
      And assistive technology sees a "horizontal" separator
      And the divider line has left and right insets of 0 and 12 pixels

  Rule: Presentational dividers omit separator semantics

    Scenario Outline: A presentational divider omits orientation while retaining its appearance
      Given a vertical divider with role "<role>"
      When the divider renders
      Then the divider has role "<role>"
      And the divider has no accessible orientation attribute
      And assistive technology ignores the divider
      And the divider has display "block" and dimensions "1px" by "100px"
      When the application sets the divider vertical property to false
      Then the divider has no accessible orientation attribute
      When the application moves the divider to a new DOM parent
      Then the divider has no accessible orientation attribute
      And assistive technology ignores the divider
      When the application sets the divider role to "separator"
      Then assistive technology sees a "horizontal" separator
      When the application sets the divider vertical property to true
      Then assistive technology sees a "vertical" separator

      Examples:
        | role         |
        | none         |
        | presentation |

    Scenario: Changing a separator to a presentational role removes its orientation
      Given a vertical divider
      When the divider renders
      Then assistive technology sees a "vertical" separator
      When the application sets the divider role to "none"
      Then the divider has no accessible orientation attribute
      And assistive technology ignores the divider
      When the application sets the divider role to "separator"
      Then assistive technology sees a "vertical" separator
