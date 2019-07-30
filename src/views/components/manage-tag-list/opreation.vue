<template>
  <Dropdown trigger="hover" placement="bottom" @on-click="handleOpreation">
    <Icon local="set" size=14 />
    <DropdownMenu slot="list" v-if="visible">
      <DropdownItem v-if="!item.defaultFlag" :name="TYPE.TITLE">修改名称</DropdownItem>
      <DropdownItem v-if="timeEditable" :name="TYPE.TOP_TIME">设置限时置顶</DropdownItem>
      <DropdownItem v-if="isFirstTag" :disabled="!item.isLeaf" :name="TYPE.SET_CHILD_TAG">
        <Tooltip placement="right" content="有子分类时，不能设为二级分类" :disabled="item.isLeaf">
          设为二级分类
        </Tooltip>
      </DropdownItem>
      <DropdownItem v-if="subAddible" :name="TYPE.ADD_CHILD_TAG">新增二级分类</DropdownItem>
      <DropdownItem v-if="!isFirstTag" :name="TYPE.SET_FIRST_TAG">设为一级分类</DropdownItem>
      <DropdownItem :name="TYPE.DELETE">删除</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
  import {
    TAG_OPERATION_TYPE as TYPE
  } from '@/data/enums/category'
  import {
    POI_IS_MEDICINE
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'

  export default {
    name: 'manage-tag-list-opreation',
    mixins: [withModules({ isMedicine: POI_IS_MEDICINE })],
    props: {
      item: Object,
      visible: Boolean
    },
    computed: {
      TYPE () {
        return TYPE
      },
      timeEditable () {
        return this.item.level === 0 && !this.isMedicine
      },
      isFirstTag () {
        return this.item.level === 0
      },
      subAddible () {
        return this.item.level === 0 && !this.item.defaultFlag
      }
    },
    methods: {
      handleOpreation (name) {
        this.$emit('on-click', name, this.item)
      }
    }
  }
</script>
