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
      },
      tab: {
        type: [Number, String],
        default: 0
      }
    },
    computed: {
      columns () {
        return [{
          title: '品牌',
          minWidth: 200,
          align: 'left',
          render: (h, { row }) => {
            return (<span>{row.medicineTypeName}</span>)
          }
        }, {
          title: '城市',
          maxWidth: 180,
          minWidth: 120,
          align: 'right',
          render: (h, { row }) => {
            return (<span>{row.medicineTypeName}</span>)
          }
        }, {
          title: '购买方式要求',
          width: 150,
          align: 'center',
          render: (h, { row }) => {
            return (<span>{row.medicineTypeName}</span>)
          }
        }, {
          title: '商品匹配方式',
          width: 150,
          align: 'center',
          render: (h, { row }) => {
            return (<span>{row.medicineTypeName}</span>)
          }
        }, {
          title: '商品信息',
          width: 150,
          align: 'center',
          render: (h, { row }) => {
            return (<span>{row.medicineTypeName}</span>)
          }
        }, {
          title: '操作',
          width: 240,
          align: 'right',
          render: (h, { row, index }) => {
            return <RegisterOperation index={index} product={row} onDelete={this.handleDelete} onEdit={this.handleEdit} />
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
