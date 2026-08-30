# @m3e/web/gestures

The `@m3e/web/gestures` module provides a comprehensive gesture recognition system for detecting and responding to user interactions including taps, pans, swipes, flings, long-presses, and multi-pointer scaling. Built with a modular architecture, it supports input arbitration through a priority-based disposition system, allowing multiple gesture recognizers to coexist peacefully on the same element. Composite gestures enable chaining of basic gestures into complex sequences or repetitions.

```ts
import "@m3e/web/gestures";
```

## ✨ Features

- **Single & Multi-Touch**: Recognize gestures from mouse, pen, and touch pointers
- **Input Arbitration**: Priority-based system for resolving competing gesture claims
- **Rich Details**: Comprehensive gesture data including coordinates, velocities, displacement, and phase information
- **Composite Gestures**: Chain basic gestures into sequences or repetitions
- **Configurable**: Fine-tune recognition thresholds, durations, and constraints per gesture type
- **Web Components**: Non-visual elements that bind to target elements via the `for` attribute
- **Accessibility**: Respects disabled state and pointer type filters

## 🗂️ Elements

- `m3e-tap-gesture` — A non-visual element used to detect a tap gesture for an associated element.
- `m3e-pan-gesture` — A non-visual element used to detect a pan gesture for an associated element.
- `m3e-swipe-gesture` — A non-visual element used to detect a swipe gesture for an associated element.
- `m3e-fling-gesture` — A non-visual element used to detect a fling gesture for an associated element.
- `m3e-long-press-gesture` — A non-visual element used to detect a long-press gesture for an associated element.
- `m3e-scale-gesture` — A non-visual element used to detect a scale gesture for an associated element.
- `m3e-sequence-gesture` — A non-visual element used to detect a sequence of gestures for an associated element.
- `m3e-repeat-gesture` — A non-visual element used to detect a repeated gesture for an associated element.

## 🧪 Examples

### Tap Gesture

The following example illustrates detecting tap gestures on an element using `<m3e-tap-gesture>`.
Use the `for` attribute to bind the gesture recognizer to a target element:

```html
<div id="div1"></div>
<m3e-tap-gesture for="div1"></m3e-tap-gesture>
```

Listen for the `gesture` event to handle detected tap gestures:

```ts
const recognizer = document.querySelector("m3e-tap-gesture");

recognizer.addEventListener("gesture", (e) => {
  const detail = e.detail;

  // Number of pointers (fingers) involved in the tap
  console.log(detail.pointers.length);

  // Coordinates of the first pointer (finger)
  console.log(detail.pointers[0].clientX, detail.pointers[0].clientY);

  // Total tap duration
  console.log(detail.duration);
});
```

### Pan Gesture

The following example illustrates detecting pan gestures on an element using `<m3e-pan-gesture>`.
Use the `for` attribute to bind the gesture recognizer to a target element:

```html
<div id="div1"></div>
<m3e-pan-gesture for="div1"></m3e-pan-gesture>
```

Listen for the `gesture` event to handle detected pan gestures:

```ts
const recognizer = document.querySelector("m3e-pan-gesture");

recognizer.addEventListener("gesture", (e) => {
  const detail = e.detail;

  // Current phase (start, move, end, cancel)
  console.log(detail.phase);

  // Total displacement along the primary axis
  console.log(detail.totalPrimaryDelta);

  // Current incremental movement
  console.log(detail.deltaX, detail.deltaY);

  // Current velocity
  console.log(detail.velocityX, detail.velocityY);
});
```

### Swipe Gesture

The following example illustrates detecting swipe gestures on an element using `<m3e-swipe-gesture>`.
Use the `for` attribute to bind the gesture recognizer to a target element:

```html
<div id="div1"></div>
<m3e-swipe-gesture for="div1"></m3e-swipe-gesture>
```

Listen for the `gesture` event to handle detected swipe gestures:

```ts
const recognizer = document.querySelector("m3e-swipe-gesture");

recognizer.addEventListener("gesture", (e) => {
  const detail = e.detail;

  // Current direction
  console.log(detail.direction);
});
```

### Sequence Gesture

The following example illustrates detecting gesture sequences using `<m3e-sequence-gesture>`.

The `<m3e-sequence-gesture>` accepts one or more gesture elements, each representing one step in the sequence.

