# M3E

Welcome to the M3E (Material 3 Expressive) monorepo—a unified collection of robust, customizable web components built with the latest Material Design 3 guidelines. This repository empowers developers to create visually rich, adaptive, and accessible user interfaces for modern web applications.

## 📝 Overview

Material 3 (M3) introduces a new era of expressive design, focusing on personalization, dynamic color, and enhanced accessibility. This monorepo provides a comprehensive suite of reusable components, each crafted to deliver seamless integration, consistent theming, and intuitive user experiences.

## 🛡️ Disclaimer

This project is not affiliated with or endorsed by Google. “Material Design” and “Material 3” are trademarks of Google LLC.

## ✨ Features

- **Expressive Components**: Leverage Material 3’s design tokens, dynamic color, shape and motion systems for highly customizable UI elements.
- **Unified Architecture**: Modular packages for easy maintenance, scalability, and rapid development.
- **Accessibility First**: Built-in support for accessibility standards, ensuring inclusive experiences for all users.
- **Theming & Personalization**: Effortlessly adapt components to your brand or user preferences with Material 3’s advanced theming capabilities.
- **Performance Optimized**: Lightweight, fast-loading components designed for modern web platforms.
- **Security Conscious**: Built with secure-by-default patterns, including XSS-safe templating, Trusted Types compatibility, and support for strong Content Security Policies (CSP) to enforce safe DOM interactions and mitigate injection risks.

## 🚀 Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/matraic/m3e.git
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Explore individual packages for usage instructions and documentation.

## 🛠️ Building

This monorepo uses npm scripts for building, analyzing, linting, and cleaning packages. Common commands:

- `npm run build` — Build all packages
- `npm run cem` — Run custom elements manifest analysis
- `npm run lint` — Lint all packages
- `npm run all` — Build, analyze, and lint in one step
- `npm run clean` — Remove build output

## 📦 Packages

Below is a list of all packages in this monorepo, with a short summary and installation instructions for each:

