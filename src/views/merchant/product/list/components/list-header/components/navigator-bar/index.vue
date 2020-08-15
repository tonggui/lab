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
  import { KEYS } from '@/views/merchant/batch-management/menus'
  import {
    fetchGetPoiAuditProductCount
  } from '@/data/repos/merchantPoi'

  export default {
    name: 'merchant-product-list-navigator-bar',
    data () {
      return {
        auditProductCount: 0
      }
    },
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
              name: KEYS.CREATE
            },
            order: 1
          },
          batchModify: {
            show: true,
            link: {
              name: KEYS.MODIFY
            },
            order: 2
          },
          batchUpload: {
            show: true,
            link: {
              name: KEYS.UPLOAD_IMAGE
            },
            order: 4
          },
          batchRel: {
            show: true,
            order: 3
          },
          audit: {
            show: true,
            link: {
              path: '/merchant/product/auditList'
            },
            badge: this.auditProductCount
          }
        }
      }
    },
    components: {
      HeaderBar
    },
    mounted () {
      this.getAuditProductCount()
    },
    methods: {
      async getAuditProductCount () {
        let count = 0
        try {
          count = await fetchGetPoiAuditProductCount()
        } catch (err) {
          console.error(err)
        }
        this.auditProductCount = count
      }
    }
  }
</script>
