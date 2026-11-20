# Contributing

Thank you for your interest in contributing to the M3E monorepo! We welcome contributions that help improve, extend, and refine our suite of Material 3 Web Components.

## How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button at the top right of the repository page.
2. **Clone Your Fork**
   - Clone your forked repository to your local machine:
     ```
     git clone https://github.com/<your-username>/m3e.git
     ```
3. **Create a Branch**
   - Create a new branch for your feature or fix:
     ```
     git checkout -b feature/your-feature-name
     ```
4. **Make Your Changes**
   - Follow Material 3 design principles and coding standards.
   - Write clear, maintainable code and add documentation as needed.
5. **Test Your Changes**
   - Ensure all tests pass and your changes do not break existing functionality.
   - Tests use [Playwright](https://playwright.dev) and run against the built bundle:
     ```
     npx playwright install chromium
     npm run build -w @m3e/web
     npm test
     ```
   - The web test command generates Playwright tests from [Gherkin scenarios](./packages/web/test)
     before running them alongside the hand-written specs. Edit the `.feature` files and their adjacent `.steps.ts`
     files, not the generated specs. Keep each component's feature, steps, and harness together in its own folder,
     as in [app-bar](./packages/web/test/app-bar). Scenarios tagged `@needs-review` are excluded from generation.
     To run a single feature, use `npm test -w @m3e/web -- autocomplete.feature` (or `app-bar.feature`).
   - To collect Chromium code coverage for the web package, build it as above and run
     `npm run test:coverage -w @m3e/web`. Add `-- app-bar.feature` to run a single feature.
     Open `packages/web/coverage/index.html` for the consolidated Monocart HTML report. Focused runs update
     that component's saved coverage while preserving coverage from other component runs; an unfiltered run
     collects coverage for the full suite. Component-specific HTML reports are under
     `packages/web/coverage/components/`.
6. **Commit and Push**
   - Commit your changes with a descriptive message:
     ```
     git commit -m "Add feature: your-feature-name"
     git push origin feature/your-feature-name
     ```
7. **Open a Pull Request**
   - Go to the original repository and open a pull request from your branch.
   - Provide a clear description of your changes and reference any related issues.

## Code of Conduct

Please review and adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) to foster a welcoming and respectful community.

## Guidelines

- Follow Material 3 design and accessibility standards.
- Write clean, modular, and well-documented code.
- Use conventional commit messages.
- Be responsive to feedback during code review.

## Reporting Issues

If you find a bug or have a feature request, please open an issue with detailed information and steps to reproduce.

## Contact

For questions or support, open an issue or contact the maintainers directly.

Thank you for helping us build expressive, accessible, and beautiful Web Components with Material 3!
