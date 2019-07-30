<template>
  <Layout :loading="loading">
    <div class="manage-tag-list-header" slot="header">
      <Button
        :disabled="loading"
        @click="handleAddTag"
        v-mc="{ bid: 'b_shangou_online_e_ctqgsxco_mc' }"
      >
        <Icon local="add"></Icon>
        新建分类
      </Button>
      <Button
        :disabled="sortable"
        @click="$emit('open-sort')"
        v-mc="{ bid: 'b_shangou_online_e_lbx2k1w8_mc' }"
      >
        <Icon local="sort"></Icon>
        管理排序
      </Button>
    </div>
    <div slot="tip" v-if="showSmartSortTip">智能排序开启中</div>
    <TagTree
      slot="content"
      :labelInValue="labelInValue"
      :value="tagId"
      :dataSource="tagList"
      :expandList="expandList"
      showAllData
      :productCount="productCount"
      @expand="$listeners.expand"
      @select="$listeners.select"
    >
      <template v-slot:node-extra="{item, hover, actived}">
        <template v-if="isShowSetting(item)">
          <div v-show="hover || actived" class="manage-tag-list-icon" @click.stop>
            <Opreation :item="item" :visible="hover || actived" @on-click="handleOpreation" />
          </div>
        </template>
      </template>
      <template v-slot:node-tag="{item}">
        <div v-if="item.isUnCategorized" class="manage-tag-list-un-categorized"></div>
      </template>
      <Empty slot="empty" description="还没有分类哦~">
        <Button @click="handleAddTag" type="primary">新建分类</Button>
      </Empty>
    </TagTree>
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
    <ManageModal
      :value="visible"
      :type="type"
      :item="editItem"
      :tagList="tagList"
      @on-ok="handleSubmit"
      @on-cancel="handleHideModal"
    />
  </Layout>
