const board = document.querySelector(".board");
let row = 0;
let colour = ["red", "blue"];
let possiblePos = [];
let occupiedPositions = [2, 9, 4, 14, 49, 58, 60, 54, 55, 36];
let selectedPiece;
let selectedPiecePosition;
let whichPlayerTurn = "red";
let rechButtonsPresent = false;
let sRechButtonsPresent = false;
let bulletPath = [];
let bulletDirection = "up";
let totalTimeOfRed = 300;
let totalTimeOfblue = 300;
let once = true;
let oncesRech = true;
let gameIsPaused = false;
let pieceSelectedOf = "red";
let movesHistory = [];
let numberOfReplaySteps = 0;
let hasUndone = true;
let shouldHistoryBeCleared = false;
let moveNumber = 1;
let isReadyToSwap = false;
let swappingRech = "redrech";
let swappingPiece = null;
const moveBoard = document.getElementById("movesBoard");

let gameNumber = localStorage.getItem("gameNumber");
if (!gameNumber) {
  gameNumber = 0;
}

let undoButton = document.getElementById("undoButton");
let redoButton = document.getElementById("redoButton");
let resetButton = document.createElement("button");
const movesContainer = document.querySelector(".moves");
const turnName = document.querySelector(".turnName");
const buttonSpace = document.querySelector(".options");
const pauseplaybuttonSpace = document.createElement("div");
const pauseButton = document.getElementById("pauseButton");
const swapButton = document.createElement("button");
swapButton.innerText = "Swap";
swapButton.classList.add("resButton");
function generateTheBoard() {
  for (let index = 0; index < 64; index++) {
    const gridElement = document.createElement("div");
    gridElement.classList.add("gridElement");
    gridElement.id = index;
    gridElement.innerText = index;
    gridElement.addEventListener("click", () => {
      const classes = gridElement.classList;

      if (!classes.contains("piece") && !classes.contains("highlight")) {
        removeTheButtons();
        removeTheHighlight();
        isReadyToSwap = false;
      }
      if (classes.contains("highlight") && selectedPiece) {
        removeTheButtons();
        moveThePiece(
          selectedPiecePosition,
          parseInt(gridElement.id),
          selectedPiece,
          false
        );
      }
    });

    if (row % 2 == 0) {
      if (index % 2 == 0) {
        gridElement.classList.add("grey");
      } else if (index % 2 == 1) {
        gridElement.classList.add("white");
      }
      if ((index + 1) % 8 == 0) {
        row++;
      }
    } else if (row % 2 != 0) {
      if (index % 2 != 0) {
        gridElement.classList.add("grey");
      } else if (index % 2 == 0) {
        gridElement.classList.add("white");
      }
      if ((index + 1) % 8 == 0) {
        row++;
      }
    }

    board.appendChild(gridElement);
  }
  pauseButton.addEventListener("click", () => {
    pauseTheGame();
  });
  undoButton.addEventListener("click", () => {
    undo();
  });
  redoButton.addEventListener("click", () => {
    redo();
  });

  return document.querySelectorAll(".gridElement");
}

const nodeList = generateTheBoard();

const redTitan = document.createElement("div");
const redRech = document.createElement("div");
const redsRech = document.createElement("div");
const redTank = document.createElement("div");
const redCanon = document.createElement("div");
const blueTitan = document.createElement("div");
const blueRech = document.createElement("div");
const bluesRech = document.createElement("div");
const blueTank = document.createElement("div");
const blueCanon = document.createElement("div");
const bullet = document.createElement("div");
bullet.classList.add("bullet");

// creating the buttons
const replay = document.createElement("button");
const rotateLeft = document.createElement("button");
const rotateRight = document.createElement("button");
const upLeft = document.createElement("button");
const upRight = document.createElement("button");
const downLeft = document.createElement("button");
const downRight = document.createElement("button");
//  inner Texts of the buttons
rotateLeft.innerText = "Rotate Left";
rotateRight.innerText = "Rotate Right";
upLeft.innerText = "Up - Left";
upRight.innerText = "Up - Right";
downLeft.innerText = "Down - Left";
downRight.innerText = "Down - Right";
// assigning ids to the buttons
upLeft.id = "upLeft";
upRight.id = "upRight";
downLeft.id = "downLeft";
downRight.id = "downRight";
rotateLeft.id = "left";
rotateRight.id = "right";
upLeft.classList.add("resButton");
upRight.classList.add("resButton");
downLeft.classList.add("resButton");
downRight.classList.add("resButton");
rotateLeft.classList.add("resButton");
rotateRight.classList.add("resButton");
swapButton.id = "swap";

