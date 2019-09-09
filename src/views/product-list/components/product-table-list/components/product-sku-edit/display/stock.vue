<template>
  <span :class="className">{{ stock | isInfinite }}</span>
</template>
<script>
  import { PRODUCT_INFINITE_STOCK } from '@/data/constants/product'

  export default {
    name: 'product-sku-dispaly-stock',
    props: {
      product: {
        type: Object,
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
        return this.product.stock
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
