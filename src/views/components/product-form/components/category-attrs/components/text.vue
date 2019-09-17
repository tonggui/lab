<template>
  <div class="category-attr-text">
    <Input v-on="$listeners" v-bind="$attrs" :value="value" />
    <div class="current" v-if="maxLength"><span :class="{ danger: strlen > maxLength }">{{ strlen }}</span><span style="margin: 0 2px;">/</span>{{ maxLength }}</div>
  </div>
</template>

<script>
  import { strlen } from '@/common/utils'

  export default {
    name: 'category-attr-text',
    props: {
      value: {
        type: String,
        default: ''
      },
      maxLength: {
        type: Number,
        default: 0
      }
    },
    computed: {
      strlen () {
        return strlen(this.value.trim())
      }
    }
  }
</script>

<style lang="less" scoped>
  .category-attr-text {
    position: relative;
    .current {
      text-align: right;
      line-height: 1;
      font-size: 12px;
      color: @text-description-color;
      font-size: 12px;
      margin-top: 5px;
      margin-right: 12px;
    }
    .danger {
      color: @error-color;
    }
  }
</style>
