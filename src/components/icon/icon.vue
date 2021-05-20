<template>
  <i :class="classes" :style="styles" @click="handleClick">
    <component v-if="local" :is="svgComponents[local]"/>
    <slot v-if="showSlot" />
  </i>
</template>
<script>
  const prefixCls = 'boo-icon'

  const setupComponents = loader => loader.keys().reduce((map, key) => {
    const name = key.substring(2, key.length - 4)
    map[name] = loader(key).default
    return map
  }, {})
  const svgContextLoader = require.context('@/assets/icons', false, /\.svg$/)
  const SvgComponents = setupComponents(svgContextLoader)

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
      },
      local: String,
      disabled: Boolean
    },
    data () {
      return {
        showSlot: true
      }
    },
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          `${prefixCls}1`,
          {
            [`${prefixCls}-${this.type}`]: this.type !== '',
            [`${prefixCls}-disabled`]: this.disabled,
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
        if (this.disabled) return
        this.$emit('click', event)
      }
    },
    created () {
      this.svgComponents = SvgComponents
    },
    mounted () {
      this.showSlot = this.$slots.default !== undefined
    }
  }
</script>

<style lang="less">
  .boo-icon {
    cursor: pointer;
  }
  .boo-icon > svg {
    display: inline-block;
    width: 1em;
    height: 1em;
  }
  .boo-icon * {
    line-height: 1;
  }
</style>
<style lang="less" scoped>
  .boo-icon.boo-icon-disabled {
    color: @disabled-color !important;
    cursor: not-allowed !important;
  }
</style>
