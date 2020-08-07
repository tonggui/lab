import { TaskInfo } from '@/data/interface/common'
import {
  RESULT, STATUS, STATUS_STR, STATUS_SUCCESS_RESULT, STATUS_FAIL_RESULT,
  TYPE_OPR_STR, DETAIL_ACTION, DETAIL_METHOD
} from '../progress/constants'

enum TaskButtonStyle {
  Default = 'default',
  Primary = 'primary',
}

enum TaskActionType {
  Link = 'LINK',
  Modal = 'MODAL',
  Text = 'TEXT'
}

interface TaskActionModalConfig {
  title: string;
  modalType: string;
  getData: Function;
}

interface TaskAction {
  type: TaskActionType;
  text: string;
  btnType?: TaskButtonStyle;
  action?: Function | TaskActionModalConfig | string;
}

interface TaskViewModel {
  title: string;
  displayTime: string;
  displayStatusInfo: string[];
  actions: TaskAction[];
}

class ProgressTask implements TaskViewModel {
  task: TaskInfo;

  constructor (task: TaskInfo) {
    this.task = task
  }

  get title (): string {
    return this.task.name
  }

  get displayTime () : string {
    return this.task.time
  }

  get displayStatusInfo (): string[] {
    const status: number = this.task.status || -1
    const statusDisplayStr = STATUS_STR[status]
    switch (status) {
      case STATUS.COMPLETE: return [statusDisplayStr, '', '']
      case STATUS.SUCCESS: return ['', statusDisplayStr, '']
      case STATUS.FAIL: return ['', '', statusDisplayStr]
    }
    return ['', '', '']
  }

  get actions (): TaskAction[] {
    return [
      ...this.getExclusiveAction(),
      ...this.getStatusAction()
    ].filter(action => !!action)
  }

  protected fetchTaskException(): Promise<object> {}

  protected getExclusiveAction(): TaskAction[] {
    const actionList: TaskAction[] = [];
    const { status, result, type, output } = this.task
    actionList.push({
      text: TYPE_OPR_STR[type],
      type: DETAIL_ACTION[type],
      method: DETAIL_METHOD[type] === 'output' ? 'output' : Object.assign({}, DETAIL_METHOD[type], { getData: () => this.getTaskDetail(id, type) })
    })
    return actionList
  }

  protected getStatusAction(): TaskAction[] {
    const actionList: TaskAction[] = [];
    const { status, result, type, output } = this.task
    if (status === STATUS.COMPLETE) {
      if (result !== RESULT.SUCCESS) {
        actionList.push({
          text: '查看异常汇总',
          type: TaskActionType.Modal,
          action: {
            title: '查看异常详情',
            modalType: 'EXCEPTION',
            getData: () => this.fetchTaskException()
          }
        })
      }
      actionList.push({
        text: STATUS_SUCCESS_RESULT[type],
        type: TaskActionType.Link,
        action: output
      })
    } else if (status === STATUS.FAIL) {
      actionList.push({
        text: STATUS_FAIL_RESULT[type],
        type: TaskActionType.Text,
      })
    }
    return actionList
  }
}

export {
  ProgressTask
}
