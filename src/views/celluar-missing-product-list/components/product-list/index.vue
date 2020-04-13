<template>
  <ErrorBoundary :error="error" @refresh="handleRefresh">
    <Column :type="type" :cache="cache" :tag-list="tagList" @modify-sku="$listeners['modify-sku']" @modify="$listeners.modify" @put-on="$listeners['put-on']">
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
  import Table from './table'
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
      getProductIndex () {
      },
      handleRefresh () {
        this.$emit('refresh')
      },
      handlePageChange (pagination) {
        this.$emit('page-change', pagination)
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
