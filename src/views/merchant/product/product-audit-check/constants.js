import {
  PRODUCT_AUDIT_STATUS
} from '@/data/enums/product'

export const WARNING_TIP = {
  [PRODUCT_AUDIT_STATUS.AUDITING]: '此商品正在审核中，请等待审核完成或撤销审核后再进行修改',
  [PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]: '商品审核驳回，仍按照原商品信息售卖'
}
