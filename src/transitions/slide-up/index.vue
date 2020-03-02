<script>
  export default {
    name: 'slide-up',
    props: {
      group: Boolean
    },
    computed: {
      component () {
        if (this.group) {
          return 'transition-group'
        }
        return 'transition'
      }
    },
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
    },
    render (h) {
      return h(this.component, {
        props: {
          name: 'slide-up',
          on: {
            'before-leave': this.beforeLeave,
            'leave': this.leave,
            'after-leave': this.afterLeave
          }
        }
      }, [this.$slots.default])
    }
  }
</script>
<style lang="less">
.slide-up-leave-active {
  transition: opacity .3s, height .3s;
}
</style>
