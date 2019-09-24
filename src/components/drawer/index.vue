<template>
  <Drawer
    :value="value"
    v-bind="$attrs"
    v-on="$listeners"
    >
    <slot name="header">
      <h3 class="drawer-header" slot="header">{{ title }}</h3>
    </slot>
    <slot name="close">
      <div class="drawer-close" slot="close">
        收起
        <span class="round"><Icon type="navigate-next" size="20" /></span>
      </div>
    </slot>
    <div class="drawer-content" :style="{ paddingBottom: this.$slots.footer ? '50px' : '5px' }">
      <slot></slot>
    </div>
    <div class="drawer-footer">
      <slot name="footer"></slot>
    </div>
  </Drawer>
</template>

<script>
  import { Drawer } from '@sfe/bootes'

  export default {
    name: 'drawer',
    components: { Drawer },
    props: {
      value: Boolean,
      title: String
    }
  }
</script>

<style lang="less" scoped>
.drawer-header {
  font-size: 20px;
}
.drawer-close {
  padding: 5px;
  display: flex;
  align-items: center;
  font-size: 14px;
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
  padding: 5px 0;
}
.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  text-align: right;
  &-btn {
    margin-right: 10px;
  }
}
</style>
