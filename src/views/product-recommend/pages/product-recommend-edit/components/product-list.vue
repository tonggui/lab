<template>
  <Table
    tableFixed
    group
    :columns="columns"
    :type="type"
    :data="list"
    :pagination="pagination"
    :rowKey="getRowKey"
    :rowSelection="rowSelection"
    @modify-product="handleModifyProduct"
    @modify-sku="handleModifySku"
    @on-select="handleSelect"
  >
    <div slot="header" class="product-recommend-edit-table-batch-operation">
      <div><Checkbox @on-change="handleSelectAll" :value="selectAll">全选本页</Checkbox></div>
      <div>
        <span class="batch-delete">批量删除商品</span>
        <Button type="primary">确认创建<span v-if="batchCount > 0">({{ batchCount }})</span></Button>
      </div>
    </div>
  </Table>
</template>
<script>
  import Table from '@/views/components/quick-edit-product-table'
  import { TYPE } from '@/views/components/quick-edit-product-table/constants'
  import Operation from './operation'

  export default {
    name: 'product-recommend-edit-table',
    props: {
      groupData: Array
    },
    data () {
      return {
        pagination: {
          current: 1,
          pageSize: 20,
          total: 20
        },
        count: 3,
        selectIdList: []
      }
    },
    computed: {
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
            return h(Operation, { props: { product: row } })
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
        const list = this.list.reduce((prev, next) => {
          return [...prev, ...next.data]
        }, [])
        return list.length === this.selectIdList.length
      },
      list () {
        return this.groupData.map(({ id, name, data }) => {
          return {
            renderGroup: (h) => this.renderTag(h, { id, name }),
            fixed: true,
            data
          }
        })
      }
    },
    components: {
      Table
    },
    methods: {
      getChecked (id) {
        const data = this.groupData.find(i => i.id === id)
        return data.data.every(i => this.selectIdList.includes(this.getRowKey(i)))
      },
      handleGroupChecked (selected, id) {
        const data = this.groupData.find(i => i.id === id)
        this.selectIdList = this.triggerSelectByList(selected, data.data)
      },
      renderTag (h, { id, name }) {
        const node = h('Checkbox', {
          props: {
            value: this.getChecked(id)
          },
          on: {
            'on-change': (selected) => this.handleGroupChecked(selected, id)
          }
        }, [name])
        return h('div', { class: 'product-recommend-edit-table-group-header' }, [node])
      },
      getRowKey (row) {
        return row.__id__
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
        const list = this.list.reduce((prev, next) => {
          return [...prev, ...next.data]
        }, [])
        this.selectIdList = this.triggerSelectByList(selected, list)
      }
    }
  }
</script>
<style lang="less">
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
