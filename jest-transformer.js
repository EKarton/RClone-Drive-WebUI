module.exports = require('babel-jest').default.createTransformer({
  presets: [
    [
      require.resolve('babel-preset-react-app'),
      {
        runtime: 'automatic',
      },
    ],
  ],
  plugins: ['babel-plugin-transform-import-meta'],
  babelrc: false,
  configFile: false,
  env: {
    development: {
      compact: false,
    },
  },
});
