"use strict";
/* create the gameBoard Object with a module
*/
const gameBoard = (() => {

    let gameBoardDisplay = document.getElementById('game');

    let gameBoardArray = ['', '', '', '', '', '', '', '', '']; // the array is looped over to create the html

    const clearGameBoard = function () {

        this.gameBoardArray = ['', '', '', '', '', '', '', '', ''];
    };

    // to add the player's mark in the gameBoardArray
    const update = function (position, currentPlayer) {
        this.gameBoardArray.splice(position, 1, currentPlayer.mark)
    };

    // create the html to be displayed on the webpage
    const createGameBoard = function () {
        let gridGameBoard = '';

        for (let i = 0; i < this.gameBoardArray.length; i++) {

            if (this.gameBoardArray[i] === '') {

                gridGameBoard += `<div id='${i}' class='notPlayed playBox'>${this.gameBoardArray[i]}</div>`;

            } else gridGameBoard += `<div id='${i}' class='played playBox'>${this.gameBoardArray[i]}</div>`;

        }
        return gameBoardDisplay.innerHTML = gridGameBoard;

    };

    return { gameBoardArray, createGameBoard, update, clearGameBoard };
})();

// create the players with a factory
// we keep track of the player's moves
const Player = (name, mark) => {

    let spotPlayed = [];

    const clearPlayer = function () {
        this.spotPlayed = [];
    };

    const play = function (id) {
        this.spotPlayed.push(id);
        console.log(this.spotPlayed);
    };

    return { name, mark, spotPlayed, play, clearPlayer };
};

// Creation of two players with names


let player1 = Player('Player 1', '<i class="fas fa-times"></i>');
let player2 = Player('Player 2', '<i class="far fa-circle"></i>');

// create the displayController with a module
// this is going to control the all game
const displayController = (() => {
    let currentPlayer = player1;
    let winner = null;
    let winningLine = null;
    let gameFinished = false;
    let gameStarted = false;

    // check for a winner by checking each turn if the current player made a winning move
    // by checking the 'spotPlayed' against the winning combinations. If any winning combination
    // is contained in the player's 'spotPlayed' then he is the winner
    const checkForAWinner = function () {

        let winningCombinations = [['0', '1', '2'], ['3', '4', '5'], ['6', '7', '8'], ['0', '3', '6'], ['1', '4', '7'], ['2', '5', '8'], ['0', '4', '8'], ['2', '4', '6']];

        for (let i = 0; i < winningCombinations.length; i++) {
            if (winningCombinations[i].every(elem => currentPlayer.spotPlayed.indexOf(elem) > -1)) {

                winner = currentPlayer;
                winningLine = winningCombinations[i]; // return the winning line to then hilight it
                return true;
            }
        }
    };
    // to change from one player to another
    const setPlayer = function () {

        if (gameStarted) {
            return currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;

        } else {
            document.getElementById('addPlayer1').classList.toggle('no-display');
            document.getElementById('addPlayer2').classList.toggle('no-display');

            document.getElementById('names-display').style.opacity = '0';
            return (currentPlayer = player1, gameStarted = true);
        };
    };

    const announceNextPlayer = function () {
        let nextPlayerDisplay = document.getElementById('result');
        currentPlayer === player1 ? nextPlayerDisplay.textContent = `${player2.name}'s turn` : nextPlayerDisplay.textContent = `${player1.name}'s turn`;
    };

    // to add the eventListeners only to the spots that are not played yet
    // thus a player can't play on an already played spot
    const printGame = function () {

        gameBoard.createGameBoard();
        if (!gameStarted) document.getElementById('result').textContent = `${currentPlayer.name} starts!`;

        let spotsToPlay = document.querySelectorAll('.notPlayed');

        spotsToPlay.forEach(spot => spot.addEventListener('click', e => {

            displayController.playGame(e);

        }));

    };

    const playGame = function (event) {

        if (!gameFinished) {
            document.getElementById('startGame').classList.remove('hidden');
            setPlayer(); // select current player
            if (gameStarted) {
                document.getElementById('startGame').innerHTML = '<i class="far fa-trash-alt"></i>';
            }

            gameBoard.update(event.target.id, currentPlayer); // update of the gameBoard
            currentPlayer.play(event.target.id); // keep track of this player's move
            printGame(); // display the game on the webpage

            if (checkForAWinner()) { // check for a winner each turn


                for (let i = 0; i < winningLine.length; i++) {

                    document.getElementById(winningLine[i]).classList.toggle('winningLine'); // put the background of the winning line in red
                }

                document.getElementById('result').textContent = `${currentPlayer.name} WON!`; // congratulate the winner
                document.getElementById('result').style.color = '#fae596';

                gameFinished = true;
                document.getElementById('startGame').innerHTML = '<i class="fas fa-sync-alt"></i>';
                document.getElementById('startGame').style.color = '#fae596';
            };

            if (!gameFinished) announceNextPlayer();
            if (!gameFinished && !gameBoard.gameBoardArray.includes('')) document.getElementById('result').textContent = "It's a Tie!";
        };
    };

    // to start a new game and clear everything
    const clearGame = () => {
        player1.clearPlayer();
        player2.clearPlayer();
        gameBoard.clearGameBoard();

        winner = null;
        gameFinished = false;
        gameStarted = false;
        winningLine = null;

        document.getElementById('result').textContent = `${player1.name} starts!`;
        document.getElementById('result').style.color = '#dddfd4';
        document.getElementById('startGame').classList.add('hidden');
        document.getElementById('startGame').style.color = '#dddfd4';

        document.getElementById('names-display').classList.toggle('no-display');

        document.getElementById('addPlayer1').classList.toggle('no-display');
        document.getElementById('addPlayer2').classList.toggle('no-display');

        document.getElementById('names-display').style.opacity = '1';

        printGame();
    };


    return { playGame, printGame, clearGame };
})();


