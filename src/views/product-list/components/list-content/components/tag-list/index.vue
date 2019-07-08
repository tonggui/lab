<template>
  <div class="tag-list-container" ref="container">
    <template>
      <div v-if="!sorting" class="tag-list-header">
        <Button :disabled="loading">
          <Icon type="add"></Icon>
          新建分类
        </Button>
        <Button @click="handleSort" :disabled="loading">
          <Icon type="swap-vert"></Icon>
          管理排序
        </Button>
      </div>
      <div v-else class="tag-list-sort-header">
        <span v-if="isMedicine">商品/分类排序</span>
        <template v-else>
          <span>分类智能排序</span>
          <iSwitch size="small" :value="smartSortSwitch" @on-change="handleToggleSmartSort" />
        </template>
      </div>
    </template>
    <div class="tip" v-if="showSmartSortTip">智能排序开启中</div>
    <Affix>
      <div class="tag-list-affix">
        <div class="tag-list-content" ref="content">
          <keep-alive>
            <component
              :is="tagComponent"
              :tagId="tagId"
              :tagList="tagList"
              :topLimit="topLimit"
              :expandList="expandList"
              :loading="loading"
              @expand="handleTagExpand"
              @change="$listeners.change"
              @edit="handleEdit"
              @delete="handleDelete"
            ></component>
          </keep-alive>
          <Loading :loading="loading"></Loading>
        </div>
        <div class="tag-list-footer" ref="footer" v-if="!sorting">
          <Button>
            <Icon type="format-list-bulleted"></Icon>
            分类模版
          </Button>
        </div>
      </div>
    </Affix>
  </div>
</template>
<script>
import {
  findFirstLeaf
} from '@/common/utils'
import ManageTagList from './components/manage-tag-list'
import SmartSortTagList from './components/smart-sort-tag-list'
import DragSortTagList from './components/drag-sort-tag-list'
import Loading from '@components/loading'
import {
  fetchGetPoiTagInfo
} from '@/data/repos/category'
import {
  defaultTagId
} from '@/data/constants/poi'
import {
  POI_IS_MEDICINE
} from '@/common/cmm'
import withModules from '@/mixins/withModules'
import state from '@/views/product-list/store'

export default {
  name: 'tag-list-container',
  mixins: [withModules({ isMedicine: POI_IS_MEDICINE })],
  props: {
    sorting: {
      type: Boolean,
      default: false
    },
    tagId: {
      type: Number,
      default: defaultTagId
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      error: false,
      tagList: [],
      expandList: [],
      topLimit: 0,
      smartSortSwitch: false
    }
  },
  components: {
    ManageTagList,
    SmartSortTagList,
    DragSortTagList,
    Loading
  },
  computed: {
    showSmartSortTip () {
      return !this.isMedicine && !this.sorting && this.smartSortSwitch
    },
    tagComponent () {
      if (!this.sorting) {
        return ManageTagList
      }
      return this.smartSortSwitch ? SmartSortTagList : DragSortTagList
    }
  },
  watch: {
    sorting (newValue) {
      if (newValue && this.tagId === defaultTagId) {
        const node = findFirstLeaf(this.tagList)
        this.$emit('change', node.id)
      }
    }
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
          height = height - $footer.offsetHeight
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
    },
    handleSort () {
      this.$emit('sort')
      this.handleDom()
    },
    handleTagExpand (list) {
      this.expandList = list
    },
    handleToggleSmartSort (value) {
      this.smartSortSwitch = value
      this.handleDom()
    },
    async getData () {
      this.loading = true
      try {
        const { tagList, tagInfo } = await fetchGetPoiTagInfo(true)
        const { smartSortSwitch, topLimit, productTotal } = tagInfo
        // TODO
        state.productCount = productTotal
        this.tagList = tagList
        this.topLimit = topLimit
        this.smartSortSwitch = smartSortSwitch
        this.error = false
      } catch (err) {
        this.error = true
      } finally {
        this.loading = false
      }
      this.handleDom()
    },
    handleEdit (tagList) {
      this.tagList = tagList
    },
    async handleDelete () {
      this.getData()
    }
  },
  mounted () {
    this.getData()
    window.addEventListener('scroll', this.fixedHeight)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.fixedHeight)
  }
}
</script>
<style lang="less" scoped>
.tag-list {
  &-container {
    border-right: 1px solid @border-color-base;
    background: @component-bg;
    display: flex;
    position: relative;
    flex-direction: column;
  }
  .tip {
    color: @text-color-secondary;
    font-size: @font-size-small;
    background: rgba(248,181,0,0.10);
    line-height: 36px;
    padding-left: 20px;
  }
  &-header {
    display: flex;
    padding: 15px 20px;
    button {
      height: 30px;
      line-height: 1;
      padding: 8px 10px;
      font-size: @font-size-small;
      &:not(:last-child) {
        margin-right: 10px;
      }
      i {
        margin-top: -3px;
      }
    }
  }
  &-sort-header {
    padding: 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid @border-color-light;
    span {
      margin-right: 5px;
    }
  }
  &-affix {
    border-right: 1px solid @border-color-base;
    margin-right: -1px;
  }
  &-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100vh;
    // position: relative;
  }
  &-footer {
    background: @component-bg;
    padding: 10px 20px;
    border-top: 1px solid @border-color-base;
    border-bottom: 1px solid @border-color-base;
    text-align: center;
    button {
      width: 100%;
    }
  }
}
</style>
