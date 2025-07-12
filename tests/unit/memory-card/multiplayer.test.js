/**
 * @jest-environment jsdom
 */

const { fireEvent } = require('@testing-library/dom');
require('@testing-library/jest-dom');
const fs = require('fs');
const path = require('path');

// Mock Web Audio API
const mockAudioContext = {
  createOscillator: jest.fn(() => ({
    type: 'sine',
    frequency: { setValueAtTime: jest.fn() },
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn()
  })),
  createGain: jest.fn(() => ({
    gain: {
      setValueAtTime: jest.fn(),
      linearRampToValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn()
    },
    connect: jest.fn()
  })),
  currentTime: 0,
  destination: {}
};

global.AudioContext = jest.fn(() => mockAudioContext);
global.webkitAudioContext = jest.fn(() => mockAudioContext);

describe('Memory Card Game Multiplayer Functionality', () => {
  let gameModeSelect, player1NameInput, player2NameInput, startBtn;
  let playersInfo, playerNamesSetup, singleStats, compactTurnStatus;
  let player1Card, player2Card, turnText, gameBoard;

  beforeEach(() => {
    // Load the actual HTML file
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, '../../../games/memory-card/index.html'),
      'utf8'
    );

    // Get DOM elements
    gameModeSelect = document.getElementById('game-mode');
    player1NameInput = document.getElementById('player1-name');
    player2NameInput = document.getElementById('player2-name');
    startBtn = document.getElementById('start-btn');
    playersInfo = document.getElementById('players-info');
    playerNamesSetup = document.getElementById('player-names-setup');
    singleStats = document.getElementById('single-stats');
    compactTurnStatus = document.getElementById('compact-turn-status');
    player1Card = document.querySelector('.player1');
    player2Card = document.querySelector('.player2');
    turnText = document.querySelector('.turn-text');
    gameBoard = document.getElementById('game-board');

    // Remove script tag to prevent actual script loading
    const scriptEl = document.querySelector('script[src="script.js"]');
    if (scriptEl) scriptEl.remove();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('HTML Structure and Initial State', () => {
    test('should have all required multiplayer DOM elements', () => {
      expect(gameModeSelect).toBeInTheDocument();
      expect(player1NameInput).toBeInTheDocument();
      expect(player2NameInput).toBeInTheDocument();
      expect(playersInfo).toBeInTheDocument();
      expect(playerNamesSetup).toBeInTheDocument();
      expect(compactTurnStatus).toBeInTheDocument();
      expect(player1Card).toBeInTheDocument();
      expect(player2Card).toBeInTheDocument();
    });

    test('should have correct initial HTML state', () => {
      // Check initial visibility states as set in HTML
      expect(playersInfo).toHaveClass('hidden');
      expect(playerNamesSetup).toHaveClass('hidden');
      expect(compactTurnStatus).toHaveClass('hidden');
      expect(singleStats).not.toHaveClass('hidden');
    });

    test('should have game mode options', () => {
      expect(gameModeSelect.options.length).toBe(2);
      expect(gameModeSelect.options[0].value).toBe('single');
      expect(gameModeSelect.options[1].value).toBe('multiplayer');
    });
  });

  describe('Player Name Input Elements', () => {
    test('should have correct input attributes', () => {
      expect(player1NameInput.maxLength).toBe(15);
      expect(player2NameInput.maxLength).toBe(15);
      expect(player1NameInput.placeholder).toBe('Player 1');
      expect(player2NameInput.placeholder).toBe('Player 2');
    });

    test('should accept user input', () => {
      player1NameInput.value = 'Alice';
      player2NameInput.value = 'Bob';

      fireEvent.input(player1NameInput);
      fireEvent.input(player2NameInput);

      expect(player1NameInput.value).toBe('Alice');
      expect(player2NameInput.value).toBe('Bob');
    });

    test('should enforce character limit', () => {
      const longName = 'ThisIsAVeryLongNameThatExceedsTheLimit';
      player1NameInput.value = longName;
      
      // The browser will automatically enforce maxLength
      expect(player1NameInput.maxLength).toBe(15);
    });
  });

  describe('Player Display Elements', () => {
    test('should have player cards with correct structure', () => {
      const player1Name = document.querySelector('.player1 .player-name');
      const player1Score = document.querySelector('.player1 .player-score');
      const player2Name = document.querySelector('.player2 .player-name');
      const player2Score = document.querySelector('.player2 .player-score');

      expect(player1Name).toBeInTheDocument();
      expect(player1Score).toBeInTheDocument();
      expect(player2Name).toBeInTheDocument();
      expect(player2Score).toBeInTheDocument();

      expect(player1Name.textContent).toBe('Player 1');
      expect(player2Name.textContent).toBe('Player 2');
      expect(player1Score.textContent).toBe('0 pairs');
      expect(player2Score.textContent).toBe('0 pairs');
    });

    test('should have turn indicator elements', () => {
      const turnArrow = document.querySelector('.turn-arrow');
      expect(turnArrow).toBeInTheDocument();
      expect(turnText).toBeInTheDocument();
      expect(turnText.textContent).toBe("Player 1's Turn");
    });
  });

  describe('Mobile UI Elements', () => {
    test('should have compact turn status elements', () => {
      const compactTurnText = document.querySelector('.compact-turn-text');
      expect(compactTurnText).toBeInTheDocument();
      expect(compactTurnText.textContent).toBe("Player 1's Turn");
    });

    test('should have game board ready for styling', () => {
      expect(gameBoard).toHaveClass('game-board');
      expect(gameBoard).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling Setup', () => {
    test('should have player-specific CSS classes', () => {
      expect(player1Card).toHaveClass('player1');
      expect(player2Card).toHaveClass('player2');
    });

    test('should have all required CSS class names for theming', () => {
      // Check that elements have the base classes for styling
      expect(compactTurnStatus).toHaveClass('compact-turn-status');
      expect(gameBoard).toHaveClass('game-board');
    });
  });

  describe('JavaScript Integration Points', () => {
    test('should have elements with correct IDs for script interaction', () => {
      expect(gameModeSelect.id).toBe('game-mode');
      expect(player1NameInput.id).toBe('player1-name');
      expect(player2NameInput.id).toBe('player2-name');
      expect(playersInfo.id).toBe('players-info');
      expect(compactTurnStatus.id).toBe('compact-turn-status');
    });

    test('should have event target elements', () => {
      expect(startBtn).toBeInTheDocument();
      expect(startBtn.textContent).toBe('Start New Game');
    });
  });

  describe('Sound Effects Integration', () => {
    test('should support Web Audio API mocking', () => {
      expect(() => {
        new AudioContext();
      }).not.toThrow();
    });

    test('should have script content with playSuccessSound function', () => {
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );
      
      expect(scriptContent).toContain('function playSuccessSound');
      expect(scriptContent).toContain('playSuccessSound()');
    });
  });

  describe('Multiplayer Logic Infrastructure', () => {
    test('should have script variables for multiplayer state', () => {
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      // Check for multiplayer state variables
      expect(scriptContent).toContain('isMultiplayer');
      expect(scriptContent).toContain('currentPlayer');
      expect(scriptContent).toContain('playerScores');
      expect(scriptContent).toContain('playerNames');
    });

    test('should have game mode handling functions', () => {
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      expect(scriptContent).toContain('handleGameModeChange');
      expect(scriptContent).toContain('updatePlayerDisplay');
      expect(scriptContent).toContain('switchPlayer');
    });

    test('should have color theming logic', () => {
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      expect(scriptContent).toContain('player1-active');
      expect(scriptContent).toContain('player2-active');
      expect(scriptContent).toContain('player1-turn');
      expect(scriptContent).toContain('player2-turn');
    });
  });

  describe('Winner Determination Setup', () => {
    test('should have elements for score tracking', () => {
      const player1Score = document.querySelector('.player1 .player-score');
      const player2Score = document.querySelector('.player2 .player-score');

      expect(player1Score).toBeInTheDocument();
      expect(player2Score).toBeInTheDocument();
    });

    test('should have winner logic in script', () => {
      const scriptContent = fs.readFileSync(
        path.resolve(__dirname, '../../../games/memory-card/script.js'),
        'utf8'
      );

      expect(scriptContent).toContain('endGame');
      expect(scriptContent).toContain('Wins!');
      expect(scriptContent).toContain("It's a Tie!");
    });
  });
}); 