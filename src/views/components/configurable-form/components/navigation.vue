<template>
  <Affix id='form-navigation-container'>
    <Tabs :key="update" :value="value" @on-click="handleClick" class="form-navigation" ref="navigation">
      <TabPane v-for="item in linkList" :label="(h) => renderLabel(h, item)" :name="item.link" :key="item.link" />
    </Tabs>
  </Affix>
</template>
<script>
  import { isEqual } from 'lodash'
  import { getScrollElement, scrollTo } from '@/common/domUtils'

  /**
   * 根据Tab组件实现的一个导航组件
   * 主要功能：
   * 1. 页面上下滚动时，导航自动更新 --> handleScroll
   * 2. 点击导航，滚动到对应的位置 --> handleScrollTo
   * 3. url上携带hash的时候，自动滚动到hash的位置
   */
  export default {
    name: 'form-navigation',
    props: {
      // 导航列表
      linkList: {
        type: Array,
        required: true
      },
      // 偏移位置
      offset: {
        type: Number,
        default: 0
      },
      // 底部的位置
      bounds: {
        type: Number,
        default: 40
      },
      // 获取滚动的container
      getContainer: {
        type: Function,
        default: getScrollElement
      }
    },
    data () {
      return {
        value: undefined, // 当前active的anchor
        update: 0 // TODO linkList变化的时候，tab更新的位置和linkList不一致，通过key，卸载重新create个组件
      }
    },
    watch: {
      '$route.hash': {
        immediate: true,
        handler (hash) {
          // hash初始值处理
          const include = this.linkList.find(l => l.link === hash)
          if (include) {
            this.value = hash
          } else {
            this.value = this.linkList[0].link
          }
        }
      },
      linkList (newValue, oldValue) {
        // linkList 更新，重新计算active
        if (!isEqual(newValue, oldValue)) {
          this.update += 1
          this.handleScroll()
        }
      }
    },
    mounted () {
      window.addEventListener('hashChange', this.handleHashChange)
      this.$nextTick(() => {
        this.height = this.$refs.navigation.$el.offsetHeight || 0
        if (this.$route.hash) {
          this.handleScrollTo(this.value)
          setTimeout(() => {
            window.addEventListener('scroll', this.handleScroll) // 绑定滚动事件
          }, 1500) // TODO hack 当页面加载完成时，添加滚动事件 更好的方案?
        } else {
          window.addEventListener('scroll', this.handleScroll) // 绑定滚动事件
        }
      })
    },
    created () {
      this.scrolling = false
      this.height = 0
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      // 滚动到指定的link
      handleScrollTo (link) {
        const id = link.replace(/^#(\w*)$/, '$1')
        const element = document.getElementById(id)
        if (element) {
          this.scrolling = true
          const top = element.offsetTop - this.offset - this.height
          const container = this.getContainer()
          scrollTo(top, {
            container,
            callback: () => {
              this.scrolling = false
            }
          })
        }
      },
      // tab的link事件，滚动到指定的link位置
      handleClick (link) {
        this.$router.replace({ hash: link, query: this.$route.query }, () => {}, () => {})
        this.handleScrollTo(link)
      },
      // 页面滚动事件处理
      handleScroll () {
        if (this.scrolling) {
          return
        }
        const $container = this.getContainer()
        const scrollTop = $container.scrollTop
        const containerHeight = $container.offsetHeight
        const activeLink = this.linkList.find(({ link }) => {
          const id = link.replace(/^#(\w*)$/, '$1')
          const element = document.getElementById(id)
          if (element) {
            const top = element.offsetTop - scrollTop - this.height
            const bottom = Math.min(top + element.offsetHeight, containerHeight)
            if (top < containerHeight && bottom > this.bounds) {
              return true
            }
          }
        })
        if (activeLink) {
          this.value = activeLink.link
        }
      },
      // 渲染tab
      renderLabel (h, item) {
        return h('a', {
          domProps: { href: item.link },
          on: {
            click: ($event) => {
              $event.preventDefault()
            }
          }
        }, [item.name])
      }
    }
  }
</script>
<style lang="less" scoped>
  .form-navigation {
    background: #ffff;
    /deep/ a {
      color: @primary-color;
    }
    /deep/ .boo-tabs-bar {
      margin-bottom: 0;
    }
  }
</style>
