<template>
  <div class="sticky-wrapper" :style="{ height: `${gap + componentHeight}px` }">
    <Footer
      ref="footerRef"
      class="sticky"
      v-bind="$attrs"
      :class="footerClassSelf"
      @on-click="(idx, text) => $emit('on-click', idx, text)"
    >
      <template v-if="$slots.default">
        <slot></slot>
      </template>
    </Footer>
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
      this.componentHeight = this.$refs.footerRef.getHeight()
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
