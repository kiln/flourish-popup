var path = require("path"),
    nodeResolve = require("rollup-plugin-node-resolve");

// See the comment in src/slider.js
const d3_scale_linear = path.resolve("./node_modules/d3-scale/src/linear.js");

export default {
  entry: "src/popup.js",
  format: "umd",
  moduleName: "Popup",
  dest: "popup.js",

  external: [ "d3-selection", "d3-axis", "d3-scale", d3_scale_linear ],
  globals: { "d3-selection": "d3", "d3-axis": "d3", [d3_scale_linear]: "d3.scaleLinear" },

  plugins: [
    nodeResolve({jsnext: true})
  ]
};
