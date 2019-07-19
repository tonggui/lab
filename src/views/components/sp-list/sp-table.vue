<template>
  <div class="sp-table-container">
    <div class="section">
      <span class="label">商品类目</span>
      <div class="content">
        <span :class="`category ${categoryId === -1 ? 'active' : ''}`" @click="chooseCategory({ id: -1, name: '' })">全部</span>
        <span v-if="categoryLoading" class="category"><Icon type="loading" /></span>
        <span
          v-for="category in categoryList"
          :key="category.id"
          :class="`category ${category.id === categoryId ? 'active' : ''}`"
          @click="chooseCategory(category)"
        >{{category.name}}</span>
      </div>
    </div>
    <div class="section">
      <span class="label">商品字段</span>
      <div class="content">
        <Input v-if="multiple" class="upc-code" v-model="upc" placeholder="请输入UPC/EAN条码" allowClear/>
        <Input class="product-name" v-model="name" placeholder="请输入标准品名" allowClear/>
        <Brand class="brand" v-model="brand" :width="200"/>
        <Button type="primary" @click="fetchProductList">搜索</Button>
      </div>
    </div>
    <div>
      <Table
        class="sp-table"
        :columns="columns"
        :data="productList"
        :loading="loading"
        :height="height"
      >
        <Page
          slot="footer"
          :current="pagination.current"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :page-size-opts="[20, 50, 100]"
          show-sizer
          @on-change="handlePageNoChange"
          @on-page-size-change="handlePageSIzeChange"
        />
      </Table>
    </div>
  </div>
</template>

<script>
  import Brand from '@/components/brand'

  const defaultPic = '//p0.meituan.net/scarlett/ccb071a058a5e679322db051fc0a0b564031.png'
  const convertToCompatiblePicture = (src) => {
    const sourceMainPicture = (src || '').split(',')[0]
    return sourceMainPicture || defaultPic
  }

  const sortTypes = [
    { value: 0, label: '销量默认排序' },
    { value: 1, label: '销量从低到高' },
    { value: 2, label: '销量从高到低' }
  ]

  export default {
    name: 'sp-table',
    components: {
      Brand
    },
    props: {
      fetchData: {
        type: Function,
        required: true
      },
      fetchCategory: {
        type: Function,
        required: true
      },
      // 是否显示上报商品入口
      showCreate: Boolean,
      // 是否为热销场景
      hot: Boolean,
      // ?
      multiple: Boolean,
      // 表格高度
      height: {
        type: [Number, String],
        default: () => undefined
      }
    },
    data () {
      return {
        sortType: 0,
        categoryLoading: false,
        categoryList: [],
        productList: [],
        upc: '',
        name: '',
        brand: undefined,
        categoryId: -1,
        loading: false,
        pagination: {
          total: 0,
          pageSize: 20,
          current: 1
        }
      }
    },
    computed: {
      columns () {
        const columns = [
          {
            title: '商品信息',
            key: 'name',
            align: 'left',
            minWidth: 250,
            render: (hh, params) => {
              const { name, picture, isSp, existInPoi, source } = params.row
              return (
              <div class="productInfo">
                <img src={convertToCompatiblePicture(picture)} class="pic" />
                <div class="meta">
                  <div class="name">{name}</div>
                  <div class="tagContainer">
                    {isSp && <Button type="primary" size="small">标品</Button>}
                    {!isSp && <Button type="default" size="small">非标品</Button>}
                    {existInPoi && <Button type="warning" size="small" ghost>已存在</Button>}
                  </div>
                  {source === 6 ? <div class="desc">数据支持：网拍天下 www.viwor.net</div> : null}
                </div>
              </div>
            )
            }
          },
          {
            title: 'UPC标识',
            key: 'upc',
            align: 'center',
            render (hh, params) {
              const { isSp, upcCode } = params.row
              return <span>{isSp ? upcCode : '/'}</span>
            }
          },
          {
            title: '品牌',
            key: 'brand',
            align: 'center',
            render (hh, params) {
              const { brand } = params.row
              return brand && <span>{brand.name}</span>
            }
          },
          {
            title: '重量',
            key: 'weight',
            align: 'center',
            render (hh, params) {
              const skus = params.row.skuList
              const weight = skus.length ? skus[0].weight.value : 0
              return <span>{weight > 0 ? `${weight}g` : '0'}</span>
            }
          },
          {
            title: '商品规格',
            key: 'spec',
            align: 'center',
            render (hh, params) {
              const item = params.row
              const mainSku = (item.skuList || []).find(v => v.upcCode === item.upcCode) || {}
              return <span>{item.isSp ? (mainSku.specName || '') : '/'}</span>
            }
          }
        ]
        if (this.hot) {
          columns.push({
            width: 156,
            renderHeader: (hh) => {
              return (
              <Select class="selector" vModel={this.sortType} vOn:on-change={this.sortTypeChanged}>
                {sortTypes.map(item => (
                  <Option value={item.value} key={item.value}>{item.label}</Option>
                ))}
              </Select>
            )
            }
          })
        }
        columns.push({
          title: '操作',
          key: 'action',
          align: 'center',
          render: (hh, { row: item }) => (
            item.existInPoi ? (
            <Tooltip content="此商品在店内已存在" placement="top">
              <span class="opr disabled">选择该商品</span>
            </Tooltip>
              ) : <span class="opr" vOn:click={() => this.selectProduct(item)}>选择该商品</span>
          )
        })
        return columns
      }
    },
    methods: {
      chooseCategory (category) {
        this.categoryId = category.id
        this.fetchProductList()
      },
      sortTypeChanged (type) {
        this.fetchProductList()
      },
      selectProduct (product) {
        this.$emit('on-select-product', product)
      },
      handlePageNoChange (pageNo) {
        this.pagination.current = pageNo
        this.fetchProductList()
      },
      handlePageSIzeChange (pageSize) {
        this.pagination.pageSize = pageSize
        this.fetchProductList()
      },
      async initCategory () {
        this.categoryLoading = true
        try {
          this.categoryList = await this.fetchCategory()
        } finally {
          this.categoryLoading = false
        }
      },
      async fetchProductList () {
        this.loading = true
        try {
          const data = await this.fetchData({
            name: this.name,
            upc: this.upc,
            brandId: this.brand && this.brand.id,
            categoryId: this.categoryId,
            sortType: this.sortType,
            pagination: {}
          })
          this.loading = false
          this.productList = data.list || []
          Object.assign(this.pagination, data.pagination)
        } catch (e) {
          this.$Message.error(e.message || '网络请求失败，请稍后再试')
          this.loading = false
        }
      }
    },
    async mounted () {
      await this.initCategory()
      await this.fetchProductList()
    }
  }
