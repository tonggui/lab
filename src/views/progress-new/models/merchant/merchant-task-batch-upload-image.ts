import { MerchantProgressTask } from './merchant-progress-task'
import { TaskAction, TaskActionType } from '@/views/progress-new/models/progress-task'

class MerchantTaskBatchUploadImage extends MerchantProgressTask {
  protected getExclusiveAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    actionList.push({
      text: '查看上传详情',
      type: TaskActionType.Modal,
      action: {
        title: '查看上传详情',
        modalType: 'DETAIL_UPLOAD_IMGS',
        getData: () => this.fetchTaskDetail()
      }
    })
    return actionList
  }
}

export { MerchantTaskBatchUploadImage }
