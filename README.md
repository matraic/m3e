# M3E

Welcome to the M3E (Material 3 Expressive) monorepo—a unified collection of robust, customizable Web Components built with the latest Material Design 3 guidelines. This repository empowers developers to create visually rich, adaptive, and accessible user interfaces for modern web applications.

## 📝 Overview

Material 3 (M3) introduces a new era of expressive design, focusing on personalization, dynamic color, and enhanced accessibility. This monorepo provides a comprehensive suite of reusable components, each crafted to deliver seamless integration, consistent theming, and intuitive user experiences.

## 🛡️ Disclaimer

This project is not affiliated with or endorsed by Google. “Material Design” and “Material 3” are trademarks of Google LLC.

## ✨ Features

- **Expressive Components**: Leverage Material 3's design tokens, dynamic color, shape and motion systems for highly customizable UI elements.
- **Unified Architecture**: Modularized for easy maintenance, scalability, and rapid development.
- **Accessibility First**: Built-in support for accessibility standards, ensuring inclusive experiences for all users.
- **Theming & Personalization**: Effortlessly adapt components to your brand or user preferences with Material 3's advanced theming capabilities.
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

| Package                                      | Summary                                | Installation             |
| -------------------------------------------- | -------------------------------------- | ------------------------ |
| [**@m3e/web**](./packages/web/README.md)     | Platform‑native Web Components for M3E | `npm install @m3e/web`   |
| [**@m3e/react**](./packages/react/README.md) | React bindings for M3E Web Components  | `npm install @m3e/react` |

## 📍 Roadmap

For a detailed view of current development, planned components, and past milestones, see the [M3E Roadmap](ROADMAP.md).

## 🤝 Contributing

Contributions from the community are welcome! Please review the [Contributing Guidelines](CONTRIBUTING.md) and help us advance the future of expressive web design.

### Preview builds for pull requests and pushes

Every pull request **and every push** publishes a preview build of the M3E packages using **pkg.pr.new**. This makes it easy to test changes locally without cloning the repo or linking workspaces.

Preview builds include the compiled output for both `@m3e/web` and `@m3e/react`, matching the structure of a standard npm release.

#### Pull request builds

To install a preview build for any PR:

```sh
npm install pkg.pr.new/matraic/m3e/pull/<PR_NUMBER>
```

#### Commit builds

To install a preview build for a specific commit:

```sh
npm install pkg.pr.new/matraic/m3e/commit/<COMMIT_SHA>
```

## 📄 License

This project is licensed under the MIT License.

## 🧪 Testing

This project is tested with BrowserStack
