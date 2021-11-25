/**
 * This is the config file for linting js files
 * Refer to https://eslint.org/docs/user-guide/configuring/ for more info
 */
module.exports = {
  extends: ['react-app', 'react-app/jest', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
};
