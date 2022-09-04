module.exports = {
  extends: ['turbo', 'prettier', 'google'],
  rules: {
    'object-curly-spacing': ['error', 'always'],
    'require-jsdoc': 'off',
    'max-len': 'off',
    'operator-linebreak': ['error', 'after', { 'overrides': { '?': 'before', ':': 'before' } }],
    'react/react-in-jsx-scope': 'off',
  },
};
