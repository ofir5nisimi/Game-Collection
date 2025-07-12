document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const startBtn = document.getElementById('start-btn');
    const difficultySelect = document.getElementById('difficulty-select');
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    const gameModeSelect = document.getElementById('game-mode');
    const playersInfo = document.getElementById('players-info');
    const singleStats = document.getElementById('single-stats');
    const playerNamesSetup = document.getElementById('player-names-setup');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const player1Card = document.querySelector('.player1');
    const player2Card = document.querySelector('.player2');
    const turnText = document.querySelector('.turn-text');
    const turnArrow = document.querySelector('.turn-arrow');
    const player1Score = document.querySelector('.player1 .player-score');
    const player2Score = document.querySelector('.player2 .player-score');
    const player1NameDisplay = document.querySelector('.player1 .player-name');
    const player2NameDisplay = document.querySelector('.player2 .player-name');

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
    
    // Multiplayer state variables
    let isMultiplayer = false;
    let currentPlayer = 1;
    let playerScores = { player1: 0, player2: 0 };
    let playerNames = { player1: 'Player 1', player2: 'Player 2' };

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

    // Sound effects using Web Audio API
    function playApplauseSound() {
        try {
            // Short, pleasant success chime using Web Audio API with better synthesis
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create a pleasant success melody
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord
            
            notes.forEach((frequency, index) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                    
                    // Gentle envelope
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.05);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.4);
                }, index * 100);
            });
            
        } catch (error) {
            console.log('Audio not supported or disabled');
        }
    }

    // Get current player names
    function getPlayerNames() {
        const player1Name = player1NameInput.value.trim();
        const player2Name = player2NameInput.value.trim();
        
        playerNames.player1 = player1Name || 'Player 1';
        playerNames.player2 = player2Name || 'Player 2';
        
        return playerNames;
    }

    // Update player name displays
    function updatePlayerNameDisplays() {
        if (!isMultiplayer) return;
        
        const names = getPlayerNames();
        player1NameDisplay.textContent = names.player1;
        player2NameDisplay.textContent = names.player2;
    }

    // Handle game mode changes
    function handleGameModeChange() {
        isMultiplayer = gameModeSelect.value === 'multiplayer';
        
        if (isMultiplayer) {
            playersInfo.classList.add('hidden');
            playerNamesSetup.classList.remove('hidden');
            singleStats.classList.add('hidden');
        } else {
            playersInfo.classList.add('hidden');
            playerNamesSetup.classList.add('hidden');
            singleStats.classList.remove('hidden');
        }
        
        // Don't auto-reset game when mode changes, let user set names first
    }

    // Update player display
    function updatePlayerDisplay() {
        if (!isMultiplayer) return;
        
        const names = getPlayerNames();
        
        // Update scores
        player1Score.textContent = `${playerScores.player1} pairs`;
        player2Score.textContent = `${playerScores.player2} pairs`;
        
        // Update active player visual indicators
        if (currentPlayer === 1) {
            player1Card.classList.add('active');
            player2Card.classList.remove('active');
            turnText.textContent = `${names.player1}'s Turn`;
            turnArrow.classList.remove('flip');
            
            // Apply Player 1 color theme (red)
            turnArrow.classList.add('player1-turn');
            turnArrow.classList.remove('player2-turn');
            turnText.classList.add('player1-turn');
            turnText.classList.remove('player2-turn');
        } else {
            player1Card.classList.remove('active');
            player2Card.classList.add('active');
            turnText.textContent = `${names.player2}'s Turn`;
            turnArrow.classList.add('flip');
            
            // Apply Player 2 color theme (blue)
            turnArrow.classList.add('player2-turn');
            turnArrow.classList.remove('player1-turn');
            turnText.classList.add('player2-turn');
            turnText.classList.remove('player1-turn');
        }
    }

    // Switch to next player
    function switchPlayer() {
        if (!isMultiplayer) return;
        
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updatePlayerDisplay();
    }

    // Initialize the game
    function initGame() {
        // If multiplayer mode, ensure names are set and show player info
        if (isMultiplayer) {
            updatePlayerNameDisplays();
            playersInfo.classList.remove('hidden');
            playerNamesSetup.classList.add('hidden');
        }
        
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
        
        // Update player display for multiplayer
        if (isMultiplayer) {
            updatePlayerDisplay();
        }
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
            if (!isMultiplayer) {
                moves++;
                movesElement.textContent = `${moves} Moves`;
            }
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
                    
                    // Play success sound
                    playApplauseSound();
                    
                    // Update player score in multiplayer mode
                    if (isMultiplayer) {
                        playerScores[`player${currentPlayer}`]++;
                        updatePlayerDisplay();
                    }
                    
                    canFlip = true;
                    
                    // Check if game is complete
                    if (matchedPairs === totalPairs) {
                        endGame();
                    }
                }, 500);
            } else {
                // No match - switch players in multiplayer mode
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    flippedCards = [];
                    
                    if (isMultiplayer) {
                        switchPlayer();
                    }
                    
                    canFlip = true;
                }, 1000);
            }
        }
    }

    // Start a new game
    function startGame() {
        gameStarted = true;
        
        if (!isMultiplayer) {
            seconds = 0;
            updateTimer();
            gameTimer = setInterval(updateTimer, 1000);
        }
    }

    // End the game
    function endGame() {
        clearInterval(gameTimer);
        
        setTimeout(() => {
            if (isMultiplayer) {
                // Determine winner
                const names = getPlayerNames();
                const player1Pairs = playerScores.player1;
                const player2Pairs = playerScores.player2;
                
                let message;
                if (player1Pairs > player2Pairs) {
                    message = `🎉 ${names.player1} Wins! 🎉\n\n${names.player1}: ${player1Pairs} pairs\n${names.player2}: ${player2Pairs} pairs`;
                } else if (player2Pairs > player1Pairs) {
                    message = `🎉 ${names.player2} Wins! 🎉\n\n${names.player1}: ${player1Pairs} pairs\n${names.player2}: ${player2Pairs} pairs`;
                } else {
                    message = `🤝 It's a Tie! 🤝\n\n${names.player1}: ${player1Pairs} pairs\n${names.player2}: ${player2Pairs} pairs\n\nGreat game!`;
                }
                
                alert(message);
            } else {
                alert(`Congratulations! You completed the game in ${seconds} seconds with ${moves} moves.`);
            }
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
        
        // Reset multiplayer state
        currentPlayer = 1;
        playerScores = { player1: 0, player2: 0 };
        
        clearInterval(gameTimer);
        
        if (!isMultiplayer) {
            movesElement.textContent = '0 Moves';
            timerElement.textContent = 'Time: 0s';
        } else {
            updatePlayerDisplay();
        }
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
    difficultySelect.addEventListener('change', () => {
        if (!isMultiplayer) {
            initGame();
        }
    });
    gameModeSelect.addEventListener('change', handleGameModeChange);

    // Initialize game on load
    handleGameModeChange();
});
