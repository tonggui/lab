import { MerchantTaskType } from '../constant'
import { MerchantTaskBatchCreate } from './merchant-task-batch-create'
import { MerchantProgressTask } from './merchant-progress-task'
// import { MerchantTaskBatchUploadImage } from './merchant-task-batch-upload-image'
import { MerchantTaskBatchRel } from './merchant-task-batch-rel'

const createMerchantTaskViewModel = (task: TaskInfo) => {
  console.log('createMerchantTaskViewModel', task.type, task)
  switch (task.type) {
    case MerchantTaskType.MEDICINE_BATCH_CREATE_BY_EXCEL:
    case MerchantTaskType.MEDICINE_BATCH_UPDATE_BY_EXCEL:
      return new MerchantTaskBatchCreate(task)
    case MerchantTaskType.MEDICINE_BATCH_CREATE_REL:
      return new MerchantTaskBatchRel(task)
    case MerchantTaskType.MEDICINE_BATCH_DELETE_REL_BY_EXCEL:
      return new MerchantTaskBatchRel(task)
    case MerchantTaskType.BATCH_SYNC:
      return new MerchantTaskBatchRel(task)
    // case MerchantTaskType.BATCH_UPLOAD_PIC:
    //   return new MerchantTaskBatchUploadImage(task)
    default:
      return new MerchantProgressTask(task)
  }
}

export default createMerchantTaskViewModel
