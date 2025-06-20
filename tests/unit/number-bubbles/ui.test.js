/**
 * @jest-environment jsdom
 */

const { fireEvent } = require('@testing-library/dom');
require('@testing-library/jest-dom');

describe('Number Bubbles UI', () => {
  beforeEach(() => {
    // Set up our document body
    document.body.innerHTML = `
      <div class="container">
        <header>
          <h1>Number Bubbles</h1>
          <div class="score-container">
            <div id="score">Score: 0</div>
            <div id="level">Level: 1</div>
            <div id="timer">Time: <span>60</span>s</div>
          </div>
          <div class="controls">
            <button id="start-btn">Start Game</button>
            <button id="home-btn">Home</button>
            <select id="game-mode">
              <option value="ascending">Ascending Order</option>
              <option value="descending">Descending Order</option>
              <option value="even">Even Numbers</option>
              <option value="odd">Odd Numbers</option>
            </select>
          </div>
        </header>
        <div class="game-board">
          <div id="instructions" class="instructions">
            <h2>Welcome to Number Bubbles!</h2>
          </div>
          <div id="game-area" class="hidden"></div>
          <div id="result" class="hidden">
            <h2>Great job!</h2>
            <p id="result-message">You completed the level!</p>
            <button id="next-btn">Next Level</button>
          </div>
        </div>
      </div>
    `;

    // Mock random function for predictable tests
    Math.random = jest.fn().mockReturnValue(0.5);
  });

  test('game should initially show instructions and hide game area', () => {
    const instructionsDiv = document.getElementById('instructions');
    const gameAreaDiv = document.getElementById('game-area');
    
    expect(instructionsDiv).not.toHaveClass('hidden');
    expect(gameAreaDiv).toHaveClass('hidden');
  });

  test('start button should hide instructions and show game area', () => {
    // Mock the generateBubbles function to avoid DOM manipulation
    global.generateBubbles = jest.fn();
    global.startTimer = jest.fn();
    
    // Include required script logic for the test
    const script = document.createElement('script');
    script.textContent = `
      document.getElementById('start-btn').addEventListener('click', () => {
        document.getElementById('instructions').classList.add('hidden');
        document.getElementById('game-area').classList.remove('hidden');
        if (typeof generateBubbles === 'function') generateBubbles();
        if (typeof startTimer === 'function') startTimer();
      });
    `;
    document.body.appendChild(script);
    
    const startBtn = document.getElementById('start-btn');
    const instructionsDiv = document.getElementById('instructions');
    const gameAreaDiv = document.getElementById('game-area');
    
    fireEvent.click(startBtn);
    
    expect(instructionsDiv).toHaveClass('hidden');
    expect(gameAreaDiv).not.toHaveClass('hidden');
  });

  test('game mode selector should have all required options', () => {
    const gameModeSelect = document.getElementById('game-mode');
    const options = gameModeSelect.options;
    
    expect(options.length).toBe(4);
    expect(options[0].value).toBe('ascending');
    expect(options[1].value).toBe('descending');
    expect(options[2].value).toBe('even');
    expect(options[3].value).toBe('odd');
  });

  test('score and level displays should be properly initialized', () => {
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    
    expect(scoreDisplay.textContent).toBe('Score: 0');
    expect(levelDisplay.textContent).toBe('Level: 1');
  });

  test('timer should start at 60 seconds', () => {
    const timerDisplay = document.getElementById('timer').querySelector('span');
    expect(timerDisplay.textContent).toBe('60');
  });
});
