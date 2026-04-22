let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;
let nodes = 0;

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
    nodes = 0;
    let start = performance.now();

    let algo = document.getElementById("algo").value;
    let bestMove;

    if (algo === "minimax") {
        bestMove = minimax(board, "O").index;
    } else {
        bestMove = alphabeta(board, "O", -Infinity, Infinity).index;
    }

    let end = performance.now();

    board[bestMove] = "O";
    animateCell(bestMove);
    updateGame();

    document.getElementById("stats").innerText =
        `Nodes: ${nodes} | Time: ${(end - start).toFixed(2)} ms`;
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

function minimax(newBoard, player) {
    nodes++;

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

function alphabeta(newBoard, player, alpha, beta) {
    nodes++;

    let empty = newBoard.map((v,i) => v === "" ? i : null).filter(v => v !== null);
    let winner = checkWinner();

    if (winner === "X") return {score: -10};
    if (winner === "O") return {score: 10};
    if (empty.length === 0) return {score: 0};

    let bestMove;

    if (player === "O") {
        let maxEval = -Infinity;

        for (let i of empty) {
            newBoard[i] = "O";
            let eval = alphabeta(newBoard, "X", alpha, beta).score;
            newBoard[i] = "";

            if (eval > maxEval) {
                maxEval = eval;
                bestMove = i;
            }

            alpha = Math.max(alpha, eval);
            if (beta <= alpha) break;
        }

        return {score: maxEval, index: bestMove};

    } else {
        let minEval = Infinity;

        for (let i of empty) {
            newBoard[i] = "X";
            let eval = alphabeta(newBoard, "O", alpha, beta).score;
            newBoard[i] = "";

            if (eval < minEval) {
                minEval = eval;
                bestMove = i;
            }

            beta = Math.min(beta, eval);
            if (beta <= alpha) break;
        }

        return {score: minEval, index: bestMove};
    }
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    status.innerText = "Your Turn (X)";
    document.getElementById("stats").innerText = "Nodes: 0 | Time: 0 ms";
    createBoard();
}

createBoard();