<template>
  <div>
    <div class="entrance">
      旧版批量功能
      <span class="line" />
      <NameLink tag="a" :to="batchPage" :params="{ routerTagId }" v-mc="{ bid: 'b_shangou_online_e_act4ikmb_mc' }">
        点击进入<Icon type="keyboard-arrow-right" size="18"/>
      </NameLink>
    </div>
    <Layout>
      <ListHeader slot="header" class="header" />
      <TagList
        slot="tag-list"
        :sorting="sorting"
        :currentTag="currentTag"
        @select="handleTagChange"
        @open-sort="handleStartSort"
      />
      <ProductList
        slot="product-list"
        :sorting="sorting"
        :tagId="currentTag.id"
      />
      <Footer
        slot="footer"
        v-if="sorting"
        :btnTexts="['保存并同步', '仅保存', '取消']"
        :btnTypes="['primary', 'primary', 'default']"
        @on-click="handleSubmitSort"
      />
    </Layout>
    <PoiSelectDrawer
      title="选择目标门店"
      v-model="showPoiSelect"
      @on-confirm="handlePoiSubmit"
    />
  </div>
</template>

<script>
  import NameLink from '@components/link/named-link'
  import ListHeader from './components/list-header/index'
  import TagList from './components/tag-list'
  import ProductList from './components/product-table-list'
  import Layout from '@/views/components/layout/product-list'
  import Footer from '@components/sticky-footer'
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import batchCreatePage from '@sgfe/eproduct/navigator/pages/batch/create'
  import {
    fetchSubmitSaveOrder,
    fetchSubmitSaveOrderWithSync
  } from '@/data/repos/merchantProduct'
  import {
    allProductTag
  } from '@/data/constants/poi'
  import store from './store'

  export default {
    name: 'merchant-product-list',
    data () {
      return {
        sorting: false, // 排序模式中
        currentTag: allProductTag, // 当前的tag
        showPoiSelect: false
      }
    },
    computed: {
      batchPage () {
        return batchCreatePage.name
      },
      routerTagId () {
        return this.$route.query.routerTagId || '21'
      }
    },
    components: {
      NameLink,
      Layout,
      ListHeader,
      TagList,
      ProductList,
      Footer,
      PoiSelectDrawer
    },
    methods: {
      handleTagChange (tag) {
        this.currentTag = tag
      },
      handleStartSort () {
        this.sorting = true
      },
      async handlePoiSubmit (idList) {
        const { sortTagList, productSort } = store
        await fetchSubmitSaveOrderWithSync(sortTagList, productSort, idList.map(({ id }) => id))
      },
      async handleSubmitSort (index) {
        // index对应 ['保存并同步', '仅保存', '取消']
        // 取消
        if (index === 2) {
          this.sorting = false
          return
        }
        // 保存并同步
        if (index === 0) {
          this.showPoiSelect = true
          return
        }
        // 仅保存
        if (index === 1) {
          const { sortTagList, productSort } = store
          await fetchSubmitSaveOrder(sortTagList, productSort)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .header {
    margin-bottom: 10px;
  }
  .entrance {
    text-align: right;
    color: @text-color-secondary;
    margin-top: 10px;
    margin-bottom: 10px;
    .line {
      display: inline-block;
      margin-left: 10px;
      margin-right: 10px;
      width: 1px;
      background: #E5E5E5;
      height: 14px;
      vertical-align: middle;
    }
  }
</style>
