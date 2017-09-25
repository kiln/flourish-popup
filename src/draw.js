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

export default function Popup_draw() {
	var popup = this;

	function maxContentWidth(cb) {
		if (popup._maxWidth.match(/^\d+(?:\.\d+)?%$/)) {
			return cb.width * parseFloat(popup._maxWidth) / 100;
		}
		if (popup._maxWidth.match(/^\d+(?:\.\d+)?(?:px)?$/)) {
			return parseFloat(popup._maxWidth);
		}
		if (popup._maxWidth != null) {
			console.error("Popup: Unknown value for maxWidth: " + popup._maxWidth);
		}
		return cb.width;
	};


	if (!popup._point) {
		console.error("Popup: cannot draw popup till point() has been specified");
		return;
	}

	var doc_rect = document.documentElement.getBoundingClientRect(),
	    clientX = popup._point[0], clientY = popup._point[1],
	    cb = popup._container.getBoundingClientRect();

	if (clientX < cb.left) clientX = cb.left;
	else if (clientX > cb.right) clientX = cb.right;
	if (clientY < cb.top) clientY = cb.top;
	else if (clientY > cb.bottom) clientY = cb.bottom;

	var x = clientX - doc_rect.left, y = clientY - doc_rect.top;

	var el = popup._getElement(), s = el.style,
	svg = el.querySelector(".flourish-popup-svg"),
	g = svg.querySelector("g"),
	rect = g.querySelector("rect"),
	path = g.querySelector("path"),
	content = el.querySelector(".flourish-popup-content");

	s.display = "block";
	content.style.maxWidth = popup.__maxContentWidth(cb) + "px";
	content.innerHTML = popup._html;
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
	for (var i = 0; i < popup._directions.length; i++) {
		var dir = popup._directions[i],
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
	else if (popup._fallbackFit == "horizontal") {
		dir = best_horizontal_fit;
	}
	else if (popup._fallbackFit == "vertical") {
		dir = best_vertical_fit;
	}
	// If all else fails, issue a warning and use the first specified direction.
	else {
		console.warn("Popup: failed to point box of size (" + w + ", " + h + ")" +
			" at (" + clientX + ", " + clientY + ") within (" +
			cb.left + ", " + cb.top +", " + cb.right + ", " + cb.bottom + ")");
		dir = popup._directions[0];
	}

	// Position the box and return
	positionBox(dir, s, path, w, h, x, y, clientX, clientY, cb);
	return popup;
}
