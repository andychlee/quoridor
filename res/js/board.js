var boardGraph = new Map();
var playerOne = [0, 8];
var playerTwo = [16, 8];
var playerOneGoal = new Set();
var playerTwoGoal = new Set();
var playerOneWalls = 10;
var playerTwoWalls = 10;
var state = {
    TURNONE : 1,
    TURNTWO : 2,
    END: 3
};
var currentState;

// Create a board with wall and square locations
function createBoard() {
    console.log("Creating table");
    var boarddiv = document.getElementById("board");
    var table = document.createElement("table");

    for (var i = 0; i < 17; ++i) {
        var tr = document.createElement("tr");
        tr.setAttribute("id", i);
        if (i % 2 == 0) {
            // Major rows have 9 squares and 8 grooves
            tr.setAttribute("class", "major-row");

            for (var j = 0; j < 17; ++j) {
                var td = document.createElement("td");
                td.setAttribute("id", i.toString() + "-" + j.toString());
                if (j % 2 == 0) {
                    td.setAttribute("class", "square");
                } else {
                    td.setAttribute("class", "v-groove");
                }
                
                tr.appendChild(td);
            }

        } else {
            // Minor rows have 9 grooves and 8 cross sections
            tr.setAttribute("class", "minor-row");

            for (var j = 0; j < 17; ++j) {
                var td = document.createElement("td");
                td.setAttribute("id", i.toString() + "-" + j.toString());
                if (j % 2 == 0) {
                    td.setAttribute("class", "h-groove");
                } else {
                    td.setAttribute("class", "cross");
                }

                tr.appendChild(td);
            }

        }

        table.appendChild(tr);
    }

    boarddiv.appendChild(table);

    createPlayerOnePiece(playerOne);
    createPlayerTwoPiece(playerTwo);
    currentState = state.TURNONE;
    initializeGraph();
    registerListeners();
    
}

// Registers listeners
function registerListeners() {
    if (currentState == state.TURNONE) {
        console.log("Player One turn, registering listeners.");
        var validMovesOne = validMoves(1);

        for (var i = 0; i < validMovesOne.length; ++i) {
            var id = validMovesOne[i];
            $("#" + id).on("click", function() {
                console.log("Clicked valid player one move");
                var coord = $(this).attr("id").split("-");
                playPlayerOne(parseInt(coord[0]), parseInt(coord[1]));
            });
    
            $("#" + id).hover(function() {
                console.log("Hovered valid player one move");
            });
    
            $("#" + id).on("mouseenter", function() {
                var shadow = document.createElement("div");
                var coord = $(this).attr("id").split("-");
                shadow.setAttribute("class", "player-piece-shadow");
                shadow.setAttribute("id", "player-one-shadow");
                shadow.setAttribute("row", coord[0]);
                shadow.setAttribute("col", coord[1]);
                
                var loc = document.getElementById($(this).attr("id"));
                loc.appendChild(shadow);
            });
    
            $("#" + id).on("mouseleave", function() {
                $("#player-one-shadow").remove();
            });

        }

    } else if (currentState == state.TURNTWO) {
        console.log("Player Two turn, registering listeners.");

        var validMovesTwo = validMoves(2);
        
        for (var i = 0; i < validMovesTwo.length; ++i) {
            var id = validMovesTwo[i];
            console.log(id);
            $("#" + id).on("click", function() {
                console.log("Clicked valid player two move");
                var coord = $(this).attr("id").split("-");
                playPlayerTwo(parseInt(coord[0]), parseInt(coord[1]));
            });
            
            $("#" + id).on("mouseenter", function() {
                var shadow = document.createElement("div");
                var coord = $(this).attr("id").split("-");
                shadow.setAttribute("class", "player-piece-shadow");
                shadow.setAttribute("id", "player-two-shadow");
                shadow.setAttribute("row", coord[0]);
                shadow.setAttribute("col", coord[1]);
                
                var loc = document.getElementById($(this).attr("id"));
                loc.appendChild(shadow);
            });
    
            $("#" + id).on("mouseleave", function() {
                $("#player-two-shadow").remove();
            });
            
        }

    } else if (currentState == state.END) {
        console.log("Game has ended. No listeners to register.");
    } else {
        console.error("Invalid currentState.");
    }
    
    
}

function createPlayerOnePiece() {
    var piece_1 = document.createElement("div");
    piece_1.setAttribute("class", "player-piece");
    piece_1.setAttribute("id", "player-one");
    piece_1.setAttribute("row", playerOne[0].toString());
    piece_1.setAttribute("col", playerOne[1].toString());
    var loc_1 = document.getElementById(playerOne[0].toString() + "-" + playerOne[1].toString());
    loc_1.appendChild(piece_1);
}

function createPlayerTwoPiece() {
    var piece_2 = document.createElement("div");
    piece_2.setAttribute("class", "player-piece");
    piece_2.setAttribute("id", "player-two");
    piece_2.setAttribute("row", playerTwo[0].toString());
    piece_2.setAttribute("col", playerTwo[1].toString());
    var loc_2 = document.getElementById(playerTwo[0].toString() + "-" + playerTwo[1].toString());
    loc_2.appendChild(piece_2);
}

function squareEnter() {
    //$(this).addClass("square-hover");
}

