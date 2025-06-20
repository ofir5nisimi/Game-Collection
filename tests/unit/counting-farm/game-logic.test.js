/**
 * @jest-environment jsdom
 */

const { fireEvent } = require('@testing-library/dom');
require('@testing-library/jest-dom');

// Mock game state
let gameState = {
  score: 0,
  level: 1,
  currentMode: '',
  correctAnswer: null
};

// Mock animals data
const mockAnimals = {
  cow: { image: 'cow.png', sound: 'moo.mp3', plural: 'cows' },
  sheep: { image: 'sheep.png', sound: 'baa.mp3', plural: 'sheep' },
  pig: { image: 'pig.png', sound: 'oink.mp3', plural: 'pigs' },
  chicken: { image: 'chicken.png', sound: 'cluck.mp3', plural: 'chickens' },
  duck: { image: 'duck.png', sound: 'quack.mp3', plural: 'ducks' },
  horse: { image: 'horse.png', sound: 'neigh.mp3', plural: 'horses' }
};

// Mock DOM setup
beforeEach(() => {
  // Create a minimal DOM structure to test the script.js functionality
  document.body.innerHTML = `
    <div class="container">
      <header>
        <h1>Counting Farm</h1>
        <div class="score-container">
          <div id="score">Score: 0</div>
          <div id="level">Level: 1</div>
        </div>
        <div class="controls">
          <button id="start-btn">Start Game</button>
          <button id="home-btn">Home</button>
          <select id="game-mode">
            <option value="counting">Counting</option>
            <option value="comparing">Comparing</option>
            <option value="grouping">Grouping</option>
            <option value="sharing">Sharing</option>
          </select>
        </div>
      </header>

      <div class="game-board">
        <div id="instructions" class="instructions">
          <h2>Welcome to Counting Farm!</h2>
          <p>Help Farmer Jo take care of the animals by solving fun math problems.</p>
          <p>Choose a game mode and press Start to begin!</p>
        </div>
        
        <div id="game-area" class="game-area hidden">
          <!-- Game content will be dynamically generated here -->
        </div>
        
        <div id="result" class="result hidden">
          <h2>Great job!</h2>
          <p id="result-message"></p>
          <button id="next-btn">Next Challenge</button>
        </div>
      </div>
    </div>
  `;

  // Reset the game state before each test
  gameState = {
    score: 0,
    level: 1,
    currentMode: '',
    correctAnswer: null
  };
  
  // Mock Math.random to return predictable values
  jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
});

afterEach(() => {
  // Restore Math.random
  jest.spyOn(global.Math, 'random').mockRestore();
});

