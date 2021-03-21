import { NewMerchantProgressTask } from './merchant-progress-task-new'
import { TaskAction, TaskActionType } from '@/views/progress-new/models/progress-task'

class NewMerchantTaskBatchRel extends NewMerchantProgressTask {
  get hasRelPoi (): boolean {
    return true
  }

  get sourceDisplayText (): string {
    return '查看关联详情'
  }

  protected getDetailAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    console.log('this.task', this.task, actionList)
    const { detailLink } = this.task
    if (this.sourceDisplayText && detailLink) {
      actionList.push({
        text: this.sourceDisplayText,
        type: TaskActionType.Modal,
        action: {
          title: this.sourceDisplayText,
          modalType: 'DETAIL_MERCHANT',
          getData: () => ({ extraLink: detailLink })
        }
      })
    }
    return [...actionList]
  }
}

export { NewMerchantTaskBatchRel }
