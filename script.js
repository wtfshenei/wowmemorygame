const uniqueImages = [
    'deathknight.png', 'demonhunter.png', 'druid.png', 'evoker.png', 'hunter.png', 'mage.png',
    'monk.png', 'paladin.png', 'priest.png', 'rogue.png', 'shaman.png', 'warlock.png', 'warrior.png'
];

// Duplicate each image to have pairs and shuffle the array
const images = uniqueImages.concat(uniqueImages).sort(() => 0.5 - Math.random());

const gameBoard = document.getElementById('game-board');
const moveCounter = document.getElementById('move-counter');
const recordScore = document.getElementById('record-score');
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;

// Load the best score from localStorage
let bestScore = localStorage.getItem('bestScore');
if (bestScore !== null) {
    recordScore.textContent = bestScore;
} else {
    recordScore.textContent = '0';
}

// Initialize the game board with cards
images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<img src="/assets/img/${image}" alt="Image">`;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
});

/**
 * Function to handle card flip
 */
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    moveCounter.textContent = moves.toString();
    checkForMatch();
}

/**
 * Function to check if the two flipped cards match
 */
function checkForMatch() {
    let isMatch = firstCard.innerHTML === secondCard.innerHTML;
    isMatch ? disableCards() : unflipCards();
}

/**
 * Function to disable matched cards
 */
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matches++;
    if (matches === uniqueImages.length) {
        // Check and update the best score
        if (!bestScore || moves < bestScore) {
            bestScore = moves;
            localStorage.setItem('bestScore', bestScore);
            recordScore.textContent = bestScore.toString();
        }
    }
    resetBoard();
}

/**
 * Function to unflip unmatched cards
 */
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1500);
}

/**
 * Function to reset the board for the next turn
 */
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}
