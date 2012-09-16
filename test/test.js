function assertEquals(expected, actual, message) {
    if (expected != actual) {
        throw new Error("Expected " + expected + ", was " + actual + (message ? " : " + message : ""));
    }
}

function assertApproximatelyEquals(expected, actual, delta, message) {
    if (actual < expected - delta || actual > expected + delta) {
        throw new Error("Expected " + actual + " in [" + (expected - delta) + ", " + (expected + delta) + "]" + (message ? " : " + message : ""));
    }
}

function assertTrue(outcome, message) {
    if (!outcome) {
        throw new Error("Expected true" + (message ? " : " + message : ""));
    }
}

function assertNotNull(instance, message) {
    if (!instance) {
        throw new Error("Expected non-null" + (message ? " : " + message : ""));
    }
}

function fail(message) {
    throw new Error("fail()" + (message ? " : " + message : ""));
}

window.onload = function() {
    var testSuite = createTestSuite();

    runTestSuite(testSuite, function(testReports) {
        var passed = 0, failed = 0;
        var failures = "";

        for (var key in testReports) {
            var testReport = testReports[key];

            passed += testReport.passed.length;
            failed += testReport.failures.length;

            for (var i = 0; i < testReport.failures.length; i++) {
                var failure = testReport.failures[i];

                failures += "<br/>" + key + "." + failure.test.name + ": " + failure.cause;
            }
        }

        document.write(passed + " passed, " + failed + " failed" + (failed > 0 ? ": " + failures : ""));

        if (window.onTestsCompleted) {
            window.onTestsCompleted({
                passed: passed,
                failed: failed,
                testReports: testReports
            });
        }
    });
};

function createTestSuite() {
    var testFixtures = [];
    var suiteSuffix = "Test";

    for (var propertyName in window) {
        if (propertyName.length > suiteSuffix.length && propertyName.indexOf(suiteSuffix) == propertyName.length - suiteSuffix.length) {
            var testFixtureDef = window[propertyName];
            var testFixtureSpec = {
                def: testFixtureDef,
                setUp: function() { if (testFixtureDef.setUp) testFixtureDef.setUp(); },
                tearDown: function() { if (testFixtureDef.tearDown) testFixtureDef.tearDown();  },
                name: propertyName,
                tests: []
            };

            for (var testCaseName in testFixtureDef) {
                if (testCaseName.indexOf("test") == 0) {
                    testFixtureSpec.tests.push({
                        name: testCaseName,
                        testFunction: testFixtureDef[testCaseName]
                    });
                }
            }

            testFixtures.push(testFixtureSpec);
        }
    }

    return {
        testFixtures: testFixtures
    };
}

function runTestSuite(testSuite, callback) {
    var testFixtureIndex = 0;
    var testReports = {};

    var callRunTestFixture = function() {
        if (testFixtureIndex >= testSuite.testFixtures.length) {
            callback(testReports);
        } else {
            var testFixture = testSuite.testFixtures[testFixtureIndex++];

            runTestFixture(testFixture, function(testReport) {
                testReports[testFixture.name] = testReport;
                callRunTestFixture();
            });
        }
    };

    callRunTestFixture();
}

function runTestFixture(testFixture, callback) {
    var testReport = {
        passed: [],
        failures: []
    };

    var currentTestIndex = 0;

    var runNextTest = function() {
        if (currentTestIndex == testFixture.tests.length) {
            callback(testReport);
            return;
        }

        var currentTest = testFixture.tests[currentTestIndex++];

        var testContext = {
            async: {
                spinOff: function(timeout) {
                    if (this._done) {
                        return;
                    }

                    this._enabled = true;

                    var thiz = this;

                    this._timeoutHandle = window.setTimeout(function() {
                        testReport.failures.push({ test: currentTest, cause: "Async operation timed out" })
                        testFixture.tearDown();
                        runNextTest();
                    }, timeout);
                },

                done: function() {
                    this._done = true;

                    if (!this._enabled) {
                        return;
                    }

                    if (this._timeoutHandle) {
                        window.clearTimeout(this._timeoutHandle);
                    }

                    testReport.passed.push(currentTest);
                    testFixture.tearDown();
                    runNextTest();
                }
            }
        };

        try {
            testFixture.setUp();

            try {
                currentTest.testFunction.apply(testFixture.def, [testContext]);
            } finally {
                if (!testContext.async._enabled) {
                    testFixture.tearDown();
                }
            }

            if (!testContext.async._enabled) {
                testReport.passed.push(currentTest);
                runNextTest();
            }
        } catch (e) {
            testReport.failures.push({ test: currentTest, cause:e.message });
            runNextTest();
        }
    };

    runNextTest();
}