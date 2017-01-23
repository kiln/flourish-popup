var path = require("path");

const popup_path = path.resolve("../../src/popup.js");

export default {
  entry: "../src/tests.js",
  format: "iife",
  dest: "test.js",
  sourceMap: true,

  external: [ popup_path ],
  globals: { [popup_path]: "Popup" }
};
