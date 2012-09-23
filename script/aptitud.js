/// <reference path="jquery-1.8.1.min.js" />
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
        var layoutOptions = { peakAmount: 10, move: move, suppressAnimations: false };

        var grid = new Grid(document.getElementById("viewport"), {
            cellSpacing: 1,
            selectedCell: { column: 0, row: 1 }
        });

        $(".aptitud-page").each(function (index, element) {
            var column = element.getAttribute("data-column");
            var row = element.getAttribute("data-row");
            var bookmark = element.getAttribute("data-bookmark");

            grid.setCellContent(column, row, element, true);

            if (bookmark) {
                ctx.getNavigator().subscribe(bookmark, function tmp() {
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

        calendar.displayWithRandomizedLayout(document.getElementById("calendar-container"), {
            onClick: function(e) {
                window.open(e.event.link);
            }
        });

        calendar.loadFeed({
            calendarId: "oarn29ir2vm2kjfaa5vof7qicg@group.calendar.google.com",
            orderBy: "starttime",
            maxResults: 5,
            futureEvents: true,
            singleEvents: true,
            sortOrder: "ascending"
        });
    })(AptitudContext);


    /*var updateViewport = function() {
        $("#viewport").css("left", "0px").css("top", "0px").css("width", $(window).width() + "px").css("height", $(window).height() + "px");
    };

    onLayoutRequested(updateViewport);

    updateViewport();*/

    $(".aptitud-page").each(function (index, element) {
        $(element).css("visibility", "visible");
    });
});

// Tour
//

var isTourRunning = false;

function launchTour() {

    if (isTourRunning) {
        return;
    }
    else {
        isTourRunning = true;
    }

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
    };

    setCursorStyle("wait");

    var showScreen = function() {
        AptitudContext.getNavigator().navigate(path[index++]);

        if (index < path.length) {
            window.setTimeout(showScreen, 6000);
        }
        else {
            setCursorStyle("auto");
            isTourRunning = false;
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
var randoms = [
    0.3, 1, 0.97, 0.66, 0.97, 0.61, 0.39, 0.25, 0.01, 0.83, 0.72, 0.62, 0.04, 0.12, 0.37,
    0.85, 0.64, 0.61, 0.69, 0.53, 0.76, 0.68, 0.51, 0.43, 0.48, 0.45, 0.65, 0.12, 0.01,
    0.37, 0.43, 0.05, 0.62, 0.7, 0.44, 0.41, 0.41, 0.12, 0.04, 0.98, 0.48, 0.82, 0.37,
    0.82, 0.98, 0.66, 0.5, 0.78, 0.11, 0.25, 0.79, 0.52, 0.1, 0.7, 0.26, 0.55, 0.94,
    0.16, 0.82, 0.38, 0.88, 0.76, 0.31, 0.72, 0.13, 0.37, 0.43, 0.06, 0.12, 0.04, 0.14,
    0.76, 0.48, 0.28, 0.05, 0.51, 0.8, 0.75, 0.82, 0.39, 0.87, 0.19, 0.79, 0.51, 0, 0.22,
    0.36, 0.35, 0.46, 0.11, 0.84, 0.28, 0.15, 0.11, 0.98, 0.3, 0.89, 0.29, 0.93, 0.02, 0.61,
    0.31, 0.07, 0.46, 0.24, 0.18, 0.67, 0.61, 0.93, 0.27, 0.73, 0.77, 0.94, 0.17, 0.8, 0.76,
    0.96, 0.3, 0.74, 0.67, 0.7, 0.86, 0.73, 0.68, 0.55, 0.5, 0.83, 0.13, 0.66, 0.86, 0.97,
    0.5, 0.2, 0.64, 0.42, 0.48, 0.9, 0.4, 0.1, 0.25, 0.85, 0.32, 0.5, 0.63, 0.84, 0.67, 0.06,
    0.67, 0.49, 0.33, 0.53, 0.44, 0.3, 0.41, 0.7, 0.29, 0.31, 0.65, 0.13, 0.51, 0.15, 0.34,
    0.25, 0.35, 0.76, 0.33, 0.63, 0.29, 0.09, 0.53, 0.68, 0.41, 0.22, 0.26, 0.25, 0.27, 0.18,
    0, 0.57, 0.1, 0.95, 0.35, 0.26, 0.22, 0.45, 0.57, 0.28, 0.52, 0.44, 0.19, 0.13, 0.71, 0.94,
    0.99, 0.45, 0.6, 0.84, 0.15, 0.42, 0.05
];

var currentRandom = 0;

var nextRandom = function (min, max) {
    return min + (max - min) * randoms[currentRandom++ % randoms.length];
};

// Manage layout

window._layoutCallbacks = [];

function updateLayout() {
    window._layoutCallbacks.forEach(function(callback) {
        callback();
    });
}

window["onorientationchange" in window ? "onorientationchange" : "onresize"] = function() {
    updateLayout();
};

function onLayoutRequested(callback) {
    window._layoutCallbacks.push(callback);
}

/** Blogg */

$(function() {
    $.getJSON("http://aptitud-sthlm.tumblr.com/api/read/json?callback=?",
        function (data) {

            var text = data.posts[0]["regular-body"];
            var bloggPreviewElement = $("#start-blog-preview");

            // This is one way to remove html...
            bloggPreviewElement.css("visibility", "hidden");
            bloggPreviewElement.html(text);
            bloggPreviewElement.text(bloggPreviewElement.text());
            bloggPreviewElement.css("visibility", "visible");

            $.each(data.posts, function (i, posts) {
                var blogtext = this["regular-body"];
                $('#posts').append(blogtext);
            });
        });
});


/** Home buttons **/

$(function() {
    ["#blogPage", "#calendarPage", "#aptitudDayPage", "#fellowPage", "#philosophyPage"].forEach(function(name) {
        var parent = $(name);

        var homeButtonImage = (function() {
            var img = document.createElement("img");
            img.src = "images/homeknapp_mini.png";
            img.className = "home-button";

            img.onclick = function() {
                AptitudContext.getNavigator().navigate("hem");
            };

            return img;
        })();

        homeButtonImage.onload = function() {
            var layout = function() {
                $(homeButtonImage)
                    .css("left", (parent.width()/2 - homeButtonImage.width/2) + "px")
                    .css("top", (parent.height() - homeButtonImage.height - 20) + "px");
            };

            parent.append(homeButtonImage);
            layout();

            onLayoutRequested(layout);
        };
    });
});

/** Coworker portraits **/

// RUN ON: NAVIGATOR.ONBEFORE("vi")

$(function() {

    var refContainer = $("#fellow-board");
    var container = $("<div>").addClass("portrait-container");
    var portraits = [];

    refContainer.append(container);

    var layout = function() {
        var layoutSize = {
            width: refContainer.width(),
            height: refContainer.height()
        };

        var spacingX = layoutSize.width * 0.07, spacingY = layoutSize.height * 0.07;

        var maxWidth = Math.min(Math.round(refContainer.width() * 0.15), 200), maxHeight = Math.min(Math.round(refContainer.height() * 0.15 * Math.pow(2, layoutSize.height / layoutSize.width)), 200);
        var currentX = spacingX, currentY = spacingY, maxY = 0;
        var totalMaxX = 0, totalMaxY = 0;

        portraits.forEach(function(portrait) {
            if (maxWidth > maxHeight) {
                portrait.style.width = maxWidth + "px";
                portrait.style.height = maxWidth + "px";
            } else {
                portrait.style.height = maxHeight + "px";
                portrait.style.width = maxHeight + "px"
            }

            if (currentX + $(portrait).width() > layoutSize.width) {
                currentX = spacingX;
                currentY += maxY + spacingY;
                maxY = 0;
            }

            with (portrait.style) {
                left = Math.max(0, (currentX + nextRandom(-spacingX/2, spacingX/2))) + "px";
                top = Math.max(0, (currentY + nextRandom(-spacingY/2, spacingY/2))) + "px";
            }

            currentX += $(portrait).width() + spacingX;

            maxY = Math.max(maxY, $(portrait).height());

            totalMaxX = Math.max(currentX, totalMaxX);
            totalMaxY = Math.max(currentY + maxY, totalMaxY);
        });

        container.css("width", totalMaxX + "px");
        container.css("height", totalMaxY + "px");
    };

    var portraitNames = ["andlow", "andnil", "davblo", "fresta", "gusdah", "medarb1_200pix", "medarb2_200pix", "tomnas"];

    portraitNames.forEach(function(name) {
        var portrait = document.createElement("img");
        portrait.className = "portrait";
        portrait.src = "images/medarbetare/200/" + name + ".png";
        portrait.onload = function() {
            var portraitLayer = $("<div>").addClass("portrait").css("position", "absolute").append($(portrait));

            portraits.push(portraitLayer.get(0));

            createSticker(portraitLayer.get(0));
            rotate(portraitLayer.get(0), nextRandom(-4, 4));

            container.append(portraitLayer);

            if (portraits.length == portraitNames.length) {
                layout();
            }
        }
    });

    onLayoutRequested(layout);
});
