<template>
  <transition
    name="auto-expand"
    v-bind="$attrs"
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
    created () {
      this.enterData = {
        height: 0,
        initHeight: ''
      }
      this.leaveData = {
        height: 0,
        initHeight: ''
      }
    },
    methods: {
      beforeEnter (el) {
        if (!el.dataset) el.dataset = {}
        el.style.height = '0'
      },
      enter (el) {
        el.dataset.oldOverflow = el.style.overflow
        if (el.scrollHeight !== 0) {
          el.style.height = el.scrollHeight + 'px'
        } else {
          el.style.height = ''
        }
        el.style.overflow = 'hidden'
      },
      afterEnter (el) {
        el.style.height = ''
        el.style.overflow = el.dataset.oldOverflow
      },
      beforeLeave (el) {
        if (!el.dataset) el.dataset = {}
        el.style.height = `${el.scrollHeight}px`
        el.style.overflow = 'hidden'
      },
      leave (el) {
        if (el.scrollHeight !== 0) {
          el.style.height = 0
        }
      },
      afterLeave (el) {
        el.style.height = ''
        el.style.overflow = el.dataset.oldOverflow
      }
    }
  }
</script>

<style lang="less">
.auto-expand-enter {
  opacity: 0;
}
.auto-expand-enter-active {
  transition: opacity .2s ease-in-out, height .2s ease-in-out;
}
.auto-expand-leave-to {
  opacity: 0;
}
.auto-expand-leave-active {
  transition: opacity .2s ease-in-out, height .2s ease-in-out;
}
</style>