| Package                                                                | Summary                                                                                                                                                               | Installation                          |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [**@m3e/all**](./packages/all/README.md)                               | Meta-package that aggregates all components into a single install.                                                                                                    | `npm install @m3e/all`                |
| [**@m3e/app-bar**](./packages/app-bar/README.md)                       | A prominent UI component providing access to key actions, navigation, and contextual info at the top of an app screen.                                                | `npm install @m3e/app-bar`            |
| [**@m3e/autocomplete**](./packages/autocomplete/README.md)             | Enhances a text input with a dynamically positioned menu of filterable suggestions, providing real-time filtering and keyboard navigation.                            | `npm install @m3e/autocomplete`       |
| [**@m3e/avatar**](./packages/avatar/README.md)                         | An image, icon or textual initials representing a user or other identity.                                                                                             | `npm install @m3e/avatar`             |
| [**@m3e/badge**](./packages/badge/README.md)                           | A compact visual indicator for counts, presence, or emphasis, attachable to icons, buttons, or other components.                                                      | `npm install @m3e/badge`              |
| [**@m3e/button**](./packages/button/README.md)                         | A semantic, expressive UI primitive for actions, supporting five variants and dynamic theming.                                                                        | `npm install @m3e/button`             |
| [**@m3e/button-group**](./packages/button-group/README.md)             | Organizes buttons and adds interactions between them.                                                                                                                 | `npm install @m3e/button-group`       |
| [**@m3e/card**](./packages/card/README.md)                             | A flexible, expressive container for presenting a unified subject—text, media, and actions—on a distinct surface.                                                     | `npm install @m3e/card`               |
| [**@m3e/chips**](./packages/chips/README.md)                           | Expressive, accessible chip components for actions, input, filtering, and suggestions.                                                                                | `npm install @m3e/chips`              |
| [**@m3e/checkbox**](./packages/checkbox/README.md)                     | An expressive, accessible control for binary selection—supporting checked, indeterminate, and disabled states.                                                        | `npm install @m3e/checkbox`           |
| [**@m3e/core**](./packages/core/README.md)                             | Essential primitives, utilities, and behavioral mixins for building Material 3 web components.                                                                        | `npm install @m3e/core`               |
| [**@m3e/dialog**](./packages/dialog/README.md)                         | Presents important prompts, alerts, and actions with ARIA accessibility, focus management, and theming.                                                               | `npm install @m3e/dialog`             |
| [**@m3e/divider**](./packages/divider/README.md)                       | Visually separates content within layouts, lists, or containers using a thin, unobtrusive line.                                                                       | `npm install @m3e/divider`            |
| [**@m3e/drawer-container**](./packages/drawer-container/README.md)     | Provides a responsive layout container for managing one or two sliding drawers alongside main content.                                                                | `npm install @m3e/drawer-container`   |
| [**@m3e/expansion-panel**](./packages/expansion-panel/README.md)       | Expressive, accessible components for organizing content in collapsible sections and coordinated groups.                                                              | `npm install @m3e/expansion-panel`    |
| [**@m3e/fab**](./packages/fab/README.md)                               | A prominent, expressive floating action button (FAB) representing the primary action on a screen.                                                                     | `npm install @m3e/fab`                |
| [**@m3e/fab-menu**](./packages/fab-menu/README.md)                     | Presents a dynamic menu of related actions, elegantly revealed from a floating action button (FAB).                                                                   | `npm install @m3e/fab-menu`           |
| [**@m3e/form-field**](./packages/form-field/README.md)                 | A container for form controls that applies Material Design styling and behavior.                                                                                      | `npm install @m3e/form-field`         |
| [**@m3e/heading**](./packages/heading/README.md)                       | Expressive, accessible headings for pages and sections, supporting display, headline, title, and label variants in multiple sizes.                                    | `npm install @m3e/heading`            |
| [**@m3e/icon**](./packages/icon/README.md)                             | Makes it easy to use Material Symbols, supporting outlined, rounded, and sharp variants with variable font features.                                                  | `npm install @m3e/icon`               |
| [**@m3e/icon-button**](./packages/icon-button/README.md)               | A semantic, expressive UI primitive for triggering actions with a single icon, supporting four visual variants.                                                       | `npm install @m3e/icon-button`        |
| [**@m3e/list**](./packages/list/README.md)                             | Expressive, accessible components for organizing and displaying lists of items, with rich content and theming.                                                        | `npm install @m3e/list`               |
| [**@m3e/loading-indicator**](./packages/loading-indicator/README.md)   | Uses animation to indicate that an activity is in progress, with contained and uncontained variants.                                                                  | `npm install @m3e/loading-indicator`  |
| [**@m3e/menu**](./packages/menu/README.md)                             | Anchored, elevated surfaces that present a list of choices—supporting selection, hierarchy, and contextual interaction.                                               | `npm install @m3e/menu`               |
| [**@m3e/nav-bar**](./packages/nav-bar/README.md)                       | Navigation bar and interactive items for switching between primary destinations, designed for smaller devices.                                                        | `npm install @m3e/nav-bar`            |
| [**@m3e/nav-menu**](./packages/nav-menu/README.md)                     | Hierarchical, accessible navigation menu for sidebars, drawers, and complex menu structures.                                                                          | `npm install @m3e/nav-menu`           |
| [**@m3e/nav-rail**](./packages/nav-rail/README.md)                     | Extends nav-bar to provide a vertical navigation rail for larger devices, supporting compact and expanded modes.                                                      | `npm install @m3e/nav-rail`           |
| [**@m3e/option**](./packages/option/README.md)                         | Provides selectable options and interactive menus for choosing values from a temporary surface.                                                                       | `npm install @m3e/option`             |
| [**@m3e/paginator**](./packages/paginator/README.md)                   | Provides navigation for paged information, typically used with a table.                                                                                               | `npm install @m3e/paginator`          |
| [**@m3e/progress-indicator**](./packages/progress-indicator/README.md) | Accessible, animated progress indicators for tracking task or process completion.                                                                                     | `npm install @m3e/progress-indicator` |
| [**@m3e/radio-group**](./packages/radio-group/README.md)               | A single-selection control for choosing one option from a set—supporting expressive styling, accessible transitions, and validation feedback.                         | `npm install @m3e/radio-group`        |
| [**@m3e/segmented-button**](./packages/segmented-button/README.md)     | A multi-option control for grouped selection—supporting single or multiple active segments with expressive layout, ripple feedback, and accessible state transitions. | `npm install @m3e/segmented-button`   |
| [**@m3e/select**](./packages/select/README.md)                         | A form control for single and multiple selection that integrates with `m3e-option` and `m3e-form-field`.                                                              | `npm install @m3e/select`             |
| [**@m3e/shape**](./packages/shape/README.md)                           | Allows use of abstract shapes for emphasis and decorative flair, including built-in shape morphing.                                                                   | `npm install @m3e/shape`              |
| [**@m3e/slide-group**](./packages/slide-group/README.md)               | Presents pagination controls used to scroll overflowing content.                                                                                                      | `npm install @m3e/slide-group`        |
| [**@m3e/slider**](./packages/slider/README.md)                         | Allows for the selection of numeric values from a range.                                                                                                              | `npm install @m3e/slider`             |
| [**@m3e/snackbar**](./packages/snackbar/README.md)                     | Provides a global service for presenting short updates about application processes at the bottom of the screen.                                                       | `npm install @m3e/snackbar`           |
| [**@m3e/split-button**](./packages/split-button/README.md)             | A button used to show an action with a menu of related actions.                                                                                                       | `npm install @m3e/split-button`       |
| [**@m3e/stepper**](./packages/stepper/README.md)                       | Provides a wizard-like workflow by dividing content into logical steps.                                                                                               | `npm install @m3e/stepper`            |
| [**@m3e/switch**](./packages/switch/README.md)                         | An on/off control that can be toggled by clicking.                                                                                                                    | `npm install @m3e/switch`             |
| [**@m3e/tabs**](./packages/tabs/README.md)                             | Organizes content into separate views where only one view can be visible at a time.                                                                                   | `npm install @m3e/tabs`               |
| [**@m3e/textarea-autosize**](./packages/textarea-autosize/README.md)   | A non-visual element used to automatically resize a `textarea` to fit its content.                                                                                    | `npm install @m3e/textarea-autosize`  |
| [**@m3e/theme**](./packages/theme/README.md)                           | A non-visual element used to apply dynamic color, expressive motion, density, and focus indicators to nested elements.                                                | `npm install @m3e/theme`              |
| [**@m3e/toc**](./packages/toc/README.md)                               | Hierarchical, interactive table of contents for in-page navigation, with automatic heading detection.                                                                 | `npm install @m3e/toc`                |
| [**@m3e/toolbar**](./packages/toolbar/README.md)                       | Presents contextual actions, navigation, and controls, supporting orientation, shape, and variant customization.                                                      | `npm install @m3e/toolbar`            |
| [**@m3e/tooltip**](./packages/tooltip/README.md)                       | Provides contextual information in response to user interaction, positioned relative to a target element.                                                             | `npm install @m3e/tooltip`            |

## 📍 Roadmap

For a detailed view of current development, planned components, and past milestones, see the [M3E Roadmap](ROADMAP.md).

## 🤝 Contributing

Contributions from the community are welcome! Please review the [Contributing Guidelines](CONTRIBUTING.md) and help us advance the future of expressive web design.

## 📄 License

This project is licensed under the MIT License.
