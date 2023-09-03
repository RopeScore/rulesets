module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: 'tsconfig.base.json'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/strict-boolean-expressions': ['error', { allowNumber: true }]
  }
}
