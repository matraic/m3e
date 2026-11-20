Feature: App bar
  The m3e-app-bar presents navigation, a title, optional context, and actions.
  When connected to a scroll container, it can change appearance as the user scrolls.

  Rule: The app bar provides a banner landmark where appropriate

    Scenario: A top-level app bar presents the supplied content
      Given an app bar with a leading Back control, a title of "Inbox", a subtitle of "Recent messages", and a trailing More action
      When the bar renders at the top level
      Then it is exposed as a banner landmark
      And all four pieces of content are visible

    Scenario Outline: An explicit ancestor role determines whether the default banner is exposed
      Given an app bar with no explicit role
      And its nearest ancestor with an explicit role has role "<ancestor>"
      When the bar renders
      Then the default banner landmark is "<result>"

      Examples:
        | ancestor    | result     |
        | document    | exposed    |
        | application | exposed    |
        | main        | exposed    |
        | navigation  | suppressed |

  Rule: The app bar supports three sizes and an optional centered title area

    Scenario: Deprecated side slots still render their content
      Given an app bar using "leading-icon" for Back and "trailing-icon" for More instead of the current slot names
      When the bar renders
      Then Back and More appear on their respective sides of the bar

    Scenario Outline: Size selection
      Given an app bar <configuration>
      When the bar renders
      Then its effective size is "<size>"

      Examples:
        | configuration         | size   |
        | without a size        | small  |
        | with size "small"     | small  |
        | with size "medium"    | medium |
        | with size "large"     | large  |
        | with size "extra-large" | small |

    Scenario: Centering is opt-in
      Given a small app bar with a title and more space taken up by its trailing actions than by its leading control
      When the bar renders without "centered"
      Then the title area is start-aligned
      And the "centered" attribute is absent

    Scenario: Enabling centering through the property updates the markup
      Given a small app bar rendered without "centered"
      When the application enables its "centered" property
      Then the "centered" attribute is present

    Scenario Outline: Centering handles unequal side content
      Given a centered "<size>" app bar with a title and subtitle that fit, and side content of unequal widths
      When the bar renders
      Then the title and subtitle are centered horizontally within the bar

      Examples:
        | size   |
        | small  |
        | medium |
        | large  |

  Rule: The app bar responds to its associated scroll container

    Scenario: The for attribute selects which container drives the effect
      Given an app bar in "elevate" mode whose "for" attribute points to one of two scrollable containers
      When only the other container scrolls
      Then the bar keeps its unscrolled appearance
      When the associated container scrolls
      Then the bar takes on its scrolled appearance

    Scenario: Moving the app bar in the DOM preserves its scroll connection
      Given an app bar in "elevate" mode whose "for" attribute points to one of two scrollable containers
      When the application moves the app bar to a new DOM parent
      And the associated container scrolls
      Then the bar takes on its scrolled appearance

    Scenario: Applications can attach and detach a scroll container directly
      Given an app bar in "elevate" mode with no "for" attribute
      When the application calls attach with a scroll container and that container scrolls down
      Then the bar takes on its scrolled appearance
      When the container returns to the top, the application calls detach, and the container scrolls down again
      Then the bar keeps its unscrolled appearance

    @needs-review
    Scenario: Scrolling a same-origin iframe can drive the app bar
      Given an app bar in "elevate" mode whose "for" attribute points to a same-origin iframe
      When the user scrolls inside the iframe document
      Then the app bar takes on its scrolled appearance
      When the iframe document returns to the top
      Then the bar takes on its unscrolled appearance

    Scenario Outline: Elevation is the default and the fallback
      Given an app bar connected to a scroll container <configuration>
      When the bar renders
      Then its effective scroll behavior is "elevate"

      Examples:
        | configuration                |
        | without a scroll behavior    |
        | with scroll behavior "bogus" |

  Rule: Elevate changes the surface without changing the layout

    Scenario: The default effect does not add a scroll behavior attribute
      Given an app bar connected to a scroll container without a scroll behavior
      When the bar renders
      Then the "scroll-behavior" attribute is absent

    Scenario: The surface changes below the top and resets at the top
      Given a medium app bar in "elevate" mode with distinct normal and on-scroll surface styles
      And its associated scroll container is at the top
      When the user scrolls down in that container
      Then the bar uses its on-scroll color and elevation
      And it remains at its expanded height
      And it stays at the top of the scroll container
      When the user scrolls back to the top
      Then the bar uses its normal color and elevation again

  Rule: Transparent fades the surface and labels but keeps controls visible

    Scenario: Scrolling reveals the content behind the bar without fading its controls
      Given an app bar in "transparent" mode with an opaque normal surface, a title, a subtitle, and controls on both sides
      And its associated scroll container is at the top
      When the user scrolls down a short distance
      Then the background, title, and subtitle are partly transparent
      And the leading and trailing controls remain fully opaque
      And the app bar does not gain a shadow
      When the user scrolls down farther
      Then the background, title, and subtitle fade further
      When the user scrolls far enough for the fade to complete
      Then the background, title, and subtitle are fully transparent
      And the leading and trailing controls remain fully opaque
      And the app bar does not gain a shadow
      When the user scrolls back to the top
      Then the background, title, and subtitle are fully opaque again

    Scenario: Switching to transparent at the top keeps the surface and labels opaque
      Given a small app bar in "elevate" mode at the top of its scroll container
      When the application changes its scroll behavior to "transparent"
      Then the bar keeps its original color with an opaque background and labels

    Scenario: Standard icon buttons and text buttons gain a background as the bar fades
      Given an app bar in "transparent" mode with a standard icon button and a text button using their default styles
      When the user scrolls down a short distance
      Then the background behind each button fades in
      When the user scrolls far enough for the fade to complete
      Then both button backgrounds are fully opaque

    Scenario: Changing the mode removes the transparent effect
      Given a scrolled app bar in "transparent" mode whose title has faded out
      When the application changes its scroll behavior to "elevate"
      Then the title is fully opaque again
      And the bar uses its on-scroll surface styles

  Rule: Hide slides the bar out of view and restores it near the top

    Scenario: The bar remains hidden until the user scrolls near the top
      Given an app bar in "hide" mode at the top of its associated scroll container
      When the user scrolls down by less than the bar's height
      Then the bar slides upward by the distance scrolled without changing its surface styles
      When the user scrolls down by at least the bar's height
      Then the bar slides fully out of view
      When the user scrolls back up but stays at least one bar height from the top
      Then the bar remains out of view
      When the user scrolls within one bar height of the top
      Then the bar slides back into view
      When the user reaches the top
      Then the bar is fully visible

  Rule: Compress changes the layout of medium and large bars without reflowing the content below
    The bar is connected to a scroll container.

    Scenario Outline: The app bar collapses to the small height and expands again
      Given the app bar is an expanded "<size>" bar in "compress" mode
      When the user scrolls down far enough
      Then the bar shrinks to the configured small app bar height
      And the content below the bar keeps its original position within the scrollable content
      When the user scrolls back to the top
      Then the bar returns to its original expanded height

      Examples:
        | size   |
        | medium |
        | large  |

    Scenario: Without a height override the app bar collapses to the default small height
      Given a large compressing app bar with the default small height
      When the user scrolls down far enough
      Then the bar collapses to the default small height of 64 pixels

    Scenario: The app bar height tracks partial scrolling in both directions
      Given the app bar is an expanded "large" bar in "compress" mode
      When the user drags the scrollbar down by half the collapse distance
      Then the bar height is reduced by the distance scrolled
      And the content below the bar keeps its original position within the scrollable content
      When the user drags the scrollbar back to 10 pixels from the top
      Then the bar height is reduced by the distance scrolled
      And the content below the bar keeps its original position within the scrollable content

    Scenario: The app bar restores its full height after repeated scrolling
      Given the app bar is an expanded "large" bar in "compress" mode
      When the user scrolls down and back to the top three times
      Then the bar reaches the small height on each descent and restores its full height on each return

    Scenario: A small app bar does not compress
      Given the app bar is small and in "compress" mode
      When the user scrolls down
      Then the bar keeps its original height and surface styles

    Scenario: The title and subtitle move into the compact layout
      Given the app bar is a centered large bar with a title and subtitle in "compress" mode
      When the user begins collapsing the bar
      Then the title and subtitle have moved upward and are partly faded
      When the user scrolls down through the collapse
      Then the title and subtitle slide and fade out as the bar shrinks
      When the user scrolls down far enough
      Then the title and subtitle fade back in within the compact row
      And they remain centered in the compact row
      When the user scrolls back to the top
      Then the title and subtitle return to their expanded positions

    Scenario: The bar blends toward its configured on-scroll surface as it collapses
      Given the app bar is a large bar in "compress" mode with distinct normal and on-scroll colors and elevations
      When the bar is partway through collapsing
      Then its color and elevation are between their normal and on-scroll values
      When the bar is fully collapsed
      Then it uses the configured on-scroll color and elevation

    Scenario: The default collapsed surface has no visible shadow
      Given the app bar is a large bar in "compress" mode with no custom on-scroll elevation
      When the bar is fully collapsed
      Then the bar casts no visible shadow
      And it uses the on-scroll color

    Scenario: A fully collapsed bar only starts expanding near the top
      Given the app bar is fully collapsed and its container is scrolled far from the top
      When the user scrolls up but remains far from the top
      Then the bar stays fully collapsed
      When the user scrolls near enough to the top
      Then the bar starts to expand
      And the bar height is reduced by the distance scrolled

  Rule: A partially collapsed app bar settles after scrolling ends

    Scenario: A pause is not the end of scrolling when the browser reports scroll completion
      Given an expanded app bar in "compress" mode in a browser that supports "scrollend"
      When the user scrolls down in two short movements separated by pauses without a scroll-end notification
      Then the bar stays partially collapsed at both scroll positions

    Scenario: The app bar settles when the browser reports scrolling has ended
      Given an expanded app bar in "compress" mode in a browser that supports "scrollend"
      When the user scrolls partially down and the browser reports scrolling has ended
      Then the bar finishes collapsing
      When the user scrolls slightly up and the browser reports scrolling has ended
      Then the bar returns to its original expanded height
      And its associated scroll container is at the top

    Scenario Outline: The last scroll direction determines where the bar settles
      Given an app bar in "compress" mode that is partway between expanded and collapsed
      And the associated container has room to scroll in the direction of the snap
      When scrolling ends after the user last scrolled "<direction>"
      Then the bar settles "<state>"
      And the scroll position moves "<direction>" by the remaining change in bar height

      Examples:
        | direction | state           |
        | down      | fully collapsed |
        | up        | fully expanded  |

    Scenario Outline: A pause during an active scroll gesture does not settle the bar
      Given an app bar in "compress" mode that is partway through collapsing while the user is "<gesture>"
      When the scroll position briefly stops changing
      Then the bar does not snap while that input is held
      When the user releases the input and scrolling ends
      Then the bar finishes collapsing

      Examples:
        | gesture                        |
        | dragging the scrollbar thumb   |
        | holding down a scroll key      |
        | holding a finger on the screen |
