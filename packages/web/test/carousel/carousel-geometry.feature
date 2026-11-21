Feature: Carousel geometry
  Carousel geometry calculates responsive item sizes and positions for every scroll offset.

  Rule: Carousel geometry caching

    Scenario Outline: <variant> carousel geometry reuses only adjacent responsive arrangements
      Given a carousel geometry configured with:
        | variant   | count | viewportSize | gap | baseSize | preferredSize |
        | <variant> | 32    | 420          | 8   | 280      | 186           |
      When the carousel geometry is sampled between snaps while counting arrangement builds:
        | index | fraction |
        | 5     | 0.25     |
        | 5     | 0.75     |
        | 6     | 0.25     |
        | 5     | 0.25     |
        | 20    | 0.25     |
        | 5     | 0.25     |
      Then the carousel geometry cumulative arrangement builds are "2, 2, 3, 4, 6, 8"

      Examples:
        | variant       |
        | multi-browse  |
        | hero          |
        | hero-centered |

    Scenario Outline: <variant> carousel geometry keeps cached results independent with <count> items
      Given a carousel geometry configured with:
        | variant   | count   | viewportSize | gap | baseSize | preferredSize |
        | <variant> | <count> | 800          | 8   | 280      | 180           |
      When the carousel geometry is sampled at every snap and midpoint forwards then backwards, mutating each result
      Then every carousel geometry sample matches a freshly created carousel geometry
      And a carousel geometry resized to a 420 pixel viewport matches a fresh carousel geometry at the start
      And the carousel geometry still matches a fresh carousel geometry at the start

      Examples:
        | variant       | count |
        | multi-browse  | 2     |
        | multi-browse  | 8     |
        | multi-browse  | 32    |
        | hero          | 2     |
        | hero          | 8     |
        | hero          | 32    |
        | hero-centered | 2     |
        | hero-centered | 8     |
        | hero-centered | 32    |

  Rule: Carousel geometry arrangements

    Scenario Outline: <variant> carousel geometry matches Compose arrangement counts and fitted widths in <viewport> pixels preferring <preferred>
      Given a carousel geometry configured with:
        | variant   | count | viewportSize | gap   | baseSize | preferredSize |
        | <variant> | 10    | <viewport>   | <gap> | 280      | <preferred>   |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry items visible beyond a 0.001 pixel margin measure approximately "<sizes>"
      And the carousel geometry items visible beyond a 0.001 pixel margin are separated by gap <gap>

      Examples:
        | variant       | viewport | preferred | gap | sizes                      |
        | hero          | 420      | 220       | 8   | 182, 182, 40               |
        | hero          | 800      | 180       | 8   | 180, 180, 180, 180, 48     |
        | hero-centered | 420      | 220       | 8   | 158, 158, 40, 40           |
        | hero-centered | 800      | 180       | 8   | 170, 170, 170, 170, 40, 40 |
        | hero-centered | 980      | 300       | 0   | 300, 300, 300, 40, 40      |
        | multi-browse  | 420      | 186       | 8   | 182, 182, 40               |
        | multi-browse  | 420      | 400       | 8   | 372, 40                    |
        | multi-browse  | 800      | 280       | 8   | 280, 280, 168, 48          |

    Scenario Outline: Carousel geometry shrinks the first multi-browse item before moving it out with base size <base>
      Given a carousel geometry configured with:
        | variant      | count | viewportSize | gap | baseSize |
        | multi-browse | 8     | 420          | 8   | <base>   |
      When the first carousel geometry item is tracked every 10 pixels of scroll until it exits
      Then the first carousel geometry item shrinks against the leading edge while it is larger than the small size
      And the first carousel geometry item has exited the viewport

      Examples:
        | base |
        | 186  |
        | 280  |

    Scenario Outline: A single default <variant> carousel geometry fills the viewport
      Given a carousel geometry configured with:
        | variant   | count | viewportSize | gap | baseSize |
        | <variant> | 1     | 420          | 8   | 160      |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry focal size is exactly 420
      And the carousel geometry maximum scroll is exactly 0
      And the carousel geometry returns 1 item
      And the carousel geometry item at index 0 is exactly 420 pixels at position 210

      Examples:
        | variant       |
        | hero          |
        | hero-centered |

    Scenario: Multi-browse carousel geometry omits the medium preview when two large items fit better
      Given a carousel geometry configured with:
        | variant      | count | viewportSize | gap | baseSize | preferredSize |
        | multi-browse | 8     | 420          | 8   | 150      | 186           |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry returns 8 items
      And the carousel geometry items at indexes "0, 1" have the focal size
      And the carousel geometry item at index 2 is smaller than the item at index 1
      And the carousel geometry item at index 2 measures exactly 40 pixels
      And the carousel geometry item at index 2 ends at 420
      And the carousel geometry item at index 3 starts after 420
      And the carousel geometry items are separated by gap 8

    Scenario Outline: Carousel geometry fits a large item and a small preview in <viewport> pixels when the preference nearly fills it
      Given a carousel geometry configured with:
        | variant      | count | viewportSize | gap | baseSize |
        | multi-browse | 8     | <viewport>   | 8   | 400      |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry item at index 1 is smaller than the item at index 0
      And the carousel geometry item at index 1 measures more than 1 pixel
      And the carousel geometry item at index 1 ends at <viewport>

      Examples:
        | viewport |
        | 100      |
        | 420      |

    Scenario Outline: Carousel geometry keeps a short multi-browse list of <count> items visible at both ends
      Given a carousel geometry configured with:
        | variant      | count   | viewportSize | gap | baseSize |
        | multi-browse | <count> | 420          | 8   | 280      |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry item at index 0 starts at 0
      And the carousel geometry items are separated by gap 8
      When the carousel geometry is evaluated at its maximum scroll
      Then the carousel geometry item at index <last> ends at 420
      And the carousel geometry items at indexes "<last>" have the focal size
      And the carousel geometry items are separated by gap 8

      Examples:
        | count | last |
        | 2     | 1    |
        | 3     | 2    |

    Scenario: Multi-browse carousel geometry fills the viewport with a large-medium-small progression
      Given a carousel geometry configured with:
        | variant      | count | viewportSize | gap | baseSize | preferredSize |
        | multi-browse | 8     | 420          | 8   | 180      | 280           |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry item at index 0 measures approximately 242.8 pixels
      And the carousel geometry item at index 1 measures approximately 121.2 pixels
      And the carousel geometry item at index 1 is smaller than the item at index 0
      And the carousel geometry item at index 2 is smaller than the item at index 1
      And the carousel geometry item at index 2 ends at 420
      And the first 3 carousel geometry items are separated by gap 8

    Scenario: Default start hero carousel geometry fits its preview beside the large item
      Given a carousel geometry configured with:
        | variant | count | viewportSize | gap | baseSize |
        | hero    | 8     | 420          | 8   | 160      |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry item at index 0 is exactly the focal size
      And the carousel geometry item at index 1 is smaller than the item at index 0
      And the carousel geometry item at index 1 starts 8 pixels after the item at index 0 ends
      And the carousel geometry item at index 1 ends at 420

  Rule: Carousel geometry selections and scrolling

    Scenario: Every multi-browse carousel geometry selection is fully visible at full focal size
      Given a carousel geometry configured with:
        | variant      | count | viewportSize | gap | baseSize | preferredSize |
        | multi-browse | 8     | 420          | 8   | 160      | 186           |
      When the carousel geometry is evaluated at each item's snap position
      Then every carousel geometry snap returns 8 items
      And every selected carousel geometry item has the focal size
      And every selected carousel geometry item lies within the viewport with 0 pixel tolerance
      And the first selected carousel geometry item starts at 0
      And the last selected carousel geometry item ends at 420
      And every carousel geometry snap offset lies within the scroll range
      And every carousel geometry snap is separated by gap 8
      When the carousel geometry is evaluated at the midpoint between snaps 3 and 4 and 0.01 pixels beyond it
      Then the carousel geometry items move less than 0.1 pixels across each boundary
      And the carousel geometry items are separated by gap 8
      And the carousel geometry items past each boundary are separated by gap 8

    Scenario: Start hero carousel geometry shrinks nonfocal items and keeps gaps while scrolling smoothly
      Given a carousel geometry configured with:
        | variant | count | viewportSize | gap | baseSize | preferredSize |
        | hero    | 6     | 420          | 8   | 200      | 220           |
      When the carousel geometry is evaluated at the snap for item 2
      Then the carousel geometry items at indexes "2" have the focal size
      And the carousel geometry item at index 2 is centered at half the focal size
      And a carousel geometry item other than index 2 is smaller than the focal size
      And the carousel geometry items are separated by gap 8
      When the carousel geometry is evaluated at the midpoint between snaps 2 and 3 and 0.1 pixels beyond it
      Then the carousel geometry item sizes and positions change across each boundary
      And the carousel geometry items are separated by gap 8
      When the carousel geometry is evaluated at the snap for item 5
      Then the carousel geometry item at index 5 ends at 420

    Scenario: Centered hero carousel geometry shrinks nonfocal items and keeps gaps while scrolling smoothly
      Given a carousel geometry configured with:
        | variant       | count | viewportSize | gap | baseSize | preferredSize |
        | hero-centered | 6     | 420          | 8   | 200      | 220           |
      When the carousel geometry is evaluated at the snap for item 2
      Then the carousel geometry items at indexes "2, 3" have the focal size
      And the carousel geometry items at indexes 2 and 3 are centered together at 210
      And a carousel geometry item other than index 2 is smaller than the focal size
      And the carousel geometry items are separated by gap 8
      When the carousel geometry is evaluated at the midpoint between snaps 2 and 3 and 0.1 pixels beyond it
      Then the carousel geometry item sizes and positions change across each boundary
      And the carousel geometry items are separated by gap 8

    Scenario Outline: <variant> carousel geometry grows masks with <count> items while preserving space for previews
      Given a carousel geometry configured with:
        | variant   | count   | viewportSize | gap | baseSize |
        | <variant> | <count> | 420          | 8   | 280      |
      When each carousel geometry snap transition is sampled at fractions "0.01, 0.25, 0.5, 0.75, 0.99"
      Then each incoming carousel geometry item is larger halfway than at the start of its transition
      And every carousel geometry transition sample is separated by gap 8
      And no carousel geometry transition sample exceeds the focal size
      And each incoming carousel geometry item grows within its target size and revealed space
      And each carousel geometry transition converges within 0.01 pixels of its destination snap

      Examples:
        | variant       | count |
        | hero          | 2     |
        | hero          | 5     |
        | hero-centered | 2     |
        | hero-centered | 5     |

    Scenario Outline: <variant> carousel geometry only clips responsive masks after they reach the small size in <viewport> pixels
      Given a carousel geometry configured with:
        | variant   | count | viewportSize | gap | baseSize |
        | <variant> | 8     | <viewport>   | 8   | 280      |
      When the carousel geometry is sampled at 100 even intervals across its scroll range
      Then every clipped carousel geometry item has the small size
      And at least one carousel geometry sample clips an item
      And every carousel geometry sample is separated by gap 8

      Examples:
        | variant       | viewport |
        | multi-browse  | 420      |
        | multi-browse  | 800      |
        | hero          | 420      |
        | hero          | 800      |
        | hero-centered | 420      |
        | hero-centered | 800      |

    Scenario Outline: <variant> carousel geometry does not bring an outgoing leading preview back into <viewport> pixels
      Given a carousel geometry configured with:
        | variant   | count | viewportSize | gap | baseSize |
        | <variant> | 5     | <viewport>   | 8   | 280      |
      When the outgoing leading carousel geometry preview is tracked from snaps 1 through 3 in 300 steps each
      Then the outgoing leading carousel geometry preview never moves back toward the viewport

      Examples:
        | variant       | viewport |
        | hero          | 420      |
        | hero          | 800      |
        | hero-centered | 420      |
        | hero-centered | 800      |

    Scenario Outline: Start hero carousel geometry with <count> items stays start-aligned until the end
      Given a carousel geometry configured with:
        | variant | count   | viewportSize | gap | baseSize |
        | hero    | <count> | 420          | 8   | 160      |
      When the carousel geometry is evaluated at each item's snap position
      Then each nonfinal selected carousel geometry item starts at 0 with its successor ending at 420 and its predecessor out of view
      And the final selected carousel geometry item ends at 420 with its predecessor starting at 0
      And every carousel geometry snap is separated by gap 8

      Examples:
        | count |
        | 2     |
        | 5     |

    Scenario Outline: Centered hero carousel geometry with <count> items retains its previews at the ends
      Given a carousel geometry configured with:
        | variant       | count   | viewportSize | gap | baseSize |
        | hero-centered | <count> | 420          | 8   | 160      |
      When the carousel geometry is evaluated at the snaps "<snaps>"
      Then every carousel geometry snap shows <previews> previews beside its selected item spanning 420 pixels
      And every carousel geometry snap is separated by gap 8

      Examples:
        | count | snaps   | previews |
        | 2     | 0, 1    | 1        |
        | 5     | 0, 2, 4 | 2        |

    Scenario: Centered hero carousel geometry moves continuously through its inner snaps
      Given a carousel geometry configured with:
        | variant       | count | viewportSize | gap | baseSize |
        | hero-centered | 5     | 420          | 8   | 160      |
      When the carousel geometry is evaluated 0.01 pixels either side of the snaps "1, 3"
      Then the carousel geometry items move less than 0.1 pixels across each boundary

    Scenario Outline: Centered hero carousel geometry keeps its small previews the same size after scrolling in <viewport> pixels
      Given a carousel geometry configured with:
        | variant       | count | viewportSize | gap | baseSize |
        | hero-centered | 5     | <viewport>   | 8   | 280      |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry item at index 1 measures between 40 and 56 pixels
      When the carousel geometry is evaluated at the snaps "1, 2, 3"
      Then every selected carousel geometry item has starting-size previews aligned to both viewport edges
      And every carousel geometry snap is separated by gap 8

      Examples:
        | viewport |
        | 334      |
        | 420      |
        | 800      |

  Rule: Carousel geometry size limits

    Scenario Outline: <variant> carousel geometry uses configured small-item limits
      Given a carousel geometry configured with:
        | variant   | count | viewportSize | gap | baseSize | minSmallSize | maxSmallSize | maxLargeSize |
        | <variant> | 8     | 420          | 8   | 280      | 60           | 72           | 220          |
      When the carousel geometry is evaluated at scroll 0
      Then the smallest visible carousel geometry item measures between 60 and 72 pixels
      And the carousel geometry focal size is at most 220
      And the carousel geometry items are separated by gap 8

      Examples:
        | variant       |
        | multi-browse  |
        | hero          |
        | hero-centered |

    Scenario Outline: Multi-browse carousel geometry fits the default small-item range with preferred size <preferred>
      Given a carousel geometry configured with:
        | variant      | count | viewportSize | gap | baseSize | preferredSize |
        | multi-browse | 8     | 420          | 8   | 280      | <preferred>   |
      When the carousel geometry is evaluated at scroll 0
      Then the last carousel geometry item starting inside the viewport measures between 40 and 56 pixels and ends at 420

      Examples:
        | preferred |
        | 186       |
        | 280       |
        | 400       |

    Scenario Outline: <variant> carousel geometry large items follow inward drags equally at both ends with <count> items
      Given a carousel geometry configured with:
        | variant   | count   | viewportSize | gap | baseSize | preferredSize |
        | <variant> | <count> | 1200         | 8   | 280      | 280           |
      Then the first 4 carousel geometry items at the start and the last 4 at the end are exactly the focal size
      When the carousel geometry is dragged inward by "5, 30, 50" pixels from each end
      Then the fourth carousel geometry item from each end follows each inward drag
      When the carousel geometry is evaluated 0.001 pixels either side of the snaps "<snaps>"
      Then the carousel geometry items never move backward across each boundary
      And the carousel geometry items move less than 0.01 pixels across each boundary
      And the carousel geometry items past each boundary are separated by gap 8

      Examples:
        | variant       | count | snaps               |
        | multi-browse  | 8     | 0, 1, 2, 4, 6, 7    |
        | multi-browse  | 64    | 0, 1, 2, 32, 62, 63 |
        | hero          | 8     | 0, 1, 2, 4, 6, 7    |
        | hero          | 64    | 0, 1, 2, 32, 62, 63 |
        | hero-centered | 8     | 0, 1, 2, 4, 6, 7    |
        | hero-centered | 64    | 0, 1, 2, 32, 62, 63 |

    Scenario Outline: Centered hero carousel geometry drops previews below Compose's fullscreen threshold in <viewport> pixels
      Given a carousel geometry configured with:
        | variant       | count | viewportSize | gap | baseSize |
        | hero-centered | 5     | <viewport>   | 8   | 280      |
      When the carousel geometry is evaluated at the snap for item 2
      Then exactly one carousel geometry item is visible and it fills the viewport

      Examples:
        | viewport |
        | 40       |
        | 60       |
        | 100      |

    Scenario Outline: Short <variant> carousel geometry preserves preferred widths when it already fits
      Given a carousel geometry configured with:
        | variant   | count | viewportSize | gap | baseSize | preferredSize |
        | <variant> | 2     | 800          | 8   | 280      | 180           |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry focal size is exactly 180
      And the carousel geometry maximum scroll is exactly 0
      And the carousel geometry item sizes are exactly "180, 180"

      Examples:
        | variant       |
        | hero          |
        | hero-centered |

    Scenario Outline: Short centered hero carousel geometry with <count> items never reverses while revealing the last item
      Given a carousel geometry configured with:
        | variant       | count   | viewportSize | gap | baseSize | preferredSize |
        | hero-centered | <count> | <viewport>   | 8   | 280      | 320           |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry item at index <last> is smaller than the focal size
      When the carousel geometry is sampled at 100 even intervals across its scroll range
      Then the carousel geometry items never move backward between consecutive samples
      And every carousel geometry sample after the start is separated by gap 8
      When the carousel geometry is evaluated at its maximum scroll
      Then the carousel geometry items at indexes "<last>" have the focal size
      And the carousel geometry item at index <last> ends at <viewport>

      Examples:
        | count | viewport | last |
        | 3     | 510      | 2    |
        | 4     | 900      | 3    |
        | 5     | 1200     | 4    |

    Scenario: Short centered hero carousel geometry start-aligns and fully reveals its last item
      Given a carousel geometry configured with:
        | variant       | count | viewportSize | gap | baseSize | preferredSize |
        | hero-centered | 3     | 420          | 8   | 280      | 180           |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry item sizes are exactly "180, 180, 44"
      And the carousel geometry item at index 0 starts exactly at 0
      When the carousel geometry is evaluated at its maximum scroll
      Then the carousel geometry item at index 2 measures exactly 180 pixels
      And the carousel geometry item at index 2 ends exactly at 420

    Scenario: Fitting centered hero carousel geometry does not scroll
      Given a carousel geometry configured with:
        | variant       | count | viewportSize | gap | baseSize | preferredSize |
        | hero-centered | 5     | 420          | 8   | 280      | 80            |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry maximum scroll is exactly 0
      And the carousel geometry item sizes are exactly "75, 75, 75, 75, 75"

    Scenario Outline: <variant> carousel geometry reserves its small previews in <viewport> pixels with preferred size "<preferred>"
      Given a carousel geometry configured with:
        | variant   | count | viewportSize | gap | baseSize | preferredSize |
        | <variant> | 8     | <viewport>   | 8   | 160      | <preferred>   |
      When the carousel geometry is evaluated at scroll 0
      Then the visible carousel geometry previews number <previews> and each measures between 40 and 56 pixels
      And the last visible carousel geometry preview ends at <viewport>
      And the carousel geometry items are separated by gap 8

      Examples:
        | variant       | viewport | preferred | previews |
        | hero          | 420      |           | 1        |
        | hero          | 800      |           | 1        |
        | hero          | 420      | 220       | 1        |
        | hero          | 800      | 180       | 1        |
        | hero-centered | 420      |           | 2        |
        | hero-centered | 800      |           | 2        |
        | hero-centered | 420      | 220       | 2        |
        | hero-centered | 800      | 180       | 2        |

  Rule: Carousel geometry alignment

    Scenario: Centered hero carousel geometry aligns its first, intermediate, and last selections
      Given a carousel geometry configured with:
        | variant       | count | viewportSize | gap | baseSize |
        | hero-centered | 3     | 140          | 8   | 80       |
      When the carousel geometry is evaluated at the snap for item 0
      Then the carousel geometry item at index 0 starts exactly at 0
      And the carousel geometry item at index 0 ends within 140
      When the carousel geometry is evaluated at the snap for item 1
      Then the carousel geometry item at index 1 is centered at 70
      When the carousel geometry is evaluated at the snap for item 2
      Then the carousel geometry item at index 2 ends at 140
      And the carousel geometry snap for item 2 is exactly the maximum scroll

    Scenario Outline: <variant> carousel geometry can show multiple large items with a preferred width
      Given a carousel geometry configured with:
        | variant   | count | viewportSize | gap | baseSize | preferredSize |
        | <variant> | 8     | 800          | 8   | 240      | 180           |
      When the carousel geometry is evaluated at scroll 0
      Then more than one fully visible carousel geometry item is exactly the focal size
      And the carousel geometry items are separated by gap 8

      Examples:
        | variant       |
        | hero-centered |
        | hero          |

    Scenario: Start hero carousel geometry keeps the viewport filled near the end with multiple large items
      Given a carousel geometry configured with:
        | variant | count | viewportSize | gap | baseSize | preferredSize |
        | hero    | 8     | 800          | 8   | 240      | 180           |
      When the carousel geometry is evaluated at each item's snap position
      Then every selected carousel geometry item has the focal size
      And every selected carousel geometry item lies within the viewport with 0.001 pixel tolerance
      And every carousel geometry snap has items touching both viewport edges
      And every carousel geometry snap is separated by gap 8

  Rule: Carousel geometry uncontained and fullscreen variants

    Scenario: Uncontained carousel geometry preserves content sizes and clamps both edges
      Given a carousel geometry configured with:
        | variant     | count | viewportSize | gap | baseSize |
        | uncontained | 5     | 100          | 7.5 | 140      |
      Then the carousel geometry focal size is exactly 100
      And the carousel geometry maximum scroll is exactly 430
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry returns 5 items
      When the carousel geometry is evaluated at scroll -10
      Then the carousel geometry item at index 0 is centered exactly at 50
      When the carousel geometry is evaluated at its maximum scroll
      Then the carousel geometry item at index 4 plus half the focal size is exactly 100

    Scenario: Uncontained carousel geometry ignores a smaller preferred size
      Given a carousel geometry configured with:
        | variant     | count | viewportSize | gap | baseSize | preferredSize |
        | uncontained | 4     | 100          | 8   | 60       | 25            |
      Then the carousel geometry focal size is exactly 60
      And the carousel geometry maximum scroll is exactly 164

    Scenario: Fullscreen carousel geometry fills the viewport and clamps both edges
      Given a carousel geometry configured with:
        | variant    | count | viewportSize | gap | baseSize |
        | fullscreen | 4     | 500          | 20  | 120      |
      Then the carousel geometry focal size is exactly 500
      And the carousel geometry maximum scroll is exactly 1560
      And the carousel geometry snap for item 2 is exactly 1040
      When the carousel geometry is evaluated at its maximum scroll
      Then the carousel geometry item at index 3 is centered exactly at 250
      When the carousel geometry is evaluated 1 pixel past its maximum scroll
      Then the carousel geometry returns 4 items

    Scenario: Uncontained carousel geometry interpolates edge keylines and shifts its final full item to the end
      Given a carousel geometry configured with:
        | variant     | count | viewportSize | gap | baseSize |
        | uncontained | 5     | 420          | 8   | 160      |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry item sizes at indexes "0, 1" are exactly "160, 160"
      And the carousel geometry item at index 2 is exactly 126 pixels at position 399
      When the carousel geometry is evaluated at scroll 80
      Then the carousel geometry item at index 0 measures approximately 113.809524 pixels
      And the carousel geometry item at index 0 is centered at 23.095238
      And the carousel geometry item at index 2 measures approximately 142.190476 pixels
      When the carousel geometry is evaluated at its maximum scroll
      Then the carousel geometry item at index 4 is exactly 160 pixels at position 340
      And the carousel geometry item at index 2 is exactly 126 pixels at position 21
      When the carousel geometry is sampled at every whole pixel of its scroll range
      Then the visible items in every carousel geometry sample are separated by gap 8

    Scenario Outline: Uncontained carousel geometry keeps endpoint items full-sized in <viewport> pixels
      Given a carousel geometry configured with:
        | variant     | count | viewportSize | gap | baseSize |
        | uncontained | 8     | <viewport>   | 8   | 160      |
      When the carousel geometry is evaluated at scroll 0
      Then the carousel geometry items at indexes "0" have the focal size
      And the carousel geometry item at index 0 starts at 0
      When the carousel geometry is evaluated at its maximum scroll
      Then the carousel geometry items at indexes "7" have the focal size
      And the carousel geometry item at index 7 ends at <viewport>
      When the carousel geometry is evaluated at half its maximum scroll
      Then the visible carousel geometry items are separated by gap 8

      Examples:
        | viewport |
        | 100      |
        | 160      |
        | 168      |
        | 300      |
        | 328      |
        | 336      |
        | 420      |
        | 900      |

  Rule: Carousel geometry reduced motion and empty input

    Scenario Outline: Reduced-motion <variant> carousel geometry keeps uniform fixed tracks
      Given a carousel geometry configured with:
        | variant   | count | viewportSize | gap | baseSize | reducedMotion |
        | <variant> | 8     | 420          | 8   | 280      | true          |
      When the carousel geometry is scrolled from 0 to 100
      Then every carousel geometry item keeps exactly the focal size and moves by the scrolled distance
      When the carousel geometry is evaluated at the snap for item 2
      Then the carousel geometry item at index 2 starts at 0
      When the carousel geometry is evaluated at the snap for item 7
      Then the carousel geometry item at index 7 ends at 420

      Examples:
        | variant      |
        | multi-browse |
        | hero         |
        | uncontained  |

    Scenario: Reduced-motion centered hero carousel geometry keeps uniform fixed tracks
      Given a carousel geometry configured with:
        | variant       | count | viewportSize | gap | baseSize | reducedMotion |
        | hero-centered | 8     | 420          | 8   | 280      | true          |
      When the carousel geometry is scrolled from 0 to 100
      Then every carousel geometry item keeps exactly the focal size and moves by the scrolled distance
      When the carousel geometry is evaluated at the snap for item 2
      Then the carousel geometry item at index 2 is centered at 210
      When the carousel geometry is evaluated at the snap for item 7
      Then the carousel geometry item at index 7 ends at 420

    Scenario Outline: Carousel geometry is unavailable for <reason>
      Given a carousel geometry configured with:
        | variant      | count   | viewportSize | gap | baseSize |
        | multi-browse | <count> | <viewport>   | 12  | 160      |
      When the carousel geometry is created
      Then no carousel geometry is produced

      Examples:
        | reason          | count | viewport |
        | empty content   | 0     | 400      |
        | a zero viewport | 3     | 0        |
