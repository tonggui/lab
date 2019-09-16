<template>
  <div class="error-recovery-item" v-if="config">
    <div class="label">{{ config.label }}</div>
    <div class="content">
      <component :is="config.diffComponent" :value="val" />
    </div>
    <div class="controls">
      <template v-if="editing">
        <span class="op-item">取消</span>
        <span class="op-item link">确定</span>
      </template>
      <span v-else class="op-item link">纠错</span>
    </div>
  </div>
</template>

<script>
  import configMap from './map'

  export default {
    name: 'error-recovery-item',
    props: {
      field: {
        type: String,
        required: true
      },
      value: {
        required: true
      },
      weightUnit: {
        type: String,
        default: '克(g)'
      }
    },
    data () {
      return {
        val: this.value,
        editing: false
      }
    },
    computed: {
      config () {
        return configMap[this.field]
      }
    }
  }
</script>

<style lang="less" scoped>
  .error-recovery-item {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    padding: 8px 0;
    color: @text-color-secondary;
    line-height: 32px;
    border-bottom: 1px solid @hover-bg;
    &:last-child {
      border-bottom: none;
    }
    .label {
      width: 60px;
      text-align: right;
    }
    .content {
      flex: 1;
      padding: 0 20px;
      color: @primary-color;
      line-height: 1.5;
      &.editing {
        line-height: 32px;
      }
    }
    .controls {
      text-align: right;
      .op-item {
        display: inline-block;
        cursor: pointer;
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
        &.link {
          color: @link-color;
        }
      }
    }
  }
</style>
