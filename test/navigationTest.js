describe("navigator", function() {

    var navigator;

    var setHashLocation = function(location) {
        window.location.hash = location;
    };

    beforeEach(function() {
        navigator = new Navigator();

        // Ensure that window location is set to root
        setHashLocation("");
    });

    it("should understand the browser's location", function() {
        expect(navigator.getLocation()).toEqual("");

        setHashLocation("foobar");

        expect(navigator.getLocation()).toEqual("foobar");
    });
});