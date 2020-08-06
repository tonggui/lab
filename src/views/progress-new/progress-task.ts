import { TaskInfo } from '@/data/interface/common'
import { STATUS, STATUS_STR } from '../progress/constants'

enum TaskButtonStyle {
  Default = 'default',
  Primary = 'primary',
}

enum TaskActionType {
  Link = 'LINK',
  Modal = 'MODAL',
  Text = 'TEXT'
}

interface TaskAction {
  title: string;
  type: TaskActionType;
  btnType: TaskButtonStyle;
  // method: {
  //   title: '查看异常汇总',
  //   modalType: 'EXCEPTION_MERCHANT',
  //   getData: () => this.getTaskMessage(id)
  // }
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
      case STATUS.DOING: return [statusDisplayStr, '', '']
      case STATUS.SUCCESS: return ['', statusDisplayStr, '']
      case STATUS.FAIL: return ['', '', statusDisplayStr]
    }
    return ['', '', '']
  }

  get actions (): TaskAction[] {
    return []
  }
}

export {
  ProgressTask
}
