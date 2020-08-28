import { MerchantTaskType } from '../constant'
import { MerchantTaskBatchCreate } from '@/views/progress-new/models/merchant/merchant-task-batch-create'
import { MerchantProgressTask } from '@/views/progress-new/models/merchant/merchant-progress-task'
import { MerchantTaskBatchUploadImage } from '@/views/progress-new/models/merchant/merchant-task-batch-upload-image'
import { MerchantTaskBatchRel } from '@/views/progress-new/models/merchant/merchant-task-batch-rel'

const createMerchantTaskViewModel = (task: TaskInfo) => {
  switch (task.type) {
    case MerchantTaskType.BATCH_CREATE_BY_EXCEL:
    case MerchantTaskType.BATCH_UPDATE_BY_EXCEL:
      return new MerchantTaskBatchCreate(task)
    case MerchantTaskType.BATCH_SYNC:
      return new MerchantTaskBatchRel(task)
    case MerchantTaskType.BATCH_UPLOAD_PIC:
      return new MerchantTaskBatchUploadImage(task)
    default:
      return new MerchantProgressTask(task)
  }
}

export default createMerchantTaskViewModel
