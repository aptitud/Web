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
    APTITUD_GRID.update();
}

function updateSize() {
    APTITUD_GRID._options.pageSize = { width:$(window).width() - 60, height:$(window).height() - 60 };
    doLayout();
}

function _initGrid() {
    APTITUD_GRID = new Grid(document.body, {
        columns:2,
        rows:3,
        pageSize:{ width:$(window).width() - 60, height:$(window).height() - 60 },
        padding:10
    });

    $(".aptitud-page").each(function (index, element) {
        var page = element;
        var column = page.getAttribute("data-column");
        var row = page.getAttribute("data-row");

        APTITUD_GRID.setPage(column, row, page);

        (function (c, r) {
            page.onmousedown = function () {
                APTITUD_GRID.setSelectedCell(c, r);
            };
        })(column, row);
    });

    doLayout();
    APTITUD_GRID.setSelectedCell(0, 1, true);

    $(".aptitud-page").each(function (index, element) {
        $(element).css("visibility", "visible");
    });
}

// Grid (page container)
//

function Grid(root, options) {
    this._root = root;
    this._options = options;
    this._cells = [];

    this._contentPanel = document.createElement("div");
    this._contentPanel.className = "grid-content-panel";
    this._root.appendChild(this._contentPanel);

    this._attachEventListeners();
}

Grid.prototype._attachEventListeners = function () {
    /*var isTouchDevice = ("ontouchend" in document);
     var swipeStart = null;
     var thiz = this;

     $(this._contentPanel).bind(isTouchDevice ? "touchstart" : "mousedown", function (event) {
     swipeStart = {
     x:isTouchDevice ? event.originalEvent.touches[0].pageX : event.pageX,
     y:isTouchDevice ? event.originalEvent.touches[0].pageY : event.pageY
     };

     return false;
     });

     $(this._contentPanel).bind(isTouchDevice ? "touchmove" : "mousemove", function (event) {

     return false;
     });

     $(this._contentPanel).bind(isTouchDevice ? "touchend" : "mouseup", function (event) {
     if (thiz._options.selectedCell) {
     var swipeEnd = {
     x:isTouchDevice ? event.originalEvent.changedTouches[0].pageX : event.pageX,
     y:isTouchDevice ? event.originalEvent.changedTouches[0].pageY : event.pageY
     };

     var deltaX = parseInt(swipeEnd.x) - parseInt(swipeStart.x);
     var deltaY = parseInt(swipeEnd.y) - parseInt(swipeStart.y);

     var horizontalSwipe = (Math.abs(deltaX) < 10 ? 0 : deltaX < 0 ? 1 : -1);
     var verticalSwipe = (Math.abs(deltaY) < 10 ? 0 : deltaY < 0 ? 1 : -1);

     var newColumn = Math.min(Math.max(0, thiz._options.selectedCell.x + horizontalSwipe), thiz._options.columns - 1);
     var newRow = Math.min(Math.max(0, thiz._options.selectedCell.y + verticalSwipe), thiz._options.rows - 1);

     thiz.setSelectedCell(newColumn, newRow);
     }

     return false;
     });*/
};

Grid.prototype.setPage = function (column, row, element) {
    this._contentPanel.appendChild(element);

    this._cells.push({
        element:element,
        row:row,
        column:column
    });
};

Grid.prototype.update = function () {
    if (this._options.selectedCell) {
        this.setSelectedCell(this._options.selectedCell.column, this._options.selectedCell.row, false);
    }

    this.doLayout();
};

Grid.prototype.setSelectedCell = function (column, row, skipAnimate, callback) {
    var pageSize = this._options.pageSize;
    var padding = this._options.padding;

    this._options.selectedCell = {x:parseInt(column), y:parseInt(row)};

    var cellPosition = {
        x:( pageSize.width + padding) * (column) - 30,
        y:( pageSize.height + padding) * (row) - 30
    };

    var newX = cellPosition.x;
    var newY = cellPosition.y;

    if (!skipAnimate) {
        move(this._contentPanel, -newX, -newY, callback);
    } else {
        this._contentPanel.style.left = (-newX) + "px";
        this._contentPanel.style.top = (-newY) + "px";
    }

    for (var i = 0; i < this._cells.length; i++) {
        var cell = this._cells[i];

        cell.element.className = "aptitud-page " + ((cell.row == row && cell.column == column) ? "selected-page" : "unselected-page");
    }
};

Grid.prototype.doLayout = function () {
    var options = this._options;
    var pageSize = options.pageSize;

    with (this._contentPanel.style) {
        position = "absolute";
        width = (options.columns * pageSize.width + options.padding * (options.columns - 1)) + "px";
        height = (options.rows * pageSize.height + (options.padding * (options.rows - 1))) + "px";
    }

    for (var i = 0; i < this._cells.length; i++) {
        var cell = this._cells[i];

        with (cell.element.style) {
            position = "absolute";
            left = (cell.column * (pageSize.width + options.padding)) + "px";
            top = (cell.row * (pageSize.height + options.padding)) + "px";
            width = pageSize.width + "px";
            height = pageSize.height + "px";
        }
    }
};

/** Animation stuff **/

function animate(animation, callback) {
    var frameDuration = 50;

    var animator = function () {
        if (animation()) {
            window.setTimeout(animator, frameDuration);
        } else {
            if (callback) {
                callback();
            }
        }
    };

    window.setTimeout(animator, frameDuration);
}

function move(element, newX, newY, callback) {
    animate(function () {
        var currentX = parseInt(element.style.left == "" ? 0 : element.style.left);
        var currentY = parseInt(element.style.top == "" ? 0 : element.style.top);
        var distanceX = newX - currentX;
        var distanceY = newY - currentY;
        var tempX = (currentX + distanceX / 2);
        var tempY = (currentY + distanceY / 2);
        var proceed = true;

        if (Math.abs(distanceX) <= 5 && Math.abs(distanceY) <= 5) {
            tempX = newX;
            tempY = newY;
            proceed = false;
        }

        element.style.left = (tempX + "px");
        element.style.top = (tempY + "px");

        return proceed;
    }, callback);
}