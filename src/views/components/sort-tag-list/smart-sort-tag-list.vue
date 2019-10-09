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
            <TooltipWithLocalstorage v-if="showRemoveTipTag.id === item.id" keyName="CATEGORY_REMOVE_TIP" placement="right-start" content="点击则可以取消置顶显示，用户端将根据买家喜好智能排序">
              <Icon local="circle-remove" size=12 />
            </TooltipWithLocalstorage>
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
      :dataSource="normalTagList"
      :expandList="expandList"
      @expand="$listeners.expand"
      @select="$listeners.select"
    >
      <template v-slot:node-extra="{item}">
        <Tooltip transfer :disabled="!overLimit" :content="`当前置顶排序最大支持${topLimit}`">
          <span v-if="item.level === 0 && !item.isUnCategorized" class="smart-sort-icon add" :class="{disabled: overLimit}" @click.stop="handleAdd(item)">
            <TooltipWithLocalstorage v-if="showTopTipTag.id === item.id" keyName="CATEGORY_ADD_TIP" placement="right-start" content="可添加置顶分类，添加后，该分类在用户端将置顶显示">
              <Icon local="add-plus" size=14 />
            </TooltipWithLocalstorage>
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
  import TooltipWithLocalstorage from '@components/tooltip-with-localstorage'
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
      topTagList () {
        return this.tagList.filter(tag => tag.isSmartSort)
      },
      normalTagList () {
        return this.tagList.filter(tag => !tag.isSmartSort)
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
      TagTree,
      TooltipWithLocalstorage
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
        return this.$emit('change', list, { item: newItem })
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
        const list = this.filterTag(item)
        list.unshift(item)
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
