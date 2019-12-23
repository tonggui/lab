import Vue from 'vue'
import store from '@/store'
import categoryTemplateStore from './store'
import CategoryTemplatePage from './category-template-page'

store.registerModule('categoryTemplate', categoryTemplateStore)

export default (WrapperComponent) => {
  return Vue.extend({
    render (h) {
      return h('div', [h(CategoryTemplatePage, {
        attrs: {
          ...this.$attrs
        },
        scopedSlots: {
          default: ({
            show, applying, usedBusinessTemplate
          }) => h(WrapperComponent, {
            attrs: {
              categoryTemplateApplying: applying,
              usedBusinessTemplate
            },
            on: {
              'show-category-template': show
            }
          })
        }
      })])
    }
  })
}
