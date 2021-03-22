import { NewMerchantProgressTask } from './merchant-progress-task-new'
import { TaskAction, TaskActionType, TaskButtonStyle } from '@/views/progress-new/models/progress-task'
import { BATCH_REL_TASK_RESULT_STATUS } from '@/data/enums/batch'

class NewMerchantTaskBatchRel extends NewMerchantProgressTask {
  get hasRelPoi (): boolean {
    return true
  }

  get sourceDisplayText (): string {
    return '查看关联商品'
  }

  get displayStatusInfo (): string[] {
    const status: number = this.task.status || -1
    switch (status) {
      case BATCH_REL_TASK_RESULT_STATUS.ALL_SUCCESS: return ['', '处理完成', '']
      case BATCH_REL_TASK_RESULT_STATUS.PART_SUCCESS: return ['部分失败', '', '']
      case BATCH_REL_TASK_RESULT_STATUS.FAIL: return ['', '', '全部失败']
    }
    return ['', '', '']
  }

  protected getDetailAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { productExcelUrl, productCount } = this.task
    if (this.sourceDisplayText && productExcelUrl) {
      actionList.push({
        text: this.sourceDisplayText,
        type: TaskActionType.Modal,
        action: {
          title: this.sourceDisplayText,
          modalType: 'NEW_BATCH_TASK',
          getData: () => {
            return new Promise((resolve) => {
              resolve({
                text: `本次批量关联商品，共涉及${productCount}个商品`,
                link: productExcelUrl,
                linkText: '点击下载: 商品列表'
              })
            })
          }
        }
      })
    }
    return [...actionList]
  }
  protected getExclusiveAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { poiExcelUrl, poiCount } = this.task
    if (this.hasRelPoi && poiExcelUrl) {
      actionList.push({
        text: '查看关联门店',
        type: TaskActionType.Modal,
        action: {
          title: '查看关联门店',
          modalType: 'NEW_BATCH_TASK',
          getData: () => {
            return new Promise((resolve) => {
              resolve({
                text: `本次批量关联商品，共涉及${poiCount}个门店`,
                link: poiExcelUrl,
                linkText: '点击下载: 门店列表'
              })
            })
          }
        }
      })
    }
    return [...actionList, ...this.getDetailAction()]
  }
  protected getStatusAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { status = 0, extraLink } = this.task
    if ([BATCH_REL_TASK_RESULT_STATUS.FAIL, BATCH_REL_TASK_RESULT_STATUS.PART_SUCCESS].includes(status)) {
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
                text: '本次批量关联商品，本次批量关联商品，有部分商品失败',
                link: extraLink,
                linkText: '点击下载: 关联失败商品列表'
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

export { NewMerchantTaskBatchRel }
