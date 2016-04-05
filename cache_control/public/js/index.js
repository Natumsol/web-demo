define(['tools'], function(tools) {
	function init() {
		tools.add("Hello, World!", "red");
		tools.add("Hello, Natumsol!", "blue");
		tools.add("Hello, Express!", "green");
	}
	return {
		init: init
	}
})