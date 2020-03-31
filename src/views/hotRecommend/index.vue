<template>
  <div class="hot-recommend">
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
          新店必建商品
        </div>
        <a class="back" @click.prevent="back" v-mc="{ bid: 'b_qmf6hlpk' }">返回</a>
      </div>
      <div class="content">
        <SpTable
          multiple
          footerFixed
          :fetch-data="fetchHotRecommendSpList"
          :fetch-category="getHotRecommendCategory"
          @on-select-product="handleSelectProduct"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import AgreementModal from '@/components/agreement-modal'
  import SpTable from '@/views/components/sp-list/sp-table'
  import { fetchHotRecommendSpList } from '@/data/repos/standardProduct'
  import { getHotRecommendCategory } from '@/data/repos/category'

  export default {
    name: 'HotRecommend',
    components: { AgreementModal, SpTable },
    data () {
      return {
        showAgreementModal: false
      }
    },
    methods: {
      fetchHotRecommendSpList,
      getHotRecommendCategory,
      handleSelectProduct (product) {
        this.$router.push({
          name: 'productEdit',
          query: {
            wmPoiId: this.$route.query.wmPoiId,
            spId: product.id,
            from: 'new',
            tagId: -1
          }
        })
      },
      back () {
        this.$router.back()
      }
    }
  }
</script>

<style lang="less" scoped>
  @padding: 16px;
  .hot-recommend {
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
