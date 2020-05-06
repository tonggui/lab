<template>
  <div class="celluar-product-columns"><slot :columns="columns" /></div>
</template>
<script>
  import { TAB } from '../../constants'
  import ProdctInfo from './components/product-info'
  import SkuSpecName from './components/sku-spec-name'
  import EditPrice from '@/components/product-price/edit-product-price'
  import EditStock from '@/components/product-stock/edit-product-stock'
  import EditWeight from '@/components/product-weight/edit-product-weight'
  import ProductWeight from '@/components/product-weight/product-weight'
  import TagList from '@/components/taglist'
  import Operation from './components/operation'
  import WrapperValidatePoptip from '@/hoc/withValidatePoptip'
  import WrapperPromiseEmit from '@/hoc/withPromiseEmit'
  import { getEditableByFelid, FELID } from './editableUtils'

  const ValidateEidtPrice = WrapperValidatePoptip(EditPrice)
  const ValidateEditStock = WrapperValidatePoptip(EditStock)
  const ValidateEditWeight = WrapperValidatePoptip(EditWeight)
  const PromiseOperaton = WrapperPromiseEmit(Operation)

  export default {
    name: 'celluar-product-columns',
    props: {
      tagList: {
        type: Array,
        required: true
      },
      type: {
        type: String,
        required: true,
        validator: (type) => {
          return Object.values(TAB).includes(type)
        }
      },
      createCallback: {
        type: Function,
        default: success => success
      }
    },
    data () {
      return {
        needFixed: false
      }
    },
    computed: {
      isExist () {
        return this.type === TAB.EXIST
      },
      columns () {
        return [{
          title: '商品信息',
          align: 'center',
          dimension: 'spu',
          minWidth: 260,
          className: 'celluar-missing-product-spu',
          render: (h, { row }) => {
            const nameEditable = getEditableByFelid(FELID.NAME, this.type, row)
            const handleChange = (name) => this.triggerModify({ name }, row)
            return (
              <ProdctInfo
                class="celluar-missing-product-info"
                product={row}
                type={this.type}
                nameEditable={nameEditable}
                onChange={handleChange}
              />
            )
          }
        }, {
          title: '规格',
          align: 'center',
          width: 180,
          className: 'celluar-missing-product-sku celluar-missing-product-sku-spec',
          render: (h, { row }) => {
            const editable = getEditableByFelid(FELID.SPECNAME, this.type, row)
            const sku = this.getRenderSku(row)
            if (!sku) {
              return null
            }
            const handleSpecNameChange = (specName) => this.triggerModifySku({ specName }, sku, row)
            const handleSkuSellStatusChange = (editable) => this.triggerModifySku({ editable }, sku, row)
            return <SkuSpecName required={false} sku={sku} editable={editable} nowrap={this.isExist} vOn:change-name={handleSpecNameChange} vOn:change-sell-status={handleSkuSellStatusChange} />
          }
        }, {
          title: '价格',
          align: 'center',
          width: 116,
          className: 'celluar-missing-product-sku',
          render: (h, { row }) => {
            const sku = this.getRenderSku(row)
            if (!sku) {
              return null
            }
            const handleChange = (value) => this.triggerModifySku({ price: { ...sku.price, value } }, sku, row)
            return (
              <ValidateEidtPrice disabled={!sku.editable} onChange={handleChange} value={sku.price.value} />
            )
          }
        }, {
          title: '重量',
          align: 'center',
          className: 'celluar-missing-product-sku',
          width: 190,
          render: (h, { row }) => {
            const editable = getEditableByFelid(FELID.WEIGHT, this.type, row)
            const sku = this.getRenderSku(row)
            if (!sku) {
              return null
            }
            if (editable) {
              const handleChange = (weight) => this.triggerModifySku({ weight }, sku, row)
              return (
                <ValidateEditWeight text-align="center" disabled={!sku.editable} width={180} onChange={handleChange} class="celluar-missing-product-sku-weight" value={sku.weight} />
              )
            }
            return <ProductWeight value={sku.weight} />
          }
        }, {
          title: '库存',
          align: 'center',
          width: 90,
          className: 'celluar-missing-product-sku-stock',
          render: (h, { row }) => {
            const sku = this.getRenderSku(row)
            if (!sku) {
              return null
            }
            const handleChange = (stock) => this.triggerModifySku({ stock }, sku, row)
            return (
              <ValidateEditStock text-align="center" disabled={!sku.editable} onChange={handleChange} value={sku.stock} min={1} />
            )
          }
        }, {
          title: '店内分类',
          align: 'center',
          dimension: 'spu',
          className: 'celluar-missing-product-spu',
          width: 235,
          render: (h, { row }) => {
            const handleChange = (tagList) => this.triggerModify({ tagList }, row)
            return (
              <TagList class="celluar-missing-product-sku-taglist" placeholder="请选择" onChange={handleChange} value={row.tagList} source={this.tagList} transfer width={200} />
            )
          }
        }, {
          title: '操作',
          align: 'center',
          dimension: 'spu',
          className: 'celluar-missing-product-spu',
          width: 100,
          render: (h, { row }) => {
            return <PromiseOperaton product={row} vOn:put-on={this.handlePutOn} />
          }
        }]
      }
    },
    methods: {
      getRenderSku (product) {
        return product.skuList[product.__renderSkuIndex__]
      },
      triggerModify (params, product) {
        this.$emit('modify', { product, params })
      },
      triggerModifySku (params, sku, product) {
        this.$emit('modify-sku', { product, sku, params })
      },
      handlePutOn (product) {
        return new Promise((resolve, reject) => {
          this.$emit('put-on', product, this.createCallback(() => {
            this.$Message.success('上架成功！')
            resolve()
          }, reject))
        })
      }
    }
  }
</script>
<style lang="less">
  .celluar-product-columns {
    height: 100%;
  }
  .celluar-missing-product-info {
    padding: 0 8px;
  }
  .celluar-missing-product-sku {
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
    &-taglist {
      background: #fff;
      /deep/ input {
        color: @text-color;
      }
    }
  }
</style>