// Public stuff

// add player and toggle the buttons to edit or add a new one in the same place
function addPlayer() {

    if (event.target.parentElement.id == 'addPlayer1') {

        if (event.target.parentElement.getAttribute('data-state') == 'name') {
            document.getElementById('container-player1').innerHTML = `<input id='player1' type='text' name='player1' placeholder="Player1" value='Player1'>`;
            document.getElementById('addPlayer1').setAttribute('data-state', 'input');
            document.getElementById('addPlayer1').innerHTML = '<i class="fas fa-user-plus"></i>';

        } else {
            let name = document.getElementById('player1').value;
            player1 = Player(name, '<i class="fas fa-times"></i>');
            document.getElementById('result').textContent = `${player1.name} starts!`;

            document.getElementById('addPlayer1').setAttribute('data-state', 'name');
            document.getElementById('addPlayer1').innerHTML = '<i class="fas fa-pencil-alt"></i>';
            document.getElementById('container-player1').textContent = `${player1.name}`;

        }

    } else {
        
        if (event.target.parentElement.getAttribute('data-state') == 'name') {
            document.getElementById('container-player2').innerHTML = `<input id='player2' type='text' name='player2' placeholder='Player2' value='Player2'>`;
            document.getElementById('addPlayer2').setAttribute('data-state', 'input');
            document.getElementById('addPlayer2').innerHTML = '<i class="fas fa-user-plus"></i>';

        } else {
            let name = document.getElementById('player2').value;
            player2 = Player(name, '<i class="far fa-circle"></i>');

            document.getElementById('addPlayer2').setAttribute('data-state', 'name');
            document.getElementById('addPlayer2').innerHTML = '<i class="fas fa-pencil-alt"></i>';
            document.getElementById('container-player2').textContent = `${player2.name}`;

        }
    }

};

let makeSquare = function () {
    let widthScreen = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

    document.documentElement.style.setProperty('--width', `${widthScreen > 400 ? 360 : 0.8 * widthScreen}px`);
    document.documentElement.style.setProperty('--fontSize', `${widthScreen > 400 ? 60 : Math.floor(0.13 * widthScreen)}px`);
};

window.addEventListener('resize', makeSquare, true);

makeSquare();

displayController.printGame();


// Artificial Intelligence: Super Computer
/*
const scoreGame = function(gameBoardTested) {

    if (checkForAWinner(gameBoardTested) && winner == player2) return 10;
    else if (checkForAWinner(gameBoardTested) && winner != player2) return -10;
    else return 0;

}

const getPossibleMoves = function(gameBoard) {

    let possibleMoves = [];
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] == '') possibleMoves.push(i);
    }
    return possibleMoves;
}

const miniMaxCurrentPlayer = player1;


const miniMax = function(gameBoardTested) {

    if (checkForAWinner(gameBoardTested)) return scoreGame(gameBoardTested);

    //miniMaxCurrentPlayer == player2 ? miniMaxCurrentPlayer = player1;
    miniMaxCurrentPlayer == player1 ? miniMaxCurrentPlayer = player2 : player1;
    let movesPlayed = miniMaxCurrentPlayer.spotPlayed;
    let scores = [];
    let moves = [];

    getPossibleMoves(gameBoardTested).forEach(move => {
        possibleGame = gameBoardTested.splice(move, 1, miniMaxCurrentPlayer.mark);
        movesPlayed = movesPlayed.push(move);

 
    })

    // Do the min or the max calculation
    
};


const checkItBaby = function() {

    if (count >6) return console.log('finished');

    baby == 'bateau' ? baby = 'voiture' : baby = 'bateau';
    console.log(baby);
    count++;
    checkItBaby();
    console.log('finished');
};

const controlBaby = function() {
    let baby = 'bateau';
    let count = 0;

    checkItBaby();
};
*/