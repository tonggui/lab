<template>
  <div class="double-columns-table-list-container">
    <slot name="header" />
    <ul class="double-columns-table-list" ref="container" v-if="dataSource.length" @scroll="handleScroll">
      <template v-for="(item, index) in dataSource">
        <li :key="item.__id__" :class="{ 'disable': disableItem(item) }" v-ms="{ active: true, callback: (e) => viewHandler(e, item, index), observeOption: { root, rootMargin: '0px', threshold: 0.01 } }">
          <div v-if="disableItem(item)" class="disableMask" @click="handleDisabledClick(item)" />
          <Checkbox :value="isSelected(item)" :disabled="disableItem(item)" class="item-checkout" @on-change="handleSelectChange($event, item)" />
          <ProductInfo :product="item" :scopeFlag="true" :isSelected="isSelected(item)" :currentScope="currentScope" :rowScopeList ="rowScopeList"/>
        </li>
      </template>
    </ul>
    <div class="double-columns-table-list-empty" v-else>
      此分类暂无待创建商品，请切换至其他分类继续创建
    </div>
  </div>
</template>

<script>
  import ProductInfo from '../product-info'
  import { judgeArray } from '../../../../utils'
  import { helper } from '@/views/merchant/cube/store'
  const { mapState } = helper('multiCubeList')
  export default {
    name: 'double-columns-table-list',
    props: {
      dataSource: {
        type: Array,
        default: () => ([])
      },
      selectedIdList: Array,
      findDataIndex: Function,
      findDataRealIndex: Function,
      isItemNotSeletable: Function
    },
    data () {
      return {
        root: null,
        actives: []
      }
    },
    components: {
      ProductInfo
    },
    computed: {
      ...mapState({
        currentScope: 'currentScope',
        rowScopeList: 'rowScopeList'
      })
    },
    methods: {
      viewHandler ({ going }, item, index) {
        try {
          if (going === 'in' && !this.actives.includes(item.__id__)) {
            this.actives.push(item.__id__)
          }
        } catch (err) {
          console.log(err)
        }
      },
      isSelected (item) {
        return this.selectedIdList.some(ele => ele.__id__ === item.__id__)
      },
      disableItem (item) {
        if (this.isItemNotSeletable(item)) return true
        // 已存在且不是被选中的不可点击
        let isContain = judgeArray(item.relatedPoiIds, item.totalPoiIds)
        return isContain && !this.isSelected(item)
      },
      handleDisabledClick (item) {
        this.$emit('on-tap-disabled', item)
      },
      handleSelectChange (selection, item) {
        console.log(item)
        if (selection) this.$emit('on-select', [item])
        else this.$emit('on-de-select', [item])
      },
      handleScroll () {
        if (!this.scroll) {
          this.scroll = true
        }
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
      overflow: auto;
      > li {
        width: 50%;
        min-height: 128px;
        border-bottom: 1px solid #F0F2F6;
        padding: 20px 29px 22px 32px;
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
          z-index: 0;
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
