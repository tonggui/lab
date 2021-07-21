<template>
  <QuickEditProductTable
    tableFixed
    group
    :columns="columns"
    :hasPermission="false"
    :type="type"
    :data="showGroupData"
    :pagination="pagination"
    :rowKey="getRowKey"
    :rowSelection="rowSelection"
    :get-row="getProduct"
    :loading="loading"
    :modules="modules"
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
      <Error :product="row" :error-info="errorInfo" />
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
  import Error from './error'
  import { defaultPagination } from '@/data/constants/common'
  import {
    mergeProduct,
    splitTagGroupProductByPagination,
    getCheckboxSelectStatus,
    arrayUniquePop,
    getUniqueId,
    findProductListInTagGroupProductById,
    getLxParams,
    listParams
  } from '@/views/product-recommend/utils'
  import lx from '@/common/lx/lxReport'
  // import validate from './validate'

  export default {
    name: 'product-recommend-edit-table',
    components: {
      QuickEditProductTable,
      BatchOperation,
      GroupHeader,
      Error
    },
    props: {
      groupList: Array,
      cacheProduct: Object,
      cacheProductDefaultValue: Object,
      defaultStock: Number,
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
      modules () {
        return { stock: { min: 0, defaultValue: this.defaultStock } }
      },
      total () {
        return this.pagination.total
      },
      columns () {
        return [{
          title: '店内分类',
          dimension: 'spu',
          align: 'center',
          width: 192,
          required: true,
          render: (h, { row }) => {
            return h(Tag, { props: { tagList: row.tagList } })
          }
        }, {
          title: '操作',
          dimension: 'spu',
          align: 'center',
          width: 120,
          render: (h, { row }) => {
            const id = getUniqueId(row)
            const cache = this.cacheProduct[id] || {}
            const cacheDefault = this.cacheProductDefaultValue[id] || {}
            const product = mergeProduct(row, cacheDefault, cache)
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
        return mergeProduct(product, cache)
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
          content: '删除后如需再创建，需重新在必建商品列表中选择，确定删除？',
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
      triggerCreateCallback (isLastProduct) {
        if (!isLastProduct) {
          return
        }
        const $modal = this.$Modal.confirm({
          width: 356,
          title: '本次所选商品已全部创建',
          content: '创建更多商品会带来更多收入，建议继续创建哦～',
          centerLayout: true,
          iconType: '',
          verticalCenter: true,
          closable: true,
          okText: '继续创建',
          cancelText: '查看店内商品',
          renderFooter: () => {
            return (
              <div style="text-align: center;">
                <Button onClick={() => {
                  this.$router.push({
                    path: '/product/list',
                    query: this.$route.query
                  })
                  $modal.destroy()
                }}>查看店内商品</Button>
                <Button type="primary" onClick={() => {
                  this.$router.back()
                  $modal.destroy()
                }}>继续创建</Button>
              </div>
            )
          }
        })
      },
      handleSingleDelete (product) {
        lx.mc({
          bid: 'b_shangou_online_e_rexhhgua_mc',
          val: {
            // spu_id: product.id,
            // st_spu_id: product.spId,
            // product_label_id: (Array.isArray(product.productLabelIdList) && product.productLabelIdList.join(',')) || '',
            // first_category_id: get(product, 'category[0].id', ''),
            // second_category_id: get(product, 'category[1].id', ''),
            // category2_id: product.tagList.map(i => (Array.isArray(i.children) && i.children.length > 0 && i.children[0].id) || '').join(','),
            // category1_id: product.tagList.map(i => i.id).join(','),
            // page_source: window.page_source || '',
            // select_time: +new Date(),
            source_id: 0,
            ...getLxParams(product)
          }
        })
        this.triggerDelete([product])
      },
      handleBatchDelete () {
        const productList = findProductListInTagGroupProductById(this.groupList, this.selectIdList, this.getProduct)
        lx.mc({
          bid: 'b_shangou_online_e_rexhhgua_mc',
          val: {
            op_res: 1,
            list: listParams(productList),
            select_time: Date.now(),
            page_source: window.page_source
          }
        })
        this.triggerDelete(productList)
      },
      handleBatchCreate () {
        // this.loading = true
        // let errorInfo = {}
        // const productList = findProductListInTagGroupProductById(this.groupList, this.selectIdList, (row) => {
        //   const id = getUniqueId(row)
        //   const cache = this.cacheProduct[id] || {}
        //   const cacheDefault = this.cacheProductDefaultValue[id] || {}
        //   return mergeProduct(row, cacheDefault, cache)
        // })
        // // 商品信息是否完整校验
        // errorInfo = validate(productList) || {}
        // const errorCount = Object.keys(errorInfo).length
        // const createTotal = productList.length
        // if (errorCount > 0) {
        //   this.errorInfo = errorInfo
        //   this.loading = false
        //   if (errorCount === createTotal) {
        //     this.$Message.warning('你选择的全部商品信息未填充完整，请完善后再创建。')
        //   } else {
        //     this.$Message.warning(`你选择的${errorCount}个商品信息未填充完整，请完善后再创建。`)
        //   }
        //   return
        // }
        // this.$emit('batch-create', productList, this.createCallback((error) => {
        //   errorInfo = error || {}
        //   const errorCount = Object.keys(errorInfo).length
        //   if (errorCount === createTotal) {
        //     this.$Message.warning('选择商品全部创建失败')
        //   } else {
        //     const successCount = createTotal - errorCount
        //     const successProductList = productList.filter(p => {
        //       const id = getUniqueId(p)
        //       return !errorInfo[id]
        //     })
        //     if (successCount === createTotal) {
        //       this.$Message.success(`已成功创建${productList.length}个商品`)
        //     } else {
        //       this.$Message.warning(`已成功创建${successCount}个商品，其余${errorCount}个创建失败`)
        //     }
        //     // 是否全部创建成功
        //     this.triggerCreateCallback(this.total === successCount)
        //     this.deleteCallback(successProductList)
        //   }
        //   this.errorInfo = errorInfo
        //   this.loading = false
        // }, (err) => {
        //   console.error(err)
        //   this.loading = false
        //   this.$Message.error(err.message)
        // }))
      },
      async handleSingleCreate (product) {
        return new Promise((resolve) => {
          this.$emit('single-create', product, this.createCallback((error) => {
            const id = getUniqueId(product)
            this.errorInfo[id] = {}
            const isLastProduct = this.total <= 1
            // 成功
            if (!error || !error.code) {
              this.$Message.success('已成功创建1个商品')
              this.deleteCallback([product])
              this.triggerCreateCallback(isLastProduct)
              resolve()
              return
            }
            if (error.code === 5102) {
              this.$Modal.info({
                title: '操作商品被删除',
                content: isLastProduct ? '抱歉！你选择的商品已被平台删除，请选择其他商品创建。' : '抱歉！你选择的商品已被平台删除，请编辑其他商品。',
                centerLayout: true,
                iconType: '',
                onText: '我知道了',
                onOk: () => {
                  this.deleteCallback([product])
                  if (isLastProduct) {
                    this.$nextTick(() => this.$router.back())
                  }
                }
              })
              resolve()
              return
            }
            if (error.code === 1012) {
              this.$Modal.info({
                width: 300,
                title: '店内存在UPC相同商品',
                content: '抱歉!⻔店已存在与所操作的商品相同UPC的商品，不可重复创建。',
                centerLayout: true,
                iconType: '',
                onText: '我知道了',
                onOk: () => {
                  this.deleteCallback([product])
                }
              })
              resolve()
              return
            }
            this.$Message.error(error.message)
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
  }
</style>
