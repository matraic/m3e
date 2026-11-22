Feature: Tooltips
  Tooltips provide contextual descriptions or interactive guidance for controls.

  Rule: Standard tooltips appear in response to their control

    Scenario: A standard tooltip is initially hidden with default settings
      Given a standard tooltip
      When the tooltip renders
      Then the tooltip has the default delays and position
      And the tooltip is closed
      And the tooltip is hidden from assistive technology

    Scenario: Hovering opens a standard tooltip and leaving closes it
      Given a standard tooltip
      When the tooltip renders
      And the user hovers over the tooltip control
      Then the tooltip is open
      And its popover is open
      When the pointer leaves the tooltip control
      Then the tooltip is closed
      And its popover is closed

    Scenario: A show delay postpones opening
      Given a standard tooltip with a 600 millisecond show delay
      When the tooltip renders
      And the user hovers over the tooltip control
      Then the tooltip has not opened immediately
      And the tooltip eventually opens

    Scenario: Keyboard focus opens a standard tooltip and blur closes it
      Given a standard tooltip
      When the tooltip renders
      And the user tabs to the tooltip control
      Then the tooltip control is focused
      And the tooltip is open
      When the user tabs away from the tooltip control
      Then the tooltip is closed

    Scenario: Pointer focus alone does not open a standard tooltip
      Given a standard tooltip
      When the tooltip renders
      And the user clicks the tooltip control
      And the pointer leaves the tooltip control
      Then the tooltip is closed

    Scenario: Escape dismisses a standard tooltip
      Given a standard tooltip
      When the tooltip renders
      And the user tabs to the tooltip control
      Then the tooltip is open
      When the user presses Escape
      Then the tooltip is closed

    Scenario: Clicking the control dismisses a standard tooltip
      Given a standard tooltip
      When the tooltip renders
      And the user hovers over the tooltip control
      Then the tooltip is open
      When the user clicks the tooltip control
      Then the tooltip is closed

    Scenario: An application can show and hide a tooltip
      Given a standard tooltip
      When the tooltip renders
      And the application shows the tooltip
      Then the tooltip is open
      And its popover is open
      When the application hides the tooltip
      Then the tooltip is closed
      And its popover is closed

    Scenario: A disabled tooltip cannot open and closes when disabled
      Given a disabled standard tooltip
      When the tooltip renders
      And the application shows the tooltip
      Then the tooltip is closed
      When the application enables and shows the tooltip
      Then the tooltip is open
      When the application disables the tooltip
      Then the tooltip is closed

    Scenario: A tooltip does not open for a disabled control
      Given a standard tooltip attached to a disabled control
      When the tooltip renders
      And the application shows the tooltip
      Then the tooltip is closed

    Scenario: Opening a tooltip closes another tooltip
      Given two standard tooltips
      When the tooltip renders
      And the application shows the first tooltip
      And the application shows the second tooltip
      Then the first tooltip is closed
      And the second tooltip is open

    Scenario: Invalid standard tooltip settings use defaults
      Given a standard tooltip with invalid position and touch gestures
      When the tooltip renders
      Then the tooltip uses the default position and touch gestures

    Scenario Outline: A standard tooltip is positioned relative to its control
      Given a standard tooltip positioned "<position>"
      When the tooltip renders
      And the application shows the tooltip
      Then its popover is open
      And the tooltip is positioned "<position>" its control

      Examples:
        | position |
        | above    |
        | below    |
        | before   |
        | after    |

  Rule: Rich tooltips offer non-interactive descriptions or interactive dialogs

    Scenario: A non-interactive rich tooltip behaves like a standard tooltip
      Given a non-interactive rich tooltip
      When the tooltip renders
      Then the tooltip is hidden from assistive technology
      And the tooltip control has no dialog popup
      When the user hovers over the tooltip control
      Then the tooltip is open
      When the pointer leaves the tooltip control
      Then the tooltip is closed

    Scenario: An interactive rich tooltip opens as a labelled dialog
      Given an interactive rich tooltip
      When the tooltip renders
      Then the tooltip control announces a dialog popup
      And the tooltip is not hidden from assistive technology
      When the user hovers over the tooltip control
      Then the tooltip remains closed on hover
      When the user clicks the tooltip control
      Then the tooltip is open
      And the tooltip is an accessible dialog named "Subhead"
      When the user clicks the tooltip control
      Then the tooltip is closed

    Scenario: Keyboard activation opens and closes an interactive tooltip
      Given an interactive rich tooltip
      When the tooltip renders
      And the user tabs to the tooltip control
      And the user presses Enter
      Then the tooltip is an accessible dialog named "Subhead"
      When the user presses Enter
      Then the tooltip is closed

    Scenario: Escape restores focus from an action to the control
      Given an interactive rich tooltip
      When the tooltip renders
      And the user clicks the tooltip control
      Then the tooltip is open
      When the user tabs to the tooltip action
      Then the tooltip action is focused
      When the user presses Escape
      Then the tooltip is closed
      And the tooltip control is focused

    Scenario: Escape closes a dialog while focus remains on its control
      Given an interactive rich tooltip
      When the tooltip renders
      And the user clicks the tooltip control
      Then the tooltip is open
      And the tooltip control is focused
      When the user presses Escape
      Then the tooltip is closed
      And the tooltip control is focused

    Scenario: Clicking outside closes an interactive tooltip
      Given an interactive rich tooltip
      When the tooltip renders
      And the user clicks the tooltip control
      Then the tooltip is open
      When the user clicks outside the tooltip
      Then the tooltip is closed

    Scenario: A tooltip action closes the dialog and restores focus
      Given an interactive rich tooltip
      When the tooltip renders
      And the user clicks the tooltip control
      Then its popover is open
      When the user activates the tooltip action
      Then the tooltip is closed
      And the tooltip control is focused

    Scenario: An action can opt out of focus restoration
      Given an interactive rich tooltip with focus restoration disabled
      When the tooltip renders
      And the user clicks the tooltip control
      Then its popover is open
      When the user activates the tooltip action
      Then the tooltip is closed
      And the tooltip control is not focused

    Scenario: Toggle events report changes and opening can be cancelled
      Given an interactive rich tooltip
      When the tooltip renders
      And the application observes tooltip toggle events
      And the user clicks the tooltip control
      Then the tooltip is open
      When the user clicks the tooltip control
      Then the tooltip reports opening and closing events
      And the tooltip is closed
      When the application cancels tooltip opening
      And the user clicks the tooltip control
      Then its popover is closed

    Scenario: Invalid rich tooltip position uses the default
      Given a rich tooltip with an invalid position
      When the tooltip renders
      Then the rich tooltip uses its default position

  Rule: Tooltip descriptions remain associated with the correct control

    Scenario Outline: Non-interactive tooltips describe their controls
      Given a "<kind>" tooltip
      When the tooltip renders
      Then the tooltip control is described by "Tooltip text"
      And the tooltip is hidden from assistive technology

      Examples:
        | kind     |
        | standard |
        | rich     |

    Scenario: A rich tooltip includes its subhead and content in the description
      Given a non-interactive rich tooltip with a subhead and content
      When the tooltip renders
      Then the tooltip control is described by "Head Body text"

    Scenario: An interactive tooltip does not describe its control as static text
      Given an interactive rich tooltip
      When the tooltip renders
      Then the tooltip control has no tooltip description
      And the tooltip control announces a dialog popup

    Scenario: Adding and removing an action updates the rich tooltip's accessibility
      Given a non-interactive rich tooltip
      When the tooltip renders
      Then the tooltip control is described by "Plain text"
      When the application adds a tooltip action
      Then the tooltip control has no tooltip description
      And the tooltip control announces a dialog popup
      When the application removes the tooltip action
      Then the tooltip control is described by "Plain text"
      And the tooltip control has no dialog popup

    Scenario: A rich tooltip restores a consumer popup value when it stops being interactive
      Given a non-interactive rich tooltip with a consumer popup value
      When the tooltip renders
      And the application adds a tooltip action
      Then the tooltip control announces a dialog popup
      When the application removes the tooltip action
      Then the tooltip control has popup value "menu"

    Scenario: Retargeting an interactive tooltip restores each control's popup value
      Given an interactive rich tooltip with consumer popup values on two controls
      When the tooltip renders
      Then the tooltip control announces a dialog popup
      When the application retargets the tooltip
      Then the tooltip control has popup value "menu"
      And the other tooltip control has popup value "dialog"
      When the application removes the tooltip
      Then the other tooltip control has popup value "listbox"

    Scenario Outline: Detaching or retargeting a tooltip transfers its description
      Given a "<kind>" tooltip with another control
      When the tooltip renders
      Then the tooltip control is described by "Tooltip text"
      When the application retargets the tooltip
      Then the original tooltip control has no tooltip description
      And the other tooltip control is described by "Tooltip text"
      When the application removes the tooltip
      Then the other tooltip control has no tooltip description
      And the document has no tooltip description container

      Examples:
        | kind     |
        | standard |
        | rich     |

    Scenario: Removing the for attribute detaches a standard tooltip
      Given a standard tooltip
      When the tooltip renders
      Then the tooltip control is described by "Tooltip text"
      When the application removes the tooltip association
      Then the original tooltip control has no tooltip description

    Scenario Outline: Consumer descriptions survive tooltip changes and removal
      Given a "<kind>" tooltip with a consumer description
      When the tooltip renders
      Then the tooltip control is described by "External guidance Tooltip text"
      When the application changes the tooltip text to "Updated tooltip"
      Then the tooltip control is described by "External guidance Updated tooltip"
      When the application removes the tooltip
      Then the tooltip control is described by "External guidance"
      And the tooltip control retains only the consumer description reference

      Examples:
        | kind     |
        | standard |
        | rich     |

    Scenario Outline: Removing one tooltip preserves a shared description
      Given two "<kind>" tooltips with the same description
      When the tooltip renders
      Then the tooltip control is described by "Tooltip text"
      And the other tooltip control is described by "Tooltip text"
      When the application removes the tooltip
      Then the original tooltip control has no tooltip description
      And the other tooltip control is described by "Tooltip text"
      And the document has one tooltip description

      Examples:
        | kind     |
        | standard |
        | rich     |

  Rule: Tooltips continue to work after DOM movement

    Scenario Outline: Moving a tooltip and control transfers the description between roots
      Given a movable "<kind>" tooltip and control
      When the tooltip renders
      Then the tooltip control is described by "Tooltip text"
      When the application moves the tooltip and control to another parent
      Then the tooltip control is described by "Tooltip text"
      And the document has one tooltip description
      When the application moves the tooltip and control into a shadow root
      Then the tooltip control is described by "Tooltip text"
      And the document has no tooltip description container
      And the shadow root has one tooltip description
      When the application moves the tooltip and control to another parent
      Then the tooltip control is described by "Tooltip text"
      And the shadow root has no tooltip description container
      And the document has one tooltip description
      When the user hovers over the tooltip control
      Then the tooltip is open
      When the pointer leaves the tooltip control
      Then the tooltip is closed

      Examples:
        | kind     |
        | standard |
        | rich     |

    Scenario Outline: A moved tooltip updates and cleans up its description
      Given a movable "<kind>" tooltip and control
      When the tooltip renders
      And the application moves the tooltip and control to another parent
      And the application changes the tooltip text to "Updated tooltip"
      Then the tooltip control is described by "Updated tooltip"
      And the document has one tooltip description
      When the application removes the tooltip
      Then the original tooltip control has no tooltip description
      And the document has no tooltip description container

      Examples:
        | kind     |
        | standard |
        | rich     |

    Scenario Outline: Removing and reinserting a tooltip restores its control association
      Given a "<kind>" tooltip
      When the tooltip renders
      Then the tooltip control is described by "Tooltip text"
      When the application removes and reinserts the tooltip
      Then the tooltip control is described by "Tooltip text"
      And the document has one tooltip description
      When the user hovers over the tooltip control
      Then the tooltip is open

      Examples:
        | kind     |
        | standard |
        | rich     |

    Scenario: A moved interactive tooltip still opens its dialog
      Given a movable interactive rich tooltip and control
      When the tooltip renders
      And the application moves the tooltip and control to another parent
      Then the tooltip control announces a dialog popup
      When the user clicks the tooltip control
      Then the tooltip is an accessible dialog named "Subhead"
      When the user presses Escape
      Then the tooltip is closed
      And the tooltip control is focused