The recognizer emits a gesture only after **all child gestures complete in order**. If any gesture fails, the entire sequence fails.

The following example illustrates detecting a **press + tap** sequence (long‑press followed by a tap):

```html
<div id="div1"></div>

<m3e-sequence-gesture for="div1">
  <m3e-long-press-gesture></m3e-long-press-gesture>
  <m3e-tap-gesture></m3e-tap-gesture>
</m3e-sequence-gesture>
```

Listen for the `gesture` event to handle completed sequences:

```ts
const recognizer = document.querySelector("m3e-sequence-gesture");

recognizer.addEventListener("gesture", (e) => {
  const detail = e.detail;

  // Sequence steps in order (press detail, then tap detail)
  console.log(detail.sequence.length);

  // Access each step's detail
  const pressDetail = detail.sequence[0];
  const tapDetail = detail.sequence[1];

  console.log("Press duration:", pressDetail.duration);
  console.log("Tap timestamp:", tapDetail.timestamp);
});
```

### Fling Gesture

The following example illustrates detecting fling gestures on an element using `<m3e-fling-gesture>`.
Use the `for` attribute to bind the gesture recognizer to a target element:

```html
<div id="div1"></div>
<m3e-fling-gesture for="div1"></m3e-fling-gesture>
```

Listen for the `gesture` event to handle detected fling gestures:

```ts
const recognizer = document.querySelector("m3e-fling-gesture");

recognizer.addEventListener("gesture", (e) => {
  const detail = e.detail;

  // Current direction
  console.log(detail.direction);
});
```

### Long-Press Gesture

The following example illustrates detecting long-press gestures on an element using `<m3e-long-press-gesture>`.
Use the `for` attribute to bind the gesture recognizer to a target element:

```html
<div id="div1"></div>
<m3e-long-press-gesture for="div1"></m3e-long-press-gesture>
```

Listen for the `gesture` event to handle detected long-press gestures:

```ts
const recognizer = document.querySelector("m3e-long-press-gesture");

recognizer.addEventListener("gesture", (e) => {
  const detail = e.detail;

  // Current phase (start, end,)
  console.log(detail.phase);

  // Total long-press duration
  console.log(detail.duration);
});
```

### Scale Gesture

The following example illustrates detecting scale gestures on an element using `<m3e-scale-gesture>`.
Use the `for` attribute to bind the gesture recognizer to a target element:

```html
<div id="div1"></div>
<m3e-scale-gesture for="div1"></m3e-scale-gesture>
```

Listen for the `gesture` event to handle detected scale gestures:

```ts
const recognizer = document.querySelector("m3e-scale-gesture");

recognizer.addEventListener("gesture", (e) => {
  const detail = e.detail;

  // Current phase (start, move, end, cancel)
  console.log(detail.phase);

  // Scale factor relative to the initial pointer distance.
  // A value of 1 represents no scaling; values >1 indicate expansion,
  // and values <1 indicate contraction.
  console.log(detail.scale);
});
```

### Repeat Gesture

The following example illustrates detecting repeated gestures on an element using `<m3e-repeat-gesture>`.

The `<m3e-repeat-gesture>` accepts a **single child gesture element** which defines the gesture to repeat.

Use the `count` attribute to specify how many times the gesture must occur before it is recognized. The default value is **2** (double‑gesture).

```html
<div id="div1"></div>

<!-- Detect a double‑tap (default count = 2) -->
<m3e-repeat-gesture for="div1">
  <m3e-tap-gesture></m3e-tap-gesture>
</m3e-repeat-gesture>

<!-- Detect a triple‑tap -->
<m3e-repeat-gesture for="div1" count="3">
  <m3e-tap-gesture></m3e-tap-gesture>
</m3e-repeat-gesture>
```

Listen for the `gesture` event to handle repeated gestures:

```ts
const recognizer = document.querySelector("m3e-repeat-gesture");

recognizer.addEventListener("gesture", (e) => {
  const detail = e.detail;

  // Number of completed occurrences (e.g., 2 for a double‑tap)
  console.log(detail.occurrences.length);

  // Access each occurrence's detail
  detail.occurrences.forEach((occ, i) => {
    console.log(`Occurrence ${i + 1}:`, occ.timestamp);
  });
});
```

## 📖 API Reference

This section details the attributes and events available for gesture elements.

