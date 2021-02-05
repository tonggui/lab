export default [{
  path: '',
  component: () => import(
    /* webpackChunkName: "merchant-product-setting" */'@/views/merchant/setting/setting-list/index.vue'
  ),
  meta: {
    // TODO
    pv: { cid: '' }
  }
}, {
  path: 'subscriptionPoiList',
  name: 'medicineMerchantSettingSubscriptionPoiList',
  component: () => import(
    /* webpackChunkName: "merchant-product-setting-subscription-poi-list" */'@/views/merchant/setting/subscription-poi-list/index.vue'
  ),
  meta: {
    // TODO
    pv: { cid: '' }
  }
}]
