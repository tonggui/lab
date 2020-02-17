export default [{
  path: 'stockoutAutoClearStock',
  name: 'productSettingStockoutAutoClearStock',
  component: () =>
      import(
        /* webpackChunkName: "product-setting-stockout-auto-clear-stock" */ './setting/auto-clear-stock/index.js'
      )
}]
