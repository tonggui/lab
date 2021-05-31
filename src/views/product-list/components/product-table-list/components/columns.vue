
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
    POI_PROPERTY_LOCKED,
    POI_AUTO_CLEAR_STOCK
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'

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
        lockedProperty: POI_PROPERTY_LOCKED,
        showAutoClearStock: POI_AUTO_CLEAR_STOCK
      }),
      columns () {
        return [{
          title: '商品信息',
          render: (h, { row }) => {
            const audit = this.getProductAudit(row)
            const editableMap = {
              name: !audit && this.nameEditable,
              picture: !audit && this.pictureEditable
            }
            const lockedMap = {
              name: defaultTo(row.locked, this.lockedProperty),
              picture: false // 不锁定图片
            }
            return (
              <ProductTableInfo
                need-permission
                product={row}
                disabled={this.disabled}
                editableMap={editableMap}
                lockedMap={lockedMap}
                showAutoClearStock={this.showAutoClearStock}
                showPlatformLimitSaleRule
                vOn:close-auto-clear-stock={this.handleCloseAutoClearStock}
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
                disabled={this.disabled || this.getProductAudit(row)}
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
                disabled={this.disabled || this.getProductAudit(row)}
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
      getProductAudit (product) {
        return [PRODUCT_AUDIT_STATUS.AUDIT_REJECTED, PRODUCT_AUDIT_STATUS.AUDITING].includes(product.auditStatus)
      },
      triggerEditSku (product, sku, params, callback) {
        this.$emit('edit-sku', product, sku, params, callback)
      },
      triggerEditProduct (product, params, callback) {
        this.$emit('edit-product', product, params, callback)
      },
      handleRefresh () {
        this.$emit('refresh')
      },
      handleChangeSellStatus (product, sellStatus, force = false, callback) {
        this.triggerEditProduct(product, { sellStatus, force }, callback)
      },
      handleDelete (product, isCurrentTag, force = false, callback) {
        this.$emit('delete', product, isCurrentTag, force, callback)
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
      handleCloseAutoClearStock (product, stockoutAutoClearStock, callback) {
        this.triggerEditProduct(product, { stockoutAutoClearStock }, callback)
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
