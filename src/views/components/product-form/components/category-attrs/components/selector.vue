<template>
  <CustomSelector
    v-bind="$attrs"
    :value="val"
    :source="groupSource"
    :group="group"
    :multiple="multiple"
    :extensible="extensible"
    :placeholder="placeholder"
    :customTip="customTip"
    :maxLength="8"
    @change="handleChange"
    @add="handleAddOption"
    @open="$emit('start')"
    @close="$emit('end')"
    :clearable="clearable"
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
      multiple: Boolean,
      extensible: Boolean,
      clearable: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        newCustomSource: []
      }
    },
    computed: {
      convertedSource () {
        return this.source.map(item => ({ ...item, group: item.isCustomized ? '自定义' : '' })).sort((a, b) => a.group > b.group ? 1 : (a.group === b.group ? 0 : -1))
      },
      placeholder () {
        return this.extensible ? '请选择、搜索或自定义' : '请选择'
      },
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
        return this.convertedSource.concat(this.newCustomSource)
      },
      // 有自定义的值
      hasCustomOption () {
        return this.groupSource.some(item => item.isCustomized)
      },
      customTip () {
        // 有自定义的属性值时不展示提示
        return (this.hasCustomOption || !this.extensible) ? '' : '如果选项中没有，您可以使用自己输入的值'
      }
    },
    methods: {
      handleAddOption (item) {
        this.newCustomSource.push({ ...item, group: '自定义', isCustomized: true })
      },
      handleChange (v) {
        this.$emit('change', this.multiple ? v : v[0])
      }
    }
  }
</script>
