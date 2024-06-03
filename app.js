const board = document.querySelector(".board");
const body = document.querySelector("body");
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
let bulletDirectionArray = [];
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
let tankWeakningConfig = true;
let bulletImageInUse = null;
let isTitanHitAtPosition;
let underReplayFstsetup = false;
let bulletIsTravelling = false;
let bulletTailPosition;
const spellDiv = document.querySelector(".spellDiv");
const spellInput = document.getElementById("spellInput");
const pauseMenu = document.getElementById("pauseMenu");
const gameOverMenu = document.getElementById("gameOver");
const resumeButton = document.createElement("button");
const moveBoard = document.getElementById("middle");
const bulletUp = document.createElement("div");
const bulletDown = document.createElement("div");
const bulletLeft = document.createElement("div");
const bulletRight = document.createElement("div");
let gameNumber = localStorage.getItem("gameNumber");
let spellCount = {
  red: {
    hardertank: 0,
    longlivetitan: 0,
    addtime: 0
  },
  blue : {
    hardertank: 0,
    longlivetitan: 0,
    addtime: 0
  }
}
if (!gameNumber) {
  gameNumber = 0;
}

let undoButton = document.getElementById("undoButton");
let redoButton = document.getElementById("redoButton");
let resetButton = document.createElement("button");
const movesContainer = document.querySelector(".moves");
const turnName = document.querySelector("#turnName");
const buttonSpace = document.querySelector("#buttonSpace");
const pauseplaybuttonSpace = document.createElement("div");
const pauseButton = document.getElementById("pauseButton");
const swapButton = document.createElement("button");
swapButton.innerText = "Swap";
swapButton.classList.add("btn");

const spellsArray = ["hardertank", "longlivetitan", "addtime"];

window.addEventListener("keypress", (e) => {
  let response;
  if (e.key == "Enter") {
    response = spellInput.value;
    spellInput.value = "";
  }
  if (response != null) {
    if (spellsArray.includes(response.toLowerCase())) {
      processTheSpell(response);
    }
  }
  console.log(e);
});

