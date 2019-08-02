<template>
  <UnitNumber unit="¥"><slot></slot></UnitNumber>
</template>
<script>
  import UnitNumber from '@components/unit-number'

  export default {
    name: 'mechant-product-price',
    components: { UnitNumber }
  }
</script>
