<template>
  <CustomSelector
    v-bind="$attrs"
    :value="val"
    :source="groupSource"
    :group="group"
    :multiple="multiple"
    @change="handleChange"
    @add="handleAddOption"
    clearable
    arrow
  >
  </CustomSelector>
</template>

<script>
  import CustomSelector from '@/components/custom-selector'

  export default {
    name: 'CategoryAttributeSelector',
    components: { CustomSelector },
    props: {
      value: {
        type: [Array, Number, String],
        default: undefined
      },
      source: {
        type: Array,
        default: () => []
      },
      group: {
        type: Array,
        default: () => []
      },
      multiple: Boolean
    },
    data () {
      return {
        newCustomSource: []
      }
    },
    computed: {
      val () {
        if (this.multiple) {
          return this.value || []
        }
        if (this.value !== undefined && this.value !== null) {
          return [this.value]
        }
        return []
      },
      groupSource () {
        return this.source.concat(this.newCustomSource)
      }
    },
    methods: {
      handleAddOption (item) {
        this.newCustomSource.push({ ...item, group: '自定义' })
      },
      handleChange (v) {
        this.$emit('change', this.multiple ? v : v[0])
      }
    }
  }
</script>
