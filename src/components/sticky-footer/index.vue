<template>
  <div class="sticky-wrapper" :style="{ height: `${gap + componentHeight}px` }">
    <Footer
      ref="footerRef"
      class="sticky"
      :class="footerClassSelf"
      @on-click="idx => $emit('on-click', idx)"
    />
  </div>
</template>

<script>
import Footer from './footer'
export default {
  name: 'sticky-footer-index',
  props: {
    gap: {
      type: Number,
      default: 20
    },
    footerClass: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      componentHeight: 0
    }
  },
  computed: {
    footerClassSelf () {
      return this.footerClass.split(' ')
    }
  },
  mounted () {
    this.componentHeight = this.$refs.footerRef.offsetHeight
  },
  components: {
    Footer
  }
}
</script>

<style scoped>
.sticky-wrapper {
  max-width: 1280px;
}
</style>
