export default [{
  path: 'stockoutAutoClearStock',
  name: 'productSettingStockoutAutoClearStock',
  component: () =>
      import(
        /* webpackChunkName: "product-setting-stockout-auto-clear-stock" */ './setting/auto-clear-stock/index.js'
      ),
  meta: {
    pv: { cid: 'c_shangou_online_e_6h9nu9dp' }
  }
}, {
  path: 'restrictedPurchase',
  name: 'restrictedPurchase',
  component: () =>
      import(
        /* webpackChunkName: "product-setting-stockout-auto-clear-stock" */ './setting/restricted-purchase/index.js'
      ),
  meta: {
    pv: { cid: '' }
  }
}]
