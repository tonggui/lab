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
    <slot name="search">
      <div class="section">
        <span class="label">商品字段</span>
        <div class="content">
          <Input v-if="multiple" class="upc-code" v-model="upc" placeholder="请输入UPC/EAN条码" allowClear/>
          <Input class="product-name" v-model="name" placeholder="请输入标准品名" allowClear/>
          <Brand class="brand" v-model="brand" :width="200"/>
          <Button type="primary" @click="search('')" v-mc="{ bid: 'b_bz26i42e' }">搜索</Button>
        </div>
      </div>
    </slot>
    <div>
      <ProductApplyDrawer v-model="showProductApplyModal" />
      <div v-if="!productList.length && !loading" class="noDataContainer">
        <p>{{ noDataText }}</p>
        <Button type="primary" @click="showProductApplyModal = true" v-mc="{ bid: 'b_xdt6qqoi' }">商品上报</Button>
      </div>
      <Table
        v-else
        class="sp-table"
        :columns="columns"
        :data="productList"
        :loading="loading"
        :height="height"
        :no-data-text="noDataText"
      >
        <Loading slot="loading" size="small" />
      </Table>
      <div class="sticky-wrapper" :class="{ fixed: footerFixed }">
        <div class="footer" v-if="productList.length">
          <div class="controls">
            <template v-if="multiple">
              <Checkbox style="margin: 0 25px" :disabled="validList.length === 0" :value="hasAllOfCurPage" @on-change="toggleCheckAll" v-mc="{ bid: 'b_zwyik1w3' }">全选</Checkbox>
              <Button type="primary" style="margin-right: 10px" :disabled="selectedCount <= 0 || submitting" @click="batchSubmit" v-mc="{ bid: 'b_zc33hskl' }">
                {{ submitting ? '正在生成' : '批量生成' }}{{ selectedCount }}
              </Button>
            </template>
            <span class="product-apply">
              没有想要的商品？<a @click="showProductApplyModal = true" v-mc="{ bid: 'b_xdt6qqoi' }">商品上报</a>
            </span>
          </div>
          <Pagination
            :pagination="pagination"
            @on-change="handlePageChange"
          />
        </div>
      </div>
    </div>
    <RestoreProduct :recycleModal="recycleModal" :defaultTag="defaultTag" :restoreProductName="restoreProductName" :selectedSpus="selectedSpus" @on-confirm='confirmSubmit' @on-cancel="cancel">
    </RestoreProduct>
  </div>
</template>

