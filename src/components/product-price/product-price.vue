<template>
  <UnitNumber unit="¥" :number="showPrice" />
</template>
<script>
  import UnitNumber from '@components/unit-number'
  import { isArray, isNumber } from 'lodash'

  export default {
    name: 'product-price',
    props: {
      price: [Array, Number, String]
    },
    computed: {
      showPrice () {
        if (isArray(this.price)) {
          return this.getRangePrice()
        }
        return this.price
      }
    },
    components: {
      UnitNumber
    },
    methods: {
      getRangePrice () {
        if (this.price.length <= 1) {
          return this.price[0]
        }
        let max = -Infinity
        let min = Infinity
        const list = this.price.filter(p => isNumber(p))
        if (list.length <= 0) {
          return
        }
        list.forEach(p => {
          min = Math.min(p, min)
          max = Math.max(p, max)
        })
        return `${min}-${max}`
      }
    }
  }
</script>
