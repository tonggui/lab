<template>
  <div>
    <Loading v-if="loading" />
    <Form
      v-else
      :changes="changes"
      :spu-id="spuId"
      :tagList="tagList"
      :poiType="poiType"
      :product="product"
      :modules="modules"
      :submitting="submitting"
      @on-confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script>
  import Form from '@/views/components/product-form/form'

  import { poiId } from '@/common/constants'
  import {
    PRODUCT_PACK_BAG,
    PRODUCT_SHORTCUT,
    SWITCH_SUGGEST_NOUPC,
    PRODUCT_SELL_TIME,
    PRODUCT_DESCRIPTION
  } from '@/module/moduleTypes'
  import {
    PROPERTY_LOCK,
    WEIGHT_REQUIRED,
    UPC_REQUIRED,
    PRODUCT_PICTURE_CONTENT,
    PRODUCT_TAG_COUNT,
    PRODUCT_VIDEO
  } from '@/module/subModule/product/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  import { fetchGetPoiType } from '@/data/repos/poi'
  import { fetchGetProductDetailAndCategoryAttr, fetchSubmitEditProduct } from '@/data/repos/product'
  import { fetchGetTagList } from '@/data/repos/category'
  import {
    fetchGetSpUpdateInfoById,
    fetchGetSpInfoById
  } from '@/data/repos/standardProduct'
  import { QUALIFICATION_STATUS } from '@/data/enums/product'
  import qualificationModal from '@/components/qualification-modal'
  import lx from '@/common/lx/lxReport'

  import { getPathById } from '@/components/taglist/util'

  export default {
    name: 'ProductEdit',
    inject: ['appState'],
    components: {
      Form
    },
    async created () {
      const preAsyncTaskList = [
        fetchGetPoiType(poiId),
        fetchGetTagList(poiId)
      ]
      try {
        this.loading = true
        const [poiType, tagList] = await Promise.all(preAsyncTaskList)
        this.poiType = poiType
        this.tagList = tagList
        this.loading = false
        if (this.spuId) {
          this.product = await fetchGetProductDetailAndCategoryAttr(this.spuId, poiId)
          // 暂时隐藏标品功能
          this.checkSpChangeInfo(this.spuId)
        } else {
          const { tagId, spId } = this.$route.query
          const newProduct = {}
          if (tagId) {
            const path = getPathById(+tagId, tagList)
            newProduct.tagList = [{ id: +tagId, name: path.name }]
          }
          if (spId) {
            const sp = await fetchGetSpInfoById(+spId, poiId)
            Object.assign(newProduct, sp, { spId: +spId, id: undefined }) // 新建没有商品id，sp的id是标品id
          }
          this.product = newProduct
        }
      } catch (err) {
        this.loading = false
        console.error(err)
      }
    },
    data () {
      return {
        loading: false,
        product: {},
        tagList: [],
        poiType: 1,
        changes: [],
        submitting: false
      }
    },
    computed: {
      spuId () {
        return +(this.$route.query.spuId || 0)
      },
      isBusinessClient () {
        return this.appState.isBusinessClient
      },
      ...mapModule({
        showPackBag: PRODUCT_PACK_BAG,
        showShortCut: PRODUCT_SHORTCUT,
        suggestNoUpc: SWITCH_SUGGEST_NOUPC,
        showSellTime: PRODUCT_SELL_TIME,
        showDescription: PRODUCT_DESCRIPTION
      }),
      ...mapModule('product', {
        propertyLock: PROPERTY_LOCK,
        weightRequired: WEIGHT_REQUIRED,
        upcRequired: UPC_REQUIRED,
        showPicContent: PRODUCT_PICTURE_CONTENT,
        maxTagCount: PRODUCT_TAG_COUNT,
        showVideo: PRODUCT_VIDEO
      }),
      modules () {
        const isBatch = !poiId
        let suggestNoUpc = false
        const { id, upcCode } = this.product
        const isCreate = !this.spuId
        if ((isCreate && this.suggestNoUpc) || (!isCreate && id && !upcCode)) {
          suggestNoUpc = true
        }
        return {
          hasSkuStock: true,
          hasSkuPrice: true,
          propertyLock: this.propertyLock,
          requiredMap: {
            weight: this.weightRequired,
            upc: this.upcRequired
          },
          shortCut: this.showShortCut,
          sellTime: this.showSellTime,
          picContent: this.showPicContent,
          spPicContent: true,
          description: this.showDescription,
          suggestNoUpc,
          packingBag: this.showPackBag,
          productVideo: this.showVideo && !isBatch, // 批量不支持视频
          maxTagCount: this.maxTagCount,
          showCellularTopSale: !isBatch,
          allowApply: true
        }
      }
    },
    methods: {
      async checkSpChangeInfo (spuId) {
        try {
          const changes = await fetchGetSpUpdateInfoById(spuId, poiId)
          if (changes && changes.length) {
            this.changes = changes
          }
        } catch (err) {
          console.error(err.message)
        }
      },
      async handleConfirm (product, context) {
        const { validType, spChangeInfoDecision = 0 } = context
        try {
          this.submitting = true
          await fetchSubmitEditProduct(product, {
            entranceType: this.$route.query.entranceType,
            dataSource: this.$route.query.dataSource,
            validType
          }, poiId)
          this.submitting = false
          // op_type 标品更新纠错处理，0表示没有弹窗
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 1, fail_reason: '', spu_id: this.spuId || 0 } })
          window.history.go(-1) // 返回
        } catch (err) {
          lx.mc({ bid: 'b_a3y3v6ek', val: { op_type: spChangeInfoDecision, op_res: 0, fail_reason: `${err.code}: ${err.message}`, spu_id: this.spuId || 0 } })
          this.handleConfirmError(err, product)
        }
        this.submitting = false
      },
      handleConfirmError (err, product) {
        const errorMessage = (err && err.message) || err || '保存失败'
        /* eslint-disable indent */
        switch (err.code) {
        case 1013:
          this.$Modal.error({
            icon: null,
            width: 520,
            title: '条码不合法，请核对是否存在以下几种情况',
            render: () => (
              <ul>
                <li>录入条码与包装上印制的条码不一致</li>
                <li>商品非正规厂商出产，或三无商品：无中文标明产品名称、生产厂厂名、厂址的国产或合资企业产品</li>
                <li>录入条码为店内编码，非通用条形码</li>
                <li>厂商未将条形码在中国物品编码中心（<a href="http://www.ancc.org.cn/" target="_blank">http://www.ancc.org.cn/</a>）备案</li>
                <li>录入条码不符合国际编码规则（国际编码规则：<a href="http://www.ancc.org.cn/Knowledge/BarcodeArticle.aspx?id=183" target="_blank">http://www.ancc.org.cn/Knowledge/BarcodeArticle.aspx?id=183</a>）
                </li>
              </ul>
            )
          })
          break
        case 1014:
          this.$Modal.error({
            icon: null,
            width: 520,
            title: '提示',
            render: () => (
              <div>
                保存失败，请上传“第二类医疗器械经营备案凭证”、“医疗器械经营许可证”任意一个资质，才允许售卖[避孕套]和[测孕试纸]商品。
                { this.isBusinessClient ? (
                  <div>
                    <br /><br />
                    <div>请前往 <a href="/#/v2/shop/manage/businessQualification" target="_blank">店铺设置-门店管理-营业资质</a></div>
                  </div>
                  ) : <span>请联系商家上传相关资质</span> }
              </div>
            )
          })
          break
        case 1015:
          this.$Modal.confirm({
            title: '提示',
            content: '检测到图片质量过差，将影响订单量和店铺排名，请重新上传',
            okText: '继续保存',
            okType: 'danger',
            cancelText: '去看看',
            onOk: () => this.handleConfirm(product, { validType: 1015 })
          })
          break
        case QUALIFICATION_STATUS.EXP:
        case QUALIFICATION_STATUS.NO:
          qualificationModal(errorMessage)
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
      }
    }
  }
</script>
