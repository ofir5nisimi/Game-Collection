/**
 * @jest-environment jsdom
 */

const { fireEvent } = require('@testing-library/dom');
require('@testing-library/jest-dom');

describe('Number Bubbles Game Logic', () => {
  let gameLogic;
  
  beforeEach(() => {
    // Set up document body
    document.body.innerHTML = `
      <div class="container">
        <header>
          <div class="score-container">
            <div id="score">Score: 0</div>
            <div id="level">Level: 1</div>
            <div id="timer">Time: <span>60</span>s</div>
          </div>
        </header>
        <div class="game-board">
          <div id="game-area"></div>
          <div id="result" class="hidden">
            <h2>Great job!</h2>
            <p id="result-message"></p>
          </div>
        </div>
      </div>
    `;
    
    // Mock functions and variables needed for testing
    gameLogic = {
      bubbles: [2, 4, 6, 8],
      nextBubbleIndex: 0,
      score: 0,
      level: 1,
      currentMode: 'ascending',
      
      // Basic implementation of checkBubble for testing
      checkBubble: function(event) {
        const clickedNumber = parseInt(event.target.dataset.number);
        
        if (this.currentMode === 'ascending' || this.currentMode === 'descending') {
          if (clickedNumber === this.bubbles[this.nextBubbleIndex]) {
            event.target.classList.add('correct');
            this.nextBubbleIndex++;
            this.score += 10;
            document.getElementById('score').textContent = `Score: ${this.score}`;
            
            if (this.nextBubbleIndex >= this.bubbles.length) {
              this.level++;
              document.getElementById('level').textContent = `Level: ${this.level}`;
              document.getElementById('result').classList.remove('hidden');
            }
          } else {
            event.target.classList.add('wrong');
            this.score = Math.max(0, this.score - 5);
            document.getElementById('score').textContent = `Score: ${this.score}`;
          }
        } else if (this.currentMode === 'even') {
          if (clickedNumber % 2 === 0) {
            event.target.classList.add('correct');
            this.score += 10;
            document.getElementById('score').textContent = `Score: ${this.score}`;
            
            const index = this.bubbles.indexOf(clickedNumber);
            if (index > -1) {
              this.bubbles.splice(index, 1);
            }
            
            if (this.bubbles.length === 0) {
              this.level++;
              document.getElementById('level').textContent = `Level: ${this.level}`;
              document.getElementById('result').classList.remove('hidden');
            }
          } else {
            event.target.classList.add('wrong');
            this.score = Math.max(0, this.score - 5);
            document.getElementById('score').textContent = `Score: ${this.score}`;
          }
        } else if (this.currentMode === 'odd') {
          if (clickedNumber % 2 !== 0) {
            event.target.classList.add('correct');
            this.score += 10;
            document.getElementById('score').textContent = `Score: ${this.score}`;
            
            const index = this.bubbles.indexOf(clickedNumber);
            if (index > -1) {
              this.bubbles.splice(index, 1);
            }
            
            if (this.bubbles.length === 0) {
              this.level++;
              document.getElementById('level').textContent = `Level: ${this.level}`;
              document.getElementById('result').classList.remove('hidden');
            }
          } else {
            event.target.classList.add('wrong');
            this.score = Math.max(0, this.score - 5);
            document.getElementById('score').textContent = `Score: ${this.score}`;
          }
        }
      }
    };
  });

  test('clicking correct bubble in ascending mode should increase score', () => {
    // Create a bubble element
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.dataset.number = '2';  // First bubble in the sequence
    document.getElementById('game-area').appendChild(bubble);
    
    // Click the bubble
    gameLogic.checkBubble({ target: bubble });
    
    // Check if score increased
    expect(gameLogic.score).toBe(10);
    expect(bubble).toHaveClass('correct');
    expect(document.getElementById('score').textContent).toBe('Score: 10');
  });

  test('clicking wrong bubble in ascending mode should decrease score', () => {
    // Set initial score
    gameLogic.score = 20;
    document.getElementById('score').textContent = `Score: ${gameLogic.score}`;
    
    // Create a bubble element
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.dataset.number = '4';  // Second bubble in the sequence, but we're at index 0
    document.getElementById('game-area').appendChild(bubble);
    
    // Click the bubble
    gameLogic.checkBubble({ target: bubble });
    
    // Check if score decreased
    expect(gameLogic.score).toBe(15);
    expect(bubble).toHaveClass('wrong');
    expect(document.getElementById('score').textContent).toBe('Score: 15');
  });

  test('completing a level should increment level counter', () => {
    // Set up to complete the level
    gameLogic.nextBubbleIndex = gameLogic.bubbles.length - 1;
    
    // Create the last bubble in the sequence
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.dataset.number = '8';  // Last bubble in the sequence
    document.getElementById('game-area').appendChild(bubble);
    
    // Click the bubble to complete the level
    gameLogic.checkBubble({ target: bubble });
    
    // Check if level increased
    expect(gameLogic.level).toBe(2);
    expect(document.getElementById('level').textContent).toBe('Level: 2');
    expect(document.getElementById('result')).not.toHaveClass('hidden');
  });

  test('clicking even number in even mode should increase score', () => {
    // Switch to even mode
    gameLogic.currentMode = 'even';
    
    // Create a bubble with even number
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.dataset.number = '4';  // Even number
    document.getElementById('game-area').appendChild(bubble);
    
    // Click the bubble
    gameLogic.checkBubble({ target: bubble });
    
    // Check if score increased
    expect(gameLogic.score).toBe(10);
    expect(bubble).toHaveClass('correct');
  });

  test('clicking odd number in odd mode should increase score', () => {
    // Switch to odd mode and set bubbles for odd numbers
    gameLogic.currentMode = 'odd';
    gameLogic.bubbles = [1, 3, 5, 7];
    
    // Create a bubble with odd number
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.dataset.number = '3';  // Odd number
    document.getElementById('game-area').appendChild(bubble);
    
    // Click the bubble
    gameLogic.checkBubble({ target: bubble });
    
    // Check if score increased
    expect(gameLogic.score).toBe(10);
    expect(bubble).toHaveClass('correct');
  });

  test('score should not go below zero', () => {
    // Set initial score to 0
    gameLogic.score = 0;
    document.getElementById('score').textContent = `Score: ${gameLogic.score}`;
    
    // Create a bubble element with wrong number
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.dataset.number = '4';  // Not the first bubble in sequence
    document.getElementById('game-area').appendChild(bubble);
    
    // Click the bubble
    gameLogic.checkBubble({ target: bubble });
    
    // Check that score doesn't go below 0
    expect(gameLogic.score).toBe(0);
    expect(document.getElementById('score').textContent).toBe('Score: 0');
  });
});
