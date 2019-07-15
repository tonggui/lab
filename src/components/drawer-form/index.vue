<template>
  <Drawer v-bind="$attrs" @on-visible-change="handleVisibleChange" @on-close="$emit('on-close')">
    <slot></slot>
    <div class="footer">
      <Button @click="handleCancel">{{ cancelText }}</Button>
      <Button type="primary">{{ okText }}</Button>
    </div>
  </Drawer>
</template>
<script>
  export default {
    name: 'drawer-form',
    props: {
      cancelText: {
        type: String,
        default: '取消'
      },
      okText: {
        type: String,
        default: '确定'
      }
    },
    methods: {
      handleVisibleChange (visible) {
        this.$emit('on-visible-change', visible)
      },
      handleCancel () {
        this.$emit('on-cancel')
      },
      handleOk () {
        this.$emit('on-ok')
      }
    }
  }
</script>
<style lang="less" scoped>
  .footer {
    display: flex;
  }
</style>
