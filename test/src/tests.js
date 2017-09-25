import Popup from "../../src/index";

// Expose the popup objects so we can play around with them in the console
var popups = {};

function test(id, text_template, callback) {
	var el = document.getElementById(id);
	if (el == null) return console.error("Element #" + id + " not found!");

	var popup = Popup()
		.container(el);
	if (callback) callback(popup);

	el.addEventListener("mousemove", function(e) {
		var x = e.clientX, y = e.clientY;
		popup.point(x, y).html(text_template(x, y)).draw();
	}, false);
	el.addEventListener("mouseout", function(e) {
		popup.hide();
	}, false);

	popups[id] = popup;
}

function muchText(n) {
	var much_text = "";
	for (var i = 0; i < n; i++) {
		much_text += "This is some additional text to fill up the bubble. ";
	}

	return function(x, y) {
		return "Mouse at (" + x + "," + y + "). " + much_text;
	};
}

document.addEventListener("DOMContentLoaded", function() {
	var much0 = muchText(0), much4 = muchText(4), much8 = muchText(8), much15 = muchText(15);
	test("test1", much0);
	test("test2", much8, function(popup) { popup.maxWidth("60%"); });
	test("test3", much15);
	test("test4", much15, function(popup) { popup.fallbackFit("vertical"); });
	test("test5", much15, function(popup) { popup.directions(["bottomFlexible"]); });
	test("test6", much15, function(popup) { popup.directions(["leftFlexible"]); });
	test("test7", much15, function(popup) { popup.directions(["topFlexible"]); });
	test("test8", much15, function(popup) { popup.directions(["rightFlexible"]); });
	test("test9", much15, function(popup) { popup.directions(["leftFlexible", "rightFlexible"]); });
	test("test10", much8, function(popup) { popup.container(document.querySelector("#test10 .inner")); });
	test("test11", much4);
});
