let plugins = [];
if (process.env.BABEL_ENV !== 'development') {
  plugins.push(['transform-remove-console']);
}

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins,
};
