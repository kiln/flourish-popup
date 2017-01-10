var nodeResolve = require("rollup-plugin-node-resolve");

export default {
  entry: "component_test/popup.js",
  format: "iife",
  dest: "../site/component_test/popup.js",
  sourceMap: true,

  // d3 relies on the node-resolve plugin
  plugins: [
    nodeResolve({jsnext: true})
  ]
};
