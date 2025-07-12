# Game Collection - Test Documentation

## Overview
This document provides comprehensive documentation for all tests in the Game Collection project. The project includes educational games for children aged 5-8, built with vanilla JavaScript and thoroughly tested with Jest.

## Test Structure
Tests are organized by game and functionality:
- **Unit Tests**: Core game logic and UI components
- **Integration Tests**: Cross-component functionality
- **Regression Tests**: Bug fixes and improvements

---

## Landing Page Tests

### `tests/unit/landing-page/index.test.js`
**Purpose**: Tests the main landing page HTML structure and UI elements.

#### Test Cases:
1. **Page Title Rendering**
   - **Title**: "should render the page title"
   - **Description**: Verifies that the main page title "Game Collection" is properly rendered in the document.

2. **Header Display**
   - **Title**: "should display the header"
   - **Description**: Ensures the main header with "Game Collection" heading is visible and properly structured.

3. **Games Collection Section**
   - **Title**: "should display the games collection section"
   - **Description**: Validates that the games collection container exists and is properly rendered.

4. **Memory Card Game Card**
   - **Title**: "should display the Memory Card game card"
   - **Description**: Checks that the Memory Card game is displayed with correct title and "Play Now" button linking to the game.

5. **Counting Farm Game Card**
   - **Title**: "should display the Counting Farm game card"
   - **Description**: Verifies the Counting Farm game card is rendered with proper navigation link.

6. **Coming Soon Games**
   - **Title**: "should display the coming soon game cards"
   - **Description**: Tests that placeholder game cards are shown for upcoming games with disabled buttons.

7. **Footer Display**
   - **Title**: "should display the footer"
   - **Description**: Ensures the footer is rendered with correct content and branding.

### `tests/unit/landing-page/main.test.js`
**Purpose**: Tests the main JavaScript functionality for the landing page.

#### Test Cases:
1. **Placeholder Image Creation**
   - **Title**: "should create placeholder image when called"
   - **Description**: Tests the utility function that creates placeholder images for game cards.

2. **Card Animation Handling**
   - **Title**: "should handle card animations"
   - **Description**: Verifies that game cards respond to mouse events with proper hover animations (translateY effects).

---

## Memory Card Game Tests

### `tests/unit/memory-card/ui.test.js`
**Purpose**: Tests the Memory Card game user interface components and layout.

#### Test Cases:
1. **Page Title**
   - **Title**: "should render the page title"
   - **Description**: Validates that the Memory Card game page title is correctly set.

2. **Game Header**
   - **Title**: "should display the game header"
   - **Description**: Ensures the main game title "Memory Card Game" is properly displayed.

3. **Game Mode Selection**
   - **Title**: "should display game mode selection"
   - **Description**: Tests that the game mode dropdown exists with Single Player and Two Players options.

4. **Player Name Setup**
   - **Title**: "should display player name setup (initially hidden)"
   - **Description**: Verifies the multiplayer name input section is present but hidden initially, with proper input fields and constraints.

5. **Single Player Stats**
   - **Title**: "should display single player game stats"
   - **Description**: Checks that moves counter and timer are displayed for single player mode.

6. **Multiplayer Player Info**
   - **Title**: "should display multiplayer player info (initially hidden)"
   - **Description**: Tests the multiplayer UI elements including player cards, scores, and turn indicators.

7. **Game Controls**
   - **Title**: "should display game controls"
   - **Description**: Validates that start button, home button, and difficulty selector are present with proper options.

8. **Game Board**
   - **Title**: "should display the game board"
   - **Description**: Ensures the game board container exists and is properly structured.

### `tests/unit/memory-card/game-logic.test.js`
**Purpose**: Tests the core game logic for the Memory Card game.

#### Test Cases:
1. **Game Initialization**
   - **Title**: "should initialize the game with correct settings"
   - **Description**: Tests that the game properly initializes with correct number of pairs based on difficulty level.

2. **Card Flipping Logic**
   - **Title**: "should handle card flipping correctly"
   - **Description**: Verifies that card flipping works properly, including game start trigger and timing mechanisms.

