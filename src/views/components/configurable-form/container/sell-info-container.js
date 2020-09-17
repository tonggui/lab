import Vue from 'vue'
import { fetchGetSpInfoByUpc } from '@/data/repos/standardProduct'
import { get } from 'lodash'
import { forwardComponent } from '@/common/vnode'

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
      // TODO attrList需要晚一个时刻
      this.$nextTick(() => {
        this.selfAttrList = this.attrList
      })
    }
  },
  methods: {
    handleUpcSug (sku, index) {
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
  render (h) {
    const { 'upc-sug': upcSug, ...rest } = this.$listeners
    return forwardComponent(this, WrapperComponent, {
      props: {
        value: this.value,
        attrList: this.selfAttrList,
        fieldStatus: this.fieldStatus,
        addPosition: 'bottom'
      },
      on: {
        ...rest,
        'upc-sug': this.handleUpcSug
      }
    })
  }
})
