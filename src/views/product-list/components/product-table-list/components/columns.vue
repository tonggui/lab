
<template>
  <div>
    <slot :columns="columns" />
  </div>
</template>
<script>
  import { defaultTo } from 'lodash'
  import ProductTableInfo from '@components/product-table-info'
  import ProductTableOperation from './product-table-operation'
  import ProductSkuEdit, { FELID } from './product-sku-edit'
  import {
    PRODUCT_PICTURE_EDITABLE,
    PRODUCT_NAME_EDITABLE,
    POI_PROPERTY_LOCKED
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  const MIN_WIDTH = 1100

  export default {
    name: 'product-table-list-columns',
    props: {
      tagId: Number,
      disabled: Boolean
    },
    data () {
      return {
        needFixed: false
      }
    },
    computed: {
      ...mapModule({
        pictureEditable: PRODUCT_PICTURE_EDITABLE,
        nameEditable: PRODUCT_NAME_EDITABLE,
        lockedProperty: POI_PROPERTY_LOCKED
      }),
      columns () {
        return [{
          title: '商品信息',
          render: (h, { row }) => {
            const editableMap = {
              name: this.nameEditable,
              picture: this.pictureEditable
            }
            const lockedMap = {
              name: defaultTo(row.locked, this.lockedProperty),
              picture: false // 不锁定图片
            }
            return (
              <ProductTableInfo
                product={row}
                disabled={this.disabled}
                editableMap={editableMap}
                lockedMap={lockedMap}
                nameEditable={this.nameEditable}
                pictureEditable={this.pictureEditable}
                vOn:change-name={this.handleChangeName}
                vOn:change-picture={this.handleChangePicture}
              />
            )
          },
          align: 'left',
          minWidth: 300
        }, {
          title: '价格',
          width: 200,
          key: 'price',
          align: 'center',
          sortable: 'custom',
          render: (h, { row }) => {
            return (
              <ProductSkuEdit
                disabled={this.disabled}
                felid={FELID.PRICE}
                skuList={row.skuList}
                product={row}
                onChange={this.handleChangePrice}
                vOn:done={this.handleRefresh}
              />
            )
          }
        }, {
          title: '库存',
          width: 186,
          key: 'stock',
          align: 'center',
          render: (h, { row }) => {
            return (
              <ProductSkuEdit
                disabled={this.disabled}
                felid={FELID.STOCK}
                skuList={row.skuList}
                product={row}
                onChange={this.handleChangeStock}
                vOn:done={this.handleRefresh}
              />
            )
          }
        }, {
          title: '操作',
          width: 200,
          align: 'center',
          fixed: this.needFixed ? 'right' : undefined,
          render: (h, { row }) => (
            <ProductTableOperation
              disabled={this.disabled}
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
      triggerEditSku (product, sku, params, callback) {
        this.$emit('edit-sku', product, sku, params, callback)
      },
      triggerEditProduct (product, params, callback) {
        this.$emit('edit-product', product, params, callback)
      },
      handleRefresh () {
        this.$emit('refresh')
      },
      handleChangeSellStatus (product, sellStatus, callback) {
        this.triggerEditProduct(product, { sellStatus }, callback)
      },
      handleDelete (product, isCurrentTag, callback) {
        this.$emit('delete', product, isCurrentTag, callback)
      },
      handleChangeName (product, name, callback) {
        this.triggerEditProduct(product, { name }, callback)
      },
      handleChangePicture (product, pictureList, callback) {
        this.triggerEditProduct(product, { pictureList }, callback)
      },
      handleChangePrice (product, sku, price, callback) {
        this.triggerEditSku(product, sku, { price: { ...sku.price, value: price } }, callback)
      },
      handleChangeStock (product, sku, stock, callback) {
        this.triggerEditSku(product, sku, { stock }, callback)
      },
      updateFixed () {
        this.needFixed = window.innerWidth < MIN_WIDTH
      }
    },
    mounted () {
      this.updateFixed()
      window.addEventListener('resize', this.updateFixed)
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.updateFixed)
    }
  }
</script>
