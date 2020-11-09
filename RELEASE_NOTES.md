# 2.1.5

* Hiding one popup should not affect other popups on the page.
  (Issue #32, introduced in version 2.1.3.)

# 2.1.4

* Fix bug where constrainer was undefined in resizeConstrainer

# 2.1.3

* Only hide the popup once when calling .hide() multiple times in a row.
* Hide the constrainer element when the popup is hidden.

# 2.1.2

* Include the correct version number in the VERSION property

# 2.1.1

* Reuse the DOM elements, rather than recreating them, if .draw() is called without the HTML having been changed
* Add fullscreen mode test


# 2.1.0

* Add option to use an array for point method
* Add option to pass in a single direction as a string to directions method

# 2.0.1

* Minor improvements to code clarity, again in the fix for #16. Should have no effect on behaviour.

# 2.0.0

* More robust fix for #16. The major version number has been bumped, because this is technically a breaking change since it changes the DOM structure. It is unlikely to break anything in practice, if you have used CSS of the form suggested by the documentation.

# 1.2.1

* Prevent popups at the edge of the document from making the document scrollable. #16
