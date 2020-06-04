export default [{
  path: '',
  component: () => import(
    /* webpackChunkName: "merchant-product-setting" */'./setting-list/index.vue'
  ),
  meta: {
    // TODO
    pv: { cid: '' }
  }
}, {
  path: 'subscriptionPoiList',
  name: 'merchantSettingSubscriptionPoiList',
  component: () => import(
    /* webpackChunkName: "merchant-product-setting-subscription-poi-list" */'./subscription-poi-list/index.vue'
  ),
  meta: {
    // TODO
    pv: { cid: '' }
  }
}]
