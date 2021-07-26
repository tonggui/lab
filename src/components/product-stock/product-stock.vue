<template>
  <UnitNumber :class="className" :number="showStock | isInfinite" />
</template>
<script>
  import UnitNumber from '@components/unit-number'
  import { PRODUCT_INFINITE_STOCK } from '@/data/constants/product'
  import { isArray, isNumber } from 'lodash'

  export default {
    name: 'product-dispaly-stock',
    props: {
      stock: [Array, Number, String],
      // 最小起购数
      minOrderCount: {
        type: Number,
        default: 0
      },
      // 是否为单规格
      isSingleSku: Boolean
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
        // TODO: 新增 多规格 起购>1且库存<起购的sku，库存数量展示为红色
        if (this.showStock === 0 || (!this.isSingleSku && this.minOrderCount > 1 && this.showStock < this.minOrderCount)) {
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
        let stockList = [].concat(this.stock).filter(s => isNumber(s))
        if (stockList.length <= 0) {
          return
        }
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
