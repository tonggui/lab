<template>
  <div>
    <ProductCube v-if="showEntrance" :title="title" :description="description" />
    <!-- 注释：审核通过的引导文案：同城高销量商家告诉你：店内有库存商品大于 300 个会带来更多收入哦～ -->
    <Alert type="warning" v-if="showTips">
      <div>
        <Icon color="#F89800" style="margin-right: 8px;" size="14" local="horn" />
        {{ description }}
      </div>
    </Alert>
  </div>
</template>
<script>
  import ProductCube from './product-cube'
  import { mapModule } from '@/module/module-manage/vue'
  import { POI_PRODUCT_CUBE_INFO, POI_AUDIT_STATUS } from '@/module/moduleTypes'
  import { STATUS as AUDIT_STATUS } from '@/data/enums/poi'

  export default {
    name: 'product-cube-container',
    props: {
      totalProductCount: Number
    },
    computed: {
      ...mapModule({
        info: POI_PRODUCT_CUBE_INFO,
        status: POI_AUDIT_STATUS
      }),
      showEntrance () {
        return isFinite(this.totalProductCount) && this.totalProductCount > 0
      },
      showTips () {
        return !this.showEntrance && this.status === AUDIT_STATUS.PASSED
      },
      title () {
        return this.info.title
      },
      description () {
        return this.status === AUDIT_STATUS.PASSED ? this.info.description : ''
      }
    },
    components: {
      ProductCube
    }
  }
</script>