<script>
  import RestoreProduct from './restore-product'
  import { poiId } from '@/common/constants'
  import Brand from '@/components/brand'
  import { QUALIFICATION_STATUS } from '@/data/enums/product'
  import qualificationModal from '@/components/qualification-modal'
  import ProductApplyDrawer from '@/components/product-apply/product-apply-drawer'
  import { fetchSubmitBatchSaveProductBySp } from '@/data/repos/standardProduct'
  import completePage from '@sgfe/eproduct/navigator/pages/product/complete'
  import jumpTo from '@components/link/jumpTo'
  import lx from '@/common/lx/lxReport'

  const defaultPic = '//p0.meituan.net/scarlett/ccb071a058a5e679322db051fc0a0b564031.png'
  const convertToCompatiblePicture = (picList) => {
    const sourceMainPicture = picList[0]
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
      Brand, ProductApplyDrawer, RestoreProduct
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
      // 是否主动加载列表数据
      autoLoad: {
        type: Boolean,
        default: () => true
      },
      // 是否为热销场景
      hot: Boolean,
      // 是否支持多选
      multiple: Boolean,
      footerFixed: Boolean,
      // 表格高度
      height: {
        type: [Number, String],
        default: () => undefined
      }
    },
    data () {
      return {
        restoreProductName: '',
        defaultTag: [],
        selectedSpus: [],
        recycleModal: false,
        sortType: 0,
        categoryLoading: false,
        categoryList: [],
        productList: [],
        upc: '',
        name: '',
        brand: undefined,
        keyword: '',
        categoryId: -1,
        loading: false,
        showProductApplyModal: false,
        selected: [], // 选中的商品id
        submitting: false,
        pagination: {
          total: 0,
          pageSize: 20,
          current: 1,
          showSizer: true
        }
      }
    },
    computed: {
      noDataText () {
        return this.hot ? '当前商品可能不是区域内热卖商品，请在全部商品中尝试搜索' : (this.categoryId === -1 ? '商品库中未找到您要创建的商品' : '该类目下暂无商品，请更换类目进行查询')
      },
      // 一共选中的个数
      selectedCount () {
        return this.selected.length > 0 ? `(${this.selected.length})` : ''
      },
      // 所选项中是否全包含当前页的数据
      hasAllOfCurPage () {
        return this.validList.length > 0 && this.validList.every(v => this.selected.includes(v.id))
      },
      // 可选的项
      validList () {
        return this.productList.filter(v => !this.isDisabled(v))
      },
      columns () {
        const columns = [
          {
            title: '商品信息',
            key: 'name',
            align: 'left',
            minWidth: 250,
            render: (hh, params) => {
              const { name, pictureList, isSp, existInPoi, source, existInRecycle } = params.row
              return (
              <div class="productInfo">
                <img src={convertToCompatiblePicture(pictureList)} class="pic" />
                <div class="meta">
                  <div class="name">{name}</div>
                  <div class="tagContainer">
                    {isSp && <Button type="primary" size="small">标品</Button>}
                    {!isSp && <Button type="default" size="small">非标品</Button>}
                    {existInPoi && <Button type="warning" size="small" ghost>已存在</Button>}
                    {existInRecycle && <Tooltip class="restore-tooltip" popper-class="restore-tooltip"
                      placement="bottom"
                      width={400} style="font-size:12px"
                      // content="商品在回收站中,点击右侧“从回收站恢复”即可恢复该商品，原有销量也会恢复哦~"
                    >
                      <Button type="primary" size="small" ghost>回收站可恢复</Button>
                      <div slot="content">
                        <p class="display-tip">商品在回收站中,点击右侧“从回收站恢复”即可恢复该商品，原有销量也会恢复哦~</p>
                      </div>
                    </Tooltip>
                    }
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
              const weightUnit = skus.length ? skus[0].weight.unit : '克(g)'
              return <span>{weight > 0 ? `${weight}${weightUnit}` : '0'}</span>
            }
          },
          {
            title: '商品规格',
            key: 'specName',
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
            align: 'center',
            renderHeader: (hh) => {
              return (
                <Select class="selector" vModel={this.sortType} vOn:on-change={this.sortTypeChanged}>
                  {sortTypes.map(item => (
                    <Option value={item.value} key={item.value}>{item.label}</Option>
                  ))}
                </Select>
              )
            },
            key: 'monthSale'
          })
        }
        columns.push({
          title: '操作',
          key: 'action',
          align: 'center',
          render: (hh, { row: item }) => {
            const disabled = this.isDisabled(item)
            const isQualified = this.isQualified(item)
            const isNotInRecycle = !item.existInRecycle
            return (
              isNotInRecycle ? (<Tooltip content={this.disabledTip(item)} placement="left" transfer width={!isQualified ? 250 : undefined} disabled={!disabled}>
                <span class={{ disabled, opr: true }} onClick={() => this.selectProduct(item)}>选择该商品</span>
              </Tooltip>) : <span class={{ opr: true }} onClick={() => this.restoreProduct(item)}>从回收站恢复</span>
            )
          }
        })
        if (this.multiple) {
          columns.unshift({
            title: '序号',
            key: 'index',
            width: 60,
            align: 'center',
            render: (hh, { row: item }) => {
              const disabled = this.isDisabled(item)
              const isQualified = this.isQualified(item)
              const checked = this.selected.includes(item.id)
              return (
                <Tooltip content={this.disabledTip(item)} placement="right" transfer width={!isQualified ? 250 : undefined} disabled={!disabled}>
                  <Checkbox disabled={disabled} style={{ margin: 0 }} value={checked} vOn:on-change={() => this.handleSelect(item)} />
                </Tooltip>
              )
            }
          })
        }
        return columns
      }
    },
    methods: {
      restoreProduct (item) {
        console.log(item, this.productList)
        // 开启模态框 && 须传（勾选）需恢复的spuIds
        this.restoreProductName = item.name
        this.selectedSpus = []
        this.selectedSpus.push(item.id)
        this.defaultTag = []
        this.defaultTag.push({ id: item.tagId, name: item.tagName })
        console.log(this.defaultTag)
        this.recycleModal = true
      },
      confirmSubmit () {
        // 回到当前页 & 刷新本页
        this.cancel()
        this.handlePageChange(this.pagination)
      },
      cancel () {
        this.recycleModal = false
        this.selectedSpus = []
        this.defaultTag = []
      },
      isQualified (v) {
        return v.qualificationStatus === QUALIFICATION_STATUS.YES
      },
      isDisabled (v) {
        return !!v.existInPoi || !this.isQualified(v)
      },
      disabledTip (v) {
        if (!this.isQualified(v)) {
          return v.qualificationTip
        }
        return '此商品在店内已存在'
      },
      chooseCategory (category) {
        this.categoryId = category.id
        this.fetchProductList()
        lx.mc({ bid: 'b_fzgusupp', val: { cat_id: category.id } })
      },
      sortTypeChanged (type) {
        this.fetchProductList()
      },
      selectProduct (product) {
        lx.mc({ bid: 'b_v10h0cl0', val: { spu_id: product.id } })
        lx.mc({
          bid: 'b_shangou_online_e_q9bg9t89_mc',
          val: {
            st_spu_id: product.id,
            select_time: new Date().getTime()
          }
        })
        if (this.isDisabled(product)) {
          this.qualificationTip(product)
        } else {
          this.$emit('on-select-product', product)
        }
      },
      // 单个选择
      handleSelect (v) {
        const _set = new Set(this.selected)
        lx.mc({ bid: 'b_m12rsjim', val: { status: _set.has(v.id) } })
        if (_set.has(v.id)) {
          _set.delete(v.id)
        } else {
          _set.add(v.id)
        }
        this.selected = Array.from(_set)
      },
      // toggle全选
      toggleCheckAll (checkAll) {
        const _set = new Set(this.selected)
        this.productList.filter(v => !this.isDisabled(v)).forEach(v => checkAll ? _set.add(v.id) : _set.delete(v.id))
        this.selected = Array.from(_set)
      },
      handlePageChange (page) {
        this.pagination = page
        console.log('--bbbbb', page)
        this.fetchProductList()
      },
      qualificationTip (item) {
        if (item.qualificationStatus === QUALIFICATION_STATUS.NO || item.qualificationStatus === QUALIFICATION_STATUS.EXP) {
          qualificationModal(item.qualificationTip)
        }
      },
      search (keywords = '', resetCategory = false) {
        this.pagination.current = 1
        if (resetCategory) {
          this.categoryId = -1
        }
        this.keyword = keywords
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
          const postData = {
            name: this.name,
            upc: this.upc,
            pagination: this.pagination
          }
          if (this.keyword) {
            postData.keyword = this.keyword
          }
          if (this.brand && this.brand.id > 0) {
            postData.brandId = this.brand.id
          }
          if (this.categoryId > 0) {
            postData.categoryId = this.categoryId
          }
          if (this.hot) {
            postData.sortType = this.sortType
          }
          const data = await this.fetchData(postData)
          this.loading = false
          this.productList = data.list || []
          Object.assign(this.pagination, data.pagination)
        } catch (e) {
          this.$Message.error(e.message || '网络请求失败，请稍后再试')
          this.loading = false
        }
      },
      // 批量生成
      batchSubmit () {
        this.submitting = true
        fetchSubmitBatchSaveProductBySp(this.selected, poiId).then(data => {
          this.submitting = false
          if (data.value > 0) {
            this.$Message.success('批量生成成功')
            setTimeout(() => {
              jumpTo(completePage.pages, {
                params: {
                  count: data.value,
                  wmPoiId: poiId
                }
              })
            }, 500)
          } else {
            this.$toast.error('服务异常，批量生成失败')
          }
        }).catch(err => {
          console.log(err)
          this.submitting = false
          this.$Message.warning(err.msg || '服务异常，批量生成失败')
        })
      }
    },
    mounted () {
      this.initCategory()
      if (this.autoLoad) {
        this.fetchProductList()
      }
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
        margin: 6px 12px 6px 0;
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
      padding: 50px 20px;
      text-align: center;
      p {
        margin: 10px 0;
      }
    }
    .sticky-wrapper {
      max-width: 1280px;
      &.fixed {
        padding: 60px 0 0;
        .footer {
          margin: 0 auto;
          max-width: 1280px;
          box-shadow: 0 -4px 2px 0 #f7f8fa;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fff;
          z-index: 10;
          padding: 5px 10px;
        }
      }
    }
    .footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      .controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        .product-apply {
          margin-left: -10px;
          color: @color-gray2;
          a {
            text-decoration: underline;
          }
        }
      }
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
      font-weight: normal;
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
      align-items: center;
      justify-content: space-between;
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
        /deep/ .restore-tooltip{
          opacity: 0.8;
          max-width: 400px !important;
          color: rgb(176, 176, 176);
          /deep/ boo-tooltip-inner boo-tooltip-inner-with-width {
            max-width: 300px;
          }
          .boo-tooltip-popper {
            font-size: 12px;
            line-height: 1.5;
            max-width: 300px;
          }
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
      cursor: pointer;
      color: @link-color;
      &.disabled {
        color: @disabled-color;
        cursor: not-allowed;
      }
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
