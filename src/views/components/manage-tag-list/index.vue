<template>
  <Layout :loading="loading">
    <div class="manage-tag-list-header" slot="header">
      <Button
        :disabled="loading"
        @click="handleAddTag"
        v-mc="{ bid: 'b_shangou_online_e_ctqgsxco_mc' }"
      >
        <Icon local="add" />新建分类
      </Button>
      <TooltipWithLocalStorage  v-if="showSort" keyName="CATEGORY_SORT_TIP" placement="right-start" content="管理商品和分类的排序，有助于提升销曝光和销量，请点击体验">
        <Button
          :disabled="loading"
          @click="$emit('open-sort')"
          v-mc="{ bid: 'b_shangou_online_e_lbx2k1w8_mc' }"
        >
          <Icon local="sort" />管理排序
        </Button>
      </TooltipWithLocalStorage>
    </div>
    <template slot="tip">
      <div v-if="showSmartSortTip" class="manage-tag-list-tip">智能排序开启中</div>
      <slot name="tip"></slot>
    </template>
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
      <template v-slot:node-extra="{ item, hover, actived }">
        <template v-if="isShowSetting(item)">
          <div v-show="hover || actived" @click.stop>
            <Operation :item="item" :visible="hover || actived" @on-click="handleOperation" />
          </div>
        </template>
      </template>
      <template slot="empty">
        <Empty description="还没有分类哦~" v-show="!loading">
          <Button @click="handleAddTag" type="primary">新建分类</Button>
        </Empty>
      </template>
    </TagTree>
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
    <ManageModal
      :value="visible"
      :type="type"
      :item="editItem"
      :tagList="tagList"
      :loading="submitting"
      @on-ok="handleSubmit"
      @on-cancel="handleHideModal"
    />
  </Layout>
</template>
<script>
  import Layout from '@/views/components/layout/tag-list'
  import TagTree from '@components/tag-tree'
  import TooltipWithLocalStorage from '@components/tooltip-with-localstorage'
  import ManageModal from './manage-tag-modal'
  import Operation from './operation'
  import {
    TAG_OPERATION_TYPE as TYPE,
    TAG_DELETE_TYPE as DELETE_TYPE
  } from '@/data/enums/category'
  import {
    allProductTag
  } from '@/data/constants/poi'
  import tips from './tips'
  import TagDAO from './utils'
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
      showSort: {
        type: Boolean,
        default: true
      },
      loading: Boolean,
      beforeCreate: Function,
      createCallback: {
        type: Function,
        default: (success) => success
      }
    },
    data () {
      return {
        type: undefined, // 分类操作的类别
        visible: false, // 是否展示分类操作弹框
        editItem: undefined, // 操作的item
        submitting: false
      }
    },
    computed: {
      // 是否可以开启排序
      sortable () {
        return this.loading || this.tagId === allProductTag.id || this.tagList.length <= 0
      },
      // 是否显示智能排序提示
      showSmartSortTip () {
        return this.smartSortSwitch && this.showSmartSort
      }
    },
    components: {
      TagTree,
      ManageModal,
      Layout,
      Operation,
      TooltipWithLocalStorage
    },
    methods: {
      // 全部商品和未分类 是不允许操作的
      isShowSetting (item) {
        return item.id !== allProductTag.id && !item.isUnCategorized
      },
      // 埋点
      statistics (opType, item) {
        let type = statisticsType[opType]
        if (Array.isArray(type)) {
          type = type[item.level]
        }
        lx.mc({ bid: 'b_shangou_online_e_8m7c173p_mc', val: { menu: type } })
      },
      setCallback (name) {
        const { success, error } = tips[name] || { success: '操作成功', error: '操作失败' }
        return this.createCallback((response) => {
          this.submitting = false
          this.handleHideModal()
          this.$Message.success(success)
        }, (err) => {
          this.submitting = false
          this.$Message.error(err.message || error)
        })
      },
      // 处理操作
      handleOperation (type, item) {
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
      // 新增分类
      handleAddTag () {
        const callback = () => this.handleOperation(TYPE.CREATE)
        if (this.beforeCreate) {
          this.beforeCreate(callback)
          return
        }
        callback()
      },
      // 处理设置为一级分类
      handleSetFirst (item) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确定设为一级分类吗？</p>',
          onOk: async () => {
            try {
              const newTag = TagDAO.updateTag(item, TYPE.SET_FIRST_TAG)
              this.$emit('change-level', newTag, this.setModalCallback('设置成功～', '操作失败！'))
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
              this.$emit('delete', { tag: item, type: DELETE_TYPE.TAG }, this.setCallback('delete'))
            } catch (err) {
              this.$Message.error(err.message || err)
            }
          }
        })
      },
      handleHideModal () {
        this.visible = false
      },
      handleSubmit (formInfo) {
        try {
          this.submitting = true
          if (this.type === TYPE.DELETE) {
            this.$emit('delete', { tag: this.editItem, type: formInfo.deleteType }, this.setCallback('delete'))
            return
          }
          if ([TYPE.CREATE, TYPE.ADD_CHILD_TAG].includes(this.type)) {
            const newTag = TagDAO.createTag(this.editItem, this.type, formInfo)
            this.$emit('add', newTag, this.setCallback('add'))
            return
          }
          const newTag = TagDAO.updateTag(this.editItem, this.type, formInfo)
          if ([TYPE.SET_CHILD_TAG, TYPE.SET_FIRST_TAG].includes(this.type)) {
            this.$emit('change-level', newTag, this.setCallback('changeLevel'))
            return
          }
          this.$emit('edit', newTag, this.setCallback('edit'))
        } catch (err) {
          this.$Message.error(err.message || err)
          this.submitting = false
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
        margin-right: 5px;
      }
    }
  }
  &-tip {
    color: @text-color-secondary;
    font-size: @font-size-small;
    background: rgba(248,181,0,0.10);
    line-height: 36px;
    padding-left: 20px;
  }
  &-top-flag {
    position: absolute;
    right: 0px;
    top: 0px;
  }
}
</style>
