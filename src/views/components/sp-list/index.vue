<template>
  <Tabs name="sp-list" v-model="tab" :animated="false" class="sp-list" :class="{ 'no-label': outsideMode }">
    <TabPane tab="sp-list" label="区域内热卖" name="hot" v-if="showTopSale">
      <SpTable
        hot
        ref="hot"
        v-onlyone="tab === 'hot'"
        :autoLoad="!outsideMode"
        :height="tableHeight"
        :footerFixed="footerFixed"
        :fetch-data="fetchGetHotSpList"
        :fetch-category="fetchGetHotCategory"
        :multiple="multiple"
        @on-select-product="handleProductSelect"
      >
        <div v-if="outsideMode" slot="search" />
      </SpTable>
    </TabPane>
    <TabPane tab="sp-list" label="全部商品" name="all">
      <SpTable
        ref="all"
        v-onlyone="tab === 'all'"
        :autoLoad="!outsideMode"
        :height="tableHeight"
        :footerFixed="footerFixed"
        :fetch-data="fetchGetSpList"
        :fetch-category="fetchGetCategoryListByParentId"
        :multiple="multiple"
        @on-select-product="handleProductSelect"
      >
        <div v-if="outsideMode" slot="search" />
      </SpTable>
    </TabPane>
    <Input
      v-if="outsideMode"
      class="extra-search"
      slot="extra"
      search
      enter-button
      v-model="keywords"
      @on-change="handleSearch"
      placeholder="输入商品条码/名称/品牌名查找"
      @on-search="triggerSearch"
    />
  </Tabs>
</template>

<script>
  import SpTable from './sp-table'
  import onlyone from '@/directives/onlyone'
  import withOnlyone from '@/hoc/withOnlyone'
  import { fetchGetHotSpList, fetchGetSpList } from '@/data/repos/standardProduct'
  import { fetchGetHotCategory, fetchGetCategoryListByParentId } from '@/data/repos/category'
  import storage, { KEYS } from '@/common/local-storage'
  import { getPoiId } from '@/common/constants'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'sp-list',
    components: {
      SpTable: withOnlyone(SpTable)
    },
    directives: { onlyone },
    props: {
      modal: Boolean,
      footerFixed: Boolean,
      multiple: Boolean,
      showTopSale: {
        type: Boolean,
        default: false
      },
      defaultSelectedTab: String,
      searchWords: String,
      // 搜索的位置，是否为在列表外部控制搜索
      outsideMode: {
        type: Boolean,
        default: () => false
      }
    },
    data () {
      return {
        // 如果存在默认选择Tab，则忽略缓存逻辑
        tab: this.defaultSelectedTab || (
          storage[KEYS.SP_LIST_TAB] === 1 ? 'all' : 'hot'
        ),
        keywords: '',
        isInput: false
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
        if (this.outsideMode) {
          this.$nextTick(() => this.triggerSearch())
        }
      },
      searchWords: {
        immediate: true,
        handler () {
          this.keywords = this.searchWords
          if (this.outsideMode) {
            this.$nextTick(() => this.triggerSearch(true))
          }
        }
      }
    },
    methods: {
      fetchGetHotSpList,
      fetchGetSpList,
      fetchGetHotCategory,
      fetchGetCategoryListByParentId,
      handleProductSelect (product) {
        this.$emit('on-select-product', product)
      },
      triggerSearch (reset = false) {
        if (this.$refs[this.tab]) {
          this.$refs[this.tab].search(this.keywords, reset)
        }
      },
      handleSearch (val) {
        let value = val.target.value
        if (value && !this.isInput) {
          this.isInput = true
          lx.mv({
            bid: 'b_shangou_online_e_xm1bi3fq_mv',
            val: {
              poi_id: getPoiId() || 0
            }
          })
        }
        if (!value) this.isInput = false
      }
    }
  }
</script>

<style lang="less" scoped>
.sp-list {
  /deep/ .boo-tabs-tab {
    padding-left: 0;
  }
  /deep/ .boo-tabs-ink-bar {
    margin-left: -10px;
  }
}
.no-label {
  /deep/ .sp-table-container .section {
    .label {
      display: none;
    }

    .content {
      margin-left: 0;
    }
  }
}
.extra-search {
  width: 310px;
}
</style>
