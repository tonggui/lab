<template>
  <div class="sp-table">
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
        <Input class="product-name" v-model="productName" placeholder="请输入标准品名" allowClear/>
        <Brand class="brand" v-model="brand"/>
        <Button type="primary" @click="search">搜索</Button>
      </div>
    </div>
    <div>
      <Table
        :columns="columns"
        :data="productList"
        :loading="loading"
      />
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
    fetch: {
      type: Function,
      required: true
    },
    // 是否显示上报商品入口
    showCreate: Boolean,
    // 是否为热销场景
    hot: Boolean
  },
  data () {
    return {
      sortType: 0,
      productList: [],
      upc: '',
      name: '',
      brandId: undefined,
      categoryId: undefined,
      loading: false,
      pagination: {
        total: 0,
        pageSize: 10,
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
          render: (h, params) => {
            const { name, picture, isSp, existInPoi, source } = params.row
            return (
              <div class="productInfo">
                <img src={convertToCompatiblePicture(picture)} class="pic" />
                <div class="meta">
                  <div class="name">{name}</div>
                  <div class="tagContainer">
                    {isSp === 1 && <Tag type="primary">标品</Tag>}
                    {isSp !== 1 && <Tag type="default">非标品</Tag>}
                    {existInPoi && <Tag type="warning" ghost>已存在</Tag>}
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
          width: '10%',
          render (h, params) {
            const { isSp, upc } = params.row
            return isSp === 1 ? upc : '/'
          }
        },
        {
          title: '品牌',
          key: 'brandName',
          align: 'center',
          width: '10%'
        },
        {
          title: '重量',
          key: 'weight',
          align: 'center',
          width: '10%',
          render (h, params) {
            const { weight } = params.weight
            return weight > 0 ? `${weight}g` : '0'
          }
        },
        {
          title: '商品规格',
          key: 'spec',
          align: 'center',
          width: '10%',
          render (h, params) {
            const item = params.row
            const mainSku = (item.skus || []).find(v => v.upcCode === item.upc) || {}
            return item.isSp === 1 ? (mainSku.spec || '') : '/'
          }
        }
      ]
      if (this.hot) {
        columns.push({
          renderHeader: (h) => {
            return (
              <Select vModel={this.sortType} vOn:on-change={this.sortTypeChanged}>
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
        width: '10%',
        align: 'center',
        render: (h, { row: item }) => (
          item.existInPoi ? (
            <Tooltip title="此商品在店内已存在" placement="top">
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

    },
    sortTypeChanged (type) {},
    selectProduct (product) {
      this.$emit('on-select-product', product)
    },
    async fetchData () {
      this.loading = true
      try {
        const data = await this.fetch({
          name: this.name,
          upc: this.upc,
          brandId: this.brandId,
          categoryId: this.categoryId,
          sortType: this.sortType,
          pagination: {}
        })
        this.loading = false
        this.productList = data.list || []
        this.pagination = data.pagination
      } catch (e) {
        this.$Message.error(e.message || '网络请求失败，请稍后再试')
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
