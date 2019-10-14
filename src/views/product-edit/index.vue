<template>
  <div>
    <Form
      :changes="changes"
      :spu-id="spuId"
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
  import withAsyncTask from '@/hoc/withAsyncTask'
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

  import {
    fetchSaveOrUpdateProduct
  } from '@/data/repos/merchantProduct'
  import { fetchGetProductDetailAndCategoryAttr } from '@/data/repos/product'
  import { fetchGetCategoryAttrSwitch, fetchGetTagList } from '@/data/repos/category'
  import {
    fetchGetSpUpdateInfoById
  } from '@/data/repos/standardProduct'
  import lx from '@/common/lx/lxReport'

  const preAsyncTask = () => {
    return fetchGetTagList(poiId)
  }

  export default {
    name: 'ProductEdit',
    components: {
      Form: withAsyncTask(preAsyncTask, {
        loadingOptions: {
          props: {
            fix: true,
            size: 'large'
          }
        },
        mapper: (keys, data) => {
          return {
            tagList: data
          }
        },
        initData: []
      })(Form)
    },
    async created () {
      const spuId = +(this.$route.query.spuId || 0)
      this.categoryAttrSwitch = await fetchGetCategoryAttrSwitch(poiId)
      if (spuId) {
        this.spuId = spuId
        this.product = await fetchGetProductDetailAndCategoryAttr(spuId, poiId, this.categoryAttrSwitch)
        // 暂时隐藏标品功能
        this.checkSpChangeInfo(spuId)
      }
    },
    data () {
      return {
        product: {},
        spuId: undefined,
        changes: [],
        categoryAttrSwitch: false,
        submitting: false
      }
    },
    computed: {
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
        return {
          hasStock: true,
          shortCut: this.showShortCut,
          sellTime: this.sellTime,
          picContent: this.showPicContent,
          description: this.showDescription,
          suggestNoUpc: this.suggestNoUpc,
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
          const changes = await fetchGetSpUpdateInfoById(spuId)
          if (changes && changes.length) {
            this.changes = changes
          }
        } catch (err) {
          console.error(err.message)
        }
      },
      async handleConfirm (product) {
        try {
          this.submitting = true
          await fetchSaveOrUpdateProduct(product)
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
