<template>
  <div :data-index="index" class="order-form-item" :class="wrapperClassName">
    <div class="order-form-item-content" :class="contentClassName">
      <div>
        <span v-if="label" class="order-form-item-label" :class="labelClassName">{{ label }}</span>
        <small v-if="layout === 'vertical' && description">{{ description }}</small>
      </div>
      <div>
        <small v-if="layout === 'horizontal' && description">{{ description }}</small>
        <div><slot></slot></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { isNumber } from 'lodash'

  export default {
    name: 'order-form-item',
    props: {
      index: Number,
      description: String,
      label: String,
      required: Boolean,
      layout: {
        type: String,
        default: 'vertical',
        validator (v) {
          return ['vertical', 'horizontal'].includes(v)
        }
      }
    },
    computed: {
      wrapperClassName () {
        return {
          'has-number': isNumber(this.index)
        }
      },
      labelClassName () {
        return {
          'is-required': this.required
        }
      },
      contentClassName () {
        return {
          'is-vertical': this.layout === 'vertical',
          'is-horizontal': this.layout === 'horizontal'
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .order-form-item {
    display: flex;
    margin-bottom: 32px;
    align-items: baseline;
    &.has-number::before {
      content: attr(data-index);
    }
    &::before {
      display: inline-block;
      width: 24px;
      height: 24px;
      min-width: 24px;
      border-radius: 50%;
      color: #36394D;
      background: #F4F4F5;
      text-align: center;
      line-height: 24px;
      font-size: @font-size-base;
      margin-right: 10px;
      margin-top: -4px;
    }
    &-content {
      flex: 1;
      display: flex;
      &.is-vertical {
        flex-direction: column;
      }
      &.is-horizontal {
        flex-direction: row;
        .item-child {
          flex: 1;
        }
        small {
          margin-bottom: 4px;
        }
      }
    }
    &-label {
      color: @text-color-secondary;
      line-height: 19px;
      margin-bottom: 20px;
      margin-right: 10px;
      display: inline-block;
      &::after {
        content: ' ';
        color: @error-color;
        margin-left: 4px;
      }
      &.is-required::after {
        content: '*';
      }
    }
    small {
      color: @text-tip-color;
      font-size: @font-size-small;
    }
  }
</style>
