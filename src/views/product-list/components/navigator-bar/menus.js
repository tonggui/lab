/*
 * @description
 *   Please write the menus script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-05-30)
 */
import PlusCircle from '@/assets/images/plus-circle.svg'
import SpAdd from '@/assets/images/sp-add.svg'
import BatchOp from '@/assets/images/batch-op.svg'

import SingleCreatePage from '@sgfe/eproduct/navigator/pages/single/create'
import SpCreatePage from '@sgfe/eproduct/navigator/pages/product/spCreate'
import BatchCreatePage from '@sgfe/eproduct/navigator/pages/batch/create'
import BatchUploadImagePage from '@sgfe/eproduct/navigator/pages/batch/uploadImgs'
import BatchModifyPage from '@sgfe/eproduct/navigator/pages/batch/modify'
import TaskListPage from '@sgfe/eproduct/navigator/pages/batch/process'

export default function createMenus () {
  const menus = [
    {
      label: '新建单个商品',
      icon: PlusCircle,
      link: SingleCreatePage.name,
      visible: () => true,
      bid: 'b_e66gkndk'
    },
    {
      label: '从商品库新建',
      icon: SpAdd,
      link: SpCreatePage.name,
      bid: 'b_8knn72gh'
    },
    {
      label: '批量操作',
      icon: BatchOp,
      subs: [
        {
          label: '批量新建',
          link: BatchCreatePage.name,
          bid: 'b_1xrhzpqn'
        },
        {
          label: '批量传图',
          link: BatchUploadImagePage.name,
          visible: () => true,
          bid: 'b_1qs629km'
        },
        {
          label: '批量修改',
          link: BatchModifyPage.name,
          bid: 'b_art4dqo0'
        },
        {
          label: '处理进度',
          link: TaskListPage.name,
          visible: () => true,
          bid: ''
        }
      ]
    }
  ]
  return menus
}
