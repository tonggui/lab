<template>
  <ProductListPage class="preview-container">
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
        ref="table"
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
      >
        <Alert slot="tips" v-if="tag.unCategorized" banner type="error" show-icon class="alert">
          使用成功后，可在商品列表直接使用“批量改分类”移动至其他分类（或补充商品类目后，重新应用模版）
        </Alert>
      </ProductListTable>
    </div>
    <div class="footer" slot="footer">
      <Button @click="$emit('cancel')">返回修改</Button>
      <Button type="primary" @click="handleSubmit">确认使用</Button>
    </div>
  </ProductListPage>
</template>
<script>
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
      const unCategorized = currentTag.isUnCategorized
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
          currentTag,
          unCategorized // 是否有未分类
        }
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
      ProductListTable
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
          content: '模版使用后，不支持回退到使用前状态，如需还原，请手动进行修改即可',
          maskClosable: false,
          okText: '确认使用',
          cancelText: '取消',
          onOk: () => {
            this.$emit('submit', () => {
              // TODO loading 问题
              // this.$Modal.remove()
            })
          }
          // loading: true
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
    }
    .footer {
      text-align: right;
      padding: 20px;
      box-shadow: 0 -4px 5px 0 #F7F8FA;
      position: relative;
      button {
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .alert {
      font-size: @font-size-small;
    }
  }
</style>
