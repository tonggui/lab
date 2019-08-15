<template>
  <div>
    <Draggable v-if="!isEmpty" handle='.handle' v-model="list" :animation="200" ghostClass="drag-sort-list-ghost" class="drag-sort-list">
      <transition-group name="list-vertical-animation" class="drag-sort-list">
        <Item v-for="(product, index) in dataSource" :key="product.id" :index="startIndex + index" :product="product">
          <div slot="item" class="drag-sort-list-sort">
            <div class="drag-sort-list-edit">
              <span>排序</span>
              <EditInput :value="startIndex + index" :onConfirm="(value) => handleInputOrder(index, value)">
                <template v-slot:display="{ edit }">
                  <Input :value="startIndex + index" size="small" @on-focus="handleInputFocus(edit)" />
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
    <Page v-if="pagination" v-bind="pagination" class="drag-sort-list-page" />
  </div>
</template>
<script>
  import Draggable from 'vuedraggable'
  import EditInput from '@components/edit-input/edit-input'
  import Item from './list-item'
  import lx from '@/common/lx/lxReport'

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
      },
      list: {
        get () {
          return this.dataSource.slice()
        },
        set (list) {
          lx.mc({ bid: 'b_shangou_online_e_0t5jzjvk_mc' })
          this.$emit('change-list', list)
        }
      }
    },
    methods: {
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
          this.$Message.error(`只能输入1-${this.maxOrder}直接的数`)
          return
        }
        const list = [...this.dataSource]
        const node = list[index]
        list.splice(index, 1)
        list.splice(value - 1, 0, node)
        this.$emit('change-list', list)
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
    /deep/ .sg-edit {
      .editing {
        box-shadow: none;
        border: 1px solid @border-color-base;
      }
    }
    input {
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
