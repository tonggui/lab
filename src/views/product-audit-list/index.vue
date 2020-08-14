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
        return getColumns({
          [COLUMN_KEYS.INFO]: true,
          [COLUMN_KEYS.CATEGORY]: true,
          [COLUMN_KEYS.STATUS]: true,
          [COLUMN_KEYS.CTIME]: true,
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
