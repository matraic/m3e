Feature: Progress indicators
  Linear and circular progress indicators communicate progress and activity.

  Rule: Progress indicators expose accessible progress values

    Scenario Outline: A determinate indicator exposes its progress
      Given a "<kind>" progress indicator with attributes "aria-label='Progress' value='40'"
      When the progress indicator renders
      Then the progress indicator is an accessible progressbar named "Progress"
      And the progress indicator has minimum 0, maximum 100 and current value 40

      Examples:
        | kind     |
        | linear   |
        | circular |

    Scenario Outline: A progress indicator honors a custom maximum
      Given a "<kind>" progress indicator with attributes "aria-label='Progress' value='5' max='10'"
      When the progress indicator renders
      Then the progress indicator has minimum 0, maximum 10 and current value 5

      Examples:
        | kind     |
        | linear   |
        | circular |

    Scenario Outline: A progress indicator starts at zero
      Given a "<kind>" progress indicator with attributes "aria-label='Progress'"
      When the progress indicator renders
      Then the progress indicator has minimum 0, maximum 100 and current value 0

      Examples:
        | kind     |
        | linear   |
        | circular |

    Scenario Outline: A progress indicator updates its accessible value
      Given a "<kind>" progress indicator with attributes "aria-label='Progress' value='10'"
      When the progress indicator renders
      And the application changes its value to 75
      Then the progress indicator has minimum 0, maximum 100 and current value 75

      Examples:
        | kind     |
        | linear   |
        | circular |

    Scenario Outline: Changing value and maximum updates accessible and visual progress
      Given a "<kind>" progress indicator with attributes "aria-label='Progress' variant='wavy' value='25' max='100' style='width: 200px'"
      When the progress indicator renders
      Then the visual progress is 25 percent
      When the application changes its maximum to 125
      Then the progress indicator has minimum 0, maximum 125 and current value 25
      And the visual progress is 20 percent
      When the application changes its value to 50
      Then the progress indicator has minimum 0, maximum 125 and current value 50
      And the visual progress is 40 percent

      Examples:
        | kind     |
        | linear   |
        | circular |

    Scenario Outline: A progress indicator normalizes its appearance variant
      Given two "<kind>" progress indicators with valid and invalid variants
      When the progress indicator renders
      Then the valid variant is "wavy"
      And the invalid variant falls back to "flat"

      Examples:
        | kind     |
        | linear   |
        | circular |

    Scenario Outline: A hidden progress indicator is not displayed
      Given a hidden "<kind>" progress indicator
      When the progress indicator renders
      Then the progress indicator is hidden

      Examples:
        | kind     |
        | linear   |
        | circular |

  Rule: Linear progress modes report determinate state accurately

    Scenario Outline: Indeterminate and query modes omit the current value
      Given a linear progress indicator with mode "<mode>"
      When the progress indicator renders
      Then the progressbar has no current value

      Examples:
        | mode          |
        | indeterminate |
        | query         |

    Scenario: Returning to determinate mode restores the current value
      Given a linear progress indicator with mode "indeterminate" and value 40
      When the progress indicator renders
      And the application changes the linear mode to "determinate"
      Then the progressbar has current value 40

    Scenario Outline: Changing the value in an indeterminate linear mode does not expose progress
      Given a linear progress indicator with mode "<mode>"
      When the progress indicator renders
      And the application changes its value to 75
      Then the progressbar has no current value
      When the application changes the linear mode to "determinate"
      Then the progressbar has current value 75

      Examples:
        | mode          |
        | indeterminate |
        | query         |

    Scenario: Buffer mode retains the determinate current value
      Given a linear progress indicator with buffer mode, value 30 and buffer 60
      When the progress indicator renders
      Then the progressbar has current value 30

    Scenario: Changing buffer progress and maximum updates the buffer display
      Given a linear progress indicator with buffer mode, value 30 and buffer 60
      When the progress indicator renders
      And the application changes its maximum to 200
      Then the progress indicator has minimum 0, maximum 200 and current value 30
      And the visual progress is 15 percent
      And the buffer segment is 30 percent of the indicator width
      When the application changes its value to 50
      Then the progress indicator has minimum 0, maximum 200 and current value 50
      And the visual progress is 25 percent
      And the buffer segment is 30 percent of the indicator width
      When the application changes its buffer value to 120
      Then the progress indicator has minimum 0, maximum 200 and current value 50
      And the buffer segment is 60 percent of the indicator width

    Scenario: An invalid linear mode falls back to determinate
      Given a linear progress indicator with an invalid mode
      When the progress indicator renders
      Then the linear mode is "determinate"

  Rule: Progress indicators remain accessible after DOM movement

    Scenario Outline: Moving a determinate progress indicator preserves its accessible value
      Given a "<kind>" progress indicator with attributes "aria-label='Progress' value='65' max='80'"
      When the progress indicator renders
      And the application moves the progress indicator to another parent
      Then the progress indicator is an accessible progressbar named "Progress"
      And the progress indicator has minimum 0, maximum 80 and current value 65

      Examples:
        | kind     |
        | linear   |
        | circular |

    Scenario: Moving an indeterminate circular indicator resumes its animation
      Given a wavy indeterminate circular progress indicator
      When the progress indicator renders
      And the application moves the progress indicator to another parent
      Then the circular indeterminate wave continues animating

    Scenario: The progress graphic is hidden from assistive technology
      Given a circular progress indicator with a label
      When the progress indicator renders
      Then the progress indicator is an accessible progressbar named "Loading"
      And the visual progress graphic is hidden from assistive technology

  Rule: Linear progress follows text direction

    Scenario Outline: Determinate and buffer progress starts at the inline start edge
      Given a linear progress indicator in "<mode>" mode and "<direction>" direction
      When the progress indicator renders
      Then the progress starts at the "<direction>" inline start edge

      Examples:
        | mode        | direction |
        | determinate | ltr       |
        | determinate | rtl       |
        | buffer      | ltr       |
        | buffer      | rtl       |

    Scenario Outline: Indeterminate and query progress reverses with direction
      Given a linear progress indicator in "<mode>" mode and "<direction>" direction
      When the progress indicator renders
      Then the "<mode>" animation follows the "<direction>" direction

      Examples:
        | mode          | direction |
        | indeterminate | ltr       |
        | indeterminate | rtl       |
        | query         | ltr       |
        | query         | rtl       |

  Rule: Wavy indicators adapt to resizing and reconnection

    Scenario Outline: Resizing before and after a DOM move updates the indicator geometry
      Given a resizable wavy "<kind>" indeterminate progress indicator
      When the progress indicator renders
      Then its geometry matches a size of 100 pixels
      When the application resizes the progress indicator to 160 pixels
      Then its geometry matches a size of 160 pixels
      When the application moves the progress indicator to another parent
      And the application resizes the progress indicator to 220 pixels
      Then its geometry matches a size of 220 pixels
      And its indeterminate animation continues

      Examples:
        | kind     |
        | linear   |
        | circular |

  Rule: Circular indeterminate progress animates continuously

    Scenario: A wavy spinner completes its six-second sweep and rotation cycle
      Given a paused wavy indeterminate circular progress indicator
      When the progress indicator renders
      Then the wavy spinner follows its six-second sweep and rotation cycle

    Scenario: A flat indeterminate spinner follows a circular path
      Given a flat indeterminate circular progress indicator
      When the progress indicator renders
      Then the flat spinner path is circular

    Scenario: An indeterminate circular indicator omits its current value
      Given a circular progress indicator with value 40 and indeterminate state
      When the progress indicator renders
      Then the progressbar has no current value

    Scenario: Removing indeterminate state restores the current value
      Given a circular progress indicator with value 40 and indeterminate state
      When the progress indicator renders
      And the application removes indeterminate state
      Then the progressbar has current value 40

    Scenario: Changing the value while circular progress is indeterminate does not expose progress
      Given a circular progress indicator with value 40 and indeterminate state
      When the progress indicator renders
      And the application changes its value to 75
      Then the progressbar has no current value
      When the application removes indeterminate state
      Then the progressbar has current value 75

    Scenario: A wavy spinner stays synchronized across repeated wave wraps
      Given a paused wavy indeterminate circular progress indicator
      When the progress indicator renders
      Then the spinner wave and track endpoints stay synchronized across repeated wraps

    Scenario: Changing to the wavy variant and moving the spinner resumes motion
      Given a flat indeterminate circular progress indicator
      When the progress indicator renders
      And the application changes the circular variant to "wavy"
      And the application moves the progress indicator to another parent
      Then the wavy spinner resumes animating

  Rule: Wavy progress geometry remains continuous and contained

    Scenario: A linear wave is flat at low and near-complete values
      Given linear wavy indicators at values 5, 10, 50, 95 and 97
      When the progress indicator renders
      Then only the middle linear wave has a wavy path

    Scenario: A linear wave advances by one wavelength per second
      Given a linear wavy progress indicator at value 50
      When the progress indicator renders
      Then its wave animation lasts one second

    Scenario Outline: A linear wave morphs between straight and wavy without snapping
      Given a paused linear wavy progress indicator in "<mode>" mode at value 10
      When the progress indicator renders
      Then its linear wave morphs over 500 milliseconds without changing its stroke or height

      Examples:
        | mode        |
        | determinate |
        | buffer      |

    Scenario: A jump to completion preserves the linear wave morph
      Given a paused linear wavy progress indicator in "determinate" mode at value 50
      When the progress indicator renders
      Then its linear wave smoothly flattens after jumping directly to completion

    Scenario: An interrupted linear morph resumes after moving the indicator
      Given a paused linear wavy progress indicator in "determinate" mode at value 50
      When the progress indicator renders
      Then its interrupted linear morph retargets from its current shape and resumes after moving

    Scenario Outline: Changing linear mode smoothly retargets its wave
      Given a paused linear wavy progress indicator in "determinate" mode at value 10
      When the progress indicator renders
      Then its linear wave smoothly morphs when switching to "<mode>" mode and back

      Examples:
        | mode          |
        | indeterminate |
        | query         |

    Scenario: Reducing configured linear amplitude keeps its morph contained
      Given a paused linear wavy progress indicator in "determinate" mode at value 50
      When the progress indicator renders
      Then reducing its configured amplitude smoothly flattens the linear wave without clipping

    Scenario: A circular wave is continuous and advances one wavelength per second
      Given a circular wavy progress indicator at value 50
      When the progress indicator renders
      Then its wave path is continuous and its animation lasts nine seconds

    Scenario: A circular rounded star has nine lobes and remains within its diameter
      Given a circular wavy progress indicator at value 50
      When the progress indicator renders
      Then its rounded star has nine lobes and the expected contained geometry

    Scenario: A circular wave morphs between circle and star without snapping
      Given a paused circular wavy progress indicator at value 10
      When the progress indicator renders
      Then its wave morphs between circle and star over 500 milliseconds without snapping

    Scenario: An interrupted circular wave morph retargets from its current shape
      Given a paused circular wavy progress indicator at value 50
      When the progress indicator renders
      Then its interrupted wave morph retargets from its current shape

    Scenario: Custom circular amplitude and wavelength remain contained
      Given circular wavy indicators with custom amplitude and wavelength
      When the progress indicator renders
      Then both rounded stars remain contained without folding

    Scenario: A wavy indeterminate spinner morphs amplitude while animating
      Given a paused wavy indeterminate circular progress indicator
      When the progress indicator renders
      Then its amplitude morphs while indeterminate motion continues

    Scenario: Rounded ends remain aligned as the determinate circular wave moves
      Given a circular wavy progress indicator at value 50
      When the progress indicator renders
      Then its rounded wave ends stay aligned during motion

    Scenario Outline: A circular wavy indicator preserves fractional stroke width
      Given a circular wavy indicator in "<mode>" mode with fractional stroke width
      When the progress indicator renders
      Then its track and active stroke retain the configured width
      When the application changes its stroke width to 8 pixels
      Then its track and active stroke retain the configured width

      Examples:
        | mode          |
        | determinate   |
        | indeterminate |

    Scenario: A zero-amplitude wavy spinner keeps animating after switching variants
      Given a flat indeterminate circular indicator with zero wavy amplitude
      When the progress indicator renders
      And the application changes the circular variant to "wavy"
      Then the circular wavy spinner has a curved path and continues animating

    Scenario: A circular wave is flat at low and near-complete values
      Given circular wavy indicators at values 5, 10, 50, 95 and 97
      When the progress indicator renders
      Then only the middle circular indicator has a wave path

  Rule: Completion showcases keep their layout stable

    Scenario Outline: The linear showcase keeps its width through completion and replay
      Given a paused progress completion showcase in a <width> pixel wide viewport
      When the completion showcase renders
      Then the linear indicator keeps its width and end position through completion and replay

      Examples:
        | width |
        | 360   |
        | 1280  |

  Rule: Thickness can be configured for both indicator shapes

    Scenario Outline: A shared thickness control updates linear and circular variants
      Given progress showcases in a <width> pixel wide viewport
      When the progress showcases render
      Then the shared thickness control changes both indicator shapes and variants

      Examples:
        | width |
        | 360   |
        | 1280  |
