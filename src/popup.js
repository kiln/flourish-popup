var VERSION = "1.0.0";

var next_unique_id = 0;

var BORDER = 25,
    CORNER_RADIUS = 5,
    TRIANGLE_HALFWIDTH = 10,
    TRIANGLE_HEIGHT = 10,

    // The order of the list of directions determines the
    // default priority ordering.
    ALL_DIRECTIONS = [
    	"bottom", "top", "left", "right",
    	"topLeft", "bottomLeft", "topRight", "bottomRight",
    	"bottomFlexible", "topFlexible", "leftFlexible", "rightFlexible"
    ];

function Popup() {
	this.unique_id = next_unique_id++;

	this._container = document.body;
	this._maxWidth = "70%";
	this._point = null;
	this._html = null;
	this._directions = ALL_DIRECTIONS;
	this._fallbackFit = "horizontal"; // or "vertical"

	this.handlers = {
		"click": []
	};
}

// Create accessor methods for all the _parameters defined by the constructor
function accessor(proto, k) {
	if (k.length > 0 && k.charAt(0) == "_") {
		proto[k.substr(1)] = function(v) {
			if (typeof v == "undefined") return this[k];
			this[k] = v;
			return this;
		};
	}
}
for (var k in new Popup("*")) {
	accessor(Popup.prototype, k);
}

// Custom accessor method for .point
Popup.prototype.point = function(arg1, arg2) {
	if (typeof arg1 == "undefined") return this._point;

	if (typeof arg2 != "undefined") this._point = [ arg1, arg2 ];
	else if (arg1 instanceof HTMLElement || arg1 instanceof SVGElement) {
		var r = arg1.getBoundingClientRect();
		this._point = [ Math.floor(r.left + r.width/2), Math.floor(r.top + r.height/2) ];
	}
	else {
		console.error("Kiln.popup: could not understand argument")
	}

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
	if (!(event in this.handlers)) throw "Kiln.popup.on: No such event: " + event;
	this.handlers[event].push(handler);
	return this;
};

// Fire event
Popup.prototype.fire = function Popup_fire(event, d) {
	if (!(event in this.handlers)) throw "Kiln.popup.fire: No such event: " + event;
	var handlers = this.handlers[event];
	for (var i = 0; i < handlers.length; i++) {
		handlers[i](d);
	}
	return this;
};


// Draw the popup
function svgElement(tagName, attrs, styles) {
	var element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
	var k;
	if (attrs) for (k in attrs) element.setAttribute(k, attrs[k]);

	var s = element.style;
	if (styles) for (k in styles) s[k] = styles[k];

	return element;
}

Popup.prototype._getElement = function Kiln_popup__getElement() {
	var popup = this;
	var id = "kiln-popup-" + this.unique_id;
	var el = document.getElementById(id);
	if (!el) {
		el = document.createElement("div");
		el.className = "kiln-popup";
		el.id = id;

		var s = el.style;
		s.display = "none";
		s.margin = s.padding = 0;
		s.position = "absolute";
		s.width = "80px";
		s.height = "40px";
		s.boxSizing = "border-box";

		el.addEventListener("click", function() {
			popup.fire("click", popup);
		}, false);

		var svg = svgElement("svg", {"class": "kiln-popup-svg"}, {
			position: "absolute",
			top: 0, left: 0, bottom: 0, right: 0
		});

		var filter = svgElement("filter", {id: "dropshadow-" + this.unique_id, height: "130%"});
		filter.appendChild(svgElement("feGaussianBlur", {"in": "SourceAlpha", stdDeviation: 5}));
		filter.appendChild(svgElement("feOffset", {dx: 0, dy: 2, result: "offsetblur"}));
		var fe_component_transfer = svgElement("feComponentTransfer");
		fe_component_transfer.appendChild(svgElement("feFuncA", {type: "linear", slope: 0.2}));
		filter.appendChild(fe_component_transfer);
		var fe_merge = svgElement("feMerge");
		filter.appendChild(fe_merge);
		fe_merge.appendChild(svgElement("feMergeNode"));
		fe_merge.appendChild(svgElement("feMergeNode", {"in": "SourceGraphic"}));
		svg.appendChild(filter);

		var g = svgElement("g", {
			filter: "url(#dropshadow-" + this.unique_id + ")",
			fill: "white",
			stroke: "none"
		});
		g.appendChild(svgElement("rect", {x: BORDER, y: BORDER, rx: CORNER_RADIUS}));
		g.appendChild(svgElement("path"));
		svg.appendChild(g);
		el.appendChild(svg);

		var content = document.createElement("div");
		content.className = "kiln-popup-content";
		s = content.style;
		s.position = "absolute";
		s.top = s.left = BORDER + "px";
		s.padding = "10px";
		el.appendChild(content);

		document.body.appendChild(el);
	}

	return el;
}

