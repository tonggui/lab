<template>
  <transition
    class="animate-height"
    :name="`animate-${name}`"
    :appear="appear"
    :duration="duration"
    @before-enter="beforeEnter"
    @enter="enterActive"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leaveActive"
  >
    <div class="wrapper">
      <slot></slot>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'height-animate',
  props: {
    duration: {
      type: [Number, Object],
      default: 0
    },
    appear: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'height'
    }
  },
  data () {
    return {
      height: 0
    }
  },
  mounted () {
    // console.log(this.$slots);
  },
  methods: {
    beforeEnter (el) {
      this.$emit('before-enter', el)
    },
    enterActive (el) {
      el.style.height = el.children[0].offsetHeight + 'px'
      this.$emit('enter', el)
    },
    afterEnter (el) {
      this.$emit('after-enter', el)
    },
    beforeLeave (el) {
      this.$emit('before-leave', el)
    },
    leaveActive (el) {
      el.style.height = '0px'
      this.$emit('leave', el)
    }
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