const sRechButtonsArray = [upLeft, upRight, downLeft, downRight];
const rechButtonsArray = [rotateLeft, rotateRight, swapButton];

function addRechButtons() {
  if (!validatePlayer()) {
    return;
  }
  buttonSpace.appendChild(rotateLeft);
  buttonSpace.appendChild(rotateRight);
  buttonSpace.appendChild(swapButton);
  rechButtonsPresent = true;
}

function addsRechButtons() {
  if (!validatePlayer()) {
    return;
  }
  buttonSpace.appendChild(upLeft);
  buttonSpace.appendChild(upRight);
  buttonSpace.appendChild(downLeft);
  buttonSpace.appendChild(downRight);
  sRechButtonsPresent = true;
}

const pieceState = {
  redTitan: {
    position: 2,
    domElement: redTitan,
    player: "red",
    pieceId: "Titanr",
  },
  redCanon: {
    position: 4,
    domElement: redCanon,
    player: "red",
    pieceId: "Canonr",
  },
  redTank: {
    position: 9,
    domElement: redTank,
    player: "red",
    pieceId: "Tankr",
  },
  redrech: {
    position: 36,
    domElement: redRech,
    player: "red",
    direction: "right",
    pieceId: "rechr",
  },
  redsRech: {
    position: 14,
    domElement: redsRech,
    player: "red",
    direction: "upRight",
    pieceId: "sRechr",
  },
  blueTitan: {
    position: 58,
    domElement: blueTitan,
    player: "blue",
    pieceId: "Titanb",
  },
  blueCanon: {
    position: 60,
    domElement: blueCanon,
    player: "blue",
    pieceId: "Canonb",
  },
  blueTank: {
    position: 49,
    domElement: blueTank,
    player: "blue",
    pieceId: "Tankb",
  },
  bluerech: {
    position: 55,
    domElement: blueRech,
    player: "blue",
    direction: "right",
    pieceId: "rechb",
  },
  bluesRech: {
    position: 54,
    domElement: bluesRech,
    player: "blue",
    direction: "upRight",
    pieceId: "sRechb",
  },
};
function validatePlayer() {
  if (
    (whichPlayerTurn == "red" && pieceSelectedOf == "blue") ||
    (whichPlayerTurn == "blue" && pieceSelectedOf == "red")
  ) {
    return false;
  }
  return true;
}
function updateMovesBoard(add) {
  if (add) {
    const div = document.createElement("div");
    if (whichPlayerTurn == "red") {
      div.classList.add("redback");
    } else {
      div.classList.add("blueback");
    }
    let len = movesHistory.length;
    const move = movesHistory[len - 1];
    if (move.action == "swap") {
      let rechpiece = move.swappingPieceOneInfo.swappingRech;
      let rechPosition = move.swappingPieceOneInfo.initialPosition;
      let otherPiece = move.swappingPieceTwoInfo.swappingPiece;
      let otherPosition = move.swappingPieceTwoInfo.initialPosition;
      const requiredString = `The ${rechpiece} on position ${rechPosition} was swapped with ${otherPiece} on position ${otherPosition}`;
      div.innerText = requiredString;
      div.id = move.moveNumber;
      moveBoard.appendChild(div);
      return;
    }
    div.id = move.moveNumber;
    div.classList.add("moveBoardElement");
    let piece = move.piece;
    if (!move.finalOrientation) {
      const reqString = `Player ${whichPlayerTurn} moved the ${piece} from ${move.initialPosition} to ${move.finalPosition}`;
      div.innerText = reqString;
      moveBoard.appendChild(div);
    } else {
      const reqString = `player ${whichPlayerTurn} rotated the ${piece}  to ${move.finalOrientation}`;
      div.innerText = reqString;
      moveBoard.appendChild(div);
    }
  } else {
    const childList = moveBoard.children;
    for (let index = 0; index < childList.length; index++) {
      const element = childList[index];
    }
  }
}

