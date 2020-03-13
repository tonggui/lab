<template>
  <div class="sp-create">
    <AgreementModal v-model="showAgreementModal" mode="view" />
    <div class="top-tip">
      <Alert class="tip alert" type="error">请仔细核对标题/规格等是否与价格对应，避免造成损失，如有错误请修改</Alert>
      <Alert class="tip warning" type="warning" closable>
        商品库使用必读声明
        <span slot="close"><a @click.prevent.stop="showAgreementModal = true">去看看</a></span>
      </Alert>
    </div>
    <div class="panel">
      <div class="header">
        <div class="title">从商品库新建商品</div>
        <a class="back" @click.prevent="back">返回</a>
      </div>
      <div class="content">
        <SpList
          showTopSale
          footerFixed
          multiple
        />
      </div>
    </div>
  </div>
</template>

<script>
  import AgreementModal from '@/components/agreement-modal'
  import SpList from '@/views/components/sp-list'

  export default {
    name: 'sp-create',
    components: { AgreementModal, SpList },
    data () {
      return {
        showAgreementModal: false
      }
    },
    methods: {
      back () {
        this.$router.back()
      }
    }
  }
</script>

<style lang="less" scoped>
  @padding: 16px;
  .sp-create {
    .top-tip {
      position: sticky;
      top: 0;
      z-index: 10;
      .tip {
        margin-bottom: 0;
      }
    }
    .alert {
      color: @error-color;
      background: #fee;
    }
    .warning {
      background: #fef4d6;
    }
    .panel {
      background: #fff;
      box-shadow: 0 0 6px 0 @color-gray5;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fafafa;
        padding: @padding;
        font-size: @font-size-large;
        font-weight: bold;
      }
      .content {
        padding: 0 @padding;
        margin-bottom: 10px;
      }
    }
  }
</style>
