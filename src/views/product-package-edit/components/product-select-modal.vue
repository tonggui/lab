<template>
  <Modal
    :value="value"
    :width="1000"
    :mask-closable="false"
    class-name="product-list-modal-container"
    @on-cancel="handleCancel"
  >
    <ProductListPage>
      <div slot="header" class="product-list-header">组包商品选择</div>
      <ProductSelect
        slot="content"
        :tableSource="dataSource"
        :loading="loading || tagLoading"
        :tagList="tagList"
        :selectedTagId="selectedTagId"
        :selectedList="selectedList"
        :pagination="pagination"
        :maxCount="maxCount"
        :totalProductCount="totalProductCount"
        @on-page-change="handlePageChange"
        @on-select="handleSelect"
        @on-de-select="handleDeSelect"
        @on-tag-change="handleTagChange"
      >
        <ProductSearch
          slot="header-right"
          @on-search="handleSearch"
          :searchValue="keyword"
        />
      </ProductSelect>
    </ProductListPage>
    <Button slot="footer" type="primary" @click="handleOk">确定</Button>
  </Modal>
</template>

<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import ProductSelect from '@/views/components/product-select/product-select'
  import ProductSearch from './product-search'
  import { fetchGetProductInfoList } from '@/data/repos/product'
  import { fetchGetPoiTagInfo } from '@/data/repos/category'
  export default {
    name: 'product-list',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      selectedProductList: Array,
      maxCount: {
        type: Number,
        default: () => Number.MAX_VALUE
      }
    },
    components: {
      ProductSearch,
      ProductSelect,
      ProductListPage
    },
    data: () => {
      return {
        dataSource: [],
        selectedTagId: 0,
        totalProductCount: 0,
        tagList: [],
        keyword: '',
        selectedList: [],
        loading: false,
        tagLoading: false,
        pagination: {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          showTotal: true,
          showSizer: true,
          pageSizeOpts: [20, 50, 100]
        }
      }
    },
    watch: {
      value (val) {
        if (val) {
          if (!this.dataSource.length) {
            this.getData()
          }
          this.selectedList = [...this.selectedProductList]
        }
      }
    },
    methods: {
      handleOk () {
        this.$emit('on-ok', this.selectedList)
      },
      handleCancel () {
        this.selectedList = []
        this.$emit('on-cancel')
      },
      handleSelect (val) {
        this.selectedList.push(...val)
      },
      handleDeSelect (val) {
        const result = []
        this.selectedList.forEach(item => {
          if (!val.some(it => it.id === item.id)) {
            result.push(item)
          }
        })
        this.selectedList = result
      },
      handleTagChange (tagId) {
        this.keyword = ''
        this.selectedTagId = tagId
        this.getDataSource()
      },
      handleSearch (keyword) {
        this.keyword = keyword.name
        this.getDataSource()
      },
      handlePageChange (pagination) {
        this.pagination = pagination
        this.getDataSource()
      },
      getTagList () {
        this.tagLoading = true
        fetchGetPoiTagInfo().then(res => {
          this.tagList = res.tagList
          this.totalProductCount = res.tagInfo.productTotal || 0
          console.log(this.totalProductCount, res)
        }).finally(() => {
          this.tagLoading = false
        })
      },
      getDataSource () {
        this.loading = true
        fetchGetProductInfoList(
          {
            tagId: this.selectedTagId,
            keyword: this.keyword,
            packageProduct: 0
          },
          this.pagination
        )
          .then(res => {
            this.loading = false
            const { pagination, list } = res
            this.dataSource = list
            this.pagination = pagination
          })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
      },
      getData () {
        this.getTagList()
        this.getDataSource()
      }
    }
  }
</script>

<style lang="less">
.product-list-modal-container {
  /deep/ .boo-modal {
    min-height: 400px !important;
    max-height: 500px !important;
    /deep/ .boo-modal-content {
      min-height: 100%;
      max-height: 100%;
      /deep/ .boo-modal-body {
        height: 100%;
        .product-table-list-container .product-table-list-header {
          padding-right: 0;
        }
      }
      /deep/ .boo-modal-footer {
        padding-top: 0;
      }
    }
  }
}
.product-list-header {
  font-size: 20px;
  line-height: 20px;
  font-family: PingFangSC-Medium;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f2f6;
}
</style>
