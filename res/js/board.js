var boardGraph = new Map();
var usedCrosses = new Set();
var playerOne = [0, 8];
var playerTwo = [16, 8];
var playerOneGoal = new Set([
    "16-0",
    "16-2",
    "16-4",
    "16-6",
    "16-8",
    "16-10",
    "16-12",
    "16-14",
    "16-16"
]);
var playerTwoGoal = new Set([
    "0-0",
    "0-2",
    "0-4",
    "0-6",
    "0-8",
    "0-10",
    "0-12",
    "0-14",
    "0-16"
]);
var playerOneWalls = 10;
var playerTwoWalls = 10;
var state = {
    TURNONE : 1,
    TURNTWO : 2,
    END: 3
};
var currentState;

// Initialize
function init() {
    createBoard();
    updateWallLabels();
}

// Updates the wall labels
function updateWallLabels() {
    $("#OneNumWalls").text(playerOneWalls);
    $("#TwoNumWalls").text(playerTwoWalls);
}

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
                    td.classList.add("wall");
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
                    td.classList.add("wall");
                } else {
                    td.setAttribute("class", "cross");
                }

                tr.appendChild(td);
            }

        }

        table.appendChild(tr);
    }

    boarddiv.appendChild(table);

    // Create player pieces
    createPlayerOnePiece(playerOne);
    createPlayerTwoPiece(playerTwo);
    // Player one turn at game start
    currentState = state.TURNONE;
    initializeGraph();
    registerListeners();
    
}

// Reset board
function resetBoard() {

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
        return;
    } else {
        console.error("[registerListeners] Invalid currentState.");
        return;
    }
    
    // get a list of valid walls
    var walls = validWalls();
    
    for (var i = 0; i < walls.length; ++i) {
        var id = walls[i]
        var coord = id.split("-");

        if (parseInt(coord[0]) % 2 == 1) {
            $("#" + id).on("click", function() {
                console.log("Clicked valid wall");
                var coord = $(this).attr("id").split("-");
                playWall(parseInt(coord[0]), parseInt(coord[1]));
            });            

            $("#" + id).on("mouseenter", function() {
                var coord = $(this).attr("id").split("-");
                var row = parseInt(coord[0]);
                var col = parseInt(coord[1]);

                var loc1 = document.getElementById(row.toString() + "-" + col.toString());
                loc1.classList.add("h-wall-shadow");

                var crossloc = document.getElementById(row.toString() + "-" + (col + 1).toString());
                crossloc.classList.add("cross-shadow");

                var loc2 = document.getElementById(row.toString() + "-" + (col + 2).toString());
                loc2.classList.add("h-wall-shadow");
            });

            $("#" + id).on("mouseleave", function() {
                var coord = $(this).attr("id").split("-");
                var row = parseInt(coord[0]);
                var col = parseInt(coord[1]);

                var loc1 = document.getElementById(row.toString() + "-" + col.toString());
                loc1.classList.remove("h-wall-shadow");

                var crossloc = document.getElementById(row.toString() + "-" + (col + 1).toString());
                crossloc.classList.remove("cross-shadow");

                var loc2 = document.getElementById(row.toString() + "-" + (col + 2).toString());
                loc2.classList.remove("h-wall-shadow");         
            });
        } else {
            $("#" + id).on("click", function() {
                console.log("Clicked valid wall");
                var coord = $(this).attr("id").split("-");
                playWall(parseInt(coord[0]), parseInt(coord[1]));
            }); 

            $("#" + id).on("mouseenter", function() {
                var coord = $(this).attr("id").split("-");
                var row = parseInt(coord[0]);
                var col = parseInt(coord[1]);

                var loc1 = document.getElementById(row.toString() + "-" + col.toString());
                loc1.classList.add("v-wall-shadow");

                var crossloc = document.getElementById((row + 1).toString() + "-" + col.toString());
                crossloc.classList.add("cross-shadow");

                var loc2 = document.getElementById((row + 2).toString() + "-" + col.toString());
                loc2.classList.add("v-wall-shadow");
            });

            $("#" + id).on("mouseleave", function() {
                var coord = $(this).attr("id").split("-");
                var row = parseInt(coord[0]);
                var col = parseInt(coord[1]);  
                
                var loc1 = document.getElementById(row.toString() + "-" + col.toString());
                loc1.classList.remove("v-wall-shadow");

                var crossloc = document.getElementById((row + 1).toString() + "-" + col.toString());
                crossloc.classList.remove("cross-shadow");

                var loc2 = document.getElementById((row + 2).toString() + "-" + col.toString());
                loc2.classList.remove("v-wall-shadow");
            });
        }
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
}

