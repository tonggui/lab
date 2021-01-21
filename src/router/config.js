import MerchantPages from '@/views/merchant/router'
import MerchantView from '@/views/merchant'
import MedicinePages from '@/views/medicine/router'
import MedicineView from '@/views/medicine'
import BatchPages from '@/views/batch-management/router'
import ProductSettingView from '@/views/product-setting'
import ProductSettingPages from '@/views/product-setting/router'
import ProductRecommendView from '@/views/product-recommend'
import ProductRecommendPages from '@/views/product-recommend/router'
import PharmacyMultiStoreManagePages from '@/views/pharmacy-multi-store-management/router'
import PharmacyMultiStoreManageView from '@/views/pharmacy-multi-store-management'
import ProductNewArrivalView from '@/views/product-new-arrival'
import ProductNewArrivalPages from '@/views/product-new-arrival/router'
import MedicineMerchantPages from '@/views/medicine/merchant/router'
import MedicineMerchantView from '@/views/medicine/merchant'

import _ from 'lodash'
import {
  PLATFORM
} from '@/data/enums/common'
import moduleControl from '@/module'
import { checkIsMedicineById, isAssociateMedicineMerchant } from '@/module/helper/utils'
import { getIsSinglePoi } from '@/views/batch-management/helper'

const routeList = [
  {
    /* 商品上新推荐 */
    name: 'newArrival',
    path: '/product/newArrival',
    component: ProductNewArrivalView,
    redirect: { path: '/product/newArrival/list' },
    children: ProductNewArrivalPages
  },
  {
    /* 商品推荐页 */
    name: 'productRecommend',
    path: '/product/recommend',
    component: ProductRecommendView,
    redirect: { path: '/product/recommend/list' },
    children: ProductRecommendPages
  },
  {
    /* 商品列表页面 */
    name: 'productList',
    path: '/product/list',
    component: () =>
      import(
        /* webpackChunkName: "product-list" */ '../views/product-list/index'
      ),
    meta: {
      pv: { cid: 'c_o6mvsbt8' },
      categoryAuth: true
    }
  },
  {
    /* 商品搜索列表页面 */
    name: 'productSearchList',
    path: '/product/searchList',
    component: () =>
      import(
        /* webpackChunkName: "product-search-list" */ '../views/search-list/index'
      ),
    meta: {
      pv: { cid: 'c_cqpzfm6x' },
      categoryAuth: true
    }
  },
  {
    /* 商品新建编辑页面 */
    name: 'productEdit',
    path: '/product/edit',
    components: {
      default: () =>
        import(
          /* webpackChunkName: "product-edit" */ '../views/product-edit/index'
        ),
      gray: () =>
        import(
          /* webpackChunkName: "new-product-edit" */ '../views/new-product-edit/index.js'
        )
    },
    meta: {
      pv: {
        cid: [{
          id: 'c_qe4s221n',
          match: obj => obj.spuId
        }, {
          id: 'c_4s0z2t6p',
          match: obj => !obj.spuId
        }]
      },
      categoryAuth: true
    }
  },
  {
    /* 组包商品新建编辑页面 */
    name: 'productPackageEdit',
    path: '/product/package',
    component: () =>
      import(
        /* webpackChunkName: "product-package-edit" */ '../views/product-package-edit/product-package-edit'
      ),
    meta: {
      categoryAuth: true,
      pv: { cid: 'c_shangou_online_e_5thmlz4f' }
    }
  },
  {
    /* 从商品库创建页面 */
    name: 'spCreate',
    path: '/product/spCreate',
    component: () =>
      import(
        /* webpackChunkName: "product-sp-create" */ '../views/sp-create/index'
      ),
    meta: {
      pv: {
        cid: [
          {
            id: 'c_shangou_online_e_ncly1xuc',
            match: () => {
              const context = moduleControl.getContext()
              // 数据异常 需要categoryAuth的路径都是单店路径 存在poiId
              if (!context || !context.categoryList) {
                return false
              }
              return _.every(context.categoryList, ({ id }) => checkIsMedicineById(id))
            }
          },
          {
            id: 'c_p1lxcnd2',
            match: () => true
          }
        ]
      },
      categoryAuth: true
    }
  },
  {
    /* 从爆品推荐页面 */
    name: 'hotRecommend',
    path: '/product/hotRecommend',
    component: () =>
      import(
        /* webpackChunkName: "product-hot-recommend" */ '../views/hotRecommend/index'
      ),
    meta: {
      pv: { cid: 'c_p7l1oy0k' }
    }
  },
  {
    /* 商家标品申报（目前仅支持药品） */
    name: 'spApply',
    path: '/sp/apply',
    components: {
      gray: () =>
        import(
          /* webpackChunkName: "new-product-sp-create" */ '../views/new-sp-apply/index'
        ),
      default: () =>
        import(
          /* webpackChunkName: "product-sp-create" */ '../views/sp-apply/index'
        )
    },
    meta: {
      pv: {
        cid: [{
          id: 'c_shangou_online_e_sflwlpec',
          match: obj => obj.spId
        }, {
          id: 'c_shangou_online_e_6lrumakc',
          match: obj => !obj.spId
        }]
      }
    }
  },
  {
    /* 商家标品纠错（目前仅支持药品） */
    name: 'spCorrect',
    path: '/sp/correct',
    components: {
      default: () =>
        import(
          /* webpackChunkName: "product-sp-correct" */ '../views/sp-correct/index'
        )
    }
  },
  {
    /* 商家标品申报（目前仅支持药品） */
    name: 'spAuditList',
    path: '/sp/auditList',
    component: () =>
      import(
        /* webpackChunkName: "product-sp-audit-list" */ '../views/sp-audit-list/index'
      ),
    meta: {
      pv: {
        cid: 'c_shangou_online_e_6k4cnaos'
      }
    }
  },
  {
    /* 商品监控 */
    name: 'productMonitor',
    path: '/product/monitor',
    component: () =>
      import(
        /* webpackChunkName: "monitor" */ '../views/monitor/index.vue'
      ),
    meta: {
      pv: { cid: 'c_xrtgkpau' },
      categoryAuth: true
    }
  },
  {
    /* 商品监控 - 价格异常商品 */
    name: 'productPriceAnomaly',
    path: '/product/priceAnomaly',
    component: () =>
      import(
        /* webpackChunkName: "priceAnomaly" */ '../views/priceAnomaly/index.vue'
      ),
    meta: {
      pv: { cid: 'c_g7mb65sq' },
      categoryAuth: true
    }
  },
  {
    /* 商品监控 - 库存不足商品 */
    name: 'productStockAnomaly',
    path: '/product/stockAnomaly',
    component: () =>
      import(
        /* webpackChunkName: "stockAnomaly" */ '../views/stockAnomaly/index.vue'
      ),
    meta: {
      pv: { cid: 'c_0jekc69s' },
      categoryAuth: true
    }
  },
  {
    /* 商品监控 - 滞销商品 */
    name: 'productUnsalable',
    path: '/product/unsalable',
    component: () =>
      import(
        /* webpackChunkName: "unsalable" */ '../views/unsalable/index.vue'
      ),
    meta: {
      pv: { cid: 'c_roa28l1m' },
      categoryAuth: true
    }
  },
  {
    /* 视频中心 */
    name: 'videoCenter',
    path: '/product/videoCenter',
    component: () =>
      import(
        /* webpackChunkName: "video-center" */ '../views/video-center/index.vue'
      ),
    meta: {
      pv: { cid: '' },
      categoryAuth: true
    }
  },
  {
    /* 回收站页面 */
    name: 'recycle',
    path: '/product/recycle',
    component: () =>
      import(
        /* webpackChunkName: "recycle" */ '../views/recycle/index.vue'
      ),
    meta: {
      pv: { cid: '' },
      categoryAuth: true
    }
  },
  {
    /* 违规信息页面 */
    name: 'violationInfo',
    path: '/product/violationInfo',
    component: () =>
      import(
        /* webpackChunkName: "violationInfo" */ '../views/violation-info/index.vue'
      ),
    meta: {
      pv: { cid: 'c_shangou_online_e_dvp3lbaj' },
      categoryAuth: true
    }
  },
  {
    /* 处理进度页面 */
    name: 'progress',
    path: '/batchManagement/progress',
    component: () =>
      import(
        /* webpackChunkName: "progress" */ '../views/progress/index.vue'
      ),
    meta: {
      pv: {
        cid: [{
          id: 'c_0lx3026u', // 单店
          match: obj => obj.wmPoiId
        }, {
          id: 'c_jh932wzy', // 跨店
          match: obj => !obj.wmPoiId
        }]
      },
      platform: PLATFORM.PRODUCT,
      title: '任务进度'
    }
  },
  {
    /* 商品设置页面 -- 包含缺货库存自动清零页面 */
    name: 'productSetting',
    path: '/product/setting',
    component: ProductSettingView,
    children: ProductSettingPages
  },
  {
    /* 商品 审核 列表页 */
    name: 'productAuditList',
    path: '/product/auditList',
    component: () =>
      import(
        /* webpackChunkName: "product-audit-list" */ '../views/product-audit-list/index.vue'
      ),
    meta: {
      title: '商品审核',
      pv: { cid: 'c_shangou_online_e_xreb5mx3' }
    }
  },
  {
    /* 商品 审核 运营编辑页 */
    name: 'productAuditEdit',
    path: '/product/auditEdit',
    components: {
      default: () =>
        import(
          /* webpackChunkName: "product-audit-edit" */ '../views/product-audit-edit/index.vue'
          ),
      gray: () =>
        import(
          /* webpackChunkName: "new-product-audit" */ '../views/new-product-audit/index.vue'
          )
    },
    meta: {
      title: '商品审核详情',
      pv: { cid: '' },
      categoryAuth: true
    }
  },
  {
    /* 商品 审核 商家编辑页 */
    name: 'productAuditCheck',
    path: '/product/auditCheck',
    components: {
      default: () =>
        import(
          /* webpackChunkName: "product-audit-check" */ '../views/product-audit-check/index.vue'
        ),
      gray: () =>
        import(
          /* webpackChunkName: "new-product-audit-check" */ '../views/new-product-audit-check/index.js'
        )
    },
    meta: {
      title: '商品审核详情',
      pv: { cid: 'c_shangou_online_e_rrpt94dt' }
    }
  },
  {
    /* 商品 商家 审核中 修改编辑页 */
    name: 'productAuditCheckEdit',
    path: '/product/auditCheckEdit',
    components: {
      default: () =>
        import(
          /* webpackChunkName: "product-audit-check" */ '../views/product-audit-check/index.vue'
          ),
      gray: () =>
        import(
          /* webpackChunkName: "new-product-audit-check-edit" */'../views/new-product-audit-check-edit/index.js'
          )
    },
    meta: {
      title: '商品审核详情',
      pv: { cid: 'c_shangou_online_e_rrpt94dt' } // TODO 埋点
    }
  },
  {
    /* 蜂窝缺失商品列表 */
    name: 'celluarMissingProductList',
    path: '/product/celluarMissingProductList',
    component: () =>
      import(
        /* webpackChunkName: "celluar-missing-product-list" */'../views/celluar-missing-product-list/index.js'
      ),
    meta: {
      title: '缺失商品列表',
      pv: { cid: 'c_shangou_online_e_189eno65' }
    }
  },
  {
    path: '/',
    redirect: { name: 'productList' }
  },
  {
    /* 批量管理 */
    path: '/batchManagement',
    component: () =>
      import(
        /* webpackChunkName: "batch-management" */ '../views/batch-management/index.vue'
      ),
    children: BatchPages,
    beforeEnter: async (to, from, next) => {
      if (await isAssociateMedicineMerchant() && !getIsSinglePoi(to.query)) {
        // TODO 兼容医药批量管理跳转 后面会通过壳子的配置来做
        next({ name: 'merchantMedicineBatchCreate' })
      } else {
        next()
      }
    }
  },
  {
    /* 商家商品库中心 */
    path: '/merchant',
    component: MerchantView,
    children: MerchantPages
  },
  {
    /* 医药商家商品库中心 */
    path: '/medicine/merchant',
    component: MedicineMerchantView,
    children: MedicineMerchantPages
  },
  {
    /* 药品 */
    path: '/medicine',
    component: MedicineView,
    children: MedicinePages
  },
  {
    /* 多门店管理 */
    path: '/multi-store',
    component: PharmacyMultiStoreManageView,
    children: PharmacyMultiStoreManagePages
  },
  {
    name: 'error',
    path: '/error',
    component: () =>
      import(
        /* webpackChunkName: "errorPage" */ '../views/error/index.vue'
      )
  }
]

// demo 页面环境隔离
if (process.env.NODE_ENV !== 'production') {
  const demoFileList = require.context('../', true, /demo\.vue$/)
  routeList.push({
    /* demo页面 */
    path: '/demo',
    component: () =>
      import(
        /* webpackChunkName: "demo" */ '../views/demo/index.vue'
      ),
    children: demoFileList.keys().filter(key => demoFileList(key).default.name).map(key => ({
      name: demoFileList(key).default.name,
      path: demoFileList(key).default.name,
      component: demoFileList(key).default
    }))
  })
}

// gray 页面灰度处理
const defaultGray = (list) => {
  return list.map(route => {
    let result = route
    if ('component' in route) {
      result = {
        ..._.omit(result, ['component', 'props']),
        components: {
          default: route.component,
          gray: route.component
        },
        props: {
          default: result.props,
          gray: result.props
        }
      }
    }
    if ('children' in route) {
      result.children = defaultGray(result.children)
    }
    return result
  })
}

export default defaultGray(routeList)
