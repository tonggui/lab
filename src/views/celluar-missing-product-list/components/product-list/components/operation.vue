<template>
  <Button type="primary" :disabled="disabled" @click="handlePutOn" :loading="submitting">上架</Button>
</template>
<script>
  export default {
    name: 'celluar-missing-product-operation',
    props: {
      cache: {
        type: Object,
        default: () => ({})
      },
      product: {
        type: Object,
        required: true
      },
      createCallback: {
        type: Function,
        default: success => success
      }
    },
    data () {
      return {
        submitting: false,
        realProduct: this.product
      }
    },
    watch: {
      cache () {
        const { cache, product } = this
        let newSkuList = product.skuList
        // skuList 合并
        if (cache && cache.skuList) {
          const { skuList } = product
          const cacheSkuMap = cache.skuList.reduce((prev, next) => {
            prev[next.__id__] = next
            return prev
          }, {})
          newSkuList = skuList.map(sku => {
            const cacheSku = cacheSkuMap[sku.__id__] || {}
            return { ...sku, ...cacheSku }
          })
        }
        this.realProduct = { ...product, ...cache, skuList: newSkuList }
      }
    },
    computed: {
      disabled () {
        // 商品标题，规格名称，价格，库存，重量，店内分类
        const { name, tagList, skuList } = this.realProduct
        // 校验标题和店内分类 是否为空
        if (!name || tagList.length <= 0) {
          return true
        }
        // 校验sku字段
        const list = skuList.filter(sku => sku.editable)
        if (list.length <= 0) {
          return true
        }
        return list.some(sku => {
          const { price, stock, weight } = sku
          // 规格名称选填，价格，库存，重量 是否为空
          return [price.value, stock, weight.value].some((v) => !v && v !== 0)
        })
      }
    },
    methods: {
      handlePutOn () {
        this.submitting = true
        this.$emit('put-on', this.realProduct, this.createCallback(() => {
          this.submitting = false
        }, (err) => {
          console.error(err)
          this.submitting = false
        }))
      }
    }
  }
</script>
