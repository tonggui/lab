<template>
  <Layout name="分类" class="smart-sort-tag-list">
    <TagTree
      slot="smart-sort-top"
      class="smart-sort-top-tag-list"
      :labelInValue="labelInValue"
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
            <Icon local="set-top" size=14 />
          </span>
          <span class="smart-sort-icon remove" @click.stop="handleRemove(item)">
            <Icon local="circle-remove" size=12 />
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
            <Icon local="add-plus" size=14 />
          </span>
        </Tooltip>
      </template>
    </TagTree>
  </Layout>
</template>
<script>
  import Layout from '@/views/components/layout/smart-sort'
  import TagTree from '@components/tag-tree'

  export default {
    name: 'smart-sort-tag-list',
    props: {
      labelInValue: Boolean,
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
        const newItem = {
          ...item,
          isSmartSort: status
        }
        if (status) {
          list.push(newItem)
        } else {
          list.unshift(newItem)
        }
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
<style lang="less">
  @import '~@/styles/common.less';
  .smart-sort-top-tag-list {
    /deep/ .tag-tree-empty {
      margin-top: 0;
    }
  }
  .smart-sort-empty {
    margin: 10px 20px;
    color: @disabled-color;
  }
  .smart-sort-icon {
    .smart-sort-icon
  }
</style>
