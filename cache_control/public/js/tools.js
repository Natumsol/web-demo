define(["jquery"], function($){
	function add(str, color){
		$("body").append($("<div>").text(str).css({"color": color}));
	}
	return {
		add: add
	}
});