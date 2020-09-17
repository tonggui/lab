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

// 分类模版组件包装
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
      try {
        // 门店使用了B端分类模版，并且商品有类目Id，获取推荐类目
        if (this.usedBusinessTemplate && this.categoryId) {
          this.suggestList = await this.getSuggest(this.categoryId)
        }
      } catch (err) {
        console.error(err)
      }
    },
    // url上tagId填充逻辑
    /**
     * 用户新建商品的时候：
     * 如果门店使用了B端分类模版，则不进行url上的tagId 填充，通过推荐的方式引导用户
     * 如果门店未使用B端分类模版，则填充url的tagId
     * 此状态抽象到cmm的开关中了 POI_CREATE_PRODUCT_AUTO_FILL_TAG
     */
    needFillTagByQuery: {
      handler () {
        this.fillTagByQuery()
      },
      immediate: true
    }
  },
  computed: {
    ...mapModule({
      // 门店是否有可以使用的B端分类模版
      haveBusinessTemplate: BUSINESS_CATEGORY_TEMPLATE,
      // 配置的 一级店内分类 上限，进行分类模版引导
      tagMaxLimit: TAG_FIRST_LEVEL_LIMIT,
      // 根据门店是否 使用B端分类模版，控制是否进行 url上tagId的填充
      needFillTagByQuery: POI_CREATE_PRODUCT_AUTO_FILL_TAG
    }),
    // 分类模版引导文案
    needApplyWarning () {
      // 门店有可以使用的B端分类模版 && 门店没有使用B端分类模版
      if (this.haveBusinessTemplate && !this.usedBusinessTemplate) {
        // 门店的一级店内分类 数量 不在 [5, tagMaxLimit] 范围内，进行分类模版引导
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
    try {
      // 编辑页 进行分类模版的使用时，需要监听，分类模版成功信号，成功之后，进行 店内分类更新
      // 避免用户填写信息丢失，只更新 店内分类
      this.unsubscribeAction = store.subscribeAction(action => {
        if (action.type === 'categoryTemplate/successBroadcast') {
          this.getTagList()
        }
      })
      // 挂载之后，获取店内分类
      await this.getTagList()
      this.fillTagByQuery()
    } catch (err) {
      console.error(err)
    }
  },
  beforeDestroy () {
    // 卸载之前，取消 分类模版成功的监听
    if (this.unsubscribeAction) {
      this.unsubscribeAction()
    }
  },
  methods: {
    // 获取店内分类列表
    async getTagList () {
      try {
        this.source = await this.getSource()
      } catch (err) {
        console.error(err)
        this.source = []
      }
    },
    // 打开分类模版
    showCategoryTemplate () {
      this.$emit('show-category-template')
    },
    // 新建时自动根据query上的tagId填充店内分类
    fillTagByQuery () {
      const tagId = +this.$route.query.tagId
      const empty = !this.value || !this.value.length
      // 新建场景下，url上有tagId，支持填充，tagId字段未填充值
      // 根据tagList，获取url上tagId对应的tag信息，获取到之后，进行填充
      if (!this.spuId && tagId && this.needFillTagByQuery && empty) {
        const path = getPathById(tagId, this.source)
        if (path && path.length) {
          this.$emit('change', [{ id: tagId, name: path.name }])
        }
      }
    }
  },
  render (h) {
    // 门店没有可以使用的B端分类模版，降级成 tagList组件（不带推荐的店内分类组件）
    if (!this.haveBusinessTemplate) {
      return h(TagList, {
        props: {
          value: this.value,
          source: this.source
        },
        attrs: { ...this.$attrs },
        on: this.$listeners
      })
    }
    // 渲染带推荐的店内分类 组件
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
