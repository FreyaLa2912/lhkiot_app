module.exports = (api) => {
  const babelEnv = api.env();

  const plugins = [
    [
      'module-resolver',
      {
        alias: {
          '@assets': './assets',
          '@components': './components',
          '@constants': './constants',
          '@context': './context',
          '@interceptors': './interceptors',
          '@models': './models',
          '@navigation': './navigation',
          '@stacks': './stacks',
          '@screens': './screens',
          '@services': './services',
          '@stores': './stores',
          '@system': './system',
          '@utils': './utils',
          // '@config': './config.js',
        },
        extensions: ['.tsx', '.ts', '.js', '.json'],
      },
    ],
    'react-native-reanimated/plugin',
  ];

  if (babelEnv !== 'development') {
    plugins.push(['transform-remove-console']);
  }

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
