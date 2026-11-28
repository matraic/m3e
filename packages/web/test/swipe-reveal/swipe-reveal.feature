Feature: Swipe reveal
  Swipe-reveal items uncover actions through gestures or programmatic controls.

  Rule: Actions reveal on the correct side

    Scenario Outline: Shared and side-specific action shapes resolve in each direction
      Given a swipe-reveal item "a" with direction "<direction>"
      And reduced motion is enabled for swipe reveal
      When the swipe-reveal fixture renders
      Then shared and side-specific action shape families resolve

      Examples:
        | direction |
        | ltr       |
        | rtl       |

    Scenario: Rounded content and action backgrounds keep independent shapes while dragging
      Given the swipe-reveal fixture is
        """
        <m3e-swipe-reveal id="a" style="width: 400px; --m3e-swipe-reveal-actions-container-color: #e8def8; --m3e-swipe-reveal-actions-container-shape: 12px; --m3e-swipe-reveal-actions-container-shape-family: bevel">
          <m3e-icon-button slot="leading" aria-label="Pin" variant="tonal">+</m3e-icon-button>
          <m3e-icon-button slot="trailing" aria-label="Delete" variant="tonal">-</m3e-icon-button>
          <m3e-list-item style="--m3e-list-item-container-shape: 4px">Content</m3e-list-item>
        </m3e-swipe-reveal>
        """
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it 60 pixels
      Then action backgrounds stay independent from the dragged rounded content
      When the user releases the pointer
      Then the rounded content and action container return to their resting shapes

    Scenario: A new item starts covered with no active side
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      Then item "a" has state "covered"
      And item "a" has no active side

    Scenario: A single touch movement captures the pointer and completes a swipe
      Given the swipe-reveal fixture is
        """
        <m3e-swipe-reveal id="a" style="width: 400px">
          <button slot="leading" style="width: 80px; height: 56px">Pin</button>
          <button id="child" style="width: 400px; height: 56px">Content</button>
        </m3e-swipe-reveal>
        """
      When the swipe-reveal fixture renders
      And the application observes pointer capture on the child content
      And the user touches item "a" and moves 100 pixels horizontally
      Then item "a" is revealing and owns the touch pointer
      When the user ends the touch
      Then item "a" has state "revealed"

    Scenario: A reversed horizontal touch drag continues through slight vertical drift
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the user moves a touch horizontally, reverses it with vertical drift, then moves outward again
      Then item "a" continues tracking the horizontal drag
      When the user ends the touch
      Then item "a" has state "revealed"

    Scenario: A horizontal touch drag owns the gesture through vertical movement and reversal
      Given the swipe-reveal fixture is
        """
        <div id="scroller" style="height: 150px; overflow: auto">
          <div style="height: 100px"></div>
          <m3e-swipe-reveal id="a" style="display: block; width: 400px">
            <button slot="leading" style="width: 80px; height: 56px">Pin</button>
            <button slot="trailing" style="width: 80px; height: 56px">Delete</button>
            <div style="height: 56px; background: white">Content a</div>
          </m3e-swipe-reveal>
          <div style="height: 700px"></div>
        </div>
        """
      When the swipe-reveal fixture renders
      And the application sets the scroller position to 50 pixels
      And the application observes touch-move cancellation on item "a"
      And the user begins a horizontal touch drag, then moves vertically and reverses it
      Then the reveal owns all touch moves without scrolling the ancestor
      When the user ends the touch

    Scenario: Touch ownership survives pointer cancellation and resets for the next gesture
      Given the swipe-reveal fixture is
        """
        <div id="scroller" style="height: 150px; overflow: auto">
          <div style="height: 100px"></div>
          <m3e-swipe-reveal id="a" style="display: block; width: 400px">
            <button slot="leading" style="width: 80px; height: 56px">Pin</button>
            <button slot="trailing" style="width: 80px; height: 56px">Delete</button>
            <div style="height: 56px; background: white">Content a</div>
          </m3e-swipe-reveal>
          <div style="height: 700px"></div>
        </div>
        """
      When the swipe-reveal fixture renders
      And the application sets the scroller position to 50 pixels
      And the user starts a horizontal touch, cancels its pointer, then moves vertically
      Then the canceled gesture continues to prevent scrolling
      When the user ends the touch
      And the user starts a new vertical touch and scrolls the ancestor
      Then the new gesture scrolls the ancestor
      When the user ends the touch

    Scenario: Touch taps reach content and vertical gestures scroll without revealing
      Given the swipe-reveal fixture is
        """
        <div id="scroller" style="height: 150px; overflow: auto">
          <div style="height: 700px">
            <m3e-swipe-reveal id="a" style="width: 300px">
              <button slot="leading">Action</button>
              <button id="child" style="width: 200px; height: 56px">Content</button>
            </m3e-swipe-reveal>
          </div>
        </div>
        """
      When the swipe-reveal fixture renders
      And the application observes clicks and prevented touch moves on the child content
      And the user taps the child content
      Then the child content receives the click
      When the user scrolls vertically over the child content
      Then the ancestor scrolls without revealing the item or preventing the touch
      When the user ends the touch

    Scenario: Content suppresses tap highlight without disabling selection or focus
      Given the swipe-reveal fixture is
        """
        <m3e-swipe-reveal id="a">
          <button slot="leading">Action</button>
          <a href="#target">Selectable content</a>
        </m3e-swipe-reveal>
        """
      When the swipe-reveal fixture renders
      Then the content and link suppress tap highlight but allow selection
      When the user tabs to the link
      Then the link receives focus

    Scenario: Programmatic reveal opens the requested side and emits its lifecycle events
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the application observes "revealing,revealed" events on item "a"
      And the application reveals item "a" on the "trailing" side
      Then item "a" has state "revealed" on the "trailing" side
      And item "a" emitted events "revealing,revealed"

    Scenario: Only actions on the revealed side can receive focus
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the application reveals item "a" on the "leading" side
      Then only the "leading" actions on item "a" are focusable
      When the application reveals item "a" on the "trailing" side
      Then only the "trailing" actions on item "a" are focusable

    Scenario: Reveal and covered events carry their side
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the application observes side details for "revealing,revealed,covered" on item "a"
      And the application reveals item "a" on the "leading" side
      And item "a" settles
      And the application closes item "a"
      And item "a" settles
      And the user drags item "a" by -120 pixels at "fast" speed
      And item "a" settles
      Then item "a" emitted side events "revealing:leading,revealed:leading,covered:leading,revealing:trailing,revealed:trailing"

    Scenario: Revealing a side without actions has no effect
      Given the swipe-reveal fixture is
        """
        <m3e-swipe-reveal id="a"><button slot="trailing">Delete</button><div>Content</div></m3e-swipe-reveal>
        """
      When the swipe-reveal fixture renders
      And the application reveals item "a" on the "leading" side
      Then item "a" has state "covered"

    Scenario: Closing a revealed item emits its covered event
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the application reveals item "a" on the "leading" side
      And the application observes "covered" events on item "a"
      And the application closes item "a"
      Then item "a" has state "covered"
      And item "a" emitted events "covered"

    Scenario Outline: Vertical movement does not interrupt settling to a stable state
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And item "a" begins settling to "<target>"
      And the user moves vertically during the animation
      Then item "a" settles to "<target>" and releases temporary action widths

      Examples:
        | target   |
        | revealed |
        | covered  |

    Scenario: A gesture can begin vertically and drag horizontally after settling
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the user starts a vertical drag and then moves 50 pixels horizontally
      Then the horizontal drag takes over from the settled position
      When the user releases the pointer
      Then item "a" stops revealing

    Scenario: A horizontal drag takes over from the current animated position
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the application starts a reveal animation beneath the pointer
      And the user drags 40 pixels horizontally after a vertical movement
      Then the content follows the pointer from its current position
      When the user releases the pointer
      Then item "a" has state "revealed"

    Scenario Outline: A fling reveals the action side indicated by its direction
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the user drags item "a" by <distance> pixels at "fast" speed
      Then item "a" has state "revealed" on the "<side>" side

      Examples:
        | distance | side     |
        | -120     | trailing |
        | 120      | leading  |

    Scenario: A slow drag past the reveal threshold reveals the item
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the user drags item "a" by -70 pixels at "slow" speed
      Then item "a" has state "revealed"

    Scenario: A slow drag short of the reveal threshold returns to covered
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the user drags item "a" by -20 pixels at "slow" speed
      Then item "a" has state "covered"

    Scenario: Dragging back over the opposite side covers the revealed item
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the user drags item "a" by -120 pixels at "fast" speed
      And item "a" settles
      And the user drags item "a" by 70 pixels at "fast" speed
      Then item "a" has state "covered"

    Scenario: Reversing a pointer drag repeatedly keeps tracking both sides
      Given a segmented list with swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the pointer reverses direction across item "a" 20 times
      Then item "a" settles on the "trailing" side

    Scenario: Repeated touch reversals with vertical drift continue tracking both sides
      Given a segmented list with swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And a touch reverses direction across item "a" with vertical drift 20 times
      Then item "a" returns to the covered state

    Scenario Outline: Action buttons retain natural width when changing sides
      Given a swipe-reveal item with "<tag>" actions
      When the swipe-reveal fixture renders
      And the user first reveals the "<first>" side and then switches sides
      Then the new action side settles at its natural width

      Examples:
        | tag             | first    |
        | m3e-icon-button | leading  |
        | m3e-icon-button | trailing |
        | m3e-button      | leading  |
        | m3e-button      | trailing |

    Scenario: A fast reversal before release settles with the action fully revealed
      Given a segmented list with swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And touch reverses quickly before release 10 times
      Then the trailing action is fully revealed at its natural width

    Scenario: Rapid alternating touch swipes settle at natural action widths
      Given a segmented list with swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And touch swipes alternate rapidly in both directions
      Then the item settles on its final side at natural action widths

  Rule: Groups coordinate reveals and preserve layout

    Scenario: Only one item is revealed at a time in a group
      Given a swipe-reveal group containing items "a,b"
      When the swipe-reveal fixture renders
      And the application reveals item "a" on the "trailing" side
      And item "a" settles
      And the application reveals item "b" on the "trailing" side
      Then item "b" has state "revealed"
      And item "a" has state "covered"

    Scenario: A tap reveals only when the tap trigger is enabled
      Given a swipe-reveal fixture with a default item "a" and tap-triggered item "b"
      When the swipe-reveal fixture renders
      And the user taps item "a"
      Then item "a" has state "covered"
      When the user taps item "b"
      Then item "b" has state "revealed"

    Scenario: Group settings are inherited unless an item overrides them
      Given a swipe-reveal group with shared settings and an overridden item
      When the swipe-reveal fixture renders
      Then item "a" inherits all group settings
      And item "b" overrides its threshold and inherits the remaining settings

    Scenario: A group exposes its items and current revealed item
      Given a swipe-reveal group containing items "a,b"
      When the swipe-reveal fixture renders
      Then the group exposes both items and no revealed item
      When the application reveals item "b" on the "leading" side
      Then the group reports item "b" as revealed

    Scenario Outline: Revealed content stays in normal flow while scrolling
      Given a swipe-reveal item "a" inside a "<scroller>" scroller
      When the swipe-reveal fixture renders
      And the application reveals item "a" on the "leading" side
      And the "<scroller>" scroller moves
      Then the content remains in flow and aligned with its item

      Examples:
        | scroller |
        | window   |
        | element  |
        | shadow   |

    Scenario: Content can extend beyond its host but is clipped by a scrolling ancestor
      Given a swipe-reveal item "a" in a clipped scrolling ancestor
      When the swipe-reveal fixture renders
      And the application reveals item "a" on the "leading" side
      Then the content extends beyond the host but cannot paint outside the scroller

    Scenario: Content and staggered siblings stay in flow as a shadow scroller moves
      Given two staggered swipe-reveal items inside a shadow scroller
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it 100 pixels
      And the shadow scroller moves by 30 pixels
      Then the active content and sibling shift together in normal flow
      When the user releases the pointer

    Scenario: Removing a dragged item releases its staggered sibling
      Given a swipe-reveal group containing items "a,b" with stagger enabled
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it 100 pixels
      And the application removes swipe-reveal item "a"
      Then item "b" returns to its original styles and position
      When the user releases the pointer

    Scenario: Swipe direction mirrors in right-to-left
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the application sets the document direction to right-to-left
      And the user drags item "a" by 120 pixels at "fast" speed
      Then item "a" has state "revealed" on the "trailing" side

  Rule: Dismissal is configurable and recoverable

    Scenario: A large drag does not dismiss an item that is not dismissible
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the application observes "dismiss,dismissed" events on item "a"
      And the application reveals item "a" on the "trailing" side
      And the user drags item "a" by -380 pixels at "slow" speed
      Then item "a" is not dismissed
      And item "a" emitted no dismissal events

    Scenario: A slow drag beyond the dismiss threshold dismisses
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And the application observes "dismiss,dismissed" events on item "a"
      And the user drags item "a" by -300 pixels at "slow" speed
      Then item "a" has state "dismissed"
      And item "a" emitted events "dismiss,dismissed"

    Scenario: A slow drag short of the dismiss threshold reveals instead
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And the application observes "dismiss,dismissed" events on item "a"
      And the user drags item "a" by -120 pixels at "slow" speed
      Then item "a" has state "revealed"
      And item "a" emitted no dismissal events

    Scenario Outline: Dismiss snapping arms only after actions are fully revealed
      Given a swipe-reveal item with a wide "<side>" action and matching dismissal
      When the swipe-reveal fixture renders
      And the pointer crosses the full action width and moves back
      Then dismissal is armed only beyond the action edge
      When the pointer is released
      Then item "a" remains revealed and is not dismissed

      Examples:
        | side     |
        | leading  |
        | trailing |

    Scenario: Wide actions can be revealed before a second touch dismisses
      Given a swipe-reveal item with three wide trailing actions and dismissal enabled
      When the swipe-reveal fixture renders
      And a long touch swipe reveals all trailing actions
      Then item "a" has state "revealed"
      When a second short touch swipe passes the dismiss threshold
      Then item "a" has state "dismissed"

    Scenario: A fling from rest only reveals
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And the user drags item "a" by -70 pixels at "fast" speed
      Then item "a" has state "revealed"

    Scenario: A fling past the actions from rest dismisses
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And the user drags item "a" by -150 pixels at "fast" speed
      Then item "a" has state "dismissed"

    Scenario: A fling from an already revealed item dismisses
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And the application reveals item "a" on the "trailing" side
      And item "a" settles
      And the user drags item "a" by -150 pixels at "fast" speed
      Then item "a" has state "dismissed"

    Scenario: A side that is not dismissible remains revealed
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And the application observes "dismissed" events on item "a"
      And the user drags item "a" by 300 pixels at "slow" speed
      Then item "a" is not dismissed
      And item "a" emitted no dismissal events

    Scenario: The application can dismiss an item programmatically
      Given a swipe-reveal item "a" with attributes "dismissible='both'"
      When the swipe-reveal fixture renders
      And the application observes "dismissed" events on item "a"
      And the application dismisses item "a" on the "leading" side
      Then item "a" has state "dismissed"
      And item "a" emitted events "dismissed"

    Scenario: A cancelable dismiss event returns the item to rest
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And the application cancels dismiss events on item "a"
      And the application observes "dismissed" events on item "a"
      And the application dismisses item "a" on the "trailing" side
      Then item "a" is not dismissed and is no longer dismissing
      And item "a" emitted no dismissal-complete events

    Scenario Outline: Removing an item during dismissal safely stops the operation
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And the application removes item "a" during its "<dismiss event>" event
      Then the disconnected item is covered and was not dismissed
      When the application reconnects and reveals item "a" on the "trailing" side
      Then item "a" has state "revealed"

      Examples:
        | dismiss event |
        | dismiss       |
        | canceled      |

    Scenario: Dismissal events bubble and include the dismissed side
      Given a swipe-reveal group with trailing dismissal enabled and item "a"
      When the swipe-reveal fixture renders
      And the application observes bubbled dismissal events on the group
      And the application dismisses item "a" on the "trailing" side
      Then the group receives a dismissal event for the "trailing" side

    Scenario: A dismissed item ignores reveal and close until restored
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And the application dismisses item "a" on the "trailing" side
      And item "a" settles
      And the application reveals item "a" on the "trailing" side
      And the application closes item "a"
      Then item "a" remains dismissed

    Scenario: The application can restore a dismissed item
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And the application dismisses item "a" on the "trailing" side
      And item "a" settles
      And the application restores item "a"
      Then item "a" is visible and covered

    Scenario: Dismissing an item collapses its space
      Given a swipe-reveal group containing item "a" with dismissal and item "b"
      When the swipe-reveal fixture renders
      And the application dismisses item "a" on the "trailing" side
      Then item "b" moves into the dismissed item's space

    Scenario: Dismissing the last list item leaves no overflow and can be restored
      Given a segmented list with dismissible swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the application dismisses item "a" on the "trailing" side
      Then the list has no vertical overflow
      When the application restores item "a"
      Then item "a" is visible and the list still has no overflow

    Scenario: A list remains scrollable when other items remain after dismissal
      Given a short segmented list with dismissible items "a,b,c"
      When the swipe-reveal fixture renders
      And the application dismisses item "a" on the "trailing" side
      Then the list remains taller than its viewport
      When the application scrolls the list to its end
      Then the list scroll position advances

    Scenario: Either side can dismiss when both sides are enabled
      Given two swipe-reveal items with dismissal enabled on both sides
      When the swipe-reveal fixture renders
      And the user slowly drags the first item 300 pixels toward leading and the second 300 pixels toward trailing
      Then both items are dismissed

    Scenario: A lower dismiss threshold dismisses after a shorter drag
      Given a swipe-reveal item "a" with attributes "dismissible='trailing' dismiss-threshold='0.3'"
      When the swipe-reveal fixture renders
      And the user drags item "a" by -150 pixels at "slow" speed
      Then item "a" has state "dismissed"

    Scenario: The default dismiss threshold reveals where a lower threshold dismisses
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And the user drags item "a" by -150 pixels at "slow" speed
      Then item "a" has state "revealed"

    Scenario: A paused drag below dismissal threshold does not dismiss on a fast final movement
      Given a swipe-reveal item "a" with attributes "dismissible='trailing'"
      When the swipe-reveal fixture renders
      And a touch drag pauses below dismissal threshold before its final fast movement
      Then item "a" has state "revealed"

    Scenario: Dismissed items are skipped when staggering neighboring items
      Given a staggered swipe-reveal group containing items "a,b,c" with "b" dismissible
      When the swipe-reveal fixture renders
      And the application dismisses item "b" on the "trailing" side
      And the user presses item "a" and drags it -70 pixels
      Then item "c" follows item "a" as the nearest remaining sibling
      When the user releases the pointer

  Rule: Tap and long-press triggers respond only when configured

    Scenario: A double tap reveals only when double-tap is enabled
      Given a swipe-reveal item "a" with attributes "triggers='double-tap'"
      When the swipe-reveal fixture renders
      And the user single-clicks item "a"
      Then item "a" has state "covered"
      When the user double-clicks item "a"
      Then item "a" has state "revealed"

    Scenario: A long press reveals while pressed and release does not close it
      Given a swipe-reveal item "a" with attributes "triggers='long-press tap'"
      When the swipe-reveal fixture renders
      Then swipe-reveal content disables text selection
      When the user presses and holds item "a"
      Then item "a" has state "revealed"
      When the user releases the pointer and waits for the trigger to settle
      Then item "a" remains revealed

    Scenario: A touch long press stays revealed until the next tap
      Given a swipe-reveal item "a" with attributes "triggers='long-press tap'"
      When the swipe-reveal fixture renders
      And the application observes content clicks on item "a"
      And the user long-presses item "a" by touch
      Then item "a" remains revealed after release without clicking content
      When the user taps item "a" by touch
      Then item "a" has state "covered"

    Scenario: A canceled touch long press does not suppress the next click
      Given a swipe-reveal item "a" with attributes "triggers='long-press'"
      When the swipe-reveal fixture renders
      And the user long-presses item "a" and cancels the touch
      And the user starts and ends a new touch on item "a"
      Then item "a" has state "covered"

    Scenario: A short press does not trigger a long-press reveal
      Given a swipe-reveal item "a" with attributes "triggers='long-press'"
      When the swipe-reveal fixture renders
      And the user clicks item "a" and waits briefly
      Then item "a" has state "covered"

  Rule: Staggering, overshoot, and elasticity follow their configuration

    Scenario: Siblings follow a drag with tapering and stop at stagger-count
      Given a swipe-reveal group of four items with stagger "0.5" and stagger-count "2"
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it -70 pixels
      Then the first sibling follows farther than the second and the fourth does not move
      When the user releases the pointer

    Scenario: Staggered siblings return to rest after release
      Given a swipe-reveal group containing items "a,b" with stagger "0.5"
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it -70 pixels
      Then item "b" follows item "a"
      When the user releases the pointer
      Then item "b" returns to its original position and is not a popover

    Scenario: Stagger restores its own styles without overwriting other changes
      Given a swipe-reveal group containing items "a,b" with stagger "0.5"
      When the swipe-reveal fixture renders
      And the application adds important transition and translation styles to item "b"
      And the user presses item "a" and drags it -70 pixels
      And the application changes item "b"'s background
      When the user releases the pointer
      Then stagger cleanup removes only the styles it owns

    Scenario: An item dragged open beside a revealed sibling stays open
      Given a swipe-reveal group containing items "a,b" with stagger "0.5"
      When the swipe-reveal fixture renders
      And the user drags item "a" by -120 pixels at "fast" speed
      And item "a" settles
      And the user presses item "b" and drags it -200 pixels
      And the user releases the pointer
      Then item "a" is covered and item "b" remains revealed after settling

    Scenario: Siblings do not move when stagger is zero
      Given a swipe-reveal group containing items "a,b"
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it -70 pixels
      Then item "b" remains at its original position
      When the user releases the pointer

    Scenario: Content overshoot is limited to the configured amount
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it -300 pixels
      Then content overshoot is limited to the action width plus 8 pixels
      When the user releases the pointer

    Scenario: Zero overshoot stops content at the action edge
      Given a swipe-reveal item "a" with attributes "overshoot='0'"
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it -300 pixels
      Then content stops at the action edge without overshoot
      When the user releases the pointer

    Scenario: Elasticity defaults to both and can be inherited or overridden
      Given a swipe-reveal group with leading elasticity, an override item, and an ungrouped item
      When the swipe-reveal fixture renders
      Then the group item has leading elasticity
      And the override item has no elasticity
      And the ungrouped item has both-side elasticity

    Scenario: Dismissible defaults to none
      Given a swipe-reveal item "a"
      When the swipe-reveal fixture renders
      Then item "a" is not dismissible

    Scenario: Elastic buttons shrink while partially revealed
      Given a swipe-reveal item with one trailing icon button
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it -20 pixels
      Then the trailing action button is narrower than its natural width
      When the user releases the pointer

    Scenario: Buttons keep their size when elasticity is none
      Given a swipe-reveal item "a" with attributes "elastic='none'"
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it -40 pixels
      Then the trailing action button retains its natural width
      When the user releases the pointer

    Scenario: The action container does not grow with overshoot when elasticity is none
      Given a swipe-reveal item "a" with attributes "elastic='none'"
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it -300 pixels
      Then the trailing action container retains its natural width
      When the user releases the pointer

    Scenario: Elasticity applies to only the configured side
      Given a swipe-reveal item "a" with attributes "elastic='leading'"
      When the swipe-reveal fixture renders
      And the user presses item "a" and drags it -40 pixels
      Then the trailing action button retains its natural width
      When the user releases the pointer

    Scenario: Underlap is reserved beneath actions without increasing reveal distance
      Given a swipe-reveal item "a" with underlap "12px"
      When the swipe-reveal fixture renders
      And the application reveals item "a" on the "trailing" side
      Then the actions reserve 12 pixels of underlap without changing reveal distance
