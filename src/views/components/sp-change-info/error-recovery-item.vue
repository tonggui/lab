<template>
  <div class="error-recovery-item" v-if="config">
    <div class="label">{{ config.label }}</div>
    <div class="content">
      <component :is="config.errorRecoveryComponent" :editing="editing" v-model="val" :weightUnit="weightUnit" />
    </div>
    <div class="controls">
      <template v-if="editing">
        <span class="op-item" @click="cancel">取消</span>
        <span class="op-item link" @click="confirm">确定</span>
      </template>
      <span v-else class="op-item link" @click="edit">纠错</span>
    </div>
  </div>
</template>

<script>
  import { isEmpty } from 'lodash'
  import configMap from './map'

  export default {
    name: 'error-recovery-item',
    props: {
      data: {
        type: Object,
        required: true
      },
      weightUnit: {
        type: String,
        default: '克(g)'
      }
    },
    data () {
      return {
        val: this.data.newValue,
        editing: false
      }
    },
    computed: {
      config () {
        return configMap[this.data.field]
      }
    },
    watch: {
      editing (v) {
        this.$emit('editChange', v)
      }
    },
    methods: {
      edit () {
        this.editing = true
      },
      confirm () {
        if (isEmpty(this.val)) {
          this.$Message.warning(`${this.config.label}不能为空`)
          return
        }
        if (this.config.validate) {
          const error = this.config.validate(this.val)
          if (error) {
            this.$Message.warning(error)
            return
          }
        }
        if (this.config.convert) {
          this.val = this.config.convert(this.val)
        }
        this.editing = false
        this.data.newValue = this.val
      },
      cancel () {
        this.editing = false
        this.val = this.data.newValue
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
    line-height: 36px;
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
