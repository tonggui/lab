import { ProgressTask, TaskAction, TaskActionType, TaskButtonStyle } from '../progress-task'
import { MERCHANT_STATUS } from '../../../progress/constants'
import { PLATFORM } from '@/data/enums/common'
import { fetchTaskDetail, fetchTaskMessage } from '@/data/repos/taskRepository'

class MerchantProgressTask extends ProgressTask {
  get displayStatusInfo (): string[] {
    const status: number = this.task.status || -1
    const param1 = this.task.statusParam1
    const param2 = this.task.statusParam2
    switch (status) {
      case MERCHANT_STATUS.PENDING: return ['排队中', '', '']
      case MERCHANT_STATUS.DOING: return [`处理中（已完成${param1}%）`, '', '']
      case MERCHANT_STATUS.PART_SUCCESS: return ['', `成功：${param1}`, `失败：${param2}`]
      case MERCHANT_STATUS.SUCCESS: return ['', '全部成功', '']
      case MERCHANT_STATUS.FAIL: return ['', '', `全部失败：${param1}`]
      case MERCHANT_STATUS.INTERRUPTED: return ['', '', `已中断（已完成${param1}%）`]
    }
    return ['', '', '']
  }

  protected getExclusiveAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { status } = this.task
    actionList.push({
      text: '查看详情',
      type: TaskActionType.Modal,
      disabled: status === MERCHANT_STATUS.PENDING || status === MERCHANT_STATUS.DOING,
      action: {
        title: '查看详情',
        modalType: 'DETAIL_MERCHANT',
        getData: () => this.fetchTaskDetail()
      }
    })
    return actionList
  }

  protected getStatusAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { status } = this.task
    if (status === MERCHANT_STATUS.PART_SUCCESS || status === MERCHANT_STATUS.FAIL || status === MERCHANT_STATUS.INTERRUPTED) {
      actionList.push({
        text: '查看异常汇总',
        type: TaskActionType.Modal,
        btnType: TaskButtonStyle.Primary,
        action: {
          title: '查看异常汇总',
          modalType: 'EXCEPTION_MERCHANT',
          getData: () => this.fetchTaskException()
        }
      })
    }
    return actionList
  }

  async fetchTaskException (): Promise<any> {
    const { id } = this.task
    const result = await fetchTaskMessage(PLATFORM.MERCHANT, id)
    return result
  }

  async fetchTaskDetail (): Promise<any> {
    const { id, type } = this.task
    const result = await fetchTaskDetail(PLATFORM.MERCHANT, id, type)
    return result
  }
}

export {
  MerchantProgressTask
}
