<template>
  <Select
    clearable
    :value="value"
    :filterable="searchable"
    :multiple="multiple"
    v-on="$listeners"
  >
    <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
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
