var path = require("path"),
    nodeResolve = require("rollup-plugin-node-resolve");

const slider_path = path.resolve("../../src/slider.js");

export default {
  entry: "../src/tests.js",
  format: "iife",
  dest: "test.js",
  sourceMap: true,

  external: [ slider_path ],
  globals: { [slider_path]: "Slider" },

  plugins: [
    nodeResolve({ jsnext: true, module: true, main: false })
  ]
};
