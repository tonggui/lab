<template>
  <div class="product-label">
    <CheckboxGroup v-model="val" @on-change="handleValueChanged">
      <Checkbox
        v-for="item in items"
        :key="item.value"
        :label="item.value"
      >{{item.label}}
      </Checkbox>
    </CheckboxGroup>
  </div>
</template>

<script>
  export default {
    name: 'ProductLabel',
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
    data () {
      return {
        val: this.convertValueToValueIds(this.value)
      }
    },
    watch: {
      value (value) {
        this.val = this.convertValueToValueIds(value)
      }
    },
    methods: {
      convertValueToValueIds (values = []) {
        return values.map(v => v.value)
      },
      handleValueChanged (values) {
        const value = this.items.filter(i => values.find(v => v === i.value))

        this.$emit('input', value)
        this.$emit('on-change', value)
      }
    }
  }
</script>

<style lang="less" scoped>
  .product-label {
    line-height: 1;
  }
</style>
