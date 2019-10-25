<template>
  <UnitNumber :class="className" :number="showStock | isInfinite" />
</template>
<script>
  import UnitNumber from '@components/unit-number'
  import { PRODUCT_INFINITE_STOCK } from '@/data/constants/product'
  import { isArray } from 'lodash'

  export default {
    name: 'product-dispaly-stock',
    props: {
      stock: [Array, Number, String]
    },
    filters: {
      isInfinite (stock) {
        return stock === PRODUCT_INFINITE_STOCK ? '无限' : stock
      }
    },
    computed: {
      showStock () {
        if (isArray(this.stock)) {
          return this.getSumStock()
        }
        return this.stock
      },
      className () {
        if (this.showStock === 0) {
          return 'danger'
        }
        return ''
      }
    },
    components: {
      UnitNumber
    },
    methods: {
      getSumStock () {
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
      }
    }
  }
</script>
