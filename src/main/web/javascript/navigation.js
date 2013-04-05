function Navigator() {
    this._subscribers = {};
    this._lastKnownHash = window.location.hash;

    this._monitorHash();
}

Navigator.prototype._monitorHash = function() {
    var thiz = this;

    this._hashMonitor = window.setInterval(function() {
        if (window.location.hash != thiz._lastKnownHash) {
            thiz._lastKnownHash = window.location.hash;

            thiz._hashChanged();
        }
    }, 100);
};

Navigator.prototype.dispose = function() {
    window.clearInterval(this._hashMonitor);
};

Navigator.prototype._hashChanged = function() {
    this.notifySubscribers(this.getLocation());
};

Navigator.prototype.notifySubscribers = function(name) {
    var subscriber = this._subscribers[name];

    if (subscriber) {
        subscriber(name);
    }
};

Navigator.prototype.getLocation = function() {
    var hash = window.location.hash;

    if (hash && hash.charAt(0) == "#") {
        return hash.substring(1);
    }

    return hash;
};

Navigator.prototype.subscribe = function(name, callback) {
    this._subscribers[name] = callback;
};

Navigator.prototype.navigate = function(name) {
    var newHash = "#" + name;

    if (newHash != this._lastKnownHash) {
        this._lastKnownHash = newHash;

        window.location.hash = this._lastKnownHash;

        this.notifySubscribers(name);
    }
};