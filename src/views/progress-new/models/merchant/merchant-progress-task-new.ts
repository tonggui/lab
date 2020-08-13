import { MerchantProgressTask } from './merchant-progress-task'
import { TaskAction, TaskActionType } from '@/views/progress-new/models/progress-task'
import { fetchGetTaskRelPoiList } from '@/data/repos/merchantPoi'

abstract class NewMerchantProgressTask extends MerchantProgressTask {
  // 是否存在关联门店
  abstract get hasRelPoi(): boolean;

  // 源文件信息描述
  abstract get sourceDisplayText (): string;

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
