<template>
  <transition name="auto-expand" @enter="enter" @before-leave="beforeLeave">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'auto-expand',
  methods: {
    enter (el) {
      el.style.height = 'auto'
      const endHeight = getComputedStyle(el).height
      el.style.height = '0px'
      // eslint-disable-next-line
      el.offsetHeight // force repaint
      el.style.height = endHeight
    },
    beforeLeave (el) {
      el.style.height = getComputedStyle(el).height
      // eslint-disable-next-line
      el.offsetHeight // force repaint
      el.style.height = '0px'
    }
  }
}
</script>

<style lang="less">
.auto-expand-enter-active, .auto-expand-leave-active {
  transition: all .4s;
}
</style>
