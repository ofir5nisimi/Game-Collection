document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const startBtn = document.getElementById('start-btn');
    const difficultySelect = document.getElementById('difficulty-select');
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');

    // Game state variables
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let totalPairs = 0;
    let moves = 0;
    let gameStarted = false;
    let gameTimer;
    let seconds = 0;
    let canFlip = true;

    // Card symbols/emojis (doubled for pairs)
    const symbols = [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🦁', '🐯', '🐨', '🐮', '🐷', '🐸', '🐵', '🦄',
        '🦉', '🦇', '🐺', '🐗', '🐴', '🦋', '🐙', '🦂'
    ];

    // Game setup based on difficulty
    const difficultySettings = {
        easy: { rows: 3, cols: 4 },
        medium: { rows: 4, cols: 4 },
        hard: { rows: 4, cols: 6 }
    };

    // Initialize the game
    function initGame() {
        resetGame();
        const difficulty = difficultySelect.value;
        const { rows, cols } = difficultySettings[difficulty];
        totalPairs = (rows * cols) / 2;
        
        gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        // Create card pairs
        const selectedSymbols = symbols.slice(0, totalPairs);
        cards = [...selectedSymbols, ...selectedSymbols];
        
        // Shuffle the cards
        shuffleArray(cards);
        
        // Create card elements
        gameBoard.innerHTML = '';
        cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            card.dataset.symbol = symbol;
            
            // Create card front (hidden side)
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.innerHTML = '?';
            
            // Create card back (symbol side)
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            cardBack.innerHTML = symbol;
            
            // Add faces to card
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            // Add click event
            card.addEventListener('click', flipCard);
            
            // Add to game board
            gameBoard.appendChild(card);
        });
    }

    // Flip a card when clicked
    function flipCard() {
        if (!gameStarted) {
            startGame();
        }
        
        if (!canFlip) return;
        
        const selectedCard = this;
        const cardIndex = parseInt(selectedCard.dataset.index);
        
        // Prevent flipping already matched or currently flipped cards
        if (selectedCard.classList.contains('matched') || selectedCard.classList.contains('flipped')) {
            return;
        }
        
        // Flip the card
        selectedCard.classList.add('flipped');
        flippedCards.push(selectedCard);
        
        // Check for match if two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            movesElement.textContent = `${moves} Moves`;
            canFlip = false;
            
            const firstCard = flippedCards[0];
            const secondCard = flippedCards[1];
            
            if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
                // Match found
                setTimeout(() => {
                    firstCard.classList.add('matched');
                    secondCard.classList.add('matched');
                    flippedCards = [];
                    matchedPairs++;
                    canFlip = true;
                    
                    // Check if game is complete
                    if (matchedPairs === totalPairs) {
                        endGame();
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }

    // Start a new game
    function startGame() {
        gameStarted = true;
        seconds = 0;
        updateTimer();
        gameTimer = setInterval(updateTimer, 1000);
    }

    // End the game
    function endGame() {
        clearInterval(gameTimer);
        setTimeout(() => {
            alert(`Congratulations! You completed the game in ${seconds} seconds with ${moves} moves.`);
        }, 500);
    }

    // Reset the game state
    function resetGame() {
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        seconds = 0;
        gameStarted = false;
        canFlip = true;
        
        clearInterval(gameTimer);
        movesElement.textContent = '0 Moves';
        timerElement.textContent = 'Time: 0s';
    }

    // Update the timer display
    function updateTimer() {
        seconds++;
        timerElement.textContent = `Time: ${seconds}s`;
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
    startBtn.addEventListener('click', initGame);
    difficultySelect.addEventListener('change', initGame);

    // Initialize game on load
    initGame();
});
