export default [
  {
    path: 'product/edit',
    name: 'medicineEdit',
    components: {
      gray: () => import(
        /* webpackChunkName: "new-product-edit" */ '../new-product-edit/index.js'
      ),
      default: () => import(
        /* webpackChunkName: "medicine-product-edit" */ './product/edit/index.vue'
      )
    },
    meta: {
      pv: {
        cid: [{
          id: 'c_qe4s221n',
          match: obj => obj.spuId
        }, {
          id: 'c_4s0z2t6p', // 新建
          match: obj => !obj.spuId
        }]
      },
      title: '药品管理'
    }
  }
]
