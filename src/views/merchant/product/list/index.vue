<template>
  <div>
    <div class="entrance">
      旧版批量功能
      <span class="line" />
      <NameLink tag="a" :to="batchCreatePage" :params="{ routerTagId }">
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
        ref="tag"
      />
      <ProductList
        slot="product-list"
        :sorting="sorting"
        :tagId="currentTag.id"
        ref="product"
      />
      <Footer slot="footer"
        v-if="sorting"
        :btnTexts="['保存并同步', '仅保存', '取消']"
        :btnTypes="['primary', 'primary', 'default']"
        @on-click="handleSort"
      />
    </Layout>
    <Drawer
      title="选择目标门店"
      :closable="false"
      v-model="showPoiSelect"
      :width="1000"
      @on-cancel="handleCancel"
      @on-ok="handlePoiSubmit"
    >
      <Poi />
    </Drawer>
  </div>
</template>

<script>
  import NameLink from '@components/link/named-link'
  import ListHeader from './components/list-header/index'
  import TagList from './components/tag-list'
  import ProductList from './components/product-table-list'
  import Layout from '@/views/components/layout/product-list'
  import Footer from '@components/sticky-footer'
  import Poi from '@components/poi/poi-select'
  import Drawer from '@components/drawer-form'
  import batchCreatePage from '@sgfe/eproduct/navigator/pages/batch/create'
  import {
    fetchSubmitSaveOrder,
    fetchSubmitSaveOrderWithSync
  } from '@/data/repos/merchantProduct'
  import {
    allProductTag
  } from '@/data/constants/poi'

  export default {
    name: 'merchant-product-list',
    data () {
      return {
        sorting: false, // 排序模式中
        currentTag: allProductTag, // 当前的tagId
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
      Poi,
      Drawer
    },
    methods: {
      handleTagChange (tag) {
        this.currentTag = tag
      },
      handleStartSort () {
        this.sorting = true
      },
      handleCancel () {
        this.showPoiSelect = false
      },
      async handlePoiSubmit () {
        const tagList = this.$refs.tag.sortTagList
        const productMap = this.$refs.product.sortMap
        // console.log('idList', idList)
        await fetchSubmitSaveOrderWithSync(tagList, productMap)
      },
      async handleSort (index) {
        if (index === 2) {
          this.sorting = false
          return
        }
        if (index === 0) {
          this.showPoiSelect = true
          return
        }
        if (index === 1) {
          const tagList = this.$refs.tag.sortTagList
          const productMap = this.$refs.product.sortMap
          await fetchSubmitSaveOrder(tagList, productMap)
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
