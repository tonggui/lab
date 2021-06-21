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
    <AuditFieldTip :formatter="displayValueFormatter" :contents="auditTips" />
  </div>
</template>

<script>
  import WithSearch from '@/components/cascader/with-search'
  import AuditFieldTip from '../../../audit-field-tip'
  import { isEmpty } from '@/common/utils'
  import { omit } from 'lodash'

  export default {
    name: 'CategoryAttributeSearchCascader',
    components: {
      WithSearch,
      AuditFieldTip
    },
    props: {
      value: [Array, Object, String],
      auditTips: Array,
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
      displayValueFormatter (v) {
        return v => this.getDisplay(v)
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
  }
</style>
