<script>
  import { parse } from 'qs'
  import jumpTo from './jumpTo'
  import { isPageName } from '@sgfe/eproduct/navigator/pages/page'
  import { getMerchantId } from '@/common/constants'

  export default {
    name: 'Link',
    props: {
      to: {
        type: [String, Object],
        required: true
      },
      tag: {
        type: String,
        default: 'Button'
      },
      replace: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      delay: {
        type: Number,
        default: 0
      },
      beforeLeave: Function
    },
    methods: {
      async handleClickEvent (e) {
        this.$emit('click', e)

        // don't redirect with control keys
        if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
        // don't redirect when preventDefault called
        if (e.defaultPrevented) return
        // don't redirect on right click
        if (e.button !== undefined && e.button !== 0) return
        // don't redirect if `target="_blank"`
        if (e.currentTarget && e.currentTarget.getAttribute) {
          const target = e.currentTarget.getAttribute('target')
          if (/\b_blank\b/i.test(target)) return
        }
        // this may be a Weex event which doesn't have this method
        if (e.preventDefault) {
          e.preventDefault()
        }
        if (this.beforeLeave) {
          const isContinue = await this.beforeLeave()
          if (!isContinue) return
        }
        if (this.delay) {
          setTimeout(() => this.jumpTo(), this.delay)
        } else {
          this.jumpTo()
        }
      },
      jumpTo () {
        const router = this.$router
        const name = this.to && this.to.name
        console.log('router', router)
        if (isPageName(name)) {
          const { search, query = {}, state = {} } = this.to
          jumpTo(
            name,
            {
              ...state,
              params: {
                ...parse(search, { ignoreQueryPrefix: true }),
                ...query
              }
            },
            {
              name: true
            }
          )
        } else if (this.to) {
          // 本地路由 matched 才做resolve 否则不处理
          if (this.to.path === '/merchant/product/setting') {
            this.to.query = this.to.query || {}
            this.to.query.merchantId = getMerchantId()
          }
          const { matched } = router.match(this.to)
          let href = this.to
          if (matched && matched.length > 0) {
            const route = router.resolve(this.to, this.$route, false)
            href = route.href
          }
          jumpTo(href)
        }
      }
    },
    render (h) {
      const data = {
        on: {
          click: this.handleClickEvent
        },
        props: {
          ...this.$props,
          ...this.$attrs
        },
        class: {
          link: true
        }
      }

      return h(this.tag, data, this.$slots.default)
    }
  }
</script>

<style>
  .link.boo-btn-text {
    background-color: transparent;
  }
</style>
