'use strict'

const LIVES = 3

// Global Variables
var gLevel = getLevel();
var gGame
var gBoard
var gBoardSize
var gMines
var gIsFirstClick

// when page load start the game 
function onInit() {
    gIsFirstClick = true;
    gGame = getGameState()
    gBoard = buildBoard()
    renderBoard(gBoard)
    updateScore()
    updateLife()
}


// returns the board size and how many mines to set in the board
function getLevel(elLevel) {
    var level = {
        SIZE: 4, // change to radio button pick
        MINES: 2,
    }
    return level
}

// returns the current gameState
function getGameState() {
    var gameState = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3
    }
    return gameState
}

// builds the game data model board 
function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = getCell(i, j);
        }
    }
    gBoardSize = gLevel.SIZE * gLevel.SIZE;
    return board
}


function getCell(cellI, cellJ) {
    var cell = {
        pos: {
            i: cellI,
            j: cellJ,
        },
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
    }
    return cell
}

// function DisplayAllMines() {
//     for (var i = 0; i < gMines.length; i++) {
//         var pos = gMines[i].pos;
//         var elMine = document.querySelector(`.cell-${pos.i}-${pos.j}`);
//         elMine.classList.add('mine');
//     }
// }

// // end game if the player clicked on a mine 
// function onMineClicked(elCell) {
//     elCell.classList.add('mine', 'selected');
//     mineSound.play();
//     gGame.lives--;
//     if (gGame.lives === 0) {
//         DisplayAllMines();
//         gGame.isOn = false;
//     }
// }

// // set the mines on board
// function setBoardMines(board, elCell) {
//     gMines = [];
//     for (var i = 0; i < gLevel.MINES; i++) {
//         var currPos = getFreePos(board, elCell);
//         var elCurrPos = document.querySelector(`.cell-${currPos.i}-${currPos.j}`);
//         board[currPos.i][currPos.j].isMine = true;
//         board[currPos.i][currPos.j].isShown = false;
//         board[currPos.i][currPos.j].shownCount--;
//         elCurrPos.classList.remove('selected');
//         gMines.push(board[currPos.i][currPos.j]);
//     }
//     setMinesNegsCount(board)
// }

// // returns a free pos for mines
// function getFreePos(board, elCell) {
//     var clickedCell = board[elCell.dataset.i][elCell.dataset.j];
//     var randI = getRandomIntInclusive(0, board.length - 1)
//     var randJ = getRandomIntInclusive(0, board.length - 1)
//     // while the random position is the same as the clicked cell keep looking for free pos
//     while (clickedCell.pos.i === board[randI][randJ].pos.i && clickedCell.pos.j === board[randI][randJ].pos.j) {
//         var randI = getRandomIntInclusive(0, board.length - 1);
//         var randJ = getRandomIntInclusive(0, board.length - 1);
//     }
//     return { i: randI, j: randJ };
// }

// // sets mineAroundCount for each cell in the board
// function setMinesNegsCount(board) {
//     for (var i = 0; i < board.length; i++) {
//         for (var j = 0; j < board.length; j++) {
//             var currCell = board[i][j]
//             setCellMineNegs(currCell, board)
//         }
//     }
// }

// // sets how many mines are around each cell
// function setCellMineNegs(cell, board) {
//     var negsCounter = 0;
//     for (var i = cell.pos.i - 1; i <= cell.pos.i + 1; i++) {
//         if (i < 0 || i >= board.length) continue
//         for (var j = cell.pos.j - 1; j <= cell.pos.j + 1; j++) {
//             if (j < 0 || j >= board.length) continue
//             if (i === cell.pos.i && j === cell.pos.j) continue
//             if (board[i][j].isMine) cell.minesAroundCount++
//         }
//     }
// }

// renders the board in DOM
function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < gBoard.length; j++) {
            const currCell = gBoard[i][j]
            var cellClass = getClassName(currCell, i, j) + ' '
            strHTML += `<td class="cell ${cellClass}" data-i="${i}" data-j="${j}" 
            oncontextmenu="onCellMarked(this)" onclick="onCellClicked(this)">`
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

// return cell's position class 
function getClassName(currCell, i, j) {
    var cellClass = `cell-${i}-${j}`
    return cellClass
}


// when a cell is clicked function 
function onCellClicked(elCell) {
    var currCell = gBoard[elCell.dataset.i][elCell.dataset.j]
    if (currCell.isMarked || currCell.isShown) return;
    if (gIsFirstClick) {
        gIsFirstClick = false;
        gGame.isOn = true;
        setBoardMines(gBoard, elCell);
        onEmptyClicked(elCell, currCell);
    }
    if (!currCell.isMine) onEmptyClicked(elCell, currCell);
    else onMineClicked(elCell);
    updateLife();
    updateScore();
    checkGameOver();
}

// when the user clicks on a regular cell expand his non mine negs
function onEmptyClicked(elCell, cell) {
    elCell.classList.add('selected');
    cell.isShown = true;
    gGame.shownCount++;
    expandShown(gBoard, cell);
}


// we need to open not only that cell, but also its neighbors.
function expandShown(board, cell) {
    for (var i = cell.pos.i - 1; i <= cell.pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cell.pos.j - 1; j <= cell.pos.j + 1; j++) {
            if (j < 0 || j >= board.length) continue
            var currCell = board[i][j]
            var currElCell = document.querySelector(`.cell-${i}-${j}`);
            if (currCell.isMarked || currCell.isShown) continue;
            if (currCell.isMine || i === cell.pos.i && j === cell.pos.j) continue
            if (currCell.minesAroundCount !== 0 && !currCell.isShown) currElCell.innerText = currCell.minesAroundCount;
            currElCell.classList.add('selected');
            currCell.isShown = true;
            gGame.shownCount++
        }
    }
}

// called when a cell is right clicked, adds a mark to the cell
function onCellMarked(elCell) {
    var cell = gBoard[elCell.dataset.i][elCell.dataset.j];
    gGame.markedCount++;
    cell.isMarked = true;
    if (elCell.classList.contains('selected')) return;
    document.addEventListener('contextmenu', (event) => { event.preventDefault(); });
    elCell.classList.toggle('marked');
}

// if all mines are marked and shown count is boardcells - mines
function checkGameOver() {
    if (gBoardSize - gLevel.MINES === gGame.shownCount) {
        console.log('game won!');
    }
    else if (gGame.lives === 0) {
        console.log('game-over');
    }
}


// resets the board for a new game
function cleanBoard() {
    var elTds = document.querySelectorAll('.selected')
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mine', 'selected', 'marked')
    }

}

function updateLife() {
    var elLives = document.querySelector('.lives span');
    elLives.innerText = ' ' + gGame.lives;
}

function updateScore() {
    var elScore = document.querySelector('.score span');
    elScore.innerText = ' ' + gGame.shownCount;
}

function resetGame() {
    cleanBoard();
    gGame.lives = LIVES;
    onInit();
}


function setDifficulty(elDiffBtn) {
    var gameMode = elDiffBtn.value;
    switch (gameMode) {
        case 'easy':
            gLevel.SIZE = 4
            gLevel.MINES = 3
            resetGame();
            break;
        case 'medium':
            gLevel.SIZE = 8
            gLevel.MINES = 14
            resetGame();
            break;
        case 'hard':
            gLevel.SIZE = 12
            gLevel.MINES = 32
            resetGame();
            break;
    }
}



