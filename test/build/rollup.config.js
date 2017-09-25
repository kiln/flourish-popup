var path = require("path");

const popup_path = path.resolve("../../src/index.js");

export default {
  input: "../src/tests.js",
  output: {
    file: "test.js",
    format: "iife"
  },
  sourcemap: true,

  external: [ popup_path ],
  globals: { [popup_path]: "Popup" }
};
