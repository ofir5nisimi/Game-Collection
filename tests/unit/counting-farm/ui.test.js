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
    path.resolve(__dirname, '../../../games/counting-farm/index.html'),
    'utf8'
  );
  
  // Mock the script to avoid running it directly
  const scriptEl = document.querySelector('script[src="script.js"]');
  if (scriptEl) scriptEl.remove();
});

describe('Counting Farm Game UI', () => {
  test('should render the page title', () => {
    expect(document.title).toBe('Counting Farm - Math Game for Kids');
  });

  test('should display the game header', () => {
    const header = screen.getByText('Counting Farm');
    expect(header).toBeInTheDocument();
  });

  test('should display game stats', () => {
    const score = screen.getByText(/Score: 0/i);
    const level = screen.getByText(/Level: 1/i);
    
    expect(score).toBeInTheDocument();
    expect(level).toBeInTheDocument();
  });

  test('should display game controls', () => {
    const startButton = screen.getByText('Start Game');
    const homeButton = screen.getByText('Home');
    const gameModeSelector = document.getElementById('game-mode');
    
    expect(startButton).toBeInTheDocument();
    expect(homeButton).toBeInTheDocument();
    expect(gameModeSelector).toBeInTheDocument();
    
    // Check if game mode options are present
    expect(gameModeSelector.options.length).toBeGreaterThanOrEqual(4);
    expect(gameModeSelector.options[0].text).toBe('Counting');
    expect(gameModeSelector.options[1].text).toBe('Comparing');
    expect(gameModeSelector.options[2].text).toBe('Grouping');
    expect(gameModeSelector.options[3].text).toBe('Sharing');
  });

  test('should display the instructions initially', () => {
    const instructions = document.getElementById('instructions');
    const welcomeText = screen.getByText('Welcome to Counting Farm!');
    
    expect(instructions).toBeInTheDocument();
    expect(instructions).not.toHaveClass('hidden');
    expect(welcomeText).toBeInTheDocument();
  });

  test('should have hidden game area and result sections initially', () => {
    const gameArea = document.getElementById('game-area');
    const resultArea = document.getElementById('result');
    
    expect(gameArea).toHaveClass('hidden');
    expect(resultArea).toHaveClass('hidden');
  });

  test('should display result section with next button', () => {
    const resultHeading = document.querySelector('#result h2');
    const nextButton = screen.getByText('Next Challenge');
    
    expect(resultHeading).toHaveTextContent('Great job!');
    expect(nextButton).toBeInTheDocument();
  });

  test('should have farm background element', () => {
    const farmBackground = document.querySelector('.farm-background');
    expect(farmBackground).toBeInTheDocument();
  });
});
