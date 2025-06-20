/**
 * @jest-environment jsdom
 */

const { screen, waitFor } = require('@testing-library/dom');
require('@testing-library/jest-dom');
const fs = require('fs');
const path = require('path');

// Load the HTML file
beforeEach(() => {
  document.body.innerHTML = fs.readFileSync(
    path.resolve(__dirname, '../../../games/math-monster-munch/index.html'),
    'utf8'
  );
  
  // Mock the script to avoid running it directly
  const scriptEl = document.querySelector('script[src="script.js"]');
  if (scriptEl) scriptEl.remove();
});

describe('Math Monster Munch Game UI', () => {
  test('should render the page title', () => {
    expect(document.title).toBe('Math Monster Munch - Math Game for Kids');
  });

  test('should display the game header', () => {
    const header = screen.getByText('Math Monster Munch');
    expect(header).toBeInTheDocument();
  });

  test('should display game stats', () => {
    const score = screen.getByText(/Score: 0/i);
    const level = screen.getByText(/Level: 1/i);
    const lives = screen.getByText(/Lives:/i);
    
    expect(score).toBeInTheDocument();
    expect(level).toBeInTheDocument();
    expect(lives).toBeInTheDocument();
    
    // Check if lives display has hearts
    const livesSpan = document.querySelector('#lives span');
    expect(livesSpan.textContent).toBe('❤️❤️❤️');
  });

  test('should display game controls', () => {
    const startButton = screen.getByText('Start Game');
    const homeButton = screen.getByText('Home');
    const gameModeSelector = document.getElementById('game-mode');
    
    expect(startButton).toBeInTheDocument();
    expect(homeButton).toBeInTheDocument();
    expect(gameModeSelector).toBeInTheDocument();
    
    // Check if game mode options are present
    expect(gameModeSelector.options.length).toBeGreaterThanOrEqual(3);
    expect(gameModeSelector.options[0].text).toBe('Addition');
    expect(gameModeSelector.options[1].text).toBe('Subtraction');
    expect(gameModeSelector.options[2].text).toBe('Mixed');
  });

  test('should display the instructions initially', () => {
    const instructions = document.getElementById('instructions');
    const welcomeText = screen.getByText('Welcome to Math Monster Munch!');
    
    expect(instructions).toBeInTheDocument();
    expect(instructions).not.toHaveClass('hidden');
    expect(welcomeText).toBeInTheDocument();
  });

  test('should display game modes information in instructions', () => {
    const gameModes = screen.getByText('Game Modes:');
    const additionMode = screen.getByText(/Addition:/);
    const subtractionMode = screen.getByText(/Subtraction:/);
    const mixedMode = screen.getByText(/Mixed:/);
    
    expect(gameModes).toBeInTheDocument();
    expect(additionMode).toBeInTheDocument();
    expect(subtractionMode).toBeInTheDocument();
    expect(mixedMode).toBeInTheDocument();
  });

  test('should display age range recommendation', () => {
    const ageRange = screen.getByText('Recommended for ages 6-8');
    expect(ageRange).toBeInTheDocument();
  });

  test('should have hidden game area and result sections initially', () => {
    const gameArea = document.getElementById('game-area');
    const resultArea = document.getElementById('result');
    
    expect(gameArea).toHaveClass('hidden');
    expect(resultArea).toHaveClass('hidden');
  });

  test('should display result section with next button', () => {
    const resultHeading = document.querySelector('#result h2');
    const nextButton = screen.getByText('Next Question');
    
    expect(resultHeading).toHaveTextContent('Great job!');
    expect(nextButton).toBeInTheDocument();
  });

  test('should have "Home" button that links to main page', () => {
    const homeButton = screen.getByText('Home');
    expect(homeButton).toHaveAttribute('onclick', "window.location.href='../../index.html'");
  });
});
