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
    '/sp/apply': 'new_sp_apply',
    '/batchManagement/batchCreate': 'new_batch_create_product',
    '/product/auditCheck': 'new_product_audit_check',
    '/product/auditEdit': 'new_product_audit_check'
  }

  export default {
    name: 'gray-router-view',
    data () {
      return {
        type: 'default'
      }
    },
    watch: {
      '$route': {
        immediate: true,
        handler () {
          let type = 'default'
          if (this.$route.query.gray === '0') {
            return type
          }
          const route = this.$router.match(window.location.pathname)
          console.log('route', route, this.$router.options.base)
          const base = this.$router.options.base || ''
          const relativePath = route.path.replace(base, '')
          if (grayMap[relativePath]) {
            const gray = this.pageGray[grayMap[relativePath]]
            type = gray ? 'gray' : 'default'
          }
          this.type = type
        }
      }
    },
    computed: {
      ...mapModule({
        pageGray: PAGE_GRAY
      })
      // type () {
      //   const route = this.$router.match(window.location.pathname)
      //   console.log('route', route)

      //   if (grayMap[route.path]) {
      //     const gray = this.pageGray[grayMap[route.path]]
      //     return gray ? 'gray' : 'default'
      //   }
      //   return 'default'
      // }
    }
  }
</script>
