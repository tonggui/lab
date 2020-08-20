import withCategoryTemplate from '@/views/category-template'
import Vue from 'vue'
import { mapModule } from '@/module/module-manage/vue'
import {
  BUSINESS_CATEGORY_TEMPLATE,
  TAG_FIRST_LEVEL_LIMIT,
  POI_CREATE_PRODUCT_AUTO_FILL_TAG
} from '@/module/moduleTypes'
import TagList from '@/components/taglist'
import TagListWithSuggest from '@/components/taglist/tag-list-with-suggest'
import store from '@/store'
import { getPathById } from '@/components/taglist/util'

export default withCategoryTemplate(Vue.extend({
  name: 'suggest-tag-list-container',
  props: {
    categoryTemplateApplying: Boolean, // 分类模板是否正在生成
    usedBusinessTemplate: Boolean, // 是否应用了B端分类模板
    categoryId: Number,
    spuId: [Number, String],
    getSuggest: Function,
    getSource: Function,
    value: Array
  },
  data () {
    return {
      suggestList: [],
      source: []
    }
  },
  watch: {
    async categoryId () {
      if (this.usedBusinessTemplate && this.categoryId) {
        this.suggestList = await this.getSuggest(this.categoryId)
      }
    },
    needFillTagByQuery: {
      handler () {
        this.fillTagByQuery()
      },
      immediate: true
    }
  },
  computed: {
    ...mapModule({
      haveBusinessTemplate: BUSINESS_CATEGORY_TEMPLATE,
      tagMaxLimit: TAG_FIRST_LEVEL_LIMIT,
      needFillTagByQuery: POI_CREATE_PRODUCT_AUTO_FILL_TAG
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
  async mounted () {
    this.unsubscribeAction = store.subscribeAction(action => {
      if (action.type === 'categoryTemplate/successBroadcast') {
        this.getTagList()
      }
    })
    await this.getTagList()
    this.fillTagByQuery()
  },
  beforeDestroy () {
    if (this.unsubscribeAction) {
      this.unsubscribeAction()
    }
  },
  methods: {
    async getTagList () {
      try {
        this.source = await this.getSource()
      } catch (err) {
        console.error(err)
        this.source = []
      }
    },
    showCategoryTemplate () {
      this.$emit('show-category-template')
    },
    // 新建时自动根据query上的tagId填充店内分类
    fillTagByQuery () {
      const tagId = +this.$route.query.tagId
      const empty = !this.value || !this.value.length
      if (!this.spuId && tagId && this.needFillTagByQuery && empty) {
        const path = getPathById(tagId, this.source)
        if (path && path.length) {
          this.$emit('change', [{ id: tagId, name: path.name }])
        }
      }
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
        value: this.value,
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