function gameOver(player) {
  
  const gameOverDiv = document.createElement("div");
  alert("game is over");
  playerRedTimer.stop();
  playerBlueTimer.stop();
  localStorage.setItem("gameNumber", ++gameNumber);
  localStorage.setItem(gameNumber, movesHistory);
  return;
}

function eventListnerToTheButtons() {
  for (let index = 0; index < rechButtonsArray.length; index++) {
    const element = rechButtonsArray[index];
    element.addEventListener("click", (e) => {
      respondToTheButton(e.target);
    });
  }
  for (let index = 0; index < sRechButtonsArray.length; index++) {
    const element = sRechButtonsArray[index];
    element.addEventListener("click", (e) => {
      respondToTheButton(e.target);
    });
  }
}

eventListnerToTheButtons();

function switchTurn() {
  whichPlayerTurn = whichPlayerTurn === "red" ? "blue" : "red";
  turnName.innerText = whichPlayerTurn.toUpperCase();
  startTimer(whichPlayerTurn);
}

function rotateThepiece(pieceName, response, fromUndo) {
  if (shouldHistoryBeCleared && !fromUndo) {
    removeFromHistory(movesHistory.length - 1 - numberOfReplaySteps);
    shouldHistoryBeCleared = false;
    numberOfReplaySteps = 0;
    moveBoard.removeChild(moveBoard.lastElementChild);
  }
  if (!fromUndo) {
    moveNumber++;
  }
  hasUndone = false;
  if (pieceName === "redrech") {
    const rechElement = document.getElementById("redrechImage");
    if (response == "right") {
      rechElement.style.transform = "rotate(0deg)";
    } else if (response == "left") {
      rechElement.style.transform = "rotate(90deg)";
    }
  } else if (pieceName === "bluerech") {
    const rechElement = document.getElementById("bluerechImage");
    if (response == "right") {
      rechElement.style.transform = "rotate(0deg)";
    } else if (response == "left") {
      rechElement.style.transform = "rotate(90deg)";
    }
  } else if (pieceName == "redsRech") {
    const element = document.getElementById("redsRechImage");
    if (response == "upLeft") {
      element.style.transform = "rotate(270deg)";
    } else if (response == "upRight") {
      element.style.transform = "rotate(0deg)";
    } else if (response == "downLeft") {
      element.style.transform = "rotate(180deg)";
    } else if (response == "downRight") {
      element.style.transform = "rotate(90deg)";
    }
  } else if (pieceName == "bluesRech") {

    const element = document.getElementById("bluesRechImage");
    if (response == "upLeft") {
      element.style.transform = "rotate(270deg)";
    } else if (response == "upRight") {
      element.style.transform = "rotate(0deg)";
    } else if (response == "downLeft") {
      element.style.transform = "rotate(180deg)";
    } else if (response == "downRight") {
      element.style.transform = "rotate(90deg)";
    }
  }

  pieceState[pieceName]["direction"] = response;
}

function respondToTheButton(button) {
  const response = button.id;
  if (response == "swap") {
    swapTheRech();
    return;
  }

  let pieceName = selectedPiece;
  const current = pieceState[pieceName]["direction"];
  while (response == current) {
    alert(
      "The " +
        selectedPiece +
        " is already in that orientation. Please select another position"
    );
    return;
  }

  updateHistory(pieceName, current, null, null);
  rotateThepiece(pieceName, response, false);
  shootTheBullet();
  switchTheTurn();
  removeTheHighlight();
  removeTheButtons();
  
}

const titan = [redTitan, blueTitan];
const rech = [redRech, blueRech];
const sRech = [redsRech, bluesRech];
const tank = [redTank, blueTank];
const canon = [redCanon, blueCanon];

const redPieces = [redTitan, redRech, redTank, redCanon, redsRech];
const bluePieces = [blueTitan, blueRech, blueTank, blueCanon, bluesRech];

