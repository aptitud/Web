function Calendar() {

}

Calendar.prototype.addEntriesFromFeed = function(loader) {
    var thiz = this;
    loader.load({
        error: function() { },
        success: function(data) {
            data.feed.entry.forEach(function(entry) {
                alert("Entry: " + entry.summary.$t);
            });
        }
    })
};