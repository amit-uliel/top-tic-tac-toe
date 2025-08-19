const gameboard = (function() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // initialize board
    for (i = 0; i < rows; i++) {
        board[i] = [];
        for (j = 0; j < columns; j++) {
            board[i][j] = createCell();
        }
    }
    
    const render = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getMarker()));
        console.log(boardWithCellValues);
    }

    const markCell = (row, column, marker) => {
        if (board[row][column].getMarker() !== null) {
            return false;
        }

        board[row][column].setMarker(marker);
        return true;
    }

    return { render, markCell };
})();

function createGameController (playerOneName = "Player One", playerTwoName = "Player Two") {
    const players = [
        {
            name: playerOneName,
            marker: 'X'
        },
        {
            name: playerTwoName,
            marker: 'O'
        }
    ];

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = getActivePlayer() === players[0] ? players[1] : players[0];
    }

    const printNewTurn = () => {
        gameboard.render();
        console.log(`${getActivePlayer().name}'s turn to mark.`);
    }

    const playTurn = (row, column) => {
        console.log(`${getActivePlayer().name} mark at (${row}, ${column}).`);

        gameboard.markCell(row, column, getActivePlayer().marker);
        
        switchPlayerTurn();
        printNewTurn();
    }

    return { getActivePlayer, playTurn };
}

function createCell() {
    let marker = null;

    const setMarker = (newMarker) => { 
        marker = newMarker; 
    };

    const getMarker = () => marker;

    return { setMarker, getMarker };
}

const gameController = createGameController("Amit", "Tahel");
gameController.playTurn(0,0);
gameController.playTurn(1,0);
gameController.playTurn(0,1);
gameController.playTurn(0,2);
