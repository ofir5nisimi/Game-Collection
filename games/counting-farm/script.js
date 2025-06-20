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

    // Game state
    let score = 0;
    let level = 1;
    let currentMode = '';
    let currentQuestion = {};
    let correctAnswer = null;
    
    // Animal images and sounds
    const animals = {
        cow: { image: 'cow.png', sound: 'moo.mp3', plural: 'cows' },
        sheep: { image: 'sheep.png', sound: 'baa.mp3', plural: 'sheep' },
        pig: { image: 'pig.png', sound: 'oink.mp3', plural: 'pigs' },
        chicken: { image: 'chicken.png', sound: 'cluck.mp3', plural: 'chickens' },
        duck: { image: 'duck.png', sound: 'quack.mp3', plural: 'ducks' },
        horse: { image: 'horse.png', sound: 'neigh.mp3', plural: 'horses' }
    };
    
    // Create clouds for background effect
    function createClouds() {
        const body = document.body;
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            cloud.style.width = Math.random() * 100 + 50 + 'px';
            cloud.style.height = Math.random() * 60 + 30 + 'px';
            cloud.style.top = Math.random() * 40 + '%';
            cloud.style.left = Math.random() * 100 + '%';
            cloud.style.animationDuration = Math.random() * 30 + 20 + 's';
            body.appendChild(cloud);
        }
    }
      // Start the game
    function startGame() {
        currentMode = gameModeSelect.value;
        score = 0;
        level = 1;
        updateScore();
        
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
        
        switch(currentMode) {
            case 'counting':
                generateCountingQuestion();
                break;
            case 'comparing':
                generateComparingQuestion();
                break;
            case 'grouping':
                generateGroupingQuestion();
                break;
            case 'sharing':
                generateSharingQuestion();
                break;
        }
    }
    
    // Generate a counting question
    function generateCountingQuestion() {        const animalTypes = Object.keys(animals);
        const animalType = animalTypes[Math.floor(Math.random() * animalTypes.length)];
        const animal = animals[animalType];
        
        // Determine count based on level (higher levels have more animals)
        // More gradual scaling with level
        const maxCount = Math.min(8 + Math.floor(level / 2), 20); // More gradual scaling up to max 20
        const minCount = Math.max(1, Math.floor(level / 3)); // Slower growth of minimum value
        const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
        correctAnswer = count;
        
        // Create question text
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.textContent = `How many ${animal.plural} are in the farm?`;
        gameAreaDiv.appendChild(questionDiv);
        
        // Create animal container
        const animalContainer = document.createElement('div');
        animalContainer.classList.add('animal-container');
        
        // Add animals
        for (let i = 0; i < count; i++) {
            const animalElement = document.createElement('div');
            animalElement.classList.add('animal');
            animalElement.style.backgroundImage = `url('${animalType}.png')`;
            // Fallback if images are not available
            animalElement.textContent = animalType === 'sheep' ? '🐑' : 
                                       animalType === 'cow' ? '🐄' : 
                                       animalType === 'pig' ? '🐖' : 
                                       animalType === 'chicken' ? '🐔' : 
                                       animalType === 'duck' ? '🦆' : '🐎';
            animalElement.style.textAlign = 'center';
            animalElement.style.fontSize = '40px';
            animalElement.style.display = 'flex';
            animalElement.style.justifyContent = 'center';
            animalElement.style.alignItems = 'center';
            
            // Randomize position slightly for a more natural look
            animalElement.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            animalContainer.appendChild(animalElement);
        }
        
        gameAreaDiv.appendChild(animalContainer);
        
        // Generate answer options
        createAnswerOptions(count, 10);
    }
    
    // Generate a comparing question (which group has more/less)
    function generateComparingQuestion() {
        const animalTypes = Object.keys(animals);
        const animalType1 = animalTypes[Math.floor(Math.random() * animalTypes.length)];        // Make sure we get a different animal for the second group
        let animalType2;
        do {
            animalType2 = animalTypes[Math.floor(Math.random() * animalTypes.length)];
        } while (animalType2 === animalType1);
        
        // Determine counts based on level with more gradual scaling
        const maxCount = Math.min(6 + Math.floor(level / 2), 15); // More gradual scaling up to max 15
        const minCount = Math.max(1, Math.floor(level / 4));
        const count1 = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
        const count2 = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
        
        // Randomly decide if we're asking about more or less
        const isMoreQuestion = Math.random() > 0.5;
        correctAnswer = isMoreQuestion ? 
            (count1 > count2 ? animalType1 : count2 > count1 ? animalType2 : 'same') : 
            (count1 < count2 ? animalType1 : count2 < count1 ? animalType2 : 'same');
        
        // Create question text
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.textContent = `Which animal has ${isMoreQuestion ? 'more' : 'fewer'} in the farm?`;
        if (count1 === count2) {
            correctAnswer = 'same';
        }
        gameAreaDiv.appendChild(questionDiv);
        
        // Create containers for both animal groups
        const groupsContainer = document.createElement('div');
        groupsContainer.style.display = 'flex';
        groupsContainer.style.justifyContent = 'space-around';
        groupsContainer.style.width = '100%';
        groupsContainer.style.marginTop = '20px';
        
        // Group 1
        const group1 = document.createElement('div');
        group1.classList.add('animal-group');
        const group1Title = document.createElement('h3');
        group1Title.textContent = animals[animalType1].plural;
        group1Title.style.textAlign = 'center';
        group1Title.style.marginBottom = '10px';
        group1.appendChild(group1Title);
        
        const animalContainer1 = document.createElement('div');
        animalContainer1.classList.add('animal-container');
        
        for (let i = 0; i < count1; i++) {
            const animalElement = document.createElement('div');
            animalElement.classList.add('animal');
            animalElement.style.backgroundImage = `url('${animalType1}.png')`;
            animalElement.textContent = animalType1 === 'sheep' ? '🐑' : 
                                       animalType1 === 'cow' ? '🐄' : 
                                       animalType1 === 'pig' ? '🐖' : 
                                       animalType1 === 'chicken' ? '🐔' : 
                                       animalType1 === 'duck' ? '🦆' : '🐎';
            animalElement.style.textAlign = 'center';
            animalElement.style.fontSize = '40px';
            animalElement.style.display = 'flex';
            animalElement.style.justifyContent = 'center';
            animalElement.style.alignItems = 'center';
            animalContainer1.appendChild(animalElement);
        }
        
        group1.appendChild(animalContainer1);
        groupsContainer.appendChild(group1);
        
        // Group 2
        const group2 = document.createElement('div');
        group2.classList.add('animal-group');
        const group2Title = document.createElement('h3');
        group2Title.textContent = animals[animalType2].plural;
        group2Title.style.textAlign = 'center';
        group2Title.style.marginBottom = '10px';
        group2.appendChild(group2Title);
        
        const animalContainer2 = document.createElement('div');
        animalContainer2.classList.add('animal-container');
        
        for (let i = 0; i < count2; i++) {
            const animalElement = document.createElement('div');
            animalElement.classList.add('animal');
            animalElement.style.backgroundImage = `url('${animalType2}.png')`;
            animalElement.textContent = animalType2 === 'sheep' ? '🐑' : 
                                       animalType2 === 'cow' ? '🐄' : 
                                       animalType2 === 'pig' ? '🐖' : 
                                       animalType2 === 'chicken' ? '🐔' : 
                                       animalType2 === 'duck' ? '🦆' : '🐎';
            animalElement.style.textAlign = 'center';
            animalElement.style.fontSize = '40px';
            animalElement.style.display = 'flex';
            animalElement.style.justifyContent = 'center';
            animalElement.style.alignItems = 'center';
            animalContainer2.appendChild(animalElement);
        }
        
        group2.appendChild(animalContainer2);
        groupsContainer.appendChild(group2);
        
        gameAreaDiv.appendChild(groupsContainer);
        
        // Create answer options
        const answerContainer = document.createElement('div');
        answerContainer.classList.add('answer-options');
        
        const option1 = document.createElement('button');
        option1.classList.add('answer-btn');
        option1.textContent = animals[animalType1].plural;
        option1.dataset.answer = animalType1;
        option1.addEventListener('click', checkAnswer);
        
        const option2 = document.createElement('button');
        option2.classList.add('answer-btn');
        option2.textContent = animals[animalType2].plural;
        option2.dataset.answer = animalType2;
        option2.addEventListener('click', checkAnswer);
        
        const optionSame = document.createElement('button');
        optionSame.classList.add('answer-btn');
        optionSame.textContent = 'Same';
        optionSame.dataset.answer = 'same';
        optionSame.addEventListener('click', checkAnswer);
        
        answerContainer.appendChild(option1);
        answerContainer.appendChild(option2);
        answerContainer.appendChild(optionSame);
        
        gameAreaDiv.appendChild(answerContainer);
    }
    
    // Generate a grouping question (odd/even)
    function generateGroupingQuestion() {
        const animalTypes = Object.keys(animals);
        const animalType = animalTypes[Math.floor(Math.random() * animalTypes.length)];        // Determine count based on level with more gradual scaling
        let count;
        const isEvenQuestion = Math.random() > 0.5;
        const maxNumber = Math.min(6 + Math.floor(level / 2), 18); // More gradual scaling up to max 18
        
        if (isEvenQuestion) {
            // Generate even number
            const evenOptions = [];
            for (let i = 2; i <= maxNumber; i += 2) {
                evenOptions.push(i);
            }
            count = evenOptions[Math.floor(Math.random() * evenOptions.length)];
            correctAnswer = 'even';
        } else {
            // Generate odd number
            const oddOptions = [];
            for (let i = 1; i <= maxNumber; i += 2) {
                oddOptions.push(i);
            }
            count = oddOptions[Math.floor(Math.random() * oddOptions.length)];
            correctAnswer = 'odd';
        }
        
        // Create question text
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.textContent = `Is the number of ${animals[animalType].plural} odd or even?`;
        gameAreaDiv.appendChild(questionDiv);
        
        // Create animal container
        const animalContainer = document.createElement('div');
        animalContainer.classList.add('animal-container');
        
        // Add animals
        for (let i = 0; i < count; i++) {
            const animalElement = document.createElement('div');
            animalElement.classList.add('animal');
            animalElement.style.backgroundImage = `url('${animalType}.png')`;
            animalElement.textContent = animalType === 'sheep' ? '🐑' : 
                                       animalType === 'cow' ? '🐄' : 
                                       animalType === 'pig' ? '🐖' : 
                                       animalType === 'chicken' ? '🐔' : 
                                       animalType === 'duck' ? '🦆' : '🐎';
            animalElement.style.textAlign = 'center';
            animalElement.style.fontSize = '40px';
            animalElement.style.display = 'flex';
            animalElement.style.justifyContent = 'center';
            animalElement.style.alignItems = 'center';
            animalContainer.appendChild(animalElement);
        }
        
        gameAreaDiv.appendChild(animalContainer);
        
        // Create answer options
        const answerContainer = document.createElement('div');
        answerContainer.classList.add('answer-options');
        
        const oddOption = document.createElement('button');
        oddOption.classList.add('answer-btn');
        oddOption.textContent = 'Odd';
        oddOption.dataset.answer = 'odd';
        oddOption.addEventListener('click', checkAnswer);
        
        const evenOption = document.createElement('button');
        evenOption.classList.add('answer-btn');
        evenOption.textContent = 'Even';
        evenOption.dataset.answer = 'even';
        evenOption.addEventListener('click', checkAnswer);
        
        answerContainer.appendChild(oddOption);
        answerContainer.appendChild(evenOption);
        
        gameAreaDiv.appendChild(answerContainer);
    }
    
    // Generate a sharing question (division)
    function generateSharingQuestion() {
        const animalTypes = Object.keys(animals);
        const animalType = animalTypes[Math.floor(Math.random() * animalTypes.length)];        // Determine total and groups based on level with more gradual scaling
        // Higher level = more challenging division problems, but at a slower pace
        const maxGroups = Math.min(2 + Math.floor(level / 3), 6); // Up to 6 groups at high levels
        const groups = Math.max(2, Math.floor(Math.random() * maxGroups) + 1);
        
        const maxItemsPerGroup = Math.min(1 + Math.floor(level / 3), 5); // Up to 5 items per group
        const itemsPerGroup = Math.max(1, Math.floor(Math.random() * maxItemsPerGroup) + 1);
        
        const totalItems = groups * itemsPerGroup;
        
        correctAnswer = itemsPerGroup;
        
        // Create question text
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.textContent = `If we share ${totalItems} ${animals[animalType].plural} equally among ${groups} pens, how many ${animals[animalType].plural} will be in each pen?`;
        gameAreaDiv.appendChild(questionDiv);
        
        // Create animal container
        const animalContainer = document.createElement('div');
        animalContainer.classList.add('animal-container');
        
        // Add animals
        for (let i = 0; i < totalItems; i++) {
            const animalElement = document.createElement('div');
            animalElement.classList.add('animal');
            animalElement.style.backgroundImage = `url('${animalType}.png')`;
            animalElement.textContent = animalType === 'sheep' ? '🐑' : 
                                       animalType === 'cow' ? '🐄' : 
                                       animalType === 'pig' ? '🐖' : 
                                       animalType === 'chicken' ? '🐔' : 
                                       animalType === 'duck' ? '🦆' : '🐎';
            animalElement.style.textAlign = 'center';
            animalElement.style.fontSize = '40px';
            animalElement.style.display = 'flex';
            animalElement.style.justifyContent = 'center';
            animalElement.style.alignItems = 'center';
            animalContainer.appendChild(animalElement);
        }
        
        gameAreaDiv.appendChild(animalContainer);
        
        // Show pens
        const pensContainer = document.createElement('div');
        pensContainer.classList.add('pens-container');
        pensContainer.style.display = 'flex';
        pensContainer.style.justifyContent = 'center';
        pensContainer.style.gap = '15px';
        pensContainer.style.marginTop = '20px';
        
        for (let i = 0; i < groups; i++) {
            const pen = document.createElement('div');
            pen.classList.add('pen');
            pen.style.width = '60px';
            pen.style.height = '60px';
            pen.style.border = '3px solid #8B4513';
            pen.style.borderRadius = '5px';
            pen.style.backgroundColor = 'rgba(139, 69, 19, 0.1)';
            pen.style.display = 'flex';
            pen.style.justifyContent = 'center';
            pen.style.alignItems = 'center';
            pen.textContent = '?';
            pen.style.fontSize = '24px';
            pen.style.color = '#8B4513';
            pensContainer.appendChild(pen);
        }
        
        gameAreaDiv.appendChild(pensContainer);
        
        // Create answer options (based on the correct answer plus some reasonable alternatives)
        createAnswerOptions(itemsPerGroup, 6);
    }    // Create numerical answer options
    function createAnswerOptions(correctAnswer, maxValue) {
        const answerContainer = document.createElement('div');
        answerContainer.classList.add('answer-options');
        
        // Use a more reasonable maxValue based on level
        const adjustedMaxValue = Math.max(maxValue, correctAnswer + 4);
        
        // Create an array of possible answers
        let answers = [correctAnswer];
        
        // Add 3 more unique options that are reasonable distractors
        while (answers.length < 4) {
            // For larger numbers, create answers that are closer to the correct answer
            // but with a more reasonable range
            let range = Math.min(3, Math.ceil(correctAnswer / 4));
            let min = Math.max(1, correctAnswer - range);
            let max = Math.min(adjustedMaxValue, correctAnswer + range);
            
            // For smaller numbers, ensure we have a good spread
            if (correctAnswer <= 5) {
                min = 1;
                max = Math.min(10, adjustedMaxValue);
            }
            
            const randomAnswer = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!answers.includes(randomAnswer) && randomAnswer > 0) {
                answers.push(randomAnswer);
            }
        }
        
        // Shuffle the answers
        answers = shuffleArray(answers);
        
        // Create buttons for each answer
        answers.forEach(answer => {
            const option = document.createElement('button');
            option.classList.add('answer-btn');
            option.textContent = answer;
            option.dataset.answer = answer;
            option.addEventListener('click', checkAnswer);
            answerContainer.appendChild(option);
        });
        
        gameAreaDiv.appendChild(answerContainer);
    }    // Check if the answer is correct
    function checkAnswer(event) {
        const selectedAnswer = event.target.dataset.answer;
        const isCorrect = selectedAnswer == correctAnswer; // Using == to handle string/number comparisons
        
        // Update the result heading based on correctness
        const resultHeading = document.querySelector('#result h2');
        
        if (isCorrect) {
            resultHeading.textContent = 'Great job!';
            resultHeading.classList.remove('incorrect');
            score += 10 * level;
            resultMessage.textContent = `You got it right! You earned ${10 * level} points.`;
            
            // Increase level after every 3 correct answers
            if (score >= level * 30) {
                level++;
                resultMessage.textContent += ` You've advanced to level ${level}!`;
            }
        } else {
            resultHeading.textContent = 'Oops!';
            resultHeading.classList.add('incorrect');
            resultMessage.textContent = `Not quite right. The correct answer was ${correctAnswer}.`;
        }
        
        updateScore();
        gameAreaDiv.classList.add('hidden');
        resultDiv.classList.remove('hidden');
    }
    
    // Update the score and level display
    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }
    
    // Go to the next question
    function nextQuestion() {
        resultDiv.classList.add('hidden');
        gameAreaDiv.classList.remove('hidden');
        generateQuestion();
    }
    
    // Utility function to shuffle an array
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
    nextBtn.addEventListener('click', nextQuestion);
    
    // Initialize the background
    createClouds();
});
