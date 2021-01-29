<template>
  <div><slot :columns="columns"></slot></div>
</template>
<script>
  import Operation from './operation'
  import withPromiseEmit from '@/hoc/withPromiseEmit'

  const RegisterOperation = withPromiseEmit(Operation)

  export default {
    name: 'merchant-product-table-columns',
    props: {
      createCallback: {
        type: Function,
        default: (success) => success
      }
    },
    computed: {
      columns () {
        return [{
          title: '城市',
          align: 'left',
          render: (h, { row }) => {
            return (<span>{row.cityName}</span>)
          }
        }, {
          title: '购买方式要求',
          align: 'left',
          render: (h, { row }) => {
            return (<span>{row.purchaseTypeDesc}</span>)
          }
        }, {
          title: '商品限制方式',
          align: 'left',
          render: (h, { row }) => {
            return (<span>{row.matchingRulesDesc}</span>)
          }
        }, {
          title: '商品信息',
          align: 'left',
          width: 350,
          render: (h, { row }) => {
            const productInfo = row.productInfo
            return (
              <Tooltip style="margin-left: 20px" placement="top" max-width="330" transfer zIndex={1999}>
                <p class="ellipsis">{productInfo}</p>
                <div slot="content" class="register-product-info">
                  <p>{productInfo}</p>
                </div>
              </Tooltip>
            )
          }
        }, {
          title: '操作',
          width: 240,
          align: 'center',
          render: (h, { row, index }) => {
            return <RegisterOperation index={index} data={row} onDelete={this.handleDelete} />
          }
        }]
      }
    },
    methods: {
      handleDelete (data, callback) {
        this.$emit('delete', data, callback)
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .ellipsis{
    width: 100%;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
</style>
