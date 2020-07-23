const PLAYER_TURN = "x";
const COMPUTER_TURN = "circle";

let WHOSE_TURN;

const CELL_ELEMENTS = document.querySelectorAll("[data-cell]");
const BOARD = document.getElementById("board");
const WIN_DRAW_MESSAGE_ELEMENT = document.querySelector("[win-draw-message]");
const WIN_DRAW_SCREEN_ELEMENT = document.getElementById("winDrawScreen");
const RESTART_BUTTON_ELEMENT = document.querySelector("[restart-button]");

RESTART_BUTTON_ELEMENT.addEventListener("click", startGame);

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
	WIN_DRAW_SCREEN_ELEMENT.classList.remove("show");

	WHOSE_TURN = PLAYER_TURN;

	CELL_ELEMENTS.forEach((cell) => {
		cell.classList.remove(PLAYER_TURN);
		cell.classList.remove(COMPUTER_TURN);
		cell.addEventListener("click", playerMove, { once: true });

		let i = [[...CELL_ELEMENTS].indexOf(cell)];
		BOARD_COPY[i] = "";
	});

	setBoardHoverEffects();
}

function setBoardHoverEffects() {
	BOARD.classList.remove(PLAYER_TURN);
	BOARD.classList.remove(COMPUTER_TURN);

	BOARD.classList.add(WHOSE_TURN);
}

function playerMove(cellClicked) {
	placeMark(cellClicked.target);

	if (checkIfWin(false) === true) {
		endGame(false);

		WIN_DRAW_SCREEN_ELEMENT.classList.add("show");
	} else if (checkIfDraw(false) === true) {
		endGame(true);

		WIN_DRAW_SCREEN_ELEMENT.classList.add("show");
	} else {
		switchTurns();

		computerMove();
	}
}

function placeMark(cell) {
	cell.classList.add(WHOSE_TURN);

	BOARD_COPY[[...CELL_ELEMENTS].indexOf(cell)] = WHOSE_TURN;
}

function checkIfWin(boardCopy) {
	if (boardCopy) {
		for (let i = 0; i < 8; i++) {
			if (BOARD_COPY[WINNING_COMBINATIONS[i][0]] === WHOSE_TURN && BOARD_COPY[WINNING_COMBINATIONS[i][1]] === WHOSE_TURN && BOARD_COPY[WINNING_COMBINATIONS[i][2]] === WHOSE_TURN) {
				return true;
			}
		}

		return false;
	} else {
		return WINNING_COMBINATIONS.some((combination) => {
			return combination.every((index) => {
				return CELL_ELEMENTS[index].classList.contains(WHOSE_TURN);
			});
		});
	}
}

function endGame(draw) {
	if (draw) {
		WIN_DRAW_MESSAGE_ELEMENT.innerText = "Draw!";
		WIN_DRAW_MESSAGE_ELEMENT.style.color = "white";

		return 0;
	} else {
		if (WHOSE_TURN === PLAYER_TURN) {
			WIN_DRAW_MESSAGE_ELEMENT.innerText = "X's Win!";
			WIN_DRAW_MESSAGE_ELEMENT.style.color = "blue";

			return 10;
		} else {
			WIN_DRAW_MESSAGE_ELEMENT.innerText = "O's Win!";
			WIN_DRAW_MESSAGE_ELEMENT.style.color = "red";

			return -10;
		}
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
		return [...CELL_ELEMENTS].every((cell) => {
			return cell.classList.contains(PLAYER_TURN) || cell.classList.contains(COMPUTER_TURN);
		});
	}
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

	let cell = CELL_ELEMENTS[bestMove];

	placeMark(cell);

	cell.removeEventListener("click", playerMove);

	if (checkIfWin(false) === true) {
		endGame(false);

		WIN_DRAW_SCREEN_ELEMENT.classList.add("show");
	} else if (checkIfDraw(false) === true) {
		endGame(true);

		WIN_DRAW_SCREEN_ELEMENT.classList.add("show");
	} else {
		switchTurns();

		setBoardHoverEffects();
	}
}

function minimax(depth, isMaximizingPlayer) {
	let win = checkIfWin(true);

	if (win && WHOSE_TURN === PLAYER_TURN) {
		return endGame(false);
	} else if (win === true && WHOSE_TURN === COMPUTER_TURN) {
		return endGame(false);
	} else if (checkIfDraw(true) === true) {
		return endGame(true);
	}

	if (isMaximizingPlayer) {
		let maxScore = -Infinity;
		let score;

		for (let i = 0; i < 9; i++) {
			if (BOARD_COPY[i] === "") {
				BOARD_COPY[i] = PLAYER_TURN;

				switchTurns();

				score = minimax(depth + 1, false);

				switchTurns();

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

				switchTurns();

				score = minimax(depth + 1, true);

				switchTurns();

				BOARD_COPY[i] = "";

				minScore = Math.min(score, minScore);
			}
		}

		return minScore;
	}
}
