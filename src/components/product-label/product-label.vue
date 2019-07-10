<template>
  <CheckboxGroup v-model="value" @on-change="handleValueChanged">
    <Checkbox
      v-for="item in items"
      :key="item.value"
      :label="item.value"
    >{{item.label}}</Checkbox>
  </CheckboxGroup>
</template>

<script>
  export default {
    name: 'product-label',
    props: {
      items: {
        type: Array,
        default: () => [{ label: '力荐', value: 1 }],
        validator: val => {
          return val.every(
            it =>
              it.label &&
              typeof it.label === 'string' &&
              it.value &&
              typeof it.value === 'number'
          )
        }
      },
      value: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      handleValueChanged (values) {
        this.$emit('input', values)
        this.$emit('on-change', values)
      }
    }
  }
</script>
