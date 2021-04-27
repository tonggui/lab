<template>
  <Tooltip transfer :max-width="210" :content="desc" :disabled="!disabled">
    <component :is="component" :type="type" @click="handleClick" :disabled="disabled">
      <slot>新建</slot>
    </component>
  </Tooltip>
</template>

<script>
  export default {
    name: 'tooltip-btn',
    props: {
      desc: {
        type: String,
        default: '无此权限，请申请权限'
      },
      havePermission: {
        type: Boolean,
        default: true
      },
      type: {
        type: String,
        default: 'primary'
      },
      component: {
        type: String,
        default: 'Button'
      }
    },
    data () {
      return {
        disabled: !this.havePermission,
        urlsObj: {}
      }
    },
    methods: {
      handleClick () {
        this.$emit('on-click')
      }
    }
  }
</script>

<style scoped>

</style>
