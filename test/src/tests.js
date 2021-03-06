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

function setUpOverflowTest(id) {
	var el = document.getElementById(id);
	if (el == null) return console.error("Element #" + id + " not found!");

	var popup = Popup().container(document.body);

	var button = document.createElement("button");
	button.appendChild(document.createTextNode("Show popup"));
	button.addEventListener("click", function(e) {
		popup.point(window.innerWidth, e.clientY)
			.html("This popup should not cause the page to become horizontally scrollable")
			.draw();
	});
	el.appendChild(button);

	popups[id] = popup;
}

function setUpFullscreenTest(id) {
	var el = document.getElementById(id);
	if (el == null) return console.error("Element #" + id + " not found!");

	var popup = Popup().container(document.body);
	var r = el.getBoundingClientRect();
	popup.point(r.left + r.width/2, r.top + r.height/2)
		.html('<video controls="" src="https://public.flourish.studio/uploads/86a2c8dc-18ab-4c14-a6ca-ae0f361abd35.mp4" style="width: 200px"></video>')
		.draw();

	window.addEventListener("resize", function() {
		var r = el.getBoundingClientRect();
		popup.point(r.left + r.width/2, r.top + r.height/2)
			.draw();
	});

	popups[id] = popup;
}

function setUpTwoPopupTest(id) {
	var el = document.getElementById(id);
	if (el == null) return console.error("Element #" + id + " not found!");

	var popup1 = Popup().container(document.body)
		.html("This is the first popup")
		.point(el.querySelector(".popup1"));
	var popup2 = Popup().container(document.body)
		.html("This is the second popup")
		.point(el.querySelector(".popup2"));

	el.querySelector(".popup1 .show").addEventListener("click", function() {
		var r = el.getBoundingClientRect();
		popup1.draw();
	});
	el.querySelector(".popup1 .hide").addEventListener("click", function() {
		var r = el.getBoundingClientRect();
		popup1.hide();
	});

	el.querySelector(".popup2 .show").addEventListener("click", function() {
		var r = el.getBoundingClientRect();
		popup2.draw();
	});
	el.querySelector(".popup2 .hide").addEventListener("click", function() {
		var r = el.getBoundingClientRect();
		popup2.hide();
	});

	popups[id] = [popup1, popup2];
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
	setUpOverflowTest("test12");
	setUpFullscreenTest("test13");
	setUpTwoPopupTest("test14");
});
