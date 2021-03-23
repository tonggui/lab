<template>
  <div class="tag-with-table-container">
    <div class="tag-with-table-search">
      <ProductSearch ref="product-search" @change="handleSearching" @search="handleSearching" />
      <a @click="handleSearchOut">退出搜索</a>
    </div>
    <div class="tag-with-table">
      <TagWithList
        v-show="!searching"
        :tagId="tagId"
        :checkBoxList="productData"
        @on-select="handleSelectTag"
        @on-checkbox-change="handleCheckBoxChange"
      />
      <DataList
        :tag="tag"
        :checkBoxList="productData"
        :searching="searching"
        @on-select-product="handleSelect"
        @on-deselect-product="handleSelect"
      />
    </div>
  </div>
</template>

<script>
  import TagWithList from './tag-with-list'
  import DataList from './data-list'
  import { helper } from '../../../store'
  import ProductSearch from '../../../components/product-search'
  import { findTagInfo } from './model'
  import { defaultTagId } from '@/data/constants/poi'
  import { get } from 'lodash'
  const { mapState, mapActions } = helper()

  export default {
    name: 'tag-with-data-table',
    props: {
      productData: Object
    },
    components: {
      TagWithList,
      DataList,
      ProductSearch
    },
    data () {
      return {
        searching: false,
        tag: null
      }
    },
    computed: {
      ...mapState({
        tagList: state => state.tagList.list,
        tagListError: state => state.tagList.error,
        productListError: state => state.productList.error
      }),
      tagId () {
        return this.tag ? get(this.tag, 'id', defaultTagId) : defaultTagId
      }
    },
    methods: {
      ...mapActions({
        handleGetData: 'getData',
        handleTagChange: 'changeTag',
        handleSearch: 'search'
      }),
      handleSearching (val) {
        this.searching = val
        this.handleSearch({ keyword: val })
      },
      handleSearchOut () {
        this.$refs['product-search'].handleClear()
      },
      handleSelectTag (tag) {
        this.tag = tag
        console.log('tag', tag)
        this.handleTagChange(tag.id)
      },
      handleSelect (data) {
        const productData = Object.assign({}, this.productData)
        findTagInfo(data, this.tagList, this.tag, productData)
        this.$emit('data-change', 'productData', productData)
      },
      handleCheckBoxChange (productData) {
        const checkbox = Object.assign({}, productData)
        this.$emit('data-change', 'productData', checkbox)
      }
    },
    mounted () {
      this.handleGetData()
    }
  }
</script>

<style lang="less" scoped>
  .tag-with-table-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .tag-with-table-search {
      height: 46px;
      background: #F5F6FA;
      display: flex;
      align-items: center;
      padding-left: 16px;
      border: 1px solid #EEEEEE;
      border-bottom: none;
    }
    .tag-with-table {
      display: flex;
      height: calc(100% - 46px);
      border-left: 1px solid #EEE;
    }
  }
</style>
