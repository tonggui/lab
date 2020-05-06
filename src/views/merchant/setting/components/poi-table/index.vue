<template>
  <Table
    tableFixed
    :data="list"
    :pagination="pagination"
    :loading="loading"
    :columns="columns"
    @on-page-change="handlePageChange"
  >
    <template slot="header">
      <div class="subscription-poi-list-table-batch-op">
        <div class="subscription-poi-list-table-batch-select">
          <Checkbox @on-change="handleChangeSelectStatus" v-bind="checkboxStatus" />
          <Select v-model="selectType">
            <Option v-for="option in selectOptions" :value="option.value" :key="option.value">{{ option.label }}</Option>
          </Select>
        </div>
        <ButtonGroup>
          <Button type="primary" @click="handleBatchUpdate(true)">批量开启</Button>
          <Button @click="handleBatchUpdate(false)">批量关闭</Button>
        </ButtonGroup>
      </div>
    </template>
    <template v-slot:operation="{ row, rowIndex }">
      <div>
        <span>商品列表</span>
        <span @click="handleUpdateState(!row.status, row, rowIndex)">{{ row.status ? '关闭订阅' : '开启订阅' }}</span>
      </div>
    </template>
  </Table>
</template>
<script>
  import { selectOptions, SELECT_ALL_TYPE } from './constants'

  export default {
    name: 'setting-poi-list',
    props: {
      list: {
        type: Array,
        required: true
      },
      pagination: {
        type: Object,
        required: true
      },
      loading: Boolean,
      columns: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        selectType: SELECT_ALL_TYPE.PAGE,
        isAll: false,
        poiIdList: []
      }
    },
    computed: {
      selectOptions () {
        return selectOptions
      },
      checkboxStatus () {
        let value = false
        let indeterminate = false
        const total = this.pagination.total
        const count = this.poiIdList.length
        if (this.selectType === SELECT_ALL_TYPE.ALL) {
          value = this.isAll ? count === 0 : count === total
          indeterminate = !value && this.isAll ? count < total : count > 0
          return { value, indeterminate }
        }
        value = true
        this.list.forEach(i => {
          const includes = this.poiIdList.includes(i.id)
          const selected = this.isAll ? !includes : includes
          if (!selected) {
            value = false
          } else {
            indeterminate = true
          }
        })
        indeterminate = value ? false : indeterminate
        return { value, indeterminate }
      }
    },
    methods: {
      handlePageChange (pagination) {
        this.$emit('on-page-change', pagination)
      },
      handleUpdateStatus (status, poi, index) {
        this.$emit('update-status', { status, poi, index })
      },
      handleBatchUpdate (status) {
        this.$emit('batch-update-status', status)
      },
      handleChangeSelectStatus (status) {
        if (this.selectType === SELECT_ALL_TYPE.ALL) {
          this.isAll = !!status
          this.poiIdList = []
          return
        }
        // 已经全选，然后勾选本页 || 没有全选，然后取消勾选本页
        const pick = (this.isAll && status) || (!this.isAll && !status)
        const newPoiIdList = [...this.poiIdList]
        this.list.forEach(item => {
          const index = this.poiIdList.findIndex(id => id === item.id)
          if (pick && index >= 0) {
            newPoiIdList.splice(index, 1)
          } else if (!pick && index < 0) {
            newPoiIdList.push(item.id)
          }
        })
        this.poiIdList = newPoiIdList
      }
    }
  }
</script>
