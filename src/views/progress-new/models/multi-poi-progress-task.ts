import { ProgressTask, TaskAction, TaskActionType } from './progress-task'
import {
  fetchTaskPois
} from '@/data/repos/taskRepository'

class MultiPoiProgressTask extends ProgressTask {
  protected getExclusiveAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    actionList.push({
      text: '查看目标门店',
      type: TaskActionType.Modal,
      action: {
        title: '查看目标门店',
        modalType: 'POI',
        getData: () => this.fetchTaskPoiList()
      }
    })
    return [...actionList, ...super.getExclusiveAction()]
  }

  protected fetchTaskPoiList (): Promise<any> {
    return fetchTaskPois(this.task.id)
  }
}

export {
  MultiPoiProgressTask
}
