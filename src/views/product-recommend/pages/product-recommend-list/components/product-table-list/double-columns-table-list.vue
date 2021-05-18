<template>
  <div class="double-columns-table-list-container">
    <slot name="header" />
    <ul class="double-columns-table-list" ref="container" v-if="dataSource.length" @scroll="handleScroll">
      <template v-for="(item, index) in dataSource">
        <li :key="item.__id__" :class="{ 'disable': disableItem(item) }" v-ms="{ active: true, callback: (e) => viewHandler(e, item, index), observeOption: { root, rootMargin: '0px', threshold: 1 } }">
          <div v-if="disableItem(item)" class="disableMask" @click="handleDisabledClick(item)" />
          <Checkbox :value="isSelected(item)" :disabled="disableItem(item)" class="item-checkout" @on-change="handleSelectChange($event, item)" />
          <ProductInfo :product="item" />
        </li>
      </template>
    </ul>
    <div class="double-columns-table-list-empty" v-else>
      当前页面推荐商品已全部创建
    </div>
  </div>
</template>

<script>
  import ProductInfo from '../product-info'
  import lx from '@/common/lx/lxReport'
  import { getLxParams } from '../../../../utils'

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
    methods: {
      viewHandler ({ going }, item, index) {
        try {
          if (going === 'in' && !this.actives.includes(item.__id__)) {
            const val = {
              // spu_id: item.id,
              // st_spu_id: item.spId,
              // product_label_id: (Array.isArray(item.productLabelIdList) && item.productLabelIdList.join(',')) || '',
              // category1_id: item.tagList.map(i => (Array.isArray(i.children) && i.children.length > 0 && i.children[0].id) || '').join(','),
              // category2_id: item.tagList.map(i => i.id).join(','),
              // ...this.getCategoryIds(item),
              index: this.findDataRealIndex(item.__id__),
              ...getLxParams(item)
              // page_source: window.page_source
            }
            lx.mv({ bid: 'b_shangou_online_e_i9ersv67_mv', val }, 'productCube')
            this.actives.push(item.__id__)
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
        lx.mc({
          bid: 'b_shangou_online_e_tfdxgmdo_mc',
          val: {
            index: this.findDataRealIndex(item.__id__),
            select_time: +new Date(),
            op_res: selection ? 1 : 0,
            // page_source: window.page_source || '',
            // category2_id: item.tagList.map(i => (Array.isArray(i.children) && i.children.length > 0 && i.children[0].id) || '').join(','),
            // category1_id: item.tagList.map(i => i.id).join(','),
            ...getLxParams(item)
            // product_label_id: '', // TODO
            // st_spu_id: item.spId
          }
        })

        if (selection) this.$emit('on-select', [item])
        else this.$emit('on-de-select', [item])
      },
      handleScroll () {
        if (!this.scroll) {
          lx.mv({
            bid: 'b_shangou_online_e_8mtx2htv_mv',
            val: {
              page_source: window.page_source || ''
            }
          })
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
