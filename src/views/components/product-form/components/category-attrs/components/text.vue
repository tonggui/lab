<template>
  <div class="category-attr-text">
    <div class="input-container" :style="{ width }">
      <Input v-on="$listeners" v-bind="$attrs" :value="value" :disabled="disabled" :placeholder="disabled ? '' : placeholder" :style="{ width }" />
      <div class="current" v-if="maxLength"><span :class="{ danger: strlen > maxLength }">{{ strlen }}</span><span style="margin: 0 2px;">/</span>{{ maxLength }}</div>
    </div>
    <div class="extra-info" v-if="showDiff" :style="{ width: extraInfoWidth }">
      <p class="error"><Tag color="error">需审核</Tag> 修改后需进行审核，待审核通过后才可售卖</p>
      <p class="desc">修改前：{{ originalValue }}</p>
    </div>
    <div class="correction-info" v-if="correctionValue" :style="{ width: extraInfoWidth }">
      纠错前：{{ correctionValue }}
    </div>
  </div>
</template>

<script>
  import { strlen } from '@/common/utils'

  export default {
    name: 'category-attr-text',
    props: {
      width: {
        type: String,
        default: '100%'
      },
      value: {
        type: String,
        default: ''
      },
      isNeedCorrectionAudit: Boolean,
      originalValue: {
        type: String,
        default: ''
      },
      correctionValue: {
        type: String,
        default: ''
      },
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
        return strlen(this.value.trim())
      },
      showDiff () {
        return this.isNeedCorrectionAudit && this.value !== this.originalValue
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
    .extra-info {
      .audit-need-correction-tip()
    }
    .correction-info {
      .audit-correction-info();
    }
  }
</style>
