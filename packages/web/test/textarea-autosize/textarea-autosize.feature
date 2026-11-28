Feature: Textarea autosize
  The autosize helper adjusts a textarea without replacing its native accessibility or editing behavior.

  Rule: Textareas resize to fit content and row limits

    Scenario: The helper is hidden while the labeled textarea remains accessible
      Given an autosizing textarea
      When the autosize fixture renders
      Then the autosize helper is hidden from assistive technology
      And the textarea named "Notes" is focusable
      And manual textarea resizing is disabled

    Scenario: Initial content determines height
      Given an autosizing textarea containing 4 lines
      When the autosize fixture renders
      Then the textarea height is 4 lines

    Scenario: Typing grows and shrinks the textarea
      Given an autosizing textarea
      When the autosize fixture renders
      And the user enters 3 lines in the textarea
      Then the textarea height is 3 lines
      When the user enters 6 lines in the textarea
      Then the textarea height is 6 lines
      When the user enters 1 lines in the textarea
      Then the textarea height is 1 lines

    Scenario: Maximum rows cap the height
      Given an autosizing textarea with attributes 'max-rows="3"'
      When the autosize fixture renders
      And the user enters 8 lines in the textarea
      Then the textarea height is 3 lines
      And the textarea maximum height is 60 pixels

    Scenario: Minimum rows set the minimum height
      Given an autosizing textarea with attributes 'min-rows="4"'
      When the autosize fixture renders
      Then the textarea height is 4 lines
      When the user enters 2 lines in the textarea
      Then the textarea height is 4 lines
      When the user enters 6 lines in the textarea
      Then the textarea height is 6 lines

    Scenario: Wrapping increases textarea height
      Given an autosizing textarea
      When the autosize fixture renders
      And the user enters wrapping text in the textarea
      Then the textarea height exceeds 2 lines

    Scenario: A multiline placeholder sets the minimum height
      Given an autosizing textarea with a 3-line placeholder
      When the autosize fixture renders
      Then the textarea height is at least 3 lines

    Scenario: Explicit resizing observes a programmatic value change
      Given an autosizing textarea
      When the autosize fixture renders
      And the application sets the textarea value to 5 lines
      And the application resizes the textarea
      Then the textarea height is 5 lines

    Scenario: Autosizing preserves focus and text selection
      Given an autosizing textarea
      When the autosize fixture renders
      And the user enters 3 lines in the textarea
      And the user selects text in the textarea
      And the application resizes the textarea
      Then the textarea retains focus and its selection

  Rule: Limits and disabled state can change

    Scenario: A disabled helper leaves the original textarea height
      Given a disabled autosizing textarea with an original height of 50 pixels
      When the autosize fixture renders
      And the user enters 5 lines in the textarea
      Then the textarea height is 50 pixels

    Scenario: Disabling restores the original height and enabling resizes
      Given an autosizing textarea containing 4 lines with an original height of 50 pixels
      When the autosize fixture renders
      Then the textarea height is 4 lines
      When the application disables autosizing
      Then the textarea height is 50 pixels
      When the application enables autosizing
      Then the textarea height is 4 lines

    Scenario: Reset restores the original height
      Given an autosizing textarea containing 4 lines with an original height of 50 pixels
      When the autosize fixture renders
      Then the textarea height is 4 lines
      When the application resets autosizing
      Then the textarea height is 50 pixels

    Scenario: Changing the maximum rows updates the height
      Given an autosizing textarea with maximum 5 rows containing 8 lines
      When the autosize fixture renders
      Then the textarea height is 5 lines
      When the application sets autosize attribute "max-rows" to "2"
      Then the textarea height is 2 lines

    Scenario: Disabling removes managed limits until enabled again
      Given an autosizing textarea with maximum 3 rows containing 8 lines
      When the autosize fixture renders
      Then the textarea height is 3 lines
      When the application disables autosizing
      Then the textarea has no inline maximum height
      When the application sets autosize attribute "max-rows" to "2"
      Then the textarea has no inline maximum height
      When the application enables autosizing
      Then the textarea height is 2 lines
      And the textarea maximum height is 40 pixels

    Scenario: Consumer-supplied inline limits remain in effect
      Given an autosizing textarea containing 8 lines with inline height limits
      When the autosize fixture renders
      Then the textarea height is 60 pixels
      And the textarea maximum height is 60 pixels
      And the textarea minimum height is 30 pixels

    Scenario: Clearing row limits removes only managed limits
      Given an autosizing textarea with minimum 2 and maximum 3 rows containing 8 lines
      When the autosize fixture renders
      Then the textarea height is 3 lines
      When the application clears the autosize row limits
      Then the textarea height is 8 lines
      And the textarea has no inline row limits

    Scenario: Changing minimum rows updates the height
      Given an autosizing textarea with minimum 2 rows containing 1 lines
      When the autosize fixture renders
      Then the textarea height is 2 lines
      When the application sets autosize attribute "min-rows" to "5"
      Then the textarea height is 5 lines

    Scenario: A viewport resize recalculates wrapping
      Given an autosizing textarea containing wrapping text
      When the autosize fixture renders
      And the textarea width and viewport are reduced
      Then the textarea grows after the viewport resize

    Scenario: A non-textarea target is ignored
      Given an autosize helper targeting an input
      When the autosize fixture renders
      Then the input keeps its original resize style

  Rule: Autosizing resumes after reconnection

    Scenario: Disconnecting stops input handling and reconnecting resumes it
      Given an autosizing textarea containing 2 lines
      When the autosize fixture renders
      Then the textarea height is 2 lines
      When the application disconnects the autosize helper
      And the user enters 5 lines in the textarea
      Then the textarea height is 2 lines
      When the application reconnects the autosize helper
      Then the textarea height is 5 lines
      When the user enters 3 lines in the textarea
      Then the textarea height is 3 lines
