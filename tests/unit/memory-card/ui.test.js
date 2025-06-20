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
    path.resolve(__dirname, '../../../games/memory-card/index.html'),
    'utf8'
  );
  
  // Mock the script to avoid running it directly
  const scriptEl = document.querySelector('script[src="script.js"]');
  if (scriptEl) scriptEl.remove();
});

describe('Memory Card Game UI', () => {
  test('should render the page title', () => {
    expect(document.title).toBe('Memory Card Game');
  });
  test('should display the game header', () => {
    const header = screen.getByRole('heading', { name: 'Memory Card Game', level: 1 });
    expect(header).toBeInTheDocument();
  });

  test('should display game stats', () => {
    const moves = screen.getByText(/0 Moves/i);
    const timer = screen.getByText(/Time: 0s/i);
    
    expect(moves).toBeInTheDocument();
    expect(timer).toBeInTheDocument();
  });
  test('should display game controls', () => {
    const startButton = screen.getByText('Start New Game');
    const homeButton = screen.getByText('Home');
    const difficultySelector = document.getElementById('difficulty-select');
    
    expect(startButton).toBeInTheDocument();
    expect(homeButton).toBeInTheDocument();
    expect(difficultySelector).toBeInTheDocument();
    
    // Check if difficulty options are present
    expect(difficultySelector.options.length).toBeGreaterThanOrEqual(3);
    expect(difficultySelector.options[0].text).toContain('Easy');
    expect(difficultySelector.options[1].text).toContain('Medium');
    expect(difficultySelector.options[2].text).toContain('Hard');
  });

  test('should display the game board', () => {
    const gameBoard = document.getElementById('game-board');
    expect(gameBoard).toBeInTheDocument();
    expect(gameBoard).toHaveClass('game-board');
  });
});
