<template>
  <ErrorBoundary :error="error" @refresh="handleRefresh">
    <Column :type="type" :cache="cache" :tag-list="tagList" @modify-sku="$listeners['modify-sku']" @modify="$listeners.modify" @put-on="handlePutOn">
      <template v-slot:default="{columns}">
        <Table
          :loading="loading"
          :columns="columns"
          :data="data"
          :pagination="pagination"
          border
          @on-page-change="handlePageChange"
          tableFixed
          class="celluar-product-list-table"
          :span-method="handleSpan"
        ></Table>
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
      data () {
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
            console.error(err)
            // 商品门店已删除
            if (err.code === 5104) {
              this.$Modal.info({
                title: '该商品被商家删除',
                content: '抱歉！您选择的商品已被商家删除，请编辑其他商品',
                centerLayout: true,
                iconType: '',
                okText: '我知道了',
                onOk: () => this.handleDelete(product)
              })
              return reject(err)
            }
            // 商品平台已删除
            if (err.code === 5102) {
              this.$Modal.info({
                title: '该商品被平台删除',
                content: '抱歉！您选择的商品已被商家删除，请编辑其他商品',
                centerLayout: true,
                iconType: '',
                okText: '我知道了',
                onOk: () => this.handleDelete(product)
              })
              return reject(err)
            }
            // 商品超范围经营
            if (err.code === 9101) {
              this.$Modal.info({
                title: '超范围经营',
                content: err.message || '超出经营范围 禁止售卖',
                centerLayout: true,
                iconType: '',
                okText: '我知道了'
              })
              return reject(err)
            }
            // 缺少资质
            if (err.code === 9102) {
              createAddQualificationModal(err.message)
              return reject(err)
            }
            // 标题重复
            if (err.code === 5105) {
              this.$Modal.info({
                title: '商品标题重复',
                content: '该商品与同店内分类下已有商品标题重复，请返回修改',
                centerLayout: true,
                iconType: '',
                okText: '我知道了'
              })
              return reject(err)
            }
            this.$Message.error(err.message)
            reject(err)
          }))
        })
      },
      handleSpan ({ row, column, rowIndex }) {
        if (column.dimension === 'spu') {
          const { __renderProductStart__, skuList } = row
          if (rowIndex === __renderProductStart__) {
            return [skuList.length, 1]
          }
          return [0, 0]
        }
        return [1, 1]
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
