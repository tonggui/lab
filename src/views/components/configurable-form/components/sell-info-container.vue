<script>
  import { fetchGetSpInfoByUpc } from '@/data/repos/standardProduct'
  import SellInfo from '@/views/components/product-form/components/sell-info'
  import { get } from 'lodash'

  export default {
    name: 'sell-info-container',
    props: {
      value: {
        type: Array,
        required: true
      }
    },
    methods: {
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
      return h(SellInfo, {
        props: {
          value: this.value
        },
        attrs: this.$attrs,
        on: {
          ...rest,
          'upc-sug': this.handleUpcSug
        }
      })
    }
  }
</script>
