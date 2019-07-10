<template>
  <div class="tag-list-container" ref="container">
    <slot name="header"></slot>
    <div class="tip" v-if="$slots.tip">
      <slot name="tip"></slot>
    </div>
    <Affix>
      <div class="tag-list-affix">
        <div class="tag-list-content" ref="content">
          <slot name="content"></slot>
          <Loading :loading="loading"></Loading>
        </div>
        <div ref="footer" v-if="$slots.footer" class="tag-list-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </Affix>
    <slot></slot>
  </div>
</template>
<script>
import Loading from '@components/loading'

export default {
  name: 'product-tag-list-layout',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Loading
  },
  methods: {
    fixedHeight () {
      const $container = this.$refs.container
      const $content = this.$refs.content
      const $footer = this.$refs.footer
      if ($container && $content) {
        const { bottom } = $container.getBoundingClientRect()
        const { top, height: prevHeight } = $content.getBoundingClientRect()
        // 保证显示的内容区域全部在可见区内
        let height = Math.min(window.innerHeight, bottom) - Math.max(0, top)
        if ($footer) {
          height = height - $footer.offsetHeight
        }
        if (prevHeight !== height) {
          $content.style.height = `${height}px`
        }
      }
    },
    handleDom () {
      this.$nextTick(() => {
        this.fixedHeight()
        this.$refs.content.scrollTop = 0
      })
    }
  },
  mounted () {
    window.addEventListener('scroll', this.fixedHeight)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.fixedHeight)
  }
}
</script>
<style lang="less" scoped>
.tag-list {
  &-container {
    background: @component-bg;
    display: flex;
    position: relative;
    flex-direction: column;
    height: 100%;
  }
  .tip {
    color: @text-color-secondary;
    font-size: @font-size-small;
    background: rgba(248,181,0,0.10);
    line-height: 36px;
    padding-left: 20px;
  }
  &-affix {
    border-right: 1px solid @border-color-base;
    margin-right: -1px;
    position: relative;
  }
  &-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100vh;
  }
  &-footer {
    background: @component-bg;
    padding: 10px 20px;
    border-top: 1px solid @border-color-base;
    border-bottom: 1px solid @border-color-base;
    text-align: center;
  }
}
</style>
