import withCategoryTemplate from '@/views/category-template'
import Vue from 'vue'
import { mapModule } from '@/module/module-manage/vue'
import {
  BUSINESS_CATEGORY_TEMPLATE,
  TAG_FIRST_LEVEL_LIMIT
} from '@/module/moduleTypes'
import TagList from '@/components/taglist'
import TagListWithSuggest from '@/components/taglist/tag-list-with-suggest'

export default withCategoryTemplate(Vue.extend({
  name: 'suggest-tag-list-container',
  props: {
    categoryTemplateApplying: Boolean, // 分类模板是否正在生成
    usedBusinessTemplate: Boolean, // 是否应用了B端分类模板
    source: {
      type: Array,
      required: true
    },
    categoryId: Number,
    getSuggest: Function
  },
  data () {
    return {
      suggestList: []
    }
  },
  watch: {
    async categoryId () {
      if (this.usedBusinessTemplate && this.categoryId) {
        this.suggestList = await this.getSuggest(this.categoryId)
      }
    }
  },
  computed: {
    ...mapModule({
      haveBusinessTemplate: BUSINESS_CATEGORY_TEMPLATE,
      tagMaxLimit: TAG_FIRST_LEVEL_LIMIT
    }),
    needApplyWarning () {
      if (this.haveBusinessTemplate && !this.usedBusinessTemplate) {
        const tagCount = this.source.length
        const poor = tagCount < 5
        const rich = tagCount > this.tagMaxLimit
        if (poor || rich) {
          return `检测到店内分类${poor ? '过少' : '过多'}，建议使用分类模板，可提高商品曝光及转化`
        }
        return ''
      }
      return ''
    }
  },
  methods: {
    showCategoryTemplate () {
      this.$emit('show-category-template')
    }
  },
  render (h) {
    if (!this.haveBusinessTemplate) {
      return h(TagList, {
        props: {
          source: this.source
        },
        attrs: { ...this.$attrs },
        on: this.$listeners
      })
    }
    return h(TagListWithSuggest, {
      props: {
        source: this.source,
        categoryTemplateApplying: this.categoryTemplateApplying,
        needApplyWarning: this.needApplyWarning,
        suggestList: this.suggestList
      },
      attrs: { ...this.$attrs },
      on: {
        ...this.$listeners,
        showCategoryTemplate: this.showCategoryTemplate
      }
    })
  }
}))
