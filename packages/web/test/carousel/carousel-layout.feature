Feature: Carousel responsive layout and presentation
  Carousels adapt their keylines, previews and surfaces without reflowing
  content or forcing synchronous layout during interaction.

  Scenario: A responsive multi-browse arrangement preserves content width
    Given a layout carousel with a 186px multi-browse preference
    Then the layout carousel starts with two full items and a 40px preview
    When the responsive layout carousel widens to 800px
    Then the layout carousel reveals more of its third item

  Scenario Outline: Leading multi-browse items shrink before they clip
    Given a layout carousel in "<direction>" with "<sizing>" multi-browse sizing
    When a pointer drag starts on the leading layout carousel item
    Then the layout carousel shrinks to small size before partial clipping through every drag fraction

    Examples:
      | direction | sizing    |
      | ltr       | default   |
      | ltr       | preferred |
      | rtl       | default   |
      | rtl       | preferred |

  Scenario: A real uncontained swipe continues after release
    Given an animated uncontained layout carousel with 160px items
    When the layout carousel receives a real 120px pointer swipe
    Then the layout carousel scrolls more than 20px beyond its release position

  Scenario: Centered hero keylines shift at both ends
    Given a centered hero layout carousel with five items
    Then the layout carousel first item starts at the leading edge
    When the keyline layout carousel selects its middle item
    Then the layout carousel middle item settles at 210px
    When the keyline layout carousel selects its last item
    Then the layout carousel reaches maximum scroll and the trailing edge

  Scenario Outline: Multi-browse previews survive intermediate and final selections
    Given an animated multi-browse layout carousel in "<direction>" with a <size>px preference
    Then layout carousel selections 0, 1, 3 and 4 preserve full items and ordered previews
    When the preview layout carousel selects item 7
    Then the layout carousel shifts ordered previews to the start and fills the end

    Examples:
      | direction | size |
      | ltr       | 280  |
      | ltr       | 186  |
      | ltr       | 400  |
      | rtl       | 280  |
      | rtl       | 186  |
      | rtl       | 400  |

  Scenario Outline: The final multi-browse swipe keeps the trailing edge filled
    Given a 583px layout carousel in "<direction>" with six 198px preferred items
    Then layout carousel selections 2 through 5 keep trailing content beyond 581.5px
    When the trailing layout carousel begins a swipe from selection 2
    Then every layout carousel swipe sample fills the end and moves item 4 forward

    Examples:
      | direction |
      | ltr       |
      | rtl       |

  Scenario Outline: Every selected multi-browse item is fully visible
    Given a fully selectable multi-browse layout carousel in "<direction>"
    When the layout carousel selects all eight items and checks each visible extent
    Then the layout carousel final item aligns within 1.5px of the end

    Examples:
      | direction |
      | ltr       |
      | rtl       |

  Scenario: A start-aligned hero includes a small preview
    Given a start-aligned hero layout carousel with five items
    When the start-aligned layout carousel geometry is measured
    Then the layout carousel shows a smaller positive preview across an 8px gap

  Scenario Outline: Rounded surfaces survive viewport cuts
    Given a "<variant>" layout carousel in "<direction>" selected at item 2
    When a synthetic drag starts on the rounded-surface layout carousel
    Then both layout carousel viewport cuts preserve rounded hit areas and fixed content width

    Examples:
      | variant       | direction |
      | multi-browse  | ltr       |
      | multi-browse  | rtl       |
      | hero          | ltr       |
      | hero          | rtl       |
      | hero-centered | ltr       |
      | hero-centered | rtl       |

  Scenario Outline: The first multi-browse action never shrinks below small size
    Given a default multi-browse action layout carousel in "<direction>"
    When a synthetic drag starts on the first-action layout carousel
    Then the layout carousel action clips only after its surface reaches small size

    Examples:
      | direction |
      | ltr       |
      | rtl       |

  Scenario Outline: Hero layouts add large items on wider screens
    Given a "<variant>" layout carousel in "<direction>" with 320px preferred items
    Then the narrow layout carousel has one large item and its variant previews
    When the wide-hero layout carousel widens to 960px
    Then the layout carousel has three large items at the start, middle and end

    Examples:
      | variant       | direction |
      | hero          | ltr       |
      | hero          | rtl       |
      | hero-centered | ltr       |
      | hero-centered | rtl       |

  Scenario: Centered hero preview limits respond to CSS changes
    Given an animated centered-hero preview-limit layout carousel
    When the layout carousel small-item minimum and maximum become 4rem
    Then the layout carousel next preview becomes 64px
    When the preview-limit layout carousel selects its middle item
    Then both layout carousel previews remain 64px beside a larger selected item

  Scenario: Two real swipes preserve centered hero preview sizes
    Given an animated centered-hero two-swipe layout carousel
    When the layout carousel swipes twice and checks each selection and adjacent preview
    Then the layout carousel middle selection retains both original previews of at least 39px

  Scenario: A percentage hero large-item limit allows two full items
    Given an animated hero percentage-limit layout carousel
    When the layout carousel large-item maximum becomes 50 percent
    Then the layout carousel shows two equally large items and a 39px to 57px trailing preview

  Scenario Outline: Hero previews remain rounded and inside the viewport
    Given a rounded-preview "<variant>" layout carousel in "<direction>"
    When the rounded-preview layout carousel begins checking selection 0
    Then layout carousel selections 0, 2 and 4 keep the expected rounded previews within the viewport

    Examples:
      | variant       | direction |
      | hero          | ltr       |
      | hero          | rtl       |
      | hero-centered | ltr       |
      | hero-centered | rtl       |

  Scenario: The last start-aligned hero item reaches the viewport end
    Given a reduced-motion last-item hero layout carousel
    When the last-item layout carousel selects item 4
    Then the layout carousel last right edge is within 1.5px of 420px

  Scenario: Hero masks change during dragging without resizing content
    Given a hero mask layout carousel with initial geometry recorded
    When the layout carousel pointer moves 90px while held down
    Then the layout carousel scroll exceeds 50px and its incoming mask grows without resizing content

  Scenario Outline: Hero dragging grows the incoming item
    Given an incoming-item "<variant>" layout carousel in "<direction>"
    When the layout carousel pointer drags halfway to the next keyline
    Then the layout carousel exchanges visible sizes with an 8px gap and a small third preview

    Examples:
      | variant       | direction |
      | hero          | ltr       |
      | hero          | rtl       |
      | hero-centered | ltr       |
      | hero-centered | rtl       |

  Scenario Outline: Departed previews do not return during settling
    Given an 800px "<variant>" layout carousel at item 1 using "<action>" navigation
    When the layout carousel advances and records departed-preview frames for 900ms
    Then the layout carousel preview shrinks monotonically and never returns after departure

    Examples:
      | variant       | action |
      | hero          | button |
      | hero          | swipe  |
      | hero-centered | button |
      | hero-centered | swipe  |

  Scenario: A single centered hero fills the viewport
    Given a single-item centered hero layout carousel
    When the single-item layout carousel geometry is measured
    Then the layout carousel only item is 420px visible with no scroll range

  Scenario: An initially empty carousel lays out its first added item
    Given an empty hero layout carousel
    When a first item is appended to the layout carousel
    Then the layout carousel added item becomes 420px visible

  Scenario Outline: Smaller preferred hero sizes permit multiple large items
    Given a "<variant>" layout carousel with eight 180px preferred items
    When the smaller-preference layout carousel widens to 800px and selects item 3
    Then the layout carousel has at least two equally largest fully visible items

    Examples:
      | variant       |
      | hero          |
      | hero-centered |

  Scenario Outline: A wide short centered hero follows small drags without reversing
    Given a guttered 932px centered hero layout carousel in "<direction>" with four items
    When the short layout carousel pointer goes down at its center
    Then every layout carousel item advances monotonically through 12px, 24px, 36px and 48px drags

    Examples:
      | direction |
      | ltr       |
      | rtl       |

  Scenario: Uncontained item size is capped to the viewport
    Given an uncontained layout carousel with a 600px item preference
    When the capped layout carousel geometry is measured
    Then the layout carousel first item width and visible size are 420px

  Scenario: One item preference works across layout variants
    Given an uncontained layout carousel with five 160px preferred items
    Then the layout carousel uses the same preference through all four horizontal variants
    When the preference layout carousel switches to fullscreen with 200px height
    Then the layout carousel fullscreen item height is 200px

  Scenario: Inherited lengths and container queries update sizing independently
    Given a layout carousel inheriting calc lengths inside a 600px query container
    Then the inherited layout carousel item width is 166px
    When the layout carousel query container shrinks to 400px
    Then the layout carousel item width is 192px while its viewport stays 420px
    When the inherited layout carousel overrides its preference to 50 percent
    Then the percentage layout carousel item width is 210px
    When the percentage layout carousel widens to 600px
    Then the percentage layout carousel item width is 300px
    When the inherited layout carousel removes its local preference
    Then the layout carousel restores the inherited 192px width

  Scenario Outline: Inherited preferences reflow and restore defaults
    Given a "<variant>" layout carousel inheriting a 186px preference
    When the inherited-preference layout carousel starts the 186px, 328px and default sequence
    Then each layout carousel inherited preference matches its computed arrangement

    Examples:
      | variant       |
      | multi-browse  |
      | hero          |
      | hero-centered |

  Scenario: Uncontained dragging skips duplicate presentations and invariant reads
    Given an uncontained layout carousel with 32 items and warmed geometry
    When layout carousel style access is counted across drag updates and a duplicate scroll event
    Then the layout carousel skips duplicate writes and invariant reads with fewer than 32 reads at 80px

  Scenario: Offscreen translations limit descendant style recalculation
    Given a centered hero layout carousel with 32 items selected at item 3
    When eight layout carousel drag frames are traced for style recalculation
    Then the layout carousel styles a positive number of fewer than 128 elements

  Scenario Outline: Dragging and flinging do not force layout
    Given an animated tracing "<variant>" layout carousel in "<direction>"
    When the layout carousel drags through 20 frames and flings without forced layout
    Then the traced layout carousel scrolls beyond 80px

    Examples:
      | variant       | direction |
      | uncontained   | ltr       |
      | multi-browse  | ltr       |
      | hero          | rtl       |
      | hero-centered | ltr       |
      | fullscreen    | ltr       |

  Scenario Outline: Real pointer dragging does not force layout
    Given a guttered 800px multi-browse tracing layout carousel in "<direction>"
    When the layout carousel real pointer drag reverses and checks surface clipping without forced layout
    Then the pointer-traced layout carousel has positive scroll after release

    Examples:
      | direction |
      | ltr       |
      | rtl       |

  Scenario Outline: Rapid reversing updates do not force layout
    Given a rapid-reversal "<variant>" layout carousel
    When the rapid-reversal layout carousel geometry is warmed
    Then the layout carousel completes eight passes of triple drag updates without forced layout

    Examples:
      | variant      |
      | multi-browse |
      | uncontained  |

  Scenario: Animated navigation uses cached sizing measurements
    Given an animated hero layout carousel with warmed 186px preferred sizing
    When the cached-sizing layout carousel navigates to item 7 with measurement counters installed
    Then the layout carousel selects item 7 without bounds or dimension reads and at most two style reads

  Scenario Outline: Resizing realigns selection without forcing layout
    Given a 900px "<variant>" layout carousel in "<direction>" with titled item 2 selected
    When the layout carousel width and height change over 20 traced frames
    Then the resized layout carousel keeps item 2 aligned, selected and its title opaque

    Examples:
      | variant       | direction |
      | multi-browse  | ltr       |
      | multi-browse  | rtl       |
      | hero          | ltr       |
      | hero          | rtl       |
      | hero-centered | ltr       |
      | hero-centered | rtl       |
      | uncontained   | ltr       |
      | uncontained   | rtl       |
      | fullscreen    | ltr       |
      | fullscreen    | rtl       |

  Scenario Outline: Simultaneous resizes batch and disconnected carousels recover independently
    Given all five layout carousel variants in "<direction>" at 900px with item 2 selected
    When all layout carousels resize together across 30 traced frames
    Then all layout carousels keep item 2 aligned at 465px width and 314px height
    When the first layout carousel disconnects and the others resize to 600px by 300px
    Then the connected layout carousels keep item 2 aligned and its title opaque
    When the disconnected layout carousel reconnects at 600px width
    Then all reconnected layout carousels independently retain selection and title opacity

    Examples:
      | direction |
      | ltr       |
      | rtl       |

  Scenario: Multi-browse fits a large, medium and small arrangement
    Given a default eight-item multi-browse layout carousel
    When the default arrangement layout carousel geometry is measured
    Then the layout carousel shows descending positive sizes ending at 420px

  Scenario: Hiding an item updates layout and restores its authored styles
    Given a centered hero layout carousel whose first item has an important scale transform
    When the layout carousel first item is hidden
    Then the layout carousel excludes that item, restores its authored styles and aligns the next item
