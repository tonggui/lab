<template>
  <span :class="className">{{ stock | isInfinite }}</span>
</template>
<script>
  import { PRODUCT_INFINITE_STOCK } from '@/data/constants/product'

  export default {
    name: 'product-dispaly-stock',
    props: {
      stockList: {
        type: Array,
        required: true
      }
    },
    filters: {
      isInfinite (stock) {
        return stock === PRODUCT_INFINITE_STOCK ? '无限' : `${stock}`
      }
    },
    computed: {
      stock () {
        let stock = 0
        for (let i = 0; i < this.stockList.length; i++) {
          const item = this.stockList[i]
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
