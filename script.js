let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

const boardDiv = document.getElementById("board");
const status = document.getElementById("status");

function createBoard() {
    boardDiv.innerHTML = "";

    board.forEach((cell, i) => {
        const div = document.createElement("div");
        div.classList.add("cell");

        if (cell === "X") div.classList.add("x");
        if (cell === "O") div.classList.add("o");

        div.innerText = cell;
        div.onclick = () => playerMove(i);

        boardDiv.appendChild(div);
    });
}

function playerMove(i) {
    if (board[i] === "" && !gameOver) {
        board[i] = "X";
        animateCell(i);
        updateGame();

        if (!gameOver) {
            setTimeout(aiMove, 400);
        }
    }
}

function aiMove() {
    let bestMove = minimax(board, "O").index;
    board[bestMove] = "O";
    animateCell(bestMove);
    updateGame();
}

function animateCell(i) {
    setTimeout(() => {
        const cells = document.querySelectorAll(".cell");
        cells[i].classList.add("animate");
    }, 10);
}

function updateGame() {
    createBoard();
    let winner = checkWinner();

    if (winner) {
        gameOver = true;
        status.innerText = winner === "draw" ? "Draw!" : winner + " Wins!";
    }
}

function checkWinner() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (let [a,b,c] of wins) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (!board.includes("")) return "draw";
    return null;
}

/* MINIMAX */
function minimax(newBoard, player) {
    let empty = newBoard.map((v,i) => v === "" ? i : null).filter(v => v !== null);

    let winner = checkWinner();
    if (winner === "X") return {score: -10};
    if (winner === "O") return {score: 10};
    if (empty.length === 0) return {score: 0};

    let moves = [];

    for (let i of empty) {
        let move = {};
        move.index = i;
        newBoard[i] = player;

        let result = minimax(newBoard, player === "O" ? "X" : "O");
        move.score = result.score;

        newBoard[i] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        moves.forEach((m,i) => {
            if (m.score > bestScore) {
                bestScore = m.score;
                bestMove = i;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach((m,i) => {
            if (m.score < bestScore) {
                bestScore = m.score;
                bestMove = i;
            }
        });
    }

    return moves[bestMove];
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    status.innerText = "Your Turn (X)";
    createBoard();
}

createBoard();