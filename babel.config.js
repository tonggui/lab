const rooVueConfig = require('@roo-design/roo-vue/src/config')

module.exports = {
  presets: [
    ["@vue/app", {
        modules: false,
        targets: {
          ie: 9
        }
      }]
  ],
  plugins: [
    "lodash",
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ['babel-plugin-import', {
      libraryName: '@roo-design/roo-vue',
      customName: rooVueConfig.customName
    }],
  ]
};
