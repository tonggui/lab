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
          id: 'c_shangou_online_e_l2fn53ks',
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
        )
  },
  {
    path: 'product/setting',
    name: 'merchantSetting',
    component: SettingView,
    children: SettingPages
  },
  {
    /* 商家商品库中心 商家 审核页 */
    name: 'merchantAuditCheck',
    path: 'product/auditCheck',
    component: () =>
      import(
        /* webpackChunkName: "merchant_audit_check" */ './product/product-audit-check/index.js'
        )
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
    /* 商家商品库中心 审核列表 */
    name: 'merchantAuditList',
    path: 'product/auditList',
    component: () =>
      import(
        /* webpackChunkName: "merchant_audit_list" */ './product/product-audit-list/index'
        )
  }
]
