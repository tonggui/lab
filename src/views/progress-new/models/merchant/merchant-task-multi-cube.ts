import { NewMerchantProgressTask } from './merchant-progress-task-new'
import { TaskAction, TaskActionType, TaskButtonStyle } from '@/views/progress-new/models/progress-task'
import { MERCHANT_STATUS } from '@/views/progress/constants'

class MerchantTaskMultiCube extends NewMerchantProgressTask {
  get hasRelPoi (): boolean {
    return true
  }

  get sourceDisplayText (): string {
    return '查看关联商品'
  }

  get displayStatusInfo (): string[] {
    const status: number = this.task.status || -1
    switch (status) {
      case MERCHANT_STATUS.PENDING: return ['待处理', '', '']
      case MERCHANT_STATUS.DOING: return ['处理中', '', '']
      case MERCHANT_STATUS.SUCCESS: return ['', '全部成功', '']
      case MERCHANT_STATUS.PART_SUCCESS: return ['部分失败', '', '']
      case MERCHANT_STATUS.FAIL: return ['', '', '全部失败']
    }
    return ['', '', '']
  }

  protected getExclusiveAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { status = 0, poiCount, productCount } = this.task
    console.log('000')
    if ([MERCHANT_STATUS.SUCCESS, MERCHANT_STATUS.FAIL, MERCHANT_STATUS.PART_SUCCESS].includes(status)) {
      actionList.push({
        text: '查看详情',
        type: TaskActionType.Modal,
        disabled: status === MERCHANT_STATUS.PENDING || status === MERCHANT_STATUS.DOING,
        action: {
          title: '查看详情',
          modalType: 'NEW_BATCH_TASK',
          getData: () => {
            return new Promise((resolve) => {
              resolve({
                text: `需要创建${productCount}个商品到总共${poiCount}个门店，${status === (MERCHANT_STATUS.PART_SUCCESS || MERCHANT_STATUS.PART_SUCCESS) ? '部分' : '全部'}创建${status === MERCHANT_STATUS.FAIL ? '失败' : '成功'}`
              })
            })
          }
        }
      })
    }
    return actionList
  }
  protected getStatusAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { status = 0, detailLink } = this.task
    if ([MERCHANT_STATUS.FAIL, MERCHANT_STATUS.PART_SUCCESS].includes(status)) {
      actionList.push({
        text: '查看异常汇总',
        type: TaskActionType.Modal,
        btnType: TaskButtonStyle.Primary,
        action: {
          title: '查看异常汇总',
          modalType: 'NEW_BATCH_TASK',
          getData: () => {
            return new Promise((resolve) => {
              resolve({
                text: `本次魔方快捷新建，${status === MERCHANT_STATUS.FAIL ? '全部' : '部分'}创建失败`,
                link: detailLink,
                linkTitle: '具体错误明细：请点击下载',
                linkText: '创建失败商品列表.xls'
              })
            })
          }
        }
      })
    }
    return [...actionList]
  }
  protected get
}

export { MerchantTaskMultiCube }
