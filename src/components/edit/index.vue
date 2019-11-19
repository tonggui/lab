<template>
  <div class="sg-edit" v-clickoutside="cancel" :class="{ [`sg-edit-${size}`]: true }" :style="computedEditingWidth">
    <div class="editing" v-show="editMode" :class="{ 'has-border': border }" :style="editingStyle">
      <div class="editing-slot">
        <slot name="editing" v-bind="{ value: val, change, confirm }">
          {{ value }}
        </slot>
      </div>
      <component :is="confirmTooltip" :content="confirmTip" placement="top" class="tooltip" :disabled="!confirmTip">
      <!-- <Tooltip :content="confirmTip" placement="top" class="tooltip" :disabled="!confirmTip"> -->
        <div class="btn yes" @click="confirm(val)" :class="`btn-${size}`">
          <Icon type="check" :size="iconSize" />
        </div>
      </component>
      <!-- </Tooltip> -->
      <component :is="cancelTooltip" :content="cancelTip" placement="top" :disabled="!cancelTip" class="tooltip">
      <!-- <Tooltip :content="cancelTip" placement="top" :disabled="!cancelTip" class="tooltip"> -->
        <div class="btn no" @click="cancel" :class="`btn-${size}`">
          <Icon type="close" :size="iconSize" />
        </div>
      <!-- </Tooltip> -->
      </component>
    </div>
    <div class="content" :style="computedDisplayWidth" v-show="!editMode">
      <slot name="display" v-bind="{ value, edit: changeEditMode }">
        <span class="display" :style="{ maxWidth: computedDisplayMaxWidth }" :title="value">{{ value }}</span>
        <span @click="!disabled && changeEditMode(true)" class="edit-btn">
          <slot name="icon">
            <Icon v-if="!disabled" type="edit" size="20"></Icon>
          </slot>
        </span>
      </slot>
    </div>
  </div>
</template>

<script>
  import { isString } from 'lodash'
  import clickoutside from '@/directives/clickoutside'

  export default {
    name: 'Edit',
    directives: { clickoutside },
    props: {
      size: {
        type: String,
        validator (size) {
          return ['default', 'small', 'large'].includes(size)
        },
        default: 'default'
      },
      border: {
        type: Boolean,
        default: true
      },
      value: [String, Boolean, Number, Array, Object],
      disabled: {
        type: Boolean,
        default: false
      },
      displayWidth: {
        type: Number
      },
      displayMaxWidth: {
        type: [Number, String],
        default: 150
      },
      editingWidth: Number,
      editing: {
        type: Boolean,
        default: false
      },
      editingStyle: [String, Object],
      confirmTip: {
        type: String,
        default: ''
      },
      cancelTip: {
        type: String,
        default: ''
      },
      onConfirm: Function
    },
    data () {
      return {
        val: this.value,
        editMode: this.editing
      }
    },
    computed: {
      confirmTooltip () {
        return this.confirmTip ? 'Tooltip' : 'span'
      },
      cancelTooltip () {
        return this.cancelTip ? 'Tooltip' : 'span'
      },
      iconSize () {
        const map = {
          default: 18,
          small: 16,
          large: 20
        }
        return map[this.size] || map.default
      },
      computedEditingWidth () {
        const style = { maxWidth: '100%' }
        if (!this.editMode) {
          return style
        }
        if (this.editingWidth !== undefined) {
          style.width = `${this.editingWidth}px`
        } else {
          style.width = '100%'
        }
        return style
      },
      computedDisplayWidth () {
        if (this.displayWidth) {
          return `width: ${this.displayWidth}px`
        } else {
          return ''
        }
      },
      computedDisplayMaxWidth () {
        if (isString(this.displayMaxWidth)) {
          return this.displayMaxWidth
        }
        return `${this.displayMaxWidth}px`
      }
    },
    watch: {
      editing (editing) {
        this.editMode = editing
      },
      value (value) {
        this.val = this.value
      }
    },
    methods: {
      cancel () {
        if (this.editMode) {
          this.changeEditMode(false)
          this.val = this.value
          this.$emit('on-cancel')
        }
      },
      change (value) {
        this.val = value
        this.$emit('change', value)
      },
      changeEditMode (editMode) {
        this.editMode = editMode
        this.$emit('on-edit', editMode)
      },
      async confirm (val) {
        this.$emit('on-confirm', val)
        if (this.onConfirm) {
          try {
            const result = await this.onConfirm(val)
            if (result !== false) {
              this.$emit('input', val)
              this.changeEditMode(false)
            }
          } catch (e) {
            if (e) this.$Message.error(e.message || e)
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @height-x-small: 26px;
  @height-small: @input-height-small;
  @height-default: @input-height-base;
  @height-large: @input-height-large;
  @radius: @border-radius-base;

  .sg-edit {
    display: inline-block;
    vertical-align: middle;
    position: relative;
    box-sizing: border-box;
    height: @height-default;
    font-size: @font-size-base;
    box-sizing: border-box;
    line-height: @height-default;
    &-small {
      height: @height-small;
      font-size: @font-size-small;
      line-height: @height-small;
    }
    &-large {
      height: @height-large;
      font-size: @font-size-large;
      line-height: @height-large;
    }
    &.is-editing {
      // min-width: 100%;
    }
    .editing,
    .content {
      display: flex;
      align-items: center;
    }
    .tooltip {
      height: inherit;
      line-height: inherit;
      /deep/ .boo-tooltip-rel {
        height: 100%;
      }
    }

    .editing {
      position: absolute;
      z-index: 1;
      min-width: 120px;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      height: inherit;
      &.has-border .editing-slot {
        // box-shadow: 0 0 3px rgba(0, 0, 0, .2);
        border: 1px solid @border-color-base;
        box-sizing: border-box;
      }
      &:hover,
      &:active,
      &:focus-within {
        .btn {
          border-color: @primary-color;
          outline: initial;
        }
      }
      .btn {
        border: 1px solid @border-color-base;
        padding: 0 8px;
        cursor: pointer;
        height: 100%;
        line-height: @height-default;
        font-size: inherit;
        box-sizing: border-box;
        &-small {
          padding: 0 6px;
          line-height: @height-x-small;
        }
        &-large {
          padding: 0 10px;
          line-height: @height-large;
        }
        &.yes {
          background: @primary-color;
          color: #fff;
          border-color: @primary-color;
        }

        &.no {
          border-radius: 0 @radius @radius 0;
          background: #fff;
        }
      }
    }

    .editing-slot {
      display: flex;
      vertical-align: middle;
      border-right: 0;
      border-radius: @radius 0 0 @radius;
      transition: all .4s;
      height: inherit;
      line-height: inherit;
      flex: 1;

      &:hover, &:active, &:focus-within {
        border-color: @primary-color;
      }
    }

    .display {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 5px;
      flex: 1;
    }

    .edit-btn {
      color: @link-color;
      cursor: pointer;
      overflow: hidden;
      i {
        margin-top: -1px;
      }
    }
  }
</style>
