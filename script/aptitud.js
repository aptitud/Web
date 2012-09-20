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

        calendar._loadURL = function(url, callback) { callback({"version":"1.0","encoding":"UTF-8","feed":{"xmlns":"http://www.w3.org/2005/Atom","xmlns$openSearch":"http://a9.com/-/spec/opensearchrss/1.0/","xmlns$gCal":"http://schemas.google.com/gCal/2005","xmlns$gd":"http://schemas.google.com/g/2005","id":{"$t":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full"},"updated":{"$t":"2012-09-20T09:51:00.000Z"},"category":[{"scheme":"http://schemas.google.com/g/2005#kind","term":"http://schemas.google.com/g/2005#event"}],"title":{"$t":"Usergroup.se (curated by @xlson @peter_lind @msundb)","type":"text"},"subtitle":{"$t":"A collection off the different developer events that are available in the Stockholm area. The events in the calendar should be geared towards developers and not be focused on product marketing/sales.\n\nKinds of events that fit:\n- Conferences\n- User group meetings\n- Workshops\n\nKnow of any events that should be in the calendar? Contact us on twitter: @xlson @peter_lind @mikaelsundberg!","type":"text"},"link":[{"rel":"alternate","type":"text/html","href":"http://www.google.com/calendar/embed?src=oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com"},{"rel":"http://schemas.google.com/g/2005#feed","type":"application/atom+xml","href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full"},{"rel":"http://schemas.google.com/g/2005#batch","type":"application/atom+xml","href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/batch"},{"rel":"self","type":"application/atom+xml","href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full?alt=json&max-results=5&singleevents=true&futureevents=true&sortorder=ascending&orderby=starttime"},{"rel":"next","type":"application/atom+xml","href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full?alt=json&start-index=6&max-results=5&singleevents=true&futureevents=true&sortorder=ascending&orderby=starttime"}],"author":[{"name":{"$t":"mikael.sundberg82@gmail.com"},"email":{"$t":"mikael.sundberg82@gmail.com"}}],"generator":{"$t":"Google Calendar","version":"1.0","uri":"http://www.google.com/calendar"},"openSearch$totalResults":{"$t":2780},"openSearch$startIndex":{"$t":1},"openSearch$itemsPerPage":{"$t":5},"gCal$timezone":{"value":"Europe/Stockholm"},"gCal$timesCleaned":{"value":0},"gd$where":{"valueString":"Stockholm"},"entry":[{"id":{"$t":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/avvj5648l25hrah7ji8vcbt0dk"},"published":{"$t":"2012-09-17T10:48:12.000Z"},"updated":{"$t":"2012-09-17T10:48:12.000Z"},"category":[{"scheme":"http://schemas.google.com/g/2005#kind","term":"http://schemas.google.com/g/2005#event"}],"title":{"$t":"MongoDb meetup: What's new in 2.2","type":"text"},"content":{"$t":"See http://www.meetup.com/Stockholm-MongoDB-User-Group/events/78381172/","type":"text"},"link":[{"rel":"alternate","type":"text/html","href":"http://www.google.com/calendar/event?eid=YXZ2ajU2NDhsMjVocmFoN2ppOHZjYnQwZGsgb2FybjI5aXIydm0ya2pmYWE1dm9mN3FpY2dAZw","title":"alternate"},{"rel":"self","type":"application/atom+xml","href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/avvj5648l25hrah7ji8vcbt0dk"}],"author":[{"name":{"$t":"Usergroup.se (curated by @xlson @peter_lind @msundb)"}}],"gd$comments":{"gd$feedLink":{"href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/avvj5648l25hrah7ji8vcbt0dk/comments"}},"gd$eventStatus":{"value":"http://schemas.google.com/g/2005#event.confirmed"},"gd$where":[{"valueString":"Valtech"}],"gd$who":[{"email":"oarn29ir2vm2kjfaa5vof7qicg@group.calendar.google.com","rel":"http://schemas.google.com/g/2005#event.organizer","valueString":"Usergroup.se (curated by @xlson @peter_lind @msundb)"}],"gd$when":[{"endTime":"2012-09-20T22:00:00.000+02:00","startTime":"2012-09-20T17:00:00.000+02:00"}],"gd$transparency":{"value":"http://schemas.google.com/g/2005#event.opaque"},"gCal$anyoneCanAddSelf":{"value":"false"},"gCal$guestsCanInviteOthers":{"value":"true"},"gCal$guestsCanModify":{"value":"false"},"gCal$guestsCanSeeGuests":{"value":"true"},"gCal$sequence":{"value":0},"gCal$uid":{"value":"avvj5648l25hrah7ji8vcbt0dk@google.com"}},{"id":{"$t":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/fke22ei9mmeu1f56e8tn0ne0n4"},"published":{"$t":"2012-09-10T12:16:02.000Z"},"updated":{"$t":"2012-09-10T12:16:03.000Z"},"category":[{"scheme":"http://schemas.google.com/g/2005#kind","term":"http://schemas.google.com/g/2005#event"}],"title":{"$t":" FuncProgSTHLM and Campanja presents Switching to Erlang for Fun and Profit!","type":"text"},"content":{"$t":"Berner, the CTO of Campanja, will talk about Campanja's experiences moving to Erlang, how they  ended up doing it, lessons learned and challenges they faced.\n\nhttp://funcprogsthlm-campanja-estw.eventbrite.com/","type":"text"},"link":[{"rel":"alternate","type":"text/html","href":"http://www.google.com/calendar/event?eid=ZmtlMjJlaTltbWV1MWY1NmU4dG4wbmUwbjQgb2FybjI5aXIydm0ya2pmYWE1dm9mN3FpY2dAZw","title":"alternate"},{"rel":"self","type":"application/atom+xml","href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/fke22ei9mmeu1f56e8tn0ne0n4"}],"author":[{"name":{"$t":"Usergroup.se (curated by @xlson @peter_lind @msundb)"}}],"gd$comments":{"gd$feedLink":{"href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/fke22ei9mmeu1f56e8tn0ne0n4/comments"}},"gd$eventStatus":{"value":"http://schemas.google.com/g/2005#event.confirmed"},"gd$where":[{"valueString":"Campanja, Kungsgatan 27"}],"gd$who":[{"email":"oarn29ir2vm2kjfaa5vof7qicg@group.calendar.google.com","rel":"http://schemas.google.com/g/2005#event.organizer","valueString":"Usergroup.se (curated by @xlson @peter_lind @msundb)"}],"gd$when":[{"endTime":"2012-09-20T21:00:00.000+02:00","startTime":"2012-09-20T18:00:00.000+02:00"}],"gd$transparency":{"value":"http://schemas.google.com/g/2005#event.opaque"},"gCal$anyoneCanAddSelf":{"value":"false"},"gCal$guestsCanInviteOthers":{"value":"true"},"gCal$guestsCanModify":{"value":"false"},"gCal$guestsCanSeeGuests":{"value":"true"},"gCal$sequence":{"value":0},"gCal$uid":{"value":"fke22ei9mmeu1f56e8tn0ne0n4@google.com"}},{"id":{"$t":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/21lrstoi00ho13ikr9qgqh04tc"},"published":{"$t":"2012-09-10T20:57:48.000Z"},"updated":{"$t":"2012-09-10T20:57:48.000Z"},"category":[{"scheme":"http://schemas.google.com/g/2005#kind","term":"http://schemas.google.com/g/2005#event"}],"title":{"$t":"Lunch Beat Sthlm","type":"text"},"content":{"$t":"https://www.facebook.com/events/464744356889749/permalink/464773136886871/","type":"text"},"link":[{"rel":"alternate","type":"text/html","href":"http://www.google.com/calendar/event?eid=MjFscnN0b2kwMGhvMTNpa3I5cWdxaDA0dGMgb2FybjI5aXIydm0ya2pmYWE1dm9mN3FpY2dAZw","title":"alternate"},{"rel":"self","type":"application/atom+xml","href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/21lrstoi00ho13ikr9qgqh04tc"}],"author":[{"name":{"$t":"Usergroup.se (curated by @xlson @peter_lind @msundb)"}}],"gd$comments":{"gd$feedLink":{"href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/21lrstoi00ho13ikr9qgqh04tc/comments"}},"gd$eventStatus":{"value":"http://schemas.google.com/g/2005#event.confirmed"},"gd$where":[{"valueString":"Kulturhuset"}],"gd$who":[{"email":"oarn29ir2vm2kjfaa5vof7qicg@group.calendar.google.com","rel":"http://schemas.google.com/g/2005#event.organizer","valueString":"Usergroup.se (curated by @xlson @peter_lind @msundb)"}],"gd$when":[{"endTime":"2012-09-21T13:00:00.000+02:00","startTime":"2012-09-21T12:00:00.000+02:00"}],"gd$transparency":{"value":"http://schemas.google.com/g/2005#event.transparent"},"gCal$anyoneCanAddSelf":{"value":"false"},"gCal$guestsCanInviteOthers":{"value":"true"},"gCal$guestsCanModify":{"value":"false"},"gCal$guestsCanSeeGuests":{"value":"true"},"gCal$sequence":{"value":0},"gCal$uid":{"value":"21lrstoi00ho13ikr9qgqh04tc@google.com"}},{"id":{"$t":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/9ebg3ffu93l879igm2q5t8qlj8"},"published":{"$t":"2012-09-11T15:32:49.000Z"},"updated":{"$t":"2012-09-11T15:32:49.000Z"},"category":[{"scheme":"http://schemas.google.com/g/2005#kind","term":"http://schemas.google.com/g/2005#event"}],"title":{"$t":"Gangnam Style Flashmob","type":"text"},"content":{"$t":"https://www.facebook.com/events/101324233349411/","type":"text"},"link":[{"rel":"alternate","type":"text/html","href":"http://www.google.com/calendar/event?eid=OWViZzNmZnU5M2w4NzlpZ20ycTV0OHFsajggb2FybjI5aXIydm0ya2pmYWE1dm9mN3FpY2dAZw","title":"alternate"},{"rel":"self","type":"application/atom+xml","href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/9ebg3ffu93l879igm2q5t8qlj8"}],"author":[{"name":{"$t":"Usergroup.se (curated by @xlson @peter_lind @msundb)"}}],"gd$comments":{"gd$feedLink":{"href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/9ebg3ffu93l879igm2q5t8qlj8/comments"}},"gd$eventStatus":{"value":"http://schemas.google.com/g/2005#event.confirmed"},"gd$where":[{"valueString":"Plattan"}],"gd$who":[{"email":"oarn29ir2vm2kjfaa5vof7qicg@group.calendar.google.com","rel":"http://schemas.google.com/g/2005#event.organizer","valueString":"Usergroup.se (curated by @xlson @peter_lind @msundb)"}],"gd$when":[{"endTime":"2012-09-23","startTime":"2012-09-22"}],"gd$transparency":{"value":"http://schemas.google.com/g/2005#event.transparent"},"gCal$anyoneCanAddSelf":{"value":"false"},"gCal$guestsCanInviteOthers":{"value":"true"},"gCal$guestsCanModify":{"value":"false"},"gCal$guestsCanSeeGuests":{"value":"true"},"gCal$sequence":{"value":0},"gCal$uid":{"value":"9ebg3ffu93l879igm2q5t8qlj8@google.com"}},{"id":{"$t":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/lqc9mchfsgarrrphhf9m9oaggs"},"published":{"$t":"2012-09-10T20:35:38.000Z"},"updated":{"$t":"2012-09-10T20:35:38.000Z"},"category":[{"scheme":"http://schemas.google.com/g/2005#kind","term":"http://schemas.google.com/g/2005#event"}],"title":{"$t":"Grafdok, grafisk dokumentation","type":"text"},"content":{"$t":"https://groups.google.com/forum/?fromgroups#!forum/grafdok","type":"text"},"link":[{"rel":"alternate","type":"text/html","href":"http://www.google.com/calendar/event?eid=bHFjOW1jaGZzZ2FycnJwaGhmOW05b2FnZ3Mgb2FybjI5aXIydm0ya2pmYWE1dm9mN3FpY2dAZw","title":"alternate"},{"rel":"self","type":"application/atom+xml","href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/lqc9mchfsgarrrphhf9m9oaggs"}],"author":[{"name":{"$t":"Usergroup.se (curated by @xlson @peter_lind @msundb)"}}],"gd$comments":{"gd$feedLink":{"href":"http://www.google.com/calendar/feeds/oarn29ir2vm2kjfaa5vof7qicg%40group.calendar.google.com/public/full/lqc9mchfsgarrrphhf9m9oaggs/comments"}},"gd$eventStatus":{"value":"http://schemas.google.com/g/2005#event.confirmed"},"gd$where":[{"valueString":"Crisp, Sveavägen 31"}],"gd$who":[{"email":"oarn29ir2vm2kjfaa5vof7qicg@group.calendar.google.com","rel":"http://schemas.google.com/g/2005#event.organizer","valueString":"Usergroup.se (curated by @xlson @peter_lind @msundb)"}],"gd$when":[{"endTime":"2012-09-24T20:00:00.000+02:00","startTime":"2012-09-24T17:30:00.000+02:00"}],"gd$transparency":{"value":"http://schemas.google.com/g/2005#event.transparent"},"gCal$anyoneCanAddSelf":{"value":"false"},"gCal$guestsCanInviteOthers":{"value":"true"},"gCal$guestsCanModify":{"value":"false"},"gCal$guestsCanSeeGuests":{"value":"true"},"gCal$sequence":{"value":0},"gCal$uid":{"value":"lqc9mchfsgarrrphhf9m9oaggs@google.com"}}]}}); };

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