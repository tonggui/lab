import { NewMerchantProgressTask } from './merchant-progress-task-new'
import { TaskAction, TaskActionType } from '@/views/progress-new/models/progress-task'

class MerchantTaskBatchRel extends NewMerchantProgressTask {
  get hasRelPoi (): boolean {
    return true
  }

  get sourceDisplayText (): string {
    return '查看关联详情'
  }

  protected getDetailAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { detailLink } = this.task
    if (this.sourceDisplayText && detailLink) {
      actionList.push({
        text: this.sourceDisplayText,
        type: TaskActionType.Modal,
        action: {
          title: '商品关联详情',
          modalType: 'DETAIL_MERCHANT',
          getData: () => ({ extraLink: detailLink })
        }
      })
    }
    return [...actionList]
  }
}

export { MerchantTaskBatchRel }