function squareExit() {
    //$(this).removeClass("square-hover");
}

// Initialize graph of the board
function initializeGraph() {

    for (var i = 0; i < 17; i += 2) {
        for (var j = 0; j < 17; j += 2) {
            var id = i.toString() + "-" + j.toString();
            var edges = []
            if ((i - 2) >= 0) {
                edges.push( (i-2).toString() + "-" + j.toString() );
            }
            if ((i + 2) <= 16) {
                edges.push( (i+2).toString() + "-" + j.toString() );
            }
            if ((j - 2) >= 0) {
                edges.push( i.toString() + "-" + (j-2).toString() );
            } 
            if ((j + 2) <= 16) {
                edges.push( i.toString() + "-" + (j+2).toString() );
            }
            boardGraph.set(id, edges);
        }
    }

    console.log(boardGraph);
}

// TODO: This needs to do more checks to see if
// Jumps would be blocked and we need to add diagonals.
// Maybe have a general play function that does the fixing after?
// Doesn't seem like that will work tho.
function playWall(row, col) {
    var squareId;
    var wallId = row.toString() + "-" + col.toString();
    if (row % 2 == 1) {
        var above = row - 1;
        var below = row + 1;
        var rightCol = col + 2;
        
        // Top left square
        squareId = above.toString() + "-" + col.toString();
        boardGraph.set(squareId, removeWall(squareId, wallId));

        // Bottom left square
        squareId = below.toString() + "-" + col.toString();
        boardGraph.set(squareId, removeWall(squareId, wallId));

        // Top right square
        squareId = above.toString() + "-" + rightCol.toString();
        boardGraph.set(squareId, removeWall(squareId, wallId));

        // Bottom right square
        squareId = above.toString() + "-" + rightCol.toString();
        boardGraph.set(squareId, removeWall(squareId, wallId));

    } else if (col % 2 == 1) {
        var left = col - 1;
        var rigth = col + 1;
        var belowRow = row + 2;

        // Top left square
        squareId = row.toString() + "-" + left.toString();
        boardGraph.set(squareId, removeWall(squareId, wallId));

        // Bottom left square
        squareId = belowRow.toString() + "-" + left.toString();
        boardGraph.set(squareId, removeWall(squareId, wallId));

        // Top right square
        squareId = row.toString() + "-" + right.toString();
        boardGraph.set(squareId, removeWall(squareId, wallId));

        // Bottom right square
        squareId = belowRow.toString() + "-" + right.toString();
        boardGraph.set(squareId, removeWall(squareId, wallId));

    } else {
        console.log("Should not get here!");
    }
}

function removeWall(squareId, wallId) {
    var walls = boardGraph.get(squareId);
    var newWalls;
    for (var i = 0; i < walls.length; ++i) {
        if (walls[i] != wallId) {
            newWalls.push(walls[i]);
        }            
    }
    return newWalls;
}

// TODO: needs to evaluate whether jumps are possible
function playPlayerOne(row, col) {
    playerOne = [row, col];
    $("#player-one").remove();
    createPlayerOnePiece();
    // update the board
    // disable all previous listeners
    // TODO: don't delete all listeners
    // only delete the ones that has changed.
    // and only register ones that have been added
    $(".square").off();
    // delete shadow
    $("#player-one-shadow").remove();
    registerListeners();
    currentState = state.TURNTWO;
}

function playPlayerTwo(row, col) {
    playerTwo = [row, col];
    $("#player-one")
    createPlayerTwoPiece();
    // update the board
    // disable all previous listeners
    $(".square").off();
    // delete shadow
    $("#player-two-shadow").remove();
    registerListeners();
    currentState = state.TURNONE;
}

// Returns an array of valid wall placements
function validWalls() {
    //go through each key in the map
}

// Returns a boolean whether the specified playerNum
// has a route to its goal in the graph
function hasRoute(playerNum, graph) {
    var targetNodes, currentNode, traverseNode, edges;
    var stack = [];
    var visited = new Set();

    if (playerNum == 1) {
        targetNodes = playerOneGoal;
        currentNode = playerOne[0].toString() + "-" + playerOne[1].toString();
    } else if (playerNum == 2) {
        targetNodes = playerTwoGoal;
        currentNode = playerTwo[0].toString() + "-" + playerTwo[1].toString();
    } else {
        console.error("[hasRoute] Unwanted State!");
        return false;
    }

    stack.push(currentNode);
    while (stack.length > 0) {
        traverseNode = stack.pop();
        if (targetNodes.has(traverseNode)) {
            return true;
        } else if (!visited.has(traverseNode)) {
            visited.add(traverseNode);
            edges = graph.get(currentNode);
            for (var i = 0; i < edges.length; ++i) {
                stack.push(edges[i]);
            }
        }
    }

    return false;
}

// Returns an array of valid moves for the given player.
function validMoves(playerNum) {
    var row, col, id;

    if (playerNum == 1) {
        row = playerOne[0];
        col = playerOne[1];
    } else if (playerNum == 2) {
        row = playerTwo[0];
        col = playerTwo[1];
    } else {
        console.error("[validMoves] Unwanted State!");
        return [];
    }

    id = row.toString() + "-" + col.toString();
    if (boardGraph.has(id)) {
        return boardGraph.get(id);
    } else {
        return [];
    }
}