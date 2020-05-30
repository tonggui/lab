<template>
  <QuickEditProductTable
    tableFixed
    group
    :columns="columns"
    :type="type"
    :data="showGroupData"
    :pagination="pagination"
    :rowKey="getRowKey"
    :rowSelection="rowSelection"
    @modify-product="handleModifyProduct"
    @modify-sku="handleModifySku"
    @on-select="handleSelect"
    @on-page-change="handlePageChange"
  >
    <template v-slot:groupHeader="{ group }">
      <div class="product-recommend-edit-table-group-header">
        <Checkbox :value="getChecked(group.id)" @on-change="() => handleGroupChecked(group.id)">{{ group.name }}</Checkbox>
      </div>
    </template>
    <div slot="header" v-if="total > 0" class="product-recommend-edit-table-batch-operation">
      <div><Checkbox @on-change="handleSelectAll" :value="selectAll">全选本页</Checkbox></div>
      <div>
        <span class="batch-delete" :class="{ disabled: batchCount <= 0 }" @click="handleBatchDelete">批量删除商品</span>
        <Button type="primary" :disabled="batchCount <= 0">确认创建<span v-if="batchCount > 0" @click="handleBatchCreate">({{ batchCount }})</span></Button>
      </div>
    </div>
  </QuickEditProductTable>
</template>
<script>
  import QuickEditProductTable from '@/views/components/quick-edit-product-table'
  import { TYPE } from '@/views/components/quick-edit-product-table/constants'
  import Operation from './operation'
  import { defaultPagination } from '@/data/constants/common'

  export default {
    name: 'product-recommend-edit-table',
    components: {
      QuickEditProductTable
    },
    props: {
      groupData: Array
    },
    data () {
      return {
        pagination: {
          ...defaultPagination,
          total: this.groupData.reduce((prev, { productList }) => prev + productList.length, 0)
        },
        selectIdList: []
      }
    },
    watch: {
      groupData (groupData) {
        const { pageSize, current } = this.pagination
        const total = groupData.reduce((prev, { productList }) => prev + productList.length, 0)
        if (current > 1) {
          const start = (current - 1) * pageSize
          if (start >= total) {
            this.pagination.current = Math.ceil(total / pageSize)
          }
        }
        this.pagination.total = total
      }
    },
    computed: {
      total () {
        return this.pagination.total
      },
      columns () {
        return [{
          title: '店内分类',
          dimension: 'spu',
          align: 'center',
          width: 180,
          render: (h, { row }) => {
            const tagName = row.tagList.map(tag => {
              const { parentName, name } = tag
              return parentName ? `${parentName}>${name}` : name
            }).join(';')
            return h('div', [tagName])
          }
        }, {
          title: '操作',
          dimension: 'spu',
          align: 'center',
          width: 140,
          render: (h, { row }) => {
            return h(Operation, {
              props: { product: row },
              on: {
                delete: this.handleSingleDelete,
                create: this.handleSingleCreate
              }
            })
          }
        }]
      },
      batchCount () {
        return this.selectIdList.length
      },
      type () {
        return TYPE.NEW
      },
      rowSelection () {
        return {
          width: 50,
          align: 'center',
          dimension: 'spu',
          className: 'product-recommend-edit-table-selection',
          selectedRowKeys: this.selectIdList
        }
      },
      selectAll () {
        return this.showGroupData.every(({ data }) => data.every(i => this.selectIdList.includes(this.getRowKey(i))))
      },
      showGroupData () {
        const { current, pageSize, total } = this.pagination
        const start = (current - 1) * pageSize
        const end = Math.min(current * pageSize, total)
        const groupData = []
        let count = 0
        for (let i = 0, l = this.groupData.length; i < l; i++) {
          if (count >= end) {
            return groupData
          }
          if (count >= start) {
            const { productList, ...rest } = this.groupData[i]
            const size = productList.length
            const newData = productList.slice(0, Math.min(total - count, size))
            // .map(product => {
            //   return this.productInfoMap[this.getRowKey(product)]
            // })
            count += productList.length
            groupData.push({ ...rest, data: newData })
          }
        }
        return groupData
      }
    },
    methods: {
      getChecked (id) {
        const data = this.groupData.find(i => i.id === id)
        return data.productList.every(i => this.selectIdList.includes(this.getRowKey(i)))
      },
      handleSingleDelete (product) {
        this.$emit('delete', [product])
      },
      handleBatchDelete () {
        const list = this.groupData.reduce((prev, { productList }) => [...prev, ...productList], [])
        const productList = list.filter((p) => {
          const key = this.getRowKey(p)
          return this.selectIdList.includes(key)
        })
        this.$emit('delete', productList)
        this.selectIdList = []
      },
      handleBatchCreate () {
        // TODO
      },
      handleSingleCreate () {
        // TODO
      },
      handleGroupChecked (selected, id) {
        const data = this.groupData.find(i => i.id === id)
        this.selectIdList = this.triggerSelectByList(selected, data.productList)
      },
      handlePageChange (page) {
        this.pagination = page
      },
      triggerSelectByList (selected, list) {
        const selectIdList = [...this.selectIdList]
        list.forEach(item => {
          const key = this.getRowKey(item)
          const index = selectIdList.indexOf(key)
          if (selected && index < 0) {
            selectIdList.push(key)
          } else if (!selected && index >= 0) {
            selectIdList.splice(index, 1)
          }
        })
        return selectIdList
      },
      getRowKey (row) {
        return row.__id__
      },
      handleModifyProduct (data) {
        this.$emit('modify-product', data)
      },
      handleModifySku (data) {
        this.$emit('modify-sku', data)
      },
      handleSelect (selectedRowKeys) {
        this.selectIdList = selectedRowKeys
      },
      handleSelectAll (selected) {
        const list = this.showGroupData.reduce((prev, { data }) => {
          return [...prev, ...data]
        }, [])
        this.selectIdList = this.triggerSelectByList(selected, list)
      }
    }
  }
</script>
<style lang="less">
  .table-head .product-recommend-edit-table-selection .table-selection-checkbox {
    display: none;
  }
  .product-recommend-edit-table {
    &-selection {
      border-right: none !important;
    }
    &-group-header {
      border-bottom: 1px solid @border-color-base;
      padding: 10px 18px;
      position: sticky;
      top: 0;
      z-index: 10;
      background: #fff;
    }
    &-batch-operation {
      display: flex;
      padding: 18px;
      justify-content: space-between;
      vertical-align: middle;
      border-top: 1px solid @border-color-base;
      .batch-delete {
        margin-right: 16px;
        &:not(.disabled) {
          text-decoration: underline;
        }
      }
    }
  }
</style>
