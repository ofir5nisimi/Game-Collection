document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const gameModeSelect = document.getElementById('game-mode');
    const startingLevelSelect = document.getElementById('starting-level');
    const levelConfigBtn = document.getElementById('level-config-btn');
    const levelConfigModal = document.getElementById('level-config-modal');
    const saveConfigBtn = document.getElementById('save-config-btn');
    const resetConfigBtn = document.getElementById('reset-config-btn');
    const closeConfigBtn = document.getElementById('close-config-btn');
    const instructionsDiv = document.getElementById('instructions');
    const gameAreaDiv = document.getElementById('game-area');
    const resultDiv = document.getElementById('result');
    const resultMessage = document.getElementById('result-message');
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const livesDisplay = document.getElementById('lives').querySelector('span');

    // Game state
    let score = 0;
    let level = 1;
    let lives = 3;
    let currentMode = '';
    let currentQuestion = {};
    let correctAnswer = null;
    let monsterState = 'hungry';
    let consecutiveCorrect = 0;
    let consecutiveIncorrect = 0;
    
    // Level configuration with default values
    let levelConfig = {
        1: { maxNumber: 3, displayName: 'Level 1 (up to 3)' },
        2: { maxNumber: 5, displayName: 'Level 2 (up to 5)' },
        3: { maxNumber: 10, displayName: 'Level 3 (up to 10)' },
        4: { maxNumber: 15, displayName: 'Level 4 (up to 15)' },
        5: { maxNumber: 20, displayName: 'Level 5 (up to 20)' }
    };
    
    // Monster colors (for variety)
    const monsterColors = [
        '#8e24aa', // Purple
        '#e91e63', // Pink
        '#2196f3', // Blue
        '#4caf50', // Green
        '#ff9800', // Orange
        '#795548'  // Brown
    ];
    
    // Food emojis
    const foodEmojis = ['🍎', '🍌', '🍕', '🍪', '🍦', '🍩'];
    
    // Initialize the game
    function init() {
        loadLevelConfig();
        updateStartingLevelOptions();
        setupEventListeners();
    }
    
    // Load level configuration from localStorage or use defaults
    function loadLevelConfig() {
        const savedConfig = localStorage.getItem('mathMonsterLevelConfig');
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                levelConfig = { ...levelConfig, ...parsed };
            } catch (e) {
                console.warn('Failed to load level config, using defaults');
            }
        }
        updateLevelConfigInputs();
    }
    
    // Save level configuration to localStorage
    function saveLevelConfig() {
        localStorage.setItem('mathMonsterLevelConfig', JSON.stringify(levelConfig));
    }
    
    // Update level configuration inputs with current values
    function updateLevelConfigInputs() {
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`level-${i}-max`);
            if (input) {
                input.value = levelConfig[i].maxNumber;
            }
        }
    }
    
    // Update starting level options based on current configuration
    function updateStartingLevelOptions() {
        const options = startingLevelSelect.querySelectorAll('option');
        options.forEach((option, index) => {
            const levelNum = index + 1;
            option.textContent = `Level ${levelNum} (up to ${levelConfig[levelNum].maxNumber})`;
        });
    }
    
    // Setup all event listeners
    function setupEventListeners() {
        startBtn.addEventListener('click', startGame);
        nextBtn.addEventListener('click', generateQuestion);
        levelConfigBtn.addEventListener('click', openLevelConfig);
        saveConfigBtn.addEventListener('click', saveLevelConfigFromInputs);
        resetConfigBtn.addEventListener('click', resetLevelConfig);
        closeConfigBtn.addEventListener('click', closeLevelConfig);
        
        // Close modal when clicking outside
        levelConfigModal.addEventListener('click', (e) => {
            if (e.target === levelConfigModal) {
                closeLevelConfig();
            }
        });
    }
    
    // Open level configuration modal
    function openLevelConfig() {
        levelConfigModal.classList.remove('hidden');
    }
    
    // Close level configuration modal
    function closeLevelConfig() {
        levelConfigModal.classList.add('hidden');
    }
    
    // Save level configuration from input fields
    function saveLevelConfigFromInputs() {
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`level-${i}-max`);
            if (input) {
                const value = parseInt(input.value);
                if (value >= 1 && value <= 50) {
                    levelConfig[i].maxNumber = value;
                    levelConfig[i].displayName = `Level ${i} (up to ${value})`;
                }
            }
        }
        saveLevelConfig();
        updateStartingLevelOptions();
        closeLevelConfig();
        
        // Show confirmation message
        showMessage('Level settings saved!', 'success');
    }
    
    // Reset level configuration to defaults
    function resetLevelConfig() {
        levelConfig = {
            1: { maxNumber: 3, displayName: 'Level 1 (up to 3)' },
            2: { maxNumber: 5, displayName: 'Level 2 (up to 5)' },
            3: { maxNumber: 10, displayName: 'Level 3 (up to 10)' },
            4: { maxNumber: 15, displayName: 'Level 4 (up to 15)' },
            5: { maxNumber: 20, displayName: 'Level 5 (up to 20)' }
        };
        updateLevelConfigInputs();
        saveLevelConfig();
        updateStartingLevelOptions();
        
        // Show confirmation message
        showMessage('Level settings reset to default!', 'success');
    }
    
    // Show a temporary message
    function showMessage(text, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1001;
            background-color: ${type === 'success' ? '#4caf50' : '#2196f3'};
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(messageDiv);
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }
    
    // Start the game
    function startGame() {
        currentMode = gameModeSelect.value;
        level = parseInt(startingLevelSelect.value);
        score = 0;
        lives = 3;
        consecutiveCorrect = 0;
        consecutiveIncorrect = 0;
        
        updateScore();
        updateLives();
        
        // Reset the result heading to default state
        const resultHeading = document.querySelector('#result h2');
        resultHeading.textContent = 'Great job!';
        resultHeading.classList.remove('incorrect');
        
        instructionsDiv.classList.add('hidden');
        resultDiv.classList.add('hidden');
        gameAreaDiv.classList.remove('hidden');
        
        generateQuestion();
    }
    
    // Generate a question based on the selected mode and current level
    function generateQuestion() {
        gameAreaDiv.innerHTML = ''; // Clear previous content
        monsterState = 'hungry';
        
        // Hide the result div when generating a new question
        resultDiv.classList.add('hidden');
        
        // Choose a random monster color
        const monsterColor = monsterColors[Math.floor(Math.random() * monsterColors.length)];
        
        // Choose a random food emoji
        const foodEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
        
        switch(currentMode) {
            case 'addition':
                generateAdditionQuestion(monsterColor, foodEmoji);
                break;
            case 'subtraction':
                generateSubtractionQuestion(monsterColor, foodEmoji);
                break;
            case 'mixed':
                // Randomly choose between addition and subtraction
                if (Math.random() > 0.5) {
                    generateAdditionQuestion(monsterColor, foodEmoji);
                } else {
                    generateSubtractionQuestion(monsterColor, foodEmoji);
                }
                break;
        }
    }
    
    // Generate an addition question
    function generateAdditionQuestion(monsterColor, foodEmoji) {
        const maxNum = levelConfig[level].maxNumber;
        const num1 = Math.floor(Math.random() * maxNum) + 1;
        const num2 = Math.floor(Math.random() * maxNum) + 1;
        correctAnswer = num1 + num2;
        
        // Create question text
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.textContent = `${num1} + ${num2} = ?`;
        gameAreaDiv.appendChild(questionDiv);
        
        // Create monster
        createMonster(monsterColor);
        
        // Generate answer options
        createAnswerOptions(correctAnswer, maxNum * 2 + 5, foodEmoji);
    }
    
    // Generate a subtraction question
    function generateSubtractionQuestion(monsterColor, foodEmoji) {
        const maxNum = levelConfig[level].maxNumber;
        let num1 = Math.floor(Math.random() * maxNum) + 1;
        let num2 = Math.floor(Math.random() * num1) + 1;
        
        // Ensure we don't get negative results
        if (num2 > num1) {
            [num1, num2] = [num2, num1];
        }
        
        correctAnswer = num1 - num2;
        
        // Create question text
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.textContent = `${num1} - ${num2} = ?`;
        gameAreaDiv.appendChild(questionDiv);
        
        // Create monster
        createMonster(monsterColor);
        
        // Generate answer options
        createAnswerOptions(correctAnswer, maxNum, foodEmoji);
    }
    
    // Create the monster character
    function createMonster(color) {
        const monsterContainer = document.createElement('div');
        monsterContainer.classList.add('monster-container');
        
        const monster = document.createElement('div');
        monster.classList.add('monster', 'happy'); // Start with happy class but hungry appearance
        
        const monsterBody = document.createElement('div');
        monsterBody.classList.add('monster-body');
        monsterBody.style.backgroundColor = color;
        
        const monsterEyes = document.createElement('div');
        monsterEyes.classList.add('monster-eyes');
        
        // Create two eyes
        for (let i = 0; i < 2; i++) {
            const eye = document.createElement('div');
            eye.classList.add('monster-eye');
            
            const pupil = document.createElement('div');
            pupil.classList.add('monster-pupil');
            
            eye.appendChild(pupil);
            monsterEyes.appendChild(eye);
        }
        
        const monsterMouth = document.createElement('div');
        monsterMouth.classList.add('monster-mouth');
        
        monsterBody.appendChild(monsterEyes);
        monsterBody.appendChild(monsterMouth);
        monster.appendChild(monsterBody);
        monsterContainer.appendChild(monster);
        
        gameAreaDiv.appendChild(monsterContainer);
    }
    
    // Create numerical answer options
    function createAnswerOptions(correctAnswer, maxValue, foodEmoji) {
        const answerContainer = document.createElement('div');
        answerContainer.classList.add('answer-options');
        
        // Create an array of possible answers
        let answers = [correctAnswer];
        
        // Add 3 more unique options that are reasonable distractors
        while (answers.length < 4) {
            // Create answers that are close to the correct answer
            let range = Math.max(2, Math.ceil(correctAnswer / 2));
            let min = Math.max(0, correctAnswer - range);
            let max = Math.min(maxValue, correctAnswer + range);
            
            // For smaller numbers, ensure we have a good spread
            if (correctAnswer <= 5) {
                min = 0;
                max = Math.min(10, maxValue);
            }
            
            const randomAnswer = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!answers.includes(randomAnswer) && randomAnswer >= 0) {
                answers.push(randomAnswer);
            }
        }
        
        // Shuffle the answers
        answers = shuffleArray(answers);
        
        // Create buttons for each answer
        answers.forEach(answer => {
            const option = document.createElement('button');
            option.classList.add('answer-btn');
            
            // Add food emojis based on the answer number, organized in rows of 10
            let buttonHTML = '';
            if (answer === 0) {
                buttonHTML = '<div class="emoji-row">0</div>';
            } else {
                const fullRows = Math.floor(answer / 10);
                const remainder = answer % 10;
                
                // Create full rows of 10 emojis
                for (let row = 0; row < fullRows; row++) {
                    buttonHTML += '<div class="emoji-row">';
                    for (let i = 0; i < 10; i++) {
                        buttonHTML += foodEmoji;
                    }
                    buttonHTML += '</div>';
                }
                
                // Add remaining emojis in the last row
                if (remainder > 0) {
                    buttonHTML += '<div class="emoji-row">';
                    for (let i = 0; i < remainder; i++) {
                        buttonHTML += foodEmoji;
                    }
                    buttonHTML += '</div>';
                }
            }
            
            option.innerHTML = buttonHTML;
            option.dataset.answer = answer;
            option.addEventListener('click', checkAnswer);
            answerContainer.appendChild(option);
        });
        
        gameAreaDiv.appendChild(answerContainer);
    }
    
    // Check if the answer is correct
    function checkAnswer(event) {
        // Find the button element (in case we clicked on a child element)
        const button = event.target.closest('.answer-btn');
        const selectedAnswer = parseInt(button.dataset.answer);
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Get the monster element
        const monster = document.querySelector('.monster');
        
        // Reset monster classes to ensure proper state
        monster.className = 'monster';
        
        // Update the result heading based on correctness
        const resultHeading = document.querySelector('#result h2');
        
        if (isCorrect) {
            handleCorrectAnswer(resultHeading);
        } else {
            handleIncorrectAnswer(resultHeading);
        }
        
        // Show the result
        resultDiv.classList.remove('hidden');
    }
    
    // Handle correct answer
    function handleCorrectAnswer(resultHeading) {
        const monster = document.querySelector('.monster');
        
        // Make monster happy when correct
        monster.classList.add('hungry');  // REVERSED: Using hungry class for happy emotion
        monsterState = 'happy';
        
        // Update consecutive counters
        consecutiveCorrect++;
        consecutiveIncorrect = 0;
        
        // Update result and score
        resultHeading.textContent = 'Great job!';
        resultHeading.classList.remove('incorrect');
        score += 10 * level;
        
        let message = `You got it right! You earned ${10 * level} points.`;
        
        // Check for level progression (3 correct in a row)
        if (consecutiveCorrect >= 3) {
            if (level < 5) {
                level++;
                consecutiveCorrect = 0;
                message += ` Amazing! You've advanced to ${levelConfig[level].displayName}!`;
            } else {
                message += ` You're a math master! Keep up the excellent work!`;
            }
        } else {
            const remaining = 3 - consecutiveCorrect;
            message += ` ${remaining} more correct answers to advance to the next level!`;
        }
        
        resultMessage.textContent = message;
        updateScore();
    }
    
    // Handle incorrect answer
    function handleIncorrectAnswer(resultHeading) {
        const monster = document.querySelector('.monster');
        
        // Make monster hungry/sad when incorrect
        monster.classList.add('happy');  // REVERSED: Using happy class for hungry/sad emotion
        monsterState = 'hungry';
        
        // Update consecutive counters
        consecutiveIncorrect++;
        consecutiveCorrect = 0;
        
        // Update result and lives
        resultHeading.textContent = 'Oops!';
        resultHeading.classList.add('incorrect');
        lives--;
        updateLives();
        
        let message = `That's not right. The correct answer was ${correctAnswer}.`;
        
        // Check for level regression (3 incorrect in a row)
        if (consecutiveIncorrect >= 3) {
            if (level > 1) {
                level--;
                consecutiveIncorrect = 0;
                message += ` Don't worry! Let's try ${levelConfig[level].displayName} for a bit.`;
            } else {
                message += ` Keep trying! You can do it!`;
            }
        }
        
        resultMessage.textContent = message;
        
        // Check if game over
        if (lives <= 0) {
            resultMessage.textContent += ' Game Over! Let\'s start again.';
            // Reset the game
            setTimeout(() => {
                startGame();
            }, 3000);
            return;
        }
        
        updateScore();
    }
    
    // Update the score display
    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level} (up to ${levelConfig[level].maxNumber})`;
    }
    
    // Update the lives display
    function updateLives() {
        let heartsText = '';
        for (let i = 0; i < lives; i++) {
            heartsText += '❤️';
        }
        livesDisplay.textContent = heartsText;
    }
    
    // Utility function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Create a falling food animation in the background
    function createFallingFood() {
        const container = document.querySelector('.container');
        const foodCount = 15;
        
        for (let i = 0; i < foodCount; i++) {
            setTimeout(() => {
                const food = document.createElement('div');
                food.className = 'falling-food';
                food.textContent = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
                food.style.left = `${Math.random() * 100}%`;
                food.style.animationDuration = `${Math.random() * 5 + 3}s`;
                food.style.opacity = '0.3';
                food.style.position = 'absolute';
                food.style.top = '-20px';
                food.style.fontSize = '24px';
                food.style.zIndex = '-1';
                food.style.animation = 'fall linear forwards';
                food.style.animationDuration = `${Math.random() * 5 + 5}s`;
                container.appendChild(food);
                
                // Remove the food element after animation
                setTimeout(() => {
                    container.removeChild(food);
                }, (parseInt(food.style.animationDuration) * 1000) + 1000);
            }, i * 800);
        }
    }
    
    // Add falling food animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(calc(100vh - 20px)) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize the game when the page loads
    init();
    
    // Start the falling food animation
    setTimeout(createFallingFood, 1000);
    setInterval(createFallingFood, 15000);
});