// TODO: This needs to do more checks to see if
// Jumps would be blocked and we need to add diagonals.
// Maybe have a general play function that does the fixing after?
// Doesn't seem like that will work tho.
function playWall(row, col) {
    // TODO: Create wall
    removeWall(row, col, boardGraph);
    addCross(row, col);

    $(".wall").off();
    // check if the game has ended
    if (currentState == state.TURNONE) {
        playerOneWalls -= 1;
        currentState = state.TURNTWO;
    } else if (currentState == state.TURNTWO) {
        playerTwoWalls -= 1;
        currentState = state.TURNONE;
    }
    updateWallLabels();
    $(".square").off();
    registerListeners();
}

// Adds cross to the usedCross
function addCross(row, col) {
    if (row % 2 == 1) {
        var newCol = col + 1;
        usedCrosses.add(row.toString() + "-" + newCol.toString());
    } else if (col % 2 == 1) {
        var newRow = row + 1;
        usedCrosses.add(newRow.toString() + "-" + col.toString());
    }
}

// Removes walls from given graph
function removeWall(row, col, graph) {
    // TODO: Create wall
    var squareId, targetId;
    
    if (row % 2 == 1) {
        // Horizontal wall
        var above = row - 1;
        var below = row + 1;
        var rightCol = col + 2;
        
        // Top left square
        squareId = above.toString() + "-" + col.toString();
        targetId = below.toString() + "-" + col.toString();
        graph.set(squareId, removeEdge(squareId, targetId, graph));

        // Bottom left square
        squareId = below.toString() + "-" + col.toString();
        targetId = above.toString() + "-" + col.toString();
        graph.set(squareId, removeEdge(squareId, targetId, graph));

        // Top right square
        squareId = above.toString() + "-" + rightCol.toString();
        targetId = below.toString() + "-" + rightCol.toString();
        graph.set(squareId, removeEdge(squareId, targetId, graph));

        // Bottom right square
        squareId = below.toString() + "-" + rightCol.toString();
        targetId = above.toString() + "-" + rightCol.toString();
        graph.set(squareId, removeEdge(squareId, targetId, graph));

    } else if (col % 2 == 1) {
        // Vertical wall
        var left = col - 1;
        var right = col + 1;
        var belowRow = row + 2;

        // Top left square
        squareId = row.toString() + "-" + left.toString();
        targetId = row.toString() + "-" + right.toString();
        graph.set(squareId, removeEdge(squareId, targetId, graph));

        // Bottom left square
        squareId = belowRow.toString() + "-" + left.toString();
        targetId = belowRow.toString() + "-" + right.toString();
        graph.set(squareId, removeEdge(squareId, targetId, graph));

        // Top right square
        squareId = row.toString() + "-" + right.toString();
        targetId = row.toString() + "-" + left.toString();
        graph.set(squareId, removeEdge(squareId, targetId, graph));

        // Bottom right square
        squareId = belowRow.toString() + "-" + right.toString();
        targetId = belowRow.toString() + "-" + left.toString();
        graph.set(squareId, removeEdge(squareId, targetId, graph));

    } else {
        console.log("Should not get here!");
    }
}

