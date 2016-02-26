var util = require('util');
var events = require('events');


/**
 * Wait for a specified element to load, and then wait until we find a class of the requested named
 *  attached to that element or fail if we hit a timeout
 */
function WaitForClass() {
    events.EventEmitter.call(this);
    this.startTimeInMilliseconds = null;
}
util.inherits(WaitForClass, events.EventEmitter);


/**
 *
 * @param element - A lookup (xpath css etc) to the element we want to check
 * @param className - Name of the class to look for
 * @param timeout - Maximum number of milliseconds to wait
 */
WaitForClass.prototype.command = function(element, className, timeout) {
    this.startTime = new Date().getTime();
    var self = this;
    var assertMessage = "";

    if(typeof timeout !== 'number') {
        // not passed, or incorrect value - lets use the default
        timeout = this.api.globals.waitForConditionTimeout;
    }

    var checkFn = function(classList) {
        var i = classList.length;
        while (i--) {
            if (classList[i] == className) {
                return true;
            }
        }
        return false;
    };

    this.check(element, checkFn, timeout, function(result, timeCompleted) {
        if(result) {
            assertMessage = "waitForClass: " + element + ". Expected class \"" + className + "\" was seen. Took " + (timeCompleted - self.startTime) + " ms.";
        } else {
            assertMessage = "waitForClass: " + element + ". Gave up waiting for the expected class \"" + className + "\" after " + timeout + " ms.";
        }

        self.client.assertion(result, 'expression false', 'expression true', assertMessage, true);
        self.emit('complete');
    }, timeout);

};

WaitForClass.prototype.check = function(element, checkFn, timeout, callback) {
    var self = this;

    this.api.getAttribute(element, 'class', function(result) {
        var now = new Date().getTime();
        if(result.status === 0 && checkFn(result.value.split(' '))) {
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

module.exports = WaitForClass;