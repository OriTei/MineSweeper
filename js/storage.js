'use strict'
var gPromptInterval

// sets the best game time on screen and updates it in storage. 
function setGameTime() {
    var pName = prompt('Enter players name:');
    var elBestTime = document.querySelector('.best-time span');
    var bestTime = Math.min(gBestTime, gGame.secsPassed);
    setLocalStorage(pName,bestTime)
    elBestTime.innerText = ' ' + bestTime + 's';
}

// enters the score to local storage
function setLocalStorage(name, score) {
    localStorage.setItem(name,score);
}