function generateTheBoard() {
  pauseMenu.classList.add("hide");
  for (let index = 0; index < 64; index++) {
    const gridElement = document.createElement("div");
    gridElement.classList.add("gridElement");
    gridElement.id = index;
    const NumberDiv = document.createElement("div");

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
  pauseButton.addEventListener("click", (e) => {
    pauseMenu.classList.remove("hide");
    pauseTheGame();
  });
  undoButton.addEventListener("click", () => {
    undo();
  });
  redoButton.addEventListener("click", () => {
    redo();
  });
  resetButton.addEventListener("click", () => {
    resetTheGame();
    gameOverMenu.classList.add("hide");
    pauseMenu.close();
    gameOverMenu.close();
  });
  resumeButton.addEventListener("click", () => {
    pauseMenu.classList.remove("hide");
    resumeTheGame();
    pauseMenu.close();
    gameOverMenu.close();
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
resetButton.innerText = "Reset";
resumeButton.innerText = "Resume";

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
upLeft.classList.add("btn");
upRight.classList.add("btn");
downLeft.classList.add("btn");
downRight.classList.add("btn");
rotateLeft.classList.add("btn");
rotateRight.classList.add("btn");
swapButton.id = "swap";

const sRechButtonsArray = [upLeft, upRight, downLeft, downRight];
const rechButtonsArray = [rotateLeft, rotateRight, swapButton];

function makeTheBulletDivs() {
  bulletUp.classList.add("gridElement");
  bulletUp.classList.add("bulletClass");
  bulletDown.classList.add("gridElement");
  bulletDown.classList.add("bulletClass");
  bulletLeft.classList.add("gridElement");
  bulletLeft.classList.add("bulletClass");
  bulletRight.classList.add("gridElement");
  bulletRight.classList.add("bulletClass");

  const imageUp = document.createElement("img");
  imageUp.src = "bullet.svg";
  imageUp.style.width = "100%";
  imageUp.style.height = "100%";
  imageUp.style.objectFit = "contain";
  imageUp.style.transform = "rotate(0deg)";
  bulletUp.appendChild(imageUp);

  const imageRight = document.createElement("img");
  imageRight.src = "bullet.svg";
  imageRight.style.width = "100%";
  imageRight.style.height = "100%";
  imageRight.style.objectFit = "contain";
  imageRight.style.transform = "rotate(90deg)";
  bulletRight.appendChild(imageRight);

  const imageDown = document.createElement("img");
  imageDown.src = "bullet.svg";
  imageDown.style.width = "100%";
  imageDown.style.height = "100%";
  imageDown.style.objectFit = "contain";
  imageDown.style.transform = "rotate(180deg)";
  bulletDown.appendChild(imageDown);

  const imageLeft = document.createElement("img");
  imageLeft.src = "bullet.svg";
  imageLeft.style.width = "100%";
  imageLeft.style.height = "100%";
  imageLeft.style.objectFit = "contain";
  imageLeft.style.transform = "rotate(270deg)";
  bulletLeft.appendChild(imageLeft);
}
function makeThefunctionalityButtons() {
  const image = document.createElement("img");
  image.src = "backArrow.svg";
  image.style.height = "100%";
  image.style.width = "100%";
  image.style.objectFit = "contain";
  undoButton.appendChild(image);
  const image2 = document.createElement("img");
  image2.src = "forwardArrow.svg";
  image2.style.height = "100%";
  image2.style.width = "100%";
  image2.style.objectFit = "contain";
  redoButton.appendChild(image2);
  const image3 = document.createElement("img");
  image3.src = "pauseButton.svg";
  image3.style.height = "100%";
  image3.style.width = "100%";
  image3.style.objectFit = "contain";
  pauseButton.appendChild(image3);
}
makeThefunctionalityButtons();

makeTheBulletDivs();

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

let pieceState = {
  redTitan: {
    position: 2,
    domElement: redTitan,
    player: "red",
    pieceId: "Titanr",
    isStronger : false,
    numbrOfTimesMadeStrong : 0
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
    isHard: false,
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
    isdestroyed: false,
  },
  blueTitan: {
    position: 58,
    domElement: blueTitan,
    player: "blue",
    pieceId: "Titanb",
    isStronger : false,
    numbrOfTimesMadeStrong : 0
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
    isHard: false,
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
    isdestroyed: false,
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
    let addedclassOpposite = "redback";
    let addedClass = "blueback";
    let whichPlayerTurnOpposite = "blue";
    const div = document.createElement("div");
    if (whichPlayerTurn == "red") {
      div.classList.add("redback");
      addedClass = "redback";
      addedclassOpposite = "blueback";
    } else {
      div.classList.add("blueback");
      addedClass = "blueback";
      addedclassOpposite = "redback";
      whichPlayerTurnOpposite = "red";
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
      movesHistory[len - 1].sentence = requiredString;
      return;
    }
    div.id = move.moveNumber;
    div.classList.add("moveBoardElement");
    let piece = move.piece;
    if (move.destroyedSrech) {
      const reqObject = move;
      let requiredString;
      let positionWhereDestroyed = reqObject.positionWhereDestroyed;
      let domelementId = reqObject.destroyedDomElement.id;
      if (domelementId == "sRechr") {
        requiredString = `The Red Semi Rechociate was destroyed on the position ${positionWhereDestroyed} by the ${whichPlayerTurnOpposite} canon`;
        div.classList.remove(addedClass);
        div.classList.add(addedclassOpposite);
      } else {
        requiredString = `The Blue Semi Rechociate was destroyed on the position ${positionWhereDestroyed} by the ${whichPlayerTurnOpposite} canon`;
        div.classList.remove(addedClass);
        div.classList.add(addedclassOpposite);
      }
      div.innerText = requiredString;
      movesHistory[len - 1].sentence = requiredString;
      moveBoard.appendChild(div);
    } else if (!move.finalOrientation) {
      const reqString = `Player ${whichPlayerTurn} moved the ${piece} from ${move.initialPosition} to ${move.finalPosition}`;
      div.innerText = reqString;
      moveBoard.appendChild(div);
      movesHistory[len - 1].sentence = reqString;
    } else {
      const reqString = `player ${whichPlayerTurn} rotated the ${piece}  to ${move.finalOrientation}`;
      div.innerText = reqString;
      moveBoard.appendChild(div);
      movesHistory[len - 1].sentence = reqString;
    }
  } else {
    console.log(movesHistory);
    moveBoard.innerHTML = "";
    // console.log("After Undo Or ReDo");
    // console.log(movesHistory);
    for (let index = 0; index < movesHistory.length; index++) {
      const element = movesHistory[index];
      const divToAdd = document.createElement("div");
      let classToAdd = "blueback";
      if (element.player == "red") {
        classToAdd = "redback";
      }
      divToAdd.classList.add(classToAdd);
      divToAdd.innerText = element.sentence;
      divToAdd.classList.add("moveBoardElement");
      moveBoard.appendChild(divToAdd);
    }
  }
}

function gameOver(winner) {
  console.log(winner);
  let displayName = "Blue";
  if (winner == "playerRed") {
    displayName = "Red";
  }
  const generalGameInfo = {
    gameNumber: gameNumber,
    winner: displayName,
  };
  movesHistory.push(generalGameInfo);
  const reqStr = `Player ${displayName} won the game`;
  const div = document.createElement("div");
  div.innerText = reqStr;
  gameOverMenu.appendChild(div);
  gameOverMenu.appendChild(resetButton);
  gameOverMenu.showModal();
  playerRedTimer.stop();
  playerBlueTimer.stop();
  gameOverMenu.classList.remove("hide");
  endGameProcedures();
  return;
}
const initialSetupString = JSON.stringify(pieceState);
const initialOccupiedPositionsString = JSON.stringify(occupiedPositions);
let pieceDomElements = {
  redCanon: redCanon,
  redTitan: redTitan,
  redrech: redRech,
  redsRech: redsRech,
  redTank: redTank,
  blueCanon: blueCanon,
  blueTitan: blueTitan,
  bluerech: blueRech,
  bluesRech: bluesRech,
  blueTank: blueTank,
};
function firstSetUp() {
  let initialSetUpObject = JSON.parse(initialSetupString);
  occupiedPositions = [];
  for (const key in initialSetUpObject) {
    removeThePiece(pieceState[key]["position"], pieceState[key]["domElements"]);
  }
  pieceState = initialSetUpObject;
  for (const key in pieceState) {
    pieceState[key]["domElement"] = pieceDomElements[key];
    if (key == "redsRech" || key == "bluesRech") {
      pieceState[key]["isdestroyed"] = false;
    }
    occupiedPositions.push(initialSetUpObject[key]["position"]);
  }
  console.log(occupiedPositions);
  whichPlayerTurn = "red";
  initialSetup();
  moveBoard.innerHTML = "";
  bulletDirectionArray = [];
  bulletPath = [];
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
    updateMovesBoard(false);
  }
  if (!fromUndo) {
    moveNumber++;
  }
  hasUndone = false;
  const initialOrientation = pieceState[pieceName]["direction"];
  if (pieceName === "redrech") {
    const rechElement = document.getElementById("redrechImage");
    if (response == "right") {
      rechElement.classList.add("commonRotation");
      rechElement.classList.add("animateRotateRight");
      console.log("animation Added");
      rechElement.style.transform = "rotate(0deg)";
    } else if (response == "left") {
      rechElement.classList.add("commonRotation");
      rechElement.classList.add("animateRotateLeft");
      rechElement.style.transform = "rotate(0deg)";
      rechElement.style.transform = "rotate(90deg)";
    }
  } else if (pieceName === "bluerech") {
    const rechElement = document.getElementById("bluerechImage");
    if (response == "right") {
      rechElement.classList.add("commonRotation");
      rechElement.classList.add("animateRotateRights");
      rechElement.style.transform = "rotate(0deg)";
    } else if (response == "left") {
      rechElement.classList.add("commonRotation");
      rechElement.classList.add("animateRotateLeft");
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
  if (!fromUndo) {
    updateHistory(
      pieceName,
      initialOrientation,
      response,
      null,
      null,
      "rotation"
    );
  }

  pieceState[pieceName]["direction"] = response;
  removeTheHighlight();
  removeTheButtons();
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

function endGameProcedures() {
  gameNumber++;
  localStorage.setItem("gameNumber", gameNumber.toString());
  localStorage.setItem(gameNumber.toString(), JSON.stringify(movesHistory));
  movesHistory = [];
}

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
  removeTheHighlight();
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
      if (bulletIsTravelling) {
        return;
      }
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
      if (bulletIsTravelling) {
        return;
      }
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
      if (bulletIsTravelling) {
        return;
      }
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
      if (bulletIsTravelling) {
        return;
      }
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
      if (bulletIsTravelling) {
        return;
      }
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
      if (bulletIsTravelling) {
        return;
      }
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
      if (bulletIsTravelling) {
        return;
      }
      if (isReadyToSwap == true) return;
      removeTheButtons();
      showPossiblePositions("Canon");
    });
    element.id = "Canon" + playerLetter[index];
  }
}

function createTimer(player, displayElement) {
  this.player = player;
  this.numberOfIncrement = 0;
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

const redTimerElement = document.getElementById("red-timer");
const blueTimerElement = document.getElementById("blue-timer");

const playerRedTimer = new createTimer("Red", redTimerElement);
const playerBlueTimer = new createTimer("Blue", blueTimerElement);
playerRedTimer.start();

function updateHistory(
  piece,
  initialOrientation,
  finalOrientation,
  initialPosition,
  finalPosition,
  action
) {
  let moveObject = {};
  moveObject.player = whichPlayerTurn;
  moveObject.piece = piece;
  moveObject.finalPosition = finalPosition;
  moveObject.initialPosition = initialPosition;
  moveObject.initialOrientation = initialOrientation;
  moveObject.finalOrientation = finalOrientation;
  moveObject.moveNumber = movesHistory.length + 1;
  moveObject.action = action;
  movesHistory.push(moveObject);
  updateMovesBoard(true);
}
updateMovesBoard(false);

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
  if (pieceDomElement && divToRemove.contains(pieceDomElement)) {
    divToRemove.removeChild(pieceDomElement);
    divToRemove.innerText = position;
  }
  nodeList[position].classList.remove("piece");
}
function clearTheRotationAnimation(piece) {
  let domelement = pieceState[piece]["domElement"];
  let image = domelement.firstChild;
  image.classList.remove("commonRotation");
  // console.log("animations Removed");
}

function moveThePiece(initialPosition, finalPosition, piece, fromUndo) {
  if (shouldHistoryBeCleared && !fromUndo) {
    removeFromHistory(movesHistory.length - 1 - numberOfReplaySteps);
    shouldHistoryBeCleared = false;
    numberOfReplaySteps = 0;
    moveBoard.removeChild(moveBoard.lastElementChild);
  }
  // clearTheRotationAnimation(piece);
  // console.log("HISTORY WHILE CLEARING !!!!!!!");
  // console.log(movesHistory);
  removeThePiece(initialPosition, pieceState[piece]["domElement"], piece);
  placeThePiece(finalPosition, pieceState[piece]["domElement"], piece);
  removeTheHighlight();
  hasUndone = false;
  const index = occupiedPositions.indexOf(initialPosition);
  occupiedPositions[index] = finalPosition;
  if (!fromUndo) {
    shootTheBullet();
    updateHistory(
      piece,
      null,
      null,
      initialPosition,
      finalPosition,
      "movement"
    );
    switchTheTurn();
    moveNumber++;
    updateMovesBoard(false);
  }
}

function initialSetup() {
  gameOverMenu.innerHTML = "";
  for (const key in pieceState) {
    const element = pieceState[key];
    placeThePiece(element["position"], element["domElement"], key);
  }
}

initialSetup();

function destroyThesRech(piece) {
  let srechPosition = pieceState[piece]["position"];
  let srechDomElement = pieceState[piece]["domElement"];
  removeThePiece(srechPosition, srechDomElement);
  let index3 = occupiedPositions.indexOf(srechPosition);
  occupiedPositions.splice(index3, 1);
  const explosionAudio = new Audio("explosion.mp3");
  explosionAudio.play();
  pieceState[piece]["isdestroyed"] = true;
  bulletPath = [];
  bulletDirectionArray = [];
  let playerDes = "red";
  if (whichPlayerTurn == "red") {
    playerDes = "blue";
  }
  let destroyedsRechObject = {
    piece: piece,
    player: playerDes,
    action: "destroyed",
    destroyedSrech: true,
    positionWhereDestroyed: srechPosition,
    destroyedDomElement: srechDomElement,
    onMoveNumber: moveNumber - 1,
    destroyedPiece: piece,
  };
  movesHistory.push(destroyedsRechObject);
  updateMovesBoard(true);
}

function initialDirectionOfTheBullet() {
  // console.log(bulletDirection);
  if (whichPlayerTurn == "red") {
    bulletDirection = "down";
  } else {
    bulletDirection = "up";
  }
  // console.log("reaching");
}
function detectPiece(position) {
  let returnObject = { canContinue: true, increment: 0, game: true };
  const piece = nodeList[position].firstChild;
  console.log(nodeList[position]);
  console.log(piece);
  const pieceId = piece.id;
  const pieceName = pieceId.slice(0, -1);
  const playerIdntifier = pieceId[pieceId.length - 1];
  const playerIdentifierForSwap = pieceId[pieceId.length - 1];
  if (once) {
    if (whichPlayerTurn == "red") {
      bulletDirection = "down";
    } else if (whichPlayerTurn == "blue") {
      bulletDirection = "up";
    }
    once = false;
  }
  if (pieceName == "Canon") {
    returnObject.canContinue = false;
    returnObject.increment = 0;
  } else if (pieceName == "Tank") {
    if (bulletDirection == "up" || bulletDirection == "down") {
      returnObject.canContinue = false;
      returnObject.increment = 0;
    } else {
      if (playerIdntifier == "r") {
        if (pieceState["redTank"]["isHard"]) {
          returnObject.canContinue = false;
          returnObject.increment = 0;
        } else {
          returnObject.canContinue = true;
          if (bulletDirection == "left") {
            returnObject.increment = -1;
          } else {
            returnObject.increment = 1;
          }
        }
      } else {
        if (pieceState["blueTank"]["isHard"]) {
          returnObject.canContinue = false;
          returnObject.increment = 0;
        } else {
          returnObject.canContinue = true;
          if (bulletDirection == "left") {
            returnObject.increment = -1;
          } else {
            returnObject.increment = 1;
          }
        }
      }
    }
  } else if (pieceName == "Titan") {
    if (!pieceState["redTitan"]["isStronger"] || !pieceState["blueTitan"]["isStronger"]) {
      returnObject.game= false
    }
    if (playerIdntifier == "r") {
      if (pieceState["redTitan"]["isStronger"]) {
        returnObject.canContinue = false;
        returnObject.increment = 0;        
        pieceState["redTitan"]["isStronger"] = false;
      }
    }else{
      if (pieceState["blueTitan"]["isStronger"]) {
        returnObject.canContinue = true;
        returnObject.increment = 0;
        pieceState["blueTitan"]["isStronger"] = false;
      }
    }
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

    // logic for sRech
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
        returnObject.destroyedsRech = {
          isDestroyed: true,
          whichsRech: whichsRech,
        };
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
        returnObject.destroyedsRech = {
          isDestroyed: true,
          whichsRech: whichsRech,
        };
      }
    } else if (sRechOrientation == "downLeft") {
      if (bulletDirection == "right") {
        returnObject.increment = 8;
        bulletDirection = "down";
      } else if (bulletDirection == "up") {
        returnObject.increment = -1;
        bulletDirection = "left";
      } else {
        // console.log("Here IS THE CONTROL");
        returnObject.canContinue = false;
        returnObject.destroyedsRech = {
          isDestroyed: true,
          whichsRech: whichsRech,
        };
      }
    } else if (sRechOrientation == "downRight") {
      if (bulletDirection == "up") {
        returnObject.increment = 1;
        bulletDirection = "right";
      } else if (bulletDirection == "left") {
        returnObject.increment = 8;
        bulletDirection = "down";
      } else {
        // console.log("Here IS THE CONTROL");
        returnObject.canContinue = false;
        returnObject.destroyedsRech = {
          isDestroyed: true,
          whichsRech: whichsRech,
        };
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
    bulletDirectionArray.push(bulletDirection);
    if (bulletPosition % 8 == 0 || (bulletPosition + 1) % 8 == 0) {
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
      // console.log("forward Object");
      // console.log(forwardObject);
      if (!forwardObject.canContinue) {
        if (
          forwardObject.destroyedsRech &&
          forwardObject.destroyedsRech.isDestroyed
        ) {
          if (forwardObject.destroyedsRech.whichsRech == "redsRech") {
            bulletPath.push(-2);
          } else {
            bulletPath.push(-3);
          }
        }
        break;
      }
      if (!forwardObject.game) {
        // isTitanHit = true
        isTitanHitAtPosition = bulletPosition;
        bulletPath.push(-1);
        break;
      }
      increment = forwardObject.increment;
    }
    bulletPosition += increment;
  }
  // bulletDirectionArray.push(bulletDirection)
}

function shootTheBullet() {
  initialDirectionOfTheBullet();
  calculateThePath();
  console.log(bulletPath);
  bulletTailPosition = bulletPath[0];
  bulletIsTravelling = true;
  const finalBulletPosition = bulletPath[bulletPath.length - 1];
  let interval = setInterval(() => {
    nodeList[bulletTailPosition].innerText = "";
    if (!bulletPath.length) {
      clearInterval(interval);
      bulletIsTravelling = false;
      nodeList[finalBulletPosition].removeChild(bulletImageInUse);
      once = true;
      oncesRech = true;
      return;
    }
    if (bulletPath[0] == -1) {
      bulletIsTravelling = false;
      console.log(nodeList[isTitanHitAtPosition].children);
      let whichPlayerWon = "playerBlue";
      if (nodeList[isTitanHitAtPosition].classList.contains("playerBlue")) {
        whichPlayerWon = "playerRed";
      }
      bulletIsTravelling = false;
      gameOver(whichPlayerWon);
      clearInterval(interval);
      // console.log(finalBulletPosition);
      nodeList[finalBulletPosition].removeChild(bulletImageInUse);
      bulletPath = [];
      return;
    }
    if (bulletPath[0] == -2) {
      bulletIsTravelling = false;
      destroyThesRech("redsRech");
      clearInterval(interval);
      nodeList[finalBulletPosition].removeChild(bulletImageInUse);

      return;
    }
    if (bulletPath[0] == -3) {
      bulletIsTravelling = false;
      destroyThesRech("bluesRech");
      clearInterval(interval);
      nodeList[finalBulletPosition].removeChild(bulletImageInUse);
      return;
    }
    let bulletDirectionForcomp = bulletDirectionArray[0];
    if (bulletDirectionForcomp == "up") {
      bulletUp.classList.add("bulletAnimationCommon");
      bulletUp.classList.add("animationUp");
      nodeList[bulletPath[0]].appendChild(bulletUp);
      bulletImageInUse = bulletUp;
    } else if (bulletDirectionForcomp == "left") {
      bulletLeft.classList.add("bulletAnimationCommon");
      bulletLeft.classList.add("animationLeft");
      nodeList[bulletPath[0]].appendChild(bulletLeft);
      bulletImageInUse = bulletLeft;
    } else if (bulletDirectionForcomp == "down") {
      bulletDown.classList.add("bulletAnimationCommon");
      bulletDown.classList.add("animationDown");
      nodeList[bulletPath[0]].appendChild(bulletDown);
      bulletImageInUse = bulletDown;
    } else if (bulletDirectionForcomp == "right") {
      bulletRight.classList.add("bulletAnimationCommon");
      bulletRight.classList.add("animationRight");
      nodeList[bulletPath[0]].appendChild(bulletRight);
      bulletImageInUse = bulletRight;
    }
    try {
      if (nodeList[bulletPath[0]].classList.contains("piece")) {
        nodeList[bulletPath[0]].removeChild(bulletImageInUse);
        // console.log(nodeList[0].children);
      }
    } catch (error) {
      // console.log(error);
    }
    bulletDirectionArray.shift();
    bulletPath.shift();
  }, 200);
  const canonAudio = new Audio("Canon.mp3");
  canonAudio.play();
}
function createResetResumeDiv() {
  pauseMenu.appendChild(resetButton);
  pauseMenu.appendChild(resumeButton);
  pauseMenu.showModal();
}
function pauseTheGame() {
  if (playerBlueTimer.isRunning) {
    playerBlueTimer.pause();
  }
  if (playerRedTimer.isRunning) {
    playerRedTimer.pause();
  }

  gameIsPaused = true;
  createResetResumeDiv();
}

function resumeTheGame() {
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
  pauseMenu.close();
  firstSetUp();
  console.log("removed");
  pauseMenu.classList.add("hide");
  endGameProcedures();
}
function undo() {
  try {
    shouldHistoryBeCleared = true;
    let index = movesHistory.length - 1 - numberOfReplaySteps;
    if (index < 0) {
      alert("NO FURTHER UNDOS");
      return;
    }

    const positions = movesHistory[index];
    let piece = positions.piece;
    if (positions.action == "swap") {
      let swappingPieceOneInfo = positions.swappingPieceOneInfo;
      let swappingPieceTwoInfo = positions.swappingPieceTwoInfo;
      removeThePiece(
        swappingPieceTwoInfo.initialPosition,
        swappingPieceOneInfo.swappingRechDomElement
      );
      removeThePiece(
        swappingPieceOneInfo.initialPosition,
        swappingPieceTwoInfo.selectedPieceDomElement
      );
      placeThePiece(
        swappingPieceOneInfo.initialPosition,
        swappingPieceOneInfo.swappingRechDomElement,
        swappingPieceOneInfo.swappingRech
      );
      placeThePiece(
        swappingPieceTwoInfo.initialPosition,
        swappingPieceTwoInfo.selectedPieceDomElement,
        swappingPieceTwoInfo.swappingPiece
      );
      numberOfReplaySteps++;
      updateMovesBoard(false);
    } else if (positions.action == "movement") {
      let initialPosition = positions.initialPosition;
      let finalPosition = positions.finalPosition;
      numberOfReplaySteps++;
      moveThePiece(finalPosition, initialPosition, piece, true);
    } else if (positions.destroyedSrech) {
      const destroyedPiece = positions.piece;
      const comparingObject = movesHistory[index - 1];
      pieceState[destroyedPiece]["isdestroyed"] = false;
      let domElementRequired = positions.destroyedDomElement;
      let reqPiece = positions.destroyedPiece;
      if (comparingObject.piece != destroyedPiece) {
        placeThePiece(
          positions.positionWhereDestroyed,
          domElementRequired,
          reqPiece
        );
        occupiedPositions.push(positions.positionWhereDestroyed);
        positions.destroyedSrech = false;
        numberOfReplaySteps++;
        return;
      }
      numberOfReplaySteps++;
      let index5 = movesHistory.length - 1 - numberOfReplaySteps;
      positions.destroyedSrech = false;
      numberOfReplaySteps++;
      let positions2 = movesHistory[index5];

      let initialPosition2 = positions2.initialPosition;
      placeThePiece(initialPosition2, domElementRequired, reqPiece);
      occupiedPositions.push(positions2.initialPosition);
    } else if (positions.action == "rotation") {
      let rotation = positions.initialOrientation;
      rotateThepiece(piece, rotation, true);
      numberOfReplaySteps++;
    }
    hasUndone = true;
    switchTheTurn();
    updateMovesBoard(false);
  } catch (e) {
    underReplayFstsetup = false;
    alert("No further Undos !!!");
    console.log(e);
  }
}

function redo() {
  try {
    if (!hasUndone) {
      alert("No Redo steps Are Possible");
      return;
    }
    numberOfReplaySteps--;
    let index = movesHistory.length - 1 - numberOfReplaySteps;
    if (index > movesHistory.length - 1) {
      numberOfReplaySteps = 0;
      alert("NO FURTHER REDOS POSSIBLE!!");
      return;
    }
    shouldHistoryBeCleared = true;

    const positions = movesHistory[index];
    let piece = positions.piece;
    if (positions.action == "swap") {
      // console.log(movesHistory);
      let swappingPieceOneInfo = positions.swappingPieceOneInfo;
      let swappingPieceTwoInfo = positions.swappingPieceTwoInfo;
      removeThePiece(
        swappingPieceOneInfo.initialPosition,
        swappingPieceOneInfo.swappingRechDomElement
      );
      removeThePiece(
        swappingPieceTwoInfo.initialPosition,
        swappingPieceTwoInfo.selectedPieceDomElement
      );
      placeThePiece(
        swappingPieceTwoInfo.initialPosition,
        swappingPieceOneInfo.swappingRechDomElement,
        swappingPieceOneInfo.swappingRech
      );
      placeThePiece(
        swappingPieceOneInfo.initialPosition,
        swappingPieceTwoInfo.selectedPieceDomElement,
        swappingPieceTwoInfo.swappingPiece
      );
    } else if (positions.action == "movement") {
      let initialPosition = positions.initialPosition;
      let finalPosition = positions.finalPosition;
      moveThePiece(initialPosition, finalPosition, piece, true);
    } else if (positions.action == "destroyed") {
      let positionWhereDestroyed = positions.positionWhereDestroyed;
      let piece = positions.piece;
      let index4 = occupiedPositions.indexOf(positionWhereDestroyed);
      occupiedPositions.splice(index4, 2);

      let domElementRequired = positions.destroyedDomElement;
      removeThePiece(positionWhereDestroyed, domElementRequired);
      positions.destroyedSrech = true;
      pieceState[piece]["isdestroyed"] = true;
      numberOfReplaySteps--;
    } else {
      let rotation = positions.finalOrientation;
      rotateThepiece(piece, rotation, true);
    }
    hasUndone = true;
    switchTheTurn();
    updateMovesBoard(false);
  } catch (e) {
    let index = movesHistory.length - 1 - numberOfReplaySteps;
    alert("No further Undos !!!");
    console.log(index);
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
      if (key == "redsRech" || key == "bluesRech") {
        if (pieceState[key].isdestroyed) {
          continue;
        }
      }
      console.log(pieceState[key]["domElement"]);
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
  let index2 = occupiedPositions.indexOf(exPosition1);
  occupiedPositions.splice(index2, 1);
  occupiedPositions.push(exPosition2);
  moveThePiece(exPosition2, exPosition1, selectedPieceForSwap, true);
  placeThePiece(exPosition2, swappingRechPiece, swappingRech);
  removeTheHighlight();
  shootTheBullet();
  if (!fromUndo) {
    let moveObject = {};
    moveObject.action = "swap";
    moveObject.swappingPieceOneInfo = {
      swappingRech: swappingRech,
      initialPosition: exPosition1,
      swappingRechDomElement: swappingRechPiece,
    };
    moveObject.swappingPieceTwoInfo = {
      swappingPiece: selectedPieceForSwap,
      initialPosition: exPosition2,
      selectedPieceDomElement: pieceState[selectedPieceForSwap]["domElement"],
    };
    moveObject.player = whichPlayerTurn;
    moveObject.moveNumber = moveNumber;
    movesHistory.push(moveObject);
    moveNumber++;
    updateMovesBoard(true);
    switchTheTurn();
    removeTheButtons();
  }
  console.log(occupiedPositions);
  console.log(pieceState);
}

makeThePieces();

function processTheSpell(response) {
  let res = response.toLowerCase();
  if (res == "hardertank") {
    spellCount[whichPlayerTurn]["hardertank"]++;
    const pieceHard = whichPlayerTurn + "Tank";
    pieceState[pieceHard]["isHard"] = true;
    alert("Harder " + pieceHard);
  }
  if (res == "addtime") {
    if (whichPlayerTurn == "red") {
      if (playerRedTimer.numberOfIncrement > 2) {
        alert("No more time can be added");
        return;
      }
      playerRedTimer.remainingTime+=60;
      playerRedTimer.numberOfIncrement++;
      spellCount["red"]["addtime"]++;          
    }
    else{
      if (playerBlueTimer.numberOfIncrement > 2) {
        alert("No more time can be added");
        return;
      }
      playerBlueTimer.remainingTime+=60
      playerBlueTimer.numberOfIncrement++;
      spellCount["blue"]["addtime"]++;          
    }
  }
  if (res == "longlivetitan") {
    const piece = whichPlayerTurn + "Titan";
    console.log(pieceState[piece]["numbrOfTimesMadeStrong"]);
    if (spellCount[whichPlayerTurn]["longlivetitan"] > 2) {
      alert("YOU HAVE EXHAUSTED THIS SPELL")
      return;
    }
    pieceState[piece]["isStronger"] = true;
    spellCount[whichPlayerTurn]["longlivetitan"]++;
    alert("Stronger " + piece);
  }
}
