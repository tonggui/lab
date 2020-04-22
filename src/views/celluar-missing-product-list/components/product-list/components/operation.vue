<template>
  <Button class="celluar-missing-product-operation" type="primary" :class="{ disabled }" :disabled="disabled" @click="handlePutOn" :loading="submitting">上架</Button>
</template>
<script>
  export default {
    name: 'celluar-missing-product-operation',
    props: {
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
        submitting: false
      }
    },
    computed: {
      disabled () {
        // 商品标题，规格名称，价格，库存，重量，店内分类
        const { name, tagList, skuList } = this.product
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
        this.$emit('put-on', this.product, this.createCallback(() => {
          this.submitting = false
        }, (err) => {
          console.error(err)
          this.submitting = false
        }))
      }
    }
  }
</script>
<style lang="less">
  .celluar-missing-product-operation {
    &.disabled {
      background: #E8E8E8;
      border: 1px solid #D9D9D9;
      color: #CCCCCC;
    }
  }
</style>
