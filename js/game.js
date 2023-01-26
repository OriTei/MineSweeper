'use strict'

const LIVES = 3
const LOST_IMG = '<img src="img/game-over.png">\n'
const START_IMG = '<img src="img/game-start.png">\n'
const WIN_IMG = '<img src="img/game-win.png">\n'
const MINE_IMG = '<img src="img/mine.png">\n'
const MARK = '🤔'
const HINT = '💡'
const LIFE = '🤍'
const DEATH = '💀'
const SAFE_CLICK = '✅' 

// Global Variables
var gLevel = getLevel();
var gGame
var gBoard
var gBoardSize
var gMines
var gIsFirstClick
var gBestTime
var gCurrLevel = 'easy'

// when page load start the game 
function onInit() {
    gBestTime = Infinity
    gIsFirstClick = true;
    gGame = getGameState()
    gBoard = buildBoard()
    gGame.isOn = true;
    renderBoard(gBoard)
    renderHints();
    renderSafeClicks();
    updateScore()
    renderLife()
}


// returns the board size and how many mines to set in the board
function getLevel(elLevel) {
    var level = {
        SIZE: 4, // change to radio button pick
        MINES: 3,
        HINTS: 3,
        LIVES: 3,
        SAFE_CLICKS: 3,
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


// renders the board in DOM
function renderBoard() {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < gBoard.length; j++) {
            var cellClass = getClassName(i, j) + ' '
            strHTML += `<td class="cell ${cellClass}"  
            oncontextmenu="onCellMarked(this,${i},${j})" onclick="onCellClicked(this,${i},${j})">`
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    const elBoard = document.querySelector('.board')
    const elResetBtn = document.querySelector('.reset-btn')
    elResetBtn.innerHTML = START_IMG
    elBoard.innerHTML = strHTML
}


function renderPicture(strHTML) {
    const elResetBtn = document.querySelector('.reset-btn')
    elResetBtn.innerHTML = strHTML
}

// return cell's position class 
function getClassName(i, j) {
    var cellClass = `cell-${i}-${j}`
    return cellClass
}


// when a cell is clicked function 
function onCellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (gIsFirstClick) handleFirstClick(elCell, currCell)
    if (currCell.isMarked) return;
    if (currCell.isShown || !gGame.isOn) return;
    if (!currCell.isMine) onEmptyClicked(elCell, currCell);
    else onMineClicked(currCell, i, j);
    updateScore();
    checkGameOver();
}

function handleFirstClick(elCell, currCell) {
    gIsFirstClick = false;
    gGame.isOn = true;
    startTimer();
    setBoardMines(currCell);
    onEmptyClicked(elCell, currCell);
    updateScore();
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
        if (i < 0 || i >= board.length) return
        for (var j = cell.pos.j - 1; j <= cell.pos.j + 1; j++) {
            if (j < 0 || j >= board.length) return
            var currCell = board[i][j]
            var currElCell = document.querySelector(`.cell-${i}-${j}`);
            if (currCell.isMarked || currCell.isShown) continue;
            if (currCell.isMine || i === cell.pos.i && j === cell.pos.j) continue
            if (currCell.minesAroundCount !== 0 && !currCell.isShown) currElCell.innerText = currCell.minesAroundCount;
            currElCell.classList.add('selected');
            currCell.isShown = true;
        }
    }
}

//
// function expandShownAll(board, cell) {
//     debugger
//     for (var i = cell.pos.i - 1; i <= cell.pos.i + 1; i++) {
//         if (i < 0 || i >= board.length) return;
//         for (var j = cell.pos.j - 1; j <= cell.pos.j + 1; j++) {
//             if (j < 0 || j >= board.length) return
//             var currCell = board[i][j]
//             var currElCell = document.querySelector(`.cell-${i}-${j}`);
//             if (currCell.isMarked || currCell.isShown) return;
//             if (currCell.isMine || i === cell.pos.i && j === cell.pos.j) continue
//             if (currCell.minesAroundCount === 0 && !currCell.isShown) expandShownAll(board, currCell);
//             if (currCell.minesAroundCount !== 0 && !currCell.isShown)
//                 currElCell.innerText = currCell.minesAroundCount;
//             currElCell.classList.add('selected');
//             currCell.isShown = true;
//         }
//     }
// }


