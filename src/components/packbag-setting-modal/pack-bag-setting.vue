<template>
  <RadioGroup
    class="container"
    @on-change="onChange"
    :value="value"
    type="button"
  >
    <Radio v-for="(item, index) in items" :key="index" :label="item.value">
      {{ item.label }}
    </Radio>
  </RadioGroup>
</template>

<script>
/**
 * event {change}
 */
  export default {
    name: 'pack-bag-setting',
    props: {
      value: {
        type: Number,
        required: true
      },
      items: {
        type: Array,
        validator (val) {
          return val.every(it => {
            return typeof it.value === 'number' && typeof it.label === 'string'
          })
        },
        required: true
      }
    },
    methods: {
      onChange (v) {
        this.$emit('change', v)
      }
    }
  }
</script>

<style scoped></style>
