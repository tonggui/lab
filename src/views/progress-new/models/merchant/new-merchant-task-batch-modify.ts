import { NewMerchantProgressTask } from './merchant-progress-task-new'
import { TaskAction, TaskActionType, TaskButtonStyle } from '@/views/progress-new/models/progress-task'
import { BATCH_REL_TASK_RESULT_STATUS } from '@/data/enums/batch'

const SUB_TYPE = {
  1: '新增',
  2: '替换',
  3: '删除'
}

const POI_SELECT_TYPE = {
  1: '所有门店商品',
  2: '指定门店商品',
  3: '总部商品'
}

class NewMerchantTaskBatchModify extends NewMerchantProgressTask {
  private failText: any;
  private modalTitle: string;
  private failUrlText: string;
  private productUrlText: string;
  constructor (props) {
    const task = props.task
    super(task)
    this.modalTitle = props.modalTitle
    this.failText = props.failText
    this.failUrlText = props.failUrlText
    this.productUrlText = props.productUrlText
  }
  get hasRelPoi (): boolean {
    return true
  }

  get sourceDisplayText (): string {
    return this.modalTitle || ''
  }

  get displayStatusInfo (): string[] {
    const status: number = this.task.status || -1
    const param1 = this.task.statusParam1
    switch (status) {
      case BATCH_REL_TASK_RESULT_STATUS.PROCESSING: return [`处理中（已完成${param1}%）`, '', '']
      case BATCH_REL_TASK_RESULT_STATUS.ALL_SUCCESS: return ['', '处理完成', '']
      case BATCH_REL_TASK_RESULT_STATUS.PART_SUCCESS: return ['部分失败', '', '']
      case BATCH_REL_TASK_RESULT_STATUS.FAIL: return ['', '', '全部失败']
    }
    return ['', '', '']
  }

  protected getDetailAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { productExcelUrl, subType = 1, poiExcelUrl, tagList, productCount, poiSelectType = 1 } = this.task
    if (this.sourceDisplayText && productExcelUrl) {
      actionList.push({
        text: '查看详情',
        type: TaskActionType.Modal,
        action: {
          title: '查看详情',
          modalType: 'NEW_BATCH_TASK_MODIFY',
          getData: () => {
            return new Promise((resolve) => {
              resolve({
                type: 'success',
                subTitle: this.sourceDisplayText + `（涉及${productCount}个商品）`,
                modify: SUB_TYPE[subType],
                tag: tagList,
                productUrl: productExcelUrl,
                productUrlText: this.productUrlText,
                poiRange: POI_SELECT_TYPE[poiSelectType],
                poiUrl: poiExcelUrl
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
    // const { poiExcelUrl, poiCount } = this.task
    // if (this.hasRelPoi && poiExcelUrl) {
    //   actionList.push({
    //     text: '查看关联门店',
    //     type: TaskActionType.Modal,
    //     action: {
    //       title: '查看关联门店',
    //       modalType: 'NEW_BATCH_TASK_MODIFY',
    //       getData: () => {
    //         return new Promise((resolve) => {
    //           resolve({
    //             text: `本次批量关联商品，共涉及${poiCount}个门店`,
    //             link: poiExcelUrl,
    //             linkText: '点击下载: 门店列表'
    //           })
    //         })
    //       }
    //     }
    //   })
    // }
    return [...actionList, ...this.getDetailAction()]
  }
  protected getStatusAction (): TaskAction[] {
    const actionList: TaskAction[] = []
    const { status = 0, extraLink, productCount } = this.task
    if ([BATCH_REL_TASK_RESULT_STATUS.FAIL, BATCH_REL_TASK_RESULT_STATUS.PART_SUCCESS].includes(status)) {
      actionList.push({
        text: '查看异常汇总',
        type: TaskActionType.Modal,
        btnType: TaskButtonStyle.Primary,
        action: {
          title: '查看异常汇总',
          modalType: 'NEW_BATCH_TASK_MODIFY',
          getData: () => {
            return new Promise((resolve) => {
              resolve({
                type: 'fail',
                subTitle: this.sourceDisplayText + `（涉及${productCount}个商品）`,
                failText: this.failText,
                failUrlText: this.failUrlText,
                failUrl: extraLink
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

export { NewMerchantTaskBatchModify }
