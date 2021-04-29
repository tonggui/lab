<template>
  <Tooltip transfer :max-width="210" :content="desc" :disabled="havePermission">
    <component :is="component" v-bind="$attrs" :type="type" @click="handleClick" :disabled="innerDisabled">
      <slot></slot>
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
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      innerDisabled () {
        console.log('##innerDisabled ', !this.havePermission, this.disabled, !this.havePermission || this.disabled)
        return !this.havePermission || this.disabled
      }
    },
    methods: {
      handleClick () {
        !this.innerDisabled && this.$emit('on-click')
      }
    }
  }
</script>

<style scoped>

</style>