function removeTheHighlight() {
  for (let index = 0; index < nodeList.length; index++) {
    const element = nodeList[index];
    element.classList.remove("highlight");
  }
}
function removeFromHistory(fromWhichMove) {
  movesHistory.splice(fromWhichMove + 1);
  moveNumber -= fromWhichMove + 1;
}

function removeTheButtons() {
  if (rechButtonsPresent) {
    buttonSpace.removeChild(rotateLeft);
    buttonSpace.removeChild(rotateRight);
    buttonSpace.removeChild(swapButton);
    rechButtonsPresent = false;
  }
  if (sRechButtonsPresent) {
    buttonSpace.removeChild(upLeft);
    buttonSpace.removeChild(upRight);
    buttonSpace.removeChild(downLeft);
    buttonSpace.removeChild(downRight);
    sRechButtonsPresent = false;
  }
}
function updatePossiblePositions(piece) {
  possiblePos = [];
  const pieceName = whichPlayerTurn + piece;
  selectedPiece = pieceName;
  const gridNumber = parseInt(
    pieceState[pieceName]["domElement"].parentNode.id
  );
  selectedPiecePosition = gridNumber;

  // Logic for redCanon
  if (pieceName == "redCanon") {
    if (gridNumber !== 0 && gridNumber !== 7) {
      possiblePos.push(gridNumber - 1, gridNumber + 1);
    } else if (gridNumber === 0) {
      possiblePos.push(gridNumber + 1);
    } else if (gridNumber === 7) {
      possiblePos.push(gridNumber - 1);
    }
  }

  // Logic for blueCanon
  if (pieceName == "blueCanon") {
    if (gridNumber !== 56 && gridNumber !== 63) {
      possiblePos.push(gridNumber - 1, gridNumber + 1);
    } else if (gridNumber === 56) {
      possiblePos.push(gridNumber + 1);
    } else if (gridNumber === 63) {
      possiblePos.push(gridNumber - 1);
    }
  }

  // General movement logic for other pieces
  if (pieceName !== "redCanon" && pieceName !== "blueCanon") {
    const row = Math.floor(gridNumber / 8);
    const col = gridNumber % 8;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const newPosition = newRow * 8 + newCol;
          possiblePos.push(newPosition);
        }
      }
    }
  }

  // Filter out occupied positions
  const filteredPos = possiblePos.filter(
    (pos) => !occupiedPositions.includes(pos)
  );
  possiblePos = filteredPos;
  return filteredPos;
}

function showPossiblePositions(pieceName) {
  if (!validatePlayer()) {
    return;
  }
  const filteredPos = updatePossiblePositions(pieceName);
  for (let index = 0; index < filteredPos.length; index++) {
    const element = filteredPos[index];
    nodeList[element].classList.add("highlight");
  }
}

