<template>
  <div class="quick-edit-product-columns">
    <slot :columns="columns"></slot>
  </div>
</template>
<script>
  import has from 'lodash/has'
  import { TYPE } from './constants'
  import ProductInfo from './components/product-info'
  import SkuSpecName from './components/sku-spec-name'
  import ProductPrice from './components/product-price'
  import ProductStock from './components/product-stock'
  import ProductWeight from './components/product-weight'
  import { getEditableByFelid, FELID } from './editableUtils'

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
      hasPermission: Boolean,
      modules: {
        type: Object,
        default: () => ({})
      }
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
                hasPermission={this.hasPermission}
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
            const handleChange = (params) => {
              if (has(params, 'specName')) this.triggerModify(params, row)
              if (has(params, 'editable')) this.triggerModifySku(params, sku, row)
            }
            return <SkuSpecName required={false} sku={sku} editable={editable} nowrap={this.type === TYPE.EXIST} onChange={handleChange} />
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
            const handleChange = (value, { isDefaultValue } = {}) => this.triggerModifySku({ price: { ...sku.price, value } }, sku, row, { isDefaultValue })
            return (
              <ProductPrice tip="建议与门店价格一致" defaultValueTip="建议零售价格, 可修改" disabled={!sku.editable} onChange={handleChange} value={sku.price.value} defaultValue={sku.price.defaultValue} />
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
            const handleChange = (weight) => this.triggerModifySku({ weight }, sku, row)
            return <ProductWeight tip="请确保正确填写，否则影响商品配送" editable={editable} disabled={!sku.editable} onChange={handleChange} value={sku.weight} />
          }
        }, {
          title: '库存',
          align: 'center',
          width: 116,
          className: 'quick-edit-product-sku-stock',
          required: true,
          render: (h, { row, skuIndex }) => {
            const sku = this.getRenderSku(row, skuIndex)
            if (!sku) {
              return null
            }
            const handleChange = (stock, { isDefaultValue } = {}) => this.triggerModifySku({ stock }, sku, row, { isDefaultValue })
            const { min = 1, defaultValue, errorMsg } = this.modules.stock || {}
            return (
              <ProductStock errorMsg={errorMsg} tip="建议与门店库存一致" defaultValueTip="默认库存, 可修改" disabled={!sku.editable} onChange={handleChange} value={sku.stock} defaultValue={defaultValue} min={min} />
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
      triggerModifySku (params, sku, product, { isDefaultValue } = {}) {
        this.$emit('modify-sku', { product, sku, params, isDefaultValue })
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
    &-spec-name {
      text-align: left;
    }
    &-weight {
      font-size: 0;
      vertical-align: middle;
    }
  }
</style>
