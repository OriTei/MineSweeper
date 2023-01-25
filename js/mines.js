'use strict'

var mineSound = new Audio('sounds/bombSound.mp3');

function DisplayAllMines() {
    for (var i = 0; i < gMines.length; i++) {
        var pos = gMines[i].pos;
        var elMine = document.querySelector(`.cell-${pos.i}-${pos.j}`);
        elMine.classList.add('mine');
    }
}

// end game if the player clicked on a mine 
function onMineClicked(elCell) {
    elCell.classList.add('mine', 'selected');
    mineSound.play();
    gGame.lives--;
    if (gGame.lives === 0) {
        DisplayAllMines();
        gGame.isOn = false;
    }
}

// set the mines on board
function setBoardMines(board, elCell) {
    gMines = [];
    for (var i = 0; i < gLevel.MINES; i++) {
        var currPos = getFreePos(board, elCell);
        var elCurrPos = document.querySelector(`.cell-${currPos.i}-${currPos.j}`);
        board[currPos.i][currPos.j].isMine = true;
        board[currPos.i][currPos.j].isShown = false;
        board[currPos.i][currPos.j].shownCount--;
        elCurrPos.classList.remove('selected');
        gMines.push(board[currPos.i][currPos.j]);
    }
    setMinesNegsCount(board)
}

// returns a free pos for mines
function getFreePos(board, elCell) {
    var clickedCell = board[elCell.dataset.i][elCell.dataset.j];
    var randI = getRandomIntInclusive(0, board.length - 1)
    var randJ = getRandomIntInclusive(0, board.length - 1)
    // while the random position is the same as the clicked cell keep looking for free pos
    while (clickedCell.pos.i === board[randI][randJ].pos.i && clickedCell.pos.j === board[randI][randJ].pos.j) {
        var randI = getRandomIntInclusive(0, board.length - 1);
        var randJ = getRandomIntInclusive(0, board.length - 1);
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