</script>

<style scoped lang="less">
  .sp-table-container {
    padding: 0 0;
    .section {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 15px;
      line-height: 1;
    }
    .label {
      padding: 10px;
    }
    .content {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      margin-left: 20px;
      line-height: 36px;
      align-items: center;
      .category {
        display: inline-block;
        margin: 6px 12px;
        cursor: pointer;
        color: #666;
        line-height: 1;
        &.active {
          font-weight: bold;
          transform: scale(1.05);
          transform-origin: 50% 50%;
          color: @primary-color;
        }
      }
      .product-name
      , .upc-code
      , .brand {
        width: 200px;
        height: 36px;
        margin-right: 10px;
      }
      .brand /deep/ input {
        font-size: @font-size-base;
      }
      .brand /deep/ .withSearch {
        height: 36px;
      }
      .boo-btn {
        height: 34px;
      }
    }
    .noDataContainer {
      padding: 40px 20px;
    }
  }

  .sp-table {
    font-size: 12px;
    margin-top: 10px;
    /deep/ .boo-table-cell {
      padding-left: 0;
      padding-right: 0;
    }
    /deep/ .boo-table-row > td {
      padding: 12px 0;
      &:first-child {
        padding-left: 8px;
      }
      &:last-child {
        padding-right: 8px;
      }
    }
    /deep/ .boo-table-header tr > th {
      &:first-child {
        padding-left: 8px;
      }
      &:last-child {
        padding-right: 8px;
      }
    }
    /deep/ .boo-table-footer {
      height: auto;
      padding: 8px;
      display: flex;
      flex-direction: row-reverse;
    }
    &.active {
      display: block;
    }
    /deep/ .boo-table {
      font-size: 12px;
      &:before {
        background-color: @border-color-base;
      }
    }
    .productInfo {
      display: flex;
      align-items: center;
      .pic {
        width: 100px;
        height: 90px;
        object-fit: cover;
        vertical-align: middle;
        margin-right: 10px;
        border: 1px solid #ebeef2;
      }
      .tagContainer {
        margin: 5px 0;
        /deep/ .boo-btn {
          margin-right: 8px;
          padding: 0 7px;
        }
      }
      .meta {
        flex: 1;
        display: inline-block;
        text-align: left;
        vertical-align: middle;
        line-height: 1.5;
      }
      .desc {
        font-size: 12px;
        color: @text-description-color;
      }
    }
    .opr {
      font-weight: bold;
      cursor: pointer;
      color: @primary-color;
      &.disabled {
        color: @disabled-color;
        cursor: not-allowed;
      }
    }
    .controls {
      display: flex;
      justify-content: space-between;
      padding: 20px 10px 10px 10px;
    }
    .selector {
      height: 36px;
      /deep/ .boo-select-selected-value {
        height: 36px;
        line-height: 36px;
      }
    }
  }
</style>