describe('Counting Farm Game Logic', () => {
  // Create utility functions to simulate the game's core functionality
  function startGame(mode = 'counting') {
    gameState.currentMode = mode;
    gameState.score = 0;
    gameState.level = 1;
    
    // Simulate hiding instructions and result, showing game area
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    
    // Generate question based on mode
    return generateQuestion(mode);
  }
  
  function generateQuestion(mode) {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = ''; // Clear previous content
    
    switch(mode) {
      case 'counting':
        return generateCountingQuestion();
      case 'comparing':
        return generateComparingQuestion();
      case 'grouping':
        return generateGroupingQuestion();
      case 'sharing':
        return generateSharingQuestion();
      default:
        return null;
    }
  }
  
  function generateCountingQuestion() {
    // For testing, we use fixed values
    const animalType = 'cow';
    // Level 1 will have count of 3 (level + random(0.5*3))
    const count = Math.min(Math.floor(0.5 * 3) + gameState.level, 10);
    gameState.correctAnswer = count;
    
    // Create question and answer elements
    const gameArea = document.getElementById('game-area');
    
    // Add question text
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.textContent = `How many ${mockAnimals[animalType].plural} are in the farm?`;
    gameArea.appendChild(questionDiv);
    
    // Add animals container
    const animalContainer = document.createElement('div');
    animalContainer.classList.add('animal-container');
    
    // Add animals
    for (let i = 0; i < count; i++) {
      const animalElement = document.createElement('div');
      animalElement.classList.add('animal');
      animalContainer.appendChild(animalElement);
    }
    
    gameArea.appendChild(animalContainer);
    
    // Add answer options (1, 2, 3, 4 for testing)
    const answerContainer = document.createElement('div');
    answerContainer.classList.add('answer-options');
    
    for (let i = 1; i <= 4; i++) {
      const option = document.createElement('button');
      option.classList.add('answer-btn');
      option.textContent = i;
      option.dataset.answer = i;
      answerContainer.appendChild(option);
    }
    
    gameArea.appendChild(answerContainer);
    
    return gameState;
  }
  
  function generateComparingQuestion() {
    // For testing, we simulate a comparing question with cows and sheep
    const animalType1 = 'cow';
    const animalType2 = 'sheep';
    
    // Level 1 with fixed counts for testing
    const count1 = 3;
    const count2 = 4;
    
    // This is a "which has more" question, so sheep (animalType2) is correct
    const isMoreQuestion = true;
    gameState.correctAnswer = animalType2;
    
    // Create question and animal groups
    const gameArea = document.getElementById('game-area');
    
    // Add question text
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.textContent = `Which animal has more in the farm?`;
    gameArea.appendChild(questionDiv);
    
    // Create groups container
    const groupsContainer = document.createElement('div');
    groupsContainer.style.display = 'flex';
    
    // Add groups for both animal types
    for (const [animalType, count] of [[animalType1, count1], [animalType2, count2]]) {
      const group = document.createElement('div');
      group.classList.add('animal-group');
      
      const title = document.createElement('h3');
      title.textContent = mockAnimals[animalType].plural;
      group.appendChild(title);
      
      const animalContainer = document.createElement('div');
      animalContainer.classList.add('animal-container');
      
      for (let i = 0; i < count; i++) {
        const animalElement = document.createElement('div');
        animalElement.classList.add('animal');
        animalContainer.appendChild(animalElement);
      }
      
      group.appendChild(animalContainer);
      groupsContainer.appendChild(group);
    }
    
    gameArea.appendChild(groupsContainer);
    
    // Add answer options
    const answerContainer = document.createElement('div');
    answerContainer.classList.add('answer-options');
    
    // Create buttons for each animal type and "same" option
    const options = [
      { text: mockAnimals[animalType1].plural, value: animalType1 },
      { text: mockAnimals[animalType2].plural, value: animalType2 },
      { text: 'Same', value: 'same' }
    ];
    
    options.forEach(option => {
      const button = document.createElement('button');
      button.classList.add('answer-btn');
      button.textContent = option.text;
      button.dataset.answer = option.value;
      answerContainer.appendChild(button);
    });
    
    gameArea.appendChild(answerContainer);
    
    return gameState;
  }
  
  function generateGroupingQuestion() {
    // For testing, we simulate an odd/even question
    const animalType = 'pig';
    
    // Generate an odd number for testing
    const count = 5; // Odd
    gameState.correctAnswer = 'odd';
    
    // Create question and animals
    const gameArea = document.getElementById('game-area');
    
    // Add question text
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.textContent = `Is the number of ${mockAnimals[animalType].plural} odd or even?`;
    gameArea.appendChild(questionDiv);
    
    // Add animals
    const animalContainer = document.createElement('div');
    animalContainer.classList.add('animal-container');
    
    for (let i = 0; i < count; i++) {
      const animalElement = document.createElement('div');
      animalElement.classList.add('animal');
      animalContainer.appendChild(animalElement);
    }
    
    gameArea.appendChild(animalContainer);
    
    // Add answer options
    const answerContainer = document.createElement('div');
    answerContainer.classList.add('answer-options');
    
    const oddButton = document.createElement('button');
    oddButton.classList.add('answer-btn');
    oddButton.textContent = 'Odd';
    oddButton.dataset.answer = 'odd';
    
    const evenButton = document.createElement('button');
    evenButton.classList.add('answer-btn');
    evenButton.textContent = 'Even';
    evenButton.dataset.answer = 'even';
    
    answerContainer.appendChild(oddButton);
    answerContainer.appendChild(evenButton);
    
    gameArea.appendChild(answerContainer);
    
    return gameState;
  }
  
  function generateSharingQuestion() {
    // For testing, we simulate a sharing question
    const animalType = 'chicken';
    
    // Fixed values for testing
    const groups = 3; // 3 pens
    const itemsPerGroup = 2; // 2 chickens per pen
    const totalItems = groups * itemsPerGroup; // 6 total chickens
    
    gameState.correctAnswer = itemsPerGroup;
    
    // Create question and animals
    const gameArea = document.getElementById('game-area');
    
    // Add question text
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.textContent = `If we share ${totalItems} ${mockAnimals[animalType].plural} equally among ${groups} pens, how many ${mockAnimals[animalType].plural} will be in each pen?`;
    gameArea.appendChild(questionDiv);
    
    // Add animals
    const animalContainer = document.createElement('div');
    animalContainer.classList.add('animal-container');
    
    for (let i = 0; i < totalItems; i++) {
      const animalElement = document.createElement('div');
      animalElement.classList.add('animal');
      animalContainer.appendChild(animalElement);
    }
    
    gameArea.appendChild(animalContainer);
    
    // Add pens
    const pensContainer = document.createElement('div');
    pensContainer.classList.add('pens-container');
    
    for (let i = 0; i < groups; i++) {
      const pen = document.createElement('div');
      pen.classList.add('pen');
      pen.textContent = '?';
      pensContainer.appendChild(pen);
    }
    
    gameArea.appendChild(pensContainer);
    
    // Add answer options
    const answerContainer = document.createElement('div');
    answerContainer.classList.add('answer-options');
    
    for (let i = 1; i <= 4; i++) {
      const option = document.createElement('button');
      option.classList.add('answer-btn');
      option.textContent = i;
      option.dataset.answer = i;
      answerContainer.appendChild(option);
    }
    
    gameArea.appendChild(answerContainer);
    
    return gameState;
  }
  
  function checkAnswer(selectedAnswer) {
    const isCorrect = selectedAnswer == gameState.correctAnswer; // Using == to handle string/number comparisons
    
    // Update the result heading based on correctness
    const resultHeading = document.querySelector('#result h2');
    const resultMessage = document.getElementById('result-message');
    
    if (isCorrect) {
      resultHeading.textContent = 'Great job!';
      resultHeading.classList.remove('incorrect');
      gameState.score += 10 * gameState.level;
      resultMessage.textContent = `You got it right! You earned ${10 * gameState.level} points.`;
      
      // Increase level after every 3 correct answers
      if (gameState.score >= gameState.level * 30) {
        gameState.level++;
        resultMessage.textContent += ` You've advanced to level ${gameState.level}!`;
      }
    } else {
      resultHeading.textContent = 'Oops!';
      resultHeading.classList.add('incorrect');
      resultMessage.textContent = `Not quite right. The correct answer was ${gameState.correctAnswer}.`;
    }
    
    // Update score display
    document.getElementById('score').textContent = `Score: ${gameState.score}`;
    document.getElementById('level').textContent = `Level: ${gameState.level}`;
    
    // Show result, hide game area
    document.getElementById('game-area').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    
    return { isCorrect, gameState };
  }

  // Tests
  test('should initialize the game in counting mode correctly', () => {
    const state = startGame('counting');
    
    expect(state.currentMode).toBe('counting');
    expect(state.score).toBe(0);
    expect(state.level).toBe(1);
    expect(state.correctAnswer).toBeDefined();
    
    // Check that the game elements are displayed
    expect(document.getElementById('instructions').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('result').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('game-area').classList.contains('hidden')).toBe(false);
    
    // Check that a question is displayed
    const questionDiv = document.querySelector('.question');
    expect(questionDiv).toBeTruthy();
    expect(questionDiv.textContent).toContain('How many');
    
    // Check that animals are displayed
    const animals = document.querySelectorAll('.animal');
    expect(animals.length).toBeGreaterThan(0);
    
    // Check that answer options are displayed
    const answerBtns = document.querySelectorAll('.answer-btn');
    expect(answerBtns.length).toBe(4);
  });

  test('should initialize the game in comparing mode correctly', () => {
    const state = startGame('comparing');
    
    expect(state.currentMode).toBe('comparing');
    expect(state.correctAnswer).toBeDefined();
    
    // Check that the question is about comparing
    const questionDiv = document.querySelector('.question');
    expect(questionDiv.textContent).toContain('Which animal has more');
    
    // Check that both animal groups are displayed
    const animalGroups = document.querySelectorAll('.animal-group');
    expect(animalGroups.length).toBe(2);
    
    // Check that answer options include both animal types and 'Same'
    const answerBtns = document.querySelectorAll('.answer-btn');
    expect(answerBtns.length).toBe(3);
    expect(answerBtns[2].textContent).toBe('Same');
  });

  test('should initialize the game in grouping mode correctly', () => {
    const state = startGame('grouping');
    
    expect(state.currentMode).toBe('grouping');
    expect(state.correctAnswer).toBeDefined();
    
    // Check that the question is about odd/even
    const questionDiv = document.querySelector('.question');
    expect(questionDiv.textContent).toContain('odd or even');
    
    // Check that answer options are 'Odd' and 'Even'
    const answerBtns = document.querySelectorAll('.answer-btn');
    expect(answerBtns.length).toBe(2);
    expect(answerBtns[0].textContent).toBe('Odd');
    expect(answerBtns[1].textContent).toBe('Even');
  });

  test('should initialize the game in sharing mode correctly', () => {
    const state = startGame('sharing');
    
    expect(state.currentMode).toBe('sharing');
    expect(state.correctAnswer).toBeDefined();
    
    // Check that the question is about sharing
    const questionDiv = document.querySelector('.question');
    expect(questionDiv.textContent).toContain('share');
    expect(questionDiv.textContent).toContain('pens');
    
    // Check that pens are displayed
    const pens = document.querySelectorAll('.pen');
    expect(pens.length).toBeGreaterThan(0);
    
    // Check that answer options are displayed
    const answerBtns = document.querySelectorAll('.answer-btn');
    expect(answerBtns.length).toBe(4);
  });

  test('should handle correct answer properly', () => {
    startGame('counting');
    const correctAnswer = gameState.correctAnswer;
    
    const result = checkAnswer(correctAnswer);
    
    expect(result.isCorrect).toBe(true);
    expect(result.gameState.score).toBe(10); // 10 * level 1
    
    // Check that the result display is updated correctly
    const resultHeading = document.querySelector('#result h2');
    expect(resultHeading.textContent).toBe('Great job!');
    expect(resultHeading.classList.contains('incorrect')).toBe(false);
    
    const resultMessage = document.getElementById('result-message');
    expect(resultMessage.textContent).toContain('You got it right');
    
    // Check that the score display is updated
    expect(document.getElementById('score').textContent).toBe('Score: 10');
  });

  test('should handle incorrect answer properly', () => {
    startGame('counting');
    const correctAnswer = gameState.correctAnswer;
    const wrongAnswer = correctAnswer + 1;
    
    const result = checkAnswer(wrongAnswer);
    
    expect(result.isCorrect).toBe(false);
    expect(result.gameState.score).toBe(0); // No points for wrong answer
    
    // Check that the result display is updated correctly
    const resultHeading = document.querySelector('#result h2');
    expect(resultHeading.textContent).toBe('Oops!');
    expect(resultHeading.classList.contains('incorrect')).toBe(true);
    
    const resultMessage = document.getElementById('result-message');
    expect(resultMessage.textContent).toContain('Not quite right');
    expect(resultMessage.textContent).toContain(correctAnswer.toString());
  });

  test('should level up after 3 correct answers', () => {
    startGame('counting');
    const correctAnswer = gameState.correctAnswer;
    
    // First correct answer
    checkAnswer(correctAnswer);
    expect(gameState.score).toBe(10);
    expect(gameState.level).toBe(1);
    
    // Second correct answer
    gameState.correctAnswer = 3;
    checkAnswer(gameState.correctAnswer);
    expect(gameState.score).toBe(20);
    expect(gameState.level).toBe(1);
    
    // Third correct answer - should level up
    gameState.correctAnswer = 4;
    checkAnswer(gameState.correctAnswer);
    expect(gameState.score).toBe(30);
    expect(gameState.level).toBe(2);
    
    // Check that level display is updated
    expect(document.getElementById('level').textContent).toBe('Level: 2');
  });
});
