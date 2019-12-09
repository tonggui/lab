<template>
  <CategoryTemplateLayout>
    <div slot="header">分类模版预览</div>
    <ProductListPage class="preview-container">
      <Alert type="warning" show-icon class="alert" slot="header">
        分类的商品在使用分类模版后，可在“管理分类”中进行排序调整和编辑
      </Alert>
      <TagTree
        labelInValue
        :data-source="tagList"
        :expand-list="tag.expandList"
        :value="tag.currentTag.id"
        @select="handleChangeTag"
        @expend="handleExpandTag"
        slot="tag-list"
        class="tag-list"
      />
      <div slot="product-list" class="preview-content">
        <ProductListTable
          class="product-list"
          showHeader
          :tabs="product.statusList"
          :tab-value="product.status"
          :tab-pane-filter="isShowTabPane"
          :render-tab-label="renderTabLabel"
          @tab-change="handleTabChange"
          :dataSource="product.list"
          :columns="columns"
          :pagination="product.pagination"
          :loading="product.loading"
          @page-change="handlePageChange"
          table-fixed
        />
      </div>
    </ProductListPage>
    <template slot="footer">
      <Button @click="$emit('cancel')">重选分类模版</Button>
      <Button type="primary" @click="handleSubmit">确认使用模版</Button>
    </template>
  </CategoryTemplateLayout>
</template>
<script>
  import CategoryTemplateLayout from '../category-template-layout'
  import TagTree from '@components/tag-tree'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import ProductListTable from '@components/product-list-table'
  import { PRODUCT_STATUS } from '@/data/enums/product'
  import { PRODUCT_INCOMPLETE_TAB } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import { defaultPagination } from '@/data/constants/common'
  import { productStatus, defaultProductStatus } from '@/data/constants/product'
  import { findFirstLeaf } from '@/common/utils'
  import columns from './columns'

  export default {
    name: 'category-template-preview',
    props: {
      tagList: {
        type: Array,
        required: true
      },
      templateType: {
        type: [Number, String],
        required: true
      },
      fetchProduct: {
        type: Function,
        required: true
      }
    },
    data () {
      const currentTag = findFirstLeaf(this.tagList)
      const expandList = currentTag.level > 0 ? [currentTag.parentId] : []
      return {
        product: {
          loading: false,
          error: false,
          pagination: { ...defaultPagination },
          list: [],
          status: defaultProductStatus,
          statusList: [...productStatus]
        },
        tag: {
          expandList,
          currentTag
        },
        tableHeight: 200 // 最少200px
      }
    },
    computed: {
      ...mapModule({
        showIncompleteTab: PRODUCT_INCOMPLETE_TAB
      }),
      columns () {
        return columns
      }
    },
    components: {
      ProductListPage,
      TagTree,
      ProductListTable,
      CategoryTemplateLayout
    },
    methods: {
      isShowTabPane (item) {
        if (item.id === PRODUCT_STATUS.INCOMPLETE) {
          return this.showIncompleteTab
        }
        return true
      },
      async getProductList () {
        try {
          this.product.loading = true
          const { currentTag } = this.tag
          const { list, pagination, statusList } = await this.fetchProduct({
            query: {
              currentTag,
              templateType: this.templateType,
              status: this.product.status
            },
            pagination: this.product.pagination,
            statusList: this.product.statusList
          })
          this.product.list = list
          this.product.pagination = pagination
          this.product.statusList = statusList
          this.product.error = false
        } catch (err) {
          this.product.error = true
        } finally {
          this.product.loading = false
        }
      },
      resetPagination () {
        this.product.pagination.current = 1
      },
      handleChangeTag (tag) {
        this.tag.currentTag = tag
        this.resetPagination()
        this.getProductList()
      },
      handleExpandTag (list) {
        this.tag.expandList = list
      },
      handleTabChange (status) {
        this.product.status = status
        this.resetPagination()
        this.getProductList()
      },
      renderTabLabel (h, item) {
        const { name, count, needDanger = false } = item
        return (
          <div>{name} <span class={needDanger ? 'danger' : ''}>{count}</span></div>
        )
      },
      handlePageChange (page) {
        this.product.pagination = page
        this.getProductList()
      },
      handleSubmit () {
        this.$Modal.confirm({
          title: '确认使用该模版',
          content: '模版使用后，不支持回退到使用前状态，如需还原，请手动进行修改即可',
          centerLayout: true,
          iconType: '',
          width: 384,
          okText: '确认',
          cancelText: '暂不使用',
          onOk: async () => {
            await new Promise((resolve, reject) => {
              this.$emit('submit', resolve)
            })
          }
        })
      }
    },
    mounted () {
      if (this.tag.currentTag) {
        this.getProductList()
      }
    }
  }
</script>
<style lang="less" scoped>
  .preview-container {
    height: 100%;
    max-height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    /deep/ .product-list-page-layout-tag-list {
      min-width: 170px;
      width: 170px;
    }
    /deep/ .product-list-page-layout-content {
      min-height: 400px;
    }
    .tag-list {
      height: 100%;
      overflow-y: auto;
      font-size: @font-size-base;
    }
    .preview-content {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .product-list {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      /deep/ .product-list-table-body {
        overflow-y: auto;
      }
      /deep/ .table-with-page-page {
        padding: 16px 20px;
      }
      /deep/ .product-list-table .boo-table .boo-table-cell {
        padding-left: 14px;
      }
    }
    .alert {
      font-size: @font-size-small;
    }
  }
</style>
