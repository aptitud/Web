function Calendar(options) {
    this._entries = [];
    this._options = (options ? options : {});
}

Calendar.prototype.setOptions = function(options) {
    for (var key in options) {
        this._options[key] = options[key];
    }
};

Calendar.prototype.getEntries = function() {
    return this._entries;
};

Calendar.prototype.loadFeed = function(options) {
    var thiz = this;

    this._loadURL(Calendar._calendarFeedURL(options), function(result) {
        var newEntries = [];

        for (var i = 0; i < result.feed.entry.length; i++) {
            var entry = result.feed.entry[i];

            newEntries.push({
                id: entry.id.$t,
                title : entry.title.$t,
                content: entry.content.$t,
                when: { from: new Date(entry.gd$when[0].startTime), to: new Date(entry.gd$when[0].endTime) },
                _definition: result

            });
        }

        thiz._entries.push.apply(thiz._entries, newEntries);

        if (thiz._options.onEventsAdded) {
            thiz._options.onEventsAdded(newEntries);
        }
    });
};

Calendar.prototype._loadURL = function(url, callback) {
    $.get(url, callback);
};

Calendar._calendarFeedURL = function(options) {
    if (!options.calendarId) {
        throw new Error("Calendar ID must be specified");
    }

    var url = "http://www.google.com/calendar/feeds/" + options.calendarId + "/public/full?alt=json";

    if ("orderBy" in options) {
        url += "&orderby=" + options.orderBy;
    }

    if ("maxResults" in options) {
        url += "&max-results=" + options.maxResults;
    }

    if ("singleEvents" in options) {
        url += "&singleevents=" + options.singleEvents;
    }

    if ("sortOrder" in options) {
        url += "&sortorder=" + options.sortOrder;
    }

    if ("futureEvents" in options) {
        url += "&futureevents=true"
    }

    // return "http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg@group.calendar.google.com/public/full?alt=json&orderby=starttime&max-results=5&singleevents=true&sortorder=ascending&futureevents=true";

    return url;
};

function toConvenientDateFormat(date) {
    var months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
    var pad = function(str, len, prefix) {
        while (str.length < len) {
            str = prefix + str;
        }

        return str;
    };

    return date.getDay() + (function() {
        var day = date.getDay();

        if (day >= 10 || day <= 20) {
            return ":e";
        }

        switch (day % 10) {
            case 1:
            case 2:
                return ":a";
            default:
                return ":e";
        }
    })() + " " + months[date.getMonth()] + " " + pad(date.getHours().toString(), 2, "0") + ":" + pad(date.getMinutes().toString(), 2, "0");

}

Calendar.prototype.displayWithRandomizedLayout = function(container) {
    if (container == null) {
        throw new Error("A valid container must be provided");
    }

    var eventViews = {};
    var thiz = this;

    var attachToEvent = function(event) {
        var eventView = $("<div>")
            .addClass("aptitud-calendar-event")
            .css("position", "absolute")
            .append($("<div>").addClass("content")
                .append($("<div>").addClass("title").text(event.title))
                .append($("<div>").text(event.content))
                .append($("<div>").addClass("time").text(toConvenientDateFormat(event.when.from))));

        eventViews[event.id] = eventView.get(0);

        rotate(eventView.get(0), nextRandom(-3, 3));

        $(container).append(eventView);

        createSticker(eventView.get(0));
    };

    var updateLayout = function() {
        var containerSize = {
            width: $(container).width(),
            height: $(container).height()
        };

        var landscape = (containerSize.width > containerSize.height);
        var offsetX = 0;
        var previousView = null;
        var maxWidth = containerSize.width / thiz._entries.length;
        var maxY = 0;

        for (var i = 0; i < thiz._entries.length; i++) {
            var entry = thiz._entries[i];
            var view = eventViews[entry.id];

            $(view)
                .css("left", offsetX + "px")
                .css("top", (
                    previousView == null
                        ? 0
                        : (i % 2 == 0
                            ? Math.max($(previousView).position().top - $(view).height() - (landscape ? nextRandom(40, 80) : nextRandom(20, 50)), 0)
                            : $(previousView).position().top + $(previousView).height() + (landscape ? nextRandom(40, 80) : nextRandom(80, 120))
                        )
                ) + "px");

            previousView = view;

            offsetX += Math.min($(view).width(), maxWidth) - 20;

            maxY = Math.max(maxY, $(view).position().top + $(view).height());
        }

        //$(container).css("min-height", (maxY + 50) + "px");
    };

    this.setOptions({onEventsAdded: function(events) {
        events.forEach(attachToEvent);
        updateLayout();
    }});

    this._entries.forEach(function(entry) {
        attachToEvent(entry)
    });

    updateLayout();

    onLayoutRequested(updateLayout);
};