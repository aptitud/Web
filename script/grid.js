function Grid(container, options) {
    this._container = container;
    this._gridLayer = document.createElement("div");
    this._dimensions = { columns: 0, rows: 0 };
    this._cells = [];
    this._options = (options ? options : {});

    if (!this._options.cellSpacing) {
        this._options.cellSpacing = 0;
    }

    if (this._options.selectedCell) {
        this._selectedCell = this._options.selectedCell;
    }

    if (!this._options.getCellSize) {
        var thiz = this;
        this._options.getCellSize = function() {
            var dimensions = thiz.getDimensions();
            var cellSpacing = thiz._options.cellSpacing;

            return {
                width: $(thiz._gridLayer).width() / dimensions.columns - Math.max(0, cellSpacing * (dimensions.columns - 1)),
                height: $(thiz._gridLayer).height() / dimensions.rows - Math.max(0, cellSpacing * (dimensions.rows - 1))
            };
        };
    }

    this._configureGridLayer();
}

Grid.prototype.setOptions = function(options) {
    for (var key in options) {
        this._options[key] = options[key];
    }

    this.doLayout();
};

Grid.prototype._configureGridLayer = function() {
    this._gridLayer.className = "aptitud-grid";

    with (this._gridLayer.style) {
        position = "absolute";
        overflow = "hidden";
    }

    document.body.appendChild(this._gridLayer);
};

Grid.prototype.remove = function() {
    document.body.removeChild(this._gridLayer);
};

Grid.prototype.getGridLayer = function() {
    return this._gridLayer;
};

Grid.prototype.doLayout = function() {
    var dimensions = this.getDimensions();
    var cellSize = this._options.getCellSize();

    for (var column = 0; column < dimensions.columns; column++) {
        for (var row = 0; row < dimensions.rows; row++) {
            var cell = this._cells[_cellKey(column, row)];

            if (cell) {
                this._doLayoutCell(cell, cellSize);
            }
        }
    }
};

Grid.prototype._doLayoutCell = function(cell, cellSize) {
    with (cell.content.style) {
        left = pixels(cell.column * (cellSize.width + this._options.cellSpacing));
        top = pixels(cell.row * (cellSize.height + this._options.cellSpacing));
        width = pixels(cellSize.width);
        height = pixels(cellSize.height);
    }
};

Grid.prototype.getDimensions = function() {
    return {columns: this._dimensions.columns, rows: this._dimensions.rows };

};

Grid.prototype.setCellContent = function(column, row, cellContent, suppressLayout) {
    this._dimensions = {
        columns: Math.max(column + 1, this._dimensions.columns),
        rows: Math.max(row + 1, this._dimensions.rows)
    };

    with (cellContent.style) {
        position = "absolute";
    }

    var cellKey = _cellKey(column, row);
    var oldCell = this._cells[cellKey];

    var newCell = {
        column: column,
        row: row,
        content: cellContent
    };

    this._cells[cellKey] = newCell;

    this._gridLayer.appendChild(cellContent);

    if (!suppressLayout) {
        this.doLayout();
    }

    if (this._selectedCell == oldCell) {
        this.setSelectedCell(null);
    }

    if (this._options.onCellContentChanged) {
        this._options.onCellContentChanged({ oldCell: oldCell, newCell: newCell});
    }
};

Grid.prototype.getSelectedCell = function() {
    return (this._selectedCell ? this._selectedCell : null);
};

Grid.prototype.setSelectedCell = function(location) {
    if (location == null) {
        this._selectedCell = null;
    } else {

        var dimensions = this.getDimensions();

        if (location.column >= dimensions.columns || location.row >= dimensions.rows) {
            throw new Error("Invalid location (" + location.columns + ", " + location.rows + ")");
        }

        this._selectedCell = this._cells[_cellKey(location.column, location.row)];
    }

    if (this._options.onCellSelected) {
        this._options.onCellSelected(this._selectedCell);
    }
};

Grid.prototype.getViewPortSize = function() {
    return {
        width: $(this._container == document.body ? window : this._container).width(),
        height: $(this._container == document.body ? window : this._container).height()
    }
};

// Predefined layouts

/**
 * Fits the grid to the parent container.
 */
