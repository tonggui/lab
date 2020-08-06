import { ProgressTask } from './progress-task'
import { MERCHANT_STATUS } from '../progress/constants'

class MerchantProgressTask extends ProgressTask {
  get displayStatusInfo (): string[] {
    const status: number = this.task.status || -1
    const param1 = this.task.statusParam1
    const param2 = this.task.statusParam2
    switch (status) {
      case MERCHANT_STATUS.PENDING: return ['待处理', '', '']
      case MERCHANT_STATUS.DOING: return [`处理中（已完成${param1}%）`, '', '']
      case MERCHANT_STATUS.PART_SUCCESS: return ['', `成功：${param1}`, `失败：${param2}`]
      case MERCHANT_STATUS.SUCCESS: return ['', '全部成功', '']
      case MERCHANT_STATUS.FAIL: return ['', '', `全部失败：${param1}`]
      case MERCHANT_STATUS.INTERRUPTED: return ['', '', `已中断（已完成${param1}%）`]
    }
    return ['', '', '']
  }
}

export {
  MerchantProgressTask
}
