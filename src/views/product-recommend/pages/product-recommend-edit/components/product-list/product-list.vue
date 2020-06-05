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
    :get-row="getProduct"
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
    <template v-slot:row-bottom="{ row }">
      <div class="product-recommend-edit-table-error-tips">{{ getError(row) }}</div>
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
    splitTagGroupProductByPagination,
    getCheckboxSelectStatus,
    arrayUniquePop,
    getUniqueId,
    findProductListInTagGroupProductById
  } from '@/views/product-recommend/utils'
  import validate from './validate'

  export default {
    name: 'product-recommend-edit-table',
    components: {
      QuickEditProductTable,
      BatchOperation,
      GroupHeader
    },
    props: {
      groupList: Array,
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
        loading: false,
        errorInfo: {}
      }
    },
    watch: {
      groupList: {
        immediate: true,
        handler (groupList) {
          // 分页处理
          const total = groupList.reduce((prev, { productList }) => prev + productList.length, 0)
          const { pageSize, current } = this.pagination
          if (current > 1) {
            const start = (current - 1) * pageSize
            if (start >= total) {
              this.pagination.current = Math.ceil(total / pageSize)
            }
          }
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
            return h(Operation, {
              attrs: { product: row },
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
        const list = this.showGroupData.reduce((prev, { productList }) => [...prev, ...productList], [])
        return getCheckboxSelectStatus(list, this.selectIdList)
      },
      showGroupData () {
        return splitTagGroupProductByPagination(this.groupList, this.pagination)
      }
    },
    methods: {
      getProduct (product) {
        const id = getUniqueId(product)
        const cache = this.cacheProduct[id] || {}
        return mergeProduct(cache, product)
      },
      getError (product) {
        const id = getUniqueId(product)
        const info = this.errorInfo[id] && this.errorInfo[id].message
        return info ? `创建失败原因：${info}` : ''
      },
      triggerDelete (productList, callback) {
        // 是否删除页面中最后一个商品
        const lastDelete = this.total <= productList.length
        this.$Modal.confirm({
          width: 420,
          title: '确定删除',
          centerLayout: true,
          iconType: '',
          content: '删除后如需再创建，需重新在必建商品列表中选择，确定删除',
          onOk: () => {
            this.deleteCallback(productList)
            if (lastDelete) {
              this.$router.back()
            }
          }
        })
      },
      deleteCallback (productList) {
        this.$emit('delete', productList)
        const selectIdList = [...this.selectIdList]
        productList.forEach((product) => {
          const id = getUniqueId(product)
          arrayUniquePop(selectIdList, id)
        })
        this.selectIdList = selectIdList
      },
      handleSingleDelete (product) {
        this.triggerDelete([product])
      },
      handleBatchDelete () {
        const productList = findProductListInTagGroupProductById(this.groupList, this.selectIdList, this.getProduct)
        this.triggerDelete(productList)
      },
      handleBatchCreate () {
        this.loading = true
        let errorInfo = {}
        const productList = findProductListInTagGroupProductById(this.groupList, this.selectIdList, this.getProduct)
        // 商品信息是否完整校验
        errorInfo = validate(productList) || {}
        const errorCount = Object.keys(errorInfo).length
        if (errorCount > 0) {
          this.errorInfo = errorInfo
          this.loading = false
          if (errorCount === this.selectIdList.length) {
            this.$Message.warning('你选择的全部商品信息未填充完整，请完善后再创建。')
          } else {
            this.$Message.warning(`你选择的${errorCount}个商品信息未填充完整，请完善后再创建。`)
          }
          return
        }
        this.$emit('batch-create', productList, this.createCallback((error) => {
          errorInfo = error || {}
          const errorCount = Object.keys(errorInfo).length
          const total = this.selectIdList.length
          if (errorCount === this.selectIdList.length) {
            this.$Message.warning('选择商品全部创建失败')
          } else {
            const successCount = total - errorCount
            const successProductList = productList.filter(p => {
              const id = getUniqueId(p)
              return !errorInfo[id] || !errorInfo[id].message
            })
            if (successCount === total) {
              this.$Message.success(`已成功创建${productList.length}个商品`)
            } else {
              this.$Message.warning(`已成功创建${successCount}个商品，其余${errorCount}个创建失败`)
            }
            this.deleteCallback(successProductList)
          }
          this.errorInfo = errorInfo
          this.loading = false
        }, (err) => {
          console.error(err)
          this.loading = false
          this.$Message.error(err.message)
        }))
      },
      async handleSingleCreate (product) {
        const callback = () => {
          const id = getUniqueId(product)
          this.errorInfo[id] = {}
        }
        return new Promise((resolve) => {
          this.$emit('single-create', product, this.createCallback((error) => {
            if (error && error.code === 5102) {
              const lastDelete = this.total <= 1
              this.$Modal.info({
                title: '操作商品被删除',
                content: lastDelete ? '抱歉！你选择的商品已被平台删除，请编辑其他商品。' : '抱歉！你选择的商品已被平台删除，请选择其他商品创建。',
                centerLayout: true,
                iconType: '',
                onText: '我知道了',
                onOk: () => {
                  this.deleteCallback([product])
                  callback()
                  if (lastDelete) {
                    this.$nextTick(() => this.$router.back())
                  }
                }
              })
              resolve()
              return
            }
            if (error && error.code === 1012) {
              this.$Modal.info({
                width: 300,
                title: '店内存在UPC相同商品',
                content: '抱歉!⻔店已存在与所操作的商品相同UPC的商品，不可重复创建。',
                centerLayout: true,
                iconType: '',
                onText: '我知道了',
                onOk: () => {
                  this.deleteCallback([product])
                  callback()
                }
              })
              resolve()
              return
            }
            if (!error) {
              this.$Message.success('已成功创建1个商品')
              this.deleteCallback([product])
            } else {
              this.$Message.error(error.message)
            }
            callback()
            resolve()
          }, (err) => {
            console.error(err)
            this.$Message.error(err.message)
            resolve()
          }))
        })
      },
      handleBatchSelect (selected, productList) {
        this.selectIdList = this.triggerSelectByList(selected, productList)
      },
      handleSelectAll (selected) {
        const list = this.showGroupData.reduce((prev, { productList }) => {
          return [...prev, ...productList]
        }, [])
        this.selectIdList = this.triggerSelectByList(selected, list)
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
    &-error-tips {
      color: @error-color;
      white-space: nowrap;
    }
  }
</style>
