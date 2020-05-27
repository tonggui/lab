<template>
  <div class="category-attr-text">
    <div class="input-container" :style="{ width }">
      <Input v-on="$listeners" v-bind="$attrs" :value="value" :disabled="disabled" :placeholder="disabled ? '' : placeholder" :style="{ width }" />
      <div class="current" v-if="maxLength"><span :class="{ danger: strlen > maxLength }">{{ strlen }}</span><span style="margin: 0 2px;">/</span>{{ maxLength }}</div>
    </div>
    <AuditFieldTip :contents="auditTips" />
  </div>
</template>

<script>
  import trim from 'lodash/trim'
  import { strlen } from '@/common/utils'
  import AuditFieldTip from '../../audit-field-tip'

  export default {
    name: 'category-attr-text',
    components: { AuditFieldTip },
    props: {
      width: {
        type: String,
        default: '100%'
      },
      value: {
        type: String,
        default: ''
      },
      auditTips: Array,
      maxLength: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String,
        default: ''
      },
      disabled: Boolean
    },
    computed: {
      strlen () {
        return strlen(trim(this.value))
      },
      extraInfoWidth () {
        return `${1024 - parseInt(this.width)}px`
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/styles/common.less';
  .category-attr-text {
    position: relative;
    display: flex;
    align-items: flex-start;
    .current {
      float: right;
      line-height: 1;
      font-size: 12px;
      color: @text-description-color;
      font-size: 12px;
      margin-top: 5px;
    }
    .danger {
      color: @error-color;
    }
  }
</style>
