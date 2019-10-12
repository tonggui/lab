<template>
  <span :class="className">{{ showStock | isInfinite }}</span>
</template>
<script>
  import { PRODUCT_INFINITE_STOCK } from '@/data/constants/product'

  export default {
    name: 'product-dispaly-stock',
    props: {
      stock: {
        type: [Array, Number, String],
        required: true
      }
    },
    filters: {
      isInfinite (stock) {
        return stock === PRODUCT_INFINITE_STOCK ? '无限' : `${stock}`
      }
    },
    computed: {
      showStock () {
        let stockList = [].concat(this.stock)
        let stock = 0
        for (let i = 0; i < stockList.length; i++) {
          const item = stockList[i]
          if (item === PRODUCT_INFINITE_STOCK) {
            return PRODUCT_INFINITE_STOCK
          }
          stock += item
        }
        return stock
      },
      className () {
        if (this.stock === 0) {
          return 'danger'
        }
        return ''
      }
    }
  }
</script>
