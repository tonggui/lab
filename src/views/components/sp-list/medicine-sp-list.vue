<template>
  <div class="sp-table-container">
    <div class="section">
      <span class="label">商品类目</span>
      <div class="content">
        <Select :value="tagCode" style="width: 200px" @on-change="handleTagChange">
          <Option v-for="item in tagList" :value="item.appTagCode" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
    </div>
    <div class="section">
      <span class="label">商品字段</span>
      <div class="content">
        <Input class="product-name" v-model="name" placeholder="请输入商品标题" allowClear/>
        <Input class="upc-code" v-model="upc" placeholder="请输入UPC/EAN条码" allowClear/>
        <Input class="permission-number" v-model="permissionNumber" placeholder="请输入批准文号" allowClear/>
        <Button type="primary" @click="search" v-mc="{ bid: 'b_bz26i42e' }">搜索</Button>
      </div>
    </div>
    <div>
      <div v-if="!productList.length && !loading" class="noDataContainer">
        <slot name="empty" v-bind:hasAuditingData="hasAuditingData" v-bind:hasAuditingStatus="hasAuditingStatus" v-bind:filterVal="upc || name">
          <p>{{ noDataText }}</p>
        </slot>
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
            <template>
              <Checkbox style="margin: 0 25px" :disabled="validList.length === 0" :value="hasAllOfCurPage" @on-change="toggleCheckAll" v-mc="{ bid: 'b_zwyik1w3' }">全选</Checkbox>
              <Button type="primary" style="margin-right: 10px" :disabled="selectedCount <= 0 || submitting" @click="batchSubmit" v-mc="{ bid: 'b_zc33hskl' }">
                {{ submitting ? '正在生成' : '批量生成' }}{{ selectedCount }}
              </Button>
            </template>
          </div>
          <Pagination
            :pagination="pagination"
            @on-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { poiId } from '@/common/constants'
  import { QUALIFICATION_STATUS, OTC_TYPE } from '@/data/enums/product'
  import qualificationModal from '@/components/qualification-modal'
  import { fetchGetMedicineTagList } from '@/data/repos/category'
  import { fetchGetMedicineSpList, fetchSubmitBatchSaveMedicineProductBySp } from '@/data/repos/standardProduct'
  import EditPrice from '@/views/components/product-sku-edit/edit/confirm/price'
  import EditStock from '@/views/components/product-sku-edit/edit/confirm/stock'

  const defaultPic = '//p0.meituan.net/scarlett/ccb071a058a5e679322db051fc0a0b564031.png'
  const convertToCompatiblePicture = (picList) => {
    const sourceMainPicture = picList[0]
    return sourceMainPicture || defaultPic
  }

  const otcTypes = {
    [OTC_TYPE.OTC]: 'OTC',
    [OTC_TYPE.PRESCRIPTION]: '处方药'
  }

  export default {
    name: 'medicine-sp-list',
    props: {
      initParams: {
        type: Object,
        default: () => {}
      },
      footerFixed: Boolean,
      // 表格高度
      height: {
        type: [Number, String],
        default: () => undefined
      }
    },
    data () {
      return {
        tagList: [],
        productList: [],
        hasAuditingData: false,
        hasAuditingStatus: null,
        upc: '',
        name: '',
        permissionNumber: '',
        tagCode: -1,
        loading: false,
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
        return this.tagCode === -1 ? '商品库中未找到您要创建的商品' : '该分类下暂无商品，请更换分类进行查询'
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
                  <Checkbox disabled={disabled} style={{ margin: 0 }} value={checked} vOn:on-change={() => this.handleSelect(item)} vMc={{ bid: 'b_m12rsjim' }} />
                </Tooltip>
              )
            }
          },
          {
            title: '商品信息',
            key: 'name',
            align: 'left',
            minWidth: 250,
            render: (hh, params) => {
              const { name, pictureList, permissionNumber, otcType, isSale } = params.row
              const otcText = otcTypes[otcType]
              return (
                <div class="productInfo">
                  <img src={convertToCompatiblePicture(pictureList)} class="pic" />
                  <div class="meta">
                    <div class="name">{ name }</div>
                    <div class="permission-number" style="margin: 6px 0">{ permissionNumber }</div>
                    <div class="tag-container">
                      { otcText ? <Tag color="#3F4156">{ otcText }</Tag> : null }
                      { isSale ? <Tag color="#F89800" type="border">在售</Tag> : null }
                    </div>
                  </div>
                </div>
              )
            }
          },
          {
            title: '生产厂家',
            key: 'manufaturer',
            align: 'center',
            render: (hh, params) => {
              const { manufaturer } = params.row
              return <span class="manufaturer">{manufaturer}</span>
            }
          },
          {
            title: 'UPC码',
            key: 'upcCode',
            align: 'center',
            render: (hh, params) => {
              const { upcCode } = params.row
              return <span>{upcCode}</span>
            }
          },
          {
            title: '规格',
            key: 'spec',
            align: 'center',
            render: (hh, params) => {
              const { spec } = params.row
              return <span>{spec}</span>
            }
          },
          {
            title: '价格',
            key: 'price',
            width: 150,
            align: 'center',
            render: (hh, params) => {
              const { price } = params.row
              return hh(EditPrice, {
                props: {
                  onConfirm: (v) => this.handleItemChange(params.index, 'price', v),
                  value: price
                }
              })
            }
          },
          {
            title: '指导价',
            key: 'suggestedPrice',
            align: 'center',
            render: (hh, params) => {
              const { suggestedPrice } = params.row
              return <span>{suggestedPrice}</span>
            }
          },
          {
            title: '库存',
            key: 'stock',
            width: 150,
            align: 'center',
            render: (hh, params) => {
              const { stock } = params.row
              return hh(EditStock, {
                props: {
                  onConfirm: (v) => this.handleItemChange(params.index, 'stock', v),
                  value: stock
                }
              })
            }
          },
          {
            title: '商品分类',
            key: 'tagNameList',
            align: 'center',
            render: (hh, params) => {
              const { tagNameList } = params.row
              return (
                <div>
                  { tagNameList.map(tagName => <div>{ tagName }</div>) }
                </div>
              )
            }
          }
        ]
        return columns
      }
    },
    methods: {
      isQualified (v) {
        return v.qualificationStatus === QUALIFICATION_STATUS.YES
      },
      isDisabled (v) {
        // 判断是否disabled，如果是并且在已选项中则去掉
        return v.isSale || !v.valid || +v.price <= 0 || +v.stock <= 0 || !this.isQualified(v)
      },
      disabledTip (v) {
        if (!this.isQualified(v)) {
          return v.qualificationTip
        }
        if (v.isSale) return '商品在售，不能重复添加'
        if (!v.valid) return '商品信息不全'
        if (+v.price <= 0) return '价格不能为空'
        if (+v.stock <= 0) return '库存不能为空'
      },
      handleItemChange (index, key, v) {
        const newList = this.productList.slice()
        const item = newList[index]
        item[key] = parseFloat(v) || 0
        this.productList = newList
        const disabled = this.isDisabled(item)
        if (disabled) {
          const index = this.selected.findIndex(id => v.id === id)
          if (index >= 0) {
            this.selected.splice(index, 1)
          }
        }
      },
      handleTagChange (tag) {
        this.tagCode = tag
      },
      // 单个选择
      handleSelect (v) {
        const _set = new Set(this.selected)
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
        const oldPage = { ...this.pagination }
        this.pagination = page
        if (this.selectedCount) {
          this.$Modal.open({
            title: '提示',
            content: `本页已选择${this.selectedCount}个药品，是否添加本页已选药品？`,
            onOk: () => {
              this.batchSubmit()
            },
            onCancel: () => {
              this.$nextTick(() => {
                this.pagination = oldPage
              })
            }
          })
        } else {
          this.fetchProductList()
        }
      },
      qualificationTip (item) {
        if (item.qualificationStatus === QUALIFICATION_STATUS.NO || item.qualificationStatus === QUALIFICATION_STATUS.EXP) {
          qualificationModal(item.qualificationTip)
        }
      },
      search () {
        this.pagination.current = 1
        this.selected = []
        this.fetchProductList()
      },
      async initCategory () {
        const tagList = await fetchGetMedicineTagList()
        this.tagList = [{ id: -1, name: '全部', appTagCode: '-1' }].concat(tagList)
      },
      async fetchProductList () {
        this.loading = true
        try {
          const postData = {
            name: this.name,
            upc: this.upc,
            permissionNumber: this.permissionNumber,
            pagination: this.pagination
          }
          if (this.tagCode > 0) {
            postData.categoryId = this.tagList.find(it => it.appTagCode === this.tagCode).id
            postData.tagCode = this.tagCode
          }
          const data = await fetchGetMedicineSpList(postData)
          this.loading = false
          this.productList = data.list || []
          this.hasAuditingData = !!data.hasAuditingData
          this.hasAuditingStatus = data.hasAuditingStatus
          Object.assign(this.pagination, data.pagination)
        } catch (e) {
          this.$Message.error(e.message || '网络请求失败，请稍后再试')
          this.loading = false
        }
      },
      // 批量生成
      batchSubmit () {
        this.submitting = true
        const spList = this.selected.map(id => {
          const sp = this.productList.find(p => p.id === id)
          return sp
        })
        fetchSubmitBatchSaveMedicineProductBySp(spList, poiId).then(data => {
          this.submitting = false
          if (data.value > 0) {
            this.$Message.success('批量生成成功')
            setTimeout(() => {
              this.$router.replace({ name: 'productList', query: { wmPoiId: poiId } })
            }, 500)
          } else {
            this.$toast.error('服务异常，批量生成失败')
          }
        }).catch(err => {
          this.submitting = false
          this.selected = []
          this.$Modal.info({
            content: err.message || '服务异常，批量生成失败'
          })
          this.fetchProductList()
        })
      }
    },
    mounted () {
      Object.assign(this, this.initParams || {})
      this.initCategory()
      this.fetchProductList()
    }
  }
</script>

<style scoped lang="less">
  .sp-table-container {
    padding: 20px 0 0;
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
      .product-name, .upc-code, .permission-number {
        width: 200px;
        height: 36px;
        margin-right: 10px;
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
      }
    }
    .manufaturer {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp:3;
      -webkit-box-orient: vertical;
      max-width: 150px;
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
      }
      .permission-number {
        margin: 6px 0;
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
