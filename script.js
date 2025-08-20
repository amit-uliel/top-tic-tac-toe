const gameboard = (function() {
    const rows = 3;
    const columns = 3;
    const board = [];
    let markedCells = 0;

    // initialize board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = createCell();
        }
    }

    const getBoard = () => board;

    const getMarkedCells = () => markedCells;
    
    const getRow = row => board[row].map(cell => cell.getMarker());

    const getColumn = column => {
        const columnArr = [];
        for (let i = 0; i < columns; i++) {
            columnArr.push(board[i][column].getMarker());
        }
        return columnArr;
    };

    const getDiagonals = () => {
        const diagonals = {
            topLeftToBottomRight: [],
            topRightToBottomLeft: []
        };

        // populate top left - bottom right
        for (let i = 0; i < rows; i++) {
            diagonals.topLeftToBottomRight.push(board[i][i].getMarker());
        }

        // populate top right - bottom left
        for (let i = 0; i < rows; i++) {
            diagonals.topRightToBottomLeft.push(board[i][columns - 1 - i].getMarker());
        }

        return diagonals;
    };

    const render = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getMarker()));
        console.log(boardWithCellValues);
    };

    const markCell = (row, column, marker) => {
        if (board[row][column].getMarker() !== null) {
            return false;
        }

        board[row][column].setMarker(marker);
        markedCells++;
        return true;
    };

    return { render, markCell, getMarkedCells, getBoard, getRow, getColumn, getDiagonals };
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

    const diagonalIndexes = [
            [0,0],
            [0,2],
            [1,1],
            [2,0],
            [2,2]
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

    const allEqual = (arr) => {
        let item = arr[0];

        if (item === null) return false;

        for (let i = 1; i < arr.length; i++) {
            if (item !== arr[i]) {
                return false;
            }

            item = arr[i];
        }

        return true;
    };

    const isDiagonalCell = (rowIndex, columnIndex) => {
        return diagonalIndexes.some(([r, c]) => r === rowIndex && c === columnIndex);
    };

    const checkWin = (rowIndex, columnIndex) => {
        const row = gameboard.getRow(rowIndex);
        const column = gameboard.getColumn(columnIndex);

        let diagonals;
        if (isDiagonalCell(rowIndex, columnIndex)) {
            diagonals = gameboard.getDiagonals();
        }

        if (allEqual(row)) {
            return true;
        } else if (allEqual(column)) {
            return true;
        } else if (diagonals && ( allEqual(diagonals.topLeftToBottomRight) || allEqual(diagonals.topRightToBottomLeft) )) {
            return true;
        }

        return false;
    }

    const playTurn = (rowIndex, columnIndex) => {
        console.log(`${getActivePlayer().name} is marking at (${rowIndex}, ${columnIndex}).`);

        // Attempt to mark the cell, if it's already taken - exit early
        if(!gameboard.markCell(rowIndex, columnIndex, getActivePlayer().marker)) {
            return;
        }
        
        // End the turn early if the game has finished (win or tie)
        if (checkWin(rowIndex, columnIndex)) {
            console.log(`${getActivePlayer().name} is the Winner !`);
            gameboard.render();
            return;
        } else if (gameboard.getMarkedCells() === 9) {
            console.log(`A tie !`);
            gameboard.render();
            return;
        }
        
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
