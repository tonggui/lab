<template>
  <Select
    v-bind="$attrs"
    :value="value"
    :not-found-text="emptyTip"
    @on-change="handleValueChanged"
  >
    <Option v-for="item in optionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
</template>

<script>
  import isFunction from 'lodash/isFunction'
  export default {
    name: 'CategorySelector',
    props: {
      value: [String, Number],
      source: {
        type: [Array, Function],
        default: () => []
      },
      convert: Function,
      emptyTip: String
    },
    data () {
      return {
        optionList: []
      }
    },
    watch: {
      source: {
        immediate: true,
        handler (source) {
          this.convertSourceToOptionList(source)
        }
      },
      value (v) {
        console.log('category-selector value changed', v, this.optionList)
      }
    },
    methods: {
      async convertSourceToOptionList (source) {
        if (isFunction(source)) {
          source = await source()
        }
        if (this.convert) {
          source = this.convert(source)
        }
        this.optionList = source || []
      },
      handleValueChanged (v) {
        this.$emit('input', v)
        this.$emit('change', v)
      }
    }
  }
</script>

<style scoped>

</style>
