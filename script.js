const X_TURN = "x";
const CIRCLE_TURN = "circle";

let whoseTurn;

const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winDrawMessageElement = document.querySelector("[win-draw-message]");
const winDrawScreenElement = document.getElementById("winDrawScreen");
const restartButtonElement = document.getElementById("restartButton");

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

startGame();

function startGame() {
	winDrawScreenElement.classList.remove("show");

	whoseTurn = X_TURN;

	cellElements.forEach((cell) => {
		cell.classList.remove(X_TURN);
		cell.classList.remove(CIRCLE_TURN);
		cell.addEventListener("click", handleClick, { once: true });
	});

	setBoardHoverEffects();
}

function handleClick(e) {
	const cell = e.target;

	let currentTurn;

	if (whoseTurn === X_TURN) {
		currentTurn = X_TURN;
	} else {
		currentTurn = CIRCLE_TURN;
	}

	placeMark(cell, currentTurn);

	if (checkIfWin(currentTurn) === true) {
		endGame(false);
	} else if (checkIfDraw() === true) {
		endGame(true);
	} else {
		switchTurns();
		setBoardHoverEffects();
	}
}

function placeMark(cell, currentTurn) {
	cell.classList.add(currentTurn);
}

function switchTurns() {
	if (whoseTurn === X_TURN) {
		whoseTurn = CIRCLE_TURN;
	} else {
		whoseTurn = X_TURN;
	}
}

function endGame(draw) {
	if (draw) {
		winDrawMessageElement.innerText = "Draw!";
		winDrawMessageElement.style.color = "white";
	} else {
		if (whoseTurn === X_TURN) {
			winDrawMessageElement.innerText = "X's Win!";
			winDrawMessageElement.style.color = "blue";
		} else {
			winDrawMessageElement.innerText = "O's Win!";
			winDrawMessageElement.style.color = "red";
		}
	}

	winDrawScreenElement.classList.add("show");
}

function setBoardHoverEffects() {
	board.classList.remove(X_TURN);
	board.classList.remove(CIRCLE_TURN);

	if (whoseTurn === X_TURN) {
		board.classList.add(X_TURN);
	} else {
		board.classList.add(CIRCLE_TURN);
	}
}

function checkIfWin(currentTurn) {
	return WINNING_COMBINATIONS.some((combination) => {
		return combination.every((index) => {
			return cellElements[index].classList.contains(currentTurn);
		});
	});
}

function checkIfDraw() {
	return [...cellElements].every((cell) => {
		return cell.classList.contains(X_TURN) || cell.classList.contains(CIRCLE_TURN);
	});
}
