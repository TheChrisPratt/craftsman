"use strict";

var greet = require("../src/greet");

describe("greet",function() {
	it("should greet the given name",function() {
		expect(greet("Chris")).toEqual("Hello, Chris!");
	});
	it("should greet everyone if no name is given",function() {
		expect(greet()).toEqual("Hello, World!");
	});
});