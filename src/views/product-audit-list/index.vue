<template>
  <AuditProductList :server="server" :columns="columns">
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
  import AuditProductOperation from './operation'
  import {
    fetchGetPoiAuditProductStatistics
  } from '@/data/repos/poi'
  import {
    fetchGetAuditProductList,
    fetchGetAuditProductSearchSuggestion
  } from '@/data/repos/product'

  export default {
    name: 'product-audit-page',
    data () {
      return {
        server: {
          getStatistics: fetchGetPoiAuditProductStatistics,
          getList: fetchGetAuditProductList,
          getSearchSuggestion: fetchGetAuditProductSearchSuggestion
        }
      }
    },
    computed: {
      columns () {
        return getColumns({
          [COLUMN_KEYS.INFO]: true,
          [COLUMN_KEYS.CATEGORY]: true,
          [COLUMN_KEYS.STATUS]: true,
          [COLUMN_KEYS.OPERATION]: true
        })
      }
    },
    components: {
      AuditProductList,
      AuditProductOperation
    }
  }
</script>