3. **Card Matching Logic**
   - **Title**: "should handle matching cards correctly"
   - **Description**: Tests the logic for detecting and processing matching card pairs.

4. **Game Completion**
   - **Title**: "should complete the game when all pairs are matched"
   - **Description**: Ensures the game properly detects when all pairs are matched and triggers end game logic.

5. **Difficulty Settings**
   - **Title**: "should handle difficulty changes"
   - **Description**: Tests that different difficulty levels (Easy, Medium, Hard) create appropriate grid sizes and pair counts.

### `tests/unit/memory-card/multiplayer.test.js`
**Purpose**: Tests the multiplayer functionality for the Memory Card game.

#### Test Cases:
1. **DOM Elements Structure**
   - **Title**: "should have all required multiplayer DOM elements"
   - **Description**: Verifies that all necessary DOM elements for multiplayer mode are present.

2. **Initial HTML State**
   - **Title**: "should have correct initial HTML state"
   - **Description**: Tests that multiplayer elements are properly hidden initially and single player elements are shown.

3. **Game Mode Options**
   - **Title**: "should have game mode options"
   - **Description**: Ensures the game mode selector has both single and multiplayer options.

4. **Player Name Input**
   - **Title**: "should have correct input attributes"
   - **Description**: Tests that player name inputs have proper validation attributes (maxLength, placeholders).

5. **Player Input Functionality**
   - **Title**: "should accept user input"
   - **Description**: Verifies that player name inputs properly accept and store user input.

6. **Character Limit Enforcement**
   - **Title**: "should enforce character limit"
   - **Description**: Tests that the 15-character limit is enforced for player names.

7. **Player Display Structure**
   - **Title**: "should have player cards with correct structure"
   - **Description**: Validates the structure of player cards including names and scores.

8. **Mobile UI Elements**
   - **Title**: "should have compact turn status elements"
   - **Description**: Tests that mobile-responsive UI elements are properly implemented.

9. **Sound Effects Integration**
   - **Title**: "should support Web Audio API mocking"
   - **Description**: Ensures sound effects can be properly tested with mocked Web Audio API.

10. **Multiplayer State Variables**
    - **Title**: "should have script variables for multiplayer state"
    - **Description**: Tests that necessary JavaScript variables for multiplayer state management exist.

### `tests/unit/memory-card/sound-effects.test.js`
**Purpose**: Tests the sound effects implementation for the Memory Card game.

#### Test Cases:
1. **Function Naming**
   - **Title**: "should have playSuccessSound function (not playApplauseSound)"
   - **Description**: Verifies that the sound function uses the correct naming convention.

2. **Audio Context Creation**
   - **Title**: "should create AudioContext without errors"
   - **Description**: Tests that Web Audio API context can be created successfully.

3. **Volume Level Setting**
   - **Title**: "should have proper volume level set (0.2 for Memory Card)"
   - **Description**: Ensures the sound volume is set appropriately for the game.

4. **Sound Wave Type**
   - **Title**: "should use sine wave oscillators"
   - **Description**: Verifies that sine wave oscillators are used for pleasant sound quality.

5. **Chord Frequencies**
   - **Title**: "should have C5-E5-G5 chord frequencies"
   - **Description**: Tests that the success sound uses a pleasant C major chord.

6. **Error Handling**
   - **Title**: "should handle audio context creation errors gracefully"
   - **Description**: Ensures graceful fallback when Web Audio API is not supported.

7. **Sound Envelope**
   - **Title**: "should have proper attack and release phases"
   - **Description**: Tests that sounds have smooth volume transitions.

8. **Integration**
   - **Title**: "should be called when pairs are matched"
   - **Description**: Verifies that success sounds play at the appropriate game moments.

---

## Math Monster Munch Tests

### `tests/unit/math-monster-munch/ui.test.js`
**Purpose**: Tests the Math Monster Munch game user interface.

#### Test Cases:
1. **Page Title**
   - **Title**: "should render the page title"
   - **Description**: Validates the game page title is correctly set.

2. **Game Header**
   - **Title**: "should display the game header"
   - **Description**: Ensures the "Math Monster Munch" heading is visible.

