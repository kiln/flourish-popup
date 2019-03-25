/* The popup element can technically be partly outside the page, even though
   visually it is not. This causes the page to become horizontally scrollable,
   which can lead to problems like kiln/flourish#1267.

   This code adds an absolutely-positioned “constrainer” element containing the
   popup that has overlow:hidden, which covers the entire document.

   It’s surprisingly hard to achieve that – or at least I failed to find an easy
   way – and so we explicitly set the dimensions of the constrainer to match the
   document, and recompute them when the popup is redrawn.
*/

// There is one constrainer for the entire page, however many Popup instances
// there are, so these variables are global rather than properties of the instance.
var constrainer, style;

export function Popup__getConstrainer() {
	if (constrainer) return constrainer;

	constrainer = document.createElement("div");
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
	this._resizeConstrainer();

	return constrainer;
};

export function Popup__resizeConstrainer() {
	// The element must be hidden before we compute the dimensions, or
	// it will affect those dimensions itself, with the effect that the
	// constrainer can only grow and never shrink.
	var old_display = style.display;
	style.display = "none";
	style.width = document.documentElement.scrollWidth + "px";
	style.height = document.documentElement.scrollHeight + "px";
	style.display = old_display;
}
