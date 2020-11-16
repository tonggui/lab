import Vue from 'vue'
import { fetchGetSpInfoByUpc } from '@/data/repos/standardProduct'
import { get } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import { SKU_FIELD } from '../field'

/**
 * sell-info 售卖信息的container，主要是做upc输入之后，获取标品，回填重量
 */
export default (WrapperComponent) => Vue.extend({
  name: 'sell-info-container',
  props: {
    value: {
      type: Array,
      required: true
    },
    fieldStatus: {
      type: Object,
      default: () => ({})
    },
    attrList: Array
  },
  data () {
    return {
      selfAttrList: this.attrList
    }
  },
  watch: {
    attrList () {
      // attrList需要晚一个时刻
      this.$nextTick(() => {
        this.selfAttrList = this.attrList
      })
    }
  },
  methods: {
    handleUpcSug (sku, index) {
      // 忽略禁用时触发查询的场景
      const disabled = get(this.$props, 'disabled', get(this.$attrs, 'disabled', false))
      if (disabled) {
        return
      }
      const upcCode = sku.upcCode
      if (upcCode && get(this.fieldStatus, 'weight.visible')) {
        fetchGetSpInfoByUpc(upcCode).then(product => {
          if (!product || !product.skuList || !product.skuList[0]) {
            return
          }
          const weight = get(product, 'skuList[0].weight')
          // 只要值不一样，则重新赋值
          if (weight.value !== sku.weight.value || weight.unit !== sku.weight.unit) {
            const skuList = [...this.value]
            skuList.splice(index, 1, { ...sku, weight: { ...weight } })
            this.$emit('on-change', skuList)
          }
        }).catch(e => console.error(`查询UPC是否存在失败: ${e}`))
      }
    }
  },
  render () {
    const hasSellAttr = (this.selfAttrList || []).length > 0
    // 如果有销售属性，则过滤掉规格
    const { fieldStatus } = this
    if (hasSellAttr && fieldStatus[SKU_FIELD.SPEC_NAME]) {
      fieldStatus[SKU_FIELD.SPEC_NAME].required = false
    }
    return forwardComponent(this, WrapperComponent, {
      props: {
        value: this.value,
        attrList: this.selfAttrList,
        fieldStatus,
        addPosition: 'bottom'
      },
      on: {
        ...this.$listeners,
        'upc-sug': this.handleUpcSug
      }
    })
  }
})
