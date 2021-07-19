import { MerchantTaskType } from '../constant'
import { MerchantTaskBatchCreate } from '@/views/progress-new/models/merchant/merchant-task-batch-create'
import { MerchantProgressTask } from '@/views/progress-new/models/merchant/merchant-progress-task'
import { MerchantTaskBatchUploadImage } from '@/views/progress-new/models/merchant/merchant-task-batch-upload-image'
import { MerchantTaskBatchRel } from '@/views/progress-new/models/merchant/merchant-task-batch-rel'
import { NewMerchantTaskBatchRel } from '@/views/progress-new/models/merchant/new-merchant-task-batch-rel'
import { NewMerchantTaskBatchModify } from '@/views/progress-new/models/merchant/new-merchant-task-batch-modify'
import { MerchantTaskMultiCube } from '@/views/progress-new/models/merchant/merchant-task-multi-cube'

const createMerchantTaskViewModel = (task: TaskInfo) => {
  switch (task.type) {
    case MerchantTaskType.BATCH_CREATE_BY_EXCEL:
    case MerchantTaskType.BATCH_UPDATE_BY_EXCEL:
      return new MerchantTaskBatchCreate(task)
    case MerchantTaskType.BATCH_SYNC:
      return new MerchantTaskBatchRel(task)
    case MerchantTaskType.BATCH_UPLOAD_PIC:
      return new MerchantTaskBatchUploadImage(task)
    case MerchantTaskType.NEW_BATCH_REL:
      return new NewMerchantTaskBatchRel(task)
    case MerchantTaskType.BATCH_MODIFY_TAG:
      return new NewMerchantTaskBatchModify({
        task,
        modalTitle: '批量修改分类',
        failText: '有商品修改失败',
        failUrlText: '修改商品分类处理失败明细.xlsx',
        productUrlText: '修改分类的商品列表.xlsx'
      })
    case MerchantTaskType.BATCH_DELETE:
      return new NewMerchantTaskBatchModify({
        task,
        modalTitle: '批量删除商品',
        failText: '有商品删除失败',
        failUrlText: '批量删除商品处理失败明细.xlsx',
        productUrlText: '批量删除的商品列表.xlsx'
      })
    case MerchantTaskType.MULTI_CUBE_RECOMMEND:
      return new MerchantTaskMultiCube(task)
    default:
      return new MerchantProgressTask(task)
  }
}

export default createMerchantTaskViewModel