</template>
<script>
  import Layout from '@/views/components/layout/tag-list'
  import TagTree from '@components/tag-tree'
  import ManageModal from './manage-tag-modal'
  import Opreation from './opreation'
  import {
    TAG_OPERATION_TYPE as TYPE
  } from '@/data/enums/category'
  import {
    POI_IS_MEDICINE
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'
  import {
    defaultTagId
  } from '@/data/constants/poi'
  import lx from '@/common/lx/lxReport'

  const statisticsType = {
    [TYPE.TITLE]: ['EDIT_FIRST', 'EDIT_SECOND'],
    [TYPE.TOP_TIME]: 'SET_SELLTIME',
    [TYPE.SET_CHILD_TAG]: 'TO_SECOND',
    [TYPE.ADD_CHILD_TAG]: 'NEW_SECOND',
    [TYPE.SET_FIRST_TAG]: 'TO_FIRST',
    [TYPE.DELETE]: ['DEL_FIRST', 'DEL_SECOND']
  }

  export default {
    name: 'manage-tag-list',
    mixins: [withModules({ isMedicine: POI_IS_MEDICINE })],
    props: {
      labelInValue: Boolean,
      productCount: Number,
      expandList: Array,
      tagId: Number,
      tagList: {
        type: Array,
        default: () => []
      },
      smartSortSwitch: Boolean,
      showSmartSort: Boolean,
      loading: Boolean
    },
    data () {
      return {
        type: undefined, // 分类操作的类别
        visible: false, // 是否展示分类操作弹框
        editItem: undefined // 操作的item
      }
    },
    computed: {
      sortable () {
        return this.loading || this.tagId === defaultTagId || this.tagList.length <= 0
      },
      showSmartSortTip () {
        return !this.isMedicine && this.smartSortSwitch && this.showSmartSort
      },
      TYPE () {
        return TYPE
      }
    },
    components: {
      TagTree,
      ManageModal,
      Layout,
      Opreation
    },
    methods: {
      isFirstTag (tag) {
        return tag.level === 0
      },
      // 全部商品和未分类 是不允许操作的
      isShowSetting (item) {
        return item.id !== defaultTagId && !item.isUnCategorized
      },
      // 埋点
      statistics (opType, item) {
        let type = statisticsType[opType]
        if (Array.isArray(type)) {
          type = type[item.level]
        }
        lx.mc({ bid: 'b_shangou_online_e_8m7c173p_mc', val: { menu: type } })
      },
      handleOpreation (type, item) {
        if (type !== TYPE.CREATE) {
          this.statistics(type, item)
        }
        if (type === TYPE.SET_CHILD_TAG && !item.isLeaf) {
          return
        }
        if (type === TYPE.DELETE && (item.productCount <= 0 && item.isLeaf)) {
          this.handleDelete(item)
          return
        } else if (type === TYPE.SET_FIRST_TAG) {
          this.handleSetFirst(item)
          return
        }
        this.visible = true
        this.type = type
        this.editItem = item
      },
      handleAddTag () {
        this.handleOpreation(TYPE.CREATE)
      },
      handleSetFirst (item) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定设为一级分类吗？</p>',
          onOk: async () => {
            try {
              const tagInfo = {
                ...item
              }
              this.$emit('edit', tagInfo, TYPE.SET_FIRST_TAG, () => {
                this.updateTagList(tagInfo, TYPE.SET_FIRST_TAG)
              })
            } catch (err) {
              this.$Message.error(err.message || err)
            }
          }
        })
      },
      handleDelete (item) {
        this.$Modal.confirm({
          title: '提示',
          content: `<p>确认删除分类 ${item.name} 吗</p>`,
          onOk: async () => {
            try {
              this.$emit('delete', item)
            } catch (err) {
              this.$Message.error(err.message || err)
            }
          }
        })
      },
      handleHideModal () {
        this.visible = false
      },
      // TODO 优化
      updateTagList (tagInfo, type) {
        const list = [...this.tagList]
        if (tagInfo.level === 0) {
          const index = list.findIndex(tag => tag.id === tagInfo.id)
          list.splice(index, 1, tagInfo)
        } else {
          const parentIndex = list.findIndex(tag => tag.id === tagInfo.parentId)
          const parentTag = list[parentIndex]
          // 设置为二级分类
          if (type === TYPE.SET_CHILD_TAG) {
            const childIndex = list.findIndex(tag => tag.id === tagInfo.id)
            const tag = list[childIndex]
            list.splice(parentIndex, 1, {
              ...parentTag,
              productCount: parentTag.productCount + tag.productCount,
              children: [...parentTag.children, tagInfo]
            })
            list.splice(childIndex, 1)
          } else if (type === TYPE.ADD_CHILD_TAG) { // 新增二级分类
            list.splice(parentIndex, 1, {
              ...parentTag,
              isLeaf: false,
              children: [
                ...(parentTag.children || []),
                tagInfo
              ]
            })
          } else {
            const newChildren = [...parentTag.children]
            const childIndex = newChildren.findIndex(tag => tag.id === tagInfo.id)
            if (type === TYPE.SET_FIRST_TAG) { // 设为一级分类
              newChildren.splice(childIndex, 1)
              list.splice(parentIndex, 1, {
                ...parentTag,
                isLeaf: newChildren.length <= 0,
                productCount: parentTag.productCount - tagInfo.productCount,
                children: newChildren
              })
              list.push({ ...tagInfo, level: 0, parentId: defaultTagId })
            } else {
              newChildren.splice(childIndex, 1, tagInfo)
              list.splice(parentIndex, 1, {
                ...parentTag,
                children: newChildren
              })
            }
          }
        }
        this.$emit('change', list)
      },
      handleSubmit (tagInfo, deleteType) {
        try {
          const callback = () => {
            this.updateTagList(tagInfo, this.type)
            this.visible = false
          }
          if (this.type === TYPE.DELETE) {
            this.$emit('delete', tagInfo, deleteType, callback)
          } else if ([TYPE.CREATE, TYPE.ADD_CHILD_TAG].includes(this.type)) {
            this.$emit('add', tagInfo, (tagId) => {
              tagInfo.id = tagId
              callback()
            })
          } else {
            this.$emit('edit', tagInfo, this.type, callback)
          }
        } catch (err) {
          this.$Message.error(err.message || err)
        }
      }
    }
  }
</script>
<style lang="less">
.manage-tag-list {
  &-header {
    display: flex;
    padding: 15px 20px;
    border-bottom: 1px solid @border-color-base;
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
  &-icon {
    color: @text-color-secondary;
  }
  &-un-categorized {
    position: absolute;
    top: 0;
    right: 0;
    width: 58px;
    height: 58px;
    background: url(~@/assets/tag-badge.png);
    background-size: 100% 100%;
  }
  &-top-flag {
    position: absolute;
    right: 0px;
    top: 0px;
  }
}
</style>
