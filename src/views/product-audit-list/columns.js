import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
import ProductInfo from '@components/product-table-info'
import moment from 'moment'

const statusMap = {
  [PRODUCT_AUDIT_STATUS.AUDITING]: '审核中',
  [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED]: '审核驳回',
  [PRODUCT_AUDIT_STATUS.AUDIT_APPROVED]: '审核通过',
  [PRODUCT_AUDIT_STATUS.AUDIT_REVOCATION]: '审核撤销'
}

export default [{
  title: '商品信息',
  minWidth: 200,
  maxWidth: 400,
  render: (h, { row }) => {
    return h(ProductInfo, { props: { product: row, showMarker: true } })
  }
}, {
  title: '商品类目',
  align: 'center',
  render: (h, { row }) => {
    return h('div', [row.category.namePath.join('>')])
  }
}, {
  title: '申报时间',
  key: 'ctime',
  sortable: 'custom',
  align: 'center',
  render: (h, { row }) => {
    return h('div', [moment(new Date(row.ctime)).format('YYYY-MM-DD HH:MM:SS')])
  }
}, {
  title: '审核状态',
  sortable: 'custom',
  key: 'utime',
  align: 'center',
  render: (h, { row }) => {
    const status = statusMap[row.auditStatus]
    return h('div', [
      h('p', [status]),
      h('p', [moment(new Date(row.utime)).format('YYYY-MM-DD HH:MM:SS')])
    ])
  }
}]
