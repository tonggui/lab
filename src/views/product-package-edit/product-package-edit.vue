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
  import { PRODUCT_SELL_STATUS, QUALIFICATION_STATUS } from '@/data/enums/product'
  import qualificationModal from '@components/qualification-modal'
  import { fetchGetTagList } from '@/data/repos/category'
  import { poiId } from '@/common/constants'
  import { getPathById } from '@components/taglist/util'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    PRODUCT_DESCRIPTION,
    PRODUCT_LIMIT_SALE,
    PRODUCT_SELL_TIME,
    PRODUCT_LABEL,
    PRODUCT_FREIGHT_TEMPLATE
  } from '@/module/moduleTypes'
  import {
    // PRODUCT_PICTURE_CONTENT,
    PRODUCT_TAG_COUNT
  } from '@/module/subModule/product/moduleTypes'

  // TODO
  // - [DONE] 组包商品的选品组装逻辑
  // - [DONE] 编辑场景的页面逻辑分发(详情页面兜底逻辑，解决外部跳入的分发逻辑)
  // - [DONE] 表单各种功能需要添加白名单逻辑：限购、图文详情
  // - [DONE] 医药品类店铺，给予提示：一个组包商品中，最多有一种处方药；一个组包商品中，不能同时含有处方药和保健食品（一级商品类目为「营养保健」）；
  // - [DONE] 选择组包商品，取消候选需要删除已选商品组包列表；
  // - [DONE] 上架组包商品，包含SKU未上架，需要给出提示弹窗进行上架操作

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
        showLabel: PRODUCT_LABEL,
        showFreightTemplate: PRODUCT_FREIGHT_TEMPLATE
      }),
      ...mapModule('product', {
        // showPicContent: PRODUCT_PICTURE_CONTENT,
        maxTagCount: PRODUCT_TAG_COUNT
      }),
      modules () {
        // console.log(this.showSellTime, this.showFreightTemplate)
        return {
          sellTime: this.showSellTime,
          picContent: false,
          description: this.showDescription,
          maxTagCount: this.maxTagCount,
          limitSale: this.showLimitSale,
          labelList: this.showLabel,
          b2cSinglePoi: this.showFreightTemplate
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
        console.log('finally-confirm:', product)
        this.submitting = true
        try {
          await submitPackageProduct({ data: product })
          await this.showSmartTip(product)
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
      },
      async showSmartTip (product) {
        // 只响应创建场景
        if (this.spuId) return
        const hasOffShelf = product.productList.some(productUnit => productUnit.sellStatus !== PRODUCT_SELL_STATUS.ON)
        return new Promise(resolve => {
          this.$Message.success(hasOffShelf ? '您创建的组包商品为下架状态，因为含有下架商品' : '您创建的组包商品已上架')
          setTimeout(resolve, 2000)
        })
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
          try {
            this.product = await fetchGetPackageProductDetail({
              id: this.spuId, poiId
            })
          } catch (e) {
            // 组包商品链接加载普通商品，兜底策略
            if (e.code === 8306) {
              this.$router.replace({
                name: 'productEdit',
                query: this.$route.query
              })
            }
          }
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
