# Game Collection

A collection of browser-based educational games including Memory Card Game, Counting Farm, and Math Monster Munch.

## Testing

This project uses Jest and Testing Library for unit testing all components of the application.

### Running Tests

You can run the tests using the following commands:

- `npm test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode (automatically reruns on changes)
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run test:counting-farm` - Run only Counting Farm tests
- `npm run test:memory-card` - Run only Memory Card tests
- `npm run test:landing-page` - Run only Landing Page tests
- `npm run test:math-monster-munch` - Run only Math Monster Munch tests

You can also use the VS Code tasks:
- Run All Tests
- Run Counting Farm Tests
- Run Memory Card Tests
- Run Landing Page Tests
- Run Math Monster Munch Tests
- Run Tests in Watch Mode
- Run Tests with Coverage

For convenience, there are also batch/shell scripts:
- `run-tests-watch.bat` (Windows) / `run-tests-watch.sh` (Unix) - Run tests in watch mode
- `run-tests-coverage.bat` (Windows) / `run-tests-coverage.sh` (Unix) - Run tests with coverage

### Pre-commit Hook

Tests will automatically run before each commit to ensure code quality.

### Test Structure

- `/tests/unit/counting-farm/` - Tests for the Counting Farm game
  - `ui.test.js` - UI tests
  - `game-logic.test.js` - Game logic tests
- `/tests/unit/memory-card/` - Tests for the Memory Card game
  - `ui.test.js` - UI tests
  - `game-logic.test.js` - Game logic tests
- `/tests/unit/landing-page/` - Tests for the landing page
  - `index.test.js` - UI tests
  - `main.test.js` - JavaScript functionality tests
- `/tests/unit/math-monster-munch/` - Tests for the Math Monster Munch game
  - `ui.test.js` - UI tests
  - `game-logic.test.js` - Game logic tests

## Future Improvements

- Add end-to-end tests with Cypress or Playwright
- Implement continuous integration with GitHub Actions
- Add more games to the collection
