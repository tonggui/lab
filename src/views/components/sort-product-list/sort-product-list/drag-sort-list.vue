<template>
  <div>
    <Draggable handle='.handle' v-model="list" :animation="200" ghostClass="drag-sort-list-ghost" class="drag-sort-list">
      <transition-group name="list-vertical-animation" class="drag-sort-list">
        <Item v-for="(product, index) in dataSource" :key="product.id" :index="startIndex + index" :product="product">
          <div slot="item" class="drag-sort-list-sort">
            <div class="drag-sort-list-input">
              <span>排序</span>
              <EditInput :value="startIndex + index" :onConfirm="(value) => handleInputOrder(index, value)">
                <template v-slot:display="{ edit }">
                  <Input :value="startIndex + index" size="small" @on-focus="handleInputFocus(edit)" />
                </template>
              </EditInput>
            </div>
            <div class="drag-sort-list-op handle">
              <span class="drag-sort-list-icon">
                <Icon type="unfold-more" size="14" />
              </span>
              <span>拖拽</span>
            </div>
          </div>
        </Item>
      </transition-group>
    </Draggable>
    <Page v-bind="pagination" class="drag-sort-list-page" />
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
      startIndex () {
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
  &-page {
    text-align: right;
    padding: 30px 20px;
  }
  &-sort {
    display: flex;
    align-items: center;
  }
  &-input {
    margin-right: 20px;
    width: 120px;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    > span {
      margin-right: 10px;
    }
  }
  &-op {
    color: @highlight-color;
    line-height: 1px;
    cursor: move;
  }
  &-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 6px;
    border: 1px solid rgba(248,152,0,0.30);
    border-radius: 100%;
    text-align: center;
    i {
      transform: scale(.8);
    }
  }
}
</style>
