<template>
  <transition
    name="slide-up"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </transition>
</template>
<script>
  export default {
    name: 'slide-up',
    methods: {
      beforeLeave (el) {
        el.style.height = `${el.offsetHeight}px`
        el.style.opacity = '1'
      },
      leave (el) {
        el.style.height = '0px'
        el.style.opacity = '0'
      },
      afterLeave (el) {
        el.style.height = ''
        el.style.opacity = ''
      }
    }
  }
</script>
<style lang="less">
.slide-up-leave-active {
  transition: opacity .3s, height .3s;
}
</style>
