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
        <div class="header-extras">
          <a
            v-if="isMedicine && medicineSpApplyEnabled"
            @click.prevent="gotoApplyStandardProduct"
            v-mc="{ bid: 'b_shangou_online_e_yfmnn4wy_mc' }"
          >创建商品到商品库</a>
          <a class="back" @click.prevent="back" v-mc="{ bid: 'b_qmf6hlpk' }">返回</a>
        </div>
      </div>
      <div class="content">
        <MedicineSpList v-if="isMedicine" footerFixed :init-params="query">
          <template v-if="medicineSpApplyEnabled" #empty="{ hasAuditingData }">
            <Empty v-if="hasAuditingData">
              <template v-slot:description>
                <span style="color: red">该标品信息已经在审核中，请勿重复提交~</span>
              </template>
            </Empty>
            <Empty
              v-else
              description="商品库中未找到您要新建的商品"
            >
              <Button
                type="primary"
                @click="gotoApplyStandardProduct"
                v-mc="{ bid: 'b_shangou_online_e_snibm1y0_mc' }"
              >创建商品到商品库</Button>
            </Empty>
          </template>
        </MedicineSpList>
        <SpList
          v-else
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
  import pick from 'lodash/pick'
  import AgreementModal from '@/components/agreement-modal'
  import Empty from '@/components/empty'
  import SpList from '@/views/components/sp-list'
  import MedicineSpList from '@/views/components/sp-list/medicine-sp-list'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    BUSINESS_MEDICINE,
    POI_HOT_RECOMMEND,
    MEDICINE_SP_APPLY
  } from '@/module/moduleTypes'

  export default {
    name: 'sp-create',
    components: { AgreementModal, SpList, MedicineSpList, Empty },
    data () {
      return {
        query: this.$route.query || {},
        showAgreementModal: false
      }
    },
    computed: {
      ...mapModule({
        isMedicine: BUSINESS_MEDICINE,
        hasHotRecommend: POI_HOT_RECOMMEND,
        medicineSpApplyEnabled: MEDICINE_SP_APPLY
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
      },
      gotoApplyStandardProduct () {
        this.$router.push({
          name: 'spApply',
          query: pick(this.$route.query, ['wmPoiId'])
        })
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

        .header-extras {
          > * {
            margin-left: 16px;
          }
        }
      }
      .content {
        padding: 0 @padding;
        margin-bottom: 10px;
      }
    }
  }
</style>