function makeThePieces() {
  let playerLetter = ["r", "b"];
  for (let index = 0; index < redPieces.length; index++) {
    const element = redPieces[index];
    element.classList.add("playerRed");
    element.classList.add("piece");
    element.addEventListener("click", (e) => {
      if (element.classList.contains("playerRed")) {
        pieceSelectedOf = "red";
      }
      if (isReadyToSwap) {
        if (element.parentNode.classList.contains("highlight")) {
          swappingAction(element.parentNode, false);
          return;
        }
      }
    });
  }
  for (let index = 0; index < bluePieces.length; index++) {
    const element = bluePieces[index];
    element.classList.add("playerBlue");
    element.classList.add("piece");
    element.addEventListener("click", (e) => {
      if (element.classList.contains("playerBlue")) {
        pieceSelectedOf = "blue";
      }
      if (isReadyToSwap) {
        if (element.parentNode.classList.contains("highlight")) {
          swappingAction(element.parentNode, false);
          return;
        }
      }
    });
  }
  for (let index = 0; index < 2; index++) {
    const element = titan[index];
    element.classList.add("Titan");
    const image = document.createElement("img");
    image.src = "titan.svg";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "contain";

    element.appendChild(image);
    element.addEventListener("click", () => {
      removeTheButtons();
      showPossiblePositions("Titan");
    });
    element.id = "Titan" + playerLetter[index];
  }
  for (let index = 0; index < 2; index++) {
    const element = rech[index];
    element.classList.add("rech");
    const image = document.createElement("img");
    image.src = "rech.svg";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "contain";
    if (index == 0) {
      image.id = "redrechImage";
    } else {
      image.id = "bluerechImage";
    }
    element.appendChild(image);
    element.addEventListener("click", () => {
      if (isReadyToSwap) {
        return;
      }
      removeTheButtons();
      addRechButtons();
      showPossiblePositions("rech");
    });
    element.id = "rech" + playerLetter[index];
  }
  for (let index = 0; index < 2; index++) {
    const element = sRech[index];
    element.classList.add("sRech");
    const image = document.createElement("img");
    image.src = "semiRech.svg";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "contain";
    if (index == 0) {
      image.id = "redsRechImage";
    } else {
      image.id = "bluesRechImage";
    }

    element.appendChild(image);
    element.addEventListener("click", () => {
      if (isReadyToSwap == true) return;
      removeTheButtons();
      addsRechButtons();
      showPossiblePositions("sRech");
    });
    element.id = "sRech" + playerLetter[index];
  }
  for (let index = 0; index < 2; index++) {
    const element = tank[index];
    element.classList.add("Tank");
    const image = document.createElement("img");
    image.src = "tank.svg";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "contain";

    element.appendChild(image);
    element.addEventListener("click", () => {
      if (isReadyToSwap == true) return;
      removeTheButtons();
      showPossiblePositions("Tank");
    });
    element.id = "Tank" + playerLetter[index];
  }
  for (let index = 0; index < 2; index++) {
    const element = canon[index];
    element.classList.add("Canon");
    const image = document.createElement("img");
    image.src = "canon.svg";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "contain";
    if (index === 0) {
      image.style.transform = "rotate(180deg)";
    }

    element.appendChild(image);
    element.addEventListener("click", () => {
      if (isReadyToSwap == true) return;
      removeTheButtons();
      showPossiblePositions("Canon");
    });
    element.id = "Canon" + playerLetter[index];
  }
}

makeThePieces();

