<template>
  <ErrorBoundary :error="error" @refresh="handleRefresh">
    <QuickEditTable
      ref="table"
      :loading="loading"
      :data="productList"
      :pagination="page"
      :type="type"
      :columns="columns"
      tableFixed
      :get-row="getRow"
      :rowKey="getRowKey"
      @on-page-change="handlePageChange"
      @modify-sku="$listeners['modify-sku']"
      @modify-product="$listeners.modify"
    />
  </ErrorBoundary>
</template>
<script>
  import createAddQualificationModal from '@/components/qualification-modal'
  import QuickEditTable from '@/views/components/quick-edit-product-table'
  import TagList from '@/components/taglist'
  import WrapperPromiseEmit from '@/hoc/withPromiseEmit'
  import Operation from './components/operation'

  const PromiseOperation = WrapperPromiseEmit(Operation)

  export default {
    name: 'celluar-product-list',
    props: {
      type: {
        type: String,
        required: true
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
      columns () {
        return [{
          title: '店内分类',
          align: 'center',
          dimension: 'spu',
          className: 'celluar-missing-product-spu',
          width: 235,
          render: (h, { row }) => {
            const handleChange = (tagList) => this.$emit('modify', { params: { tagList }, product: row })
            return (
              <TagList class="celluar-missing-product-sku-taglist" placeholder="请选择" onChange={handleChange} value={row.tagList} source={this.tagList} transfer width={200} />
            )
          }
        }, {
          title: '操作',
          align: 'center',
          dimension: 'spu',
          className: 'celluar-missing-product-spu',
          width: 100,
          render: (h, { row }) => {
            return <PromiseOperation product={row} vOn:put-on={this.handlePutOn} />
          }
        }]
      }
    },
    components: {
      QuickEditTable
    },
    methods: {
      getRowKey (row) {
        return row.__id__
      },
      getRow (product, skuIndex) {
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
        return { ...product, ...cache, skuList: newSkuList, __renderSkuIndex__: skuIndex }
      },
      handleRefresh () {
        this.$emit('refresh')
      },
      handlePageChange (pagination) {
        if (this.$refs.table) {
          this.$refs.table.scrollTop()
        }
        this.$emit('page-change', pagination)
      },
      handleDelete (product) {
        this.$emit('delete', product)
      },
      handlePutOn (product) {
        return new Promise((resolve, reject) => {
          this.$emit('put-on', product, this.createCallback(() => {
            this.$Message.success('上架成功！')
            resolve()
          }, (err) => {
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
      height: 100%;
      margin: 0 20px;
      overflow: hidden;
      /deep/ .boo-table {
        th {
          background: #F7F8FA;
          color: #A2A4B3;
          font-weight: normal;
        }
        td {
          padding: 0;
        }
      }
      /deep/ .boo-page {
        box-shadow: 0 -4px 5px 0 #F7F8FA;
        position: relative;
      }
    }
  }
</style>
