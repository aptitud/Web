// Tour
//

function launchTour() {
    var path = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 0, y: 2 },
        { x: 0, y: 1 }
    ];

    var index = 0;

    var showScreen = function() {
        var vertex = path[index++];

        APTITUD_GRID.setSelectedCell(vertex.x, vertex.y , false, function() {
            if (index < path.length) {
                window.setTimeout(showScreen, 6000);
            }
        });
    };

    showScreen();
}

// Layout
//

var APTITUD_GRID = null;

function init() {
    _initGrid();
    _initStickers();
}

function _initStickers() {
    $(".sticker").each(function(index, element) {
        var rotation = element.getAttribute("data-rotation");

        if (rotation) {
            element.style["transform"] = "rotate(" + rotation + "deg)";
            element.style["-ms-transform"] = "rotate(" + rotation + "deg)";
            element.style["-webkit-transform"] = "rotate(" + rotation + "deg)";
            element.style["-o-transform"] = "rotate(" + rotation + "deg)";
            element.style["-moz-transform"] = "rotate(" + rotation + "deg)"
        }
    });
}

function doLayout() {
    APTITUD_GRID.doLayout();
}

function _initGrid() {
    APTITUD_GRID = new Grid(document.body, {
        cellSpacing: 1,
        selectedCell: { column: 0, row: 1 }
    });

    $(".aptitud-page").each(function (index, element) {
        var page = element;
        var column = page.getAttribute("data-column");
        var row = page.getAttribute("data-row");

        APTITUD_GRID.setCellContent(column, row, page, true);
    });

    APTITUD_GRID.selectedCellVisible({ peakAmount: 15, move: move });
    APTITUD_GRID.selectCellOnClick();

    $(".aptitud-page").each(function (index, element) {
        $(element).css("visibility", "visible");
    });
}
