<template>
  <div class="double-columns-table-list-container">
    <slot name="header" />
    <ul class="double-columns-table-list" v-if="dataSource.length">
      <template v-for="item in dataSource">
        <li :key="item.__id__" :class="{ 'disable': disableItem(item) }">
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
  import { isProductValid } from '../../../../utils'
  import ProductInfo from '../product-info'
  export default {
    name: 'double-columns-table-list',
    props: {
      dataSource: {
        type: Array,
        default: () => ([])
      },
      selectedIdList: Array,
      disabled: Boolean
    },
    components: {
      ProductInfo
    },
    methods: {
      isSelected (item) {
        return this.selectedIdList.some(id => id === item.__id__)
      },
      disableItem (item) {
        // 已存在且不是被选中的不可点击
        return !!isProductValid(item) || ((this.disabled || !!item.id) && !this.isSelected(item))
      },
      handleDisabledClick (item) {
        // 未存在的商品 disabled的时候点击触发溢出提示
        if (isProductValid(item)) {
          this.$emit('on-click-invalid-product', isProductValid(item), item.qualificationTip)
        } else if (!item.id) {
          this.$emit('on-exceed-max')
        }
      },
      handleSelectChange (selection, item) {
        if (selection) this.$emit('on-select', [item])
        else this.$emit('on-de-select', [item])
      }
    }
  }
</script>

<style lang="less" scoped>
  .double-columns-table-list-container {
    width: 100%;
    // height: calc(100vh - 310px);
    .double-columns-table-list {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      height: calc(100vh - 310px);
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
