# Nightwatch Test Extensions
## WaitForClass
Wait for a specified element to load, and then wait until we find a class of the requested named attached to that element or fail if we hit a timeout.
Usage: browser.WaitForClass([css/xpath selector], [class name to find], [optional: timeout in ms])
## WaitForText
Wait for a specified element to load, and then wait until we find the text of the requested value within that element or fail if we hit a timeout
Usage: browser.WaitForText([css/xpath selector], [value to find], [optional: timeout in ms])