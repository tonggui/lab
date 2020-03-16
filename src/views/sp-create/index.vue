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
        <div class="title">
          从商品库新建商品
          <span v-if="hasHotRecommend" class="hot-link">根据您经营的品类，为您推荐了必建商品，可快速新建多个商品，<a v-mc="{ bid: 'b_vxx5rflb' }" @click.prevent="goToHotRecommend">请戳这里&gt;&gt;</a></span>
        </div>
        <a class="back" @click.prevent="back">返回</a>
      </div>
      <div class="content">
        <SpList
          showTopSale
          footerFixed
          multiple
          @on-select-product="handleSelectProduct"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import AgreementModal from '@/components/agreement-modal'
  import SpList from '@/views/components/sp-list'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    POI_HOT_RECOMMEND
  } from '@/module/moduleTypes'

  export default {
    name: 'sp-create',
    components: { AgreementModal, SpList },
    data () {
      return {
        showAgreementModal: false
      }
    },
    computed: {
      ...mapModule({
        hasHotRecommend: POI_HOT_RECOMMEND
      })
    },
    methods: {
      handleSelectProduct (product) {
        this.$router.push({ name: 'productEdit', query: { wmPoiId: this.$route.query.wmPoiId, spId: product.id, from: 'new', tagId: -1 } })
      },
      goToHotRecommend () {
        this.$router.push({ name: 'hotRecommend', query: { wmPoiId: this.$route.query.wmPoiId } })
      },
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
        .hot-link {
          font-size: @font-size-base;
          margin-left: 10px;
        }
      }
      .content {
        padding: 0 @padding;
        margin-bottom: 10px;
      }
    }
  }
</style>
