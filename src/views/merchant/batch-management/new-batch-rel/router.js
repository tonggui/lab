export default [
  {
    name: 'selectProduct',
    path: 'selectProduct',
    component: () => import(
      /* webpackChunkName: "merchant-batch-management-batch-uploadImages" */ './container/steps/step-product'
      ),
    meta: {
      title: '批量传图商品',
      pv: {
        cid: 'c_shangou_online_e_28r250qo'
      }
    }
  }
]
