module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:react/recommended', 'prettier'],
  plugins: ['react', 'react-native', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-debugger': 'error',
    'react/prop-types': 'off', // Since you might be using TypeScript
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
