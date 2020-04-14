import {
  PRODUCT_AUDIT_STATUS,
  PRODUCT_MARK
} from '@/data/enums/product'
import ProductInfo from '@components/product-table-info'
import moment from 'moment'

const statusMap = {
  [PRODUCT_AUDIT_STATUS.SP_UNAUDIT]: '未送审',
  [PRODUCT_AUDIT_STATUS.AUDITING]: '审核中',
  [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED]: '审核驳回',
  [PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]: '审核驳回', // 纠错驳回也属于审核驳回
  [PRODUCT_AUDIT_STATUS.AUDIT_APPROVED]: '审核通过',
  [PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION]: '已撤销'
}

export const COLUMN_KEYS = {
  INFO: 'info',
  CATEGORY: 'category',
  CTIME: 'ctime',
  STATUS: 'status',
  OPERATION: 'operation'
}

const columns = [{
  key: COLUMN_KEYS.INFO,
  title: '商品信息',
  minWidth: 200,
  align: 'center',
  render: (h, { row }) => {
    const showMarker = [
      PRODUCT_AUDIT_STATUS.AUDITING,
      PRODUCT_AUDIT_STATUS.AUDIT_REJECTED,
      PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED
    ].includes(row.auditStatus)
    let markType
    if (row.auditStatus === PRODUCT_AUDIT_STATUS.AUDITING) {
      markType = PRODUCT_MARK.AUDITING
    } else if ([PRODUCT_AUDIT_STATUS.AUDIT_REJECTED, PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED].includes(row.auditStatus)) {
      markType = PRODUCT_MARK.AUDIT_REJECTED
    }
    return h(ProductInfo, { props: { product: row, showMarker, markType } }, [h('template', {
      slot: 'description'
    }, [h('small', [row.upcCode])])])
  }
}, {
  key: COLUMN_KEYS.CATEGORY,
  title: '商品类目',
  align: 'center',
  width: 256,
  render: (h, { row }) => {
    return h('div', [row.category.namePath.join('>')])
  }
}, {
  key: COLUMN_KEYS.CTIME,
  title: '申报时间',
  align: 'center',
  width: 140,
  render: (h, { row }) => {
    return h('div', [moment(row.ctime).format('YYYY-MM-DD hh:mm:ss')])
  }
}, {
  key: COLUMN_KEYS.STATUS,
  title: '审核状态',
  align: 'center',
  width: 121,
  render: (h, { row }) => {
    const status = statusMap[row.auditStatus]
    const className = ({
      [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED]: 'danger',
      [PRODUCT_AUDIT_STATUS.AUDIT_CORRECTION_REJECTED]: 'danger',
      [PRODUCT_AUDIT_STATUS.AUDIT_APPROVED]: 'success',
      [PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION]: 'desc-text'
    })[row.auditStatus]
    return h('div', [
      h('p', {
        class: className
      }, [status])
    ])
  }
}, {
  key: COLUMN_KEYS.OPERATION,
  title: '操作',
  width: 130,
  align: 'center',
  slot: 'operation'
}]

export default (map) => {
  return columns.filter(column => !!map[column.key])
}
