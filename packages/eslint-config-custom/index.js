/** @type {import('@types/eslint').Linter.BaseConfig} */

module.exports = {
  extends: [
    'turbo',
    'prettier',
    'google',
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
  ],
  plugins: ['import'],
  // plugins: ['turbo'],
  rules: {
    // 'turbo/no-undeclared-env-vars': 'error',
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true, 'optionalDependencies': true, 'peerDependencies': true }],
    'object-curly-spacing': ['error', 'always'],
    'require-jsdoc': 'off',
    'max-len': 'off',
    'operator-linebreak': ['error', 'after', { 'overrides': { '?': 'before', ':': 'before' } }],
    'react/react-in-jsx-scope': 'off',
  },
};
