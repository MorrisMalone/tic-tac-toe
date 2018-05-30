"use strict";
/* create the gameBoard Object with a module
*/
const gameBoard = (() => {

    let gameBoardDisplay = document.getElementById('game');

    let gameBoardArray = ['', '', '', '', '', '', '', '', '']; // the array is looped over to create the html

    const clearGameBoard = () => {
        
        gameBoardArray = ['', '', '', '', '', '', '', '', ''];
    };

    // to add the player's mark in the gameBoardArray
    const update = (position, currentPlayer) => {
        gameBoardArray.splice(position, 1, currentPlayer.mark)
    };

    // create the html to be displayed on the webpage
    const createGameBoard = () => {
        let gridGameBoard = '';

        for (let i = 0; i < gameBoardArray.length; i++) {

            if (gameBoardArray[i] === '') {

                gridGameBoard += `<div id='${i}' class='notPlayed playBox'>${gameBoardArray[i]}</div>`;

            } else gridGameBoard += `<div id='${i}' class='played playBox'>${gameBoardArray[i]}</div>`;

        }
        return gameBoardDisplay.innerHTML = gridGameBoard;

    };

    return { gameBoardArray, createGameBoard, update, clearGameBoard };
})();

// create the players with a factory
// we keep track of the player's moves
const Player = (name, mark) => {

    let spotPlayed = [];

    const clearPlayer = () => {
        spotPlayed = [];
    };

    const play = (id) => { // keep track of the played spots by the player

        spotPlayed.push(id);
    };

    return { name, mark, spotPlayed, play, clearPlayer };
};

// Creation of two players with names


let player1 = Player('Pierre', 'X');
let player2 = Player('Johan', 'O');

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
    const checkForAWinner = () => {

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
    const setPlayer = () => {

        if (gameStarted) {

            return currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;

        } else return (currentPlayer, gameStarted = true);
    };

    // to add the eventListeners only to the spots that are not played yet
    // thus a player can't play on an already played spot
    const printGame = () => {

        gameBoard.createGameBoard();
        let spotsToPlay = document.querySelectorAll('.notPlayed');

        spotsToPlay.forEach(spot => spot.addEventListener('click', e => {

            displayController.playGame(e);

        }));

    }

    const playGame = (event) => {

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
        };
    };

    // This doesn't work
    // it doesn't update anything when I call it from the console.
    const clearGame = () => {

        player1.clearPlayer();
        player2.clearPlayer();

        gameBoard.clearGameBoard();
        console.log(gameBoard.gameBoardArray);
        
        gameFinished = false;
        gameStarted = false;
        winningLine = null;
        currentPlayer = player1;
        printGame();


    };


    return { playGame, printGame, clearGame };
})();


// functions to find a place for

displayController.printGame();


