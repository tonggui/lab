<script>
  import Table from '@/components/table-with-page'
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
    components: { Table },
    computed: {
      selectOptions () {
        return selectOptions
      },
      selectAllStatus () {
        let value = false
        let indeterminate = false

        const total = this.pagination.total
        const poiIdCount = this.poiIdList.length

        if (this.selectType === SELECT_ALL_TYPE.ALL) {
          if (this.isAll) {
            value = poiIdCount === 0
            indeterminate = poiIdCount > 0 && poiIdCount < total
          } else {
            value = poiIdCount === total
            indeterminate = poiIdCount > 0 && poiIdCount < total
          }
          return { value, indeterminate }
        }
        value = true
        this.showList.forEach(i => {
          if (!i._checked) {
            value = false
          } else {
            indeterminate = true
          }
        })
        indeterminate = value ? false : indeterminate
        return { value, indeterminate }
      },
      showList () {
        return this.list.map(i => {
          const includes = this.poiIdList.includes(i.id)
          const checked = this.isAll ? !includes : includes
          return { ...i, _checked: checked }
        })
      }
    },
    methods: {
      reset () {
        this.isAll = false
        this.poiIdList = []
      },
      triggerSelectChange (status, row) {
        const index = this.poiIdList.findIndex(id => id === row.id)
        const pick = (status && this.isAll && index >= 0) || (!status && !this.isAll && index >= 0)
        if (pick) {
          this.poiIdList.splice(index, 1)
        } else {
          this.poiIdList.push(row.id)
        }
      },
      handlePageChange (pagination) {
        this.$emit('page-change', pagination)
      },
      handleBatchUpdate (status) {
        this.$emit('batch-update-status', status, { isAll: this.isAll, poiIdList: this.poiIdList })
      },
      handleBatchOpen () {
        this.handleBatchUpdate(true)
      },
      handleBatchClosed () {
        this.handleBatchUpdate(true)
      },
      handleChangeSelectAll (status) {
        if (this.selectType === SELECT_ALL_TYPE.ALL) {
          this.isAll = !!status
          this.poiIdList = []
          return
        }
        // 已经全选，然后勾选本页 || 没有全选，然后取消勾选本页
        const pick = (this.isAll && status) || (!this.isAll && !status)
        const newPoiIdList = [...this.poiIdList]
        this.list.forEach(item => {
          const index = newPoiIdList.findIndex(id => id === item.id)
          if (pick && index >= 0) {
            newPoiIdList.splice(index, 1)
          } else if (!pick && index < 0) {
            newPoiIdList.push(item.id)
          }
        })
        this.poiIdList = newPoiIdList
      },
      handleTableSelect (selection, row) {
        this.triggerSelectChange(true, row)
      },
      handleTableSelectCancel (selection, row) {
        this.triggerSelectChange(false, row)
      },
      renderHeader (h) {
        return (
          <div class="subscription-poi-list-table-batch-op">
            <div class="subscription-poi-list-table-batch-select">
              <Checkbox vOn:on-change={this.handleChangeSelectAll} {...{ attrs: this.selectAllStatus } } />
              <Select vModel={this.selectType}>
                {
                  selectOptions.map(option => (
                    <Option value={option.value} key={option.value}>{option.label}</Option>
                  ))
                }
              </Select>
            </div>
            <ButtonGroup>
              <Button type="primary" vOn:click={this.handleBatchOpen}>批量开启</Button>
              <Button vOn:click={this.handleBatchClosed}>批量关闭</Button>
            </ButtonGroup>
          </div>
        )
      }
    },
    render (h) {
      return h(Table, {
        class: 'subscription-poi-list-table',
        props: {
          tableFixed: true,
          data: this.showList,
          pagination: this.pagination,
          loading: this.loading,
          columns: this.columns
        },
        on: {
          'on-page-change': this.handlePageChange,
          'on-select': this.handleTableSelect,
          'on-select-cancel': this.handleTableSelectCancel
        },
        scopedSlots: this.$scopedSlots
      }, [h('template', { slot: 'header' }, [this.renderHeader(h)])])
    }
  }
</script>
<style lang="less" scoped>
  .subscription-poi-list-table {
    background: @component-bg;
    /deep/ .boo-table-header {
      .boo-table-cell-with-selection {
        display: none;
      }
    }
    /deep/ .boo-table {
      td {
        height: 90px;
      }
    }
    &-batch-op {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px 10px 23px;
    }
    &-batch-select {
      display: inline-flex;
      align-items: center;
      /deep/.boo-checkbox-wrapper {
        margin-right: 15px;
      }
      /deep/ .boo-select {
        width: 120px;
      }
    }
  }
</style>
