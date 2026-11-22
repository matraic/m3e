Feature: Gestures
  Declarative gesture elements recognize pointer interactions and report their progress.

  Rule: Discrete gestures report successful and interrupted interactions

    Scenario: A tap emits start and end details and cancels after excessive movement

      Given a tap gesture with a 10px maximum displacement
      When the gesture fixture renders
      And the user taps the target at 40, 50
      Then the tap emits start and end phases
      And the tap end detail reports the release coordinates and duration
      When the user presses and moves 40px before releasing
      Then the tap emits start and cancel phases

    Scenario: A long press completes after its minimum duration

      Given a long press gesture requiring 100ms
      When the gesture fixture renders
      And the user presses the target for 120ms
      Then the long press emits start and end phases
      And the long press duration is at least 100ms

    Scenario: A long press cancels when released before its minimum duration

      Given a long press gesture requiring 300ms
      When the gesture fixture renders
      And the user presses the target for 30ms
      Then the long press emits start and cancel phases
      And the long press duration is 30ms

  Rule: Continuous gestures report motion and cancellation

    Scenario: A pan reports its phases and total translation

      Given a pan gesture with a 2px minimum displacement
      When the gesture fixture renders
      And the user pans the target 25px to the right
      Then the pan emits start, update and end phases
      And the pan reports 25px of total horizontal translation

    Scenario: A pan cancels when its pointer is cancelled

      Given a pan gesture with a 2px minimum displacement
      When the gesture fixture renders
      And the user pans the target and cancels the pointer
      Then the pan emits start and cancel phases

    Scenario: A rightward swipe reports its direction

      Given a swipe gesture with a 10px minimum displacement and 5px direction threshold
      When the gesture fixture renders
      And the user swipes the target to the right
      Then the swipe emits start, update and end phases
      And the swipe direction is "right"

    Scenario Outline: Swipe release velocity includes the final pause

      Given a swipe gesture
      When the gesture fixture renders
      And the user releases after a <pause>ms pause following the last movement
      Then the swipe ends with phase "<phase>"

      Examples:
        | pause | phase  |
        | 5     | end    |
        | 250   | cancel |

    Scenario: Swipe velocity uses movement at release

      Given a swipe gesture
      When the gesture fixture renders
      And the user moves 15px and releases 30ms later
      Then the swipe reports 60px total translation and 0.5px per millisecond velocity

    Scenario: A stationary final move retains the previous swipe velocity

      Given a swipe gesture
      When the gesture fixture renders
      And the user moves 60px, pauses 5ms, and releases 5ms later
      Then the swipe reports 60px total translation and 2px per millisecond velocity

    Scenario: A stationary move after a pause lowers swipe velocity

      Given a swipe gesture
      When the gesture fixture renders
      And the user moves 60px, pauses 250ms, and releases 5ms later
      Then the swipe ends with phase "cancel"
      And the swipe reports 60px total translation and about 0.22px per millisecond velocity

    Scenario: A swipe cancels when its pointer is cancelled

      Given a swipe gesture with a 10px minimum displacement
      When the gesture fixture renders
      And the user swipes the target and cancels the pointer
      Then the swipe emits start and cancel phases

    Scenario: A scale gesture reports changes from two pointers

      Given a scale gesture with a 1px minimum displacement
      When the gesture fixture renders
      And the user spreads two pointers apart
      Then the scale gesture emits start and update phases
      And the scale factor is greater than 1.2

    Scenario: A scale gesture cancels when a pointer is cancelled

      Given a scale gesture with a 1px minimum displacement
      When the gesture fixture renders
      And the user spreads two pointers apart and cancels one
      Then the scale gesture emits start, update and cancel phases

    Scenario: A rotate gesture reports rotation from two pointers

      Given a rotate gesture with a 1px minimum displacement
      When the gesture fixture renders
      And the user rotates two pointers
      Then the rotate gesture emits start and update phases
      And the rotation is finite and non-zero

    Scenario: A rotate gesture cancels when a pointer is cancelled

      Given a rotate gesture with a 1px minimum displacement
      When the gesture fixture renders
      And the user rotates two pointers and cancels one
      Then the rotate gesture emits start, update and cancel phases

  Rule: Composed gestures combine child recognitions

    Scenario: A repeat gesture reports the configured number of taps

      Given a repeat gesture requiring 2 taps
      When the gesture fixture renders
      And the user taps the target twice
      Then the repeat emits start and end phases
      And the repeat contains 2 completed taps

    Scenario: A repeat gesture cancels when the next tap is interrupted

      Given a repeat gesture requiring 2 taps
      When the gesture fixture renders
      And the user completes one tap and interrupts the next
      Then the repeat emits start and cancel phases
      And the repeat contains 1 completed taps

    Scenario: A sequence gesture recognizes taps in order

      Given a sequence gesture requiring 2 taps
      When the gesture fixture renders
      And the user taps the target twice
      Then the sequence emits start and end phases
      And the sequence contains 2 completed child details

    Scenario: A sequence gesture cancels when the next step is interrupted

      Given a sequence gesture requiring 2 taps
      When the gesture fixture renders
      And the user completes one tap and interrupts the next
      Then the sequence emits start and cancel phases
      And the sequence contains 1 completed child details

  Rule: Gesture elements preserve input and accessibility behavior

    Scenario: A disabled gesture ignores pointer input

      Given a disabled tap gesture
      When the gesture fixture renders
      And the user taps the target at 40, 50
      Then the tap emits no phases

    Scenario: A gesture honors its configured pointer types

      Given a tap gesture accepting only pen input
      When the gesture fixture renders
      And the user taps the target using "touch" input
      Then the tap emits no phases
      When the user taps the target using "pen" input
      Then the tap emits start and end phases

    Scenario: A gesture element is not exposed as visual content to assistive technology

      Given a tap gesture attached to an accessible button
      When the gesture fixture renders
      Then the target remains an accessible button named "Activate"
      And the gesture element is not visible

    Scenario: A gesture resumes listening after moving in the document

      Given a tap gesture
      When the gesture fixture renders
      And the application moves the gesture element to another parent
      And the user taps the target at 40, 50
      Then the tap emits start and end phases

  Rule: Pointer capture does not interfere with ordinary child interactions

    Scenario: A tap lets the child receive the click without capturing the pointer

      Given a tap gesture with a child button and native pointer capture
      When the gesture fixture renders
      And the user clicks the child button
      Then the child receives the click without pointer capture

    Scenario: A short press lets the child receive the click without pointer capture

      Given a long press gesture with a 500ms minimum and a child button
      When the gesture fixture renders
      And the user clicks the child button
      Then the child receives the click without pointer capture

    Scenario: A discrete long press captures the pointer after its duration

      Given a discrete long press gesture with a 100ms minimum and a child button
      When the gesture fixture renders
      And the user holds the child button for 200ms
      Then the gesture captures the pointer

    Scenario: A click does not capture the pointer for pan or swipe

      Given pan and swipe gestures with a child button
      When the gesture fixture renders
      And the user clicks the child button
      Then the child receives the click without pointer capture

    Scenario: An active pan captures the pointer

      Given a pan gesture with a child button and native pointer capture
      When the gesture fixture renders
      And the user drags the child button 60px
      Then the gesture captures the pointer

  Rule: Gesture arbitration resolves competing recognizers

    Scenario: The highest-priority recognizer wins regardless of registration order

      Given low- and high-priority pan gestures
      When the gesture fixture renders
      And the user pans the target
      Then both pan gestures start
      And the high-priority pan ends while the low-priority pan cancels

    Scenario: An eager recognizer wins over a higher-priority deferred recognizer

      Given an eager pan and a deferred long press
      When the gesture fixture renders
      And the user holds the target for 80ms
      Then the long press ends while the pan cancels
