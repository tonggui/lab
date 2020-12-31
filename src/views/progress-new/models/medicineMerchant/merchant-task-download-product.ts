import { MerchantProgressTask } from './merchant-progress-task'
import { TaskAction, TaskActionType } from '@/views/progress-new/models/progress-task'
// import { MERCHANT_STATUS } from '@/views/progress/constants'

class MerchantTaskDownloadProduct extends MerchantProgressTask {
  protected getExclusiveAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { extraLink } = this.task
    actionList.push({
      text: '下载',
      type: TaskActionType.Link,
      action: extraLink
    })
    return actionList
  }
}

export {
  MerchantTaskDownloadProduct
}
