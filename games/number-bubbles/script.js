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
    const timerDisplay = document.getElementById('timer').querySelector('span');

    // Game state
    let score = 0;
    let level = 1;
    let currentMode = '';
    let bubbles = [];
    let nextBubbleIndex = 0;
    let timeLeft = 60;
    let timerInterval = null;
    let bubbleColors = [
        '#2196f3', // Blue
        '#4caf50', // Green
        '#ff9800', // Orange
        '#9c27b0', // Purple
        '#e91e63', // Pink
        '#3f51b5'  // Indigo
    ];

    // Start the game
    function startGame() {
        currentMode = gameModeSelect.value;
        score = 0;
        level = 1;
        timeLeft = 60;
        nextBubbleIndex = 0;
        updateScore();
        updateTimer();
        
        // Reset the result heading to default state
        const resultHeading = document.querySelector('#result h2');
        resultHeading.textContent = 'Great job!';
        resultHeading.classList.remove('incorrect');
        
        instructionsDiv.classList.add('hidden');
        resultDiv.classList.add('hidden');
        gameAreaDiv.classList.remove('hidden');
        
        generateBubbles();
        startTimer();
    }

    // Generate bubbles based on the selected mode and level
    function generateBubbles() {
        gameAreaDiv.innerHTML = ''; // Clear previous bubbles
        bubbles = [];
        nextBubbleIndex = 0;
        
        // Determine number of bubbles based on level
        const bubbleCount = Math.min(5 + level, 15);
        
        // Generate random numbers based on game mode
        let numbers = [];
        const maxNum = 10 + (level * 2);
        
        switch(currentMode) {
            case 'ascending':
                // Generate random unique numbers
                while(numbers.length < bubbleCount) {
                    const num = Math.floor(Math.random() * maxNum) + 1;
                    if (!numbers.includes(num)) {
                        numbers.push(num);
                    }
                }
                // Sort for the correct order to check against
                bubbles = [...numbers].sort((a, b) => a - b);
                break;
                
            case 'descending':
                // Generate random unique numbers
                while(numbers.length < bubbleCount) {
                    const num = Math.floor(Math.random() * maxNum) + 1;
                    if (!numbers.includes(num)) {
                        numbers.push(num);
                    }
                }
                // Sort for the correct order to check against
                bubbles = [...numbers].sort((a, b) => b - a);
                break;
                
            case 'even':
                // Generate even numbers
                let availableEvens = [];
                for (let i = 2; i <= maxNum; i += 2) {
                    availableEvens.push(i);
                }
                // Shuffle and pick subset
                availableEvens = shuffleArray(availableEvens);
                bubbles = availableEvens.slice(0, bubbleCount);
                numbers = [...bubbles]; // Random display order
                break;
                
            case 'odd':
                // Generate odd numbers
                let availableOdds = [];
                for (let i = 1; i <= maxNum; i += 2) {
                    availableOdds.push(i);
                }
                // Shuffle and pick subset
                availableOdds = shuffleArray(availableOdds);
                bubbles = availableOdds.slice(0, bubbleCount);
                numbers = [...bubbles]; // Random display order
                break;
        }
        
        // Shuffle display order
        numbers = shuffleArray(numbers);
        
        // Create bubbles in the game area
        numbers.forEach(number => {
            createBubble(number);
        });
    }    // Create a bubble element
    function createBubble(number) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.textContent = number;
        bubble.dataset.number = number;
        
        // Randomize position with overlap prevention
        const gameArea = gameAreaDiv.getBoundingClientRect();
        const bubbleSize = 60;
        const maxX = gameArea.width - bubbleSize;
        const maxY = gameArea.height - bubbleSize;
        
        // Random z-index to make some bubbles appear in front of others
        const zIndex = Math.floor(Math.random() * 10) + 1;
        bubble.style.zIndex = zIndex;
        
        // Try to find a position without overlap (max 10 attempts)
        let x, y;
        let overlap = true;
        let attempts = 0;
        const maxAttempts = 10;
        const existingBubbles = gameAreaDiv.querySelectorAll('.bubble');
        
        while (overlap && attempts < maxAttempts) {
            x = Math.max(0, Math.floor(Math.random() * maxX));
            y = Math.max(0, Math.floor(Math.random() * maxY));
            
            overlap = false;
            // Check for overlap with existing bubbles
            existingBubbles.forEach(existingBubble => {
                const existingRect = existingBubble.getBoundingClientRect();
                const existingX = parseInt(existingBubble.style.left);
                const existingY = parseInt(existingBubble.style.top);
                
                // Determine if bubbles are too close (within 40px)
                const minDistance = 40;
                const distance = Math.sqrt(
                    Math.pow(x - existingX, 2) + 
                    Math.pow(y - existingY, 2)
                );
                
                if (distance < minDistance) {
                    overlap = true;
                }
            });
            
            attempts++;
        }
        
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        
        // Randomize animation delay and duration
        bubble.style.animationDelay = `${Math.random() * 2}s`;
        bubble.style.animationDuration = `${3 + Math.random() * 4}s`;
        
        // Randomize bubble color
        const colorIndex = Math.floor(Math.random() * bubbleColors.length);
        bubble.style.background = `radial-gradient(circle at 20px 20px, ${lightenColor(bubbleColors[colorIndex], 30)}, ${bubbleColors[colorIndex]})`;
        
        // Add click event
        bubble.addEventListener('click', checkBubble);
        
        gameAreaDiv.appendChild(bubble);
    }    // Check if the clicked bubble is the next one in sequence
    function checkBubble(event) {
        const clickedNumber = parseInt(event.target.dataset.number);
        
        switch(currentMode) {
            case 'ascending':
            case 'descending':
                // Check if this is the next number in sequence
                if (clickedNumber === bubbles[nextBubbleIndex]) {
                    // Correct bubble
                    event.target.classList.add('correct');
                    
                    // Quick removal after brief animation
                    setTimeout(() => {
                        event.target.style.visibility = 'hidden';
                    }, 150);
                    
                    nextBubbleIndex++;
                    score += 10;
                    updateScore();
                    
                    // Check if all bubbles are popped
                    if (nextBubbleIndex >= bubbles.length) {
                        levelComplete();
                    }
                } else {
                    // Wrong bubble
                    event.target.classList.add('wrong');
                    setTimeout(() => {
                        event.target.classList.remove('wrong');
                    }, 500);
                    
                    // Penalty
                    score = Math.max(0, score - 5);
                    updateScore();
                }
                break;
                  case 'even':
                // Check if the number is even
                if (clickedNumber % 2 === 0) {
                    // Correct bubble
                    event.target.classList.add('correct');
                    
                    // Quick removal after brief animation
                    setTimeout(() => {
                        event.target.style.visibility = 'hidden';
                    }, 150);
                    
                    nextBubbleIndex++;
                    score += 10;
                    updateScore();
                    
                    // Remove from bubbles array
                    const index = bubbles.indexOf(clickedNumber);
                    if (index > -1) {
                        bubbles.splice(index, 1);
                    }
                    
                    // Check if all bubbles are popped
                    if (bubbles.length === 0) {
                        levelComplete();
                    }
                } else {
                    // Wrong bubble
                    event.target.classList.add('wrong');
                    setTimeout(() => {
                        event.target.classList.remove('wrong');
                    }, 500);
                    
                    // Penalty
                    score = Math.max(0, score - 5);
                    updateScore();
                }
                break;
                  case 'odd':
                // Check if the number is odd
                if (clickedNumber % 2 !== 0) {
                    // Correct bubble
                    event.target.classList.add('correct');
                    
                    // Quick removal after brief animation
                    setTimeout(() => {
                        event.target.style.visibility = 'hidden';
                    }, 150);
                    
                    nextBubbleIndex++;
                    score += 10;
                    updateScore();
                    
                    // Remove from bubbles array
                    const index = bubbles.indexOf(clickedNumber);
                    if (index > -1) {
                        bubbles.splice(index, 1);
                    }
                    
                    // Check if all bubbles are popped
                    if (bubbles.length === 0) {
                        levelComplete();
                    }
                } else {
                    // Wrong bubble
                    event.target.classList.add('wrong');
                    setTimeout(() => {
                        event.target.classList.remove('wrong');
                    }, 500);
                    
                    // Penalty
                    score = Math.max(0, score - 5);
                    updateScore();
                }
                break;
        }
    }

    // Handle level completion
    function levelComplete() {
        clearInterval(timerInterval);
        
        level++;
        updateScore();
        
        resultMessage.textContent = `Great job! You completed level ${level-1} and earned ${score} points.`;
        resultDiv.classList.remove('hidden');
    }

    // Start the timer
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimer();
            
            if (timeLeft <= 10) {
                timerDisplay.classList.add('warning');
            }
            
            if (timeLeft <= 0) {
                gameOver();
            }
        }, 1000);
    }

    // Game over
    function gameOver() {
        clearInterval(timerInterval);
        
        const resultHeading = document.querySelector('#result h2');
        resultHeading.textContent = 'Time\'s Up!';
        resultHeading.classList.add('incorrect');
        
        resultMessage.textContent = `You ran out of time! Final score: ${score} points.`;
        resultDiv.classList.remove('hidden');
    }

    // Update score display
    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }

    // Update timer display
    function updateTimer() {
        timerDisplay.textContent = timeLeft;
    }

    // Continue to next level
    function nextLevel() {
        timeLeft = Math.max(30, 60 - (level * 5)); // Reduce time for higher levels
        nextBubbleIndex = 0;
        updateTimer();
        
        resultDiv.classList.add('hidden');
        
        generateBubbles();
        startTimer();
    }

    // Utility: Lighten a color by percent
    function lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return `#${(1 << 24 | (R < 255 ? R : 255) << 16 | (G < 255 ? G : 255) << 8 | (B < 255 ? B : 255)).toString(16).slice(1)}`;
    }

    // Utility: Shuffle array
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Event listeners
    startBtn.addEventListener('click', startGame);
    nextBtn.addEventListener('click', nextLevel);
});
