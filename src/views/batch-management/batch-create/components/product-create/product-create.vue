<template>
  <OrderFormItem label="填写表格" :index="index + 1">
    <ProductForm
      :modules="modules"
      :product="product"
      @on-confirm="handleConfirm"
    >
      <template v-slot:footer="{ confirm }">
        <StickyFooter
          size="normal"
          :btnTexts="['新建商品并发布']"
          :btnProps="[{ loading: submitting }]"
          :bid="['b_ioddoq3c']"
          @on-click="() => handleFooterClick(confirm)"
        />
      </template>
    </ProductForm>
  </OrderFormItem>
</template>
<script>
  import OrderFormItem from '@components/order-form-item'
  import ProductForm from '@/views/components/product-form/form'
  import StickyFooter from '@/components/sticky-footer'
  import { fetchSubmitBatchCreateByProduct } from '@/data/repos/batch'
  import { QUALIFICATION_STATUS } from '@/data/enums/product'
  import qualificationModal from '@/components/qualification-modal'
  import { uuid } from '@utiljs/guid'

  export default {
    name: 'batch-product-create',
    props: {
      index: {
        type: Number,
        default: 0
      },
      poiIdList: Array,
      modules: Object
    },
    components: {
      OrderFormItem,
      ProductForm,
      StickyFooter
    },
    data () {
      return {
        product: {},
        submitting: false
      }
    },
    methods: {
      async handleConfirm (product, context) {
        this.submitting = true
        try {
          await fetchSubmitBatchCreateByProduct({
            product,
            poiIdList: this.poiIdList,
            context,
            extra: {
              biz: product.spId ? '单个商品搜索新建批量生成（跨店）' : '单个商品手动新建批量生成（跨店）',
              traceId: uuid()
            }
          })
          this.$emit('submit')
        } catch (err) {
          this.handleConfirmError(err, product)
        }
        this.submitting = false
      },
      handleConfirmError (err, product) {
        const errorMessage = (err && err.message) || err || '新建失败'
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
      },
      handleFooterClick (cb) {
        if (this.poiIdList.length <= 0) {
          this.$Message.error('请先选择目标门店')
          return
        }
        cb()
      }
    }
  }
</script>
