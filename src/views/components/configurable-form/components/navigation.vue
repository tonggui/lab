<template>
  <Affix>
    <Tabs :value="value" class="form-navigation" ref="navigation">
      <TabPane v-for="item in linkList" :label="(h) => renderLabel(h, item)" :name="item.link" :key="item.link" />
    </Tabs>
  </Affix>
</template>
<script>
  import { getScrollElement, scrollTo } from '@/common/domUtils'

  export default {
    name: 'form-navigation',
    props: {
      linkList: {
        type: Array,
        required: true
      },
      offset: {
        type: Number,
        default: 0
      },
      bounds: {
        type: Number,
        default: 20
      },
      getContainer: {
        type: Function,
        default: getScrollElement
      }
    },
    data () {
      return {
        value: undefined
      }
    },
    watch: {
      '$route.hash': {
        immediate: true,
        handler (hash) {
          this.value = hash
        }
      }
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
      window.addEventListener('hashChange', this.handleHashChange)
      this.$nextTick(() => {
        this.height = this.$refs.navigation.$el.offsetHeight || 0
        this.handleScrollTo(this.value)
      })
      // const container = this.getContainer()
      // container.style['scroll-padding-top'] = '68px'
    },
    created () {
      this.scrolling = false
      this.height = 0
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      handleScrollTo (link) {
        const id = link.replace(/^#(\w*)$/, '$1')
        const element = document.getElementById(id)
        if (element) {
          this.scrolling = true
          const top = element.offsetTop - this.offset - this.height
          const container = this.getContainer()
          console.log('handleScrollTo:', this.height, element.offsetTop, top)
          scrollTo(top, {
            container,
            callback: () => {
              console.log('handleScrollTo end:', top, container.scrollTop)
              this.scrolling = false
            }
          })
        }
      },
      handleScroll () {
        console.log('handleScroll:', this.scrolling)
        if (this.scrolling) {
          return
        }
        const $container = this.getContainer()
        const scrollTop = $container.scrollTop
        const containerHeight = $container.offsetHeight
        const link = this.linkList.find(({ link }) => {
          const id = link.replace(/^#(\w*)$/, '$1')
          const element = document.getElementById(id)
          if (element) {
            const bottom = element.offsetTop + element.offsetHeight - scrollTop - this.height
            if (bottom > this.bounds && bottom < containerHeight) {
              return true
            }
          }
        })
        if (link) {
          this.value = link.link
        }
      },
      renderLabel (h, item) {
        return h('a', {
          domProps: { href: item.link },
          on: {
            click: ($event) => {
              $event.preventDefault()
              this.$router.replace({ hash: item.link, query: this.$route.query }, () => {}, () => {})
              this.handleScrollTo(item.link)
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
  }
</style>