// function expandShownAll(board, cell) {
//     debugger;
//     for (var i = cell.pos.i - 1; i <= cell.pos.i + 1; i++) {
//         if (i < 0 || i >= board.length) return;
//         for (var j = cell.pos.j - 1; j <= cell.pos.j + 1; j++) {
//             if (j < 0 || j >= board.length) return
//             var currCell = board[i][j]
//             var currElCell = document.querySelector(`.cell-${i}-${j}`);
//             var currMinesAround = currCell.minesAroundCount;
//             if (currMinesAround === 0) expandShownAll(board, currCell)
//             currCell.isShown = true;

//             if (!currCell.isMine) {
//                 currElCell.classList.add('selected')
//                 if(currMinesAround !== 0) currElCell.innerText = currMinesAround;
//             }
//         }
//     }
// }

// called when a cell is right clicked, adds a mark to the cell
function onCellMarked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (elCell.classList.contains('selected') || !gGame.isOn) return
    document.addEventListener('contextmenu', (event) => { event.preventDefault(); })
    elCell.classList.toggle('marked')
    checkMarked()
    renderMark(elCell, cell)
}

function renderMark(elCell, cell) {
    if (elCell.classList.contains('marked')) {
        cell.isMarked = true;
        elCell.innerText = MARK
    }
    else {
        cell.isMarked = false
        elCell.innerText = ''
    }
}

// sets the current marked counter
function checkMarked() {
    var elMarked = document.querySelectorAll('.marked');
    gGame.markedCount = 0;
    for (var i = 0; i < elMarked.length; i++) {
        gGame.markedCount++
    }
}

// if all non-mine spots are shown its a win  
function checkGameOver() {
    if (gBoardSize - gLevel.MINES === gGame.shownCount) {
        gGame.isOn = false;
        renderPicture(WIN_IMG)
        stopTimer()
        setGameTime();
    }
    else if (gLevel.LIVES === 0) {
        gGame.isOn = false
        DisplayAllMines();
        renderPicture(LOST_IMG)
        stopTimer()
    }
}

// resets the board for a new game
function cleanBoard() {
    var elTds = document.querySelectorAll('.selected')
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mine', 'selected', 'marked')
    }
}

function renderLife() {
    var elLives = document.querySelector('.lives span')
    elLives.innerText = LIFE.repeat(gLevel.LIVES)
    if (gLevel.LIVES === 0) elLives.innerText = DEATH
}

function updateScore() {
    gGame.shownCount = 0
    var scoreReduction = 0
    var elSelected = document.querySelectorAll('.selected')
    var elScore = document.querySelector('.score span')
    for (var i = 0; i < elSelected.length; i++) {
        // each mine will reduce one point
        if (elSelected[i].classList.contains('mine')) {
            scoreReduction++
            continue;
        }
        gGame.shownCount++
    }
    elScore.innerText = ' ' + (gGame.shownCount - scoreReduction)
}

function resetLevel() {
    switch (gCurrLevel) {
        case 'easy':
            gLevel.SIZE = 4
            gLevel.MINES = 3
            gLevel.HINTS = 3
            gLevel.LIVES = 3
            gLevel.SAFE_CLICKS = 3
            break
        case 'medium':
            gLevel.SIZE = 8
            gLevel.MINES = 14
            gLevel.HINTS = 5
            gLevel.LIVES = 4
            gLevel.SAFE_CLICKS = 5
            break
        case 'hard':
            gLevel.SIZE = 12
            gLevel.MINES = 20
            gLevel.HINTS = 7
            gLevel.LIVES = 5
            gLevel.SAFE_CLICKS = 8

            break;
    }
}

function resetGame() {
    resetLevel()
    cleanBoard()
    stopTimer()
    resetTimer()
    onInit()
}


function setDifficulty(elDiffBtn) {
    gCurrLevel = elDiffBtn.value;
    resetLevel();
    resetGame();
}

function setDarkMode() {
    var elBody = document.querySelector('body');
    elBody.classList.toggle('dark-mode');
}

