var nodeResolve = require("rollup-plugin-node-resolve");

export default {
  entry: "src/popup.js",
  format: "umd",
  moduleName: "popup",
  dest: "popup.js",

  plugins: [
    nodeResolve({jsnext: true})
  ]
};
