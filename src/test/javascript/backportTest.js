describe("backport", function() {

    describe("array", function() {
        it("should support forEach on all browsers", function() {
            var sourceArray = [1, 2, 3, 4];
            var accumulator = [];

            sourceArray.forEach(function(e) {
               accumulator.push(e);
            });

            expect(accumulator).toEqual(sourceArray);
        });
    });
});