function removeEdge(squareId, targetId, graph) {
    var walls = graph.get(squareId);
    var newEdges = [];
    if (walls != undefined) {
        for (var i = 0; i < walls.length; ++i) {
            if (walls[i] != targetId) {
                newEdges.push(walls[i]);
            }            
        }
    } 
    return newEdges;
}

// TODO: needs to evaluate whether jumps are possible
function playPlayerOne(row, col) {
    playerOne = [row, col];
    $("#player-one").remove();
    createPlayerOnePiece();
    $(".square").off();
    // delete shadow
    $("#player-one-shadow").remove();
    // check if the game has ended
    if (checkGameEnd()) { 
        currentState = state.END;
    } else {
        currentState = state.TURNTWO;
        registerListeners();
    }
}

function playPlayerTwo(row, col) {
    playerTwo = [row, col];
    $("#player-two").remove();
    createPlayerTwoPiece();
    $(".square").off();
    // delete shadow
    $("#player-two-shadow").remove();
    // check if the game has ended
    if (checkGameEnd()) {
        currentState = state.END;
    } else {
        currentState = state.TURNONE;
        registerListeners(); 
    }
}

function checkGameEnd() {
    var playerOneLoc = playerOne[0].toString() + "-" + playerOne[1].toString();
    var playerTwoLoc = playerTwo[0].toString() + "-" + playerTwo[1].toString();

    if (playerOneGoal.has(playerOneLoc)) {
        return true;
    } else if (playerTwoGoal.has(playerTwoLoc)) {
        return true;
    }
    return false;
}

// Returns an array of valid wall placements
function validWalls() {
    var allWalls = ["0-1", "0-3", "0-5", "0-7", "0-9", "0-11", "0-13", "0-15",
                    "1-0", "1-2", "1-4", "1-6", "1-8", "1-10", "1-12", "1-14",
                    "2-1", "2-3", "2-5", "2-7", "2-9", "2-11", "2-13", "2-15",
                    "3-0", "3-2", "3-4", "3-6", "3-8", "3-10", "3-12", "3-14",
                    "4-1", "4-3", "4-5", "4-7", "4-9", "4-11", "4-13", "4-15",
                    "5-0", "5-2", "5-4", "5-6", "5-8", "5-10", "5-12", "5-14",
                    "6-1", "6-3", "6-5", "6-7", "6-9", "6-11", "6-13", "6-15",
                    "7-0", "7-2", "7-4", "7-6", "7-8", "7-10", "7-12", "7-14",
                    "8-1", "8-3", "8-5", "8-7", "8-9", "8-11", "8-13", "8-15",
                    "9-0", "9-2", "9-4", "9-6", "9-8", "9-10", "9-12", "9-14",
                    "10-1", "10-3", "10-5", "10-7", "10-9", "10-11", "10-13", "10-15",
                    "11-0", "11-2", "11-4", "11-6", "11-8", "11-10", "11-12", "11-14",
                    "12-1", "12-3", "12-5", "12-7", "12-9", "12-11", "12-13", "12-15",
                    "13-0", "13-2", "13-4", "13-6", "13-8", "13-10", "13-12", "13-14",
                    "14-1", "14-3", "14-5", "14-7", "14-9", "14-11", "14-13", "14-15",
                    "15-0", "15-2", "15-4", "15-6", "15-8", "15-10", "15-12", "15-14"];
    var valid = [];
    var coord;
    for (var i = 0; i< allWalls.length; ++i) {
        id = allWalls[i];
        coord = id.split("-");
        if (!crossUsed(id) && checkWallValid(parseInt(coord[0]), parseInt(coord[1]))) {
            var wallRemoved = new Map(boardGraph);
            removeWall(parseInt(coord[0]), parseInt(coord[1]), wallRemoved);
            if (hasRoute(1, wallRemoved) && hasRoute(2, wallRemoved)) {
                valid.push(id);
            }
        }
    }
    return valid;
}

