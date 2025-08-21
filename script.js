function createGameBoard() {
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
}

function createGameController (playerOneName, playerTwoName) {
    const gameboard = createGameBoard();
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

    const getGameStats = (rowIndex, columnIndex) => {
        if (checkWin(rowIndex, columnIndex)) {
            return { ended: true, result: "win" };
        } else if (gameboard.getMarkedCells() === 9) {
            return { ended: true, result: "tie" };
        } 

        return { ended: false };
    }

    const playTurn = (rowIndex, columnIndex) => {
        // Attempt to mark the cell, if it's already taken - exit early
        if (!gameboard.markCell(rowIndex, columnIndex, getActivePlayer().marker)) {
            return { ended: false, result: "invalid" };
        }
        
        const gameStats = getGameStats(rowIndex, columnIndex);
        console.log(gameStats);

        if (gameStats.ended) return gameStats;
        
        switchPlayerTurn();
        return gameStats;
    }

    return { getActivePlayer, playTurn, getBoard: gameboard.getBoard };
}

function createCell() {
    let marker = null;

    const setMarker = (newMarker) => { 
        marker = newMarker; 
    };

    const getMarker = () => marker;

    return { setMarker, getMarker };
}

function createScreenController() {
    let gameController;
    let gameEnded;
    const turnDisplayerDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const restartButton = document.querySelector(".restartButton");
    const playerOneInput = document.querySelector(".playerOne");
    const playerTwoInput = document.querySelector(".playerTwo");
    const startGameButton = document.querySelector(".startGameButton");

    startGameButton.addEventListener("click", () => {
        startGame();
    });

    restartButton.addEventListener("click", function () {
        playerOneInput.style.display = "inline";
        playerTwoInput.style.display = "inline";
        startGameButton.style.display = "inline";
    });
    
    const updateScreen = () => {
        boardDiv.textContent = "";
        const board = gameController.getBoard();
        turnDisplayerDiv.textContent = `${gameController.getActivePlayer().name}'s turn to play`;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const button = document.createElement("button");
                button.dataset.row = i;
                button.dataset.column = j;
                button.textContent = board[i][j].getMarker();

                boardDiv.appendChild(button);
            }
        }
    }

    const startGame = () => {
        const playerOneName = playerOneInput.value || "Player One";
        const playerTwoName = playerTwoInput.value || "Player Two";
        gameController = createGameController(playerOneName, playerTwoName);
        gameEnded = false;
        updateScreen();

        playerOneInput.style.display = "none";
        playerTwoInput.style.display = "none";
        startGameButton.style.display = "none";
    }

    const showMessage = (message) => {
        turnDisplayerDiv.textContent = message;
    }

    const clickHandlerBoard = (e) => {
        if (gameEnded) return;

        const cell = e.target;
        const row = Number(cell.dataset.row);
        const column = Number(cell.dataset.column);
        
        if (row === null || column === null) return;
        
        const gameStats = gameController.playTurn(row, column);
        
        updateScreen();
        if (gameStats.ended) {
            showMessage(gameStats.result === 'win' ? `${gameController.getActivePlayer().name} won` : "A tie");
            gameEnded = true;
            restartButton.style.display = "block";
        }
    }
    
    boardDiv.addEventListener("click", clickHandlerBoard);
}

createScreenController();
