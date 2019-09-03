
<template>
  <div>
    <slot :columns="columns" />
  </div>
</template>
<script>
  import ProductTableInfo from '@components/product-table-info'
  import ProductTableOperation from './product-table-operation'
  import ProductSkuEdit, { FELID } from './product-sku-edit'
  import {
    PRODUCT_PICTURE_EDITABLE,
    PRODUCT_TITLE_EDITABLE
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'

  export default {
    name: 'product-table-list-columns',
    mixins: [withModules({
      pictureEditable: PRODUCT_PICTURE_EDITABLE,
      nameEditable: PRODUCT_TITLE_EDITABLE
    })],
    props: {
      tagId: Number
    },
    computed: {
      columns () {
        return [{
          title: '商品信息',
          render: (h, { row }) => (
            <ProductTableInfo
              product={row}
              nameEditable={this.nameEditable}
              pictureEditable={this.pictureEditable}
              vOn:change-name={this.handleChangeName}
              vOn:change-picture={this.handleChangePicture}
            />
          ),
          align: 'left',
          minWidth: 300
        }, {
          title: '价格',
          width: 150,
          key: 'price',
          align: 'right',
          sortable: 'custom',
          render: (h, { row }) => {
            return (
              <ProductSkuEdit
                felid={FELID.PRICE}
                skuList={row.skuList}
                product={row}
                onChange={this.handleChangePrice}
              />
            )
          }
        }, {
          title: '库存',
          width: 150,
          key: 'stock',
          align: 'right',
          render: (h, { row }) => {
            return (
              <ProductSkuEdit
                felid={FELID.STOCK}
                skuList={row.skuList}
                product={row}
                onChange={this.handleChangeStock}
              />
            )
          }
        }, {
          title: '操作',
          width: 200,
          align: 'center',
          render: (h, { row }) => (
            <ProductTableOperation
              product={row}
              tagId={this.tagId}
              vOn:delete={this.handleDelete}
              vOn:change-sell-status={this.handleChangeSellStatus}
            />
          )
        }]
      }
    },
    methods: {
      triggerEditSku (sku, params) {
        this.$emit('edit-sku', sku, params)
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
      },
      handleChangePrice (sku, price) {
        this.triggerEditSku(sku, { price: { ...sku.price, value: price } })
      },
      handleChangeStock (sku, stock) {
        this.triggerEditSku(sku, { stock })
      }
    }
  }
</script>
