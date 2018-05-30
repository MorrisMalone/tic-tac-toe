
// create the gameBoard Object with a module

const gameBoard = (() => {
    let gameBoardDisplay = document.getElementById('game');

    let gameBoardArray = ['', '', '', '', '', '', '', '', ''];

    const clearGameBoard = () => {
        gameBoardArray = ['', '', '', '', '', '', '', '', ''];
    };

    const update = (position, currentPlayer) => {
        gameBoardArray.splice(position, 1, currentPlayer.mark)
    };

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

const Player = (name, mark) => {

    let spotPlayed = [];

    const clearPlayer = () => {
        spotPlayed = [];
    };

    const play = (id) => {

        spotPlayed.push(id);
    };

    return { name, mark, spotPlayed, play, clearPlayer };
};

// Tests


let player1 = Player('Pierre', 'X');
let player2 = Player('Johan', 'O');

// create the displayController with a module

const displayController = (() => {
    let currentPlayer = player1;
    let winner = null;
    let winningLine = null;
    let gameFinished = false;
    let gameStarted = false;

    const checkForAWinner = () => {

        let winningCombinations = [['0', '1', '2'], ['3', '4', '5'], ['6', '7', '8'], ['0', '3', '6'], ['1', '4', '7'], ['2', '5', '8'], ['0', '4', '8'], ['2', '4', '6']];

        for (let i = 0; i < winningCombinations.length; i++) {
            if (winningCombinations[i].every(elem => currentPlayer.spotPlayed.indexOf(elem) > -1)) {

                winner = currentPlayer;
                winningLine = winningCombinations[i];
                return true;
            }

        }

    };

    const setPlayer = () => {

        if (gameStarted) {

            return currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;

        } else return (currentPlayer, gameStarted = true);
    };

    const printGame = () => {

        gameBoard.createGameBoard();
        let spotsToPlay = document.querySelectorAll('.notPlayed');

        spotsToPlay.forEach(spot => spot.addEventListener('click', e => {

            displayController.playGame(e);

        }));

    }

    const playGame = (event) => {
        if (!gameFinished) {
            setPlayer();

            gameBoard.update(event.target.id, currentPlayer);

            currentPlayer.play(event.target.id);

            printGame();

            if (checkForAWinner()) {

                for (let i = 0; i < winningLine.length; i++) {

                    document.getElementById(winningLine[i]).classList.toggle('winningLine');
                }

                document.getElementById('result').textContent = `${currentPlayer.name} WON!`;

                gameFinished = true;
            };
        };
    };

    const clearGame = () => {

        player1.clearPlayer();
        player2.clearPlayer();
        player1.spotPlayed = [];
        console.log(player1.spotPlayed);
        player1.play('5');
        console.log(player1.spotPlayed);
        
        gameBoard.clearGameBoard();
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


