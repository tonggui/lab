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
      <div class="note">商品提报的结果会给您发送消息，敬请留意</div>
      <div class="field" :class="{ error: submitError && !name }">
        <span class="label required">商品名称</span>
        <span class="content">
          <Input v-model="name" placeholder="品牌（无品牌可不写）+品名+规格，如农夫山泉天然水 550ml*1瓶" :maxlength="30" />
          <div class="error-msg">商品名称不能为空</div>
        </span>
      </div>
      <div class="field" :class="{ error: submitError && !isPictureValid }">
        <span class="label required">商品图片</span>
        <div class="content">
          <ProductPicture
            style="margin-top: 5px"
            :value="pictureList"
            :keywords="name"
            :max="3"
            :tips="pictureTips"
            :tags="[]"
            :requiredIndex="[2]"
            @change="handlePicChange"
          />
          <ul class="requirement">
            图片要求:
            <li>1. 商品<span class="alert">居中完整</span>，周边<span class="alert">留白</span>；商品平行于底边，无“牛皮癣”（logo、水印、促销标识等）；</li>
            <li>2. <span class="alert">明亮、光线充足</span>的地方，<span class="alert">背景为白色</span>，也可使用多张A4至搭建简易背景；</li>
            <li>3. 建议上传2-3张（须包含带条码商品图），第一张正面，第二张背面详情图，第三张包含商品条码。</li>
          </ul>
          <div class="error-msg" style="margin-left: -90px">请按要求上传商品图</div>
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
        pictureList: ['', '', '']
      }
    },
    computed: {
      pictureTips () {
        return ['商品正面图', '商品背面详情页图', '带条码面的商品图']
      },
      isPictureValid () {
        return !!this.pictureList && !!this.pictureList[2] && this.pictureList.filter(v => !!v).length >= 2
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
        const { name, isPictureValid, pictureList } = this
        this.submitError = !name || !isPictureValid
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
        this.pictureList = ['', '', '']
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
      ul.requirement {
        list-style: none;
        margin: 5px 0 10px -90px;
        li {
          line-height: 1.5;
          margin: 5px 0;
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
    .alert {
      color: @text-red;
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
