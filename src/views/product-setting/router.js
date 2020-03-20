export default [{
  path: 'stockoutAutoClearStock',
  name: 'productSettingStockoutAutoClearStock',
  component: () =>
      import(
        /* webpackChunkName: "product-setting-stockout-auto-clear-stock" */ './setting/auto-clear-stock/index.js'
      ),
  meta: {
    cid: 'c_shangou_online_e_6h9nu9dp'
  }
}]
