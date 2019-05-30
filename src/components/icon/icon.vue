<template>
  <i :class="classes" :style="styles" @click="handleClick">
    <slot />
  </i>
</template>
<script>
const prefixCls = 'boo-icon'

export default {
  name: 'icon',
  props: {
    type: {
      type: String,
      default: ''
    },
    size: [Number, String],
    color: String,
    custom: {
      type: String,
      default: ''
    }
  },
  computed: {
    classes () {
      return [
        `${prefixCls}`,
        `${prefixCls}1`,
        {
          [`${prefixCls}-${this.type}`]: this.type !== '',
          [`${this.custom}`]: this.custom !== ''
        }
      ]
    },
    styles () {
      let style = {}

      if (this.size) {
        style['font-size'] = `${this.size}px`
      }

      if (this.color) {
        style.color = this.color
      }

      return style
    }
  },
  methods: {
    handleClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="less">
  .boo-icon > svg {
    display: inline-block;
    width: 1em;
    height: 1em;
  }
  .boo-icon * {
    line-height: 1;
  }
</style>
