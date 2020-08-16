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
      },
      enter (el) {
        this.enterData.height = el.offsetHeight
        this.enterData.initHeight = el.style.height
        el.style.height = '0px'
        if (el.offsetHeight === 0) {
          el.style.height = `${this.enterData.height}px`
        }
      },
      afterEnter (el) {
        el.style.height = this.enterData.initHeight
      },
      beforeLeave (el) {
      },
      leave (el) {
        this.leaveData.height = el.offsetHeight
        this.leaveData.initHeight = el.style.height
        el.style.height = `${this.leaveData.height}px`
        if (el.offsetHeight > 0) {
          el.style.height = '0px'
        }
      },
      afterLeave (el) {
        el.style.height = this.leaveData.initHeight
      }
    }
  }
</script>

<style lang="less">
.auto-expand-enter {
  opacity: 0;
}
.auto-expand-enter-active {
  transition: opacity .3s ease-out, height .3s;
}
.auto-expand-leave-to {
  opacity: 0;
}
.auto-expand-leave-active {
  transition: opacity .3s ease-out, height .3s;
}
</style>
