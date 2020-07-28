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
    position: relative;
    &.has-number {
      &::before {
        position: absolute;
        content: attr(data-index);
        display: inline-block;
        width: 24px;
        height: 24px;
        padding: 0;
        min-width: 24px;
        border-radius: 50%;
        color: #36394D;
        background: #F4F4F5;
        text-align: center;
        line-height: 24px;
        font-size: @font-size-base;
        margin-right: 10px;
        top: 0;
        left: 0;
      }
      .order-form-item-content {
        margin-left: 34px;
      }
    }
    &::before {
      position: absolute;
      top: 4px;
      left: 0;
      padding-left: 4px;
      height: 20px;
      background: #D9D9D9;
      content: '';
    }
    &-content {
      flex: 1;
      margin-left: 14px;
      display: flex;
      overflow: hidden;
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
      color: #000;
      line-height: 28px;
      font-size: 20px;
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
