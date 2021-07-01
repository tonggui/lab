/*
 * @description
 *   Please write the menus script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-30)
 */
import PlusCircle from '@/assets/icons/circle-add.svg'
import SearchCreate from '@/assets/icons/search-create.svg'
import BatchCreate from '@/assets/icons/batch-create.svg'
import BatchRel from '@/assets/icons/batchRel.svg'
// import Menu from '@/assets/icons/menu.svg'
// import SpAdd from '@/assets/icons/library-add.svg'
import BatchOp from '@/assets/icons/batch-op.svg'
import Recycle from '@/assets/icons/recycle-bin.svg'
import PackageBag from '@/assets/icons/package-bag.svg'
import Download from '@/assets/icons/download.svg'
import Monitoring from '@/assets/icons/monitoring.svg'
import Video from '@/assets/icons/video.svg'
import Clock from '@/assets/icons/clock.svg'
import Cube from '@/assets/icons/cube.svg'
import Audit from '@/assets/icons/audit.svg'
import Setting from '@/assets/icons/setting.svg'

import SingleCreatePage from '@sgfe/eproduct/navigator/pages/product/edit'
import SpCreatePage from '@sgfe/eproduct/navigator/pages/product/spCreate'
// import BatchCreatePage from '@sgfe/eproduct/navigator/pages/batch/create'
import BatchUploadImagePage from '@sgfe/eproduct/navigator/pages/batch/uploadImgs'
// import BatchModifyPage from '@sgfe/eproduct/navigator/pages/batch/modify'
// import TaskListPage from '@sgfe/eproduct/navigator/pages/batch/process'
import RecyclePage from '@sgfe/eproduct/navigator/pages/product/recycle'
import ViolationPage from '@sgfe/eproduct/navigator/pages/violation/product'
// import MonitorPage from '@sgfe/eproduct/navigator/pages/product/monitor'
import VideoCenterPage from '@sgfe/eproduct/navigator/pages/product/videoCenter'

// 样式1
// Icon、Text、children、埋点、Link、（Count + Color）
// 样式2
// Icon、Text、Badge、埋点、Link、Modal？、Tip
export const leftMenu = [{
  key: 'createProduct',
  label: '手动新建',
  icon: PlusCircle,
  link: {
    name: SingleCreatePage.name
  },
  bid: 'b_e66gkndk',
  description: '自行录入单个商品信息'
},
{
  key: 'productLibrary',
  label: '搜索新建',
  icon: SearchCreate,
  link: {
    name: SpCreatePage.name
  },
  bid: 'b_8knn72gh',
  description: '从平台商品库直接选择'
},
{
  key: 'batchCreate',
  label: '批量新建',
  link: {
    path: '/batchManagement/batchCreate'
  },
  icon: BatchCreate,
  bid: 'b_1xrhzpqn',
  description: '通过表格批量新建多个'
}]

export const rightMenu = [{
  key: 'merchantWarehouseConfig',
  label: '商品库设置',
  icon: Setting,
  children: [
    {
      key: 'importFromPoi',
      label: '从分店导入商品'
    },
    {
      key: 'resetMerchant',
      label: '重置总部商品库'
    },
    {
      key: 'closeMerchant',
      label: '关闭总部商品库'
    }
  ],
  bid: '' // TODO
}, {
  key: 'productConfig',
  label: '商品配置管理',
  icon: {
    type: 'cloud-queue'
  },
  link: {
    path: '/merchant/product/setting'
    // query: {
    //   merchantId: getMerchantId()
    // }
  },
  bid: 'b_shangou_online_e_87g8c28d_mc'
}, {
  key: 'batchOperation',
  label: '批量传图/修改/删除',
  icon: BatchOp,
  link: {
    name: BatchUploadImagePage.name
  },
  bid: 'b_shangou_online_e_bzjwotke_mc'
  // children: [{
  //   key: 'batchCreate',
  //   label: '批量新建',
  //   link: {
  //     path: '/batchManagement/batchCreate'
  //   },
  //   bid: 'b_1xrhzpqn'
  // }, {
  //   key: 'batchUpload',
  //   label: '批量传图',
  //   link: {
  //     name: BatchUploadImagePage.name
  //   },
  //   bid: 'b_1qs629km'
  // }, {
  //   key: 'batchModify',
  //   label: '批量修改',
  //   link: {
  //     path: '/batchManagement/batchModify'
  //   },
  //   bid: 'b_art4dqo0'
  // }, {
  //   key: 'batchRel',
  //   label: '批量关联',
  //   link: {
  //     path: '/merchant/batchManagement/batchRel'
  //   },
  //   bid: ''
  // }, {
  //   key: 'batchSync',
  //   label: '批量同步',
  //   link: '',
  //   bid: ''
  // }, {
  //   key: 'batchProgress',
  //   label: '处理进度',
  //   link: {
  //     name: TaskListPage.name
  //   },
  //   bid: 'b_shangou_online_e_4kv94zvl_mc'
  // }]
},
{
  key: 'batchRel',
  label: '批量关联',
  icon: BatchRel,
  link: {
    path: '/merchant/batchManagement/batchRel'
  },
  bid: ''
},
{
  key: 'merchantProductConfig',
  label: '商品配置管理',
  icon: {
    type: 'cloud-queue'
  },
  link: {
    path: '/merchant/product/setting'
  }
},
//  {
//   key: 'autoClearStock',
//   label: '缺货自动库存清0',
//   icon: {
//     type: 'update',
//     style: 'line-height: 1.5'
//   },
//   link: {
//     path: '/product/setting/stockoutAutoClearStock'
//   },
//   bid: 'b_shangou_online_e_8o6hqov0_mc'
// }
{
  key: 'videoManage',
  label: '封面视频管理',
  icon: Video,
  link: {
    name: VideoCenterPage.name
  }
}, {
  key: 'download',
  label: '下载商品',
  icon: Download,
  bid: 'b_pqbxt5dh'
}, {
  key: 'shoppingBag',
  label: '购物袋设置',
  icon: PackageBag,
  bid: 'b_iip7bxc0'
}, {
  key: 'recycle',
  label: '回收站',
  icon: Recycle,
  link: {
    name: RecyclePage.name
  },
  bid: 'b_pvg3kbxo'
}, {
  key: 'unApproveProduct',
  label: '待收录商品',
  link: {
    path: '/merchant/product/unApproveList'
  },
  icon: Cube,
  bid: 'b_shangou_online_e_4zr677t2_mc'
}, {
  key: 'taskProgress',
  label: '任务进度',
  link: {
    path: '/merchant/progress'
  },
  icon: Clock,
  bid: 'b_shangou_online_e_qbnauicy_mc'
}, {
  key: 'violation',
  label: '门店违规',
  icon: Monitoring,
  link: {
    name: ViolationPage.name
  },
  bid: 'b_c7lw595j'
},
{
  key: 'audit',
  label: '商品审核',
  link: {
    path: '/product/auditList'
  },
  icon: Audit, // TODO icon等视觉
  bid: 'b_shangou_online_e_jqobbov1_mc' // 埋点
}, {
  key: 'spAudit',
  label: '商品审核(标品)',
  link: {
    path: '/sp/auditList'
  },
  icon: Audit, // TODO icon等视觉
  bid: 'b_shangou_online_e_ydtfscm5_mc' // 埋点
}, {
  key: 'batchSetting',
  label: '批量城市配置',
  icon: BatchOp,
  link: {
    path: '/batchManagement/batchModify'
  }
}]