### ⚙️ Common Attributes

All gesture elements support the following attributes:

| Attribute       | Type                       | Default             | Description                                         |
| --------------- | -------------------------- | ------------------- | --------------------------------------------------- |
| `for`           | `string`                   |                     | ID of the element to bind the gesture to.           |
| `disabled`      | `boolean`                  | `false`             | Whether gesture recognition is disabled.            |
| `priority`      | `number`                   | `1`                 | Priority for input arbitration (higher = priority). |
| `buttons`       | `string` (space-separated) | `"primary"`         | Which mouse buttons can trigger the gesture.        |
| `pointer-types` | `string` (space-separated) | `"mouse pen touch"` | Which pointer types can trigger the gesture.        |

### 🗂️ m3e-tap-gesture

Recognizes one or more taps within a specified timeframe.

#### ⚙️ Attributes

| Attribute              | Type     | Default | Description                                         |
| ---------------------- | -------- | ------- | --------------------------------------------------- |
| `pointers`             | `number` | `1`     | Number of pointers required for recognition.        |
| `max-duration`         | `number` | `180`   | Maximum press duration (ms) before gesture fails.   |
| `max-displacement`     | `number` | `12`    | Maximum pointer movement (px) before gesture fails. |
| `max-press-interval`   | `number` | `120`   | Maximum time (ms) between consecutive taps.         |
| `max-release-interval` | `number` | `120`   | Maximum time (ms) between tap releases.             |

#### 📡 Events

| Event     | Description                               |
| --------- | ----------------------------------------- |
| `gesture` | Emitted when a tap gesture is recognized. |

#### Gesture Detail

```ts
{
  id: number;                 // Identifier of the input that produced the gesture
  timestamp: number;          // Timestamp the gesture was detected
  gestureType: "tap";         // The type of the gesture
  duration: number;           // The total press duration (ms)
  pointers: [{
    id: number;               // Identifier of the input that produced the detail
    timestamp: number;        // Timestamp the detail was detected
    clientX: number;          // Viewport x-coordinate where the tap began
    clientY: number;          // Viewport y-coordinate where the tap began
    localX: number;           // Element-relative x-coordinate where the tap began
    localY: number;           // Element-relative y-coordinate where the tap began
    duration: number;         // The total press duration (ms)
  }];
}
```

### 🗂️ m3e-pan-gesture

Recognizes continuous dragging with directional and velocity tracking.

#### ⚙️ Attributes

| Attribute          | Type     | Default  | Description                                                                                    |
| ------------------ | -------- | -------- | ---------------------------------------------------------------------------------------------- |
| `min-displacement` | `number` | `4`      | Minimum distance (px) a pointer can move before the gesture starts.                            |
| `lock-axis`        | `string` | `"none"` | Locks movement to an axis: `"x"`, `"y"`, `"lock"`, or `"none"`.                                |
| `axis-threshold`   | `number` | `8`      | Minimum total displacement (px) required before axis locking resolves.                         |
| `delta-threshold`  | `number` | `0`      | Minimum incremental movement (px) on the secondary axis required before emitting move updates. |

#### 📡 Events

| Event     | Description                               |
| --------- | ----------------------------------------- |
| `gesture` | Emitted when a pan gesture is recognized. |

#### Gesture Detail

```ts
{
  id: number; // Identifier of the input that produced the gesture
  timestamp: number; // Timestamp the gesture was detected
  gestureType: "pan"; // The type of the gesture
  phase: "start" | "move" | "end" | "cancel"; // Current phase of the pan gesture
  startClientX: number; // Viewport x-coordinate where the pan began
  startClientY: number; // Viewport y-coordinate where the pan began
  clientX: number; // Current viewport x-coordinate
  clientY: number; // Current viewport y-coordinate
  startLocalX: number; // Element-relative x-coordinate where the pan began
  startLocalY: number; // Element-relative y-coordinate where the pan began
  localX: number; // Current element-relative x-coordinate
  localY: number; // Current element-relative y-coordinate
  deltaX: number; // Incremental x-axis movement since the previous pan event
  deltaY: number; // Incremental y-axis movement since the previous pan event
  primaryDelta: number; // Incremental movement along the resolved primary axis. Equals `deltaX` for horizontal pans and `deltaY` for vertical pans
  totalPrimaryDelta: number; // Total movement along the resolved primary axis since pan start. Equals `totalDeltaX` for horizontal pans and `totalDeltaY` for vertical pans
  velocityX: number; // Instantaneous x-axis velocity in px/ms
  velocityY: number; // Instantaneous y-axis velocity in px/ms
  totalDeltaX: number; // Total x-axis displacement since pan start
  totalDeltaY: number; // Total y-axis displacement since pan start
  speed: number; // Magnitude of the velocity vector
  angle: number; // Movement angle in radians, based on total displacement. Computed as atan2(totalDeltaY, totalDeltaX)
  directionX: number; // Movement direction along the x-axis: -1, 0, or 1
  directionY: number; // Movement direction along the y-axis: -1, 0, or 1
  orientation: "horizontal" | "vertical"; // Resolved pan orientation based on dominant total displacement
}
```

