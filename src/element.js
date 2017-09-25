function svgElement(tagName, attrs, styles) {
	var element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
	var k;
	if (attrs) for (k in attrs) element.setAttribute(k, attrs[k]);

	var s = element.style;
	if (styles) for (k in styles) s[k] = styles[k];

	return element;
}

export default function Popup__getElement() {
	var popup = this;
	var id = "flourish-popup-" + popup.unique_id;
	var el = document.getElementById(id);
	if (!el) {
		el = document.createElement("div");
		el.className = "flourish-popup";
		el.id = id;

		var s = el.style;
		s.display = "none";
		s.margin = s.padding = 0;
		s.position = "absolute";
		s.width = "80px";
		s.height = "40px";
		s.boxSizing = "border-box";

		el.addEventListener("click", function(e) {
			popup.fire("click", e);
		}, false);

		var svg = svgElement("svg", {"class": "flourish-popup-svg"}, {
			position: "absolute",
			top: 0, left: 0, bottom: 0, right: 0
		});

		var filter = svgElement("filter", {id: "dropshadow-" + popup.unique_id, height: "130%"});
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
			filter: "url(#dropshadow-" + popup.unique_id + ")",
			fill: "white",
			stroke: "none"
		});
		g.appendChild(svgElement("rect", {x: BORDER, y: BORDER, rx: CORNER_RADIUS}));
		g.appendChild(svgElement("path"));
		svg.appendChild(g);
		el.appendChild(svg);

		var content = document.createElement("div");
		content.className = "flourish-popup-content";
		s = content.style;
		s.position = "absolute";
		s.top = s.left = BORDER + "px";
		s.padding = "10px";
		el.appendChild(content);

		document.body.appendChild(el);
	}

	return el;
}
