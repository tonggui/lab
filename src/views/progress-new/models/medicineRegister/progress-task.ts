import { ProgressTask, TaskAction, TaskActionType, TaskButtonStyle } from '../progress-task'
import { STATUS, MEDICINE_SETTINGS_STATUS_STR } from '../../../progress/constants'

class MedicineSettingsProgressTask extends ProgressTask {
  get displayStatusInfo (): string[] {
    const status: number | undefined = this.task.status
    const statusDisplayStr = MEDICINE_SETTINGS_STATUS_STR[status]
    switch (status) {
      case STATUS.COMPLETE: return [statusDisplayStr, '', '']
      case STATUS.DOING: return ['', statusDisplayStr, '']
      case STATUS.FAIL: return ['', '', statusDisplayStr]
    }
    return ['', '', '']
  }
  protected getExclusiveAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { contentLink } = this.task
    actionList.push({
      text: '查看配置详情',
      type: TaskActionType.Link,
      action: contentLink
    })
    return actionList
  }
  protected getStatusAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { status, extraLink } = this.task
    if (status === STATUS.FAIL) {
      actionList.push({
        text: '查看异常汇总',
        type: TaskActionType.Link,
        btnType: TaskButtonStyle.Primary,
        action: extraLink
      })
    }
    return actionList
  }
}

export {
  MedicineSettingsProgressTask
}