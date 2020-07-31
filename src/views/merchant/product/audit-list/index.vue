<template>
  <AuditProductList placeholder="商品名称/品牌/条码/货号" :server="server" :columns="columns" :tab-list="tabList" :default-active-tab="defaultActiveTab">
    <BreadcrumbHeader slot="breadcrumb">商品审核</BreadcrumbHeader>
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
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import {
    fetchGetPoiAuditProductStatistics
  } from '@/data/repos/merchantPoi'
  import {
    fetchGetAuditProductList,
    fetchGetAuditProductSearchSuggestion
  } from '@/data/repos/merchantProduct'

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
      AuditProductOperation,
      BreadcrumbHeader
    }
  }
</script>
