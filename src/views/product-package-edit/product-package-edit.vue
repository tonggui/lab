<template>
  <div>
    <Loading v-if="loading" />
    <ProductPackageForm
      v-else
      :modules="modules"
      :submitting="submitting"
      :spu-id="spuId"
      :tagList="tagList"
      :product="product"
      @on-confirm="handleConfirm"
      @cancel="handleCancel"
    />
    <PackageProductAgreement mode="sign" />
  </div>
</template>

<script>
  import PackageProductAgreement from '@/views/components/agreement/product-package'
  import ProductPackageForm from './components/form/form'
  import {
    submitPackageProduct,
    fetchGetPackageProductDetail
  } from '@/data/repos/packageProduct'
  import { QUALIFICATION_STATUS } from '@/data/enums/product'
  import qualificationModal from '@components/qualification-modal'
  import { fetchGetTagList } from '@/data/repos/category'
  import { poiId } from '@/common/constants'
  import { getPathById } from '@components/taglist/util'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    PRODUCT_DESCRIPTION,
    PRODUCT_LIMIT_SALE,
    PRODUCT_SELL_TIME,
    PRODUCT_LABEL
  } from '@/module/moduleTypes'
  import {
    PRODUCT_PICTURE_CONTENT, PRODUCT_TAG_COUNT
  } from '@/module/subModule/product/moduleTypes'

  // TODO
  // - 组包商品的选品组装逻辑
  // - 列表编辑页面需要检索所有异步操作流程
  // - 编辑场景的页面逻辑分发(详情页面兜底逻辑，解决外部跳入的分发逻辑)
  // - [DONE] 表单各种功能需要添加白名单逻辑：限购、图文详情

  export default {
    name: 'ProductPackageEdit',
    components: {
      ProductPackageForm,
      PackageProductAgreement
    },
    data () {
      return {
        visible: false,
        loading: false,
        submitting: false,
        product: {},
        tagList: [],
        selectedProductList: []
      }
    },
    computed: {
      spuId () {
        return +(this.$route.query.spuId || 0)
      },
      ...mapModule({
        showLimitSale: PRODUCT_LIMIT_SALE,
        showSellTime: PRODUCT_SELL_TIME,
        showDescription: PRODUCT_DESCRIPTION,
        showLabel: PRODUCT_LABEL
      }),
      ...mapModule('product', {
        showPicContent: PRODUCT_PICTURE_CONTENT,
        maxTagCount: PRODUCT_TAG_COUNT
      }),
      modules () {
        return {
          sellTime: this.showSellTime,
          picContent: this.showPicContent,
          description: this.showDescription,
          maxTagCount: this.maxTagCount,
          limitSale: this.showLimitSale,
          labelList: this.showLabel
        }
      }
    },
    methods: {
      fillTagByQuery () {
        const tagId = +this.$route.query.tagId
        const empty = !this.product.tagList || !this.product.tagList.length
        if (!this.spuId && tagId && this.needFillTagByQuery && empty) {
          const path = getPathById(tagId, this.tagList)
          if (path && path.length) {
            this.product = {
              ...this.product,
              tagList: [{ id: tagId, name: path.name }]
            }
          }
        }
      },
      async handleConfirm (product, context) {
        this.submitting = true
        try {
          await submitPackageProduct({ data: product })
          this.$tryToNext()
        } catch (err) {
          this.handleConfirmError(err, product, context)
        } finally {
          this.submitting = false
        }
      },
      handleConfirmError (err, product, context) {
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
            onOk: () => this.handleConfirm(product, { ...context, validType: 1015 })
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
        this.$tryToNext()
      }
    },
    async created () {
      const preAsyncTaskList = [
        fetchGetTagList(poiId)
      ]
      try {
        this.loading = true
        const [tagList] = await Promise.all(preAsyncTaskList)
        this.tagList = tagList
        if (this.spuId) {
          this.product = await fetchGetPackageProductDetail({
            id: this.spuId, poiId
          })
        } else {
          const newProduct = {}
          this.product = newProduct
          this.fillTagByQuery()
        }
        this.loading = false
      } catch (err) {
        this.loading = false
        console.error(err)
      }
    }
  }
</script>

<style scoped>

</style>