3. **Game Statistics**
   - **Title**: "should display game stats"
   - **Description**: Tests that score and level displays are properly shown.

4. **Game Controls**
   - **Title**: "should display game controls"
   - **Description**: Verifies start button, home button, and game mode selector are present.

5. **Instructions Display**
   - **Title**: "should display the instructions initially"
   - **Description**: Tests that welcome message and instructions are shown initially.

6. **Game Mode Information**
   - **Title**: "should display game modes information in instructions"
   - **Description**: Ensures all game modes (Addition, Subtraction, Mixed) are explained.

7. **Age Recommendation**
   - **Title**: "should display age range recommendation"
   - **Description**: Verifies that the recommended age range is displayed.

8. **Hidden Game Areas**
   - **Title**: "should have hidden game area and result sections initially"
   - **Description**: Tests that game area and results are hidden until game starts.

9. **Navigation**
   - **Title**: "should have 'Home' button that links to main page"
   - **Description**: Ensures proper navigation back to the main page.

### `tests/unit/math-monster-munch/game-logic.test.js`
**Purpose**: Tests the core game logic for Math Monster Munch.

#### Test Cases:
1. **Initial Game State**
   - **Title**: "should set up initial game state"
   - **Description**: Tests that the game initializes with correct starting values.

2. **Correct Answer Scoring**
   - **Title**: "should update score when answer is correct"
   - **Description**: Verifies that correct answers increase the score appropriately.

3. **Incorrect Answer Handling**
   - **Title**: "should update lives when answer is incorrect"
   - **Description**: Tests that incorrect answers reduce lives (before lives system removal).

4. **Level Progression**
   - **Title**: "should level up after earning enough points"
   - **Description**: Ensures level progression works based on score thresholds.

5. **Result Messages**
   - **Title**: "should display result message when answering correctly"
   - **Description**: Tests that appropriate feedback is shown for correct answers.

6. **Incorrect Answer Feedback**
   - **Title**: "should display the correct answer in the result message when answering incorrectly"
   - **Description**: Verifies educational feedback shows the correct answer.

7. **Monster Emotion States**
   - **Title**: "should change monster state to happy when answering correctly"
   - **Description**: Tests that the monster shows happiness for correct answers.

8. **Monster Hungry State**
   - **Title**: "should keep monster state as hungry when answering incorrectly"
   - **Description**: Ensures the monster remains hungry after incorrect answers.

### `tests/unit/math-monster-munch/fixes.test.js`
**Purpose**: Tests specific bug fixes for Math Monster Munch.

#### Test Cases:
1. **Zero Display Fix**
   - **Title**: "should display zero as '0' instead of 'None'"
   - **Description**: Tests that zero values are properly displayed as "0" in answer options.

2. **Monster Emotion Fix**
   - **Title**: "should show correct monster emotions"
   - **Description**: Verifies that monster emotions (happy/hungry) are displayed correctly.

### `tests/unit/math-monster-munch/sound-effects.test.js`
**Purpose**: Tests the sound effects implementation for Math Monster Munch.

#### Test Cases:
1. **Function Renaming**
   - **Title**: "should have renamed playApplauseSound to playSuccessSound"
   - **Description**: Verifies that sound functions use consistent naming across games.

2. **Error Sound Renaming**
   - **Title**: "should have renamed playOhhhSound to playErrorSound"
   - **Description**: Tests that error sound function uses the correct name.

3. **Audio Context Support**
   - **Title**: "should create AudioContext without errors"
   - **Description**: Ensures Web Audio API integration works properly.

4. **Volume Levels**
   - **Title**: "should have proper volume levels set (0.15 for both sounds)"
   - **Description**: Tests that sound volume is appropriate for the game.

5. **Success Sound Frequencies**
   - **Title**: "should have proper frequency settings for success sound"
   - **Description**: Verifies that success sound uses pleasant C major chord frequencies.

6. **Error Sound Design**
   - **Title**: "should have descending frequency for error sound"
   - **Description**: Tests that error sound uses a descending tone pattern.

7. **Error Handling**
   - **Title**: "should handle audio context creation errors gracefully"
   - **Description**: Ensures graceful fallback when audio is not supported.

