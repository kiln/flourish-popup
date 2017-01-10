var nodeResolve = require("rollup-plugin-node-resolve");

export default {
  entry: "src/popup.js",
  format: "iife",
  dest: "popup.js",
  sourceMap: true,

  // d3 relies on the node-resolve plugin
  plugins: [
    nodeResolve({ jsnext: true, module: true, main: false })
  ]
};
