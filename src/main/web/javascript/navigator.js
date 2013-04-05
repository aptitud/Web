define("navigator", function() {
    var locationChangedCallbacks = [];

    var def = {
        getLocation: function() {
            var browserURL = this.getBrowserURL();
            var n = browserURL.indexOf("#");

            if (n == -1) {
                return null;
            }

            return browserURL.substring(n + 1);
        },

        onLocationChanged: function(callback) {
            locationChangedCallbacks.push(callback);
        },

        subscribe: function(subscriber) {
            var currentLocation = this.getLocation();

            if (currentLocation) {
                subscriber(currentLocation);
            }

            this.onLocationChanged(function(e) {
                subscriber(e.newLocation);
            });
        },

        getBrowserURL: function() {
            return window.location.href;
        }
    };

    window.setInterval(function() {
        var currentLocation = def.getLocation();

        if (currentLocation != this.oldLocation) {
            var event = { oldLocation: this.oldLocation, newLocation: currentLocation };

            this.oldLocation = currentLocation;

            locationChangedCallbacks.forEach(function(e) {
                e(event);
            });
        }
    }, 100);

    return def;
});