# Flourish popup component

The Popup component provides a configurable popup box.
We developed it for use in [Flourish](https://flourish.studio/) templates,
but it’s open source and you can use it for anything.

```js
import Popup from "@flourish/popup";

var popup = Popup();

// Hide the popup if the user clicks on it
popup.on("click", function() { this.hide(); });

// Draw the popup pointing to position (100, 100)
popup.point(100, 100).draw();
```

It’s developed as an ES6 module, and you can use it with [rollup.js](http://rollupjs.org/)
and [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve),
or another ES6-compatible module bundler. Or you can include the file directly from the web:

```html
<script src="https://cdn.flourish.rocks/popup-v1.full.min.js"></script>
```

# Interactive example

[Example on codepen](https://codepen.io/robinhouston/pen/EZXgog)

# Full reference

* [Constructor](#constructor)
* [Methods](#methods)
	* [`.draw()`](#draw)
	* [`.hide()`](#update)
	* [`.on(event, handler)`](#on-event-handler)
* [Events](#events)
	* [The `click` event](#the-click-event)
* [Settings](#settings)
	* [`container`](#container)
	* [`maxWidth`](#maxWidth)
	* [`point`](#pointx-y)
	* [`html`](#html)
	* [`directions`](#directions)
	* [`fallbackFit`](#fallbackFit)
* [Style](#style)
* [Properties](#properties)
	* [`version`](#version)

## Constructor
`Popup()` constructs a new popup. It’s possible to have several popups on the same page,
though typically you would only need one. The constructor takes no arguments.

## Methods
### `.draw()`
Draws or redraws the popup to reflect the current value of its settings.

### `.hide()`
Hides the popup.

### `.on(event, handler)`
Attach an event handler. The only supported event is [`click`](#the-click-event). You can attach
multiple handlers for the same event, and all of them will fire when appropriate.

## Events
### The `click` event
The click event is fired when someone clicks on the popup. The event handler is passed the
underlying MouseEvent as an argument, and its `this` object is the Popup instance.

## Settings
Settings are applied by calling the method of the same name on the Popup object
with the new value as an argument. These methods return the Popup object, so you
can chain them. For example, you can set the position and contents with:
```js
popup.point(100, 50).html("Look at me!");
```

You can retrieve the current value of a setting by calling the method with no
arguments, e.g.
```js
var current_point = popup.point();
```

### `container`
A DOM element to which to constrain the popup. Defaults to `document.body`.

### `point`
The point is an array of two positions `[x, y]` that determines where the popup points.

### `point(arr)`
Pass x and y positions in a two-element array, `[x, y]`.

### `point(x, y)`
As a convenience, you can pass the x and y positions as separate arguments.

### `point(container)`
Or you can pass a visible DOM element, which sets the point to the centre of that element.

### `html`
The contents of the popup.

### `directions`
An array of directions in priority order or a string specifying a single direction. Popup will use the first listed direction that
allows the popup to be drawn within its container.

Supported directions are:
* `bottom`: draw the little arrow in the centre of the bottom edge of the popup box,
	so the popup is above the point.
* `top`: draw the little arrow in the centre of the top edge of the popup box,
	so the popup is below the point.
* `left`: draw the little arrow in the centre of the left-hand edge of the popup box,
	so the popup is to the right of the point.
* `right`: draw the little arrow in the centre of the right-hand edge of the popup box,
	so the popup is to the left of the point.
* `topLeft`: draw the little arrow in the top-left corner of the popup box,
	so the popup is below and to the right of the point.
* `bottomLeft`: draw the little arrow in the bottom-left corner of the popup box,
	so the popup is above and to the right of the point.
* `topRight`: draw the little arrow in the top-right corner of the popup box,
	so the popup is below and to the left of the point.
* `bottomRight`: draw the little arrow in the bottom-right corner of the popup box,
	so the popup is above and to the left of the point.
* `bottomFlexible`: draw the little arrow somewhere on the bottom edge of the popup box,
	so the popup is (possibly asymmetrically) above the point.
* `topFlexible`: draw the little arrow somewhere on the top edge of the popup box,
	so the popup is (possibly asymmetrically) below the point.
* `leftFlexible`: draw the little arrow somewhere on the left-hand edge of the popup box,
	so the popup is (possibly asymmetrically) to the right of the point.
* `rightFlexible`: draw the little arrow somewhere on the right-hand edge of the popup box,
	so the popup is (possibly asymmetrically) to the left the point.

The default priority order is the order listed above.

### `fallbackFit`
Determines what Popup will do if it’s impossible to fit the popup into the container
using any of the listed directions. Possible values are `"horizontal"` (which is the default),
`"vertical"`, and `null`.

If it’s impossible to fit the popup into the container using any of the listed directions then:
* If fallbackFit is `"horizontal"`, the popup will be as far as possible constrained horizontally
by the container, but allowed to overlap its bounds vertically.
* If fallbackFit is `"vertical"`, the popup will be as far as possible constrained vertically
by the container, but allowed to overlap its bounds horizontally.
* If fallbackFit is `null`, Popup will log a warning to the console and use the first listed direction.

## Style
You can style the popup using CSS. The popup container has class `.flourish-popup`,
and contains an `<svg>` element with class `.flourish-popup-svg` and a `<div>` with
class `.flourish-popup-content`. The SVG contains a `<g>` element that you can style
to change the appearance of the popup box itself, and you can style the content div
to change the appearance of the HTML within the popup.

For example, if you want your popup to have white text on a black background you can
write:
```css
.flourish-popup .flourish-popup-svg g { fill: black; }
.flourish-popup .flourish-popup-content { color: white; }
```
or if you want a translucent popup you can write:
```css
.flourish-popup .flourish-popup-svg g { opacity: 0.6; }
```

## Properties
### `.version`
`Popup.version` is the version number of this library, using [Semantic Versioning](http://semver.org/).
