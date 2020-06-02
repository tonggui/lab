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
    :defaultStock="defaultStock"
    :get-row="getRow"
    :loading="loading"
    @modify-product="handleModifyProduct"
    @modify-sku="handleModifySku"
    @on-select="handleSelect"
    @on-page-change="handlePageChange"
  >
    <template v-slot:groupHeader="{ group }">
      <GroupHeader
        :group="group"
        :selected-id-list="selectIdList"
        @select-all="handleBatchSelect"
      />
    </template>
    <BatchOperation
      slot="header"
      :count="selectIdList.length"
      v-bind="selectAllStatus"
      @create="handleBatchCreate"
      @delete="handleBatchDelete"
      @select-all="handleSelectAll"
    />
  </QuickEditProductTable>
</template>
<script>
  import QuickEditProductTable from '@/views/components/quick-edit-product-table'
  import { TYPE } from '@/views/components/quick-edit-product-table/constants'
  import Operation from '../operation'
  import BatchOperation from '../batch-operation'
  import GroupHeader from '../group-header'
  import Tag from '../tag'
  import { defaultPagination } from '@/data/constants/common'
  import {
    mergeProduct,
    isIncompleteProductInfo
  } from '@/views/product-recommend/utils'

  export default {
    name: 'product-recommend-edit-table',
    components: {
      QuickEditProductTable,
      BatchOperation,
      GroupHeader
    },
    props: {
      groupData: Array,
      productInfoMap: Object,
      cacheProduct: Object,
      createCallback: {
        type: Function,
        default: (success) => success
      }
    },
    data () {
      return {
        pagination: {
          ...defaultPagination
        },
        selectIdList: [],
        defaultStock: 100,
        loading: false
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
          const total = groupData.reduce((prev, { productList }) => prev + productList.length, 0)
          this.pagination.total = total
        }
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
          width: 192,
          render: (h, { row }) => {
            return h(Tag, { props: { tagList: row.tagList } })
          }
        }, {
          title: '操作',
          dimension: 'spu',
          align: 'center',
          width: 120,
          render: (h, { row }) => {
            const key = this.getRowKey(row)
            const cacheProduct = this.cacheProduct[key] || {}
            const product = mergeProduct(cacheProduct, row)
            return h(Operation, {
              attrs: { product },
              on: {
                delete: this.handleSingleDelete,
                create: this.handleSingleCreate
              }
            })
          }
        }]
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
      selectAllStatus () {
        let value = true
        let indeterminate = false
        this.showGroupData.forEach(({ list }) => {
          list.forEach(product => {
            const includes = this.selectIdList.includes(product.__id__)
            if (!includes) {
              value = false
            } else if (!indeterminate) {
              indeterminate = true
            }
          })
        })
        return { value, indeterminate }
      },
      showGroupData () {
        const { current, pageSize, total } = this.pagination
        const start = (current - 1) * pageSize
        const end = Math.min(current * pageSize, total)
        const result = []
        let count = 0
        debugger
        for (let i = 0, l = this.groupData.length; i < l; i++) {
          if (count >= end) {
            return result
          }
          const { list, ...rest } = this.groupData[i]
          const size = list.length
          if (count > 0 || count + size > start) {
            const sliceStart = Math.max(0, start - count)
            const sliceEnd = Math.min(end - count, size)
            const newList = list.slice(sliceStart, sliceEnd).map(product => {
              return this.productInfoMap[product.__id__] || product
            })
            count += list.length
            result.push({ ...rest, list: newList })
          } else {
            count += size
          }
        }
        return result
      }
    },
    methods: {
      getRow (row) {
        const cache = this.cacheProduct[row.__id__] || {}
        return mergeProduct(cache, row)
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
              this.$router.back()
            }
          }
        })
      },
      handleSingleDelete (product) {
        this.triggerDelete([product], () => {
          const selectIdList = [...this.selectIdList]
          const index = this.selectIdList.indexOf(product.__id__)
          if (index >= 0) {
            selectIdList.splice(index, 1)
            this.selectIdList = selectIdList
          }
        })
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
      // TODO
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
          // return
        }
        // this.triggerBatchCreate(completeProductList)
      },
      async handleSingleCreate (product) {
        return new Promise((resolve) => {
          this.$emit('single-create', product, this.createCallback(() => {
            this.$Message.success('已成功创建1个商品')
            const selectIdList = [...this.selectIdList]
            const index = this.selectIdList.indexOf(product.__id__)
            if (index >= 0) {
              selectIdList.splice(index, 1)
              this.selectIdList = selectIdList
            }
            resolve()
          }, (error) => {
            // 被删除
            const deleted = error.code === ''
            if (!deleted) {
              this.$Message.error(error.message)
              resolve()
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
            resolve()
          }))
        })
      },
      handleBatchSelect (selected, productList) {
        // const group = this.groupData.find(g => g.id === groupId)
        // if (!group) {
        //   return
        // }
        // const productList = group.list
        this.selectIdList = this.triggerSelectByList(selected, productList)
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
      handlePageChange (page) {
        this.pagination = page
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
        const list = this.showGroupData.reduce((prev, { list }) => {
          return [...prev, ...list]
        }, [])
        this.selectIdList = this.triggerSelectByList(selected, list)
      }
    },
    mounted () {}
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
  }
</style>