var locateTriangle = {};

locateTriangle.bottom = function locateTriangle_bottom(w, h) {
	return {
		shape: [ -TRIANGLE_HALFWIDTH, -TRIANGLE_HEIGHT,  TRIANGLE_HALFWIDTH, -TRIANGLE_HEIGHT ],
		pos: [w/2, h + TRIANGLE_HEIGHT]
	};
};

locateTriangle.top = function locateTriangle_top(w, h) {
	return {
		shape: [ -TRIANGLE_HALFWIDTH, TRIANGLE_HEIGHT,  TRIANGLE_HALFWIDTH, TRIANGLE_HEIGHT ],
		pos: [w/2, -TRIANGLE_HEIGHT]
	};
};

locateTriangle.left = function locateTriangle_left(w, h) {
	return {
		shape: [ TRIANGLE_HEIGHT, TRIANGLE_HALFWIDTH,  TRIANGLE_HEIGHT, -TRIANGLE_HALFWIDTH ],
		pos: [-TRIANGLE_HEIGHT, h/2]
	};
};

locateTriangle.right = function locateTriangle_right(w, h) {
	return {
		shape: [ -TRIANGLE_HEIGHT, TRIANGLE_HALFWIDTH, -TRIANGLE_HEIGHT, -TRIANGLE_HALFWIDTH ],
		pos: [w + TRIANGLE_HEIGHT, h/2]
	};
};

locateTriangle.topLeft = function locateTriangle_topLeft(w, h) {
	return {
		shape: [ TRIANGLE_HEIGHT + CORNER_RADIUS, TRIANGLE_HEIGHT,
		         TRIANGLE_HEIGHT, TRIANGLE_HEIGHT + CORNER_RADIUS ],
		pos: [-TRIANGLE_HEIGHT, -TRIANGLE_HEIGHT]
	};
};

locateTriangle.bottomLeft = function locateTriangle_bottomLeft(w, h) {
	return {
		shape: [ TRIANGLE_HEIGHT + CORNER_RADIUS, -TRIANGLE_HEIGHT,
			       TRIANGLE_HEIGHT, -TRIANGLE_HEIGHT - CORNER_RADIUS ],
		pos: [-TRIANGLE_HEIGHT, h + TRIANGLE_HEIGHT]
	};
};

locateTriangle.topRight = function locateTriangle_topRight(w, h) {
	return {
		shape: [ -TRIANGLE_HEIGHT - CORNER_RADIUS, TRIANGLE_HEIGHT,
			       -TRIANGLE_HEIGHT, TRIANGLE_HEIGHT + CORNER_RADIUS ],
		pos: [w + TRIANGLE_HEIGHT, -TRIANGLE_HEIGHT]
	};
};

locateTriangle.bottomRight = function locateTriangle_bottomRight(w, h) {
	return {
		shape: [ -TRIANGLE_HEIGHT - CORNER_RADIUS, -TRIANGLE_HEIGHT,
			       -TRIANGLE_HEIGHT, -TRIANGLE_HEIGHT - CORNER_RADIUS ],
		pos: [w + TRIANGLE_HEIGHT, h + TRIANGLE_HEIGHT]
	};
};

function hFlexTriangle(w, h, x, y, cb, y_factor, y_pos) {
	var l = x - w/2 - TRIANGLE_HEIGHT, r = x + w/2 + TRIANGLE_HEIGHT,
	    px = w/2 + Math.min(0, l - cb.left) + Math.max(0, r - cb.right),
	    shape;

	if (px - TRIANGLE_HALFWIDTH < CORNER_RADIUS) {
		shape = [ -px , (-TRIANGLE_HEIGHT - CORNER_RADIUS) * y_factor,
				Math.max(TRIANGLE_HALFWIDTH, CORNER_RADIUS - px), -TRIANGLE_HEIGHT * y_factor ];
	}
	else if (px + TRIANGLE_HALFWIDTH > w - CORNER_RADIUS) {
		shape = [ Math.min(-TRIANGLE_HALFWIDTH, w-px-CORNER_RADIUS), -TRIANGLE_HEIGHT * y_factor,
			Math.min(TRIANGLE_HALFWIDTH, w - px), (-TRIANGLE_HEIGHT - CORNER_RADIUS) * y_factor ];
	}
	else {
		shape = [ -TRIANGLE_HALFWIDTH, -TRIANGLE_HEIGHT * y_factor,
				TRIANGLE_HALFWIDTH, -TRIANGLE_HEIGHT * y_factor ];
	}

	return { pos: [px, y_pos], shape: shape }
};

