<template>
  <div>
    <Draggable v-if="!isEmpty" handle='.handle' :value="dataSource" :animation="200" ghostClass="drag-sort-list-ghost" class="drag-sort-list" @end="handleSortEnd">
      <transition-group name="" class="drag-sort-list">
        <Item v-for="(product, index) in dataSource" :key="product.id" :index="startIndex + index" :product="product">
          <div slot="item" class="drag-sort-list-sort">
            <div class="drag-sort-list-edit">
              <span>排序</span>
              <EditInput size="small" :value="startIndex + index" :onConfirm="(value) => handleInputOrder(index, value)">
                <template v-slot:display="{ edit }">
                  <Input class="drag-sort-list-edit-input" :value="startIndex + index" size="small" @on-focus="handleInputFocus(edit)" />
                </template>
              </EditInput>
            </div>
            <div class="drag-sort-list-op handle">
              <span class="drag-sort-list-op-icon">
                <Icon local="drag" size="18" />
              </span>
              <span class="drag-sort-list-op-text">拖拽</span>
            </div>
          </div>
        </Item>
      </transition-group>
    </Draggable>
    <ProductEmpty v-else class="drag-sort-list-empty"/>
    <Pagination v-if="pagination" :pagination="pagination" class="drag-sort-list-page" @on-change="handlePageChange" />
  </div>
</template>
<script>
  import Draggable from 'vuedraggable'
  import EditInput from '@components/edit-input/edit-input'
  import Item from './list-item'
  import lx from '@/common/lx/lxReport'
  import {
    swapArrayByIndex
  } from '@/common/arrayUtils'

  export default {
    name: 'drag-sort-product-list',
    props: {
      dataSource: Array,
      pagination: Object,
      loading: Boolean,
      maxOrder: Number
    },
    components: {
      Draggable,
      EditInput,
      Item
    },
    computed: {
      isEmpty () {
        return this.dataSource.length <= 0
      },
      startIndex () {
        if (!this.pagination) {
          return 0
        }
        const { pageSize, current } = this.pagination
        return (current - 1) * pageSize + 1
      }
    },
    methods: {
      triggerChange (productList, product, newIndex) {
        this.$emit('change', productList, product, { newIndex })
      },
      handleSortEnd ({ oldIndex, newIndex }) {
        lx.mc({ bid: 'b_shangou_online_e_0t5jzjvk_mc' })
        const list = this.dataSource.slice()
        // 互换位置
        const dataList = swapArrayByIndex(list, oldIndex, newIndex)
        this.triggerChange(dataList, dataList[newIndex], this.startIndex + newIndex)
      },
      handleInputFocus (edit) {
        lx.mc({ bid: 'b_shangou_online_e_eloe8o0g_mc' })
        edit && edit(true)
      },
      handleInputOrder (index, value) {
        if (!/\d+/.test(value)) {
          this.$Message.error('只能输入正整数')
          return
        }
        const num = Number(value)
        if (num > this.maxOrder || num <= 0) {
          this.$Message.error(`只能输入1-${this.maxOrder}之间的数`)
          return
        }
        /**
         * 1. 删除当前index的节点
         * 2. 判断输入的位置 是否超出本页的操作范围（当前只有本页的数据）
         * 本页范围 (current - 1) * pageSize ~ current * pageSize - 1
         * 3. 如果 不超出本页范围 修改 list
         * 4. 触发change
         */
        const list = [...this.dataSource]
        const node = list[index]
        list.splice(index, 1)
        // 置换出当前页的顺序
        // 可能是负数，可能超出本页
        const currentPagePosition = value - this.startIndex
        // 排序范围还在本页的 直接处理
        if (currentPagePosition > 0 && currentPagePosition < list.length) {
          list.splice(currentPagePosition, 0, node)
        }
        this.triggerChange(list, node, value)
      },
      handlePageChange (page) {
        this.$emit('page-change', page)
      }
    }
  }
</script>
<style lang="less">
.drag-sort-list {
  display: table;
  width: 100%;
  box-sizing: border-box;
  &-page {
    text-align: right;
    padding: 30px 20px;
  }
  &-sort {
    display: flex;
    align-items: center;
  }
  &-edit {
    margin-right: 20px;
    width: 120px;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    &-input {
      width: 56px;
    }
    > span {
      margin-right: 10px;
      color: @text-helper-color;
    }
  }
  &-op {
    color: @highlight-color;
    line-height: 1px;
    white-space: nowrap;
    cursor: move;
    &-text {
      margin-left: 5px;
    }
    &-icon i {
      margin-top: -2px;
    }
  }
  &-empty {
    padding-top: 150px;
  }
}
</style>