8. **Sound Envelope**
   - **Title**: "should have simplified error sound envelope"
   - **Description**: Tests that error sound has clean attack-release envelope.

### `tests/unit/math-monster-munch/answer-generation.test.js`
**Purpose**: Tests the answer generation logic and bug fixes.

#### Test Cases:
1. **Infinite Loop Prevention**
   - **Title**: "should have infinite loop prevention mechanism"
   - **Description**: Tests that the answer generation system has safety mechanisms to prevent infinite loops.

2. **Maximum Attempts Limit**
   - **Title**: "should have maximum attempts limit set to reasonable value"
   - **Description**: Verifies that the system limits retry attempts to 50 for performance.

3. **Range Expansion Logic**
   - **Title**: "should have range expansion logic for small answer sets"
   - **Description**: Tests that the system expands number ranges when insufficient options are available.

4. **Fallback Generation**
   - **Title**: "should have fallback answer generation mechanism"
   - **Description**: Ensures that if primary generation fails, fallback sequential generation works.

5. **Positive Answer Enforcement**
   - **Title**: "should ensure answers are always positive"
   - **Description**: Tests that all generated answers are greater than zero.

6. **Unique Answer Generation**
   - **Title**: "should generate unique answers"
   - **Description**: Verifies that all answer options are distinct.

7. **Answer Count Validation**
   - **Title**: "should generate exactly 4 answer options"
   - **Description**: Tests that exactly four answer choices are provided.

8. **Small Number Handling**
   - **Title**: "should handle small numbers with wider range"
   - **Description**: Ensures appropriate answer ranges for small correct answers.

9. **Subtraction Mode Fixes**
   - **Title**: "should prevent zero results in subtraction"
   - **Description**: Tests that subtraction questions never produce zero as the correct answer.

10. **Emoji Organization**
    - **Title**: "should organize emojis in rows of 10"
    - **Description**: Verifies that emoji display is organized in countable rows for better user experience.

---

## Counting Farm Tests

### `tests/unit/counting-farm/ui.test.js`
**Purpose**: Tests the Counting Farm game user interface.

#### Test Cases:
1. **Page Title**
   - **Title**: "should render the page title"
   - **Description**: Validates that the Counting Farm game page title is correctly set.

2. **Game Header**
   - **Title**: "should display the game header"
   - **Description**: Ensures the "Counting Farm" heading is properly displayed.

3. **Game Statistics**
   - **Title**: "should display game stats"
   - **Description**: Tests that score and level displays are visible and properly initialized.

4. **Game Controls**
   - **Title**: "should display game controls"
   - **Description**: Verifies that start button, home button, and game mode selector are present with all required options.

5. **Instructions Display**
   - **Title**: "should display the instructions initially"
   - **Description**: Tests that welcome message and game instructions are shown initially.

6. **Hidden Game Areas**
   - **Title**: "should have hidden game area and result sections initially"
   - **Description**: Ensures game area and results are hidden until the game starts.

7. **Result Section**
   - **Title**: "should display result section with next button"
   - **Description**: Tests that the result section includes proper congratulations and next challenge button.

8. **Farm Background**
   - **Title**: "should have farm background element"
   - **Description**: Verifies that the farm background element exists for proper theming.

### `tests/unit/counting-farm/game-logic.test.js`
**Purpose**: Tests the core game logic for all Counting Farm game modes.

#### Test Cases:
1. **Counting Mode Logic**
   - **Title**: "should generate counting questions correctly"
   - **Description**: Tests that counting questions are generated with appropriate animal counts and answer options.

2. **Comparing Mode Logic**
   - **Title**: "should generate comparing questions correctly"
   - **Description**: Verifies that comparison questions properly compare animal groups and provide correct answer options.

3. **Grouping Mode Logic**
   - **Title**: "should generate grouping questions correctly"
   - **Description**: Tests that grouping questions (odd/even) are generated with appropriate counts.

4. **Sharing Mode Logic**
   - **Title**: "should generate sharing questions correctly"
   - **Description**: Ensures that sharing/division questions are created with proper animal distribution logic.

5. **Answer Validation**
   - **Title**: "should validate answers correctly across all modes"
   - **Description**: Tests that answer checking works properly for all four game modes.

