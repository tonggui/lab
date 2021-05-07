<template>
  <Tooltip transfer :max-width="210" :content="desc" :disabled="havePermission">
    <component :class="className" :is="component" v-bind="$attrs" @click="handleClick" :disabled="innerDisabled">
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
        default: 'default'
      },
      component: {
        type: String,
        default: 'Button'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      className: String
    },
    computed: {
      innerDisabled () {
        return !this.havePermission || this.disabled
      }
    },
    methods: {
      handleClick () {
        !this.innerDisabled && this.$emit('click')
      }
    }
  }
</script>

<style scoped>

</style>
