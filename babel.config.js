module.exports = {
  presets: [
    ["@vue/app", {
        modules: false,
        targets: {
          ie: 9
        }
      }],
    "@vue/babel-preset-jsx"
  ],
  plugins: [
    "lodash",
    ["@babel/plugin-proposal-class-properties", { loose: true }]
  ]
};
