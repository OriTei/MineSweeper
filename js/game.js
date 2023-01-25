'use strict'

const MINE = '💣'
const EMPTY = ''

// Global Variables
var gLevel = getLevel();
var gGame
var gBoard
var gBoardSize
var gMines
var gIsFirstClick

// when page load start the game 
function onInit() {
    gGame = getGameState()
    gBoard = buildBoard()
    renderBoard(gBoard)
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
        life: 3
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
    setBoardMines(board)
    setMinesNegsCount(board)
    return board
}

function setBoardMines(board) {
    // later change to random
    gMines = [];
    board[0][0].isMine = true;
    board[2][2].isMine = true;
    gMines.push(board[0][0], board[2][2]);
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

// sets mineAroundCount for each cell in the board
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            setCellMineNegs(currCell, board)
        }
    }
}

// sets how many mines are around each cell
function setCellMineNegs(cell, board) {
    var negsCounter = 0;
    for (var i = cell.pos.i - 1; i <= cell.pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cell.pos.j - 1; j <= cell.pos.j + 1; j++) {
            if (j < 0 || j >= board.length) continue
            if (i === cell.pos.i && j === cell.pos.j) continue
            if (board[i][j].isMine) cell.minesAroundCount++
        }
    }
}

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
    if (!gGame.isOn) {
        gGame.isOn = true;  
    } 
    if (!currCell.isMine) onEmptyClicked(elCell, currCell);
    else onMineClicked(elCell);
    checkGameOver();
}

function onEmptyClicked(elCell, cell) {
    elCell.classList.add('selected');
    cell.isMarked = true;
    gGame.shownCount++;
    expandShown(gBoard, cell);
}

// end game if the player clicked on a mine 
function onMineClicked(elCell) {
    elCell.classList.add('mine', 'selected');
    mineSound.play();
    gGame.isOn = false
    DisplayAllMines();
}

// we need to open not only that cell, but also its neighbors.
function expandShown(board, cell) {
    for (var i = cell.pos.i - 1; i <= cell.pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cell.pos.j - 1; j <= cell.pos.j + 1; j++) {
            if (j < 0 || j >= board.length) continue
            var currCell = board[i][j]
            var currElCell = document.querySelector(`.cell-${i}-${j}`);
            if (currCell.isMine || i === cell.pos.i && j === cell.pos.j) continue
            if (currCell.minesAroundCount !== 0) currElCell.innerText = currCell.minesAroundCount;
            if (currElCell.classList.contains('selected')) continue;
            currElCell.classList.add('selected');
            gGame.shownCount++
        }
    }
}


// called when a cell is right clicked, adds a mark to the cell
function onCellMarked(elCell) {
    var currCell = gBoard[elCell.dataset.i][elCell.dataset.j]
    gGame.markedCount++;
    if (elCell.classList.contains('selected')) return;
    document.addEventListener('contextmenu', (event) => { event.preventDefault(); });
    elCell.classList.toggle('marked');
}

// if all mines are marked and shown count is boardcells - mines
function checkGameOver() {
    if (gBoardSize - gLevel.MINES === gGame.shownCount)
        console.log('game won!');
    else return; 
}


// resets the board for a new game
function cleanBoard() {
    var elSelectedTds = document.querySelectorAll('.selected')
    var elMarkedTds = document.querySelectorAll('.marked')
    for (var i = 0; i < elSelectedTds.length; i++) {
        elSelectedTds[i].classList.remove('mine', 'selected')
    }
    for (var i = 0; i < elMarkedTds.length; i++) {
        elMarkedTds[i].classList.remove('marked')
    }
}

function resetGame() {
    cleanBoard();
    onInit();
}


function setDifficulty(elDiffBtn) {
    var gameMode = elDiffBtn.value;
    switch (gameMode) {
        case 'easy':
            gLevel.SIZE = 4
            gLevel.MINES = 2
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

function DisplayAllMines() {
    
    for (var i = 0; i < gMines.length; i++){
        var pos = gMines[i].pos; 
        var elMine = document.querySelector(`.cell-${pos.i}-${pos.j}`);
        elMine.classList.add('mine');
    }
}