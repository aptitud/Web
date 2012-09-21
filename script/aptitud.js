// Main context
//

var AptitudContext = null;

function createAptitudContext() {
    return {
        _navigator: new Navigator(),

        _grid: null,

        _calendar: null,

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

    AptitudContext._calendar = (function(ctx) {
        var calendar = new Calendar();

        calendar.displayWithRandomizedLayout(document.getElementById("calendar-container"));

        calendar.loadFeed({
            calendarId: "oarn29ir2vm2kjfaa5vof7qicg@group.calendar.google.com",
            orderBy: "starttime",
            maxResults: 5,
            futureEvents: true,
            singleEvents: true,
            sortOrder: "ascending"
        });
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

    var setCursorStyle = function(cursorStyle) {
        document.body.style.cursor = cursorStyle;
    }

    setCursorStyle("wait");

    var showScreen = function() {
        AptitudContext.getNavigator().navigate(path[index++]);

        if (index < path.length) {
            window.setTimeout(showScreen, 6000);
        }
        else {
            setCursorStyle("auto");
        }
    };

    showScreen();
}

// Layout
//

function createSticker(element) {
    var tejp = document.createElement("img");

    tejp.src = "images/tejp.png";

    tejp.onload = function() {
        with(tejp.style) {
            left = ($(element).width() / 2 - tejp.width/2) + "px";
            top = (-tejp.height/2) + "px";
            position = "absolute";
        }

        element.appendChild(tejp);
    };
}

function _initStickers() {
    $(".sticker").each(function(index, element) {
        var rotation = element.getAttribute("data-rotation");

        if (rotation) {
            rotate(element, rotation);
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

function rotate(element, rotation) {
    element.style["transform"] = "rotate(" + rotation + "deg)";
    element.style["-ms-transform"] = "rotate(" + rotation + "deg)";
    element.style["-webkit-transform"] = "rotate(" + rotation + "deg)";
    element.style["-o-transform"] = "rotate(" + rotation + "deg)";
    element.style["-moz-transform"] = "rotate(" + rotation + "deg)";
}

// Util
//

// Not possible to provide seed in JavaScript (?). Just keep it simple, not important...
var randoms = [0.3, 1, 0.97, 0.66, 0.97, 0.61, 0.39, 0.25, 0.01, 0.83, 0.72, 0.62, 0.04, 0.12, 0.37, 0.85, 0.64, 0.61, 0.69, 0.53, 0.76, 0.68, 0.51, 0.43, 0.48, 0.45, 0.65, 0.12, 0.01, 0.37, 0.43, 0.05, 0.62, 0.7, 0.44, 0.41, 0.41, 0.12, 0.04, 0.98, 0.48, 0.82, 0.37, 0.82, 0.98, 0.66, 0.5, 0.78, 0.11, 0.25, 0.79, 0.52, 0.1, 0.7, 0.26, 0.55, 0.94, 0.16, 0.82, 0.38, 0.88, 0.76, 0.31, 0.72, 0.13, 0.37, 0.43, 0.06, 0.12, 0.04, 0.14, 0.76, 0.48, 0.28, 0.05, 0.51, 0.8, 0.75, 0.82, 0.39, 0.87, 0.19, 0.79, 0.51, 0, 0.22, 0.36, 0.35, 0.46, 0.11, 0.84, 0.28, 0.15, 0.11, 0.98, 0.3, 0.89, 0.29, 0.93, 0.02, 0.61, 0.31, 0.07, 0.46, 0.24, 0.18, 0.67, 0.61, 0.93, 0.27, 0.73, 0.77, 0.94, 0.17, 0.8, 0.76, 0.96, 0.3, 0.74, 0.67, 0.7, 0.86, 0.73, 0.68, 0.55, 0.5, 0.83, 0.13, 0.66, 0.86, 0.97, 0.5, 0.2, 0.64, 0.42, 0.48, 0.9, 0.4, 0.1, 0.25, 0.85, 0.32, 0.5, 0.63, 0.84, 0.67, 0.06, 0.67, 0.49, 0.33, 0.53, 0.44, 0.3, 0.41, 0.7, 0.29, 0.31, 0.65, 0.13, 0.51, 0.15, 0.34, 0.25, 0.35, 0.76, 0.33, 0.63, 0.29, 0.09, 0.53, 0.68, 0.41, 0.22, 0.26, 0.25, 0.27, 0.18, 0, 0.57, 0.1, 0.95, 0.35, 0.26, 0.22, 0.45, 0.57, 0.28, 0.52, 0.44, 0.19, 0.13, 0.71, 0.94, 0.99, 0.45, 0.6, 0.84, 0.15, 0.42, 0.05];
var currentRandom = 0;
var nextRandom = function (min, max) {
    return min + (max - min) * randoms[currentRandom++ % randoms.length];
};

// Manage layout

window._layoutCallbacks = [];

window["onorientationchange" in window ? "onorientationchange" : "onresize"] = function() {
    window._layoutCallbacks.forEach(function(callback) {
        callback();
    });
};

function onLayoutRequested(callback) {
    window._layoutCallbacks.push(callback);
}