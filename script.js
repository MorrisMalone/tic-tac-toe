"use strict";
/* create the gameBoard Object with a module
*/
const gameBoard = (() => {

    let gameBoardDisplay = document.getElementById('game');

    let gameBoardArray = ['', '', '', '', '', '', '', '', '']; // the array is looped over to create the html

    const clearGameBoard = function() {
        
        this.gameBoardArray = ['', '', '', '', '', '', '', '', ''];
    };

    // to add the player's mark in the gameBoardArray
    const update = function(position, currentPlayer) {
        this.gameBoardArray.splice(position, 1, currentPlayer.mark)
    };

    // create the html to be displayed on the webpage
    const createGameBoard = function() {
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

    const clearPlayer = function() {
        this.spotPlayed = [];
    };

    const play = function(id) {
        this.spotPlayed.push(id);
        console.log(this.spotPlayed);
    };

    return { name, mark, spotPlayed, play, clearPlayer };
};

// Creation of two players with names


let player1 = Player('Player 1', 'X');
let player2 = Player('Player 2', 'O');

// create the displayController with a module
// this is going to control the all game
const displayController = (() => {
    let currentPlayer = null;
    let winner = null;
    let winningLine = null;
    let gameFinished = false;
    let gameStarted = false;

    // check for a winner by checking each turn if the current player made a winning move
    // by checking the 'spotPlayed' against the winning combinations. If any winning combination
    // is contained in the player's 'spotPlayed' then he is the winner
    const checkForAWinner = function() {

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
    const setPlayer = function() {

        if (gameStarted) {

            return currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;

        } else return (currentPlayer = player1, gameStarted = true);
    };

    const announceNextPlayer = function() {
        let nextPlayerDisplay = document.getElementById('result');
        currentPlayer === player1 ? nextPlayerDisplay.textContent = `${player2.name}'s turn` : nextPlayerDisplay.textContent = `${player1.name}'s turn`;
    };

    // to add the eventListeners only to the spots that are not played yet
    // thus a player can't play on an already played spot
    const printGame = function() {

        gameBoard.createGameBoard();
        let spotsToPlay = document.querySelectorAll('.notPlayed');

        spotsToPlay.forEach(spot => spot.addEventListener('click', e => {

            displayController.playGame(e);

        }));

    };

    const playGame = function(event) {

        if (!gameFinished) {

            setPlayer(); // select current player

            gameBoard.update(event.target.id, currentPlayer); // update of the gameBoard

            currentPlayer.play(event.target.id); // keep track of this player's move
            printGame(); // display the game on the webpage

            

            if (checkForAWinner()) { // check for a winner each turn

                for (let i = 0; i < winningLine.length; i++) {

                    document.getElementById(winningLine[i]).classList.toggle('winningLine'); // put the background of the winning line in red
                }

                document.getElementById('result').textContent = `${currentPlayer.name} WON!`; // congratulate the winner

                gameFinished = true;
            };

            if (!gameFinished) announceNextPlayer();
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

        document.getElementById('result').textContent = '';
        printGame();
    };


    return { playGame, printGame, clearGame };
})();


// Public stuff

function addPlayer() {

    if (event.target.id == 'addPlayer1') {
        let name = document.getElementById('player1').value;
        player1 = Player(name, 'X');

    } else {
        let name = document.getElementById('player2').value;
        player2 = Player(name, 'O');
    }
}

// functions to find a place for

displayController.printGame();


