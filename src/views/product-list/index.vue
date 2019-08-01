<template>
  <Layout>
    <ListHeader slot="header" class="header" />
    <TagList
      slot="tag-list"
      :sorting="sorting"
      :currentTag="currentTag"
      @select="handleTagChange"
      @open-sort="handleStartSort"
      ref="tagList"
    />
    <ProductList
      slot="product-list"
      :sorting="sorting"
      :tagId="tagId"
      :smartSortSwitch="currentTag.smartSortSwitch"
    >
      <template slot="empty">
        <span v-if="isNewPoiRecommend">
          <span>快去新建商品吧~</span>
          <br />
          <span>根据您经营的品类，为您推荐了必建商品可快速新建多个商品！</span>
        </span>
        <span v-else>快去新建商品吧~</span>
        <div v-if="isNewPoiRecommend">
          <NamedLink :name="hotRecommendPage">
            <Button type="primary">新店必建商品</Button>
          </NamedLink>
        </div>
      </template>
    </ProductList>
    <template slot="footer">
      <Footer
        v-if="sorting"
        :btnTexts="['完成']"
        :btnTypes="['primary']"
        @on-click="handleSubmitSort"
      />
      <ListFooter v-else class="footer" />
    </template>
  </Layout>
</template>

<script>
  import {
    allProductTag
  } from '@/data/constants/poi'
  import hotRecommendPage from '@sgfe/eproduct/navigator/pages/product/hotRecommend'
  import ListHeader from './components/list-header'
  import ListFooter from './components/list-footer'
  import TagList from './components/tag-list'
  import ProductList from './components/product-table-list'
  import Layout from '@/views/components/layout/product-list-page'
  import Footer from '@components/sticky-footer'
  import NamedLink from '@components/link/named-link'
  import {
    POI_HOT_RECOMMEND
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'
  import store from './store'

  export default {
    name: 'product-list-page',
    mixins: [
      withModules({
        hotRecommend: POI_HOT_RECOMMEND
      })
    ],
    data () {
      return {
        sorting: false, // 排序模式中
        currentTag: allProductTag // 当前的tag
      }
    },
    computed: {
      tagId () {
        return this.currentTag.id
      },
      poiProductCount () {
        return store.poiProductCount
      },
      isNewPoiRecommend () {
        return this.hotRecommend && this.poiProductCount <= 0
      },
      hotRecommendPage () {
        return hotRecommendPage.name
      }
    },
    components: {
      Layout,
      NamedLink,
      ListHeader,
      ListFooter,
      TagList,
      ProductList,
      Footer
    },
    methods: {
      handleTagChange (tag) {
        this.currentTag = tag
      },
      handleStartSort () {
        this.sorting = true
      },
      handleSubmitSort () {
        this.sorting = false
      }
    }
  }
</script>
<style lang="less" scoped>
.header {
  margin-bottom: 10px;
}
.footer {
  margin-top: 10px;
}
</style>
