<template>
  <div>
    <TagTree
      :value="tagId"
      :dataSource="dataSource"
      :expandList="expandList"
      @expand="$listeners.expand"
      @select="$listeners.change"
    >
      <template v-slot:node-extra="{item, hover, actived}">
        <div v-if="isShowSetting(item)" v-show="hover || actived" class="manage-tag-list-icon" @click.stop>
          <Dropdown trigger="hover" placement="bottom">
            <Icon type="settings" size=18 />
            <DropdownMenu slot="list" v-if="hover || actived">
              <DropdownItem v-if="!item.defaultFlag" @click.native="handleShowModal(item, MODEL_TYPE.TITLE)">修改名称</DropdownItem>
              <DropdownItem v-if="item.level === 0 && !isMedicine" @click.native="handleShowModal(item, MODEL_TYPE.TOP_TIME)">设置限时置顶</DropdownItem>
              <DropdownItem v-if="item.level === 0" :disabled="!item.isLeaf" @click.native="item.isLeaf && handleShowModal(item, MODEL_TYPE.SET_CHILD_TAG)">
                <Tooltip placement="right" content="有子分类时，不能设为二级分类" :disabled="item.isLeaf">
                  设为二级分类
                </Tooltip>
              </DropdownItem>
              <DropdownItem v-if="item.level === 0 && !item.defaultFlag" @click.native="handleShowModal(item, MODEL_TYPE.ADD_CHILD_TAG)">新增二级分类</DropdownItem>
              <DropdownItem v-if="item.level > 0" @click.native="handleSetFirst(item)">设为一级分类</DropdownItem>
              <DropdownItem @click.native="handleShowModal(item, MODEL_TYPE.DELETE)">删除</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </template>
      <template v-slot:node-tag="{item}">
        <div v-if="item.isUnCategorized" class="manage-tag-list-un-categorized"></div>
        <div v-if="item.topFlag" class="manage-tag-list-top-flag">
          <Tooltip placement="right" transfer>
            <span slot="content" v-html="item.timeZoneForHuman"></span>
            <CustomIcon type="top" size=28 />
          </Tooltip>
        </div>
      </template>
    </TagTree>
    <ManageModal
      :value="modelVisible"
      :type="modelType"
      :item="editItem"
      @on-ok="handleSubmit"
      @on-cancel="handleHideModal"
    />
  </div>
</template>
<script>
import TagTree from '@components/tag-tree'
import CustomIcon from '@components/custom-icon'
import ManageModal from './manage-tag-modal'
import { allProduct } from '@/data/constants/poi'
import {
  POI_IS_MEDICINE
} from '@/common/cmm'
import withModules from '@/mixins/withModules'
import state from '@/views/product-list/store'
import { MODEL_TYPE } from './constants'

export default {
  name: 'manage-tag-list',
  mixins: [withModules({ isMedicine: POI_IS_MEDICINE })],
  props: {
    showAllData: {
      type: Boolean,
      default: true
    },
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
    topLimit: {
      type: Number,
      default: 0
    },
    loading: Boolean
  },
  data () {
    return {
      modelType: undefined,
      modelVisible: false,
      editItem: null
    }
  },
  components: {
    TagTree,
    ManageModal,
    CustomIcon
  },
  computed: {
    dataSource () {
      if (this.showAllData && !this.loading) {
        const all = {
          ...allProduct,
          productCount: state.productCount
        }
        return [all, ...this.tagList]
      }
      return this.tagList
    },
    MODEL_TYPE () {
      return MODEL_TYPE
    }
  },
  methods: {
    isShowSetting (item) {
      return item.id !== allProduct.id && !item.isUnCategorized
    },
    handleShowModal (item, modelType) {
      this.modelVisible = true
      this.modelType = modelType
      this.editItem = item
    },
    handleSetFirst (item) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定设为一级分类吗？</p>',
        onOk: () => {}
      })
    },
    handleHideModal () {
      this.modelVisible = false
    },
    handleSubmit (tagInfo) {
      const list = [...this.tagList]
      debugger
      if (tagInfo.level === 0) {
        const index = list.findIndex(tag => tag.id === tagInfo.id)
        list.splice(index, 1, {
          ...list[index],
          ...tagInfo
        })
      } else {
        const parentIndex = list.findIndex(tag => tag.id === tagInfo.parentId)
        const parentTag = list[parentIndex]
        if (this.modelType === MODEL_TYPE.SET_CHILD_TAG) {
          const childIndex = list.findIndex(tag => tag.id === tagInfo.id)
          const tag = list[childIndex]
          list.splice(childIndex, 1)
          list.splice(parentIndex, 1, {
            ...parentTag,
            children: [...parentTag.children, { ...tag, ...tagInfo }]
          })
        } else if (this.modelType === MODEL_TYPE.ADD_CHILD_TAG) {
          list.splice(parentIndex, 1, {
            ...parentTag,
            isLeaf: false,
            children: [...(parentTag.children || []), { ...tagInfo, isLeaf: true, children: [] }]
          })
        } else {
          const newChildren = [...parentTag.children]
          const childIndex = newChildren.findIndex(tag => tag.id === tagInfo.id)
          newChildren.splice(childIndex, 1, {
            ...newChildren[childIndex],
            ...tagInfo
          })
          list.splice(parentIndex, 1, {
            ...parentTag,
            children: newChildren
          })
        }
      }

      if (this.modelType === MODEL_TYPE.DELETE) {
        this.$emit('delete', tagInfo)
      } else {
        this.$emit('edit', list)
      }
      this.modelVisible = false
    }
  }
}
</script>
<style lang="less">
.manage-tag-list {
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
