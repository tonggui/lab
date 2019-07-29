/*
 * @description
 *   Please write the menus script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-30)
 */
import PlusCircle from '@/assets/icons/add-plus.svg'
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

import SingleCreatePage from '@sgfe/eproduct/navigator/pages/single/create'
import SpCreatePage from '@sgfe/eproduct/navigator/pages/product/spCreate'
import BatchCreatePage from '@sgfe/eproduct/navigator/pages/batch/create'
import BatchUploadImagePage from '@sgfe/eproduct/navigator/pages/batch/uploadImgs'
import BatchModifyPage from '@sgfe/eproduct/navigator/pages/batch/modify'
import TaskListPage from '@sgfe/eproduct/navigator/pages/batch/process'
import RecyclePage from '@sgfe/eproduct/navigator/pages/product/recycle'
import ViolationPage from '@sgfe/eproduct/navigator/pages/violation/product'
import MonitorPage from '@sgfe/eproduct/navigator/pages/product/monitor'
import VideoCenterPage from '@sgfe/eproduct/navigator/pages/product/videoCenter'
// 样式1
// Icon、Text、children、埋点、Link、（Count + Color）

// 样式2
// Icon、Text、Badge、埋点、Link、Modal？、Tip

export default {
  create: {
    label: '新建单个商品',
    icon: PlusCircle,
    link: {
      name: SingleCreatePage.name
    },
    bid: 'b_e66gkndk'
  },
  library: {
    label: '从商品库新建',
    icon: SpAdd,
    link: {
      name: SpCreatePage.name
    },
    bid: 'b_8knn72gh'
  },
  violation: {
    label: '门店违规',
    icon: Monitoring,
    link: {
      name: ViolationPage.name
    },
    bid: 'b_c7lw595j'
  },
  monitor: {
    label: '商品监控',
    icon: Monitoring,
    errorIcon: MonitoringError,
    link: {
      name: MonitorPage.name
    },
    bid: 'b_1g0rgl4c'
  },
  unApproveList: {
    label: '待收录商品',
    link: '/merchant/product/unApproveList',
    icon: Cube,
    bid: 'b_shangou_online_e_4zr677t2_mc'
  },
  taskProgress: {
    label: '任务进度',
    link: '/merchant/progress',
    icon: Clock,
    bid: 'b_shangou_online_e_qbnauicy_mc'
  },
  batch: {
    label: '批量操作',
    icon: BatchOp
  },
  batchCreate: {
    label: '批量新建',
    link: {
      name: BatchCreatePage.name
    },
    bid: 'b_1xrhzpqn'
  },
  batchUpload: {
    label: '批量传图',
    link: {
      name: BatchUploadImagePage.name
    },
    bid: 'b_1qs629km'
  },
  batchModify: {
    label: '批量修改',
    link: {
      name: BatchModifyPage.name
    },
    bid: 'b_art4dqo0'
  },
  batchProgress: {
    label: '处理进度',
    link: {
      name: TaskListPage.name
    },
    bid: 'b_shangou_online_e_4kv94zvl_mc'
  },
  download: {
    name: 'download',
    label: '下载商品',
    icon: Download,
    bid: 'b_pqbxt5dh'
  },
  packageBag: {
    name: 'packageBag',
    label: '购物袋设置',
    icon: PackageBag,
    bid: 'b_iip7bxc0'
  },
  recycle: {
    label: '回收站',
    icon: Recycle,
    link: {
      name: RecyclePage.name
    },
    bid: 'b_pvg3kbxo'
  },
  videoManage: {
    label: '视频管理',
    icon: Video,
    link: {
      name: VideoCenterPage.name
    }
  }
}
