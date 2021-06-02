import { MerchantProgressTask } from './merchant-progress-task'
import { TaskAction, TaskActionType } from '@/views/progress-new/models/progress-task'
import { fetchGetTaskRelPoiList } from '@/data/repos/merchantPoi'
import { MERCHANT_STATUS } from '@/views/progress/constants'

abstract class NewMerchantProgressTask extends MerchantProgressTask {
  // 是否存在关联门店
  abstract get hasRelPoi(): boolean;

  // 源文件信息描述
  abstract get sourceDisplayText (): string;

  // TypeScript无法支持Property的重载访问（即此场景下无法使用super.displayStatusInfo）(TODO: 具体原理需调研)
  get displayStatusInfo (): string[] {
    const status: number = this.task.status || -1
    switch (status) {
      case MERCHANT_STATUS.PENDING: return ['排队中', '', '']
      case MERCHANT_STATUS.DOING: return [`处理中`, '', '']
      case MERCHANT_STATUS.PART_SUCCESS: return ['', '处理完成', '']
      case MERCHANT_STATUS.SUCCESS: return ['', '处理完成', '']
      case MERCHANT_STATUS.FAIL: return ['', '处理完成', '']
      case MERCHANT_STATUS.INTERRUPTED: return ['', '', '已中断']
    }
    return ['', '', '']
  }

  protected getExclusiveAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    if (this.hasRelPoi) {
      actionList.push({
        text: '查看关联门店',
        type: TaskActionType.Modal,
        action: {
          title: '关联门店',
          modalType: 'POI',
          getData: () => this.fetchTaskPoiList()
        }
      })
    }
    return [...actionList, ...this.getDetailAction()]
  }

  protected getDetailAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { contentLink } = this.task
    if (this.sourceDisplayText && contentLink) {
      actionList.push({
        text: this.sourceDisplayText,
        type: TaskActionType.Link,
        action: contentLink
      })
    }
    return [...actionList]
  }

  protected async fetchTaskPoiList (): Promise<any> {
    const wmPoiList = await fetchGetTaskRelPoiList(this.task.id)
    return {
      wmPoiList
    }
  }

  async fetchTaskException (): Promise<any> {
    const { extraLink } = this.task
    const result = await super.fetchTaskException()
    return Object.assign({}, result, {
      extraLink
    })
  }
}

export {
  NewMerchantProgressTask
}
