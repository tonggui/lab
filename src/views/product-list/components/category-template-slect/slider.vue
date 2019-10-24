<script>
  export default {
    name: 'category-template-slider',
    props: {
      selectedIndex: {
        type: Number,
        required: true
      }
    },
    watch: {
      selectedIndex () {
        this.getOffset()
      }
    },
    created () {
      this.$containerWidth = 0
      this.$itemWidth = 0
    },
    mounted () {
      setTimeout(() => {
        if (this.$refs.container) {
          this.setTransition(this.$refs.container, 'all linear 300ms')
        }
      })
      this.getContainerWidth()
      this.getItemWidth()
      this.getOffset()
    },
    methods: {
      selected (index) {
        return index === this.selectedIndex
      },
      setTransform (node, transform) {
        node.style.transform = transform
        node.style.webkitTransform = transform
      },
      setTransition (node, transition) {
        node.style.transform = transition
        node.style.webkitTransition = transition
      },
      getOffset () {
        const index = this.selectedIndex
        const offset = Math.round(this.$containerWidth / 2 - (index + 0.5) * this.$itemWidth)
        if (this.$refs.container) {
          this.setTransform(this.$refs.container, `translateX(${offset}px)`)
        }
      },
      getItemWidth () {
        const node = this.$refs.item
        if (!this.$itemWidth) {
          this.$itemWidth = node && node.offsetWidth
        }
      },
      getContainerWidth () {
        const node = this.$refs.container
        if (!this.$containerWidth) {
          this.$containerWidth = node && node.parentElement && node.parentElement.offsetWidth
        }
      }
    },
    render () {
      const children = this.$slots.default
      return (
        <div class="slider-list" ref="container">
          {
            children.map((node, index) => {
              let className = 'slider-item'
              if (this.selected(index)) {
                className += ' is-selected'
              }
              return <div ref="item" class={className} key={index}>{node}</div>
            })
          }
        </div>
      )
    }
  }
</script>
<style lang="less" scoped>
  .slider-list {
    min-width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    position: absolute;
    top: 0;
    bottom: 0;
    .slider-item {
      height: 100%;
      min-width: 405px;
      flex-basis: 405px;
      transform: scale(0.9);
      filter: blur(2px);
      pointer-events: none;
      transition: transform linear 300ms 100ms;
      &.is-selected {
        transform: scale(1.0);
        filter: none;
        pointer-events: auto;
      }
    }
  }
</style>
