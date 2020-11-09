import Popup_draw from "./draw";
import Popup__getElement from "./element";
import { Popup__getConstrainer, Popup__resizeConstrainer } from "./constrainer";
import locateTriangle from "./locate_triangle";


var VERSION = "2.1.5";
var next_unique_id = 1;
var OPTIONS = {
	container: document.body,
	maxWidth: "70%",
	point: null,
	html: null,
	directions: [
    	"bottom", "top", "left", "right",
    	"topLeft", "bottomLeft", "topRight", "bottomRight",
    	"bottomFlexible", "topFlexible", "leftFlexible", "rightFlexible"
    ],
	fallbackFit: "horizontal" // or "vertical"
};

function Popup() {
	this.unique_id = next_unique_id++;
	this.is_visible = true;

	for (var k in OPTIONS) this["_" + k] = OPTIONS[k];

	this.handlers = {
		"click": []
	};
}

// Create accessor methods for all the options
function accessor(k) {
	Popup.prototype[k] = function(v) {
		if (typeof v == "undefined") return this["_" + k];
		this["_" + k] = v;
		return this;
	};
}
for (var k in OPTIONS) accessor(k);

// Custom accessor method for .point
Popup.prototype.point = function(arg1, arg2) {
	if (typeof arg1 == "undefined") return this._point;
	if (Array.isArray(arg1)) this._point = [ arg1[0], arg1[1] ];
	else if (typeof arg2 != "undefined") this._point = [ arg1, arg2 ];
	else if (arg1 instanceof HTMLElement || arg1 instanceof SVGElement) {
		var r = arg1.getBoundingClientRect();
		this._point = [ Math.floor(r.left + r.width/2), Math.floor(r.top + r.height/2) ];
	}
	else {
		console.error("Popup: could not understand argument")
	}

	return this;
}

Popup.prototype.directions = function(arg) {
	if (typeof arg === "undefined") return this._directions;
	if (typeof arg === "string") arg = [ arg ];
	this._directions = arg.slice();
	return this;
}

function textToHtml(text) {
	return text.replace(/[&<>]/g, function (s) {
		return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[s];
	});
}

// Accessor (setter only) for setting plain text
Popup.prototype.text = function Popup_text(t) {
	this._html = textToHtml(t);
	return this;
};

// Attach event handlers
Popup.prototype.on = function Popup_on(event, handler) {
	if (!(event in this.handlers)) throw new Error("Popup.on: No such event: " + event);
	this.handlers[event].push(handler);
	return this;
};

// Fire event
Popup.prototype.fire = function Popup_fire(event, d) {
	if (!(event in this.handlers)) throw new Error("Popup.fire: No such event: " + event);
	var handlers = this.handlers[event];
	for (var i = 0; i < handlers.length; i++) {
		handlers[i].call(this, d);
	}
	return this;
};


Popup.prototype._getElement = Popup__getElement;
Popup.prototype._getConstrainer = Popup__getConstrainer;
Popup.prototype._resizeConstrainer = Popup__resizeConstrainer;

Popup.prototype.draw = Popup_draw;

Popup.prototype.hide = function Popup_hide() {
	if (!this.is_visible) return this;
	this.is_visible = false;
	this._getElement().style.display = "none";
	return this;
}


function Flourish_popup() {
	return new Popup();
}
Flourish_popup.version = VERSION;

export default Flourish_popup;
