import { TaskInfo } from '@/data/interface/common'
import {
  DETAIL_ACTION,
  DETAIL_METHOD,
  RESULT,
  STATUS,
  STATUS_FAIL_RESULT,
  STATUS_STR,
  STATUS_SUCCESS_RESULT,
  TYPE_OPR_STR
} from '../../progress/constants'
import { fetchTaskDetail, fetchTaskMessage } from '@/data/repos/taskRepository'
import { PLATFORM } from '@/data/enums/common'
import showModal from './showProcessModal.js'

export enum TaskButtonStyle {
  Default = 'default',
  Primary = 'primary',
}

export enum TaskActionType {
  Link = 'LINK',
  Modal = 'MODAL',
  Text = 'TEXT'
}

interface TaskActionModalConfig {
  title: string;
  modalType: string;
  getData: Function;
}

export interface TaskAction {
  type: TaskActionType;
  text: string;
  disabled?: boolean;
  btnType?: TaskButtonStyle;
  action?: Function | TaskActionModalConfig | string;
}

interface TaskViewModel {
  title: string;
  displayTime: string;
  displayStatusInfo: string[];
  actions: TaskAction[];
  handleAction: Function;
}

class ProgressTask implements TaskViewModel {
  task: TaskInfo;

  constructor (task: TaskInfo) {
    this.task = task
  }

  get title (): string {
    return `${this.task.name}----${this.constructor.name}`
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

  async handleAction (taskAction: TaskAction): Promise<boolean> {
    let handled = false
    if (taskAction.type === TaskActionType.Link) {
      if (taskAction.action && typeof taskAction.action === 'string') {
        window.open(taskAction.action)
        handled = true
      }
    } else if (taskAction.type === TaskActionType.Modal && taskAction.action) {
      const modalAction: TaskActionModalConfig = <TaskActionModalConfig>taskAction.action
      let data, error
      if (modalAction.getData) {
        try {
          data = await modalAction.getData()
        } catch (err) {
          error = err
        }
      }
      if (showModal(modalAction.modalType, modalAction.title, data, error)) {
        handled = true
      }
    }
    return handled
  }

  protected async fetchTaskException (): Promise<any> {
    const { id } = this.task
    const result = await fetchTaskMessage(PLATFORM.PRODUCT, id)
    return result
  }

  protected async fetchTaskDetail (): Promise<any> {
    const { id, type } = this.task
    const result = await fetchTaskDetail(PLATFORM.PRODUCT, id, type)
    return result
  }

  protected getExclusiveAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { type, output } = this.task
    actionList.push({
      text: TYPE_OPR_STR[type],
      type: DETAIL_ACTION[type],
      action: DETAIL_METHOD[type] === 'output' ? output : Object.assign({}, DETAIL_METHOD[type], { getData: () => this.fetchTaskDetail() })
    })
    return actionList
  }

  protected getStatusAction (): TaskAction[] {
    const actionList: TaskAction[] = []
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
        type: TaskActionType.Text
      })
    }
    return actionList
  }
}

export {
  ProgressTask
}
