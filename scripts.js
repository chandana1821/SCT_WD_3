const board = document.getElementById('board');
const status = document.getElementById('status');
const resetButton = document.getElementById('reset');
const gameModeSelect = document.getElementById('game-mode');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = 'twoPlayer';

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
}

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.classList.add(currentPlayer.toLowerCase());
        if (checkWin()) {
            status.textContent = `Player ${currentPlayer} wins!`;
            status.classList.add('pulse');
            gameActive = false;
        } else if (gameBoard.every(cell => cell !== '')) {
            status.textContent = "It's a draw!";
            status.classList.add('pulse');
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();
            if (gameMode === 'vsComputer' && currentPlayer === 'O') {
                setTimeout(computerMove, 500);
            }
        }
    }
}

function computerMove() {
    const emptyCells = gameBoard.reduce((acc, cell, index) => 
        cell === '' ? [...acc, index] : acc, []);
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const cell = document.querySelector(`[data-index="${randomIndex}"]`);
        cell.click();
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameBoard[index] === currentPlayer;
        });
    });
}

function updateStatus() {
    status.textContent = `Current player: ${currentPlayer}`;
    status.style.color = currentPlayer === 'X' ? '#FFA500' : '#4169E1';
    status.classList.remove('pulse');
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    status.classList.remove('pulse');
    updateStatus();
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

function changeGameMode() {
    gameMode = gameModeSelect.value;
    resetGame();
}

resetButton.addEventListener('click', resetGame);
gameModeSelect.addEventListener('change', changeGameMode);

createBoard();
updateStatus();