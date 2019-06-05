<template>
  <div class="picture-box">
    <div class="description">
      <slot name="description"></slot>
      <span v-show="required" style="color: red">*</span>
    </div>
    <Spin :spinning="loading">
      <div
        class="pic-container"
        :class="{ empty: !src, 'is-error': error }"
        @click="handleAddClick"
      >
        <span v-show="tag" class="tag">{{ tag }}</span>
        <span v-show="poor" class="poor">图片质量差</span>
        <template v-if="src">
          <img :src="src" />
          <div class="extras">
            <Icon
              type="left"
              :class="{ hide: !move.prev }"
              @click="move('prev')"
            />
            <Icon type="close" @click="$emit('delete')" />
            <Icon
              type="right"
              :class="{ hide: !move.next }"
              @click="onMove('next')"
            />
          </div>
        </template>
        <Icon v-else type="plus" />
      </div>
    </Spin>
  </div>
</template>

<script>
/**
 * event {click, delete, move}
 * slots {description}
 */
export default {
  name: "picture-box",
  props: {
    src: {
      type: String,
      default: ""
    },
    poor: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: ""
    },
    move: {
      type: Object,
      validator: val => {
        return (
          val && typeof val.prev === "boolean" && typeof val.next === "boolean"
        );
      },
      default: () => {
        return { prev: false, next: false };
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onMove(type) {
      this.$emit("move", type);
    },

    handleAddClick() {
      if (this.src) return;
      this.$emit("click");
    }
  }
};
</script>

<style scoped lang="less">
.picture-box {
  margin: 10px;
  display: inline-block;
  vertical-align: top;

  .description {
    text-align: center;
    font-size: var(--small-font-size);
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

    &.is-error {
      border-color: var(--error-color);
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

    :global {
      .anticon-plus {
        font-size: 20px;
      }
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
        .anticon {
          display: inline-block;
          position: relative;
          width: 33.333%;
          height: 100%;
          text-align: center;
          cursor: pointer;
        }

        .anticon-close {
          color: #f9403d;
        }

        .anticon-left,
        .anticon-right {
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
        .anticon-plus {
          color: #f89800;
        }
      }
    }
  }
}
</style>
