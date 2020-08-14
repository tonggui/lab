// import { TaskAction, TaskActionType } from '@/views/progress-new/models/progress-task'
import { NewMerchantProgressTask } from '@/views/progress-new/models/merchant/merchant-progress-task-new'

class MerchantTaskBatchUploadImage extends NewMerchantProgressTask {
  get hasRelPoi (): boolean {
    return false
  }

  get sourceDisplayText (): string {
    return '查看上传详情'
  }

  // protected getExclusiveAction (): TaskAction[] {
  //   const actionList: TaskAction[] = []
  //   actionList.push({
  //     text: '查看上传详情',
  //     type: TaskActionType.Modal,
  //     action: {
  //       title: '查看上传详情',
  //       modalType: 'DETAIL_UPLOAD_IMGS',
  //       getData: () => this.fetchTaskDetail()
  //     }
  //   })
  //   return actionList
  // }
}

export { MerchantTaskBatchUploadImage }
