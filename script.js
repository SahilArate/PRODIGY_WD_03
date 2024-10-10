const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.querySelector('.game-board');
const winningMessageElement = document.getElementById('winningMessage');
const winningTextElement = document.getElementById('winningText');
const restartButton = document.getElementById('restartButton');
const xScoreElement = document.getElementById('xScore');
const oScoreElement = document.getElementById('oScore');
const playerXInput = document.getElementById('playerX');
const playerOInput = document.getElementById('playerO');

let oTurn;
let xScore = 0;
let oScore = 0;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
        removeWinningLine(cell);
    });
    setBoardHoverClass();
    winningMessageElement.classList.remove('show');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        updateScore(currentClass);
        drawWinningLine(currentClass);
        setTimeout(() => {
            endGame(false);
            resetBoard();  
        }, 1000); 
    } else if (isDraw()) {
        setTimeout(() => {
            endGame(true);
            resetBoard();
        }, 1000);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw) {
    const playerX = playerXInput.value || 'X';
    const playerO = playerOInput.value || 'O';
    
    if (draw) {
        winningTextElement.innerText = `It's a Draw!`;
    } else {
        winningTextElement.innerText = `${oTurn ? playerO : playerX} Wins!`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function updateScore(currentClass) {
    if (currentClass === X_CLASS) {
        xScore++;
        xScoreElement.textContent = `X: ${xScore}`;
    } else {
        oScore++;
        oScoreElement.textContent = `O: ${oScore}`;
    }
}

function resetBoard() {
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
    });
}

function drawWinningLine(currentClass) {
    const combination = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });

    if (combination) {
        combination.forEach(index => {
            const cell = cellElements[index];
            const line = document.createElement('div');
            line.classList.add('winning-line');
            cell.appendChild(line);
        });
    }
}

function removeWinningLine(cell) {
    const line = cell.querySelector('.winning-line');
    if (line) {
        line.remove();
    }
}
