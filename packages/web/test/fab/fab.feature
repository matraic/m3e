Feature: Floating action button
  A FAB provides a prominent action with accessible button or link semantics.

  Rule: FABs expose accessible actions

    Scenario: A FAB has an accessible name and receives keyboard focus
      Given an extended FAB labelled "Create"
      When the FAB renders
      Then the FAB is a visible button named "Create"
      When keyboard focus moves to the FAB
      Then the FAB is focused

    Scenario: Extended labels are visible only when extended
      Given extended and icon-only FABs with labels
      When the FAB renders
      Then the extended FAB label is visible
      And the icon-only FAB label is hidden

    Scenario: A decorative icon does not contribute to the accessible name
      Given an extended FAB with a decorative icon and label "Compose"
      When the FAB renders
      Then the FAB is a visible button named "Compose"
      And the FAB icon is excluded from the accessibility tree

    Scenario: Changing extended updates the label visibility
      Given an icon-only FAB labelled "Compose" with a label slot
      When the FAB renders
      Then the FAB label is hidden
      When the application extends the FAB
      Then the FAB label is visible
      And the FAB is a visible button named "Compose"
      When the application collapses the FAB label
      Then the FAB label is hidden
      And the FAB is a visible button named "Compose"

    Scenario Outline: A FAB activates once for each keyboard activation
      Given a FAB labelled "Create"
      When the FAB renders
      And the application observes FAB clicks
      And keyboard focus moves to the FAB
      And the user presses "<key>" on the FAB
      Then the FAB click count is 1

      Examples:
        | key   |
        | Enter |
        | Space |

    Scenario: A disabled FAB does not activate or receive keyboard focus
      Given a disabled FAB labelled "Create"
      When the FAB renders
      And the application observes FAB clicks
      Then the FAB is disabled
      And the FAB is not in the tab order
      When keyboard focus moves to the FAB
      Then keyboard focus moves past the FAB
      When the application clicks the FAB
      Then the FAB click count is 0

    Scenario: A disabled-interactive FAB is focusable but cannot activate
      Given a disabled-interactive FAB labelled "Create"
      When the FAB renders
      And the application observes FAB clicks
      Then the FAB is disabled
      When keyboard focus moves to the FAB
      Then the FAB is focused
      When the user presses "Enter" on the FAB
      And the user presses "Space" on the FAB
      And the user clicks the disabled-interactive FAB
      And the application clicks the FAB
      Then the FAB click count is 0

    Scenario: A dynamically disabled FAB can be enabled again
      Given a FAB labelled "Create"
      When the FAB renders
      And the application observes FAB clicks
      And the application disables the FAB
      Then the FAB is disabled
      And the FAB is not in the tab order
      When the application clicks the FAB
      Then the FAB click count is 0
      When the application enables the FAB
      Then the FAB is enabled
      When the user clicks the FAB
      Then the FAB click count is 1

  Rule: FAB appearance can be configured

    Scenario: Unsupported appearance values fall back to defaults
      Given a FAB with unsupported appearance values
      When the FAB renders
      Then the FAB variant is "primary-container"
      And the FAB size is "medium"

    Scenario Outline: Supported FAB variants are retained
      Given a FAB with variant "<variant>"
      When the FAB renders
      Then the FAB variant is "<variant>"

      Examples:
        | variant             |
        | primary             |
        | primary-container   |
        | secondary           |
        | secondary-container |
        | tertiary            |
        | tertiary-container  |
        | surface             |

    Scenario Outline: Supported FAB sizes are retained
      Given a FAB with size "<size>"
      When the FAB renders
      Then the FAB size is "<size>"

      Examples:
        | size   |
        | small  |
        | medium |
        | large  |

    Scenario: Larger FAB sizes render taller controls
      Given FABs in all supported sizes
      When the FAB renders
      Then each FAB size is taller than the previous size

    Scenario: FAB elevation can be lowered and restored
      Given a FAB labelled "Add"
      When the FAB renders
      Then the FAB is not lowered
      When the application lowers the FAB
      Then the FAB is lowered
      When the application raises the FAB
      Then the FAB is not lowered

    Scenario: A lowered FAB has a different elevation
      Given raised and lowered FABs
      When the FAB renders
      Then the lowered FAB has a different shadow from the raised FAB

  Rule: FABs can submit or reset forms

    Scenario: A submit FAB includes its name and value
      Given a form with a submit FAB named "action" and value "create"
      When the FAB renders
      And the application observes FAB form submissions
      And the user clicks the FAB
      Then the form has 1 FAB submission
      And the form submission contains "action" and "create"

    Scenario: A reset FAB restores its form
      Given a form with a reset FAB and a text field
      When the FAB renders
      And the user changes the FAB form field to "Changed"
      And the user clicks the FAB
      Then the FAB form field value is "Original"

    Scenario: A disabled submit FAB does not submit
      Given a form with a disabled submit FAB
      When the FAB renders
      And the application observes FAB form submissions
      And the application clicks the FAB
      And deferred FAB actions have completed
      Then the form has 0 FAB submissions

    Scenario: A disabled-interactive submit FAB does not submit
      Given a form with a disabled-interactive submit FAB
      When the FAB renders
      And the application observes FAB form submissions
      And the application clicks the FAB
      And deferred FAB actions have completed
      Then the form has 0 FAB submissions

  Rule: FABs can navigate as links

    Scenario: A destination gives a FAB link semantics and navigation
      Given a FAB link labelled "Open" with destination "#destination"
      When the FAB renders
      Then the FAB is a visible link named "Open"
      And the FAB link has one accessible link
      When the user clicks the FAB
      Then the browser fragment is "#destination" after FAB navigation

    Scenario: Adding and removing a destination updates FAB semantics
      Given a FAB labelled "Open"
      When the FAB renders
      Then the FAB is a visible button named "Open"
      When the application sets the FAB destination to "#destination"
      Then the FAB is a visible link named "Open"
      When the application removes the FAB destination
      Then the FAB is a visible button named "Open"
      And the FAB link is absent

    Scenario Outline: Disabled FAB links do not navigate
      Given a "<state>" FAB link labelled "Open"
      When the FAB renders
      Then the FAB is disabled
      When the application clicks the FAB
      And deferred FAB actions have completed
      Then the browser fragment is "" after FAB navigation

      Examples:
        | state                |
        | disabled             |
        | disabled-interactive |

  Rule: FAB behavior survives DOM movement

    Scenario: Moving a FAB preserves its semantics and activation
      Given a FAB labelled "Create"
      When the FAB renders
      And the application observes FAB clicks
      And the user clicks the FAB
      And the application moves the FAB to a new parent
      Then the FAB is in its new parent
      And the FAB is a visible button named "Create"
      When the user clicks the FAB
      And the user focuses the FAB
      And the user presses "Space" on the FAB
      Then the FAB click count is 3

    Scenario: Moving a link FAB preserves navigation
      Given a FAB link labelled "Open" with destination "#destination"
      When the FAB renders
      And the application moves the FAB to a new parent
      Then the FAB is in its new parent
      And the FAB is a visible link named "Open"
      When the user clicks the FAB
      Then the browser fragment is "#destination" after FAB navigation

    Scenario: Moving a pressed FAB clears its pressed state
      Given a FAB labelled "Create"
      When the FAB renders
      And the user presses and holds the FAB
      Then the FAB is visually pressed
      When the application moves the FAB to a new parent
      And the user releases the FAB
      Then the FAB is not visually pressed
      When the user clicks the FAB
      Then the FAB is not visually pressed

    Scenario: Moving a submit FAB transfers its form association
      Given two forms with a submit FAB in the first
      When the FAB renders
      And the application observes both FAB form submissions
      And the user clicks the FAB
      Then the first form has 1 FAB submission
      And the second form has 0 FAB submissions
      When the application moves the FAB into the second form
      And the user clicks the FAB
      Then the first form has 1 FAB submission
      And the second form has 1 FAB submission
      And the second form submission contains "action" and "create"
