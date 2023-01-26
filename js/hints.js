'use strict'

function renderHints() {
    var elHintBtn = document.querySelector('.hint-btn span');
    elHintBtn.innerText = '💡'.repeat(gLevel.HINTS);
    if (gLevel.HINTS === 0) elHintBtn.innerText = '🆘'
}

function getHint() {
    if (gIsFirstClick || !gGame.isOn)
    {
        alert('cant use hint before first click');
        return;
    }    
    if (gLevel.HINTS === 0) return
    var mine = getHintMine();
    var elMine = document.querySelector(`.cell-${mine.pos.i}-${mine.pos.j}`)
    gLevel.HINTS--;
    renderHints()
    displayHint(elMine);
}

function displayHint(elMine) {
    elMine.classList.add('hint');
    setTimeout(() => {
        elMine.classList.remove('hint');
    }, 2000);
}

function getHintMine() {
    var randIdx = getRandomIntInclusive(0, gMines.length - 1);
    // if its a marked spot or a mine, keep searching for an index
    while (gMines[randIdx].isMarked || gMines[randIdx].isShown) {
        randIdx = getRandomIntInclusive(0, gMines.length - 1);
    }
    return gMines[randIdx]
}


function getSafeClick() {
    debugger;
    if (gLevel.SAFE_CLICKS === 0) return
    var safePos = getSafeClickPos();
    var elSafeClick = document.querySelector(`.cell-${safePos.i}-${safePos.j}`)
    gLevel.SAFE_CLICKS--;
    renderSafeClicks();
    displaySafeClick(elSafeClick);
}

function displaySafeClick(elSafeClick) {
    elSafeClick.classList.add('safe');
    setTimeout(() => {
        elSafeClick.classList.remove('safe');
    }, 2000);
}

function getSafeClickPos() {
    var randI = getRandomIntInclusive(0, gBoard.length - 1)
    var randJ = getRandomIntInclusive(0, gBoard.length - 1)
    debugger;
    while (gBoard[randI][randJ].isMine && !gBoard[randI][randJ].isShown) {
        var randI = getRandomIntInclusive(0, gBoard.length - 1);
        var randJ = getRandomIntInclusive(0, gBoard.length - 1);
        resCell = gBoard[randI][randJ]
    }
    return { i: randI, j: randJ };
}

function renderSafeClicks() {
    var elSafeClick = document.querySelector('.safe-click span');
    elSafeClick.innerText = SAFE_CLICK.repeat(gLevel.SAFE_CLICKS);
    if (gLevel.SAFE_CLICKS === 0) elSafeClick.innerText = '🆘'
}

