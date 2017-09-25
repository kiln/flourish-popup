import { CORNER_RADIUS, TRIANGLE_HALFWIDTH, TRIANGLE_HEIGHT } from "./constants";

var locateTriangle = {};
export default locateTriangle;

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
