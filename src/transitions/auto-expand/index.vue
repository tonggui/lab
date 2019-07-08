<template>
  <transition
    name="auto-expand"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'auto-expand',
  height: 0,
  methods: {
    beforeEnter (el) {
      el.style.opacity = '0'
    },
    enter (el) {
      this.height = el.offsetHeight
      el.style.opacity = '0'
      el.style.height = '0px'
      this.$nextTick(() => {
        el.style.height = `${this.height}px`
        el.style.opacity = '1'
      })
    },
    afterEnter (el) {
      el.style.height = 'auto'
    },
    beforeLeave (el) {
      el.style.height = `${this.height}px`
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
.auto-expand-enter-active {
  transition: opacity .4s ease-out .1s, height .4s;
}
.auto-expand-leave-active {
  transition: opacity .4s ease-out -.1s, height .4s;
}
</style>