function vFlexTriangle(w, h, x, y, cb, x_factor, x_pos) {
	var t = y - h/2 - TRIANGLE_HEIGHT, b = y + h/2 + TRIANGLE_HEIGHT,
	    py = h/2 + Math.min(0, t - cb.top) + Math.max(0, b - cb.bottom),
	    shape;

	if (py - TRIANGLE_HALFWIDTH < CORNER_RADIUS) {
		shape = [ (-TRIANGLE_HEIGHT - CORNER_RADIUS) * x_factor, -py,
				-TRIANGLE_HEIGHT * x_factor, Math.max(TRIANGLE_HALFWIDTH, CORNER_RADIUS - py) ];
	}
	else if (py + TRIANGLE_HALFWIDTH > h - CORNER_RADIUS) {
		shape = [ -TRIANGLE_HEIGHT * x_factor, Math.min(-TRIANGLE_HALFWIDTH, h-py-CORNER_RADIUS),
			(-TRIANGLE_HEIGHT - CORNER_RADIUS) * x_factor, Math.min(TRIANGLE_HALFWIDTH, h - py) ];
	}
	else {
		shape = [ -TRIANGLE_HEIGHT * x_factor, -TRIANGLE_HALFWIDTH,
				-TRIANGLE_HEIGHT * x_factor, TRIANGLE_HALFWIDTH ];
	}

	return { pos: [x_pos, py], shape: shape }
};

locateTriangle.bottomFlexible = function locateTriangle_bottomFlexible(w, h, x, y, cb) {
	return hFlexTriangle(w, h, x, y, cb, +1, h + TRIANGLE_HEIGHT);
};

locateTriangle.topFlexible = function locateTriangle_topFlexible(w, h, x, y, cb) {
	return hFlexTriangle(w, h, x, y, cb, -1, -TRIANGLE_HEIGHT);
};

locateTriangle.rightFlexible = function locateTriangle_rightFlexible(w, h, x, y, cb) {
	return vFlexTriangle(w, h, x, y, cb, +1, w + TRIANGLE_HEIGHT);
};

locateTriangle.leftFlexible = function locateTriangle_leftFlexible(w, h, x, y, cb) {
	return vFlexTriangle(w, h, x, y, cb, -1, -TRIANGLE_HEIGHT);
};

function boxBounds(dir, w, h, x, y, cb) {
	var lt = locateTriangle[dir](w, h, x, y, cb),
	    left = x - BORDER - lt.pos[0],
	    top = y - BORDER - lt.pos[1];
	return { left: left, top: top, right: left + w + 2*BORDER, bottom: top + h + 2*BORDER };
}

function positionBox(dir, s, path, w, h, x, y, clientX, clientY, cb) {
	var lt = locateTriangle[dir](w, h, clientX, clientY, cb);
	s.left = (x - BORDER - lt.pos[0]) + "px";
	s.top = (y - BORDER - lt.pos[1]) + "px";
	path.setAttribute("d", "M0,0L" + lt.shape.join(",") + "Z");
	path.setAttribute("transform", "translate(" + (lt.pos[0] + BORDER) + "," + (lt.pos[1] + BORDER) + ")");
}


Popup.prototype.__maxContentWidth = function Kiln_popup__maxContentWidth(cb) {
	if (this._maxWidth.match(/^\d+(?:\.\d+)?%$/)) {
		return cb.width * parseFloat(this._maxWidth) / 100;
	}
	if (this._maxWidth.match(/^\d+(?:\.\d+)?(?:px)?$/)) {
		return parseFloat(this._maxWidth);
	}
	if (this._maxWidth != null) {
		console.error("Kiln.popup: Unknown value for maxWidth: " + this._maxWidth);
	}
	return cb.width;
};

