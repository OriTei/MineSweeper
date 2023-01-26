'use strict'

var mineSound = new Audio('sounds/bombSound.mp3');

function DisplayAllMines() {
    for (var i = 0; i < gMines.length; i++) {
        var pos = gMines[i].pos;
        var elMine = document.querySelector(`.cell-${pos.i}-${pos.j}`);
        elMine.classList.add('mine');
        renderMine(elMine)
    }
}

// end game if the player clicked on a mine 
function onMineClicked(elCell) {
    elCell.classList.add('mine', 'selected');
    mineSound.play();
    gLevel.LIVES--;
    renderMine(elCell)
    if (gLevel.LIVES === 0) {
        stopTimer()
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
        gGame.shownCount--;
        elCurrPos.classList.remove('selected');
        gMines.push(board[currPos.i][currPos.j]);
    }
    setMinesNegsCount(board)
}

// returns a free pos for mines
function getFreePos(board, elCell) {
    debugger
    var clickedCell = board[elCell.dataset.i][elCell.dataset.j];
    var randI = getRandomIntInclusive(0, board.length - 1)
    var randJ = getRandomIntInclusive(0, board.length - 1)
    var resCell = board[randI][randJ]
    // while the random position is the same as the clicked cell or as another mine keep looking for free pos
    while ((clickedCell.pos.i === resCell.pos.i && clickedCell.pos.j === resCell.pos.j) || resCell.isMine) {
        var randI = getRandomIntInclusive(0, board.length - 1);
        var randJ = getRandomIntInclusive(0, board.length - 1);
        resCell = board[randI][randJ]
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

function renderMine(elMine) {
    elMine.innerHTML = MINE_IMG;
}