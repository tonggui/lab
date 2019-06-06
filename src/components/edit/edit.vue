<template>
  <div class="sg-edit" v-clickoutside="cancel">
    <div class="editing" v-show="editing">
      <div class="editing-slot">
        <slot name="editing"></slot>
      </div>
      <Tooltip :content="confirmTip" placement="top" :disabled="!confirmTip">
        <div class="btn yes" @click="$emit('confirm')">
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
      <span class="display" :style="{ maxWidth: displayMaxWidth + 'px' }">{{ display }}</span>
      <Icon class="edit-btn" type="edit" size="20" @click="$emit('edit')"></Icon>
    </div>
  </div>
</template>

<script>
import clickoutside from '@/directives/clickoutside'

export default {
  name: 'sg-edit',
  directives: { clickoutside },
  props: {
    display: {
      type: String,
      default: ''
    },
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
  methods: {
    cancel () {
      this.$emit('cancel')
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
      width: calc(100% + 80px);
      left: 0;
      top: -1px;
      .btn {
        border: 1px solid @color-gray3;
        padding: 0 8px;
        cursor: pointer;
        &.yes {
          background: @color-primary;
          color: #fff;
          border-color: @color-primary;
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
      &:hover,&:active,&:focus-within {
        border-color: @color-gray4;
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
      color: @color-link;
      cursor: pointer;
      overflow: hidden;
    }
  }
</style>
