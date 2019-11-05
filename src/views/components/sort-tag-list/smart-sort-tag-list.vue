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
        <div v-if="item.level === 0 && !item.isUnCategorized">
          <span v-if="index > 0" class="smart-sort-icon add" @click.stop="handleForward(item)">
            <Icon local="set-top" size=14 />
          </span>
          <span class="smart-sort-icon remove" @click.stop="handleRemove(item)">
            <Tooltip v-if="showRemoveTipTag.id === item.id" type="guide" keyName="CATEGORY_REMOVE_TIP" placement="right-start" content="点击则可以取消置顶显示，用户端将根据买家喜好智能排序">
              <Icon local="circle-remove" size=12 />
            </Tooltip>
             <Icon v-else local="circle-remove" size=12 />
          </span>
        </div>
      </template>
      <template slot="empty">
        <div class="smart-sort-empty">尚未添加置顶排序</div>
      </template>
    </TagTree>
    <TagTree
      slot="smart-sort-default"
      :labelInValue="labelInValue"
      :showTopTime="false"
      :value="tagId"
      :dataSource="[...unCategorizedTag, ...normalTagList]"
      :expandList="expandList"
      @expand="$listeners.expand"
      @select="$listeners.select"
    >
      <template v-slot:node-extra="{item}">
        <Tooltip transfer :disabled="!overLimit" :content="`当前置顶排序最大支持${topLimit}`">
          <span v-if="item.level === 0 && !item.isUnCategorized" class="smart-sort-icon add" :class="{disabled: overLimit}" @click.stop="handleAdd(item)">
            <Tooltip v-if="showTopTipTag.id === item.id" type="guide" keyName="CATEGORY_ADD_TIP" placement="right-start" content="可添加置顶分类，添加后，该分类在用户端将置顶显示">
              <Icon local="add-plus" size=14 />
            </Tooltip>
            <Icon v-else local="add-plus" size=14 />
          </span>
        </Tooltip>
      </template>
    </TagTree>
  </Layout>
</template>
<script>
  import Layout from '@/views/components/layout/smart-sort'
  import TagTree from '@components/tag-tree'
  import lx from '@/common/lx/lxReport'

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
      unCategorizedTag () {
        return this.tagList.filter(tag => tag.isUnCategorized)
      },
      topTagList () {
        return this.tagList.filter(tag => tag.isSmartSort && !tag.isUnCategorized)
      },
      normalTagList () {
        return this.tagList.filter(tag => !tag.isSmartSort && !tag.isUnCategorized)
      },
      showTopTipTag () {
        return this.normalTagList.find(i => !i.isUnCategorized)
      },
      showRemoveTipTag () {
        return this.topTagList.find(i => !i.isUnCategorized)
      }
    },
    components: {
      Layout,
      TagTree
    },
    methods: {
      filterTag (item, list) {
        return list.filter(tag => tag.id !== item.id)
      },
      handleToggleTop (item, status) {
        const newItem = {
          ...item,
          isSmartSort: status
        }
        let topTagList = this.topTagList
        let normalTagList = this.normalTagList
        if (status) {
          normalTagList = this.filterTag(item, this.normalTagList)
        } else {
          topTagList = this.filterTag(item, this.topTagList)
        }
        // 未分类 一直在最前面
        const list = [...this.unCategorizedTag, ...topTagList, newItem, ...normalTagList]
        return this.$emit('change', list, newItem)
      },
      handleAdd (item) {
        lx.mc({ bid: 'b_shangou_online_e_iph8rhm4_mc', val: { type: 1 } })
        this.handleToggleTop(item, true)
      },
      handleRemove (item) {
        lx.mc({ bid: 'b_shangou_online_e_iph8rhm4_mc', val: { type: 2 } })
        this.handleToggleTop(item, false)
      },
      handleForward (item) {
        lx.mc({ bid: 'b_shangou_online_e_iph8rhm4_mc', val: { type: 0 } })
        const topTagList = this.filterTag(item, this.topTagList)
        const list = [...this.unCategorizedTag, item, ...topTagList, ...this.normalTagList]
        return this.$emit('change', list, item)
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
