module.exports = {
  presets: [
    "@vue/app",
    {
      modules: false,
      targets: {
        ie: 9
      }
    }
  ],
  plugins: [
    "lodash",
    ["@babel/plugin-proposal-class-properties", { loose: true }]
  ]
};
