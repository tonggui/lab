<template>
  <router-view :name="type"></router-view>
</template>
<script>
  import { mapModule } from '@/module/module-manage/vue'
  import { PAGE_GRAY } from '@/module/moduleTypes'

  // TODO 页面灰度控制
  const grayMap = {
    '/product/edit': 'new_product_edit',
    '/medicine/product/edit': 'new_medicine_product_edit',
    '/sp/apply': 'new_sp_apply', // TODO
    '/batchManagement/batchCreate': 'new_batch_create_product',
    '/product/auditCheck': 'new_product_audit_check'
  }

  export default {
    name: 'gray-router-view',
    computed: {
      ...mapModule({
        pageGray: PAGE_GRAY
      }),
      type () {
        const route = this.$router.match(window.location.pathname)

        if (grayMap[route.path]) {
          const gray = this.pageGray[grayMap[route.path]]
          return gray ? 'gray' : 'default'
        }
        return 'default'
      }
    }
  }
</script>
