<template>
  <UnitNumber unit="¥" :number="price" />
</template>
<script>
  import UnitNumber from '@components/unit-number'

  export default {
    name: 'product-price',
    props: {
      priceList: {
        type: Array,
        required: true
      }
    },
    computed: {
      price () {
        if (this.priceList.length <= 1) {
          return this.priceList[0]
        }
        let max = -Infinity
        let min = Infinity
        this.priceList.forEach(price => {
          min = Math.min(price, min)
          max = Math.max(price, max)
        })
        return `${min}-${max}`
      }
    },
    components: {
      UnitNumber
    }
  }
</script>
