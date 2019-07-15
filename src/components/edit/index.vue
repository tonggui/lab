<template>
  <div class="sg-edit" v-clickoutside="cancel">
    <div class="editing" v-show="editMode">
      <div class="editing-slot">
        <slot name="editing" v-bind="{ value: val, change, confirm }">
          {{ value }}
        </slot>
      </div>
      <Tooltip :content="confirmTip" placement="top" :disabled="!confirmTip">
        <div class="btn yes" @click="confirm">
          <Icon type="check" size="18" />
        </div>
      </Tooltip>
      <Tooltip :content="cancelTip" placement="top" :disabled="!cancelTip">
        <div class="btn no" @click="cancel">
          <Icon type="close" size="18" />
        </div>
      </Tooltip>
    </div>
    <div class="content" :style="computedDisplayWidth">
      <slot name="display" v-bind="{ value, edit: changeEditMode }">
        <span class="display" :style="{ maxWidth: displayMaxWidth + 'px' }">{{ value }}</span>
        <Icon v-if="!disabled" class="edit-btn" type="edit" size="20" @click="changeEditMode(true)"></Icon>
      </slot>
    </div>
  </div>
</template>

<script>
  import clickoutside from '@/directives/clickoutside'

  export default {
    name: 'Edit',
    directives: { clickoutside },
    props: {
      value: [String, Boolean, Number, Array, Object],
      disabled: {
        type: Boolean,
        default: false
      },
      displayWidth: {
        type: Number
      },
      displayMaxWidth: {
        type: Number,
        default: 150
      },
      editing: {
        type: Boolean,
        default: false
      },
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
      computedDisplayWidth () {
        if (this.displayWidth) {
          return `width: ${this.displayWidth}px`
        } else {
          return ''
        }
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
        this.changeEditMode(false)
        this.val = this.value
        this.$emit('on-cancel')
      },
      change (value) {
        this.val = value
      },
      changeEditMode (editMode) {
        this.editMode = editMode
        this.$emit('on-edit', editMode)
      },
      async confirm () {
        this.$emit('on-confirm', this.val)
        if (this.onConfirm) {
          try {
            const result = await this.onConfirm(this.val)
            if (result !== false) {
              this.$emit('input', this.val)
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
  @height: 32px;
  @radius: 2px;
  .sg-edit {
    display: flex;
    position: relative;
    height: @height;
    line-height: @height;

    .editing, .content {
      display: flex;
      align-items: center;
    }

    .editing {
      position: absolute;
      box-shadow: 0 0 3px rgba(0, 0, 0, .2);
      background: #fff;
      width: calc(100% + 100px);
      left: 0;
      top: -1px;

      .btn {
        border: 1px solid @border-color-base;
        padding: 0 8px;
        cursor: pointer;

        &.yes {
          background: @primary-color;
          color: #fff;
          border-color: @primary-color;
        }

        &.no {
          border-radius: 0 @radius @radius 0;
        }
      }
    }

    .editing-slot {
      flex: 1;
      border-right: 0;
      border-radius: @radius 0 0 @radius;
      height: @height;
      line-height: @height;
      transition: all .4s;

      &:hover, &:active, &:focus-within {
        border-color: @border-color-base;
      }
    }

    .display {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 5px;
      line-height: @height;
    }

    .edit-btn {
      color: @link-color;
      cursor: pointer;
      overflow: hidden;
    }
  }
</style>
