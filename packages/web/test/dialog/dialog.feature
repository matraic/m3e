Feature: Dialog
  Dialogs present modal content and actions.

  Rule: Dialogs open and close through their API and controls

    Scenario: A trigger opens a dialog with an accessible title
      Given a dialog with a trigger and title "Dialog title"
      When the dialog renders
      And the user clicks the dialog trigger
      Then the dialog trigger has a dialog popup
      And the dialog named "Dialog title" is visible

    Scenario: Showing and hiding dispatches lifecycle events
      Given a dialog
      When the dialog renders
      And the application observes dialog events
      And the application shows the dialog
      Then the dialog is visible
      And the dialog events are "opening,opened"
      When the application hides the dialog
      Then the dialog is closed
      And the dialog events are "opening,opened,closing,closed"

    Scenario: An opening event can prevent the dialog from opening
      Given a dialog
      When the dialog renders
      And the application prevents the dialog opening event
      And the application shows the dialog
      Then the dialog is closed

    Scenario: A closing event can prevent the dialog from closing
      Given a dialog
      When the dialog renders
      And the application shows the dialog
      And the application prevents the dialog closing event
      And the application hides the dialog
      Then the dialog is visible

    Scenario: A dialog action closes the dialog with a return value
      Given a dialog with an "Accept" action returning "accepted"
      When the dialog renders
      And the application shows the dialog
      And the user clicks the dialog action "Accept"
      Then the dialog is closed
      And the dialog return value is "accepted"

    Scenario: A dismissible dialog exposes a custom close button
      Given a dismissible dialog with close label "Dismiss prompt"
      When the dialog renders
      And the application shows the dialog
      And the user clicks the dialog action "Dismiss prompt"
      Then the dialog is closed

    Scenario Outline: Escape and backdrop clicks dismiss a dialog by default
      Given a dialog
      When the dialog renders
      And the application shows the dialog
      And the user dismisses the dialog using "<method>"
      Then the dialog is closed

      Examples:
        | method   |
        | Escape   |
        | backdrop |

    Scenario Outline: Disabling close prevents Escape and backdrop dismissal
      Given a dialog with closing disabled
      When the dialog renders
      And the application shows the dialog
      And the user dismisses the dialog using "<method>"
      Then the dialog is visible
      When the application hides the dialog
      Then the dialog is closed

      Examples:
        | method   |
        | Escape   |
        | backdrop |

    Scenario: A cancel event can prevent Escape dismissal
      Given a dialog
      When the dialog renders
      And the application prevents and counts dialog cancel events
      And the application shows the dialog
      And the user dismisses the dialog using "Escape"
      Then the dialog cancel count is 1
      And the dialog is visible

    Scenario: A cancel event can prevent Escape dismissal from focused dialog content
      Given a dialog with focusable content and an action
      When the dialog renders
      And the application prevents and counts dialog cancel events
      And the application shows the dialog
      And the user focuses dialog content
      And the user dismisses the dialog using "Escape"
      Then the dialog cancel count is 1
      And the dialog is visible

    Scenario: The open attribute opens and closes with the dialog
      Given a dialog
      When the dialog renders
      And the application sets the dialog open attribute
      Then the dialog is visible
      When the application hides the dialog
      Then the dialog is closed
      And the dialog does not have the open attribute

  Rule: Dialogs expose content and accessibility behavior

    Scenario: Header and content are displayed
      Given a dialog with title "Settings" and content "Body text"
      When the dialog renders
      And the application shows the dialog
      Then the dialog named "Settings" is visible
      And dialog content "Body text" is visible

    Scenario: Dialogs track slotted actions
      Given a dialog with an "Accept" action returning "accepted"
      When the dialog renders
      And the application shows the dialog
      Then the dialog has slotted actions

    Scenario: A dialog without actions does not have the actions state
      Given a dialog
      When the dialog renders
      And the application shows the dialog
      Then the dialog does not have slotted actions

    Scenario: Keyboard focus stays inside the dialog
      Given a dialog with focusable content and an action
      When the dialog renders
      And the application shows the dialog
      Then tabbing stays inside the dialog

    Scenario: Focus trapping can be disabled
      Given a dialog with focus trapping disabled
      When the dialog renders
      And the application shows the dialog
      Then the dialog focus trap is disabled

    Scenario: Closing restores focus to the trigger
      Given a dismissible dialog with a trigger
      When the dialog renders
      And the user clicks the dialog trigger
      And the user clicks the dialog action "Close"
      Then the dialog is closed
      And the dialog trigger has focus

    Scenario: An alert dialog exposes alertdialog semantics
      Given an alert dialog with title "Delete item?"
      When the dialog renders
      And the application shows the dialog
      Then the alert dialog named "Delete item?" is visible

  Rule: Dialogs and triggers can move in the DOM

    Scenario: Moving a dialog trigger transfers its popup semantics and behavior
      Given a dialog with a trigger and title "Dialog title"
      When the dialog renders
      And the application moves the dialog trigger to another button
      Then the original dialog trigger has no popup
      And the new dialog trigger has a dialog popup
      When the user clicks the dialog trigger
      Then the dialog is closed
      When the user clicks the new dialog trigger
      Then the dialog named "Dialog title" is visible

    Scenario Outline: Disconnecting while a dialog opens cancels the opening
      Given a dialog
      When the dialog renders
      And the application begins opening and "<movement>" the dialog
      Then the dialog is closed
      And dialog background scrolling is unlocked
      When the application shows the dialog
      Then the dialog is visible
      When the application hides the dialog
      Then dialog background scrolling is unlocked

      Examples:
        | movement |
        | moves    |
        | removes  |

    Scenario: Moving an open dialog closes it and allows reopening
      Given a dialog
      When the dialog renders
      And the application shows the dialog
      And the application moves the open dialog
      Then the dialog is closed
      And dialog background scrolling is unlocked
      When the application shows the dialog
      Then the dialog is visible

    Scenario: Disconnecting during the opening event cancels the opening
      Given a dialog
      When the dialog renders
      And the application moves the dialog during its opening event
      And the application shows the dialog
      Then the dialog is closed
      And dialog background scrolling is unlocked

    Scenario: A new opening is not canceled by an earlier disconnected opening
      Given a dialog
      When the dialog renders
      And the application moves the dialog during opening and immediately opens it again
      Then the dialog is visible
      When the application hides the dialog
      Then dialog background scrolling is unlocked

    Scenario: Moving a dialog while its open attribute is opening resets the attribute
      Given a dialog
      When the dialog renders
      And the application sets the open attribute and immediately moves the dialog
      Then the dialog is closed
      And the dialog does not have the open attribute
      And dialog background scrolling is unlocked
      When the application shows the dialog
      Then the dialog is visible

    Scenario: A pending hide does not interfere with reopening after movement
      Given a dialog
      When the dialog renders
      And the application shows the dialog
      And the application begins hiding, moves, and reopens the dialog
      Then the dialog is visible
      And dialog background scrolling is locked
      When the application hides the dialog
      Then dialog background scrolling is unlocked

    Scenario: A disconnected dialog cannot be opened
      Given a dialog
      When the dialog renders
      And the application tries to open the disconnected dialog
      Then the dialog is closed
      And dialog background scrolling is unlocked

  Rule: Dialog state and modal locks remain consistent

    Scenario: A canceled close preserves modal state and the previous return value
      Given a dialog
      When the dialog renders
      And the application sets the dialog return value to "original"
      And the application observes dialog events
      And the application shows the dialog
      And the application prevents the dialog closing event
      And the application hides the dialog with return value "replacement"
      Then the dialog is visible
      And the dialog open property and attribute are true
      And dialog background scrolling is locked
      And the dialog return value is "original"
      And the dialog events are "opening,opened,closing"

    Scenario: API opening and closing reflect the dialog state
      Given a dialog
      When the dialog renders
      Then the dialog open property and attribute are false
      When the application shows the dialog
      Then the dialog is visible
      And the dialog open property and attribute are true
      When the application hides the dialog
      Then the dialog is closed
      And the dialog open property and attribute are false

    Scenario: A canceled close restores the open property and attribute
      Given a dialog
      When the dialog renders
      And the application sets the dialog open attribute
      Then the dialog is visible
      When the application prevents the dialog closing event
      And the application clears the dialog open property
      Then the dialog is visible
      And the dialog open property and attribute are true
      And dialog background scrolling is locked

    Scenario: A canceled opening clears the open property and attribute
      Given a dialog
      When the dialog renders
      And the application prevents the dialog opening event
      And the application sets the dialog open attribute
      Then the dialog is closed
      And the dialog open property and attribute are false

    Scenario: Closing a nested dialog leaves the outer dialog modal
      Given an outer dialog containing an inner dialog
      When the dialog renders
      And the application shows the dialog
      And the user focuses the inner dialog trigger
      And the application shows the inner dialog
      Then the inner dialog is modal
      When the application hides the inner dialog
      Then the dialog is visible
      And the outer dialog is modal
      And dialog background scrolling is locked
      And the inner dialog trigger has focus
      When the application hides the dialog
      Then dialog background scrolling is unlocked

    Scenario: Closing a lower dialog keeps scrolling locked until the last dialog closes
      Given two separate dialogs
      When the dialog renders
      And the application sets the original page overflow to "scroll"
      And the application shows the dialog
      And the application shows the inner dialog
      And the application hides the dialog
      Then the inner dialog is modal
      And dialog background scrolling is locked
      When the application hides the inner dialog
      Then the original page overflow is restored to "scroll"

    Scenario: Removing an outer dialog with an open nested dialog restores scrolling
      Given an outer dialog containing an inner dialog
      When the dialog renders
      And the application sets the original page overflow to "scroll"
      And the application shows the dialog
      And the application shows the inner dialog
      And the application removes the outer dialog
      Then the original page overflow is restored to "scroll"

    Scenario: Reopening an already open dialog does not add another scroll lock
      Given a dialog
      When the dialog renders
      And the application sets the original page overflow to "scroll"
      And the application shows the dialog
      And the application shows the dialog
      And the application hides the dialog
      Then the original page overflow is restored to "scroll"
