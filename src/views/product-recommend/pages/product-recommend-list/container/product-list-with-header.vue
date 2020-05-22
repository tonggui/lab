<template>
  <ErrorBoundary
    :top="200"
    :error="error"
    @refresh="getData"
    description="搜索哪里出了问题～"
  >
    <ProductListPage>
      <Header slot="header">
        <div slot="left">新店必建商品</div>
        <div slot="right" class="header-right">
          <ProductSearch />
          <span class="visible-switch">显示已有商品</span>
        </div>
      </Header>
      <div slot="tag-list">1</div>
      <ProductTableList slot="product-list" :dataSource="dataSource" />
      <TagList
        slot="tag-list"
        :tagList="tagList"
        :loading="loading"
        :tagId="tagId"
        :productCount="productCount"
        @select="handleChangeTag"
      />
    </ProductListPage>
  </ErrorBoundary>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import Header from '@/components/header-layout'
  import ProductSearch from '../components/product-search'
  import ProductTableList from '../components/product-table-list'
  import TagList from '../components/tag-list'
  import { helper } from '@/views/product-recommend/store'

  const { mapGetters, mapState, mapActions } = helper('tagList')

  export default {
    name: 'product-list-header',
    props: {
      title: {
        type: String,
        default: ''
      },
      desc: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        error: false,
        dataSource: [{
          key: '1',
          name: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
          pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg'],
          weight: '规格 500g 重量 500g',
          upc: '条形码 123456789012345678'
        }, {
          key: '2',
          name: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
          pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg'],
          weight: '规格 500g 重量 500g',
          upc: '规格、重量创建时可修改'
        }, {
          key: '3',
          name: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
          pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg'],
          weight: '规格 500g 重量 500g',
          upc: '规格、重量创建时可修改'
        }, {
          key: '4',
          name: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
          pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg'],
          weight: '规格 500g 重量 500g',
          upc: '条形码 123456789012345678'
        }, {
          key: '5',
          name: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
          pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg'],
          weight: '规格 500g 重量 500g',
          upc: '规格、重量创建时可修改'
        }, {
          key: '6',
          name: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
          pictureList: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1590080110948&di=48179b3b3407fe8d66fcfab9aafeba3c&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F94o3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Feaf81a4c510fd9f95f48a24b212dd42a2834a4b1.jpg'],
          weight: '规格 500g 重量 500g',
          upc: '规格、重量创建时可修改'
        }]
      }
    },
    computed: {
      ...mapState(['productCount', 'loading', 'tagList']),
      ...mapGetters({
        tagId: 'tagId'
      })
    },
    components: {
      ProductListPage,
      Header,
      ProductSearch,
      ProductTableList,
      TagList
    },
    methods: {
      ...mapActions({
        // handleTagChange: 'changeTag'
      }),
      getData () {
        // to-do
      },
      handleChangeTag () {
        // to-do
      }
    }
  }
</script>

<style lang="less" scoped>
.header-right {
  display: flex;
  align-items: center;
  font-family: PingFangSC-Regular;
  .visible-switch {
    font-size: 14px;
    color: #676A78;
    line-height: 14px;
    text-decoration: underline;
  }
}
</style>
