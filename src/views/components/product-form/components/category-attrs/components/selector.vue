<template>
  <div class="category-attr-selector">
    <CustomSelector
      v-bind="$attrs"
      :value="val"
      :valueKey="valueKey"
      :labelKey="labelKey"
      :source="groupSource"
      :group="group"
      :multiple="multiple"
      :extensible="extensible"
      :placeholder="placeholder"
      :customTip="customTip"
      :maxLength="8"
      :width="width"
      @change="handleChange"
      @add="handleAddOption"
      :clearable="clearable"
      arrow
    />
    <div class="extra-info" v-if="showDiff" :style="{ width: extraInfoWidth }">
      <p class="error"><Tag color="error">需审核</Tag> 修改后需进行审核，待审核通过后才可售卖</p>
      <p class="desc">修改前：{{ originalDisplayValue }}</p>
    </div>
    <div class="correction-info" v-if="correctionDisplayValue" :style="{ width: extraInfoWidth }">
      纠错前：{{ correctionDisplayValue }}
    </div>
  </div>
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
      valueKey: String,
      labelKey: String,
      isNeedCorrectionAudit: Boolean,
      originalValue: [Array, Number, String],
      correctionValue: [Array, Number, String],
      width: [Number, String],
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
        return this.convert(this.value)
      },
      originalVal () {
        return this.convert(this.originalValue)
      },
      correctionVal () {
        return this.convert(this.correctionValue)
      },
      showCorrection () {
        return this.correctionDisplayValue && this.getDisplay(this.val) !== this.correctionDisplayValue
      },
      showDiff () {
        return this.isNeedCorrectionAudit && this.getDisplay(this.val) !== this.originalDisplayValue
      },
      originalDisplayValue () {
        return this.getDisplay(this.originalVal)
      },
      correctionDisplayValue () {
        return this.getDisplay(this.correctionVal)
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
      },
      extraInfoWidth () {
        return `${1024 - parseInt(this.width)}px`
      }
    },
    methods: {
      convert (v) {
        if (this.multiple) {
          return v || []
        }
        if (v !== undefined && v !== null) {
          return [v]
        }
        return []
      },
      getDisplay (v) {
        return v.map(v => this.groupSource.find(s => s[this.valueKey] === v)).filter(v => v !== undefined).map(v => v[this.labelKey]).join('、')
      },
      handleAddOption (item) {
        this.newCustomSource.push({ ...item, group: '自定义', isCustomized: true })
      },
      handleChange (v) {
        this.$emit('change', this.multiple ? v : v[0])
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/styles/common.less';
  .category-attr-selector {
    display: flex;
    align-items: flex-start;
    .extra-info {
      .audit-need-correction-tip()
    }
    .correction-info {
      .audit-correction-info();
    }
  }
</style>
