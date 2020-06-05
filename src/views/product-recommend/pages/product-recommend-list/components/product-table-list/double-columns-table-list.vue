<template>
  <div class="double-columns-table-list-container">
    <slot name="header" />
    <ul class="double-columns-table-list" ref="container">
      <template v-for="(item, index) in dataSource">
        <li :key="item.__id__" :class="{ 'disable': disableItem(item) }" v-mv="{ active: true, callback: (e) => viewHandler(e, item, index), observeOption: { root, rootMargin: '0px', threshold: 0.01 } }">
          <div v-if="disableItem(item)" class="disableMask" @click="handleDisabledClick(item)" />
          <Checkbox :value="isSelected(item)" :disabled="disableItem(item)" class="item-checkout" @on-change="handleSelectChange($event, item)" />
          <ProductInfo :product="item" />
        </li>
      </template>
    </ul>
    <div></div>
  </div>
</template>

<script>
  import ProductInfo from '../product-info'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'double-columns-table-list',
    props: {
      dataSource: {
        type: Array,
        default: () => ([])
      },
      selectedIdList: Array,
      disabled: Boolean,
      findDataIndex: Function,
      isItemNotSeletable: Function
    },
    data () {
      return {
        root: null,
        showItemIds: []
      }
    },
    components: {
      ProductInfo
    },
    methods: {
      viewHandler ({ going }, item, index) {
        try {
          if (going === 'in') {
            const val = {
              spu_id: item.id,
              st_spu_id: item.spId,
              product_label_id: (Array.isArray(item.productLabelIdList) && item.productLabelIdList.join(',')) || '',
              category1_id: item.tagList.map(i => (Array.isArray(i.children) && i.children.length > 0 && i.children[0].id) || '').join(','),
              category2_id: item.tagList.map(i => i.id).join(','),
              index: this.findDataIndex(item.__id__)
            }
            lx.mv({ bid: 'b_shangou_online_e_i9ersv67_mv', val }, 'productCube')
          }
        } catch (err) {
          console.log(err)
        }
      },
      isSelected (item) {
        return this.selectedIdList.some(id => id === item.__id__)
      },
      disableItem (item) {
        if (this.isItemNotSeletable(item)) return true
        // 已存在且不是被选中的不可点击
        return this.disabled && !this.isSelected(item)
      },
      handleDisabledClick (item) {
        this.$emit('on-tap-disabled', item)
      },
      handleSelectChange (selection, item) {
        if (selection) this.$emit('on-select', [item])
        else this.$emit('on-de-select', [item])
      }
    },
    mounted () {
      this.root = this.$refs['container']
    }
  }
</script>

<style lang="less" scoped>
  .double-columns-table-list-container {
    width: 100%;
    .double-columns-table-list {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      max-height: calc(100vh - 293px);
      overflow: scroll;
      > li {
        width: 50%;
        min-height: 128px;
        border-bottom: 1px solid #F0F2F6;
        padding: 20px 29px 0 32px;
        display: flex;
        position: relative;
        &:nth-child(n) {
          border-right: 1px solid #F0F2F6;
        }
        .item-checkout {
          margin-top: 29px;
          margin-right: 12px;
        }
        &:hover {
          background: #FFF9F0;
        }
        .disableMask {
          background: #fff;
          opacity: 0.5;
          z-index: 1;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          cursor: not-allowed;
        }
        &.disable {
          // opacity: 0.5;
        }
      }
    }
  }
</style>
