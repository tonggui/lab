<template>
  <div class="quick-edit-product-columns">
    <slot :columns="columns"></slot>
  </div>
</template>
<script>
  import { TYPE } from './constants'
  import WrapperValidatePoptip from '@/hoc/withValidatePoptip'
  import ProductInfo from './components/product-info'
  import SkuSpecName from './components/sku-spec-name'
  import { getEditableByFelid, FELID } from './editableUtils'
  import EditPrice from '@/components/product-price/edit-product-price'
  import EditStock from '@/components/product-stock/edit-product-stock'
  import EditWeight from '@/components/product-weight/edit-product-weight'
  import ProductWeight from '@/components/product-weight/product-weight'

  const ValidateEditPrice = WrapperValidatePoptip(EditPrice)
  const ValidateEditStock = WrapperValidatePoptip(EditStock)
  const ValidateEditWeight = WrapperValidatePoptip(EditWeight)

  export default {
    name: 'quick-edit-product-columns',
    props: {
      type: {
        type: String,
        required: true,
        validator: (type) => {
          return Object.values(TYPE).includes(type)
        }
      },
      defaultStock: Number
    },
    computed: {
      columns () {
        return [{
          title: '商品信息',
          align: 'center',
          dimension: 'spu',
          minWidth: 260,
          className: 'quick-edit-product-spu',
          required: true,
          render: (h, { row, skuIndex }) => {
            const editable = getEditableByFelid(FELID.NAME, this.type, row)
            const handleChange = (name) => this.triggerModify({ name }, row)
            return (
              <ProductInfo
                class="quick-edit-product-info"
                product={row}
                type={this.type}
                editable={editable}
                onChange={handleChange}
              />
            )
          }
        }, {
          title: '规格',
          align: 'center',
          width: 160,
          className: 'quick-edit-product-sku quick-edit-product-sku-spec',
          render: (h, { row, skuIndex }) => {
            const editable = getEditableByFelid(FELID.SPECNAME, this.type, row)
            const sku = this.getRenderSku(row, skuIndex)
            if (!sku) {
              return null
            }
            const handleSpecNameChange = (specName) => this.triggerModifySku({ specName }, sku, row)
            const handleSkuSellStatusChange = (editable) => this.triggerModifySku({ editable }, sku, row)
            return <SkuSpecName required={false} sku={sku} editable={editable} nowrap={this.type === TYPE.EXIST} vOn:change-name={handleSpecNameChange} vOn:change-sell-status={handleSkuSellStatusChange} />
          }
        }, {
          title: '价格',
          align: 'center',
          width: 116,
          className: 'quick-edit-product-sku',
          required: true,
          render: (h, { row, skuIndex }) => {
            const sku = this.getRenderSku(row, skuIndex)
            if (!sku) {
              return null
            }
            const handleChange = (value) => this.triggerModifySku({ price: { ...sku.price, value } }, sku, row)
            return (
              <ValidateEditPrice defaultValueTip="建议零售价格可修改" disabled={!sku.editable} onChange={handleChange} value={sku.price.value} defaultValue={sku.price.defaultValue} />
            )
          }
        }, {
          title: '重量',
          align: 'center',
          className: 'quick-edit-product-sku',
          width: 200,
          required: true,
          render: (h, { row, skuIndex }) => {
            const editable = getEditableByFelid(FELID.WEIGHT, this.type, row)
            const sku = this.getRenderSku(row, skuIndex)
            if (!sku) {
              return null
            }
            if (editable) {
              const handleChange = (weight) => this.triggerModifySku({ weight }, sku, row)
              return (
                <ValidateEditWeight text-align="center" disabled={!sku.editable} width={180} onChange={handleChange} class="quick-edit-product-sku-weight" value={sku.weight} />
              )
            }
            return <ProductWeight value={sku.weight} />
          }
        }, {
          title: '库存',
          align: 'center',
          width: 110,
          className: 'quick-edit-product-sku-stock',
          required: true,
          render: (h, { row, skuIndex }) => {
            const sku = this.getRenderSku(row, skuIndex)
            if (!sku) {
              return null
            }
            const handleChange = (stock) => this.triggerModifySku({ stock }, sku, row)
            return (
              <ValidateEditStock defaultValueTip="默认库存可修改" text-align="center" disabled={!sku.editable} onChange={handleChange} value={sku.stock} defaultValue={this.defaultStock} min={1} />
            )
          }
        }]
      }
    },
    methods: {
      getRenderSku (product, skuIndex) {
        return product.skuList[skuIndex]
      },
      triggerModify (params, product) {
        this.$emit('modify-product', { product, params })
      },
      triggerModifySku (params, sku, product) {
        this.$emit('modify-sku', { product, sku, params })
      }
    }
  }
</script>
<style lang="less">
  .quick-edit-product-columns {
    height: 100%;
  }
  .quick-edit-product-info {
    padding: 0 8px;
  }
  .quick-edit-product-sku {
    border-right: none !important;
    &-spec {
      padding-left: 16px !important;
    }
    &-spec-name {
      // display: inline-block;
      text-align: left;
    }
    &-stock {
      padding-right: 16px !important;
    }
    &-weight {
      font-size: 0;
      vertical-align: middle;
    }
  }
</style>