// Checks whether the wall is valid
function checkWallValid(row, col) {
    if (row % 2 == 1) {
        var above = row - 1;
        var below = row + 1;
        var rightCol = col + 2;

        var edges = boardGraph.get(above.toString() + "-" + col.toString());
        if (!edges.includes(below.toString() + "-" +  col.toString())) {
            return false;
        }

        edges = boardGraph.get(above.toString() + "-" + rightCol.toString());
        if (!edges.includes(below.toString() + "-" + rightCol.toString())) {
            return false;
        }

    } else if (col % 2 == 1) {
        var left = col - 1;
        var right = col + 1;
        var belowRow = row + 2;

        var edges = boardGraph.get(row.toString() + "-" + left.toString());
        if (!edges.includes(row.toString() + "-" + right.toString())) {
            return false;
        }

        edges = boardGraph.get(belowRow.toString() + "-" + left.toString());
        if (!edges.includes(belowRow.toString() + "-" + right.toString())) {
            return false;
        }

    }
    return true;
}

// Returns boolean value whether the given wall used a cross
function crossUsed(wall) {
    var coord = wall.split("-");
    var cross;
    if (parseInt(coord[0]) % 2 == 1) {
        cross = coord[0] + "-" + (parseInt(coord[1]) + 1).toString();
    } else {
        cross = (parseInt(coord[0]) + 1).toString() + "-" + coord[1];
    }
    if (usedCrosses.has(cross)) {
        return true;
    } else {
        return false;
    }
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
            edges = graph.get(traverseNode);
            for (var i = 0; i < edges.length; ++i) {
                if (!visited.has(edges[i])) {
                    stack.push(edges[i]);
                }
            }
        }
    }

    return false;
}

// Returns an array of valid moves for the given player.
function validMoves(playerNum) {
    var id, moves, other, src, dest;
    var valid = [];

    if (playerNum == 1) {
        id = playerOne[0].toString() + "-" + playerOne[1].toString();
        src = playerOne;
        other = playerTwo[0].toString() + "-" + playerTwo[1].toString();
        dest = playerTwo;
    } else if (playerNum == 2) {
        id = playerTwo[0].toString() + "-" + playerTwo[1].toString();
        src = playerTwo;
        other = playerOne[0].toString() + "-" + playerOne[1].toString();
        dest = playerOne;
    } else {
        console.error("[validMoves] Unwanted State!");
        return valid;
    }

    if (boardGraph.has(id)) {
        moves = boardGraph.get(id);
        for (var i = 0; i < moves.length; ++i) {
            if (moves[i] == other) {
                var delta, jump, destMoves;

                if (src[0] == dest[0]) {
                    // Rows are the same
                    delta = dest[1] - src[1];
                    jump = src[0].toString() + "-" + (dest[1] + delta).toString();
                    destMoves = boardGraph.get(other);
                    
                    if (boardGraph.has(other) && destMoves.includes(jump)) {
                        valid.push(jump);
                    } else {
                        var above = (dest[0] - 2).toString() + "-" + dest[1].toString();
                        var below = (dest[0] + 2).toString() + "-" + dest[1].toString();
                        
                        if (destMoves.includes(above)) {
                            valid.push(above);
                        }
                        if (destmoves.includes(below)) {
                            valid.push(below);
                        }
                    }

                } else if (src[1] == dest[1]) {
                    // Cols are the same
                    delta = dest[0] - src[0];
                    jump = (dest[0] + delta).toString() + "-" + dest[1].toString();
                    destMoves = boardGraph.get(other);
                    
                    if (boardGraph.has(other) && destMoves.includes(jump)) {
                        valid.push(jump);
                    } else {
                        var left = dest[0].toString() + "-" + (dest[1] - 2).toString();
                        var right = dest[0].toString() + "-" + (dest[1] + 2).toString();
                        
                        if (destMoves.includes(left)) {
                            valid.push(left);
                        }
                        if (destMoves.includes(right)) {
                            valid.push(right);
                        }
                    }

                } else {
                    console.error("[validMoves] Unwanted State!");
                }
            } else {
                valid.push(moves[i]);
            }
        }
        return valid;
    } else {
        return [];
    }
}