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
          align: 'left',
          render: (h, { row }) => {
            return (<span>{row.brandName}</span>)
          }
        }, {
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
          title: '商品匹配方式',
          align: 'left',
          render: (h, { row }) => {
            return (<span>{row.matchingRulesDesc}</span>)
          }
        }, {
          title: '商品信息',
          align: 'left',
          width: 300,
          render: (h, { row }) => {
            return (<span>{row.productInfo}</span>)
          }
        }, {
          title: '操作',
          width: 240,
          align: 'center',
          render: (h, { row, index }) => {
            return <RegisterOperation index={index} data={row} onDelete={this.handleDelete} onEdit={this.handleEdit} />
          }
        }]
      }
    },
    methods: {
      handleEdit (data) {
        return new Promise((resolve, reject) => {
          this.$emit('edit', data, this.createCallback(resolve, reject))
        })
      },
      handleDelete (data, callback) {
        this.$emit('delete', data, callback)
      }
    }
  }
</script>
