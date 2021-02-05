export default [{
  path: '',
  component: () => import(
    /* webpackChunkName: "meidicine-merchant-product-setting" */'./setting-list/index.vue'
  ),
  meta: {
    // TODO
    pv: { cid: '' }
  }
}, {
  path: 'subscriptionPoiList',
  name: 'medicineMerchantSettingSubscriptionPoiList',
  component: () => import(
    /* webpackChunkName: "medicine-merchant-product-setting-subscription-poi-list" */'./subscription-poi-list/index.vue'
  ),
  meta: {
    // TODO
    pv: { cid: '' }
  }
}]
