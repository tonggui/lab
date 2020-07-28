import Vue from 'vue'
import { fetchGetSpInfoByUpc } from '@/data/repos/standardProduct'
import { get, isUndefined } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import { ATTR_TYPE } from '@/data/enums/category'

export default ({ setData, data }) => (WrapperComponent) => Vue.extend({
  name: 'sell-info-container',
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  computed: {
    attrList () {
      return (data.categoryAttrList || []).filter(attr => attr.attrType === ATTR_TYPE.SELL)
    },
    selectAttrMap () {
      const categoryAttrValueMap = data.categoryAttrValueMap || {}
      return this.attrList.reduce((prev, attr) => {
        prev[attr.id] = categoryAttrValueMap[attr.id]
        return prev
      }, {})
    }
  },
  methods: {
    handleChangeAttr (attrList, selectAttrMap) {
      console.log('handleChangeAttr:', attrList, selectAttrMap)
      if (!isUndefined(attrList)) {
        let categoryAttrList = [...data.categoryAttrList]
        categoryAttrList = categoryAttrList.map(attr => {
          const newAttr = attrList.find(a => a.id === attr.id)
          return newAttr || attr
        })
        setData({ categoryAttrList })
      }
      if (!isUndefined(selectAttrMap)) {
        const categoryAttrValueMap = data.categoryAttrValueMap
        setData({ categoryAttrValueMap: { ...categoryAttrValueMap, ...selectAttrMap } })
      }
    },
    handleUpcSug (sku, index) {
      const upcCode = sku.upcCode
      if (upcCode) {
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
        attrList: this.attrList,
        selectAttrMap: this.selectAttrMap
      },
      on: {
        ...rest,
        'on-change-attr': this.handleChangeAttr,
        'upc-sug': this.handleUpcSug
      }
    })
  }
})
