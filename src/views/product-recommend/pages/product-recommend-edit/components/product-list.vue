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
        <Checkbox :value="getGroupChecked(group.id)" @on-change="handleGroupChecked($event, group.id)">{{ group.name }}</Checkbox>
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
  import Tag from './tag'
  import { defaultPagination } from '@/data/constants/common'
  import { mergeProduct, isIncompleteProductInfo } from '../../../utils'

  export default {
    name: 'product-recommend-edit-table',
    components: {
      QuickEditProductTable
    },
    props: {
      groupData: Array,
      productInfoMap: Object,
      cacheProduct: Object
    },
    data () {
      return {
        pagination: {
          ...defaultPagination
        },
        selectIdList: []
      }
    },
    watch: {
      groupData: {
        immediate: true,
        handler (groupData) {
          const { pageSize, current } = this.pagination
          if (current > 1) {
            const start = (current - 1) * pageSize
            if (start >= this.total) {
              this.pagination.current = Math.ceil(this.total / pageSize)
            }
          }
          this.pagination.total = this.total
        }
      }
    },
    computed: {
      total () {
        return this.groupData.reduce((prev, { productList }) => prev + productList.length, 0)
      },
      columns () {
        return [{
          title: '店内分类',
          dimension: 'spu',
          align: 'center',
          width: 180,
          render: (h, { row }) => {
            return h(Tag, { props: { tagList: row.tagList } })
          }
        }, {
          title: '操作',
          dimension: 'spu',
          align: 'center',
          width: 140,
          render: (h, { row }) => {
            const key = this.getRowKey(row)
            const cacheProduct = this.cacheProduct[key] || {}
            const product = mergeProduct(cacheProduct, row)
            return h(Operation, {
              props: { product },
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
            const newData = productList.slice(0, Math.min(total - count, size)).map(product => {
              const key = this.getRowKey(product)
              return this.productInfoMap[key] || product
            })
            count += productList.length
            groupData.push({ ...rest, data: newData })
          }
        }
        return groupData
      }
    },
    methods: {
      getGroupChecked (id) {
        const data = this.groupData.find(i => i.id === id) || {}
        return data.productList.every(i => this.selectIdList.includes(this.getRowKey(i)))
      },
      triggerDelete (productList, callback) {
        const lastDelete = this.total <= productList.length
        this.$Modal.confirm({
          width: 420,
          title: '确定删除',
          centerLayout: true,
          iconType: '',
          content: '删除后如需再创建，需重新在必建商品列表中选择，确定删除',
          onOk: () => {
            this.$emit('delete', productList)
            callback && callback()
            if (lastDelete) {
              this.$nextTick(() => {
                this.$router.back()
              })
            }
          }
        })
      },
      handleSingleDelete (product) {
        this.triggerDelete([product])
      },
      handleBatchDelete () {
        const list = this.groupData.reduce((prev, { productList }) => [...prev, ...productList], [])
        const productList = list.filter((p) => {
          const key = this.getRowKey(p)
          return this.selectIdList.includes(key)
        })
        this.triggerDelete(productList, () => {
          this.selectIdList = []
        })
      },
      triggerBatchCreate (productList) {
        this.$emit('create', productList, this.createCallback(() => {}, (errorList) => {
        }))
      },
      handleBatchCreate () {
        const list = this.groupData.reduce((prev, { productList }) => [...prev, ...productList], [])
        const incompleteProductList = []
        const completeProductList = []
        this.selectIdList.forEach(id => {
          const item = list.find(i => this.getRowKey(i) === id)
          const cache = this.cacheProduct[id]
          const product = mergeProduct(cache, item)
          if (isIncompleteProductInfo(product)) {
            incompleteProductList.push(product)
          } else {
            completeProductList.push(product)
          }
        })
        if (incompleteProductList.length === this.selectIdList.length) {
          this.$Modal.info({
            title: '商品信息未填充完整',
            content: '你选择的全部商品信息未填充完整，请完善后再创建。',
            onText: '我知道了'
          })
          return
        }
        if (incompleteProductList.length > 0) {
          console.log('多个商品信息不完整')
          return
        }
        this.triggerBatchCreate(completeProductList)
      },
      handleSingleCreate (product) {
        this.$emit('create', [product], this.createCallback(() => {}, (error) => {
          // 被删除
          const deleted = error.code === ''
          if (!deleted) {
            this.$Message.error(error.message)
            return
          }
          const lastDelete = this.total <= 1
          this.$Modal.info({
            title: '操作商品被删除',
            content: lastDelete ? '抱歉！你选择的商品已被平台删除，请编辑其他商品。' : '抱歉！你选择的商品已被平台删除，请选择其他商品创建。',
            onText: '我知道了',
            onOk: () => {
              if (lastDelete) {
                this.$nextTick(() => this.$router.back())
              }
            }
          })
        }))
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
