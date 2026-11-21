@carousel-interaction
Feature: Carousel interaction
  Carousels and responsive grids expose accessible actions, exact geometry, keyboard navigation and pointer feedback.

  Scenario Outline: Selected index attributes and properties distinguish programmatic and user navigation

    Given an interaction carousel "<tag>" initialized at selected index one
    Then the interaction carousel selectedIndex property is one
    When the interaction carousel selectedIndex property is set to two
    Then the interaction carousel reflects index two without emitting change
    When the interaction carousel moves to the next item through its API
    Then the interaction carousel reflects index three and emits change

    Examples:
      | tag |
      | m3e-carousel |
      | m3e-carousel-grid |

  Scenario: A responsive grid exposes rows, dimensions, shared navigation and two-dimensional focus

    Given an interaction carousel grid of five destinations between outside buttons
    Then the interaction carousel grid exposes its name, three rows, two columns and four-to-three cells
    When the interaction carousel grid receives a change listener and keyboard entry
    Then the interaction carousel grid enters on its first action
    When the interaction carousel grid is navigated right, down, left and down before tabbing out
    Then focus leaves the interaction carousel grid through the following button
    Then the interaction carousel grid exposes five items through its API
    When the interaction carousel grid moves to index three through its API
    Then the interaction carousel grid reports index three and its change event
    When the interaction carousel grid moves previous and next
    Then the interaction carousel grid returns to index three
    When the interaction carousel grid narrows to three hundred pixels
    Then the interaction carousel grid reflows to five single-column rows

  Scenario Outline: Grid CSS sizing follows fractional thresholds and survives reconnection

    Given an interaction carousel grid with inherited sizing in "<direction>"
    Then the interaction carousel grid initially has two columns
    When the interaction carousel grid runs all thirteen fractional, percentage and calculated sizing thresholds
    When the interaction carousel grid reconnects with two-hundred-pixel cells and sixteen-pixel gaps
    Then the interaction carousel grid reconnects with three columns and three rows

    Examples:
      | direction |
      | ltr |
      | rtl |

  Scenario: Simultaneous grids update inherited sizing without synchronous forced layout

    Given three interaction carousel grids sharing inherited minimum widths and gaps
    Then all interaction carousel grids initially expose two columns
    When the interaction carousel grids resize and change inherited percentage sizing under layout tracing
    Then all interaction carousel grids expose three columns without forced layout

  Scenario Outline: Grid paging uses its scroll container and skips disabled actions and exhausted rows

    Given an interaction carousel grid in a two-hundred-forty-pixel scroll container in "<direction>"
    Then the scroll-contained interaction carousel grid has three columns
    When the interaction carousel grid pages down from its second action
    Then the interaction carousel grid focuses its eighth action and selects index seven
    When the interaction carousel grid pages back up
    Then the interaction carousel grid restores focus to its second action
    When the interaction carousel grid disables its eighth action
    Then the interaction carousel grid exposes the eighth action as disabled
    When the interaction carousel grid pages down past its disabled action
    Then the interaction carousel grid focuses the seventh action instead
    When the interaction carousel grid disables the adjacent actions and pages through the empty row
    Then the interaction carousel grid focuses the eleventh action
    When the interaction carousel grid pages up from the eleventh action
    Then the interaction carousel grid focuses the fifth action
    When the interaction carousel grid exercises its final row, first row and modified paging boundaries
    Then the interaction carousel grid still has exactly one Tab stop

    Examples:
      | direction |
      | ltr |
      | rtl |

  Scenario: Grid paging uses the document viewport when no nearer scroll container exists

    Given an interaction carousel grid in a three-hundred-sixty-pixel document viewport
    Then the document-paged interaction carousel grid exposes two columns
    When the document-paged interaction carousel grid pages down from its second action
    Then the document-paged interaction carousel grid focuses its eighth action
    When the document-paged interaction carousel grid pages up
    Then the document-paged interaction carousel grid restores its second action

  Scenario: Grid arrow navigation follows document direction rather than a local dir attribute

    Given an interaction carousel grid with local rtl direction inside an ltr document
    When the interaction carousel grid moves right from Coast
    Then the interaction carousel grid selects Forest at index one

  Scenario: Grid hidden items update row counts and removed items lose managed attributes

    Given an interaction carousel grid with three destinations and a removal destination
    Then the destination interaction carousel grid initially has two rows
    When the interaction carousel grid hides Forest
    Then the interaction carousel grid has one row and two exposed cells
    When the interaction carousel grid reveals Forest again
    Then the destination interaction carousel grid returns to two rows
    When the interaction carousel grid moves Coast outside and removes the grid
    Then the removed interaction carousel grid item has no managed slot or column index

  Scenario: No layout renders built-in previous and next navigation buttons

    Given an interaction carousel checking navigation across every layout
    When the interaction carousel renders the next layout without external navigation
    Then the interaction carousel has no built-in next or previous buttons
    When the interaction carousel renders the next layout without external navigation
    Then the interaction carousel has no built-in next or previous buttons
    When the interaction carousel renders the next layout without external navigation
    Then the interaction carousel has no built-in next or previous buttons
    When the interaction carousel renders the next layout without external navigation
    Then the interaction carousel has no built-in next or previous buttons
    When the interaction carousel renders the next layout without external navigation
    Then the interaction carousel has no built-in next or previous buttons

  Scenario: Unsupported direct children do not enter the item collection or accessibility grid

    Given an interaction carousel containing Coast and an unsupported direct child
    Then the interaction carousel hides unsupported content and exposes only Coast

  Scenario: A named horizontal grid exposes a row of cells and named item actions

    Given a named hero interaction carousel with three destinations
    Then the interaction carousel exposes grid, row, cell and action semantics without redundant labels

  Scenario: Fullscreen exposes a column and changing variants rebuilds horizontal grid semantics

    Given a named fullscreen interaction carousel with three destinations
    Then the interaction carousel exposes three rows and one column
    When the fullscreen interaction carousel changes to hero
    Then the interaction carousel exposes one row and restores cell column indices

  Scenario: Link actions and explicit labels respond live to action type, disability and keyboard activation

    Given an interaction carousel with a Coast link and an explicitly labeled tour button
    Then the interaction carousel link has its full accessible name, href, target and rel
    When the interaction carousel Coast link loses its href
    Then the interaction carousel Coast action becomes a named button
    When the interaction carousel Coast button is marked disabled
    Then the interaction carousel Coast button is disabled
    When the interaction carousel Coast action regains its href while disabled
    Then the disabled interaction carousel link has no active anchor
    When the interaction carousel Coast link is enabled
    Then the interaction carousel Coast anchor is restored
    When the interaction carousel link records clicks and receives a Space keydown
    Then the interaction carousel link retains its resting shape during Space
    When Space is released on the interaction carousel link
    Then Space does not activate the interaction carousel link
    When Enter is pressed on the interaction carousel link
    Then the interaction carousel link retains its resting shape during Enter
    When Enter is released on the interaction carousel link
    Then Enter activates the interaction carousel link once

  Scenario Outline: Morphing layouts page by their viewport and skip disabled actions

    Given a twelve-item interaction carousel using "<variant>" in "<direction>" with a twelve-hundred-pixel viewport
    When the wide interaction carousel pages down from its first action
    Then the wide interaction carousel focuses and selects its geometry-derived destination
    When the wide interaction carousel pages up twice
    When the wide interaction carousel disables its page destination
    Then the wide interaction carousel exposes its page destination as disabled
    When the wide interaction carousel pages down past the disabled destination
    Then the wide interaction carousel focuses and selects the next enabled destination
    When the wide interaction carousel exercises End, reverse paging and modified paging
    Then the wide interaction carousel maintains one Tab stop

    Examples:
      | variant | direction |
      | multi-browse | ltr |
      | multi-browse | rtl |
      | hero | ltr |
      | hero | rtl |
      | hero-centered | ltr |
      | hero-centered | rtl |

  Scenario Outline: Fixed-size layouts page according to their item geometry

    Given an eight-item interaction carousel using fixed "<variant>" geometry
    When the fixed-geometry interaction carousel pages down from its first action
    Then the fixed-geometry interaction carousel focuses its destination and scrolls to the exact page offset
    When the fixed-geometry interaction carousel pages back up
    Then the fixed-geometry interaction carousel focuses its first action again

    Examples:
      | variant |
      | uncontained |
      | fullscreen |

  Scenario Outline: Every layout has one Tab stop and reveals arrow-focused actions without activation

    Given an interaction carousel using "<variant>" between two outside buttons and recording clicks
    When keyboard focus enters the interaction carousel from the preceding button
    Then all five interaction carousel actions become focused, selected and fully visible in arrow order
    When the interaction carousel receives one more forward arrow
    Then the interaction carousel stays on its last action with one Tab stop and no activation
    When keyboard focus tabs out of the interaction carousel and returns
    Then the interaction carousel remembers its last action as the Tab entry
    When the interaction carousel receives Home twice and reverse Tab
    Then keyboard focus leaves the interaction carousel through the preceding button

    Examples:
      | variant |
      | multi-browse |
      | hero |
      | hero-centered |
      | uncontained |
      | fullscreen |

  Scenario Outline: Arrow navigation animates and immediately retargets without moving focus late

    Given an animated interaction carousel using "<variant>" with gutters in "<direction>"
    When the interaction carousel samples its first forward-arrow animation over four-hundred-fifty milliseconds
    Then the interaction carousel focuses immediately while scrolling through multiple intermediate frames
    When the interaction carousel rapidly retargets through End, Home and two forward arrows
    Then the interaction carousel focuses index two immediately and settles at its exact geometry offset

    Examples:
      | variant | direction |
      | multi-browse | ltr |
      | hero | ltr |
      | hero | rtl |
      | hero-centered | ltr |
      | uncontained | ltr |
      | fullscreen | ltr |

  Scenario Outline: Reduced motion makes arrow navigation instant

    Given a reduced-motion interaction carousel using "<variant>"
    When the reduced-motion interaction carousel receives End
    Then the reduced-motion interaction carousel instantly reveals and focuses its final action

    Examples:
      | variant |
      | hero |
      | fullscreen |

  Scenario: Disabled, removed and hidden items repair the keyboard entry point

    Given a hero interaction carousel between outside buttons with its second item disabled
    When keyboard focus enters the interaction carousel with a disabled second item
    Then arrows skip the disabled interaction carousel action in both directions
    When the interaction carousel disables its focused first item
    Then the interaction carousel repairs focus to its third action
    When the interaction carousel removes its focused third action
    Then the interaction carousel repairs focus to Item 4 and reports four columns
    When the interaction carousel hides its focused Item 4
    Then the interaction carousel repairs focus to Item 5 and reports three columns
    When the interaction carousel enables its first item again
    Then the interaction carousel has one Tab stop and Home returns to its first action

  Scenario: API scrolling does not steal action focus or change the remembered Tab entry

    Given a hero interaction carousel between outside buttons with its second action remembered
    When the interaction carousel scrolls through moveTo, movePrevious and moveNext
    Then the interaction carousel selects its last item without stealing second-action focus
    When keyboard focus leaves the scrolled interaction carousel and tabs back
    Then the interaction carousel restores its second action and selects index one

  Scenario: Shared keyboard activation and feedback elements respect disability

    Given a hero interaction carousel recording first-item activations
    When the interaction carousel first action receives Enter and Space
    Then the interaction carousel activates twice and attaches ripple, focus-ring and state-layer controls
    When the interaction carousel disables and programmatically clicks its first item
    Then the disabled interaction carousel item does not activate again
    When keyboard focus tabs from the interaction carousel viewport
    Then the interaction carousel enters on its second enabled action

  Scenario Outline: Uncontained edge masks morph without resizing content

    Given an uncontained interaction carousel with one-hundred-sixty-pixel items in "<direction>"
    When the interaction carousel computes expected edge masks and viewport bounds
    Then all eight forward and reverse interaction carousel scroll samples match masks, positions and fixed content widths

    Examples:
      | direction |
      | ltr |
      | rtl |

  Scenario Outline: Gutter-adjusted item areas preserve exact geometry and scroll extents

    Given an interaction carousel using "<variant>" with preferred three-hundred-twenty-pixel items and gutters in "<direction>"
    When the interaction carousel grows to four-hundred-fifty-two by two-hundred-sixteen pixels
    Then interaction carousel indices zero, two and four fit exact gutter-adjusted geometry and gutters do not hit items

    Examples:
      | variant | direction |
      | multi-browse | ltr |
      | multi-browse | rtl |
      | hero | ltr |
      | hero | rtl |
      | hero-centered | ltr |
      | hero-centered | rtl |
      | uncontained | ltr |
      | uncontained | rtl |

  Scenario Outline: Morphing and hiding an item preserve the full scroll extent

    Given an animated eight-item hero interaction carousel in "<direction>"
    Then the interaction carousel initially has the complete eight-item scroll extent
    When the interaction carousel swipes through two-hundred and six-hundred pixels
    When the interaction carousel cancels the swipe and hides its last item
    Then the interaction carousel updates to the complete seven-item scroll extent

    Examples:
      | direction |
      | ltr |
      | rtl |

  Scenario Outline: Every click-transition frame stays within the gutters

    Given an animated interaction carousel using "<variant>" with one-hundred-eighty-six-pixel preferred items and gutters in "<direction>"
    When the guttered interaction carousel widens and moves to its last item
    Then the guttered interaction carousel reaches its full scroll extent
    When the interaction carousel begins monitoring every visible action frame
    Then the interaction carousel has a visible earlier preview to select
    When the interaction carousel computes the preview destination and clicks it
    Then the interaction carousel selects and settles on the clicked preview
    When the interaction carousel stops monitoring after two additional animation frames
    Then more than three interaction carousel frames were sampled with less than one pixel of gutter overflow

    Examples:
      | variant | direction |
      | multi-browse | ltr |
      | multi-browse | rtl |
      | hero | ltr |
      | hero | rtl |
      | hero-centered | ltr |
      | hero-centered | rtl |
      | uncontained | ltr |
      | uncontained | rtl |

  Scenario Outline: Shadows and animated outward focus rings render beyond action boundaries

    Given an interaction carousel using "<variant>" with square items and red outward focus rings
    When the interaction carousel captures its resting shadow and hovers its action
    Then the interaction carousel hover shadow renders outside the action
    When the interaction carousel removes hover, captures its resting ring and enters by Tab
    Then the interaction carousel focus ring is outward and visible
    When the interaction carousel focus-ring animation pauses at its midpoint
    Then the interaction carousel six-pixel ring renders outside without changing action bounds

    Examples:
      | variant |
      | hero |
      | uncontained |
      | grid |

  Scenario: Fullscreen stays edge-to-edge with inward focus and no hover elevation

    Given a fullscreen interaction carousel with default gutters enabled
    Then the interaction carousel action fills its viewport with no padding and inward focus
    When the fullscreen interaction carousel action is hovered
    Then the fullscreen interaction carousel hover does not elevate
    When the edge-to-edge interaction carousel changes to hero
    Then the interaction carousel restores hero gutters and outward focus

  Scenario: Live gutter overrides reflow the selected offscreen action without losing focus

    Given a guttered hero interaction carousel with viewport bounds recorded
    When the interaction carousel focuses its first action and navigates to End
    Then the interaction carousel focuses its final action
    Then all three interaction carousel gutter overrides reflow the final action while preserving focus and selection
    When the gutter-overridden interaction carousel navigates Home
    Then the gutter-overridden interaction carousel focuses its first action

  Scenario Outline: Directly slotted media fills fixed content dimensions while actions mask and author styles remain effective

    Given a guttered hero interaction carousel containing directly slotted "<tag>" media
    Then the interaction carousel media fills its content with centered cover styling while its action is masked
    When the interaction carousel moves to its media preview
    Then the interaction carousel reveals the media action without resizing its media
    When the interaction carousel media receives author width, height and object-fit overrides
    Then the interaction carousel media respects eighty-by-sixty contain styling aligned to the top left
    When the interaction carousel media is nested inside a wrapper
    Then nested interaction carousel media returns to its native dimensions and object-fit

    Examples:
      | tag |
      | img |
      | video |

  Scenario Outline: Title and subtitle overlay fading follows mask size without resizing text or media

    Given an animated multi-browse interaction carousel with Coast title and subtitle overlays in "<direction>"
    Then the interaction carousel overlay visibility follows full, intermediate and small masks without losing accessible names
    When the interaction carousel samples overlays halfway to its second item
    Then the interaction carousel partially fades overlays without resizing text or media and keeps a sixteen-pixel bottom inset

    Examples:
      | direction |
      | ltr |
      | rtl |

  Scenario: Overlay visibility recovers in fixed layouts, reduced motion and detached items

    Given a hero interaction carousel with title and subtitle previews
    Then the interaction carousel preview overlays initially are hidden
    When the interaction carousel changes through uncontained, fullscreen, centered hero and hero layouts
    When the interaction carousel enables reduced motion
    Then the interaction carousel preview overlays become visible
    When the interaction carousel restores animation
    Then the interaction carousel preview title fades again
    When the interaction carousel preview item is removed to the document body
    Then the removed interaction carousel item restores both overlays

  Scenario: Overlay typography and colors support inherited and item-specific overrides

    Given a two-item hero interaction carousel with default overlay typography recorded
    When the interaction carousel overrides inherited overlay font sizes and colors
    Then the interaction carousel title and subtitle use independent inherited sizes and colors
    When the interaction carousel first subtitle receives item-specific typography and color
    Then the interaction carousel subtitle override leaves its title and sibling subtitle unchanged
    When the interaction carousel removes item and inherited overlay overrides
    Then the interaction carousel restores default typography and shared text color

  Scenario: An opt-in scrim darkens only the text area and does not change media or accessible names

    Given a hero interaction carousel with white media and title and subtitle text
    Then the interaction carousel media loads and its scrim initially is transparent
    When the interaction carousel captures top, bottom and media bounds and enables a blue scrim
    Then the interaction carousel blue scrim has opacity 0.65 and changes only the bottom pixels
    When the interaction carousel scrim opacity is reset to zero
    Then the interaction carousel original bottom pixels return

  Scenario Outline: Scrims follow assigned text slots, fade with masks and clear when text is removed

    Given a multi-browse interaction carousel with "<slots>" slots and scrim opacity 0.8
    Then the interaction carousel initial scrim opacities follow its assigned slots and masks
    When the interaction carousel moves to its third text item
    Then the interaction carousel selected text item scrim has opacity 0.8
    When the interaction carousel selected text item loses its assigned children
    Then the interaction carousel selected text item scrim clears
    When the interaction carousel selected text item restores its assigned children
    Then the interaction carousel selected text item scrim returns to opacity 0.8

    Examples:
      | slots |
      | title |
      | subtitle |
      | title and subtitle |

  Scenario: Specification outline and feedback colors preserve content dimensions

    Given a hero interaction carousel with black specification outlines and red feedback
    Then the interaction carousel resting outline is one pixel and black
    When the specification-colored interaction carousel action is hovered
    Then the interaction carousel hover uses red eight-percent feedback and preserves its black outline
    When the specification-colored interaction carousel receives keyboard focus
    Then the interaction carousel focus uses red ten-percent feedback and preserves its black outline
    When Space is held on the specification-colored interaction carousel
    Then the interaction carousel uses a red ten-percent pressed ripple without a pressed state layer
    When Space is released on the specification-colored interaction carousel
    Then the specification-colored interaction carousel content dimensions do not change
    When the specification-colored interaction carousel item is disabled
    Then the interaction carousel disabled outline uses twelve-percent black

  Scenario Outline: Mouse and touch activation preserve resting outlines while keyboard entry shows focus rings

    Given an interaction carousel image "<actionType>" with black outline using "<input>" input
    When the interaction carousel image action is activated by its configured pointer
    Then the interaction carousel image action releases its pressed state with a black outline and no visible focus ring
    When the interaction carousel image action receives keyboard Tab entry
    Then the interaction carousel image action is focused with its black outline and visible focus ring

    Examples: mouse activation
      | input | actionType |
      | mouse | button |
      | mouse | link |

    @interaction-touch

    Examples: touch activation
      | input | actionType |
      | touch | button |
      | touch | link |

  Scenario: Inherited outline and feedback overrides combine with item-specific ripple styling

    Given a hero interaction carousel with inherited custom outline and feedback colors
    Then the interaction carousel resting outline uses its orange override
    When the custom-colored interaction carousel action is hovered
    Then the interaction carousel hover uses cyan outlines and twenty-five-percent blue feedback
    When the custom-colored interaction carousel receives keyboard focus
    Then the interaction carousel focus uses orange outlines and twenty-percent green feedback
    When Space is held on the custom-colored interaction carousel
    Then the interaction carousel press uses green outlines and thirty-three-percent yellow ripple
    When the interaction carousel pressed item receives blue seventy-five-percent ripple overrides
    Then the interaction carousel pressed ripple uses its item-specific overrides
    When Space is released on the custom-colored interaction carousel
    Then the custom-colored interaction carousel content dimensions do not change
    When the custom-colored interaction carousel item is disabled
    Then the interaction carousel disabled outline uses fifty-percent blue
    When the interaction carousel outline width is set to zero
    Then the interaction carousel removes its outline without resizing content

  Scenario: Masked hover elevation renders outside the action and clears when disabled

    Given a multi-browse interaction carousel with instantaneous elevation transitions
    When the interaction carousel records masked bounds and resting shadow pixels then hovers the preview
    Then the interaction carousel elevated shadow changes outside pixels without resizing action or content
    When the elevated interaction carousel preview is disabled
    Then the interaction carousel restores resting elevation and outside pixels

  Scenario: Pressed corners morph visibly without resizing content and restore on release or cancellation

    Given a hero interaction carousel with first-action content and corner hit testing prepared
    Then the resting interaction carousel rounded corner is not an action hit target
    When the interaction carousel first action receives a held mouse press
    Then the interaction carousel sixteen-pixel pressed corner becomes hittable without resizing content
    When the interaction carousel mouse press is released
    Then the interaction carousel restores its twenty-eight-pixel non-hittable corner
    When the interaction carousel first action receives a touch pointerdown
    Then the interaction carousel touch press uses a sixteen-pixel corner
    When the interaction carousel viewport cancels the touch pointer
    Then the interaction carousel canceled press restores its twenty-eight-pixel corner

  Scenario: Quick mouse and touch taps retain their pressed shape for exactly 225 milliseconds

    Given a hero interaction carousel with a paused clock for quick pointer taps
    When the interaction carousel receives its next quick mouse or touch tap
    Then the interaction carousel pointer tap stays pressed through 224 milliseconds and releases at 225 milliseconds
    When the interaction carousel receives its next quick mouse or touch tap
    Then the interaction carousel pointer tap stays pressed through 224 milliseconds and releases at 225 milliseconds

  Scenario: Quick Space presses retain their shape but starting a swipe cancels it immediately

    Given a focused hero interaction carousel with a paused clock for quick Space presses
    When the interaction carousel receives a quick Space press
    Then the interaction carousel Space press stays pressed through 224 milliseconds and releases at 225 milliseconds
    When the interaction carousel receives a held touch pointer
    Then the interaction carousel held touch pointer is pressed
    When the interaction carousel begins a swipe while pressed
    Then the interaction carousel swipe cancels its pressed shape immediately
    When the pressed-shape interaction carousel swipe is canceled

  Scenario: Rounded corners do not activate an item but clicking its center does

    Given a reduced-motion hero interaction carousel recording first-item clicks
    When the interaction carousel first action is clicked outside its rounded corner
    Then the interaction carousel corner click does not activate its item
    When the interaction carousel first action is clicked at its center
    Then the interaction carousel center click activates its item

  Scenario: Keyboard pressed shapes restore on release, focus loss and disabling

    Given a focused hero interaction carousel ready for keyboard pressed-shape checks
    When Space is held on the interaction carousel first action
    Then the interaction carousel held Space uses a sixteen-pixel shape
    When Space is released on the interaction carousel first action
    Then the interaction carousel released Space restores a twenty-eight-pixel shape
    When Enter is held on the interaction carousel first action
    Then the interaction carousel held Enter keeps a twenty-eight-pixel shape
    When the interaction carousel releases Enter, holds Space and moves focus to its viewport
    Then the interaction carousel focus loss restores a twenty-eight-pixel shape
    When the interaction carousel releases Space, refocuses and holds Space again
    Then the interaction carousel refocused Space press uses a sixteen-pixel shape
    When the interaction carousel disables its keyboard-pressed item
    Then the disabled interaction carousel keyboard press restores a twenty-eight-pixel shape
    When the interaction carousel releases Space and dispatches a disabled mouse press
    Then the disabled interaction carousel mouse press keeps a twenty-eight-pixel shape

  Scenario: Pressed shapes respect smaller resting corners, custom morphs, reduced motion and fullscreen

    Given a reduced-motion hero interaction carousel ready for custom pressed corners
    When the interaction carousel uses an eight-pixel resting corner and holds Space
    Then the interaction carousel pressed corner is capped at eight pixels
    When the interaction carousel pressed morph is overridden to four pixels
    Then the interaction carousel uses a four-pixel corner without transition
    When Space is released on the custom-corner interaction carousel
    Then the interaction carousel custom resting corner returns to eight pixels
    When a fullscreen interaction carousel is rendered and receives a held Space press
    Then the fullscreen interaction carousel pressed corner remains square
    When Space is released on the square fullscreen interaction carousel

  Scenario Outline: Clicked previews select only on release and become fully revealed

    Given an interaction carousel using "<variant>" in "<direction>" and recording preview clicks
    When the interaction carousel presses its next visible preview
    Then the interaction carousel preview press leaves the selected index unchanged
    When the interaction carousel releases its preview press
    Then the interaction carousel selects the clicked preview once and fully reveals it
    When the interaction carousel presses its next visible preview
    Then the interaction carousel preview press leaves the selected index unchanged
    When the interaction carousel releases its preview press
    Then the interaction carousel selects the clicked preview once and fully reveals it
    When the interaction carousel presses its next visible preview
    Then the interaction carousel preview press leaves the selected index unchanged
    When the interaction carousel releases its preview press
    Then the interaction carousel selects the clicked preview once and fully reveals it

    Examples:
      | variant | direction |
      | multi-browse | ltr |
      | multi-browse | rtl |
      | hero | ltr |
      | hero | rtl |
      | hero-centered | ltr |
      | hero-centered | rtl |

  Scenario: Clicking a disabled preview neither selects it nor scrolls

    Given a hero interaction carousel with its second preview disabled
    Then the interaction carousel second preview action is disabled
    When the disabled interaction carousel preview is clicked at its visible center
    Then the interaction carousel stays at index zero with zero scroll

  Scenario: Dragging cancels pressed state and suppresses activation but the next click is allowed

    Given a hero interaction carousel recording click and pressed-state transitions during dragging
    When the interaction carousel is mouse-dragged from three-hundred to fifty pixels in eight steps
    Then the interaction carousel cancels pressed shape, suppresses clicks and settles at its second item
    When the interaction carousel receives the next click after dragging
    Then the interaction carousel permits that next click exactly once