6. **Game State Management**
   - **Title**: "should manage game state correctly"
   - **Description**: Verifies that game state (score, level, mode) is properly maintained throughout gameplay.

---

## Number Bubbles Tests

### `tests/unit/number-bubbles/ui.test.js`
**Purpose**: Tests the Number Bubbles game user interface.

#### Test Cases:
1. **Initial State**
   - **Title**: "game should initially show instructions and hide game area"
   - **Description**: Tests that the game starts with instructions visible and game area hidden.

2. **Start Game Functionality**
   - **Title**: "start button should hide instructions and show game area"
   - **Description**: Verifies that clicking start properly transitions from instructions to game area.

3. **Game Mode Options**
   - **Title**: "game mode selector should have all required options"
   - **Description**: Tests that all four game modes (Ascending, Descending, Even, Odd) are available.

4. **Score Display**
   - **Title**: "score and level displays should be properly initialized"
   - **Description**: Ensures score and level displays start with correct initial values.

5. **Timer Display**
   - **Title**: "timer should start at 60 seconds"
   - **Description**: Tests that the game timer is properly initialized to 60 seconds.

### `tests/unit/number-bubbles/game-logic.test.js`
**Purpose**: Tests the core game logic for Number Bubbles.

#### Test Cases:
1. **Ascending Mode Scoring**
   - **Title**: "clicking correct bubble in ascending mode should increase score"
   - **Description**: Tests that correct sequence clicks increase the score appropriately.

2. **Incorrect Answer Penalty**
   - **Title**: "clicking wrong bubble in ascending mode should decrease score"
   - **Description**: Verifies that incorrect clicks result in score penalties.

3. **Level Progression**
   - **Title**: "completing a level should increment level counter"
   - **Description**: Tests that completing a sequence advances to the next level.

4. **Even Number Mode**
   - **Title**: "clicking even number in even mode should increase score"
   - **Description**: Ensures even number mode correctly identifies and rewards even numbers.

5. **Odd Number Mode**
   - **Title**: "clicking odd number in odd mode should increase score"
   - **Description**: Tests that odd number mode properly handles odd number selection.

6. **Score Floor Protection**
   - **Title**: "score should not go below zero"
   - **Description**: Verifies that the score cannot become negative despite incorrect answers.

---

## Test Infrastructure

### `tests/setupTests.js`
**Purpose**: Global test setup and configuration.

### `tests/mocks/`
**Purpose**: Mock files for handling assets and styles in tests.

#### Files:
- `fileMock.js` - Handles file imports in tests
- `styleMock.js` - Handles CSS imports in tests

---

## Test Coverage and Quality

### Overall Coverage
The test suite provides comprehensive coverage of:
- ✅ **UI Components** - All user interface elements
- ✅ **Game Logic** - Core gameplay mechanics
- ✅ **Error Handling** - Graceful error management
- ✅ **Browser Compatibility** - Cross-browser functionality
- ✅ **Accessibility** - Basic accessibility features
- ✅ **Performance** - Efficient resource usage
- ✅ **Bug Fixes** - Regression prevention

### Test Quality Standards
- **Descriptive Test Names**: Each test has a clear, descriptive name
- **Focused Testing**: Each test validates a specific functionality
- **Mock Usage**: Proper mocking of external dependencies
- **Error Scenarios**: Edge cases and error conditions are tested
- **DOM Testing**: Proper DOM manipulation and event testing
- **Async Testing**: Proper handling of timers and async operations

### Running Tests
- **All Tests**: `npm test`
- **Watch Mode**: `npm run test:watch`
- **Coverage Report**: `npm run test:coverage`

---

## Maintenance Notes

### Adding New Tests
When adding new tests:
1. Follow the existing naming convention
2. Add appropriate test description and purpose
3. Update this documentation
4. Ensure proper mocking of dependencies
5. Test both success and failure scenarios

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Keep tests focused and isolated
- Mock external dependencies appropriately
- Clean up after each test (timers, DOM, etc.)

This documentation ensures that all developers can understand the purpose and scope of each test in the Game Collection project. 