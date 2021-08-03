<!-- 店内分类布局组件 主要是fixed吸顶 -->
<template>
  <div class="tag-list-layout" ref="container">
    <slot name="header"></slot>
    <div class="tag-list-layout-tip" v-if="$slots.tip">
      <slot name="tip"></slot>
    </div>
    <Affix>
      <div class="tag-list-layout-affix" ref="affix">
        <div class="tag-list-layout-content" ref="content">
          <slot name="content"></slot>
        </div>
        <div ref="footer" v-if="$slots.footer" class="tag-list-layout-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </Affix>
    <slot></slot>
    <Loading v-if="loading"></Loading>
  </div>
</template>
<script>
  import Loading from '@components/loading'
  import MutationObserver from 'mutation-observer'
  import { debounce } from 'lodash'

  export default {
    name: 'tag-list-layout',
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
            const footerBottom = Math.max(window.innerHeight - bottom, 0)
            $footer.style.bottom = `${footerBottom}px`
            height = height - $footer.offsetHeight
            this.$refs.affix.style.paddingBottom = `${$footer.offsetHeight}px`
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
    created () {
      this.observer = new MutationObserver(debounce(this.fixedHeight, 200))
    },
    mounted () {
      this.fixedHeight()
      window.addEventListener('scroll', this.fixedHeight)
      this.observer.observe(document.body, {
        attributes: false,
        childList: true,
        subtree: true
      })
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.fixedHeight)
      this.observer.disconnect()
    }
  }
</script>
<style lang="less">
.tag-list-layout {
  background: @component-bg;
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100%;
  &-affix {
    position: relative;
  }
  &-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 100vh;
  }
  &-footer {
    background: @component-bg;
    border-top: 1px solid @border-color-base;
    border-bottom: 1px solid @border-color-base;
    text-align: center;
    position: fixed;
    bottom: 0;
    margin-left: -1px;
    z-index: 2;
  }
}
</style>
