import { NewMerchantProgressTask } from './merchant-progress-task-new'

class MerchantTaskBatchCreate extends NewMerchantProgressTask {
  get hasRelPoi (): boolean {
    return true
  }

  get sourceDisplayText (): string {
    return '查看商品列表'
  }
}

export { MerchantTaskBatchCreate }
