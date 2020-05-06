export default [{
  path: '',
  component: () => import(
    /* webpackChunkName: "merchant-product-setting" */'./setting-list/index.vue'
  )
}, {
  path: 'subscriptionPoiList',
  name: 'merchantSettingSubscriptionPoiList',
  component: () => import(
    /* webpackChunkName: "merchant-product-setting-subscription-poi-list" */'./subscription-poi-list/index.vue'
  )
}]
