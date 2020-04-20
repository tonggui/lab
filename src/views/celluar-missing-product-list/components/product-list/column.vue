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
  import {
    PRODUCT_NAME_EXAMPLE
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

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
      cache: {
        type: Object,
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
      ...mapModule({
        productNameExample: PRODUCT_NAME_EXAMPLE
      }),
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
            const showNoSpMarker = this.type === TAB.NEW // 只有新商品 展示 标品/非标品标志
            const showMarker = this.type === TAB.EXIST // 只有已有商品 展示 已下架标志
            /**
             * 已存在商品：月售
             * 新商品：
             * 可编辑：参考格式xxxx
             * 不可编辑：upcCode
            */
            let description = ''
            if (nameEditable) {
              const example = this.productNameExample || ''
              description = example && `参考格式 ${example}`
            } else if (this.type === TAB.EXIST) {
              const monthSale = row.monthSale > 9999 ? '9999+' : row.monthSale
              description = `月售${monthSale || 0}`
            } else {
              description = row.upcCode || ''
            }
            const handleChange = (name) => this.triggerModify({ name }, row)
            return (
              <ProdctInfo
                class="celluar-missing-product-info"
                description={description}
                product={row}
                nameEditable={nameEditable}
                showMarker={showMarker}
                showNoSpMarker={showNoSpMarker}
                onChange={handleChange}
              />
            )
          }
        }, {
          title: '规格',
          align: 'center',
          width: 180,
          className: 'celluar-missing-product-sku',
          render: (h, { row }) => {
            const editable = getEditableByFelid(FELID.SPECNAME, this.type, row)
            const sku = this.getRenderSku(row)
            if (!sku) {
              return null
            }
            const handleSpecNameChange = (specName) => this.triggerModifySku({ specName }, sku, row)
            const handleSkuSellStatusChange = (editable) => this.triggerModifySku({ editable }, sku, row)
            return <SkuSpecName required={false} class="celluar-missing-product-sku-spec" sku={sku} editable={editable} nowrap={this.isExist} vOn:change-name={handleSpecNameChange} vOn:change-sell-status={handleSkuSellStatusChange} />
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
              <ValidateEidtPrice onChange={handleChange} value={sku.price.value} />
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
                <ValidateEditWeight width={180} onChange={handleChange} class="celluar-missing-product-sku-weight" value={sku.weight} />
              )
            }
            return <ProductWeight value={sku.weight} />
          }
        }, {
          title: '库存',
          align: 'center',
          width: 90,
          render: (h, { row }) => {
            const sku = this.getRenderSku(row)
            if (!sku) {
              return null
            }
            const handleChange = (stock) => this.triggerModifySku({ stock }, sku, row)
            return (
              <ValidateEditStock onChange={handleChange} class="celluar-missing-product-sku-stock" value={sku.stock} min={1} />
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
              <TagList onChange={handleChange} value={row.tagList} source={this.tagList} transfer width={200} />
            )
          }
        }, {
          title: '操作',
          align: 'center',
          dimension: 'spu',
          className: 'celluar-missing-product-spu',
          width: 100,
          render: (h, { row }) => {
            return <PromiseOperaton cache={this.cache[row.__id__]} product={row} vOn:put-on={this.handlePutOn} />
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
      padding-left: 8px;
    }
    &-stock {
      padding-right: 8px;
    }
    &-weight {
      font-size: 0;
      vertical-align: middle;
    }
  }
</style>
