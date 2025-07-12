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

  test('should display game mode selection', () => {
    const gameModeSelect = document.getElementById('game-mode');
    expect(gameModeSelect).toBeInTheDocument();
    
    // Check if mode options are present
    expect(gameModeSelect.options.length).toBe(2);
    expect(gameModeSelect.options[0].text).toBe('Single Player');
    expect(gameModeSelect.options[1].text).toBe('Two Players');
  });

  test('should display player name setup (initially hidden)', () => {
    const playerNamesSetup = document.getElementById('player-names-setup');
    expect(playerNamesSetup).toBeInTheDocument();
    expect(playerNamesSetup).toHaveClass('hidden');
    
    // Check name input fields
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    expect(player1NameInput).toBeInTheDocument();
    expect(player2NameInput).toBeInTheDocument();
    
    // Check placeholders
    expect(player1NameInput.placeholder).toBe('Player 1');
    expect(player2NameInput.placeholder).toBe('Player 2');
    
    // Check max length
    expect(player1NameInput.maxLength).toBe(15);
    expect(player2NameInput.maxLength).toBe(15);
    
    // Check labels
    expect(screen.getByText('Player 1 Name:')).toBeInTheDocument();
    expect(screen.getByText('Player 2 Name:')).toBeInTheDocument();
    
    // Check heading
    expect(screen.getByText('Enter Player Names')).toBeInTheDocument();
  });

  test('should display single player game stats', () => {
    const singleStats = document.getElementById('single-stats');
    expect(singleStats).toBeInTheDocument();
    
    const moves = screen.getByText(/0 Moves/i);
    const timer = screen.getByText(/Time: 0s/i);
    
    expect(moves).toBeInTheDocument();
    expect(timer).toBeInTheDocument();
  });

  test('should display multiplayer player info (initially hidden)', () => {
    const playersInfo = document.getElementById('players-info');
    expect(playersInfo).toBeInTheDocument();
    expect(playersInfo).toHaveClass('hidden');
    
    // Check player cards
    const player1Card = document.querySelector('.player1');
    const player2Card = document.querySelector('.player2');
    expect(player1Card).toBeInTheDocument();
    expect(player2Card).toBeInTheDocument();
    
    // Check player names and scores
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getAllByText('0 pairs')).toHaveLength(2);
    
    // Check turn indicator
    const turnIndicator = document.querySelector('.turn-indicator');
    const turnText = document.querySelector('.turn-text');
    const turnArrow = document.querySelector('.turn-arrow');
    expect(turnIndicator).toBeInTheDocument();
    expect(turnText).toBeInTheDocument();
    expect(turnArrow).toBeInTheDocument();
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
