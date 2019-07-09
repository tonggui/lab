<template>
  <Layout>
    <TagTree
      slot="smart-sort-top"
      :value="tagId"
      :showTopTime="false"
      :dataSource="topTagList"
      :expandList="expandList"
      @expand="$listeners.expand"
      @select="$listeners.select"
    >
      <template v-slot:node-extra="{item, index}">
        <div v-if="item.level === 0">
          <span v-if="index > 0" class="smart-sort-icon add" @click.stop="handleForward(item)">
            <Icon type="vertical-align-top" size=14 />
          </span>
          <span class="smart-sort-icon remove" @click.stop="handleRemove(item)">
            <Icon type="minus" size=12 />
          </span>
        </div>
      </template>
      <template slot="empty">
        <div class="smart-sort-empty">尚未添加置顶排序</div>
      </template>
    </TagTree>
    <TagTree
      slot="smart-sort-default"
      :showTopTime="false"
      :value="tagId"
      :dataSource="normalTagList"
      :expandList="expandList"
      @expand="$listeners.expand"
      @select="$listeners.select"
    >
      <template v-slot:node-extra="{item}">
        <Tooltip transfer :disabled="!overLimit" :content="`当前置顶排序最大支持${topLimit}`">
          <span v-if="item.level === 0" class="smart-sort-icon add" :class="{disabled: overLimit}" @click.stop="handleAdd(item)">
            <Icon type="add" size=12 />
          </span>
        </Tooltip>
      </template>
    </TagTree>
  </Layout>
</template>
<script>
import Layout from '@/views/components/product-list/layout/smart-sort'
import TagTree from '@components/tag-tree'

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
  computed: {
    overLimit () {
      return this.topTagList.length > this.topLimit
    },
    topTagList () {
      return this.tagList.filter(tag => tag.isSmartSort)
    },
    normalTagList () {
      return this.tagList.filter(tag => !tag.isSmartSort)
    }
  },
  components: {
    Layout,
    TagTree
  },
  methods: {
    filterTag (item) {
      return this.tagList.filter(tag => tag.id !== item.id)
    },
    handleToggleTop (item, status) {
      const list = this.filterTag(item)
      list.push({
        ...item,
        isSmartSort: status
      })
      return this.$emit('change', list)
    },
    handleAdd (item) {
      this.handleToggleTop(item, true)
    },
    handleRemove (item) {
      this.handleToggleTop(item, false)
    },
    handleForward (item) {
      const list = this.filterTag(item)
      list.unshift(item)
      return this.$emit('change', list)
    }
  }
}
</script>
<style lang="less" scoped>
  .smart-sort {
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
