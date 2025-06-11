const board = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const winButton = document.getElementById("win-button");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const xImage = "assets/images/heart.png"; // Path to X image
const oImage = "assets/images/kiss.png"; // Path to O image

function cellClicked(event) {
    const index = event.target.dataset.index;

    if (gameBoard[index] === "" && gameActive && currentPlayer === "X") {
        gameBoard[index] = "X";
        event.target.innerHTML = `<img src="${xImage}" alt="X">`; // Set X image
        
        checkWinner();

        if (gameActive) {
            currentPlayer = "O";
            //statusText.textContent = `Player O's turn`;
            setTimeout(botMove, 500);
        }
    }
}

function botMove() {
    let bestMove = findBestMove();

    if (bestMove !== null) {
        gameBoard[bestMove] = "O";
        board[bestMove].innerHTML = `<img src="${oImage}" alt="O">`; // Set O image
        
        checkWinner();

        if (gameActive) {
            currentPlayer = "X";
            //statusText.textContent = `Player X's turn`;
        }
    }
}

function findBestMove() {
    let randomMistake = Math.random() < 0.3;

    if (!randomMistake) {
        for (let condition of winConditions) {
            let move = checkTwoInRow("O", condition);
            if (move !== null) return move;
        }
    }

    if (!randomMistake) {
        for (let condition of winConditions) {
            let move = checkTwoInRow("X", condition);
            if (move !== null) return move;
        }
    }

    let availableMoves = gameBoard
        .map((v, i) => (v === "" ? i : null))
        .filter(v => v !== null);

    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    return null;
}


function checkTwoInRow(player, condition) {
    let [a, b, c] = condition;
    let values = [gameBoard[a], gameBoard[b], gameBoard[c]];

    if (values.filter(v => v === player).length === 2 && values.includes("")) {
        return condition[values.indexOf("")];
    }
    return null;
}

let heartInterval;

function checkWinner() {
    for (const condition of winConditions) {
        let [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            if (gameBoard[a] === "X") {
                statusText.textContent = "You won my heart!";
                
                clearInterval(heartInterval); // Prevent multiple intervals
                setTimeout(() => {
                    heartInterval = setInterval(createHeart, 50); // Faster heart generation
                }, 500);

                winButton.style.display = "block";
                resetButton.style.display = "none";
            } else {
                statusText.textContent = "Don't give up! Try again!";
                resetButton.style.display = "block";
                winButton.style.display = "none";
            }
            return;
        }
    }

    if (!gameBoard.includes("")) {
        gameActive = false;
        statusText.textContent = "I won't accept a tie! Try again!";
        resetButton.style.display = "block";
        winButton.style.display = "none";
    }
}


winButton.addEventListener("click", () => {
    window.location.href = "win.html";
});


function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    statusText.textContent = "Will you actually win? Let's see!";
    board.forEach(cell => cell.innerHTML = "");
    resetButton.style.display = "none";
    winButton.style.display = "none";

    clearInterval(heartInterval);
}

board.forEach(cell => cell.addEventListener("click", cellClicked));
resetButton.addEventListener("click", resetGame);


function createHeart() {
    const heart = document.createElement("img");
    heart.classList.add("heart");
    heart.src = "assets/images/simple.png";
    document.body.appendChild(heart);

    let size = Math.random() * 40 + 20;
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.width = size + "px";
    
   
    let fallDuration = Math.random() * 4 + 2;
    heart.style.animation = `fall ${fallDuration}s linear`;

    let shouldRotateImmediately = Math.random() < 0.5;

    if (shouldRotateImmediately) {
        let rotateDirection = Math.random() < 0.5 ? "rotateClockwise" : "rotateCounterClockwise";
        heart.style.animation += `, ${rotateDirection} ${fallDuration}s linear`;
    } else {
        setTimeout(() => {
            let rotateDirection = Math.random() < 0.5 ? "rotateClockwise" : "rotateCounterClockwise";
            heart.style.animation += `, ${rotateDirection} ${fallDuration - 0.5}s linear`;
        }, 500);
    }

    setTimeout(() => {
        heart.remove();
    }, fallDuration * 1000);
}



