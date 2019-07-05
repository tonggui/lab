<template>
  <div>
    <div>
      <div class="smart-sort-title">置顶分类</div>
      <div>
        <TagTree
          :value="tagId"
          :dataSource="topTagList"
          :expandList="expandList"
          @expand="$listeners.expand"
          @select="$listeners.change"
        >
          <template v-slot:node-extra="{item, index}">
            <div v-if="item.level === 0">
              <span v-if="index > 0" class="smart-sort-icon add" @click.stop="handleForward(index)">
                <Icon type="vertical-align-top" size=14 />
              </span>
              <span class="smart-sort-icon remove" @click.stop="handleRemove(item, index)">
                <Icon type="minus" size=12 />
              </span>
            </div>
          </template>
          <template slot="empty">
            <div class="smart-sort-empty">尚未添加置顶排序</div>
          </template>
        </TagTree>
      </div>
    </div>
    <div>
      <div class="smart-sort-title">
        智能排序
        <small>点击“+”可添加置顶分类</small>
      </div>
      <div>
        <TagTree
          :value="tagId"
          :dataSource="normalTagList"
          :expandList="expandList"
          @expand="$listeners.expand"
          @select="$listeners.change"
        >
          <template v-slot:node-extra="{item, index}">
            <Tooltip transfer :disabled="!overLimit" :content="`当前置顶排序最大支持${topLimit}`">
              <span v-if="item.level === 0" class="smart-sort-icon add" :class="{disabled: overLimit}" @click.stop="handleAdd(item, index)">
                <Icon type="add" size=12 />
              </span>
            </Tooltip>
          </template>
        </TagTree>
      </div>
    </div>
  </div>
</template>
<script>
import TagTree from '@components/tag-tree'
import store from '@/views/product-list/store'

export default {
  name: 'smart-sort-tag-list',
  props: {
    tagList: {
      type: Array,
      default: () => []
    },
    tagId: Number,
    expandList: Array,
    topLimit: Number
  },
  data () {
    this.filterData(this.tagList)
    const { topTagList, normalTagList } = store
    return {
      topTagList,
      normalTagList
    }
  },
  computed: {
    overLimit () {
      return this.topTagList.length > this.topLimit
    }
  },
  watch: {
    tagList (newValue) {
      this.filterData(newValue)
    }
  },
  components: {
    TagTree
  },
  methods: {
    filterData (tagList) {
      const top = []
      const normal = []
      tagList.forEach(tag => {
        if (tag.isSmartSort) {
          top.push(tag)
          return
        }
        normal.push(tag)
      })
      store.topTagList = top
      store.normalTagList = normal
    },
    handleAdd (item, index) {
      this.topTagList.push(item)
      this.normalTagList.splice(index, 1)
    },
    handleRemove (item, index) {
      this.normalTagList.unshift(item)
      this.topTagList.splice(index, 1)
    },
    handleForward (index) {
      const item = this.topTagList[index]
      this.topTagList.splice(index, 1)
      this.topTagList.unshift(item)
    }
  }
}
</script>
<style lang="less" scoped>
  .smart-sort {
    &-title {
      font-weight: bold;
      padding-left: 20px;
      line-height: 40px;
      color: @text-color-secondary;
      small {
        color: @text-helper-color;
        font-size: 12px;
        font-weight: normal;
      }
    }
    &-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 14px;
      border: 1px solid rgba(248,152,0,0.30);
      border-radius: 100%;
      text-align: center;
      &:not(:last-child) {
        margin-right: 10px;
      }
      i {
        transform: scale(.6);
      }
      &.add {
        color: @highlight-color;
        border-color: #ffdfaf;
      }
      &.remove {
        color: #FF5F59;
        border-color: #f9d4d4;
      }
      &.disabled {
        pointer-events: none;
        cursor: not-allowed !important;
        border-color: @disabled-color;
        color: @disabled-color;
      }
    }
    &-empty {
      font-size: @font-size-small;
      padding: 0px 20px 20px 20px;
      color: @text-helper-color;
      border-bottom: 1px solid @border-color-light;
    }
  }
</style>
