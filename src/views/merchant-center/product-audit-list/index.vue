<template>
  <AuditProductList :server="server" :columns="columns" :tab-list="tabList" :default-active-tab="defaultActiveTab">
    <template v-slot:operation="{ row, onDelete }">
      <AuditProductOperation :product="row" @cancel="onDelete"/>
    </template>
  </AuditProductList>
</template>
<script>
  import AuditProductList, {
    COLUMN_KEYS,
    getColumns
  } from '@/views/components/audit-product-list'
  import { tabList, defaultActiveTab } from './constants'
  import AuditProductOperation from './operation'
  import {
    fetchGetPoiAuditProductStatistics
  } from '@/data/repos/poi'
  import {
    fetchGetAuditProductList,
    fetchGetAuditProductSearchSuggestion
  } from '@/data/repos/product'
  import _ from 'lodash'
  import { PRODUCT_AUDIT_STATUS, PRODUCT_MARK } from '@/data/enums/product'
  import ProductInfo from '@components/product-table-info'

  export default {
    name: 'product-audit-page',
    data () {
      return {
        tabList,
        defaultActiveTab,
        server: {
          getStatistics: fetchGetPoiAuditProductStatistics,
          getList: fetchGetAuditProductList,
          getSearchSuggestion: fetchGetAuditProductSearchSuggestion
        }
      }
    },
    computed: {
      columns () {
        const cols = getColumns({
          [COLUMN_KEYS.INFO]: true,
          [COLUMN_KEYS.CATEGORY]: true,
          [COLUMN_KEYS.STATUS]: true,
          [COLUMN_KEYS.CTIME]: true,
          [COLUMN_KEYS.OPERATION]: true
        })

        const columnIndex = cols.findIndex(item => item.key === COLUMN_KEYS.INFO)
        if (columnIndex > -1) {
          const columnItem = _.cloneDeep(cols[columnIndex])
          cols[columnIndex] = {
            ...columnItem,
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
              const extraItems = []
              // 审核人编辑信息
              if (row.hasModifiedByAuditor) {
                extraItems.push(h(
                  'span', {
                    style: {
                      background: '#eee',
                      padding: '2px',
                      color: '#888',
                      'margin-left': '5px'
                    }
                  }, [
                    '审核人已修改部分商品信息，请查看详情'
                  ]
                ))
              }
              return h(ProductInfo, { props: { product: row, showMarker, markType } }, [
                h('template', {
                  slot: 'description'
                }, [
                  h('small', {
                    style: {
                      'margin-top': '3px'
                    }
                  }, [row.upcCode, ...extraItems])
                ])
              ])
            }
          }
        }

        return cols
      }
    },
    components: {
      AuditProductList,
      AuditProductOperation
    }
  }
</script>
