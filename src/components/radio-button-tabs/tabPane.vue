<script>
  export default {
    name: 'radio-button-tab-pane',
    props: {
      active: Boolean,
      label: [String, Number],
      name: [String, Number]
    },
    data () {
      return {
        hasRender: this.active || false
      }
    },
    watch: {
      active () {
        if (this.active) {
          this.hasRender = true
        }
      }
    },
    render () {
      const classNames = { 'radio-button-tab-pane': true, 'not-active': !this.active }
      return (
        <div class={classNames}>
          {
            this.hasRender ? this.$slots.default : null
          }
        </div>
      )
    }
  }
</script>
<style lang="less" scoped>
  .radio-button-tab-pane {
    width: 100%;
    flex-shrink: 0;
    opacity: 1;
    transition: opacity 0.45s;
    &.not-active {
      height: 0;
      padding: 0 !important;
      opacity: 0;
      pointer-events: none;
    }
  }
</style>
