module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  "globals": {
    "Akita": false
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false,
    }],
    'vue/script-indent': ['error', 2, {
      'baseIndent': 1
    }],
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures:{
      // 支持装饰器
      legacyDecorators: true
    }
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off'
      },
      parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
      },
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        // '@typescript-eslint/no-unused-vars': ['error', {
        //   vars: 'all',
        //   args: 'after-used',
        //   ignoreRestSiblings: false
        // }]
      }
    }
  ]
};
