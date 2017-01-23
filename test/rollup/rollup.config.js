var nodeResolve = require("rollup-plugin-node-resolve");

export default {
  entry: "../src/tests.js",
  format: "iife",
  dest: "test.js",
  sourceMap: true,

  plugins: [
    nodeResolve({ jsnext: true, module: true, main: false })
  ]
};
