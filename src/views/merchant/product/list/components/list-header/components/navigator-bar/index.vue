<template>
  <HeaderBar :module-map="moduleMap" />
</template>
<script>
  import HeaderBar from '@/components/header-bar'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    UNAPPROVE_PRODUCT_COUNT,
    BUSINESS_MEDICINE // TODO 药品兼容 后期优化
  } from '@/module/moduleTypes'

  export default {
    name: 'merchant-product-list-navigator-bar',
    computed: {
      ...mapModule({
        unApproveProductCount: UNAPPROVE_PRODUCT_COUNT,
        isMedcine: BUSINESS_MEDICINE
      }),
      moduleMap () {
        return {
          createProduct: {
            show: !this.isMedcine,
            link: '/merchant/product/edit'
          },
          unApproveProduct: {
            show: true,
            badge: {
              count: this.unApproveProductCount,
              overflowCount: 999
            },
            tooltip: {
              type: 'guide',
              content: '分店新增商品，临时放在待收录',
              keyName: 'UNAPPROVE_PRODUCT_ENTRANCE_TIP'
            }
          },
          taskProgress: true,
          merchantProductConfig: true,
          batchOperation: true,
          batchCreate: {
            show: true,
            link: {
              path: '/merchant/batchManagement/batchCreate'
            }
          },
          batchModify: {
            show: true,
            link: {
              path: '/merchant/batchManagement/batchModify'
            }
          }
        }
      }
    },
    components: {
      HeaderBar
    }
  }
</script>
