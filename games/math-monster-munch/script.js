document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const gameModeSelect = document.getElementById('game-mode');
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
    let monsterState = 'hungry'; // Can be 'hungry' or 'happy'
    
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
    
    // Start the game
    function startGame() {
        currentMode = gameModeSelect.value;
        score = 0;
        level = 1;
        lives = 3;
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
    }      // Generate a question based on the selected mode and current level
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
        // Determine numbers based on level
        const maxNum = Math.min(5 + Math.floor(level / 2), 15);
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
        createAnswerOptions(correctAnswer, 20, foodEmoji);
    }
    
    // Generate a subtraction question
    function generateSubtractionQuestion(monsterColor, foodEmoji) {
        // Determine numbers based on level, ensuring num1 >= num2
        const maxNum = Math.min(8 + Math.floor(level / 2), 20);
        let num1 = Math.floor(Math.random() * maxNum) + 1;
        let num2 = Math.floor(Math.random() * num1) + 1;
        
        // For higher levels, occasionally use larger numbers with smaller differences
        if (level > 3 && Math.random() > 0.7) {
            num1 = Math.min(10 + level, 20);
            num2 = num1 - (Math.floor(Math.random() * 5) + 1);
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
        createAnswerOptions(correctAnswer, 20, foodEmoji);
    }    // Create the monster character
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
        
        // Use a reasonable maxValue based on level
        const adjustedMaxValue = Math.max(maxValue, correctAnswer + 5);
        
        // Create an array of possible answers
        let answers = [correctAnswer];
        
        // Add 3 more unique options that are reasonable distractors
        while (answers.length < 4) {
            // Create answers that are close to the correct answer
            let range = Math.min(3, Math.ceil(correctAnswer / 3));
            let min = Math.max(0, correctAnswer - range);
            let max = Math.min(adjustedMaxValue, correctAnswer + range);
            
            // For smaller numbers, ensure we have a good spread
            if (correctAnswer <= 5) {
                min = 0;
                max = Math.min(10, adjustedMaxValue);
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
              // Add food emojis based on the answer number
            let buttonText = '';
            for (let i = 0; i < answer; i++) {
                buttonText += foodEmoji;
            }
            
            // If answer is 0, show zero emojis instead of "None"
            if (answer === 0) {
                buttonText = '0';
            }
            
            option.innerHTML = buttonText;
            option.dataset.answer = answer;
            option.addEventListener('click', checkAnswer);
            answerContainer.appendChild(option);
        });
        
        gameAreaDiv.appendChild(answerContainer);
    }    // Check if the answer is correct
    function checkAnswer(event) {
        const selectedAnswer = parseInt(event.target.dataset.answer);
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Get the monster element
        const monster = document.querySelector('.monster');
        
        // Reset monster classes to ensure proper state
        monster.className = 'monster';
        
        // Update the result heading based on correctness
        const resultHeading = document.querySelector('#result h2');
        
        if (isCorrect) {
            // Make monster happy when correct
            monster.classList.add('hungry');  // REVERSED: Using hungry class for happy emotion
            monsterState = 'happy';
            
            // Update result and score
            resultHeading.textContent = 'Great job!';
            resultHeading.classList.remove('incorrect');
            score += 10 * level;
            resultMessage.textContent = `You got it right! You earned ${10 * level} points.`;
            
            // Level up after every 3 correct answers
            if (score / (10 * level) >= 3 * level) {
                level++;
                resultMessage.textContent += ` You've reached level ${level}!`;
            }
            
            updateScore();
        } else {
            // Make monster hungry/sad when incorrect
            monster.classList.add('happy');  // REVERSED: Using happy class for hungry/sad emotion
            monsterState = 'hungry';
            
            // Update result and lives
            resultHeading.textContent = 'Oops!';
            resultHeading.classList.add('incorrect');
            lives--;
            updateLives();
            
            resultMessage.textContent = `That's not right. The correct answer was ${correctAnswer}.`;
            
            // Check if game over
            if (lives <= 0) {
                resultMessage.textContent += ' Game Over! Let\'s start again.';
                // Reset the game
                setTimeout(() => {
                    startGame();
                }, 3000);
                return;
            }
        }
        
        // Show the result
        resultDiv.classList.remove('hidden');
    }
    
    // Update the score display
    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
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
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    nextBtn.addEventListener('click', generateQuestion);
    
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
    
    // Start the falling food animation
    setTimeout(createFallingFood, 1000);
    setInterval(createFallingFood, 15000);
});
