<template>
  <Dropdown trigger="hover" placement="bottom" @on-click="handleOperation">
    <span class="manage-tag-list-icon" :class="{ disabled }"><Icon local="set" size=14 /></span>
    <DropdownMenu slot="list" v-if="!disabled && visible">
      <template v-for="op in operationList">
        <DropdownItem :key="op.name" v-if="op.show && !['新增二级分类', '修改名称', '设为二级分类', '设置限时置顶', '设为一级分类', '删除'].includes(op.label)" :name="op.name" :disabled="op.disabled">
          <Tooltip v-if="op.tooltip" v-bind="op.tooltip">
            {{ op.label }}
          </Tooltip>
          <template v-else>{{ op.label }}</template>
        </DropdownItem>
        <PermissionBtn
          placement="left"
          component="DropdownItem"
          :btn-type="op.label === '新增二级分类' ? 'CREATE_CLASSIFICATION' : op.label === '删除' ? 'DEL_CLASSIFICATION' : 'MODIFY_CLASSIFICATION'"
          :need-permission="needPermission"
          :key="op.name"
          v-else-if="op.show"
          :name="op.name"
          :disabled="op.disabled"
          style="width: 100%"
        >
          <Tooltip v-if="op.tooltip" v-bind="op.tooltip">
            {{ op.label }}
          </Tooltip>
          <template v-else>{{ op.label }}</template>
        </PermissionBtn>
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
  import {
    TAG_OPERATION_TYPE as TYPE
  } from '@/data/enums/category'
  import {
    allProductTag
  } from '@/data/constants/poi'
  import lx from '@/common/lx/lxReport'
  import PermissionBtn from '@/views/components/permission-bth/index'

  export default {
    name: 'manage-tag-list-operation',
    components: { PermissionBtn },
    props: {
      item: Object,
      visible: Boolean,
      supportTopTime: Boolean,
      disabled: Boolean,
      needPermission: Boolean
    },
    computed: {
      operationList () {
        return [{
          name: TYPE.TITLE,
          label: '修改名称',
          show: true,
          // 特殊分类不允许操作
          disabled: this.isSpecialItem,
          statistics: { menu: this.isFirstTag ? 'EDIT_FIRST' : 'EDIT_SECOND' }
        }, {
          name: TYPE.TOP_TIME,
          label: '设置限时置顶',
          // 只有支持设置限时置顶 && 一级分类展示
          show: this.isFirstTag && this.supportTopTime,
          // 特殊分类不允许操作
          disabled: this.isSpecialItem,
          statistics: { menu: 'SET_SELLTIME' }
        }, {
          name: TYPE.SET_CHILD_TAG,
          label: '设为二级分类',
          // 只有一级分类展示
          show: this.isFirstTag,
          // 特殊分类和非叶子节点不允许操作
          disabled: this.isSpecialItem || !this.item.isLeaf,
          tooltip: {
            placement: 'right',
            content: '有子分类时，不能设为二级分类',
            disabled: this.item.isLeaf
          },
          statistics: { menu: 'TO_SECOND' }
        }, {
          name: TYPE.ADD_CHILD_TAG,
          label: '新增二级分类',
          // 只有一级分类展示
          show: this.isFirstTag,
          // 特殊分类不允许操作
          disabled: this.isSpecialItem,
          statistics: { menu: 'NEW_SECOND' }
        }, {
          name: TYPE.SET_FIRST_TAG,
          label: '设为一级分类',
          // 只有二级分类才展示
          show: !this.isFirstTag,
          // 特殊分类不允许操作
          disabled: this.isSpecialItem,
          statistics: { menu: 'TO_FIRST' }
        }, {
          name: TYPE.DELETE,
          label: '删除',
          show: true,
          // 全部商品 分类不允许此操作
          disabled: this.item.id === allProductTag.id,
          statistics: { menu: this.isFirstTag ? 'DEL_FIRST' : 'DEL_SECOND' }
        }]
      },
      isSpecialItem () {
        // 全部商品和未分类 属于特殊分类
        return this.item.id === allProductTag.id || this.item.isUnCategorized
      },
      isFirstTag () {
        return this.item.level === 0
      }
    },
    methods: {
      handleOperation (name) {
        const op = this.operationList.find(o => o.name === name)
        lx.mc({ bid: 'b_shangou_online_e_8m7c173p_mc', val: op.statistics })
        if (op.show && !op.disabled) {
          this.$emit('on-click', name, this.item)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .manage-tag-list-icon {
    color: @text-color-secondary;
    display: flex;
    > i {
      z-index: 1;
    }
    &.disabled {
      color: @disabled-color;
      /deep/ .boo-icon {
        cursor: not-allowed;
      }
    }
  }
</style>
