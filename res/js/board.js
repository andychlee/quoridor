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

    registerListeners();
    var piece_1 = document.createElement()
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

}

function squareEnter() {
    $(this).addClass("square-hover");
}

function squareExit() {
    //$(this).removeClass("square-hover");
}

/*"name": "Launch index.html (disable sourcemaps)",
"type": "chrome",
"request": "launch",
"sourceMaps": false,
"file": "${workspaceRoot}/index.html"*/