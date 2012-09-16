// Main context
//

var AptitudContext = null;

function createAptitudContext() {
    return {
        _navigator: new Navigator(),

        _grid: null,

        getNavigator: function() { return this._navigator; },

        getGrid: function() { return this._grid; }
    }
}

$(function() {
    AptitudContext = createAptitudContext();

    AptitudContext._grid = (function(ctx) {
        var layoutOptions = { peakAmount: 20, move: move, suppressAnimations: false };

        var grid = new Grid(document.body, {
            cellSpacing: 1,
            selectedCell: { column: 0, row: 1 }
        });

        $(".aptitud-page").each(function (index, element) {
            var column = element.getAttribute("data-column");
            var row = element.getAttribute("data-row");
            var bookmark = element.getAttribute("data-bookmark");

            grid.setCellContent(column, row, element, true);

            if (bookmark) {
                ctx.getNavigator().subscribe(bookmark, function() {
                    grid.setSelectedCell({ column: column, row: row });
                });

                $(element).mousedown(function() {
                    ctx.getNavigator().navigate(bookmark);
                });
            }
        });

        layoutOptions.suppressAnimations = false;

        try {
            AptitudContext.getNavigator().notifySubscribers(AptitudContext.getNavigator().getLocation());
        } finally {
            layoutOptions.suppressAnimations = false;
        }

        grid.selectedCellVisible(layoutOptions);

        return grid;
    })(AptitudContext);

    // Need dynamic init
    _initStickers();



    $(".aptitud-page").each(function (index, element) {
        $(element).css("visibility", "visible");
    });
});

// Tour
//

function launchTour() {
    var path = [
        "kalender",
        "aptituddagen",
        "vi",
        "filosofi",
        "blogg",
        "hem"
    ];

    var index = 0;

    var showScreen = function() {
        AptitudContext.getNavigator().navigate(path[index++]);

        if (index < path.length) {
            window.setTimeout(showScreen, 6000);
        }
    };

    showScreen();
}

// Layout
//

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

        /*var tape = document.createElement("img");
        tape.src = "images/tejp.png";

        with (tape.style) {
            position = "absolute";
            left = ($(element).position().left + $(element).width()/2) + "px";
            top = $(element).position().top + "px";
        }

        element.parentNode.appendChild(tape);*/
    });
}
