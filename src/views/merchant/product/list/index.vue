<template>
  <div>
    <div class="entrance">
      <div>商品管理</div>
      <div>
        旧版批量功能
        <span class="line" />
        <NamedLink tag="a" :name="batchPage" :query="{ routerTagId }" v-mc="{ bid: 'b_shangou_online_e_act4ikmb_mc' }">
          点击进入<Icon type="keyboard-arrow-right" size="18"/>
        </NamedLink>
      </div>
    </div>
    <Layout>
      <ListHeader slot="header" class="header" />
      <TagList
        ref="tagList"
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
        @delete="handleDeleteProduct"
      />
      <Footer
        v-if="sorting"
        class="footer"
        slot="footer"
        :btnTexts="['保存并同步', '仅保存', '取消']"
        :btnTypes="['primary', 'primary', 'default']"
        :bid="['b_shangou_online_e_20899tms_mc', 'b_shangou_online_e_o4kxbqev_mc', 'b_shangou_online_e_k947pzmy_mc']"
        @on-click="handleSubmitSort"
      />
    </Layout>
    <PoiSelectDrawer
      title="选择目标门店"
      v-model="showPoiSelect"
      :queryPoiList="fetchGetPoiList"
      @on-confirm="handlePoiSubmit"
    />
  </div>
</template>

<script>
  import NamedLink from '@components/link/named-link'
  import BatchPage from '@sgfe/eproduct/navigator/pages/batch/create'
  import ListHeader from './components/list-header/index'
  import TagList from './components/tag-list'
  import ProductList from './components/product-table-list'
  import Layout from '@/views/components/layout/product-list-page'
  import Footer from '@components/sticky-footer'
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import {
    fetchSubmitSaveOrder,
    fetchSubmitSaveOrderWithSync
  } from '@/data/repos/merchantProduct'
  import {
    fetchGetPoiList
  } from '@/data/repos/merchantPoi'
  import {
    allProductTag
  } from '@/data/constants/poi'
  import { scrollToTop } from '@/common/domUtils'
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
        return BatchPage.name
      },
      routerTagId () {
        return this.$route.query.routerTagId || '21'
      }
    },
    components: {
      NamedLink,
      Layout,
      ListHeader,
      TagList,
      ProductList,
      Footer,
      PoiSelectDrawer
    },
    methods: {
      fetchGetPoiList (params) {
        return fetchGetPoiList(params.name, params.pagination, params.city)
      },
      handleTagChange (tag) {
        this.currentTag = tag
      },
      handleStartSort () {
        this.sorting = true
      },
      handleDeleteProduct () {
        this.$refs.tagList && this.$refs.tagList.getData()
      },
      async handlePoiSubmit (idList) {
        try {
          const { sortTagList, productSort } = store
          await fetchSubmitSaveOrderWithSync(sortTagList, productSort, idList.map(({ id }) => id))
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
        }
      },
      async handleSubmitSort (index) {
        // index对应 ['保存并同步', '仅保存', '取消']
        // 取消
        if (index === 2) {
          this.sorting = false
          scrollToTop()
          return
        }
        // 保存并同步
        if (index === 0) {
          this.showPoiSelect = true
          return
        }
        // 仅保存
        if (index === 1) {
          try {
            const { sortTagList, productSort } = store
            await fetchSubmitSaveOrder(sortTagList, productSort)
          } catch (err) {
            console.error(err)
            this.$Message.error(err.message || err)
          }
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
    display: flex;
    justify-content: space-between;
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
  .footer {
    /deep/ .sticky {
      z-index: 10;
    }
  }
</style>
