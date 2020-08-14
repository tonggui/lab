import Vue from 'vue'
import store from '@/store'
import categoryTemplateStore from './store'
import CategoryTemplatePage from './category-template-page'
import { createNamespacedHelpers } from 'vuex'

store.registerModule('categoryTemplate', categoryTemplateStore)

const { mapGetters, mapState, mapActions } = createNamespacedHelpers('categoryTemplate')

export const categoryTemplateMix = {
  computed: {
    ...mapState(['usedBusinessTemplate']),
    ...mapGetters({
      taskApplying: 'taskApplying'
    })
  },
  methods: {
    ...mapActions({
      handleShowDrawer: 'show'
    })
  }
}

export default (WrapperComponent) => {
  return Vue.extend({
    mixins: [categoryTemplateMix],
    render (h) {
      return h('div', [h(WrapperComponent, {
        attrs: {
          ...this.$attrs,
          categoryTemplateApplying: this.taskApplying,
          usedBusinessTemplate: this.usedBusinessTemplate
        },
        on: {
          ...this.$listeners,
          'show-category-template': this.handleShowDrawer
        }
      }), h(CategoryTemplatePage, {
        attrs: {
          ...this.$attrs
        }
      })])
    }
  })
}
