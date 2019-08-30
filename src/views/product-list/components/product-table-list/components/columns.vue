
<template>
  <div>
    <slot :columns="columns" />
  </div>
</template>
<script>
  import ProductTableInfo from '@components/product-table-info'
  import ProductTableOperation from './product-table-operation'

  export default {
    name: 'product-table-list-columns',
    props: {
      modules: {
        type: Object,
        default: () => ({
          editable: []
        })
      }
    },
    computed: {
      columns () {
        return [{
          title: '商品信息',
          // TODO editable 问题
          render: (h, { row }) => (
            <ProductTableInfo
              product={row}
              nameEditable={this.filedEditable('name')}
              pictureEditable={this.filedEditable('picture')}
              vOn:change-name={this.handleChangeName}
              vOn:change-picture={this.handleChangePicture}
            />
          ),
          align: 'left'
        }, {
          title: '价格',
          width: 150,
          key: 'price',
          align: 'right',
          sortable: 'custom',
          render: (h, { row }) => <span>{ row.priceStr }</span>
        }, {
          title: '库存',
          width: 150,
          key: 'stock',
          align: 'right'
        }, {
          title: '操作',
          width: 200,
          align: 'center',
          // TODO tagId问题
          render: (h, { row }) => (
            <ProductTableOperation
              product={row}
              vOn:delete={this.handleDelete}
              vOn:change-sell-status={this.handleChangeSellStatus}
            />
          )
        }]
      }
    },
    methods: {
      filedEditable (key) {
        return this.modules.editable.includes(key)
      },
      triggerEditProduct (product, params) {
        this.$emit('edit-product', product, params)
      },
      handleChangeSellStatus (product, sellStatus) {
        this.triggerEditProduct(product, { sellStatus })
      },
      handleDelete (product, isCurrentTag) {
        this.$emit('delete', product, isCurrentTag)
      },
      handleChangeName (product, name) {
        this.triggerEditProduct(product, { name })
      },
      handleChangePicture (product, pictureList) {
        this.triggerEditProduct(product, { pictureList })
      }
    }
  }
</script>
