<template>
  <Tooltip transfer :placement="placement" :max-width="210" :content="desc" :disabled="havePermission">
    <component :class="className" :is="component" v-bind="$attrs" :type="realType" v-on="listeners" :disabled="innerDisabled">
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
      btnTheme: {
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
      className: String,
      placement: {
        type: String,
        default: 'bottom'
      }
    },
    computed: {
      innerDisabled () {
        return !this.havePermission || this.disabled
      },
      realType () { // ToolTipContainer use type
        return this.component === 'Button' ? this.btnTheme : this.type
      },
      listeners () {
        return {
          ...this.$listeners,
          click: this.handleClick
        }
      }
    },
    methods: {
      handleClick (...args) {
        !this.innerDisabled && this.$emit('click', ...args)
      }
    }
  }
</script>

<style scoped>

</style>
