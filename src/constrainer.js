var constrainer, style;


export function Popup__getConstrainer() {
	var popup = this;
	// If constrainer has been created we don't need to recreate it
	if (constrainer) {
		// If popup._constrainer is undefined then it was created by a different popup instance
		if (!popup._constrainer) popup._constrainer = constrainer;
		return constrainer;
	}

	constrainer = popup._constrainer = document.createElement("div");
	constrainer.id = "flourish-popup-constrainer";

	style = constrainer.style;
	style.overflow = "hidden";
	style.pointerEvents = "none";
	style.position = "absolute";
	style.left = "0";
	style.top = "0";
	style.margin = "0";
	style.padding = "0";

	document.body.appendChild(constrainer);
	popup._resizeConstrainer();

	return constrainer;
};


export function Popup__resizeConstrainer() {
	document.body.removeChild(constrainer);
	style.width = document.documentElement.scrollWidth + "px";
	style.height = document.documentElement.scrollHeight + "px";
	document.body.appendChild(constrainer);
}