Grid.prototype.fitToContainer = function() {
    var thiz = this;

    var update = function() {
        var viewPortSize = thiz.getViewPortSize();

        with (thiz._gridLayer.style) {
            left = pixels(0);
            top = pixels(0);
            width = pixels(viewPortSize.width);
            height = pixels(viewPortSize.height);
        }

        thiz.doLayout();
    };

    $(this._container).resize(update);

    update();
};

/**
 * A layout that makes the selected cell span the entire container. This will also adjust the cell size so
 * it corresponds to the container size.
 *
 * @param options Options for layout.
 */
Grid.prototype.selectedCellVisible = function(options) {
    var thiz = this;

    var setLocation = function(element, x, y, moveOptions) {
        with (element.style) {
            left = pixels(x);
            top = pixels(y);
        }

        if (moveOptions && moveOptions.onComplete) {
            moveOptions.onComplete();
        }
    };

    if (!options.move) {
        options.move = setLocation;
    }

    this._options.getCellSize = function() {
        var peakAmount = (options.peakAmount ? options.peakAmount : 0);
        var dimensions = thiz.getDimensions();
        var cellSpacing = thiz._options.cellSpacing;
        var viewPortSize = thiz.getViewPortSize();

        return {
            width: viewPortSize.width - 2 * peakAmount,
            height: viewPortSize.height - 2 * peakAmount
        }
    };

    var update = function(selectedCell, suppressAnimation) {
        if (!selectedCell) {
            return;
        }

        if (options.suppressAnimations) {
            suppressAnimation = true;
        }

        // var cellSize = { width: $(selectedCell.content).width(), height: $(selectedCell.content).height() };
        var cellSize = thiz._options.getCellSize();
        var positionInGrid = { left: selectedCell.column * (cellSize.width + thiz._options.cellSpacing), top: selectedCell.row * (cellSize.height + thiz._options.cellSpacing) };
        var dimensions = thiz.getDimensions();
        var viewPortSize = thiz.getViewPortSize();

        var padding = {
            leftAndRight: (viewPortSize.width - cellSize.width) / 2,
            topAndBottom: (viewPortSize.height - cellSize.height) / 2
        };

        var mover = (suppressAnimation ? setLocation : options.move);

        mover(thiz._gridLayer, -positionInGrid.left + padding.leftAndRight, -positionInGrid.top + padding.topAndBottom, { timeout: 200 });

        thiz._gridLayer.style.width = pixels((cellSize.width + thiz._options.cellSpacing) * dimensions.columns);
        thiz._gridLayer.style.height = pixels((cellSize.height + thiz._options.cellSpacing) * dimensions.rows);
    };

    this._options.onCellSelected = update;

    update(this._selectedCell, true);

    var onresize = function() {
        // Safari ios quirk...
        document.body.scrollLeft = 0;
        thiz.doLayout();
        update(thiz._selectedCell, true);
    };

    if ("onorientationchange" in window) {
        window.onorientationchange = onresize;
    } else {
        window.onresize = onresize;
    }

    this._container.style.overflow = "hidden";
    this.doLayout(); // Cell size changed
};

Grid.prototype.getCellForLocation = function(x, y) {
    var cellSize = this._options.getCellSize();
    var cellSpacing = this._options.cellSpacing;
    var column = Math.floor(x / (cellSize.width + cellSpacing));
    var row = Math.floor(y / (cellSize.height + cellSpacing));

    return this._cells[_cellKey(column, row)];
};

/**
 * Causes a cell to be selected as the selected cell whenever the cell content is clicked.
 */
Grid.prototype.selectCellOnClick = function() {
    var thiz = this;

    var select = function(cell) {
        return function() {
            if (!thiz._selectedCell || cell.column != thiz._selectedCell.column || cell.row != thiz._selectedCell.row) {
                thiz.setSelectedCell({ column: cell.column, row: cell.row });
            }
        }
    };

    for (var key in this._cells) {
        var cell = this._cells[key];

        $(cell.content).mousedown(select(cell));
    }

    this.setOptions({ onCellContentChanged: function(e) {
        if (e.oldCell) {
            $(e.oldCell.content).unbind("mousedown");
        }

        if (e.newCell) {
            $(e.newCell.content).mousedown(select(e.newCell));
        }
    }});

};

// Utilities
//

function _cellKey(column, row) {
    return "(" + column + ", " + row + ")";
}

function pixels(num) {
    return Math.round(num) + "px";
}