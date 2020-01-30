<template>
  <Drawer
    title="商品上报"
    width="50%"
    :value="value"
    :mask-closable="false"
    @input="handleInput"
  >
    <div class="product-apply">
      <div>请输入下列商品信息后，上报给我们，我们将尽快为您审核处理。</div>
      <div class="note">审核通过后我们会通知您，您即可创建该商品</div>
      <div class="field" :class="{ error: submitError && !name }">
        <span class="label required">标准品名</span>
        <span class="content">
          <Input v-model="name" placeholder="请输入商品名称" />
          <div class="error-msg">商品名称不能为空</div>
        </span>
      </div>
      <div class="field" :class="{ error: submitError && !pictureList.length }">
        <span class="label required">商品图片</span>
        <div class="content">
          <div class="note" style="margin-top: 10px">图片上传要求图片要求白底，图片支持1:1（600px * 600px）/ 4:3（600 * 450px）</div>
          <ProductPicture
            :value="pictureList"
            :keywords="name"
            :max="5"
            :tags="[]"
            :showDescription="false"
            :keepSpot="false"
            @change="handlePicChange"
          />
          <div class="error-msg">商品图片不能为空</div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <Button size="large" @click="cancel" style="margin-right: 10px;">取消</Button>
      <Button size="large" type="primary" @click="confirm" :loading="submitting">提交</Button>
    </template>
  </Drawer>
</template>
<script>
  import ProductPicture from '@/components/product-picture'
  import { fetchSubmitApplyProduct } from '@/data/repos/product'

  export default {
    name: 'product-apply',
    components: { ProductPicture },
    props: {
      value: Boolean
    },
    data () {
      return {
        submitting: false,
        submitError: false,
        name: '',
        pictureList: []
      }
    },
    methods: {
      handleInput (v) {
        this.$emit('input', v)
      },
      handlePicChange (v) {
        this.pictureList = v
      },
      confirm () {
        const { name, pictureList } = this
        this.submitError = !name || !pictureList.length
        if (!this.submitError) {
          this.submitting = true
          fetchSubmitApplyProduct(name, pictureList).then(() => {
            this.$Message.success('商品上报成功!<br>我们会在1-2天内通知您审核结果')
            this.handleInput(false)
            this.reset()
          }).catch(err => {
            this.$Message.warning(err.message || '商品上报失败，请稍后重试')
          }).finally(() => {
            this.submitting = false
          })
        }
      },
      cancel () {
        this.handleInput(false)
        this.reset()
      },
      reset () {
        this.submitError = false
        this.name = ''
        this.pictureList = []
      }
    }
  }
</script>

<style lang="less" scoped>
  .product-apply {
    font-size: @font-size-base;
    & > div {
      margin: 5px 0;
      display: flex;
    }
    .field {
      margin: 20px 0;
      &.error {
        .error-msg {
          display: block;
        }
        /deep/ .boo-input {
          border-color: @text-red;
        }
      }
    }
    .note {
      font-size: @font-size-small;
      color: @text-description-color;
    }
    .label {
      position: relative;
      margin: 8px 10px 0 0;
      width: 80px;
      &.required:after {
        position: absolute;
        content: '*';
        display: inline-block;
        margin-left: 2px;
        line-height: 1;
        font-size: 12px;
        top: 2px;
        color: @text-red;
      }
    }
    .error-msg {
      display: none;
      color: @text-red;
      margin-top: 5px;
    }
    .content {
      flex: 1;
    }
  }
</style>
