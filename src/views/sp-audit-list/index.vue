<template>
  <AuditProductList :server="server" :columns="columns">
    <template v-slot:operation="{ row, onDelete }">
      <AuditProductOperation :product="row" @cancel="onDelete" @delete="onDelete" />
    </template>
  </AuditProductList>
</template>
<script>
  import AuditProductList, { COLUMN_KEYS, getColumns } from '@/views/components/audit-product-list'
  import AuditProductOperation from './operation'
  import {
    fetchGetAuditSpList,
    fetchGetAuditSpSearchSuggestion
  } from '@/data/repos/medicineSpAudit'
  import {
    fetchGetPoiAuditSpStatistics
  } from '@/data/repos/poi'

  export default {
    name: 'product-audit-page',
    data () {
      return {
        server: {
          getStatistics: fetchGetPoiAuditSpStatistics,
          getList: fetchGetAuditSpList,
          getSearchSuggestion: fetchGetAuditSpSearchSuggestion
        }
      }
    },
    computed: {
      columns () {
        return getColumns({
          [COLUMN_KEYS.INFO]: true,
          [COLUMN_KEYS.CATEGORY]: true,
          [COLUMN_KEYS.CTIME]: true,
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
