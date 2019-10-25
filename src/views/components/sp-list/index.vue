<template>
  <Tabs name="sp-list" v-model="tab" :animated="false">
    <TabPane tab="sp-list" label="区域内热卖" name="hot" v-if="showTopSale">
      <SpTable
        hot
        v-onlyone="tab === 'hot'"
        :height="tableHeight"
        :fetch-data="fetchGetHotSpList"
        :fetch-category="fetchGetHotCategory"
        @on-select-product="handleProductSelect"
      />
    </TabPane>
    <TabPane tab="sp-list" label="全部商品" name="all">
      <SpTable
        v-onlyone="tab === 'all'"
        :height="tableHeight"
        :fetch-data="fetchGetSpList"
        :fetch-category="fetchGetCategoryListByParentId"
        @on-select-product="handleProductSelect"
      />
    </TabPane>
  </Tabs>
</template>

<script>
  import SpTable from './sp-table'
  import onlyone from '@/directives/onlyone'
  import withOnlyone from '@/hoc/withOnlyone'
  import { fetchGetHotSpList, fetchGetSpList } from '@/data/repos/standardProduct'
  import { fetchGetHotCategory, fetchGetCategoryListByParentId } from '@/data/repos/category'
  import storage, { KEYS } from '@/common/local-storage'

  export default {
    name: 'sp-list',
    components: {
      SpTable: withOnlyone(SpTable)
    },
    directives: { onlyone },
    props: {
      modal: Boolean,
      showTopSale: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        // tab: !this.showTopSale ? 'all' : 'hot'
        tab: storage[KEYS.SP_LIST_TAB] === 1 ? 'all' : 'hot'
      }
    },
    computed: {
      tableHeight () {
        return this.modal ? 360 : undefined
      }
    },
    watch: {
      showTopSale: {
        immediate: true,
        handler (v) {
          // 不支持区域内热卖的话则默认选中全部
          if (!v) {
            this.tab = 'all'
          }
        }
      },
      tab (v) {
        storage[KEYS.SP_LIST_TAB] = v === 'all' ? 1 : 2
      }
    },
    methods: {
      fetchGetHotSpList,
      fetchGetSpList,
      fetchGetHotCategory,
      fetchGetCategoryListByParentId,
      handleProductSelect (product) {
        this.$emit('on-select-product', product)
      }
    }
  }
</script>
