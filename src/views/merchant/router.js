/*
 * @description
 *   Please write the router script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-06-28)
 */
import SettingView from './setting'
import SettingPages from './setting/router'
import { PLATFORM } from '@/data/enums/common'
import { KEYS } from './batch-management/menus'
import BatchPages from './batch-management/router'
import { fetchGetMerchantOpenStatus, fetchGetRunningTaskStatus } from '@/data/repos/merchantProduct'
import LocalStorage, { KEYS as STORAGE_KEYS } from '@/common/local-storage'
import { MERCHANT_OPEN_STATUS } from '@/data/enums/product'
import { BATCH_REL_TASK_STATUS, BATCH_REL_TASK_RESULT_STATUS } from '@/data/enums/batch'
import { isAssociateMedicineMerchant } from '@/module/helper/utils'
import { jumpTo } from '@components/link'

export default [
  {
    path: 'product/edit',
    name: 'merchantEdit',
    component: () => import(
      /* webpackChunkName: "merchant-product-edit" */ './product/product-edit/index.js'
    ),
    meta: {
      pv: {
        cid: [{
          id: 'c_shangou_online_e_l2fn53ks', // 编辑
          match: obj => obj.spuId
        }, {
          id: 'c_shangou_online_e_0jqze6bd', // 新建
          match: obj => !obj.spuId
        }]
      },
      title: '商品管理'
    }
  },
  {
    path: 'product/list',
    name: 'merchantList',
    component: () => import(
      /* webpackChunkName: "merchant-product-list" */ './product/list/index.js'
    ),
    meta: {
      pv: { cid: 'c_shangou_online_e_036oyg8f' },
      title: '列表页'
    },
    beforeEnter: async (to, from, next) => {
      try {
        const {
          closeTaskStatus,
          resetTaskStatus,
          merStatus
        } = await fetchGetMerchantOpenStatus()
        const { id, status, resultStatus } = await fetchGetRunningTaskStatus(2)
        if (Object.values(BATCH_REL_TASK_STATUS).includes(resetTaskStatus)) {
          next({ name: 'merchantReset' })
        } else if (Object.values(BATCH_REL_TASK_STATUS).includes(closeTaskStatus)) {
          next({ name: 'merchantClose' })
        } else if (merStatus === MERCHANT_OPEN_STATUS.OPEN) {
          if (id > 0 && BATCH_REL_TASK_STATUS.FINISH === status && resultStatus !== BATCH_REL_TASK_RESULT_STATUS.ALL_SUCCESS) {
            jumpTo('/reuse/sc/product/views/seller/center/productImport')
          } else {
            next()
          }
        } else {
          LocalStorage[STORAGE_KEYS.MERCHANT_OPEN_STATUS] = false
          window.location.href = '/reuse/sc/product/views/seller/center/merchant'
        }
      } catch (err) {
        next()
      }
    }
  },
  {
    path: 'product/searchList',
    name: 'merchantSearchList',
    component: () => import(
      /* webpackChunkName: "merchant-product-searchList" */ './product/search-list/index.js'
    ),
    meta: {
      pv: { cid: 'c_shangou_online_e_rpslwq6a' },
      title: '搜索列表页'
    }
  },
  {
    path: 'product/unApproveList',
    name: 'merchantApproveList',
    component: () => import(
      /* webpackChunkName: "merchant-product-list-include" */ './product/approve-list/index.js'
    ),
    meta: {
      pv: { cid: 'c_shangou_online_e_xlro2t5z' },
      title: '待收录商品'
    }
  },
  {
    path: 'product/relPoi',
    name: 'merchantRelPoi',
    component: () => import(
      /* webpackChunkName: "merchant-product-list-poi" */ './product/associated-poi/index.js'
    ),
    meta: {
      pv: { cid: 'c_shangou_online_e_iddr9js8' },
      title: '商品关联门店列表'
    }
  },
  {
    /* 商家商品库中心 审核列表 */
    name: 'merchantAuditList',
    path: 'product/auditList',
    component: () =>
      import(
        /* webpackChunkName: "merchant-product-audit-list" */ './product/audit-list/index.vue'
      ),
    meta: {
      pv: { cid: 'c_shangou_online_e_y3h45qy3' },
      title: '商家商品中心审核列表'
    }
  },
  {
    path: 'product/setting',
    name: 'merchantSetting',
    component: SettingView,
    children: SettingPages
  },
  {
    /* 商家商品库中心 任务进度 */
    name: KEYS.PROGRESS,
    path: '/merchant/progress',
    component: () =>
      import(
        /* webpackChunkName: "merchant_progress" */ '../progress-new/index.vue'
      ),
    meta: {
      platform: PLATFORM.MERCHANT,
      pv: { cid: 'c_shangou_online_e_5ygjvh03' },
      title: '任务进度'
    }
  },
  {
    /* 批量管理 */
    path: 'batchManagement',
    component: () =>
      import(
        /* webpackChunkName: "merchant-batch-management" */ './batch-management/index.vue'
      ),
    children: BatchPages,
    beforeEnter: async (to, from, next) => {
      if (await isAssociateMedicineMerchant()) {
        // TODO 兼容医药批量管理跳转 后面会通过壳子的配置来做
        next({ name: 'merchantMedicineBatchCreate' })
      } else {
        next()
      }
    }
  },
  {
    name: 'newBatchRel',
    path: 'newBatchRel',
    component: () => import(
      /* webpackChunkName: "merchant-batch-management-batch-rel" */ './batch-management/new-batch-rel/index'
      ),
    meta: {
      platform: PLATFORM.MERCHANT,
      title: '批量关联商品',
      pv: {
        cid: 'c_shangou_online_e_9k3olj03'
      }
    }
  },
  {
    /* 商家商品库中心 商家 审核页 */
    name: 'merchantAuditCheck',
    path: 'product/auditCheck',
    component: () =>
      import(
        /* webpackChunkName: "merchant_audit_check" */ './product/product-audit-check/index.js'
      ),
    meta: {
      pv: { cid: 'c_shangou_online_e_l1zbbr16' },
      title: '审核详情页'
    }
  },
  {
    /* 商家商品库中心 运营 审核编辑页 */
    name: 'merchantAuditEdit',
    path: 'product/auditEdit',
    component: () =>
      import(
        /* webpackChunkName: "merchant_product_audit_edit" */ './product/product-audit-edit/index'
      )
  },
  {
    /* 商家商品库中心 审核中修改页 */
    name: 'merchantAuditCheckEdit',
    path: 'product/auditCheckEdit',
    component: () =>
      import(
        /* webpackChunkName: "merchant_product_audit_edit" */ './product/product-audit-check-edit/index'
      ),
    meta: {
      pv: { cid: 'c_shangou_online_e_l1zbbr16' },
      title: '审核详情修改页'
    }
  }
]
