'use strict'

function renderHints() {
    var elHintBtn = document.querySelector('.hint-btn span');
    elHintBtn.innerText = '💡'.repeat(gLevel.HINTS);
    if (gLevel.HINTS === 0) elHintBtn.innerText = 'No Hints Left'
}

function getHint() {
    if (gIsFirstClick || !gGame.isOn) return;
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