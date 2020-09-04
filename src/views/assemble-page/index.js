import Vue from 'vue'
// import domain from './methods'
// import service from './service'
import indexPage from '../new-product-edit/index.vue'
import { categoryTemplateMix } from '@/views/category-template'
import { methods, data } from './instance'
// const { methods, data } = domain(service)

const component = (Component) => Vue.extend({
  name: 'assemble-page',
  inject: ['appState'],
  mixins: [categoryTemplateMix],
  data () {
    return {
      loading: false
    }
  },
  computed: {
    isBusinessClient () {
      return this.appState.isBusinessClient
    },
    spId () {
      return this.$route.query.spId
    },
    spuId () {
      return +(this.$route.query.spuId || 0)
    }
  },
  async created () {
    try {
      this.loading = true
      if (this.spuId) {
        // 编辑模式获取 商品详情
        await methods.getDetail()
        await methods.getGetNeedAudit(true)
      } else if (this.spId) {
        await methods.getSpDetail()
      }
    } catch (err) {
      console.error(err)
      this.$Message.error(err.message)
    } finally {
      this.loading = false
    }
  },
  render (h) {
    if (this.loading) {
      return 'loading...'
    } else {
      return h(Component, {
        props: {
          ...this.$props,
          ...data,
          isBusinessClient: this.isBusinessClient
        },
        on: {
          'on-submit': methods.handleSubmit,
          'on-cancel': methods.handleCancel.bind(this),
          'on-revocation': methods.handleRevocation,
          'change': methods.handleCategoryChange
        }
      })
    }
  }
})

export default component(indexPage)
