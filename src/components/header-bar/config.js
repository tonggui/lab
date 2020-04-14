/*
 * @description
 *   Please write the menus script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-30)
 */
import PlusCircle from '@/assets/icons/small-circle-add.svg'
import SpAdd from '@/assets/icons/library-add.svg'
import BatchOp from '@/assets/icons/batch-op.svg'
import Recycle from '@/assets/icons/recycle-bin.svg'
import PackageBag from '@/assets/icons/package-bag.svg'
import Download from '@/assets/icons/download.svg'
import Monitoring from '@/assets/icons/monitoring.svg'
import MonitoringError from '@/assets/icons/monitoring-error.svg'
import Video from '@/assets/icons/video.svg'
import Clock from '@/assets/icons/clock.svg'
import Cube from '@/assets/icons/cube.svg'
import Audit from '@/assets/icons/audit.svg'

import SingleCreatePage from '@sgfe/eproduct/navigator/pages/product/edit'
import SpCreatePage from '@sgfe/eproduct/navigator/pages/product/spCreate'
import BatchCreatePage from '@sgfe/eproduct/navigator/pages/batch/create'
import BatchUploadImagePage from '@sgfe/eproduct/navigator/pages/batch/uploadImgs'
import BatchModifyPage from '@sgfe/eproduct/navigator/pages/batch/modify'
import TaskListPage from '@sgfe/eproduct/navigator/pages/batch/process'
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
  label: '新建单个商品',
  icon: PlusCircle,
  link: {
    name: SingleCreatePage.name
  },
  bid: 'b_e66gkndk'
}, {
  key: 'productLibrary',
  label: '从商品库新建',
  icon: SpAdd,
  link: {
    name: SpCreatePage.name
  },
  bid: 'b_8knn72gh'
}, {
  key: 'batchOperation',
  label: '批量操作',
  icon: BatchOp,
  bid: 'b_shangou_online_e_bzjwotke_mc',
  children: [{
    key: 'batchCreate',
    label: '批量新建',
    link: {
      name: BatchCreatePage.name
    },
    bid: 'b_1xrhzpqn'
  }, {
    key: 'batchUpload',
    label: '批量传图',
    link: {
      name: BatchUploadImagePage.name
    },
    bid: 'b_1qs629km'
  }, {
    key: 'batchModify',
    label: '批量修改',
    link: {
      name: BatchModifyPage.name
    },
    bid: 'b_art4dqo0'
  }, {
    key: 'batchProgress',
    label: '处理进度',
    link: {
      name: TaskListPage.name
    },
    bid: 'b_shangou_online_e_4kv94zvl_mc'
  }]
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
}, {
  key: 'monitor',
  label: '商品监控',
  icon: Monitoring,
  activeIcon: MonitoringError,
  link: {
    // name: MonitorPage.name
    path: '/product/monitor'
  },
  bid: 'b_1g0rgl4c'
}, {
  key: 'audit',
  label: '商品审核',
  link: {
    path: '/product/auditList'
  },
  icon: Audit, // TODO icon等视觉
  bid: 'b_shangou_online_e_jqobbov1_mc' // 埋点
}, {
  key: 'spAudit',
  label: '商品审核',
  link: {
    path: '/sp/auditList'
  },
  icon: Audit, // TODO icon等视觉
  bid: '' // 埋点
}]

export const rightMenu = [{
  key: 'autoClearStock',
  label: '缺货自动库存清0',
  icon: {
    type: 'update',
    style: 'line-height: 1.5'
  },
  link: {
    path: '/product/setting/stockoutAutoClearStock'
  },
  bid: 'b_shangou_online_e_8o6hqov0_mc'
}, {
  key: 'videoManage',
  label: '视频管理',
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
}]
