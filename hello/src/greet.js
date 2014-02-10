"use strict";

module.exports = function (name) {
	return "Hello, " + ((name === undefined) ? "World" : name) + '!';
}; //greet