describe("navigator", function() {

    var navigator = null;

    var originalGetBrowserURL = null;

    var browserURL = null;

    beforeEach(function() {
        navigator = require("navigator");
        originalGetBrowserURL = navigator.getBrowserURL;
        browserURL = "http://localhost";

        navigator.getBrowserURL = function() { return browserURL; };
    });

    afterEach(function() {
        navigator.getBrowserURL = originalGetBrowserURL;
    });

    it("should be available through require.js", function() {
        expect(navigator).not.toBeNull();
    });

    describe("getLocation", function() {

        it("should return null of no hash location is specified in browser url", function() {
            expect(navigator.getLocation()).toBeNull();
        });

        it("should return empty location if only hash but now specific location is specified", function() {
            setInternalLocation("");
            expect(navigator.getLocation()).toEqual("");
        });

        it("should return location if location is specified after hash in URL", function() {
            setInternalLocation("foobar");
            expect(navigator.getLocation()).toEqual("foobar");
        });
    });

    describe("location changed callback", function() {

        it("should be notified eventually after browser location has changed", function() {
            var receivedNotification = null;

            navigator.onLocationChanged(function(event) {
                receivedNotification = event;
            });

            setInternalLocation("foobar");

            waitsFor(function() { return receivedNotification != null; }, "location changed notification to be received", 1000);

            runs(function() {
                expect(receivedNotification.oldLocation).toBeUndefined();
                expect(receivedNotification.newLocation).toEqual("foobar");
            });
        });
    });

    describe("subscriber", function() {

        it("should be notified of initial location", function() {
            setInternalLocation("foobar");

            var receivedNotification = null;

            navigator.subscribe(function(location) {
                receivedNotification = location;
            });

            expect(receivedNotification).toEqual("foobar");
        });

        it("should not be notified if location is undefined", function() {
            var notificationReceived = false;

            navigator.subscribe(function() {
                notificationReceived = true;
            });

            expect(notificationReceived).toEqual(false);
        });

        it("should be notified when location changes", function() {
            var newLocation = null;

            navigator.subscribe(function(location) {
                newLocation = location;
            });

            setInternalLocation("foo");

            waitsFor(function() { return newLocation != null; }, "new location not to be null", 1000);

            runs(function() {
                expect(newLocation).toEqual("foo");
            });
        })

    });

    function setInternalLocation(location) {
        browserURL = "http://localhost/#" + location;
    }

});