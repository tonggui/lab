
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
    PRODUCT_NAME_EDITABLE
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  export default {
    name: 'product-table-list-columns',
    props: {
      tagId: Number
    },
    computed: {
      ...mapModule({
        pictureEditable: PRODUCT_PICTURE_EDITABLE,
        nameEditable: PRODUCT_NAME_EDITABLE
      }),
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
          width: 250,
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
          width: 250,
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
          fixed: 'right',
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
      triggerEditSku (product, sku, params) {
        this.$emit('edit-sku', product, sku, params)
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
      handleChangePrice (product, sku, price) {
        this.triggerEditSku(product, sku, { price: { ...sku.price, value: price } })
      },
      handleChangeStock (product, sku, stock) {
        this.triggerEditSku(product, sku, { stock })
      }
    }
  }
</script>
