import {
  PRODUCT_AUDIT_STATUS,
  PRODUCT_AUDIT_TYPE
} from '@/data/enums/product'

export const WARNING_TIP = {
  [PRODUCT_AUDIT_STATUS.AUDITING]: {
    [PRODUCT_AUDIT_TYPE.START_AUDIT]: '审核中，无法售卖，请等待审核完成或撤销审核后再进行修改',
    [PRODUCT_AUDIT_TYPE.START_SELL]: '审核中，可正常售卖'
  },
  [PRODUCT_AUDIT_STATUS.AUDITING]: '此商品正在审核中，请等待审核完成或撤销审核后再进行修改',
  [PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]: '商品审核驳回，仍按照原商品信息售卖'
}
