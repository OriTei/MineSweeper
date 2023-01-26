'use strict'

var mineSound = new Audio('sounds/bombSound.mp3');

function DisplayAllMines() {
    for (var i = 0; i < gMines.length; i++) {
        var pos = gMines[i].pos;
        var elMine = document.querySelector(`.cell-${pos.i}-${pos.j}`);
        elMine.classList.add('mine');
        renderCell(pos, MINE_IMG)
    }
}

// end game if the player clicked on a mine 
function onMineClicked(currCell) {
    currCell.isShown = true;
    mineSound.play();
    gLevel.LIVES--;
    renderCell(currCell.pos, MINE_IMG)
    var elCell = document.querySelector(`.cell-${currCell.pos.i}-${currCell.pos.j}`)
    elCell.classList.add('mine');
    renderLife();
    checkGameOver();
}

// set the mines on board
function setBoardMines(cell) {
    gMines = [];
    for (var i = 0; i < gLevel.MINES; i++) {
        var currPos = getFreePos(cell);
        var elCurrPos = document.querySelector(`.cell-${cell.pos.i}-${cell.pos.j}`);
        gBoard[currPos.i][currPos.j].isMine = true;
        gBoard[currPos.i][currPos.j].isShown = false;
        gGame.shownCount--;
        elCurrPos.classList.remove('selected');
        gMines.push(gBoard[currPos.i][currPos.j]);
    }
    setMinesNegsCount(gBoard)
}

// returns a free pos for mines
function getFreePos(cell) {
    var randI = getRandomIntInclusive(0, gBoard.length - 1)
    var randJ = getRandomIntInclusive(0, gBoard.length - 1)
    var resCell = gBoard[randI][randJ]
    // while the random position is the same as the clicked cell or as another mine keep looking for free pos
    while ((cell.pos.i === resCell.pos.i && cell.pos.j === resCell.pos.j) || resCell.isMine) {
        var randI = getRandomIntInclusive(0, gBoard.length - 1);
        var randJ = getRandomIntInclusive(0, gBoard.length - 1);
        resCell = gBoard[randI][randJ]
    }
    return { i: randI, j: randJ };
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
    for (var i = cell.pos.i - 1; i <= cell.pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cell.pos.j - 1; j <= cell.pos.j + 1; j++) {
            if (j < 0 || j >= board.length) continue
            if (i === cell.pos.i && j === cell.pos.j) continue
            if (board[i][j].isMine) cell.minesAroundCount++
        }
    }
}

function blowUpMines() {
    debugger;
    if (gIsFirstClick) return;
    while (gMines.length > 0) {
        var currMine = gMines[0];
        currMine.isMine = false;
        var elCurrMine = document.querySelector(`.cell-${currMine.pos.i}-${currMine.pos.j}`)
        elCurrMine.classList.remove('mine')
        gMines.splice(0, 1);
    }

}