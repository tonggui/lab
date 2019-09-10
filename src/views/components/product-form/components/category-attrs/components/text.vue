<template>
  <div class="category-attr-text">
    <Input v-on="$listeners" v-bind="$attrs" :value="value" />
    <span class="current" v-if="maxLength">{{ value | strlen }} / {{ maxLength }}</span>
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
    filters: {
      strlen (v) {
        return strlen(v)
      }
    }
  }
</script>

<style lang="less" scoped>
  .category-attr-text {
    position: relative;
    .current {
      position: absolute;
      bottom: -8px;
      right: 12px;
      color: @text-tip-color;
      font-size: 12px;
    }
  }
</style>
