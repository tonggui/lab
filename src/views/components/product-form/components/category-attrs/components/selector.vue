<template>
  <Selector
    clearable
    :filterable="searchable"
    :multiple="multiple"
  >
    <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Selector>
</template>

<script>
  export default {
    name: 'CategoryAttributeSelector',
    props: {
      value: [Array, Number, String],
      multiple: Boolean,
      searchable: Boolean,
      options: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>
