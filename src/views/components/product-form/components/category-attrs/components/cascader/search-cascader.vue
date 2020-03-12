<template>
  <div class="category-attr-search-cascader">
    <WithSearch
      v-bind="$attrs"
      v-on="listeners"
      :value="val"
      :name="name"
      :width="width"
      @change="handleChange"
    >
      <template slot="empty"><slot name="empty"></slot></template>
    </WithSearch>
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
  import WithSearch from '@/components/cascader/with-search'
  import { isEmpty } from '@/common/utils'
  import { omit } from 'lodash'

  export default {
    name: 'CategoryAttributeSearchCascader',
    components: {
      WithSearch
    },
    props: {
      value: [Array, Object],
      isNeedCorrectionAudit: Boolean,
      originalValue: [Array, Object],
      correctionValue: [Array, Object],
      width: [Number, String],
      multiple: Boolean,
      separator: {
        type: String,
        default: ' / '
      }
    },
    computed: {
      val () {
        if (this.multiple) {
          return this.value
        } else {
          const { idPath = [] } = this.value || {}
          return idPath
        }
      },
      name () {
        return this.getDisplay(this.value)
      },
      showDiff () {
        return this.isNeedCorrectionAudit && this.name !== this.originalDisplayValue
      },
      originalDisplayValue () {
        return this.getDisplay(this.originalValue)
      },
      correctionDisplayValue () {
        return this.getDisplay(this.correctionValue)
      },
      listeners () {
        return omit(this.$listeners, ['change'])
      },
      extraInfoWidth () {
        return `${1024 - parseInt(this.width)}px`
      }
    },
    methods: {
      getDisplay (v) {
        if (this.multiple) {
          return (v || []).map(i => i.namePath.join(this.separator))
        } else {
          const { namePath = [] } = v || {}
          return namePath.join(this.separator)
        }
      },
      handleChange (value, name) {
        if (this.multiple) {
          this.$emit('change', value)
          return
        }
        if (isEmpty(value)) {
          this.$emit('change')
        } else {
          this.$emit('change', {
            idPath: value,
            namePath: name
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/styles/common.less';
  .category-attr-search-cascader {
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