Popup.prototype.draw = function Kiln_popup_draw() {
	if (!this._point) {
		console.error("Kiln.popup: cannot draw popup till point() has been specified");
		return;
	}

	var doc_rect = document.documentElement.getBoundingClientRect(),
	    clientX = this._point[0], clientY = this._point[1],
	    cb = this._container.getBoundingClientRect();

	if (clientX < cb.left) clientX = cb.left;
	else if (clientX > cb.right) clientX = cb.right;
	if (clientY < cb.top) clientY = cb.top;
	else if (clientY > cb.bottom) clientY = cb.bottom;

	var x = clientX - doc_rect.left, y = clientY - doc_rect.top;

	var el = this._getElement(), s = el.style,
	svg = el.querySelector(".kiln-popup-svg"),
	g = svg.querySelector("g"),
	rect = g.querySelector("rect"),
	path = g.querySelector("path"),
	content = el.querySelector(".kiln-popup-content");

	s.display = "block";
	content.style.maxWidth = this.__maxContentWidth(cb) + "px";
	content.innerHTML = this._html;
	var content_box = content.getBoundingClientRect(),
	    w, h;
	do {
		w = Math.ceil(content_box.width);
		h = Math.ceil(content_box.height);
		s.width = (w + 2*BORDER) + "px";
		s.height = (h + 2*BORDER) + "px";
		content_box = content.getBoundingClientRect();
	} while (w != Math.ceil(content_box.width) || h != Math.ceil(content_box.height));

	rect.setAttribute("width", w);
	rect.setAttribute("height", h);
	svg.setAttribute("width", w + 2*BORDER);
	svg.setAttribute("height", h + 2*BORDER);

	var overlap = BORDER - TRIANGLE_HEIGHT;
	var first_fit = null, best_horizontal_fit = null, best_vertical_fit = null,
	    least_horizontal_protrusion = Infinity, least_vertical_protrusion = Infinity,
	    vp_at_least_hp, hp_at_least_vp;
	for (var i = 0; i < this._directions.length; i++) {
		var dir = this._directions[i],
		    b = boxBounds(dir, w, h, clientX, clientY, cb),
		    horizontal_protrusion = Math.max(0, Math.floor(cb.left) - b.left - overlap)
		    	+ Math.max(0, b.right - Math.ceil(cb.right) - overlap),
		    vertical_protrusion = Math.max(0, Math.floor(cb.top) - b.top - overlap)
		    	+ Math.max(0, b.bottom - Math.ceil(cb.bottom) - overlap);

		if (horizontal_protrusion == 0 && vertical_protrusion == 0) {
			first_fit = dir;
			break;
		}
		if (horizontal_protrusion < least_horizontal_protrusion
		|| (horizontal_protrusion == least_horizontal_protrusion
		    && vertical_protrusion < vp_at_least_hp))
		{
			least_horizontal_protrusion = horizontal_protrusion;
			vp_at_least_hp = vertical_protrusion;
			best_horizontal_fit = dir;
		}
		if (vertical_protrusion < least_vertical_protrusion
		|| (vertical_protrusion == least_vertical_protrusion
		    && horizontal_protrusion < hp_at_least_vp))
		{
			least_vertical_protrusion = vertical_protrusion;
			hp_at_least_vp = horizontal_protrusion;
			best_vertical_fit = dir;
		}
	}

	// If the box can be fit completely within the container, do that
	if (first_fit) {
		dir = first_fit;
	}
	// Otherwise use the fallback fit (horizontal or vertical) if specified
	else if (this._fallbackFit == "horizontal") {
		dir = best_horizontal_fit;
	}
	else if (this._fallbackFit == "vertical") {
		dir = best_vertical_fit;
	}
	// If all else fails, issue a warning and use the first specified direction.
	else {
		console.warn("Kiln.popup: failed to point box of size (" + w + ", " + h + ")" +
			" at (" + clientX + ", " + clientY + ") within (" +
			cb.left + ", " + cb.top +", " + cb.right + ", " + cb.bottom + ")");
		dir = this._directions[0];
	}

	// Position the box and return
	positionBox(dir, s, path, w, h, x, y, clientX, clientY, cb);
	return this;
}

Popup.prototype.hide = function Kiln_popup_hide() {
	this._getElement().style.display = "none";
	return this;
}


function Kiln_popup() {
	return new Popup();
}
Kiln_popup.version = VERSION;

export default Kiln_popup;
