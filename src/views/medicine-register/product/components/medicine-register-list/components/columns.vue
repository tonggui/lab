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
          title: '品牌',
          maxWidth: 150,
          minWidth: 100,
          align: 'left',
          render: (h, { row }) => {
            return (<span>{row.brandName}</span>)
          }
        }, {
          title: '城市',
          maxWidth: 140,
          minWidth: 120,
          align: 'right',
          render: (h, { row }) => {
            return (<span>{row.cityName}</span>)
          }
        }, {
          title: '购买方式要求',
          width: 150,
          align: 'center',
          render: (h, { row }) => {
            return (<span>{row.purchaseTypeDesc}</span>)
          }
        }, {
          title: '商品匹配方式',
          width: 150,
          align: 'center',
          render: (h, { row }) => {
            return (<span>{row.matchingRulesDesc}</span>)
          }
        }, {
          title: '商品信息',
          width: 150,
          align: 'center',
          render: (h, { row }) => {
            return (<span>{row.productInfo}</span>)
          }
        }, {
          title: '操作',
          width: 240,
          align: 'right',
          render: (h, { row, index }) => {
            return <RegisterOperation index={index} data={row} onDelete={this.handleDelete} onEdit={this.handleEdit} />
          }
        }]
      }
    },
    methods: {
      handleEdit (product, sellStatus) {
        return new Promise((resolve, reject) => {
          this.$emit('edit', product, { sellStatus }, this.createCallback(resolve, reject))
        })
      },
      handleDelete (product, { isMerchantDelete, isSelectAll, poiIdList }) {
        return new Promise((resolve, reject) => {
          this.$emit('delete', product, { isMerchantDelete, isSelectAll, poiIdList }, this.createCallback(resolve, reject))
        })
      }
    }
  }
</script>
