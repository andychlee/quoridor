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

    // Create player pieces
    createPlayerOnePiece(playerOne);
    createPlayerTwoPiece(playerTwo);
    // Player one turn at game start
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
    var newWalls = [];
    if (walls != undefined) {
        for (var i = 0; i < walls.length; ++i) {
            if (walls[i] != targetId) {
                newWalls.push(walls[i]);
            }            
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
    currentState = state.TURNTWO;
    registerListeners();
}

function playPlayerTwo(row, col) {
    playerTwo = [row, col];
    $("#player-two").remove();
    createPlayerTwoPiece();
    // update the board
    // disable all previous listeners
    $(".square").off();
    // delete shadow
    $("#player-two-shadow").remove();
    currentState = state.TURNONE;
    registerListeners();    
}

// Returns an array of valid wall placements
function validWalls() {
    //go through each key in the map
    var allWalls = ["0-1"];
    var valid = [];
    var coord;
    for (var i = 0; i< allWalls.length; ++i) {
        id = allWalls[i];
        coord = id.split("-");
        if (!crossUsed(id)) {
            var wallRemoved = new Map(boardGraph);
            removeWall(parseInt(coord[0]), parseInt(coord[1]), wallRemoved);
            if (hasRoute(1, wallRemoved) && hasRoute(2, wallRemoved)) {
                valid.push(id);
            }
        }
    }
    return valid;
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