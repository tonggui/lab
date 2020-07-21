<template>
  <span>{{value}}</span>
</template>

<script>
  export default {
    name: 'NormalDiffItem',
    props: {
      value: [String, Number, Array, Object]
    }
  }
</script>
