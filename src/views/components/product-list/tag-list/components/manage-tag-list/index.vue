<template>
  <Layout :loading="loading">
    <div class="manage-tag-list-header" slot="header">
      <Button :disabled="loading" @click="handleOpreation(TYPE.CREATE)">
        <Icon type="add"></Icon>
        新建分类
      </Button>
      <Button @click="$emit('open-sort')" :disabled="loading">
        <Icon type="swap-vert"></Icon>
        管理排序
      </Button>
    </div>
    <div slot="tip" v-if="showSmartSortTip">智能排序开启中</div>
    <TagTree
      slot="content"
      :value="tagId"
      :dataSource="tagList"
      :expandList="expandList"
      showAllData
      :productCount="productCount"
      @expand="$listeners.expand"
      @select="$listeners.select"
    >
      <template v-slot:node-extra="{item, hover, actived}">
        <div v-if="isShowSetting(item)" v-show="hover || actived" class="manage-tag-list-icon" @click.stop>
          <Dropdown trigger="hover" placement="bottom" @on-click="(name) => handleOpreation(name, item)">
            <Icon type="settings" size=18 />
            <DropdownMenu slot="list" v-if="hover || actived">
              <DropdownItem v-if="!item.defaultFlag" :name="TYPE.TITLE">修改名称</DropdownItem>
              <DropdownItem v-if="item.level === 0 && !isMedicine" :name="TYPE.TOP_TIME">设置限时置顶</DropdownItem>
              <DropdownItem v-if="item.level === 0" :disabled="!item.isLeaf" :name="TYPE.SET_CHILD_TAG">
                <Tooltip placement="right" content="有子分类时，不能设为二级分类" :disabled="item.isLeaf">
                  设为二级分类
                </Tooltip>
              </DropdownItem>
              <DropdownItem v-if="item.level === 0 && !item.defaultFlag" :name="TYPE.ADD_CHILD_TAG">新增二级分类</DropdownItem>
              <DropdownItem v-if="item.level > 0" :name="TYPE.SET_FIRST_TAG">设为一级分类</DropdownItem>
              <DropdownItem :name="TYPE.DELETE">删除</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </template>
      <template v-slot:node-tag="{item}">
        <div v-if="item.isUnCategorized" class="manage-tag-list-un-categorized"></div>
      </template>
    </TagTree>
    <div slot="footer">
      <Button style="width: 100%">
        <Icon type="format-list-bulleted"></Icon>
        分类模版
      </Button>
    </div>
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
import Layout from '@/views/components/product-list/layout/tag-list'
import TagTree from '@components/tag-tree'
import ManageModal from './manage-tag-modal'
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

export default {
  name: 'manage-tag-list',
  mixins: [withModules({ isMedicine: POI_IS_MEDICINE })],
  props: {
    productCount: Number,
    expandList: {
      type: Array
    },
    tagId: {
      type: Number
    },
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
      type: undefined,
      visible: false,
      editItem: null
    }
  },
  computed: {
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
    Layout
  },
  methods: {
    isShowSetting (item) {
      return item.id !== defaultTagId && !item.isUnCategorized
    },
    handleOpreation (type, item) {
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
    handleSetFirst (item) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定设为一级分类吗？</p>',
        onOk: async () => {
          try {
            const tagInfo = {
              ...item
            }
            await this.$emit('edit', tagInfo, TYPE.SET_FIRST_TAG)
            this.updateTagList(tagInfo, TYPE.SET_FIRST_TAG)
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
            await this.$emit('delete', item)
          } catch (err) {
            this.$Message.error(err.message || err)
          }
        }
      })
    },
    handleHideModal () {
      this.visible = false
    },
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
          list.splice(childIndex, 1)
          list.splice(parentIndex, 1, {
            ...parentTag,
            productCount: parentTag.productCount + tag.productCount,
            children: [...parentTag.children, { ...tagInfo, topFlag: false, timeZone: [] }]
          })
        } else if (type === TYPE.ADD_CHILD_TAG) { // 新增二级分类
          list.splice(parentIndex, 1, {
            ...parentTag,
            isLeaf: false,
            children: [
              ...(parentTag.children || []),
              { ...tagInfo, isLeaf: true, children: [], productCount: 0 }
            ]
          })
        } else {
          const newChildren = [...parentTag.children]
          const childIndex = newChildren.findIndex(tag => tag.id === tagInfo.id)
          if (type === TYPE.SET_FIRST_TAG) { // 设为一级分类
            newChildren.splice(childIndex, 1)
            list.splice(parentIndex, 1, {
              ...parentTag,
              productCount: parentTag.productCount - tagInfo.productCount,
              children: newChildren
            })
            list.push(tagInfo)
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
    async handleSubmit (tagInfo, deleteType) {
      try {
        if (this.type === TYPE.DELETE) {
          await this.$emit('delete', tagInfo, deleteType)
        } else if ([TYPE.CREATE, TYPE.ADD_CHILD_TAG].includes(this.type)) {
          const id = await this.$emit('add', tagInfo)
          tagInfo.id = id
        } else {
          await this.$emit('edit', tagInfo)
        }
        this.updateTagList(tagInfo, this.type)
        this.visible = false
      } catch (err) {
        this.$Message.error(err.message || err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.manage-tag-list {
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
