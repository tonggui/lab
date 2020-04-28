<template>
  <div>{{ value.value }}{{ value.unit }}</div>
</template>
<script>
  export default {
    name: 'product-weight',
    props: {
      value: Object
    }
  }
</script>
