Feature: Snackbar
  Snackbars announce brief updates and provide optional actions and dismissal.

  Rule: Declarative snackbars reflect their visibility and accessibility state

    Scenario: A snackbar is hidden until opened
      Given a closed snackbar
      When the snackbar renders
      Then the snackbar is hidden

    Scenario: An open snackbar is visible and announced politely
      Given an open snackbar with no timeout
      When the snackbar renders
      Then the snackbar is visible and announced politely

    Scenario: Removing the open attribute closes the snackbar
      Given an open snackbar with no timeout
      When the snackbar renders
      And the application removes the snackbar open attribute
      Then the snackbar is hidden

    Scenario: A snackbar closes automatically after its duration
      Given an open snackbar with a 300 millisecond duration
      When the snackbar renders
      Then the snackbar is hidden and no longer open

    Scenario: A zero duration keeps the snackbar open
      Given an open snackbar with no timeout
      When the snackbar renders
      And 500 milliseconds pass
      Then the snackbar is visible

    Scenario: Opening and closing dispatch toggle events
      Given a closed snackbar with no timeout
      When the snackbar renders and records toggle events
      And the application opens and closes the snackbar
      Then the snackbar toggle events are "open" and "closed"

    Scenario: Opening another snackbar closes the current one
      Given two snackbars with no timeout
      When the first snackbar renders open
      And the application opens the second snackbar
      Then the second snackbar is visible
      And the first snackbar is hidden

  Rule: Actions and close controls are optional and have independent effects

    Scenario: Only a snackbar with an action shows an action button
      Given plain and actionable snackbars
      When the snackbars render
      Then only the actionable snackbar has an action button

    Scenario: Clicking the action closes the snackbar and records the action
      Given an actionable open snackbar with no timeout
      When the snackbar renders
      And the user clicks the action button
      Then the snackbar is hidden and the action was taken

    Scenario: Only a dismissible snackbar shows a close button
      Given plain and dismissible snackbars
      When the snackbars render
      Then only the dismissible snackbar has a close button

    Scenario: Clicking the close button does not take the action
      Given an actionable dismissible snackbar with no timeout
      When the snackbar renders
      And the user clicks the close button
      Then the snackbar is hidden and the action was not taken

    Scenario: A custom close label names the close button
      Given a dismissible snackbar with close label "Dismiss"
      When the snackbar renders
      Then the close button is named "Dismiss"

    Scenario: The default close label is accessible
      Given a dismissible snackbar with no timeout
      When the snackbar renders
      Then the close button is named "Close"

  Rule: The global service creates and dismisses snackbars

    Scenario: The snackbar service is available globally
      Given an empty snackbar page
      When the snackbar page renders
      Then the global snackbar service is available

    Scenario: The service displays a message and removes it after closing
      Given an empty snackbar page
      When the snackbar page renders
      And the service opens a snackbar saying "File deleted" with a 300 millisecond duration
      Then the service snackbar says "File deleted"
      And the service snackbar is removed after it closes

    Scenario: The service honors a zero duration option
      Given an empty snackbar page
      When the snackbar page renders
      And the service opens a snackbar saying "File deleted" with no timeout
      And 500 milliseconds pass
      Then the service snackbar says "File deleted"

    Scenario: The service invokes an action callback when its action is clicked
      Given an empty snackbar page
      When the snackbar page renders
      And the service opens a snackbar with an action callback
      And the user clicks the action button
      Then the service snackbar is removed
      And the service action callback ran once

    Scenario: Dismissing a service snackbar does not invoke its action callback
      Given an empty snackbar page
      When the snackbar page renders
      And the service opens a dismissible snackbar with an action callback
      And the user clicks the close button
      Then the service snackbar is removed
      And the service action callback did not run

    Scenario: The service supports a dismissible-only overload
      Given an empty snackbar page
      When the snackbar page renders
      And the service opens a dismissible snackbar without an action
      Then the close button is named "Close"

    Scenario: The service supports an action and dismissible overload
      Given an empty snackbar page
      When the snackbar page renders
      And the service opens an actionable dismissible snackbar
      Then the action and close buttons are visible

    Scenario: The service applies a custom close label
      Given an empty snackbar page
      When the snackbar page renders
      And the service opens a dismissible snackbar with close label "Dismiss"
      Then the close button is named "Dismiss"

    Scenario: Dismissing the current snackbar closes it
      Given an empty snackbar page
      When the snackbar page renders
      And the service opens a snackbar saying "File deleted" with no timeout
      And the service dismisses the current snackbar
      Then the service snackbar is removed

    Scenario: Dismissing with no current snackbar does nothing
      Given an empty snackbar page
      When the snackbar page renders
      And the service dismisses the current snackbar
      Then no service snackbar exists

    Scenario: Service dismissal clears the declarative open state
      Given an open snackbar with no timeout
      When the snackbar renders
      And the service dismisses the current snackbar
      Then the snackbar is hidden and no longer open

    Scenario: Reduced motion removes a service snackbar without waiting for a transition
      Given an empty snackbar page with reduced motion
      When the snackbar page renders
      And the service opens a snackbar saying "File deleted" with no timeout
      And the service dismisses the current snackbar
      Then the service snackbar is removed
