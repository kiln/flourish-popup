export function Popup__getConstrainer() {
	var popup = this;

	if (popup._constrainer) return popup._constrainer;

	// The constrainer element might have been added by another Popup instance
	// on the same page.
	var constrainer = document.getElementById("flourish-popup-constrainer");
	if (constrainer) return popup._constrainer = constrainer;

	constrainer = popup._constrainer = document.createElement("div");
	constrainer.id = "flourish-popup-constrainer";
	var s = constrainer.style;
	s.overflow = "hidden";
	s.pointerEvents = "none";
	s.position = "absolute";
	s.left = "0";
	s.top = "0";
	s.margin = "0";
	s.padding = "0";

	document.body.appendChild(constrainer);
	popup._resizeConstrainer();

	return constrainer;
};

export function Popup__resizeConstrainer() {
	var constrainer = this._constrainer,
	    s = constrainer.style;

	// The element must be removed before we compute the dimensions, or
	// it will affect those dimensions itself, with the effect that the
	// constrainer can only grow and never shrink.
	document.body.removeChild(constrainer);
	s.width = document.documentElement.scrollWidth + "px";
	s.height = document.documentElement.scrollHeight + "px";
	document.body.appendChild(constrainer);
}