### 🗂️ m3e-swipe-gesture

Recognizes fast directional swipes.

#### ⚙️ Attributes

| Attribute             | Type     | Default                | Description                                                              |
| --------------------- | -------- | ---------------------- | ------------------------------------------------------------------------ |
| `max-displacement`    | `number` | `24`                   | Maximum distance (px) a pointer can move before the gesture fails.       |
| `min-velocity`        | `number` | `0.3`                  | Minimum velocity (px/ms) required to recognize a swipe.                  |
| `direction-threshold` | `number` | `8`                    | Minimum displacement (px) required before direction is considered valid. |
| `directions`          | `string` | `"left right up down"` | The allowed directions of the swipe (space-separated).                   |

#### 📡 Events

| Event     | Description                                 |
| --------- | ------------------------------------------- |
| `gesture` | Emitted when a swipe gesture is recognized. |

#### Gesture Detail

```ts
{
  id: number; // Identifier of the input that produced the gesture
  timestamp: number; // Timestamp the gesture was detected
  gestureType: "swipe"; // The type of the gesture
  direction: "left" | "right" | "up" | "down"; // Resolved swipe direction
  axis: "x" | "y"; // Dominant axis of the swipe
  distance: number; // Total displacement (px) along the dominant axis
  speed: number; // Velocity magnitude (px/ms)
  angle: number; // Angle (radians) of movement
}
```

### 🗂️ m3e-fling-gesture

Recognizes very fast fling gestures (high-velocity swipes).

#### ⚙️ Attributes

| Attribute             | Type     | Default                | Description                                                                     |
| --------------------- | -------- | ---------------------- | ------------------------------------------------------------------------------- |
| `min-displacement`    | `number` | `12`                   | Minimum distance (px) a pointer must move before the gesture can be recognized. |
| `min-velocity`        | `number` | `0.3`                  | Minimum velocity (px/ms) required to recognize a fling.                         |
| `direction-threshold` | `number` | `12`                   | Minimum displacement (px) required before direction is considered valid.        |
| `directions`          | `string` | `"left right up down"` | The allowed directions of the fling (space-separated).                          |

#### 📡 Events

| Event     | Description                                 |
| --------- | ------------------------------------------- |
| `gesture` | Emitted when a fling gesture is recognized. |

#### Gesture Detail

```ts
{
  id: number; // Identifier of the input that produced the gesture
  timestamp: number; // Timestamp the gesture was detected
  gestureType: "fling"; // The type of the gesture
  direction: "left" | "right" | "up" | "down"; // Resolved fling direction
  axis: "x" | "y"; // Dominant axis of the fling
  distance: number; // Total displacement (px) along the dominant axis
  speed: number; // Velocity magnitude (px/ms)
  angle: number; // Angle (radians) of movement
}
```

### 🗂️ m3e-long-press-gesture

Recognizes when a pointer remains pressed for a minimum duration.

#### ⚙️ Attributes

| Attribute          | Type     | Default | Description                                         |
| ------------------ | -------- | ------- | --------------------------------------------------- |
| `min-duration`     | `number` | `500`   | Minimum press duration (ms) for recognition.        |
| `max-displacement` | `number` | `4`     | Maximum pointer movement (px) before gesture fails. |

#### 📡 Events

| Event     | Description                                      |
| --------- | ------------------------------------------------ |
| `gesture` | Emitted when a long-press gesture is recognized. |

#### Gesture Detail

