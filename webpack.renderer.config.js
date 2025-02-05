const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  resolve:{
    fallback: {
      "fs": require.resolve("browserfs"),
      "path": require.resolve("path-browserify")
    }
  },
  module: {
    rules,
  },
};
