<template>
  <div>
    <Form
      :changes="changes"
      :spu-id="spuId"
      :tagList="tagList"
      :poiType="poiType"
      :product="product"
      :modules="modules"
      :submitting="submitting"
      :categoryAttrSwitch="categoryAttrSwitch"
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
    PRODUCT_VIDEO,
    PRODUCT_SHORTCUT,
    SWITCH_SUGGEST_NOUPC,
    PRODUCT_SELL_TIME,
    PRODUCT_DESCRIPTION,
    PRODUCT_PICTURE_CONTENT,
    PRODUCT_TAG_COUNT
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  import { fetchGetPoiType } from '@/data/repos/poi'
  import { fetchGetProductDetailAndCategoryAttr, fetchSubmitEditProduct } from '@/data/repos/product'
  import { fetchGetCategoryAttrSwitch, fetchGetTagList } from '@/data/repos/category'
  import {
    fetchGetSpUpdateInfoById
  } from '@/data/repos/standardProduct'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'ProductEdit',
    inject: ['appState'],
    components: {
      Form
    },
    async created () {
      const preAsyncTaskList = [
        fetchGetCategoryAttrSwitch(poiId),
        fetchGetPoiType(poiId),
        fetchGetTagList(poiId)
      ]
      try {
        const [categoryAttrSwitch, poiType, tagList] = await Promise.all(preAsyncTaskList)
        this.categoryAttrSwitch = categoryAttrSwitch
        this.poiType = poiType
        this.tagList = tagList
        if (this.spuId) {
          this.product = await fetchGetProductDetailAndCategoryAttr(this.spuId, poiId, this.categoryAttrSwitch)
          // 暂时隐藏标品功能
          this.checkSpChangeInfo(this.spuId)
        }
      } catch (err) {
        console.error(err)
      }
    },
    data () {
      return {
        product: {},
        tagList: [],
        poiType: 1,
        changes: [],
        categoryAttrSwitch: false,
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
        showVideo: PRODUCT_VIDEO,
        showShortCut: PRODUCT_SHORTCUT,
        suggestNoUpc: SWITCH_SUGGEST_NOUPC,
        showSellTime: PRODUCT_SELL_TIME,
        showDescription: PRODUCT_DESCRIPTION,
        showPicContent: PRODUCT_PICTURE_CONTENT,
        maxTagCount: PRODUCT_TAG_COUNT
      }),
      modules () {
        let suggestNoUpc = false
        const { id, upcCode } = this.product
        const isCreate = !this.spuId
        if ((isCreate && this.suggestNoUpc) || (!isCreate && id && !upcCode)) {
          suggestNoUpc = true
        }
        return {
          hasStock: true,
          shortCut: this.showShortCut,
          sellTime: this.sellTime,
          picContent: this.showPicContent,
          description: this.showDescription,
          suggestNoUpc,
          packingbag: this.showPackBag,
          productVideo: this.showVideo,
          maxTagCount: this.maxTagCount,
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
            categoryAttrSwitch: this.categoryAttrSwitch,
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
            content: `
              <ul>
                <li>录入条码与包装上印制的条码不一致</li>
                <li>商品非正规厂商出产，或三无商品：无中文标明产品名称、生产厂厂名、厂址的国产或合资企业产品</li>
                <li>录入条码为店内编码，非通用条形码</li>
                <li>厂商未将条形码在中国物品编码中心（<a href="http://www.ancc.org.cn/" target="_blank">http://www.ancc.org.cn/</a>）备案</li>
                <li>录入条码不符合国际编码规则（国际编码规则：<a href="http://www.ancc.org.cn/Knowledge/BarcodeArticle.aspx?id=183" target="_blank">http://www.ancc.org.cn/Knowledge/BarcodeArticle.aspx?id=183</a>）
                </li>
              </ul>
            `
          })
          break
        case 1014:
          this.$Modal.error({
            icon: null,
            width: 520,
            title: '提示',
            content: `
              <div>
                保存失败，请上传“第二类医疗器械经营备案凭证”、“医疗器械经营许可证”任意一个资质，才允许售卖[避孕套]和[测孕试纸]商品。
                ${this.isBusinessClient ? `
                  <br /><br />
                  <div>请前往 <a href="/#/v2/shop/manage/businessQualification" target="_blank">店铺设置-门店管理-营业资质</a></div>
                ` : '<span>请联系商家上传相关资质</span>'}
              </div>
            `
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
