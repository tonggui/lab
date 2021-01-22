<template>
  <div class="double-columns-table-list-container">
    <slot name="header" />
    <ul class="double-columns-table-list" ref="container" v-if="dataSource.length">
      <template v-for="(item) in dataSource">
        <li :key="item.id" :class="{ 'disable': disableItem(item) }">
          <div v-if="disableItem(item)" class="disableMask" @click="handleDisabledClick(item)" />
          <Checkbox :value="isSelected(item)" :disabled="disableItem(item)" class="item-checkout" @on-change="handleSelectChange($event, item)" />
          <slot name="item" :product="item"></slot>
        </li>
      </template>
    </ul>
    <div class="double-columns-table-list-empty" v-else>
      当前页面推荐商品已全部创建
    </div>
  </div>
</template>

<script>
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'double-columns-table-list',
    props: {
      dataSource: {
        type: Array,
        default: () => ([])
      },
      selectedList: Array,
      disabled: Boolean,
      findDataIndex: Function,
      isItemNotSelectable: Function
    },
    data () {
      return {
        root: null
      }
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
              index: this.findDataIndex(item.id)
            }
            lx.mv({ bid: 'b_shangou_online_e_i9ersv67_mv', val }, 'productCube')
          }
        } catch (err) {
          console.log(err)
        }
      },
      isSelected (item) {
        return this.selectedList.some(it => it.id === item.id)
      },
      disableItem (item) {
        if (this.isItemNotSelectable && this.isItemNotSelectable(item, this.selectedList, this.dataSource)) return true
        // 组包医药规格中upcCode都没有值，则不可进行选择
        const activeSkuList = item.skuList.filter(item => item.upcCode)
        if (!activeSkuList.length) return true
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
    height: 100%;
    .double-columns-table-list {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      max-height: 100%;
      // overflow: auto;
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
      }
      &-empty {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
