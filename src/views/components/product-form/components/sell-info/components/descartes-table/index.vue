<template>
  <DescartesTable v-if="!!dimvalue"
    :keyName="keyName"
    :value="value"
    :columns="columns"
    :dimvalue="filterDimvalue"
    :generateItem="generateItem"
    :parentKey="parentKey"
    @on-change="handleChange"
    :required-position="requiredPosition"
    ref="table"
  />
  <Table v-else
    :dataSource="value"
    :columns="columns"
    :rowKey="rowKey"
    @on-change="handleChange"
    :required-position="requiredPosition"
    ref="table"
  />
</template>
<script>
  import {
    isEmptyArray
  } from '@/common/utils'
  import DescartesTable from './descartes-table'
  import Table from './table'

  export default {
    name: 'descartes-table-container',
    props: {
      dimvalue: {
        type: [Array, Boolean],
        default: false,
        validator (dimvalue) {
          if (typeof dimvalue === 'boolean') {
            return dimvalue === false
          }
          return true
        }
      },
      value: Array,
      columns: {
        type: Array,
        required: true
      },
      keyName: String,
      rowKey: Function,
      generateItem: Function,
      parentKey: String,
      requiredPosition: String
    },
    computed: {
      filterDimvalue () {
        if (!this.dimvalue) {
          return this.dimvalue
        }
        return this.dimvalue.filter(({ options }) => !isEmptyArray(options))
      }
    },
    components: {
      Table,
      DescartesTable
    },
    methods: {
      handleChange (dataSource, index) {
        this.$emit('on-change', dataSource, index)
      },
      validator () {
        const $table = this.$refs.table
        if ($table && $table.validator) {
          return $table.validator()
        }
        return false
      }
    }
  }
</script>