```ts
{
  id: number; // Identifier of the input that produced the gesture
  timestamp: number; // Timestamp the gesture was detected
  gestureType: "long-press"; // The type of the gesture
  phase: "start" | "end"; // The phase of the gesture
  clientX: number; // Viewport x-coordinate where the long-press began
  clientY: number; // Viewport y-coordinate where the long-press began
  localX: number; // Element-relative x-coordinate where the long-press began
  localY: number; // Element-relative y-coordinate where the long-press began
  duration: number; // The total press duration (ms)
}
```

### 🗂️ m3e-scale-gesture

Recognizes multi-pointer pinch and spread gestures.

#### ⚙️ Attributes

| Attribute            | Type     | Default | Description                                     |
| -------------------- | -------- | ------- | ----------------------------------------------- |
| `pointers`           | `number` | `2`     | Number of pointers required for recognition.    |
| `distance-threshold` | `number` | `4`     | Minimum distance change (px) to activate scale. |

#### 📡 Events

| Event     | Description                                 |
| --------- | ------------------------------------------- |
| `gesture` | Emitted when a scale gesture is recognized. |

#### Gesture Detail

```ts
{
  id: number; // Identifier of the input that produced the gesture
  timestamp: number; // Timestamp the gesture was detected
  gestureType: "scale"; // The type of the gesture
  phase: "start" | "move" | "end" | "cancel"; // The current phase of the scale gesture
  scale: number; // Scale factor relative to the initial pointer distance. A value of 1 represents no scaling; values >1 indicate expansion, and values <1 indicate contraction
  distance: number; // Average distance of all active pointers from the gesture centroid
  clientCenterX: number; // Viewport X‑coordinate of the gesture centroid, computed from all active pointers
  clientCenterY: number; // Viewport Y‑coordinate of the gesture centroid, computed from all active pointers
  localCenterX: number; // Local X‑coordinate of the gesture centroid, relative to the target element's bounding box
  localCenterY: number; // Local Y‑coordinate of the gesture centroid, relative to the target element's bounding box
  pointers: number; // Number of active pointers contributing to the scale gesture
}
```

### 🗂️ m3e-sequence-gesture

Recognizes a sequence of gestures performed in order. The recognizer emits a gesture only after **all child gestures complete in order**. If any gesture fails, the entire sequence fails.

#### ⚙️ Attributes

| Attribute      | Type     | Default | Description                                                   |
| -------------- | -------- | ------- | ------------------------------------------------------------- |
| `max-interval` | `number` | `250`   | Maximum time (ms) between gestures before the sequence fails. |

#### 🧩 Slots

| Slot        | Description                             |
| ----------- | --------------------------------------- |
| _(default)_ | The gestures that make up the sequence. |

#### 📡 Events

| Event     | Description                                    |
| --------- | ---------------------------------------------- |
| `gesture` | Emitted when a gesture sequence is recognized. |

#### Gesture Detail

```ts
{
  id: number;                      // Identifier of the input that produced the gesture
  timestamp: number;               // Timestamp the gesture was detected
  gestureType: "sequence";         // The type of the gesture
  sequence: readonly GestureDetail[]; // The details for each gesture in the sequence
}
```

### 🗂️ m3e-repeat-gesture

Recognizes a given number of repeated gestures. Accepts a **single child gesture element** which defines the gesture to repeat. Use the `count` attribute to specify how many times the gesture must occur before it is recognized. The default value is **2** (double‑gesture).

#### ⚙️ Attributes

| Attribute      | Type     | Default | Description                                                           |
| -------------- | -------- | ------- | --------------------------------------------------------------------- |
| `count`        | `number` | `2`     | Number of times a gesture must be repeated.                           |
| `max-interval` | `number` | `250`   | Maximum time (ms) between gestures before the repeated gesture fails. |

#### 🧩 Slots

| Slot        | Description            |
| ----------- | ---------------------- |
| _(default)_ | The gesture to repeat. |

#### 📡 Events

| Event     | Description                                    |
| --------- | ---------------------------------------------- |
| `gesture` | Emitted when a repeated gesture is recognized. |

#### Gesture Detail

```ts
{
  id: number;                            // Identifier of the input that produced the gesture
  timestamp: number;                     // Timestamp the gesture was detected
  gestureType: "repeat";                 // The type of the gesture
  occurrences: readonly GestureDetail[]; // The details for each occurrence of the gesture
}
```
