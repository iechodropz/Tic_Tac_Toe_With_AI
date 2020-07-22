const PLAYER_TURN = "x";
const COMPUTER_TURN = "circle";

let WHOSE_TURN;

const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winDrawMessageElement = document.querySelector("[win-draw-message]");
const winDrawScreenElement = document.getElementById("winDrawScreen");
const restartButtonElement = document.querySelector("[restart-button]");

restartButtonElement.addEventListener("click", startGame);

const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

const BOARD_COPY = ["", "", "", "", "", "", "", "", ""];

startGame();

function startGame() {
	winDrawScreenElement.classList.remove("show");

	WHOSE_TURN = PLAYER_TURN;

	cellElements.forEach((cell) => {
		cell.classList.remove(PLAYER_TURN);
		cell.classList.remove(COMPUTER_TURN);
		cell.addEventListener("click", handleClick, { once: true });

		let i = [[...cellElements].indexOf(cell)];
		BOARD_COPY[i] = "";
	});

	setBoardHoverEffects();
}

function handleClick(cellClicked) {
	if (WHOSE_TURN === PLAYER_TURN) {
		placeMark(cellClicked.target);

		if (checkIfWin(false) === true) {
			endGame(false);

			winDrawScreenElement.classList.add("show");
		} else if (checkIfDraw(false) === true) {
			endGame(true);

			winDrawScreenElement.classList.add("show");
		} else {
			switchTurns();

			computerMove();
		}
	}
}

function placeMark(cell) {
	cell.classList.add(WHOSE_TURN);

	BOARD_COPY[[...cellElements].indexOf(cell)] = WHOSE_TURN;
}

function switchTurns() {
	if (WHOSE_TURN === PLAYER_TURN) {
		WHOSE_TURN = COMPUTER_TURN;
	} else {
		WHOSE_TURN = PLAYER_TURN;
	}
}

function computerMove() {
	let bestScore = Infinity;
	let bestMove;
	let score;

	for (let i = 0; i < 9; i++) {
		if (BOARD_COPY[i] === "") {
			BOARD_COPY[i] = COMPUTER_TURN;

			score = minimax(0, true);

			BOARD_COPY[i] = "";

			if (score < bestScore) {
				bestScore = score;
				bestMove = i;
			}
		}
	}

	WHOSE_TURN = COMPUTER_TURN;

	let cell = cellElements[bestMove];

	placeMark(cell);

	if (checkIfWin(false) === true) {
		endGame(false);

		winDrawScreenElement.classList.add("show");
	} else if (checkIfDraw(false) === true) {
		endGame(true);

		winDrawScreenElement.classList.add("show");
	} else {
		switchTurns();

		setBoardHoverEffects();
	}
}

function minimax(depth, isMaximizingPlayer) {
	let win = checkIfWin(true);

	if (win && WHOSE_TURN === PLAYER_TURN) {
		return endGame(false) - depth;
	} else if (win === true && WHOSE_TURN === COMPUTER_TURN) {
		return endGame(false) + depth;
	} else if (checkIfDraw(true) === true) {
		return endGame(true);
	}

	switchTurns();

	if (isMaximizingPlayer) {
		let maxScore = -Infinity;
		let score;

		for (let i = 0; i < 9; i++) {
			if (BOARD_COPY[i] === "") {
				BOARD_COPY[i] = PLAYER_TURN;

				score = minimax(depth + 1, false);

				BOARD_COPY[i] = "";

				maxScore = Math.max(score, maxScore);
			}
		}

		return maxScore;
	} else {
		let minScore = Infinity;
		let score;

		for (let i = 0; i < 9; i++) {
			if (BOARD_COPY[i] === "") {
				BOARD_COPY[i] = COMPUTER_TURN;

				score = minimax(depth + 1, true);

				BOARD_COPY[i] = "";

				minScore = Math.min(score, minScore);
			}
		}

		return minScore;
	}
}

function endGame(draw) {
	if (draw) {
		winDrawMessageElement.innerText = "Draw!";
		winDrawMessageElement.style.color = "white";

		return 0;
	} else {
		if (WHOSE_TURN === PLAYER_TURN) {
			winDrawMessageElement.innerText = "X's Win!";
			winDrawMessageElement.style.color = "blue";

			return 10;
		} else {
			winDrawMessageElement.innerText = "O's Win!";
			winDrawMessageElement.style.color = "red";

			return -10;
		}
	}
}

function setBoardHoverEffects() {
	board.classList.remove(PLAYER_TURN);
	board.classList.remove(COMPUTER_TURN);

	board.classList.add(WHOSE_TURN);
}

function checkIfWin(boardCopy) {
	if (boardCopy) {
		if (WHOSE_TURN === PLAYER_TURN) {
			for (let i = 0; i < 8; i++) {
				if (BOARD_COPY[WINNING_COMBINATIONS[i][0]] === "x" && BOARD_COPY[WINNING_COMBINATIONS[i][1]] === "x" && BOARD_COPY[WINNING_COMBINATIONS[i][2]] === "x") {
					return true;
				}
			}
		} else if (WHOSE_TURN === COMPUTER_TURN) {
			for (let i = 0; i < 8; i++) {
				if (BOARD_COPY[WINNING_COMBINATIONS[i][0]] === "circle" && BOARD_COPY[WINNING_COMBINATIONS[i][1]] === "circle" && BOARD_COPY[WINNING_COMBINATIONS[i][2]] === "circle") {
					return true;
				}
			}
		}

		return false;
	} else {
		return WINNING_COMBINATIONS.some((combination) => {
			return combination.every((index) => {
				return cellElements[index].classList.contains(WHOSE_TURN);
			});
		});
	}
}

function checkIfDraw(boardCopy) {
	if (boardCopy) {
		for (i = 0; i < 9; i++) {
			if (BOARD_COPY[i] === "") {
				return false;
			}
		}

		return true;
	} else {
		return [...cellElements].every((cell) => {
			return cell.classList.contains(PLAYER_TURN) || cell.classList.contains(COMPUTER_TURN);
		});
	}
}
