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

    createPieces();
    registerListeners();
    var graph = initializeGraph();
    
}

// Registers listeners
function registerListeners() {
    $(".square").click(function () {
        console.log("Clicked square: " + $(this).attr("id"));
    });
    $(".square").hover(squareEnter, squareExit);
    $(".v-groove").click(function() {
        console.log("Hovered v-groove: " + $(this).attr("id"));
    });
    $(".v-groove").hover(function() {
        console.log("Hovered v-groove: " + $(this).attr("id"));
    });
    $(".h-groove").click(function() {
        console.log("Hovered h-groove: " + $(this).attr("id"));
    });
    $(".h-groove").hover(function() {
        console.log("Hovered h-groove: " + $(this).attr("id"));
    });
    $(".player-piece").on("click", function() {
        console.log("Clicked player piece");
        
        var row = parseInt($(this).attr("row"));
        var col = parseInt($(this).attr("col"));
        var up = document.getElementById((row - 2) + "-" + col);
        var down = document.getElementById((row + 2) + "-" + col);
        var left = document.getElementById(row + "-" + (col - 2));
        var rigth = document.getElementById(row + "-" + (col + 2));
        console.log("Located at " + row + "-" + col);
    });

}


function createPieces() {
    var piece_1 = document.createElement("div");
    piece_1.setAttribute("class", "player-piece");
    piece_1.setAttribute("id", "player-one");
    piece_1.setAttribute("row", "0");
    piece_1.setAttribute("col", "8");
    var loc_1 = document.getElementById("0-8");
    loc_1.appendChild(piece_1);

    var piece_2 = document.createElement("div");
    piece_2.setAttribute("class", "player-piece");
    piece_2.setAttribute("id", "player-two");
    piece_2.setAttribute("row", "16");
    piece_2.setAttribute("col", "8");
    var loc_2 = document.getElementById("16-8");
    loc_2.appendChild(piece_2);
}

function squareEnter() {
    //$(this).addClass("square-hover");
}

function squareExit() {
    //$(this).removeClass("square-hover");
}

// Returns an initialized graph of the board
// Maybe not make it return, but actually change
function initializeGraph() {
    var graph = new Map();

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
            graph.set(id, edges);
        }
    }

    graph.set("0-0", ["0-2", "2-0"] );

    return graph;
}