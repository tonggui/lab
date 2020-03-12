<template>
  <div>
    <Form
      :changes="changes"
      :spu-id="spuId"
      :product="product"
      :modules="modules"
      :submitting="submitting"
      :ignoreSuggestCategoryId="ignoreSuggestCategoryId"
      :suggestNoUpc="suggestNoUpc"
      @on-confirm="handleConfirm"
      @cancel="handleCancel"
    />
    <PoiSelectDrawer
      title="关联门店"
      :value="drawerVisible"
      :queryPoiList="fetchGetPoiList"
      :fetch-poi-list-by-ids="fetchPoiListByIdList"
      @on-confirm="handlePoiSelected"
      @on-visible-change="handlePoiDrawerVisibleChange"
    />
  </div>
</template>

<script>
  import withAsyncTask from '@/hoc/withAsyncTask'
  import Form from '@/views/components/product-form/form'
  import PoiSelectDrawer from '@/views/components/poi-select/poi-select-drawer'
  import { PRODUCT_LIMIT_SALE } from '@/module/moduleTypes'
  import {
    PROPERTY_LOCK,
    WEIGHT_REQUIRED,
    UPC_REQUIRED,
    PRODUCT_PICTURE_CONTENT,
    PRODUCT_TAG_COUNT,
    PRODUCT_VIDEO
  } from '@/module/subModule/product/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  import {
    fetchGetPoiList
  } from '@/data/repos/merchantPoi'
  import {
    fetchGetPoiInfoListByIdList
  } from '@/data/repos/poi'

  import { fetchGetTagList } from '@/data/repos/merchantCategory'
  import {
    fetchGetProductDetail,
    fetchGetSpChangeInfo,
    fetchGetCategoryAppealInfo,
    fetchSaveOrUpdateProduct
  } from '@/data/repos/merchantProduct'
  import lx from '@/common/lx/lxReport'

  const REL_TEXT = '关联门店'
  const NO_REL_TEXT = '暂不关联'

  export default {
    name: 'MerchantProductEdit',
    components: {
      PoiSelectDrawer,
      Form: withAsyncTask(fetchGetTagList, {
        Loading: 'Loading',
        mapper: (keys, data) => ({ tagList: data || [] }),
        initData: []
      })(Form)
    },
    async created () {
      if (this.spuId) {
        fetchGetCategoryAppealInfo(this.spuId).then(categoryAppealInfo => {
          if (categoryAppealInfo && categoryAppealInfo.suggestCategoryId) {
            this.ignoreSuggestCategoryId = categoryAppealInfo.suggestCategoryId
          }
        })
        this.product = await fetchGetProductDetail(this.spuId)
      }
    },
    data () {
      return {
        drawerVisible: false,
        product: {},
        changes: [],
        ignoreSuggestCategoryId: null,
        submitting: false
      }
    },
    computed: {
      spuId () {
        return +(this.$route.query.spuId || 0)
      },
      ...mapModule({
        showLimitSale: PRODUCT_LIMIT_SALE
      }),
      ...mapModule('product', {
        propertyLock: PROPERTY_LOCK,
        weightRequired: WEIGHT_REQUIRED,
        upcRequired: UPC_REQUIRED,
        showPicContent: PRODUCT_PICTURE_CONTENT,
        maxTagCount: PRODUCT_TAG_COUNT,
        showVideo: PRODUCT_VIDEO
      }),
      suggestNoUpc () {
        return false
      },
      modules () {
        return {
          disabledExistSkuColumnMap: {
            price: true,
            stock: true
          },
          propertyLock: this.propertyLock,
          requiredMap: {
            weight: this.weightRequired,
            upc: this.upcRequired
          },
          shortCut: true,
          sellTime: true,
          picContent: this.showPicContent,
          description: true,
          suggestNoUpc: false,
          productVideo: false,
          packingBag: true,
          maxTagCount: this.maxTagCount,
          showCellularTopSale: false,
          allowSuggestCategory: true,
          limitSale: this.showLimitSale,
          allowBrandApply: true,
          allowAttrApply: false
        }
      }
    },
    methods: {
      fetchGetPoiList (params) {
        return fetchGetPoiList(params.name, params.pagination, params.city)
      },
      async checkSpChangeInfo (spuId) {
        try {
          const changes = await fetchGetSpChangeInfo(spuId)
          if (changes && changes.length) {
            this.changes = changes
          }
        } catch (err) {
          console.error(err.message)
        }
      },
      async fetchPoiListByIdList (poiIdList) {
        const data = await fetchGetPoiInfoListByIdList(this.$route.query.routerTagId, poiIdList)
        return data
      },
      confirmEdit (product) {
        const poiIds = product.poiIds
        return new Promise((resolve, reject) => {
          if (!poiIds || poiIds.length === 0) {
            resolve()
          } else {
            this.$Modal.confirm({
              title: '提示',
              content: `此商品关联了${poiIds.length}个门店，修改后将同步给所有关联的门店，是否确认保存？`,
              okText: '确认',
              cancelText: '取消',
              onOk: () => resolve(),
              onCancel: () => reject(new Error('cancel'))
            })
          }
        })
      },
      confirmSyncPois () {
        return new Promise((resolve, reject) => {
          this.$Modal.confirm({
            title: '提示',
            content: '是否将此商品关联到下属门店',
            okText: REL_TEXT,
            cancelText: NO_REL_TEXT,
            transitionNames: [],
            onOk: () => resolve(true),
            onCancel: () => resolve(false)
          })
        })
      },
      chooseSyncPois (product) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.drawerVisible = true
          }, 300)
          this.poiSelectCallback = (err, pois) => {
            if (pois) {
              resolve(pois)
            } else {
              reject(err)
            }
          }
        })
      },
      async handleConfirm (product, context) {
        try {
          if (!this.spuId) { // 新建
            const result = await this.confirmSyncPois()
            lx.mc({ bid: 'b_shangou_online_e_3u7qc7ro_mc', val: { button_nm: result ? REL_TEXT : NO_REL_TEXT } })
            if (result) {
              const pois = await this.chooseSyncPois(product)
              product.poiIds = pois.map(poi => poi.id)
            }
          } else { // 编辑
            await this.confirmEdit(product)
          }
        } catch { return }
        try {
          const { ignoreSuggestCategory, suggestCategoryId } = context
          this.submitting = true
          await fetchSaveOrUpdateProduct(product, {
            ignoreSuggestCategory,
            suggestCategoryId
          })
          // op_type 标品更新纠错处理，0表示没有弹窗
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: 0, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
          window.history.go(-1) // 返回
        } catch (err) {
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: 0, op_res: 0, fail_reason: err.message, spu_id: this.spuId || 0 } })
          this.handleConfirmError(err)
        }
        this.submitting = false
      },
      handleConfirmError (err) {
        const errorMessage = (err && err.message) || err || '保存失败'
        /* eslint-disable indent */
        switch (err.code) {
        case 1013:
          this.$Modal.error({
            icon: null,
            width: 520,
            title: '条码不合法，请核对是否存在以下几种情况',
            content: err.message
          })
          break
        default:
          if (this.onConfirmError) {
            this.onConfirmError(err)
          } else {
            this.$Message.error(errorMessage)
          }
          break
        }
        /* eslint-enable indent */
      },
      handleCancel () {
        window.history.go(-1)
      },
      handlePoiSelected (pois) {
        lx.mc({ bid: 'b_shangou_online_e_f4nwywyw_mc' })
        if (this.poiSelectCallback) {
          this.poiSelectCallback(null, pois)
        }
        this.poiSelectCallback = null
      },
      handlePoiDrawerVisibleChange (visible) {
        this.drawerVisible = visible
        if (!visible && this.poiSelectCallback) {
          this.poiSelectCallback()
          this.poiSelectCallback = null
        }
      }
    }
  }
</script>
