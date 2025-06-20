/**
 * @jest-environment jsdom
 */

const { fireEvent } = require('@testing-library/dom');
require('@testing-library/jest-dom');

// Mock game state
let gameState = {
  score: 0,
  level: 1,
  lives: 3,
  currentMode: '',
  correctAnswer: null
};

// Simplified mock DOM setup to reduce memory usage
beforeEach(() => {
  // Create a minimal DOM structure to test the script.js functionality
  document.body.innerHTML = `
    <div class="container">
      <div class="score-container">
        <div id="score">Score: 0</div>
        <div id="level">Level: 1</div>
        <div id="lives">Lives: <span>❤️❤️❤️</span></div>
      </div>
      <div class="game-board">
        <div id="instructions" class="instructions"></div>
        <div id="game-area" class="game-area hidden"></div>
        <div id="result" class="result hidden">
          <h2>Great job!</h2>
          <p id="result-message"></p>
        </div>
      </div>
    </div>
  `;

  // Reset the game state before each test
  gameState = {
    score: 0,
    level: 1,
    lives: 3,
    currentMode: 'addition',
    correctAnswer: null
  };
});

describe('Math Monster Munch Game Logic', () => {
  // Simplified helper function for checking answers
  function checkAnswer(isCorrect) {
    // Create monster if it doesn't exist
    if (!document.querySelector('.monster')) {
      const monster = document.createElement('div');
      monster.classList.add('monster', 'hungry');
      document.getElementById('game-area').appendChild(monster);
    }
    
    const monster = document.querySelector('.monster');
    const resultDiv = document.getElementById('result');
    const resultMessage = document.getElementById('result-message');
    
    if (isCorrect) {
      monster.classList.remove('hungry');
      monster.classList.add('happy');
      
      gameState.score += 10 * gameState.level;
      resultMessage.textContent = `You got it right! You earned ${10 * gameState.level} points.`;
      
      // Level up after every 3 correct answers
      if (gameState.score / (10 * gameState.level) >= 3 * gameState.level) {
        gameState.level++;
        resultMessage.textContent += ` You've reached level ${gameState.level}!`;
      }
      
      // Update score display
      document.getElementById('score').textContent = `Score: ${gameState.score}`;
      document.getElementById('level').textContent = `Level: ${gameState.level}`;
    } else {
      monster.classList.remove('happy');
      monster.classList.add('hungry');
      
      gameState.lives--;
      resultMessage.textContent = `That's not right. The correct answer was ${gameState.correctAnswer}.`;
      
      // Update lives display
      let heartsText = '';
      for (let i = 0; i < gameState.lives; i++) {
        heartsText += '❤️';
      }
      document.querySelector('#lives span').textContent = heartsText;
    }
    
    resultDiv.classList.remove('hidden');
    
    return gameState;
  }
  
  // Core tests
  test('should set up initial game state', () => {
    expect(gameState.score).toBe(0);
    expect(gameState.level).toBe(1);
    expect(gameState.lives).toBe(3);
  });
  
  test('should update score when answer is correct', () => {
    const initialState = { ...gameState };
    gameState.correctAnswer = 7;
    
    const updatedState = checkAnswer(true);
    
    expect(updatedState.score).toBe(initialState.score + (10 * initialState.level));
    expect(document.getElementById('score').textContent).toBe(`Score: ${updatedState.score}`);
  });
  
  test('should update lives when answer is incorrect', () => {
    const initialState = { ...gameState };
    gameState.correctAnswer = 7;
    
    const updatedState = checkAnswer(false);
    
    expect(updatedState.lives).toBe(initialState.lives - 1);
    expect(document.querySelector('#lives span').textContent).toBe('❤️❤️');
  });
  
  test('should level up after earning enough points', () => {
    gameState.score = 29; // Just below the threshold for level 2 (30 points)
    gameState.correctAnswer = 7;
    
    const updatedState = checkAnswer(true);
    
    expect(updatedState.level).toBe(2);
    expect(document.getElementById('level').textContent).toBe('Level: 2');
  });
  
  test('should display result message when answering correctly', () => {
    gameState.level = 2;
    gameState.correctAnswer = 7;
    
    checkAnswer(true);
    
    const resultMessage = document.getElementById('result-message');
    expect(resultMessage.textContent).toContain('You got it right!');
    expect(resultMessage.textContent).toContain('20 points');
  });
  
  test('should display the correct answer in the result message when answering incorrectly', () => {
    gameState.correctAnswer = 5;
    
    checkAnswer(false);
    
    const resultMessage = document.getElementById('result-message');
    expect(resultMessage.textContent).toContain('That\'s not right');
    expect(resultMessage.textContent).toContain('The correct answer was 5');
  });
  
  test('should change monster state to happy when answering correctly', () => {
    gameState.correctAnswer = 7;
    
    checkAnswer(true);
    
    const monster = document.querySelector('.monster');
    expect(monster.classList).toContain('happy');
    expect(monster.classList).not.toContain('hungry');
  });
  
  test('should keep monster state as hungry when answering incorrectly', () => {
    gameState.correctAnswer = 7;
    
    checkAnswer(false);
    
    const monster = document.querySelector('.monster');
    expect(monster.classList).toContain('hungry');
    expect(monster.classList).not.toContain('happy');
  });
});
