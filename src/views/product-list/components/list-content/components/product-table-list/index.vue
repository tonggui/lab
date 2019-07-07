<template>
  <div>
    <div class="product-list-table-header">
      <Tabs v-model="status" class="product-list-table-tabs">
        <TabPane v-for="item in statusList"
          :label="h => renderLable(h, item)"
          :name="item.id"
          :key="item.id"
        />
        <Button slot="extra">扩展内容</Button>
      </Tabs>
      <div class="product-list-table-op">
        <Checkbox><span style="margin-left: 20px">全选本页</span></Checkbox>
        <ButtonGroup>
          <Button>上架</Button>
          <Button>下架</Button>
          <Button>修改分类</Button>
          <Dropdown>
            <Button style="border-top-left-radius: 0;border-bottom-left-radius: 0;border-left: 0;">
              更多
              <Icon type="keyboard-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem>修改库存</DropdownItem>
              <DropdownItem>修改可售时间</DropdownItem>
              <DropdownItem>修改商品标签</DropdownItem>
              <DropdownItem>删除</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </ButtonGroup>
      </div>
    </div>
    <Table
      @on-page-change="handlePageChange"
      :pagination="pagination"
      :loading="loading"
      :data="productList"
      :columns="columns"
    ></Table>
  </div>
</template>
<script>
import { fetchGetProductInfoList } from '@/data/repos/product'
import { productStatus, defaultProductStatus } from '@/data/constants/product'
import Table from './components/table-list'
import columns from './columns'

export default {
  name: 'product-list-table-container',
  props: {
    tagId: {
      type: Number,
      required: true
    },
    sorting: Boolean
  },
  data () {
    return {
      productList: [],
      loading: false,
      error: false,
      status: defaultProductStatus,
      statusList: productStatus,
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
        pageSizeOpts: [20, 50, 100],
        showElevator: true,
        showSizer: true
      }
    }
  },
  computed: {
    columns () {
      return columns
    }
  },
  watch: {
    status () {
    }
  },
  components: {
    Table
  },
  methods: {
    async getData () {
      try {
        this.loading = true
        const { list, statusList, pagination } = await fetchGetProductInfoList({
          status: this.status,
          tagId: this.tagId
        }, this.pagination, this.statusList)
        this.productList = list
        this.pagination = pagination
        this.statusList = statusList
      } catch (err) {
        this.$Message.error(err.message || err)
      } finally {
        this.loading = false
      }
    },
    handlePageChange (pagination) {
      this.pagination = pagination
      this.getData()
    },
    renderLable (h, item) {
      const { name, count, needDanger = false } = item
      return (
        <div>{name} <span class={needDanger ? 'danger' : ''}>{count}</span></div>
      )
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less">
  .product-list-table {
    &-tabs {
      .boo-tabs-bar {
        margin-bottom: 0;
      }
      .boo-tabs-nav .boo-tabs-tab {
        padding: 20px 20px 18px 20px;
      }
    }
    &-op {
      padding: 15px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
