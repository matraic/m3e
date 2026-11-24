Feature: Loading indicator
  A loading indicator conveys indeterminate progress for a short wait, can follow a pull-to-refresh gesture, and
  remains accessible and legible across variants and forced colors.

  Rule: The indicator is exposed as an indeterminate progressbar

    Scenario: A labelled indicator is a progressbar without a current value

      Given a loading indicator with attributes 'aria-label="Loading"'
      When the loading indicator renders
      Then the loading indicator is a progressbar named "Loading"
      And the loading indicator has minimum 0 and maximum 100
      And the loading indicator has no current value
      And the visual indicator is hidden from assistive technology

    Scenario: An author-provided range is preserved

      Given a loading indicator with attributes 'aria-label="Loading" aria-valuemin="10" aria-valuemax="20"'
      When the loading indicator renders
      Then the loading indicator has minimum 10 and maximum 20

    Scenario: A hidden indicator is not displayed

      Given a loading indicator with attributes 'aria-label="Loading" hidden'
      When the loading indicator renders
      Then the loading indicator is not displayed

  Rule: The variant determines size and colors

    Scenario Outline: Each variant sizes and colors itself from its tokens

      Given a loading indicator with attributes '<attributes>'
      When the loading indicator renders
      Then the variant is "<variant>"
      And the loading indicator is <size>px wide
      And the container background is "<container>"
      And the active indicator color is "<indicator>"

      Examples:
        | attributes          | variant     | size | container        | indicator      |
        |                     | uncontained | 30   | rgba(0, 0, 0, 0) | rgb(0, 0, 255) |
        | variant="contained" | contained   | 60   | rgb(255, 0, 0)   | rgb(0, 128, 0) |
        | variant="bogus"     | uncontained | 30   | rgba(0, 0, 0, 0) | rgb(0, 0, 255) |

    Scenario: An invalid variant is not kept as an attribute

      Given a loading indicator with attributes 'variant="bogus"'
      When the loading indicator renders
      Then the variant attribute is not "bogus"

    Scenario: Changing the variant updates the appearance

      Given a loading indicator
      When the loading indicator renders
      And the application sets the variant to "contained"
      Then the loading indicator is 60px wide
      When the application sets the variant to "uncontained"
      Then the loading indicator is 30px wide

    Scenario: Forced colors use the system text color

      Given the user has forced colors enabled
      And a loading indicator with attributes 'variant="contained"'
      When the loading indicator renders
      Then the active indicator uses the system text color

  Rule: The indicator animates until a pull gesture drives it

    Scenario: Animating stops while pulled and resumes when the pull ends

      Given a loading indicator
      When the loading indicator renders
      Then the loading indicator is animating
      When the application sets the pull progress to 0.5
      Then the loading indicator is not animating
      When the application removes the pull progress
      Then the loading indicator is animating

    Scenario: An indicator that is initially pulled does not animate

      Given a loading indicator with attributes 'pull-progress="1"'
      When the loading indicator renders
      Then the loading indicator is not animating

    Scenario: Clearing the pull progress property resumes animating

      Given a loading indicator with attributes 'pull-progress="1"'
      When the loading indicator renders
      And the application clears the pull progress property
      Then the loading indicator is animating

    Scenario Outline: Pull progress rotates the indicator counterclockwise

      Given a loading indicator
      When the loading indicator renders
      And the application sets the pull progress to <progress>
      Then the indicator is rotated <degrees> degrees

      Examples:
        | progress | degrees |
        | 0.25     | 270     |
        | 0.5      | 180     |
        | 0.75     | 90      |
        | 1        | 0       |
        | -1       | 0       |

    Scenario: An invalid pull progress attribute keeps animating

      Given a loading indicator
      When the loading indicator renders
      And the application sets the pull progress attribute to "abc"
      Then the loading indicator is animating

    Scenario: A non-finite pull progress holds the indicator still

      Given a loading indicator
      When the loading indicator renders
      And the application sets the pull progress to infinity
      Then the loading indicator is not animating
      And the indicator is rotated 0 degrees

    Scenario: Pull progress reflects to its attribute

      Given a loading indicator
      When the loading indicator renders
      And the application sets the pull progress to 0.5
      Then the pull progress attribute is "0.5"
      When the application clears the pull progress property
      Then the loading indicator has no pull progress attribute

  Rule: A pan gesture can drive the indicator

    Scenario: Dragging drives the pull progress and releasing resumes animating

      Given a loading indicator in a pull target with a vertical pan gesture
      When the loading indicator renders
      And the application tracks the pan gesture as pull progress
      And the user drags down 60px on the pull target
      Then the loading indicator is not animating
      And the pull progress is about 0.5
      When the user releases the pull target
      Then the loading indicator is animating
      And the loading indicator has no pull progress attribute

    Scenario: Canceling the gesture resumes animating

      Given a loading indicator in a pull target with a vertical pan gesture
      When the loading indicator renders
      And the application tracks the pan gesture as pull progress
      And the user drags down 60px on the pull target
      And the pull gesture is canceled
      Then the loading indicator is animating
      And the loading indicator has no pull progress attribute

  Rule: Reconnection restores the current state

    Scenario: A moved indicator resumes animating

      Given a loading indicator
      When the loading indicator renders
      And the application moves the loading indicator
      Then the loading indicator is animating

    Scenario: A moved indicator keeps its pull rotation

      Given a loading indicator with attributes 'pull-progress="0.25"'
      When the loading indicator renders
      And the application moves the loading indicator
      Then the loading indicator is not animating
      And the indicator is rotated 270 degrees