function createTimer(player, displayElement) {
  this.player = player;
  this.totalTime = 300; // 5 minutes in seconds
  this.remainingTime = this.totalTime;
  this.timer = null;
  this.isRunning = false;
  this.displayElement = displayElement;

  this.formatTime = function (seconds) {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(
      2,
      "0"
    )}`;
  };

  this.updateDisplay = function () {
    this.displayElement.innerText = this.formatTime(this.remainingTime);
  };

  this.start = function () {
    if (!this.isRunning) {
      this.isRunning = true;
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
          this.updateDisplay();
        } else {
          clearInterval(this.timer);
          this.isRunning = false;
          gameOver(this.player);
          alert(`${this.player} lost by time`);
        }
      }, 1000);
    }
  };

  this.pause = function () {
    if (this.isRunning) {
      clearInterval(this.timer);
      this.isRunning = false;
    }
  };

  this.stop = function () {
    clearInterval(this.timer);
    this.remainingTime = this.totalTime;
    this.updateDisplay();
    this.isRunning = false;
  };

  // Initialize the display
  this.updateDisplay();
}

// Get the DOM elements by their IDs
const redTimerElement = document.getElementById("red-timer");
const blueTimerElement = document.getElementById("blue-timer");

const playerRedTimer = new createTimer("Red", redTimerElement);
const playerBlueTimer = new createTimer("Blue", blueTimerElement);
playerRedTimer.start();

function updateHistory(
  piece,
  finalOrientation,
  initialPosition,
  finalPosition
) {
  let moveObject = {};
  moveObject.player = whichPlayerTurn;
  moveObject.piece = piece;
  moveObject.finalPosition = finalPosition;
  moveObject.initialPosition = initialPosition;
  moveObject.finalOrientation = finalOrientation;
  moveObject.moveNumber = movesHistory.length + 1;
  movesHistory.push(moveObject);
  updateMovesBoard(true);
}

function switchTheTurn() {
  whichPlayerTurn = whichPlayerTurn === "red" ? "blue" : "red";
  turnName.innerText = whichPlayerTurn.toUpperCase();
  if (playerRedTimer.isRunning) {
    playerRedTimer.pause();
    playerBlueTimer.start();
  } else if (playerBlueTimer) {
    playerBlueTimer.pause();
    playerRedTimer.start();
  }
}

function placeThePiece(position, pieceDomElement, piece) {
  const divToAppend = document.getElementById(position.toString());
  divToAppend.innerText = "";
  divToAppend.classList.add("piece");
  divToAppend.appendChild(pieceDomElement);
  pieceState[piece]["position"] = position;
}

function removeThePiece(position, pieceDomElement) {
  const divToRemove = document.getElementById(position.toString());
  divToRemove.removeChild(pieceDomElement);
  nodeList[position].classList.remove("piece");
}



function moveThePiece(initialPosition, finalPosition, piece, fromUndo) {

  removeThePiece(initialPosition, pieceState[piece]["domElement"], piece);
  placeThePiece(finalPosition, pieceState[piece]["domElement"], piece);
  removeTheHighlight();
  hasUndone = false;
  const index = occupiedPositions.indexOf(initialPosition);
  occupiedPositions[index] = finalPosition;
  if (shouldHistoryBeCleared && !fromUndo) {
    removeFromHistory(movesHistory.length - 1 - numberOfReplaySteps);
    shouldHistoryBeCleared = false;
    numberOfReplaySteps = 0;
    moveBoard.removeChild(moveBoard.lastElementChild);
  }
  if (!fromUndo) {
    shootTheBullet();
    updateHistory(piece, null, initialPosition, finalPosition);
    switchTheTurn();
    moveNumber++;
  }
}

function initialSetup() {
  for (const key in pieceState) {
    const element = pieceState[key];
    placeThePiece(element["position"], element["domElement"], key);
  }
}

initialSetup();

function detectPiece(position) {
  let returnObject = { canContinue: true, increment: 0, game: true };
  const piece = nodeList[position].firstChild;
  const pieceId = piece.id;
  const pieceName = pieceId.slice(0, -1);
  const playerIdentifierForSwap = pieceId[pieceId.length - 1];
  if (once) {
    if (whichPlayerTurn == "red") {
      bulletDirection = "down";
    } else if (whichPlayerTurn == "blue") {
      bulletDirection = "up";
    }
    once = false;
  }
  if (pieceName == "Tank" || pieceName == "Canon") {
    returnObject.canContinue = false;
    returnObject.increment = 0;
  } else if (pieceName == "Titan") {
    returnObject.game = false;
  } else if (pieceName == "rech") {
    let whichRech = "bluerech";
    if (playerIdentifierForSwap == "r") {
      whichRech = "redrech";
    }

    let orientationOfRech = pieceState[whichRech]["direction"];
    if (orientationOfRech == "left") {
      if (bulletDirection == "up") {
        returnObject.increment = -1;
        bulletDirection = "left";
      } else if (bulletDirection == "down") {
        returnObject.increment = +1;
        bulletDirection = "right";
      } else if (bulletDirection == "right") {
        returnObject.increment = 8;
        bulletDirection = "down";
      } else if (bulletDirection == "left") {
        returnObject.increment = -8;
        bulletDirection = "up";
      }
    } else if (orientationOfRech == "right") {
      if (bulletDirection == "up") {
        returnObject.increment = 1;
        bulletDirection = "right";
      } else if (bulletDirection == "down") {
        returnObject.increment = -1;
        bulletDirection = "left";
      } else if (bulletDirection == "left") {
        returnObject.increment = 8;
        bulletDirection = "down";
      } else if (bulletDirection == "right") {
        returnObject.increment = -8;
        bulletDirection = "up";
      }
    }
  } else if (pieceName == "sRech") {
    let whichsRech = "bluesRech";
    if (playerIdentifierForSwap == "r") {
      whichsRech = "redsRech";
    }
    const sRechOrientation = pieceState[whichsRech]["direction"];
    if (sRechOrientation == "upRight") {
      if (bulletDirection == "down") {
        returnObject.increment = 1;
        bulletDirection = "right";
      } else if (bulletDirection == "left") {
        returnObject.increment = -8;
        bulletDirection = "up";
      } else {
        returnObject.canContinue = false;
      }
    } else if (sRechOrientation == "upLeft") {
      if (bulletDirection == "right") {
        returnObject.increment = -8;
        bulletDirection = "up";
      } else if (bulletDirection == "down") {
        returnObject.increment = -1;
        bulletDirection = "left";
      } else {
        returnObject.canContinue = false;
      }
    } else if (sRechOrientation == "downLeft") {
      if (bulletDirection == "right") {
        returnObject.increment = 8;
        bulletDirection = "down";
      } else if (bulletDirection == "up") {
        returnObject.increment = -1;
        bulletDirection = "left";
      } else {
        returnObject.canContinue = false;
      }
    } else if (sRechOrientation == "downRight") {
      if (bulletDirection == "up") {
        returnObject.increment = 1;
        bulletDirection = "right";
      } else if (bulletDirection == "left") {
        returnObject.increment = 8;
        bulletDirection = "down";
      } else {
        returnObject.canContinue = false;
      }
    }
  }

  return returnObject;
}

function calculateThePath() {
  let pieceName = whichPlayerTurn + "Canon";
  let canonPosition = pieceState[pieceName].position;
  let increment = 8;
  let bulletPosition =
    whichPlayerTurn == "red" ? canonPosition + 8 : canonPosition - 8;

  increment = whichPlayerTurn == "red" ? (increment = 8) : (increment = -8);
  while (bulletPosition <= 63 && bulletPosition >= 0) {
    if (bulletPosition % 8 == 0 || (bulletPosition + 1) % 8 == 0) {
      // if (
      //   nodeList[bulletPosition].classList.contains("piece") &&
      //   (bulletDirection == "up" || bulletDirection == "down")
      // ) {
      //   break;
      // }
      if (
        !nodeList[bulletPosition].classList.contains("piece") &&
        (bulletDirection == "right" || bulletDirection == "left")
      ) {
        bulletPath.push(bulletPosition);
        break;
      }
    }
    if (!nodeList[bulletPosition].classList.contains("piece")) {
      bulletPath.push(bulletPosition);
    } else {
      bulletPath.push(bulletPosition);
      const forwardObject = detectPiece(bulletPosition);
      if (!forwardObject.canContinue) {
        break;
      }
      if (!forwardObject.game) {
        bulletPath.push(-1);
        break;
      }
      increment = forwardObject.increment;
    }
    bulletPosition += increment;
  }
}

function shootTheBullet() {
  calculateThePath();
  const finalBulletPosition = bulletPath[bulletPath.length - 1];
  let interval = setInterval(() => {
    if (!bulletPath.length) {
      clearInterval(interval);
      nodeList[finalBulletPosition].removeChild(bullet);
      once = true;
      oncesRech = true;
      return;
    }
    if (bulletPath[0] == -1) {
      gameOver(whichPlayerTurn);
      clearInterval(interval);
      nodeList[finalBulletPosition - 1].removeChild(bullet);
    }
    nodeList[bulletPath[0]].appendChild(bullet);
    bulletPath.shift();
  }, 100);
  const canonAudio = new Audio("Canon.mp3");
  canonAudio.play();
}
function createResetResumeDiv() {
  const existingDiv = document.getElementById("resetResumeDiv");
  if (existingDiv) return; // Prevent creating multiple divs

  const requiredDiv = document.createElement("div");
  requiredDiv.id = "resetResumeDiv";
  requiredDiv.classList.add("overlay");

  const resumeButton = document.createElement("button");
  const resetButton = document.createElement("button");
  resumeButton.innerText = "Resume";
  resetButton.innerText = "Reset";
  resumeButton.addEventListener("click", () => {
    ResumeTheGame();
    requiredDiv.remove();
    document.body.classList.remove("blurred");
  });
  resetButton.addEventListener("click", () => {
    resetTheGame();
    requiredDiv.remove();
    document.body.classList.remove("blurred");
  });
  requiredDiv.appendChild(resumeButton);
  requiredDiv.appendChild(resetButton);
  document.body.appendChild(requiredDiv);
  document.body.classList.add("blurred");
}

function pauseTheGame() {
  gameIsPaused = true;
  if (playerBlueTimer.isRunning) {
    playerBlueTimer.pause();
  } else {
    playerRedTimer.pause();
  }
  createResetResumeDiv();
}

function ResumeTheGame() {
  if (!gameIsPaused) {
    return;
  }
  if (whichPlayerTurn == "red") {
    playerRedTimer.start();
  } else {
    playerBlueTimer.start();
  }
  gameIsPaused = false;
}
function resetTheGame() {
  playerBlueTimer.stop();
  playerRedTimer.stop();
  initialSetup();
}

function undo() {
  try {
    shouldHistoryBeCleared = true;
    let index = movesHistory.length - 1 - numberOfReplaySteps;
    let rotation = null;
    const positions = movesHistory[index];
    rotation = positions.finalOrientation;
    let piece = positions.piece;
    if (!rotation) {
      let initialPosition = positions.initialPosition;
      let finalPosition = positions.finalPosition;
      numberOfReplaySteps++;
      moveThePiece(finalPosition, initialPosition, piece, true);
    } else {
      numberOfReplaySteps++;
      rotateThepiece(piece, rotation, true);
    }
    hasUndone = true;
    switchTheTurn();
    updateMovesBoard(false);
  } catch (e) {
    alert("No further Undos !!!");
  }
}

function redo() {
  try {
    let index = movesHistory.length - numberOfReplaySteps;
    if (hasUndone) {
      let rotation = null;
      numberOfReplaySteps--;
      const positions = movesHistory[index];
      rotation = positions.finalOrientation;
      let piece = positions.piece;
      if (!rotation) {
        let initialPosition = positions.initialPosition;
        let finalPosition = positions.finalPosition;
        moveThePiece(initialPosition, finalPosition, piece, true);
      } else {
        rotateThepiece(piece, rotation, true);
      }
      switchTheTurn();
      shouldHistoryBeCleared = true;
    }
  } catch (e) {
    alert("No further redos !!!");
  }
}

function swapTheRech() {
  removeTheHighlight();
  for (const key in pieceState) {
    if (
      key == "redTitan" ||
      key == "blueTitan" ||
      key == "redCanon" ||
      key == "blueCanon"
    ) {
      continue;
    } else {
      pieceState[key].domElement.parentNode.classList.add("highlight");
      isReadyToSwap = true;
    }
  }
  return;
}

function swappingAction(gridElement, fromUndo) {
  let piecePlayer = "blue";
  isReadyToSwap = false;
  let playerIdentifierForSwap =
    gridElement.firstChild.id[gridElement.firstChild.id.length - 1];
  if (playerIdentifierForSwap == "r") {
    piecePlayer = "red";
  }
  let selectedPieceForSwap =
    piecePlayer + gridElement.firstChild.id.slice(0, -1);
  if (whichPlayerTurn == "red") {
    swappingRech = "redrech";
  } else {
    swappingRech = "bluerech";
  }
  let swappingRechId = pieceState[swappingRech]["pieceId"];
  let swappingRechPiece = document.getElementById(swappingRechId.toString());
  let exPosition1 = pieceState[swappingRech]["position"];
  let exPosition2 = parseInt(gridElement.id);
  removeThePiece(exPosition1, swappingRechPiece);
  let index2 = occupiedPositions.indexOf(exPosition1)
  occupiedPositions.splice(index2,1);
  moveThePiece(exPosition2, exPosition1, selectedPieceForSwap, true);
  placeThePiece(exPosition2, swappingRechPiece, swappingRech);
  shootTheBullet();
  if (!fromUndo) {
    let moveObject = {};
    moveObject.action = "swap";
    moveObject.swappingPieceOneInfo = {
      swappingRech: swappingRech,
      initialPosition: exPosition1,
    };
    moveObject.swappingPieceTwoInfo = {
      swappingPiece: selectedPieceForSwap,
      initialPosition: exPosition2,
    };
    moveObject.moveNumber = moveNumber;
    movesHistory.push(moveObject);
    moveNumber++;
    updateMovesBoard(true);
    switchTheTurn();
    removeTheButtons();
  }
  removeTheHighlight();
}