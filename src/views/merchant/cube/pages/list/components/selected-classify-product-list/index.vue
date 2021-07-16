<template>
  <div class="selected-classify-product-list">
    <h2 class="header" v-if="activeItemList.length > 0">{{title}}({{activeItemList.length}})</h2>
    <ul class="product-list">
      <li v-for="(item, index) in activeItemList" :key="item.__id__">
        <ProductInfo style="width: 60%;" :hotInfoDisabled="false" :product="item" :isSelected="true" :itemscope="false" :currentScope="currentScope" :rowScopeList ="rowScopeList"/>
        <Divider type="vertical" />
        <PoiSelect style="width: 25%;" :productId="item.id" :totalPoiIds="item.totalPoiIds" v-model="activeItemList[index].addedPoiIds" :disabledIds = "activeItemList[index].relatedPoiIds" />
        <Divider type="vertical" />
        <a href="" style="width: 15%;" @click.prevent="$emit('on-unselect', title, item)">取消选择</a>
      </li>
    </ul>
  </div>
</template>

<script>
  import ProductInfo from '../product-info'
  import PoiSelect from '../poi-select'
  import { helper } from '@/views/merchant/cube/store'
  const { mapState } = helper('multiCubeList')
  export default {
    name: 'selected-classify-product-list',
    props: {
      title: {
        type: String,
        default: ''
      },
      children: {
        type: Array,
        default: () => ([])
      },
      curScopePoiIdMap: {
        type: Object,
        default: () => ({})
      }
    },
    components: {
      ProductInfo,
      PoiSelect
    },
    computed: {
      ...mapState({
        currentScope: 'currentScope',
        rowScopeList: 'rowScopeList'
      }),
      activeItemList () {
        return this.children.filter((item) => {
          return this.curScopePoiIdMap[item.__id__] === 1
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .selected-classify-product-list {
    list-style: none;
    width: 591px;
    justify-content:center;
    .header {
      height: 42px;
      background: #F7F8FA;
      border: 1px solid #E9EAF2;
      border-top: none;
      font-size: 14px;
      color: #A2A4B3;
      letter-spacing: 0;
      line-height: 42px;
      padding-left: 14px;
      font-family: PingFangSC-Regular;
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .product-list {
      background: #FFFFFF;
      list-style: none;
      .boo-divider, .boo-divider-vertical {
        display: inline-block;
        height: 9.2em;
        margin: 0;
      }
      > li {
        min-height: 112px;
        border: 1px solid #E9EAF2;
        border-top: none;
        display: flex;
        align-items: center;
        justify-content:center;
        text-align: center;
        padding-left: 17px;
        > a {
          flex-shrink: 0;
          font-size: 14px;
          color: #676A78;
          text-align: center;
          line-height: 14px;
          text-decoration: none;
        }
      }
    }
  }
</style>
