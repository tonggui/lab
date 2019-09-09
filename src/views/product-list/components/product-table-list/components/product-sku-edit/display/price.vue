<template>
  <UnitNumber unit="¥" :number="price" />
</template>
<script>
  import UnitNumber from '@components/unit-number'

  export default {
    name: 'product-sku-dispaly-price',
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    computed: {
      price () {
        return this.product.priceStr
      }
    },
    components: {
      UnitNumber
    }
  }
</script>
