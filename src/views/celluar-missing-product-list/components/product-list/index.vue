<template>
  <ErrorBoundary :error="error" @refresh="handleRefresh">
    <Column
      :type="type"
      :tag-list="tagList"
      @modify-sku="$listeners['modify-sku']"
      @modify="$listeners.modify"
      @put-on="handlePutOn"
    >
      <template v-slot:default="{columns}">
        <Table
          class="celluar-product-list-table"
          :loading="loading"
          :columns="columns"
          :data="data"
          :pagination="page"
          :get-row="getRow"
          border
          tableFixed
          :span-method="handleSpan"
          @on-page-change="handlePageChange"
        />
      </template>
    </Column>
  </ErrorBoundary>
</template>
<script>
  import createAddQualificationModal from '@/components/qualification-modal'
  import Table from './components/table'
  import Column from './column'
  import { TAB } from '../../constants'
  import WithPromiseEmit from '@/hoc/withPromiseEmit'

  export default {
    name: 'celluar-product-list',
    props: {
      type: {
        type: String,
        required: true,
        validator: (type) => {
          return Object.values(TAB).includes(type)
        }
      },
      productList: {
        type: Array,
        required: true
      },
      cache: {
        type: Object,
        required: true
      },
      loading: Boolean,
      error: Boolean,
      pagination: {
        type: Object,
        required: true
      },
      tagList: {
        type: Array,
        required: true
      },
      createCallback: {
        type: Function,
        default: success => success
      }
    },
    computed: {
      page () {
        return {
          ...this.pagination,
          showTotal: true
        }
      },
      data () {
        // 拆解sku成每条数据
        const list = []
        this.productList.forEach((product, i) => {
          const { skuList } = product
          const start = list.length
          skuList.forEach((sku, index) => {
            list.push({
              ...product,
              __renderSkuIndex__: index,
              __renderProductStart__: start
            })
          })
        })
        return list
      }
    },
    components: {
      Column: WithPromiseEmit(Column),
      Table
    },
    methods: {
      getRow (product) {
        const cache = this.cache[product.__id__]
        let newSkuList = product.skuList
        // skuList 合并
        if (cache && cache.skuList) {
          const { skuList } = product
          const cacheSkuMap = cache.skuList.reduce((prev, next) => {
            prev[next.__id__] = next
            return prev
          }, {})
          newSkuList = skuList.map(sku => {
            const cacheSku = cacheSkuMap[sku.__id__] || {}
            return { ...sku, ...cacheSku }
          })
        }
        return { ...product, ...cache, skuList: newSkuList }
      },
      // table的 row合并
      handleSpan ({ row, column, rowIndex }) {
        if (column.dimension === 'spu') {
          const { __renderProductStart__, skuList } = row
          if (rowIndex === __renderProductStart__) {
            return [skuList.length, 1]
          }
          return [0, 0]
        }
        return [1, 1]
      },
      handleRefresh () {
        this.$emit('refresh')
      },
      handlePageChange (pagination) {
        this.$emit('page-change', pagination)
      },
      handleDelete (product) {
        this.$emit('delete', product)
      },
      handlePutOn (product) {
        return new Promise((resolve, reject) => {
          this.$emit('put-on', product, this.createCallback(resolve, (err) => {
            // 上架异常
            console.error(err)
            switch (err.code) {
            case 5104: // 商品门店已删除
              this.$Modal.info({
                title: '该商品被商家删除',
                render: () => <p style="text-align: center">抱歉！您选择的商品已被商家删除，请编辑其他商品</p>,
                centerLayout: true,
                iconType: '',
                okText: '我知道了',
                onOk: () => this.handleDelete(product)
              })
              break
            case 5102: // 商品平台已删除
              this.$Modal.info({
                title: '该商品被平台删除',
                render: () => <p style="text-align: center">抱歉！您选择的商品已被平台删除，请编辑其他商品</p>,
                centerLayout: true,
                iconType: '',
                okText: '我知道了',
                onOk: () => this.handleDelete(product)
              })
              break
            case 9101: // 商品超范围经营
              this.$Modal.info({
                title: '超范围经营',
                content: err.message || '超出经营范围 禁止售卖',
                centerLayout: true,
                iconType: '',
                okText: '我知道了'
              })
              break
            case 9102: // 缺少经营资质
              createAddQualificationModal(err.message, {
                title: '缺少经营资质',
                centerLayout: true,
                iconType: ''
              })
              break
            case 5105: // 标题重复
              this.$Modal.info({
                title: '商品标题重复',
                render: () => <p style="text-align: center">该商品与同店内分类下已有商品标题重复，请返回修改</p>,
                centerLayout: true,
                iconType: '',
                okText: '我知道了'
              })
              break
            default:
              this.$Message.error(err.message || '上架失败')
            }
            reject(err)
          }))
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .celluar-product-list {
    &-table {
      margin: 0 20px;
      /deep/ .boo-table {
        th {
          background: #F7F8FA;
          color: #A2A4B3;
          font-weight: normal;
        }
        td {
          & {
            padding: 0
          }
          .boo-table-cell {
            padding: 16px 8px;
          }
        }
      }
      /deep/ .boo-page {
        box-shadow: 0 -4px 5px 0 #F7F8FA;
        position: relative;
      }
    }
  }
</style>
