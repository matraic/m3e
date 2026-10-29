# WRP-01: Pulse Wrapper Contract

**Status:** Draft  
**Scope:** Framework wrappers over `@pulse/web` Web Components  
**Reference implementation:** `@pulse/react`  
**Related roadmap work:** WRP-01, WRP-02  
**Purpose:** Define the contract that framework bindings must preserve before Pulse decides how far wrapper generation can be automated.

## 1. Architecture principle

`@pulse/web` is the canonical implementation of component behavior, accessibility, slots, events, and styling.

Framework packages are integration layers:

```text
@pulse/web
    ↓
@pulse/react     reference / golden path
Pulse.Blazor     event + form bridging where required
@pulse/vue       demand-driven
@pulse/angular   demand-driven
```

Wrappers must expose the Web Component contract in framework-appropriate form without reimplementing component behavior.

## 2. Properties

Public `@pulse/web` properties form the basis of wrapper properties.

A wrapper must:

- preserve property names where the framework permits;
- preserve property types;
- include inherited public properties;
- map Web Component attributes to framework properties where names differ;
- exclude private, protected, and implementation-only members.

The Button investigation demonstrated why inherited properties matter. `M3eButtonElement` obtains part of its API through reusable mixins rather than declaring everything directly on the Button class.

A wrapper generator therefore must not limit discovery to properties directly declared by the element class.

## 3. Boolean properties

Boolean properties remain booleans at the framework boundary.

Attribute spelling must not dictate the framework API where the Web Component exposes a corresponding property.

Example established during the Button investigation:

```text
Web Component property: disabledInteractive
HTML attribute:          disabled-interactive
React prop:              disabledInteractive
```

Similarly, `disabled`, `selected`, and `toggle` remain boolean properties rather than string-valued HTML attributes.

## 4. Events

Native and custom events dispatched by `@pulse/web` must be exposed using the target framework's event conventions.

The existing React Button establishes the reference pattern:

```text
beforeinput → onBeforeInput
input       → onInput
change      → onChange
click       → onClick
```

React event handlers receive the native DOM events emitted by the Web Component.

Framework bindings must not reproduce the state transition responsible for an event. That behavior remains in `@pulse/web`.

Wrappers should support idiomatic framework event names and controlled or uncontrolled usage where the component contract requires it.

## 5. Slots and children

The Web Component slot model remains canonical.

For React:

- the default unnamed slot corresponds naturally to `children`;
- named slots must remain usable;
- wrappers must not flatten composition into framework-specific properties unless Pulse explicitly defines such an API.

Example from the investigated Button contract:

```text
default
icon
selected
selected-icon
trailing-icon
```

Composition-heavy components need documentation in addition to the wrapper itself.

For example, investigation of `m3e-form-field` showed that its default slot represents the field's control, with additional slots for:

```text
label
prefix
prefix-text
suffix
suffix-text
hint
error
```

A mechanically generated wrapper can expose the element correctly while still requiring documentation to explain how consumers should compose the control.

## 6. Refs and imperative access

Framework wrappers must provide access to the underlying custom-element instance when the framework supports refs.

For React, refs resolve to the underlying `M3e*Element`.

Imperative behavior remains implemented by the custom element. Wrappers must not introduce parallel imperative APIs where the Web Component already provides the capability.

## 7. Forms

Form behavior belongs to the Web Component layer.

Wrappers must preserve rather than recreate:

- form association;
- `name`;
- `value`;
- input type where applicable;
- disabled state;
- validation behavior;
- submission and reset behavior exposed by the underlying component.

The Button investigation confirmed that `M3eButtonElement` is form-associated and that form behavior is inherited through the component's mixin architecture.

Blazor integration may require event and form bridging, but canonical form behavior remains in `@pulse/web`.

## 8. React reference implementation

`@pulse/react` is the Pulse reference wrapper implementation.

The investigated Button binding establishes the desired shape:

```ts
export const M3eButton = createComponent({
  tagName: "m3e-button",
  elementClass: M3eButtonElement,
  react: React,
  events: {
    onBeforeInput: "beforeinput",
    onInput: "input",
    onChange: "change",
    onClick: "click",
  },
});
```

This illustrates the thin-wrapper principle:

```text
element class        → @pulse/web
properties           → underlying element
events               → explicit React mapping
refs                 → underlying element
behavior             → @pulse/web
accessibility        → @pulse/web
form semantics       → @pulse/web
```

No component behavior should be duplicated solely to make a React wrapper.

## 9. Documentation contract

Every supported wrapper must make the following discoverable:

1. corresponding Web Component and tag;
2. installation and import path;
3. public framework properties;
4. event mappings;
5. default and named-slot or children usage;
6. ref and imperative-access behavior where relevant;
7. form behavior where relevant;
8. a minimal usage example;
9. documented exceptions or framework-specific glue.

Wrapper adoption should not depend on tribal knowledge.

## 10. Metadata-driven generation

Custom Elements Manifest is the candidate metadata source for WRP-02, not yet an unconditional generation mandate.

The Button investigation established that the current generated manifest contains:

- the custom-element declaration;
- direct properties;
- inherited properties;
- types;
- HTML attribute names;
- events and event types;
- slots;
- superclass and mixin information;
- form association and its inheritance origin.

The Form Field investigation additionally showed that CEM captures composition-oriented named and default slots.

However, the manifest also exposes internal implementation members. A generator must distinguish the supported public component contract from private and internal fields and methods.

Preliminary generation flow:

```text
CEM
 ↓
filter supported public API
 ↓
apply framework event/property conventions
 ↓
generate thin wrapper
 ↓
add explicit framework glue only where required
```

## 11. Exceptions and unresolved cases

### Text Field identity

The investigation found a discrepancy that must remain explicit.

Historical Pulse material expected a Text Field wrapper, and earlier wrapper planning used Button, TextField, and Dialog as representative components.

The current repository investigation identified `M3eFormField` / `m3e-form-field`, whose contract composes a control through its default slot. We have not established that this is equivalent to the roadmap's Text Field.

> **Text Field mapping remains unresolved. Do not treat `M3eFormField` as the Pulse Text Field wrapper without further validation.**

This matters because the roadmap names Button, Text Field, Checkbox, Select, and Dialog as representative Blazor targets.

## 12. WRP-01 acceptance criteria

WRP-01 can be considered complete when this contract is reviewed and accepted as the shared rule set for wrappers covering:

- properties;
- inherited properties;
- booleans;
- events;
- slots and children;
- refs;
- forms;
- documentation expectations;
- treatment of framework-specific exceptions.

The wrapper direction is React-first, with Blazor second and Vue/Angular demand-driven.

## 13. Follow-on: WRP-02

After WRP-01 is accepted, WRP-02 should use this contract as its benchmark and answer:

> **Can Custom Elements Manifest reliably generate wrappers conforming to this contract, and which framework-specific cases still require handwritten glue?**

The Button evidence supports proceeding with that investigation, but it is not yet sufficient to declare a final generate-vs-handwrite decision.

## Source context

This draft is based on:

- `Pulse_Design_System_Roadmap_2026-2027.docx`
- `MDS for Ascom Pulse Design System.docx`
- the live repository investigation of `M3eButtonElement`, `M3eFormFieldElement`, their React bindings, and `packages/web/dist/custom-elements.json`
