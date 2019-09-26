<template>
  <div class="picture-box" :class="{ selectable  }">
    <div class="description" v-if="description">
      {{description}}
      <span v-show="required" style="color: red">*</span>
    </div>
    <div
      class="pic-container"
      :class="{ empty: !src, 'is-error': error, 'selected': selected, [`size-${size}`]: true }"
      @click="handleAddClick"
    >
      <span v-show="tag" class="tag">{{ tag }}</span>
      <span v-show="poor" class="poor">图片质量差</span>
      <template v-if="src">
        <img :src="src" />
        <div class="extras" v-if="!viewMode">
          <Icon
            type="keyboard-arrow-left"
            :class="{ hide: !move.prev }"
            @click="onMove('prev', $event)"
          />
          <Icon type="close" @click="handleDelete" />
          <Icon
            type="keyboard-arrow-right"
            :class="{ hide: !move.next }"
            @click="onMove('next', $event)"
          />
        </div>
      </template>
      <template v-else>
        <Icon v-if="!viewMode" type="add"/>
      </template>
      <Spin fix v-if="loading">
        <Icon type="loading" :size="18"></Icon>
      </Spin>
    </div>
  </div>
</template>

<script>
  import { isPlainObject, isBoolean } from 'lodash'

  export default {
    name: 'PictureBox',
    props: {
      src: {
        type: String,
        default: ''
      },
      size: {
        type: String,
        default: () => 'normal'
      },
      description: String,
      poor: Boolean,
      required: Boolean,
      tag: {
        type: String,
        default: ''
      },
      move: {
        type: Object,
        validator: val => {
          if (val !== undefined) {
            if (isPlainObject(val)) {
              if ('prev' in val && !isBoolean(val.prev)) return false
              if ('next' in val && !isBoolean(val.next)) return false
              return true
            }
            return false
          }
          return true
        },
        default: () => {
          return { prev: false, next: false }
        }
      },
      loading: Boolean,
      error: Boolean,
      viewMode: Boolean,
      selectable: Boolean,
      selected: Boolean
    },
    methods: {
      onMove (type, e) {
        e.stopPropagation()
        this.$emit('move', type)
      },
      handleDelete (e) {
        e.stopPropagation()
        this.$emit('delete')
      },
      handleAddClick () {
        if (this.src) return
        if (!this.src && !this.viewMode) {
          this.$emit('upload')
        }
        this.$emit('click')
      }
    }
  }
</script>

<style scoped lang="less">
  .picture-box {
    margin: 5px 20px 5px 0;
    &:last-child {
      margin-right: 0;
    }
    display: inline-block;
    vertical-align: top;

    .description {
      text-align: center;
      font-size: @font-size-small;
      margin-bottom: 5px;
    }

    .pic-container {
      width: 106px;
      height: 106px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f6f6f6;
      border: 1px solid #e2e2e2;
      border-radius: 2px;
      &.size-normal {
        width: 106px;
        height: 106px;
      }
      &.size-small {
        width: 90px;
        height: 90px;
      }
      &.is-error {
        border-color: @error-color;
      }
      &.empty {
        cursor: pointer;
      }
      > img {
        display: block;
        width: 100%;
        max-height: 100%;
        overflow: hidden;
        align-self: center;
      }
      .tag {
        position: absolute;
        right: 0;
        top: 0;
        padding: 0 3px;
        font-size: 12px;
        background-color: #7a7a7a;
        color: #fff;
        line-height: 18px;
      }

      .poor {
        position: absolute;
        left: 0;
        top: 0;
        padding: 0 3px;
        font-size: 12px;
        background-color: red;
        color: #fff;
      }

      /deep/ .boo-icon-add {
        font-size: 20px;
      }

      .extras {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 24px;
        line-height: 24px;
        visibility: visible;
        backface-visibility: hidden;
        will-change: opacity;
        opacity: 0;
        transition: opacity 0.35s cubic-bezier(0.4, 0, 0.22, 1);
        background: #fff;

        .hide {
          visibility: hidden;
        }

        :global {
          .boo-icon {
            display: inline-block;
            position: relative;
            width: 33.333%;
            height: 24px;
            text-align: center;
            cursor: pointer;
            font-size: 16px;
            line-height: 24px;
          }
          .boo-icon-close {
            color: #f9403d;
          }
          .boo-icon-keyboard-arrow-left,
          .boo-icon-keyboard-arrow-right {
            color: #479829;
          }
        }
      }

      &:hover {
        border: 1px solid #f89800;

        &.is-error {
          border-color: var(--error-color);
        }

        .extras {
          opacity: 1;
        }

        :global {
          .boo-icon-add {
            color: #f89800;
          }
        }
      }
    }
    &.selectable .pic-container {
      cursor: pointer;
    }
    .pic-container:hover,
    &.selectable .pic-container.selected {
      border: 1px solid #F89800;
      &.is-error {
        border-color: @error-color;
      }
      .extras {
        opacity: 1;
      }
      /deep/ .boo-icon-add {
        color: #F89800;
      }
    }
  }
</style>
