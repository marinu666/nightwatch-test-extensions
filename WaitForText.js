var util = require('util');
var events = require('events');


/**
 * Wait for a specified element to load, and then wait until we find a class of the requested named
 *  attached to that element or fail if we hit a timeout
 */
function WaitForText() {
    events.EventEmitter.call(this);
    this.startTimeInMilliseconds = null;
}
util.inherits(WaitForText, events.EventEmitter);

WaitForText.prototype.check = function(element, checkFn, timeout, callback) {
    var self = this;

    this.api.getText(element, function(result) {
        var now = new Date().getTime();
        if(result.status === 0 && checkFn(result.value)) {
            return callback(true, now);
        } else if(now - self.startTime < timeout) {
            setTimeout(function() {
                return self.check(element, checkFn, timeout, callback);
            });
        } else {
            return callback(false);
        }
    });
};


/**
 *
 * @param element - A lookup (xpath css etc) to the element we want to check
 * @param expectedValue - Name of the class to look for
 * @param timeout - Maximum number of milliseconds to wait
 */
WaitForText.prototype.command = function(element, expectedValue, timeout) {
    this.startTime = new Date().getTime();
    var self = this;
    var assertMessage = "";

    if(typeof timeout !== 'number') {
        // not passed, or incorrect value - lets use the default
        timeout = this.api.globals.waitForConditionTimeout;
    }

    var checkFn = function(text) {
        return text == targetText;
    };

    this.check(element, checkFn, timeout, function(result, timeCompleted) {
        if(result) {
            assertMessage = "waitForText: " + element + ". Expected value \"" + expectedValue + "\" was seen. Took " + (timeCompleted - self.startTime) + " ms.";
        } else {
            assertMessage = "waitForText: " + element + ". Gave up waiting for the expected value \"" + expectedValue + "\" after " + timeout + " ms.";
        }

        // Output
        self.client.assertion(result, 'Didn\'t see expected class', 'Saw expected class', assertMessage, true);
        // Complete fn
        self.emit('complete');
    }, timeout);

};

module.exports = WaitForText;