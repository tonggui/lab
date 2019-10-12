<template>
  <Drawer
    :value="value"
    :z-index="zIndex"
    v-bind="$attrs"
    v-on="$listeners"
    >
    <slot name="header">
      <h3 class="drawer-header" slot="header" v-if="title">{{ title }}</h3>
    </slot>
    <slot name="close">
      <div class="drawer-close" slot="close">
        收起
        <span class="round"><Icon type="navigate-next" size="20" /></span>
      </div>
    </slot>
    <div class="drawer-content" :class="{ 'with-footer': !!this.$slots.footer  }">
      <slot></slot>
    </div>
    <div class="drawer-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </Drawer>
</template>

<script>
  import { Drawer } from '@roo-design/roo-vue'
  import { triggerMouseEvent } from '@/common/domUtils'
  import { defaultPopperZIndex } from '@/bootes/config'

  export default {
    name: 'drawer',
    components: { Drawer },
    props: {
      value: Boolean,
      title: String,
      zIndex: {
        type: Number,
        default: defaultPopperZIndex
      }
    },
    watch: {
      value (v) {
        if (v) {
          // TODO 主要为了取消别的trigger弹出层的显示
          triggerMouseEvent(document.body, 'click')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
@padding: 20px;
.drawer-header {
  font-size: 20px;
  padding: @padding;
  border-bottom: 1px solid @border-color-base;
}
.drawer-close {
  padding: 5px;
  display: flex;
  align-items: center;
  font-size: @font-size-base;
  color: @primary-color;
  .round {
    @round-size: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: @round-size;
    height: @round-size;
    border: 1px solid @border-color-base;
    border-radius: 50%;
    margin-left: 10px;
  }
}
.drawer-content {
  height: 100%;
  padding: @padding;
  overflow: auto;
  &.with-footer {
    padding-bottom: @padding + @drawer-footer-height;
  }
}
.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: @drawer-footer-height;
  padding: @padding / 2;
  text-align: right;
  background: #fff;
  border-top: 1px solid @border-color-base;
  &-btn {
    margin-right: 10px;
  }
}
</style>
